#!/usr/bin/env python3
"""Autonomous LoRA test-run pipeline for the Ballad of Brutus style LoRA.

Phases: download the cleaned dataset chunks (Drive, public links) -> verify
each chunk hash -> reassemble -> verify final zip hash/size -> unpack ->
verify exact image count -> install deps -> download SDXL ckpt -> WD14 tag
-> prepend trigger -> train 2000 steps (samples every 500) -> upload
artifacts -> report everything to the webhook -> exit (0 = done, 1 = failed).
Idempotent: if /workspace/DONE exists, reports already-complete and sleeps.

Dataset: lora_cleaned_v1.zip - 6,221 images, shipped as 1 GiB chunks because
Drive's web download chokes on single multi-GB files. Every image in the
final set was personally visually reviewed (2026-09-20): profile pages, lore
pages and text-heavy pages removed across all score bands; 2 exact byte-
identical duplicates deduplicated (lower-numbered copy kept). 12 narrow book
spines (short side <512px) and 351 text pages were excluded before scoring.
Full per-file removal manifest: REMOVAL_MANIFEST_FINAL.md in the dataset dir.
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import traceback
import urllib.request

HOOK = "https://webhook.site/f1a78e44-0fac-4e78-8a27-a6341a12cf0d"
WORK = "/workspace"
LOG = os.path.join(WORK, "logs", "pipeline.log")
os.makedirs(os.path.join(WORK, "logs"), exist_ok=True)

# ---- dataset chunk manifest (filled at packaging time) ----
CHUNK_SIZE = 1073741824  # 1 GiB; last chunk may be smaller
CHUNK_NAMES = [
    "lora_cleaned_v1.zip.p00",
    "lora_cleaned_v1.zip.p01",
    "lora_cleaned_v1.zip.p02",
    "lora_cleaned_v1.zip.p03",
    "lora_cleaned_v1.zip.p04",
    "lora_cleaned_v1.zip.p05",
    "lora_cleaned_v1.zip.p06",
    "lora_cleaned_v1.zip.p07",
    "lora_cleaned_v1.zip.p08",
    "lora_cleaned_v1.zip.p09",
    "lora_cleaned_v1.zip.p10",
    "lora_cleaned_v1.zip.p11",
    "lora_cleaned_v1.zip.p12",
    "lora_cleaned_v1.zip.p13",
    "lora_cleaned_v1.zip.p14",
    "lora_cleaned_v1.zip.p15",
    "lora_cleaned_v1.zip.p16",
    "lora_cleaned_v1.zip.p17",
    "lora_cleaned_v1.zip.p18",
    "lora_cleaned_v1.zip.p19",
    "lora_cleaned_v1.zip.p20",
    "lora_cleaned_v1.zip.p21",
    "lora_cleaned_v1.zip.p22",
    "lora_cleaned_v1.zip.p23",
    "lora_cleaned_v1.zip.p24",
    "lora_cleaned_v1.zip.p25",
    "lora_cleaned_v1.zip.p26",
    "lora_cleaned_v1.zip.p27",
    "lora_cleaned_v1.zip.p28",
    "lora_cleaned_v1.zip.p29",
    "lora_cleaned_v1.zip.p30",
    "lora_cleaned_v1.zip.p31",
    "lora_cleaned_v1.zip.p32",
    "lora_cleaned_v1.zip.p33",
    "lora_cleaned_v1.zip.p34",
    "lora_cleaned_v1.zip.p35",
    "lora_cleaned_v1.zip.p36",
    "lora_cleaned_v1.zip.p37",
    "lora_cleaned_v1.zip.p38",
    "lora_cleaned_v1.zip.p39",
    "lora_cleaned_v1.zip.p40",
    "lora_cleaned_v1.zip.p41",
    "lora_cleaned_v1.zip.p42",
    "lora_cleaned_v1.zip.p43",
    "lora_cleaned_v1.zip.p44",
    "lora_cleaned_v1.zip.p45",
    "lora_cleaned_v1.zip.p46",
    "lora_cleaned_v1.zip.p47",
    "lora_cleaned_v1.zip.p48",
    "lora_cleaned_v1.zip.p49",
    "lora_cleaned_v1.zip.p50",
    "lora_cleaned_v1.zip.p51",
    "lora_cleaned_v1.zip.p52",
    "lora_cleaned_v1.zip.p53",
    "lora_cleaned_v1.zip.p54",
    "lora_cleaned_v1.zip.p55",
    "lora_cleaned_v1.zip.p56",
    "lora_cleaned_v1.zip.p57",
    "lora_cleaned_v1.zip.p58",
    "lora_cleaned_v1.zip.p59",
    "lora_cleaned_v1.zip.p60",
    "lora_cleaned_v1.zip.p61",
    "lora_cleaned_v1.zip.p62",
    "lora_cleaned_v1.zip.p63",
]
CHUNK_IDS = [
    "175DvuzLRvu7_PX5A2jbQbE6lfDMI7fsS",  # lora_cleaned_v1.zip.p00
    "1hFYdDvhHoPhj3ix5iPhExTM6iVi-DMeO",  # lora_cleaned_v1.zip.p01
    "1W73tYZFkRu1JUMeuu4iK9IOHTS1bdKuF",  # lora_cleaned_v1.zip.p02
    "1Axc52HM2VsBInmze-XtlFfS1avyS2e5Y",  # lora_cleaned_v1.zip.p03
    "1ggQhRlc7c08E-v4qmryWaLm0I2Mo6wuk",  # lora_cleaned_v1.zip.p04
    "1EHK-S-EozoC0GerVSVKIID7eFfZeHOdJ",  # lora_cleaned_v1.zip.p05
    "1ePsYTcl2miVezMB1fPkMpK2dm4nVNjVU",  # lora_cleaned_v1.zip.p06
    "1kAJ8mSta7RFBm_3jdY90kwO1fj5EAH_6",  # lora_cleaned_v1.zip.p07
    "1i7z2w4Pl-GjZTZThE7eYB0G1u-0dIcFl",  # lora_cleaned_v1.zip.p08
    "1ulQCvBh9eBul0hrKqZZF3lp3FvmKX30I",  # lora_cleaned_v1.zip.p09
    "1MtfXUUcUxFuLNnFn5Ft9IOF_407RP-db",  # lora_cleaned_v1.zip.p10
    "1C4WQ2o5SsuCMu5tQfWGD7P_akWCrV7u7",  # lora_cleaned_v1.zip.p11
    "1RQ7uVKNBfqekX3_U0pBhrBawyBaxXa9o",  # lora_cleaned_v1.zip.p12
    "1I1h4cu8PES0IqxKQTdTvc5WRIv_GTNjZ",  # lora_cleaned_v1.zip.p13
    "1p_XAc0YoW7I7vf9dVkcXKOoTXg_BdUD5",  # lora_cleaned_v1.zip.p14
    "1m7kH4F62IqXJGiszFlnXo8CcDxuN1wB2",  # lora_cleaned_v1.zip.p15
    "1sEpA7jy7Vjh3OGepo07snbs-8fv3u8CU",  # lora_cleaned_v1.zip.p16
    "1LUG8dFmnBEGqIkTE_35afruN56ZKh2ku",  # lora_cleaned_v1.zip.p17
    "1qm8nkVLmm9hhtJa4x7KFhWiQ0DLEFtZN",  # lora_cleaned_v1.zip.p18
    "1HQC-_RfJnMHMN_EYRSIsL65mXxu99Jye",  # lora_cleaned_v1.zip.p19
    "1P6X_l4qQrmatT_y3pd-IkorE8GlczgMT",  # lora_cleaned_v1.zip.p20
    "18iFFZsiIYptJDTxDtBMFF6mwT2y9GO2b",  # lora_cleaned_v1.zip.p21
    "1yhfAW-Ua9_PyHLb4D2DCam5C-K8uYWOI",  # lora_cleaned_v1.zip.p22
    "1_q0RndiAfdAgNkGb2VS2lXKmDw-0275l",  # lora_cleaned_v1.zip.p23
    "1ySnur0Uv9MiX-sH7suYLS_CzpRfm2lSC",  # lora_cleaned_v1.zip.p24
    "1oB-EPp7R3onWadG6oKRf6CDHxISovXn4",  # lora_cleaned_v1.zip.p25
    "1DL42zlZrYz9BVGcgCnhEnbD3CAtBEUTf",  # lora_cleaned_v1.zip.p26
    "1S9n-49YZBLfHuak699cLMZqAH2i-E-La",  # lora_cleaned_v1.zip.p27
    "1V2sZY6ZLcUCv_WigTaCnVG7FF9ejTET1",  # lora_cleaned_v1.zip.p28
    "1BJSrBK5fY5CmBk5rC9lti-u19Ex3Qqm2",  # lora_cleaned_v1.zip.p29
    "1XKu47gvSamqyK5iGuOwXcUBjDGf0wbfR",  # lora_cleaned_v1.zip.p30
    "1kdT2msIhu5eNxtLiCTPz0qsOr33IXPGu",  # lora_cleaned_v1.zip.p31
    "1WjWCEa3GPlgTPrrQGPyCv5Zk_gcFxc-w",  # lora_cleaned_v1.zip.p32
    "1rxU3JkR4PAB2inD1W1D0OPjl-oZJlX5E",  # lora_cleaned_v1.zip.p33
    "1x3lqMZLF0i5wVfPZ852IjjqSBKUmL48d",  # lora_cleaned_v1.zip.p34
    "1RWks56kGUUX_PNj7LSMnj76TEL2YrnIh",  # lora_cleaned_v1.zip.p35
    "1LuHbudanjkAlWzfLDo2waESxLCrD7iwf",  # lora_cleaned_v1.zip.p36
    "1ZOWENoWGOj1yuDxOlI4bnNnTQ3VM59Kg",  # lora_cleaned_v1.zip.p37
    "1qlvUG8JuwJsLrafVF2o6vtLcF7P5BIwb",  # lora_cleaned_v1.zip.p38
    "1jOzMvB6NoXy6c0mf0bQO8V6XvCn2EBCQ",  # lora_cleaned_v1.zip.p39
    "1qJGCX6l8pqPaWT343bSk5ZgGnSL_rJ7e",  # lora_cleaned_v1.zip.p40
    "1jFOsgGViQn0_EYNlezIRqwTL6jQ-zMrr",  # lora_cleaned_v1.zip.p41
    "1OMIzgPFZhjRpFEy6BJuC3qEDbU0s94xj",  # lora_cleaned_v1.zip.p42
    "1OAq3iDUJnINvEDni2HRQfj0wkCAqdiZ0",  # lora_cleaned_v1.zip.p43
    "1pRhIccw1oFVsvIkTTJbd0Lggn8jE3zLv",  # lora_cleaned_v1.zip.p44
    "1MzxyNAsew7sGi6y2n006GtyEIjZEk21D",  # lora_cleaned_v1.zip.p45
    "1-7u_ZFyGR8sBS7ezs7lFTCf1cDShmojF",  # lora_cleaned_v1.zip.p46
    "1Ovq4JMFYbgaYDDuQzsU_0iAJb49oG_aH",  # lora_cleaned_v1.zip.p47
    "17MDfgavMMr5wIBySjWkkTCiCAoX8s_-6",  # lora_cleaned_v1.zip.p48
    "1i7pj2gp3aQonXCOEO6Uv1vvDMGM0rKo0",  # lora_cleaned_v1.zip.p49
    "1IQ8aFwjecnikaN2ZOW22pMaE-BSh1al-",  # lora_cleaned_v1.zip.p50
    "1fKxB-kS88K0AnxvibZeP25xCDGG1rOGO",  # lora_cleaned_v1.zip.p51
    "15-EgmerHB8aGvrs1ZOwNEHpyvB4wO86b",  # lora_cleaned_v1.zip.p52
    "11VrzJszpBsnjabcdJ-wZ3ykmzk3atuHN",  # lora_cleaned_v1.zip.p53
    "1XoM2zsCSCAYPIL-1arSXBYupt1Rnz-YE",  # lora_cleaned_v1.zip.p54
    "1_GyET7qFjzWb0uKpwnc-FQ_YChx1vFyf",  # lora_cleaned_v1.zip.p55
    "13bFmcEBsyZVULHnhg_oinLck2-_H5Rtz",  # lora_cleaned_v1.zip.p56
    "1JK23b7aKpNDFoziSmjBAju-WEPAMFb1g",  # lora_cleaned_v1.zip.p57
    "1NncIWNY3K8HbsRyydsUOvDz-2daE67-K",  # lora_cleaned_v1.zip.p58
    "1RxGXA4GqfU0i6U5q-q3Qzt9z9GMPXg0B",  # lora_cleaned_v1.zip.p59
    "188_VC6KEqaLBIlEfD56ZZU6f3DN3S3bQ",  # lora_cleaned_v1.zip.p60
    "1ah-qDKmKffUTkRqgO3tiIrkIKP-ZCTxS",  # lora_cleaned_v1.zip.p61
    "1j2ax6GkwU5APYHXTMTNCoXtScpQDkvy0",  # lora_cleaned_v1.zip.p62
    "10_l_7Fovtc4ZwJjz-igWsonasi2NCv3t",  # lora_cleaned_v1.zip.p63
]
CHUNK_SHA256 = [
    "08886aa672dfb93189c7a7cc32738b51d688c4a4d4710cebf04eda79b30ccfaa",
    "465a72a903c328c341538b37801a90f289470299633679534204eb22385e0d67",
    "adf1d1a15e3f718b47b41be7782479b44fa120e16ff7c44effadd71dfa1cc391",
    "a68ef943288d70c323a35548a99f7700a90f0fb711ab317f303472d5d52df0fa",
    "56761acd140f4ca24d052daeac805fe433c4fe5f2eb074254652424dcedbbe95",
    "1706e54ef0fa6aa6bab38b7bf916087986f0991159e44c7badb1449cc97806ef",
    "56576175d300f890949a878eac6f2c1fdb34db499b9ed106130736e7a969b53c",
    "d4768b0cc8774d013969eb66f531cf0329433730bae9010d2bf5a19129fcf92e",
    "a30b57ceab59abda612d42d93f4efb613a0f8e7056bb8e78bf3f8a01361c3469",
    "5a49ac130dd2bd91e9ba27da1cc09a205bb36ec7261f74815576d78cc3a37ce9",
    "03e7ebabadbc2a7ed7b6e1cc67692f79131b272d3a04bc9d31a6b963f8e17a26",
    "83a905c29d6f92a9d14cc699b7041fc8052abb58568ce29d7a556ac7371b5bd4",
    "a226c334d4f0b225300f46b96fe51601a31f6f71ce5a84f464f77ef6e7b1f506",
    "b2dac241bd6282b9b1ca5d5d357b3f84d438e92ca929607a54ff81cda7631dfd",
    "7bfbdca2cd0152139b0c983e9f3a7d7d68b3a7c51cfeca0b259571ac69f12f4f",
    "2f162d748a3404ebaeb25a0ebb71977e50417ab467bd79f28c83238af0123770",
    "4a122ee02ba14377f77fb7091c8f909ee9300ba8f8f799254a0ede8a021513b6",
    "239659a67799b626258dc695e498c0ea61020922d709c999de9297857fa88e33",
    "2b02ded92f7f61e2ff959069202bb951aeda8a3bf7ea22cd648c03759f901881",
    "00921ce883647d4db6123acde64a631f9ba7c35c8dfce07fe793a04477831915",
    "d6100e82e15790056c41cbbc8ac67372e50ea9dfc547f57db1ccc2d09725c49f",
    "5dcd0af2b079a911be5352e595029c0a077e1d2ab0a8dab9ac73799f5e77b30d",
    "2a92f02d2510b62c7abc86c91d8217a7822a094aec50f9ad0dafe41157720352",
    "9bda55cfdc13369d8c0a5023921f971a3fa7e47af60bf553e3e2165d3cb53a1a",
    "aa483f17b53ef8c73636a0a0738dba0def83e85c23979eb75882bcfd12b3ec12",
    "e5954dd2be063c2ec81c81ed9ce359cea9f3ac36f64a784812a217318f9e1707",
    "cabaf04a77aedbb57d070bd5567c3c191c831fccb3e55d51612d30639ac8316f",
    "bb05aebc983a833f2add30f7fa289cd0b80ea4ab00432234d672edc7528dcda7",
    "77609550cfa574cc2079af304479baf97f302c465a227df7543c1ca718e52abf",
    "c4d0f3bc129888852b86ab20f2b4af20f1d04f3c6716ee697bdeefeb2f62c448",
    "eb822393a50ccf5a27052ed409d79fbfb1c763e422ddd422b807c6744be5b921",
    "02fe22394cb0a53f7ac8031c4eff4de163ed9c2bfcbc2ca53447dc30e481715c",
    "d683c22cca4a4c9632dfb7bd05cf643c8343e34632b9b4e0cec60bb0cb3e9a87",
    "2bd8d154eb2ce36cd157a70dfd0553512aea9df19eee1ff59f3e38bfbea7a94a",
    "7ee8579b9cfa85cd65110c634264f5aadb00725663e5efa7300e96f073fb5267",
    "17fcb6f9197ec5552af9e97331ac59e6c3811c9025bd0d3ec68505d7211ba539",
    "3ee65c27ce02ffa2c9e7d467ff05b466c7dcc0186447c39183a4313072014b48",
    "cfc9830f382df5413f6a751cb96078bf5075703f4d578ba697a9c3fad96e0096",
    "9f32361d6fe95d876650b7c0542bcc9a447a0876ae44e43d3453a61c234d0451",
    "cde0b1f5bf4cf2d5ce7ac0495f96d9d7fb3caa0a4ef42176588ec8e83d66675b",
    "899e71be9fef335d2fe0e797ebcd5ad73b962e8bc137993bd107fa91b2a0852b",
    "140b0d3870cdaba7576eaa1bede5c9468ab3f9e243c030e591d8662a44f7b0cc",
    "baf600c6c750fc82c15ee5ffc9a0296996d29a71f283ba3a8dd663b4fb4130db",
    "0dc9978b4886831ac0e51c62a1943e625fb35da866625b8c0745004e444af596",
    "a262a400d17fcea482a9f7befb6f1e8301f4aea8ab6df39ec61c668091178991",
    "8b90df19bc938a6765c4fdb4dbc85a62fc75a0f40fdcf2601964c5cdc64b5ba1",
    "0d435f21862131f7bad053affe882522d6b1f0fe22780318be6537c19a50c31d",
    "7465c4575f12478912bfc13a746f12a3cf440e84d020291f7201f2e50f339c12",
    "e095cd62083e8682aa83f69cc3c2592b064d450ac7b879044cadd792d1c197ec",
    "965b816171ba554efd9c1709ff9b81c4fec8576461f244361bdf256884e272dd",
    "956db160b798129e2a7d1203597d80478c0c1a1e7db447de7a944bceb83b905f",
    "f8d6707ecfd69ddaa2472454aae3ea9c8d185f8b4ab32648c34ffbd57a129ab8",
    "c7732528573509e0313a8b65e4174cd4a9c18b762e40749e9da59334af330459",
    "e00065dfcf7ca3676e4e409d7e87265f9a2490fab2d3da663d461f5db697a5af",
    "e92e9e0be1429287962c32d620d034a1a8b27d9ba186ee80e598ff40ec7dbe6a",
    "f0a1f3503335f720f2523bf5fda822fc035ccd36b83b3ac53e51f961403833e5",
    "cac22605cec0b672be741f9e9c7494b55145f255104fbe48b558dad5c749c7c2",
    "338143a9cd5c76997dffa6118a4b94b2b47a41e42113cd6e465ec0db83f9c6ed",
    "a9b1a98d1b34985065acb9a17dd3d206cce031692fa06fc55c85406aa6323185",
    "f64809153d942284df80ac897617d02fa2d7449b3e2a991e8d5fbd2aea0a8ad1",
    "090cb8cb88f24e5cd392b048541581e726937e2282b362953791d74c003dbddc",
    "8eb469a57d5733dfe08991a811140db1a16800fe9f5b61f9834540c02773ef65",
    "55d8cd0ed3b1af124c9eeb11bf418776bb017fc7d1ea718ff1a78ebd5d629f6d",
    "38e06255e41a1726fe35a697f4f7a025733ad36d39903b7ddcecafb9a9936163",
]

CHUNK_SIZES = [
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    134217728,
    12307198,
]
FINAL_ZIP_NAME = "lora_cleaned_v1.zip"
FINAL_ZIP_SIZE = 8468024062
FINAL_ZIP_SHA256 = "c2cbcde130a9d31bb1a8b17a7570f7f30febd69617c05332a202aed127354e5c"
EXPECTED_IMAGES = 6221

TRIGGER = "brutus-style"
CKPT_URL = "https://huggingface.co/SG161222/RealVisXL_V4.0/resolve/main/RealVisXL_V4.0.safetensors"


def report(stage, detail="", links=""):
    payload = json.dumps({
        "stage": stage, "detail": detail[:3500], "links": links[:2000],
    }).encode()
    import time as _time
    for attempt in range(4):
        try:
            req = urllib.request.Request(
                HOOK, data=payload,
                headers={"Content-Type": "application/json"}, method="POST")
            urllib.request.urlopen(req, timeout=30).read()
            return
        except Exception as e:  # noqa: BLE001
            print(f"report attempt {attempt+1} failed: {e}", flush=True)
            _time.sleep(5 * (attempt + 1))
    print("report giving up", flush=True)


def sh(cmd, check=True, cwd=None):
    print(f"$ {cmd[:200]}", flush=True)
    with open(LOG, "a") as lf:
        lf.write(f"\n$ {cmd[:500]}\n")
    p = subprocess.run(cmd, shell=True, cwd=cwd,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                       text=True)
    with open(LOG, "a") as lf:
        lf.write(p.stdout[-20000:])
    print(p.stdout[-2000:], flush=True)
    if check and p.returncode != 0:
        raise RuntimeError(f"command failed ({p.returncode}): {cmd[:200]}\n{p.stdout[-2000:]}")
    return p


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def upload_file(path):
    """Try multiple anonymous file hosts from the pod, return first working URL."""
    cands = [
        ("catbox", f'curl -s -m 300 -F "reqtype=fileupload" -F "fileToUpload=@{path}" https://catbox.moe/user/api.php'),
        ("uguu", f"curl -s -m 300 -F'files[]=@{path}' https://uguu.se/upload.php"),
        ("transfer", f"curl -s -m 300 --upload-file {path} https://transfer.sh/{os.path.basename(path)}"),
        ("0x0", f"curl -s -m 300 -F'file=@{path}' https://0x0.st"),
    ]
    for name, cmd in cands:
        try:
            p = sh(cmd, check=False)
            out = p.stdout.strip()
            if name == "uguu" and out.startswith("{"):
                url = json.loads(out)["files"][0]["url"]
            else:
                url = out.split("\n")[-1].strip()
            if url.startswith("http"):
                print(f"uploaded via {name}: {url}", flush=True)
                return url
            print(f"{name} bad response: {out[:150]}", flush=True)
        except Exception as e:  # noqa: BLE001
            print(f"{name} failed: {e}", flush=True)
    raise RuntimeError("all upload hosts failed")


def download_chunks(chunk_dir):
    """Download every dataset chunk from Drive and verify its SHA-256."""
    os.makedirs(chunk_dir, exist_ok=True)
    sh("pip install -q gdown 2>/dev/null; python3 -c 'import gdown; print(gdown.__version__)'")
    paths = []
    for i, (name, fid, want_hash) in enumerate(zip(CHUNK_NAMES, CHUNK_IDS, CHUNK_SHA256)):
        dest = os.path.join(chunk_dir, name)
        url = f"https://drive.google.com/uc?id={fid}"
        ok = False
        for attempt in range(3):
            if not (os.path.exists(dest) and sha256_file(dest) == want_hash):
                sh(f"rm -f {dest} && python3 -c \"import gdown; gdown.download('{url}', '{dest}', quiet=False)\" && echo dl-ok",
                   check=False)
            if os.path.exists(dest):
                got = sha256_file(dest)
                if got == want_hash:
                    ok = True
                    break
                print(f"chunk {i+1}/{len(CHUNK_NAMES)} hash mismatch on attempt {attempt+1}", flush=True)
        if not ok:
            raise RuntimeError(f"chunk {name} failed verification after 3 attempts")
        print(f"chunk {i+1}/{len(CHUNK_NAMES)} ok: {name}", flush=True)
        paths.append(dest)
    return paths


def reassemble(chunk_paths, dest):
    """Deterministic concatenation of chunks, then size+hash verification."""
    with open(dest, "wb") as out:
        for p in chunk_paths:
            with open(p, "rb") as f:
                shutil.copyfileobj(f, out, 1 << 20)
    size = os.path.getsize(dest)
    if size != FINAL_ZIP_SIZE:
        raise RuntimeError(f"reassembled size {size} != expected {FINAL_ZIP_SIZE}")
    got = sha256_file(dest)
    if got != FINAL_ZIP_SHA256:
        raise RuntimeError(f"reassembled sha256 {got} != expected {FINAL_ZIP_SHA256}")
    print(f"reassembled {FINAL_ZIP_NAME}: {size} bytes, sha256 ok", flush=True)


def count_images(root):
    n = 0
    for _dp, _dn, fn in os.walk(root):
        for f in fn:
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                n += 1
    return n


def main():
    done_marker = os.path.join(WORK, "DONE")
    if os.path.exists(done_marker):
        report("already-complete", "run finished earlier, awaiting termination")
        import time as _t
        _t.sleep(600)
        sys.exit(0)
    report("boot", "pod up, pipeline starting")
    sh("nvidia-smi --query-gpu=name,memory.total --format=csv,noheader")
    sh("df -h /workspace | tail -1")
    report("prereqs-done", "gpu ok")

    # ---- dataset (cleaned set: 6,221 images, chunked) ----
    czip = os.path.join(WORK, FINAL_ZIP_NAME)
    chunk_dir = os.path.join(WORK, "chunks")
    need_build = not (os.path.exists(czip)
                      and os.path.getsize(czip) == FINAL_ZIP_SIZE
                      and sha256_file(czip) == FINAL_ZIP_SHA256)
    if need_build:
        chunk_paths = download_chunks(chunk_dir)
        reassemble(chunk_paths, czip)
        shutil.rmtree(chunk_dir, ignore_errors=True)
    report("dataset-done", f"cleaned set verified ({FINAL_ZIP_SIZE} bytes, sha256 ok)")
    stage_dir = os.path.join(WORK, "stage")
    os.makedirs(stage_dir, exist_ok=True)
    sh(f"unzip -q -o {czip} -d {stage_dir} && echo unzip-ok")
    os.remove(czip)

    # flatten images into train dir
    data_dir = os.path.join(WORK, "data")
    os.makedirs(data_dir, exist_ok=True)
    n = 0
    for dp, _dn, fn in os.walk(stage_dir):
        for f in fn:
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                src = os.path.join(dp, f)
                dst = os.path.join(data_dir, f"img_{n:05d}{os.path.splitext(f)[1].lower()}")
                shutil.copy2(src, dst)
                n += 1
    shutil.rmtree(stage_dir, ignore_errors=True)
    report("data-ready", f"{n} images flattened into train dir")
    if n != EXPECTED_IMAGES:
        raise RuntimeError(f"image count {n} != expected {EXPECTED_IMAGES}")

    # ---- training stack ----
    sh("pip install -q --upgrade pip 2>&1 | tail -1")
    sh("git clone -q https://github.com/kohya-ss/sd-scripts.git /workspace/sd-scripts 2>&1 | tail -1; ls /workspace/sd-scripts/sdxl_train_network.py")
    sh("cd /workspace/sd-scripts && timeout 1200 pip install -q -r requirements.txt 2>&1 | tail -2; echo deps-done")
    sh("python3 -c 'import torch; print(torch.__version__, torch.cuda.is_available())'")
    os.makedirs(os.path.join(WORK, "models"), exist_ok=True)
    ckpt = os.path.join(WORK, "models", "RealVisXL_V4.0.safetensors")
    sh(f"timeout 1200 curl -sL -o {ckpt} {CKPT_URL} && ls -la {ckpt}")
    if os.path.getsize(ckpt) < 5_000_000_000:
        raise RuntimeError(f"checkpoint too small: {os.path.getsize(ckpt)}")
    report("setup-done", "deps installed, SDXL checkpoint downloaded")

    # ---- WD14 tagging ----
    sh(f"cd /workspace/sd-scripts && timeout 5400 python3 tag_images_by_wd14_tagger.py {data_dir} "
       f"--model SmilingWolf/wd-v1-4-convnextv2-tagger-v2 --batch_size 8 "
       f"--caption_extension .txt --remove_underscore "
       f"--general_threshold 0.35 --character_threshold 0.35 2>&1 | tail -3")
    ncap = 0
    for dp, _dn, fn in os.walk(data_dir):
        for f in fn:
            if f.endswith(".txt"):
                pth = os.path.join(dp, f)
                with open(pth, "r+") as fh:
                    body = fh.read().strip()
                    fh.seek(0)
                    fh.write(f"{TRIGGER}, {body}" if body else TRIGGER)
                    fh.truncate()
                ncap += 1
    report("tagged", f"{ncap} captions written with trigger '{TRIGGER}'")

    # ---- sample prompts ----
    sp = os.path.join(WORK, "sample_prompts.txt")
    with open(sp, "w") as fh:
        fh.write(
            f"{TRIGGER}, portrait of a brave young warrior, detailed anime illustration --w 1024 --h 1024 --s 20 --d 1\n"
            f"{TRIGGER}, fantasy tavern interior, group of adventurers talking, warm light, anime key visual --w 1024 --h 1024 --s 20 --d 2\n"
            f"{TRIGGER}, dark armored knight with glowing red visor, dramatic lighting, anime --w 1024 --h 1024 --s 20 --d 3\n")

    # ---- train ----
    out_dir = os.path.join(WORK, "output")
    os.makedirs(out_dir, exist_ok=True)
    train_cmd = (
        f"cd /workspace/sd-scripts && accelerate launch --num_cpu_threads_per_process=2 "
        f"sdxl_train_network.py "
        f"--pretrained_model_name_or_path={ckpt} "
        f"--train_data_dir={data_dir} "
        f"--resolution=1024 --train_batch_size=2 "
        f"--max_train_steps=2000 --save_every_n_steps=500 "
        f"--output_dir={out_dir} --output_name=brutus-style-test "
        f"--network_module=networks.lora --network_dim=16 --network_alpha=16 "
        f"--learning_rate=1e-4 --lr_scheduler=cosine --lr_warmup_steps=200 "
        f"--optimizer_type=AdamW --mixed_precision=bf16 "
        f"--gradient_checkpointing --sdpa "
        f"--cache_latents --cache_text_encoder_outputs "
        f"--caption_extension=.txt --shuffle_caption "
        f"--sample_every_n_steps=500 --sample_prompts={sp} --sample_sampler=euler_a "
        f"--seed=42 --max_data_loader_n_workers=2 "
        f"2>&1 | tee {WORK}/logs/train.log")
    report("training-start", "2000 steps, ckpt+samples every 500")
    p = subprocess.run(train_cmd, shell=True)
    if p.returncode != 0:
        tail = subprocess.run(f"tail -c 4000 {WORK}/logs/train.log",
                              shell=True, capture_output=True, text=True).stdout
        raise RuntimeError(f"training failed rc={p.returncode}\n{tail[-2000:]}")
    report("training-done", "2000 steps complete, collecting artifacts")

    # ---- artifacts ----
    links = []
    for dp, _dn, fn in os.walk(out_dir):
        for f in sorted(fn):
            if f.endswith((".safetensors", ".png", ".jpg", ".webp")):
                url = upload_file(os.path.join(dp, f))
                links.append(f"{f}: {url}")
    log_url = upload_file(os.path.join(WORK, "logs", "train.log"))
    links.append(f"train.log: {log_url}")
    report("complete", f"test run finished, {len(links)} artifacts",
           "\n".join(links))
    open(os.path.join(WORK, "DONE"), "w").write("ok")
    print("PIPELINE COMPLETE", flush=True)


if __name__ == "__main__":
    try:
        main()
        sys.exit(0)
    except Exception:  # noqa: BLE001
        tb = traceback.format_exc()
        print(tb, flush=True)
        try:
            log_url = upload_file(LOG)
        except Exception as e:  # noqa: BLE001
            log_url = f"log upload failed: {e}"
        try:
            report("failed", tb[-3000:], log_url)
        except Exception:  # noqa: BLE001
            pass
        sys.exit(1)
