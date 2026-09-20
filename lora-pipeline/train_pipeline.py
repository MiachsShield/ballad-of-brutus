#!/usr/bin/env python3
"""Autonomous LoRA test-run pipeline for the Ballad of Brutus style LoRA.

Phases: download dataset parts (Drive, public links) -> reassemble -> unpack ->
flatten images -> install deps -> download SDXL ckpt -> WD14 tag -> prepend
trigger -> train 2000 steps (samples every 500) -> upload artifacts
-> report everything to the webhook -> exit (0 = done, 1 = failed).
Idempotent: if /workspace/DONE exists, reports already-complete and sleeps.
"""
import json
import os
import shutil
import subprocess
import sys
import traceback
import urllib.request

HOOK = "https://webhook.site/f41acc95-3136-4bcc-9a00-bda6b09db697"
WORK = "/workspace"
LOG = os.path.join(WORK, "logs", "pipeline.log")
os.makedirs(os.path.join(WORK, "logs"), exist_ok=True)

DRIVE_IDS = {
    "001": "1VAGmtYgi6JTUlfGaTtCchyPn9a9iQs_y",
    "002": "1L730PfBIbCuxfa-k97Ol7K_RUAS3t2PV",
    "003": "1pwcK45O-pAFAzqKVnEK-qHkaBPcpGgrm",
    "004": "1VdSBeCwCbSCuxbukB3D3ytYtKVp3WOgU",
    "005": "1-Ope828TATVnLQSa26tOnh3_B5FKLdO7",
    "006": "13Dd3-KlsZYkJmRo2HAEx047KjLUG6cB9",
    "007": "1wjuIDDy1NI7SfT4MvqAoX5S_YW8BLL0y",
    "008": "14BVnNXWLSG6ikVY525hTC0Dk9GILa0ye",
    "009": "1kZlNyO4gODX8czAfBAn6ODMEj9Fkt8vD",
    "010": "12xxGBQGit5r0Lrcx_x8sZx6IAMQ3Z7Bn",
}
PARTS = [
    ("001", 1048576000),
    ("002", 1048576000),
    ("003", 1048576000),
    ("004", 1048576000),
    ("005", 1048576000),
    ("006", 1048576000),
    ("007", 1048576000),
    ("008", 1048576000),
    ("009", 1048576000),
    ("010", 721983081),
]

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


def download_part(num, dest, expected):
    """Download a dataset part from Google Drive (shared link) with retries."""
    fid = DRIVE_IDS[num]
    url = f"https://drive.google.com/uc?id={fid}"
    for attempt in range(3):
        sh(f"rm -f {dest}; pip install -q gdown 2>/dev/null; "
           f"python3 -c \"import gdown; gdown.download('{url}', '{dest}', quiet=False)\" && echo dl-ok",
           check=False)
        if os.path.exists(dest) and os.path.getsize(dest) == expected:
            return True
        got = os.path.getsize(dest) if os.path.exists(dest) else -1
        print(f"part {num} attempt {attempt+1}: got {got}, want {expected}", flush=True)
    return os.path.exists(dest) and os.path.getsize(dest) == expected


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
    if not shutil.which("7z"):
        sh("apt-get update -qq && apt-get install -y -qq p7zip-full > /dev/null 2>&1 && echo 7z-ok")
    else:
        print("7z already present", flush=True)
    report("prereqs-done", "gpu ok, 7z ok")

    # ---- dataset ----
    parts_dir = os.path.join(WORK, "parts")
    os.makedirs(parts_dir, exist_ok=True)
    for num, size in PARTS:
        dest = os.path.join(parts_dir, f"Lora_2.7z.{num}")
        if os.path.exists(dest) and os.path.getsize(dest) == size:
            print(f"part {num} already present", flush=True)
        else:
            if not download_part(num, dest, size):
                raise RuntimeError(f"part {num} download failed after retries")
        report("part-done", f"part {num}/010 downloaded ({size} bytes)")

    sevenz = os.path.join(WORK, "Lora_2.7z")
    sh(f"cat {parts_dir}/Lora_2.7z.* > {sevenz}")
    shutil.rmtree(parts_dir)
    raw_dir = os.path.join(WORK, "dataset_raw")
    os.makedirs(raw_dir, exist_ok=True)
    sh(f"7z x {sevenz} -o{raw_dir} -y | tail -3")
    os.remove(sevenz)
    lorazip = os.path.join(raw_dir, "Lora.zip")
    if not os.path.exists(lorazip):
        found = subprocess.run(f"find {raw_dir} -name 'Lora.zip'",
                               shell=True, capture_output=True, text=True).stdout.strip().split("\n")
        if not found or not found[0]:
            raise RuntimeError("Lora.zip not found after 7z extraction")
        lorazip = found[0]
    report("un7z-done", "Lora.zip extracted from 7z")
    stage_dir = os.path.join(WORK, "stage")
    os.makedirs(stage_dir, exist_ok=True)
    sh(f"unzip -q -o {lorazip} -d {stage_dir} && echo unzip-ok")
    os.remove(lorazip)
    shutil.rmtree(raw_dir, ignore_errors=True)

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
    if n < 8000:
        raise RuntimeError(f"too few images: {n}")

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
