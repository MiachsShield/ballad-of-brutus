#!/usr/bin/env python3
"""Bulletproof bootstrap for brutus LoRA pod. Reports immediately, then downloads and runs pipeline."""
import urllib.request, json, subprocess, sys, time

HOOK = "https://webhook.site/f41acc95-3136-4bcc-9a00-bda6b09db697"
SCRIPT_URL = "https://raw.githubusercontent.com/MiachsShield/ballad-of-brutus/main/lora-pipeline/train_pipeline.py"

def report(stage, detail=""):
    payload = json.dumps({"stage": stage, "detail": detail[:2000]}).encode()
    for _ in range(3):
        try:
            req = urllib.request.Request(HOOK, data=payload, headers={"Content-Type": "application/json"}, method="POST")
            urllib.request.urlopen(req, timeout=15).read()
            return True
        except Exception as e:
            print(f"report failed: {e}", flush=True)
            time.sleep(3)
    return False

report("pod-alive", "bootstrap started, downloading pipeline script")

# Download the pipeline script with retries
for attempt in range(5):
    try:
        print(f"download attempt {attempt+1}", flush=True)
        req = urllib.request.Request(SCRIPT_URL, headers={"User-Agent": "Mozilla/5.0"})
        data = urllib.request.urlopen(req, timeout=60).read()
        with open("/pipe.py", "wb") as f:
            f.write(data)
        print(f"downloaded {len(data)} bytes", flush=True)
        break
    except Exception as e:
        print(f"download failed: {e}", flush=True)
        time.sleep(10)
else:
    report("bootstrap-failed", "could not download pipeline script after 5 attempts")
    print("BOOTSTRAP FAILED - sleeping for debug", flush=True)
    time.sleep(3600)
    sys.exit(1)

report("script-ready", f"pipeline script downloaded ({len(data)} bytes), starting")
print("starting pipeline...", flush=True)

# Run the pipeline
proc = subprocess.Popen([sys.executable, "/pipe.py"])
proc.wait()
print(f"pipeline exited with code {proc.returncode}", flush=True)
report("pipeline-exited", f"exit code {proc.returncode}")
# Keep alive for log inspection
time.sleep(600)
