"""Run the checkout's checks once before Claude stops with local changes."""
import json
import subprocess
import sys
from pathlib import Path

request = json.load(sys.stdin)
if request.get("stop_hook_active"):
    sys.exit(0)  # One continuation is enough; report an environment block instead of looping.
try:
    root = Path(subprocess.check_output(
        ["git", "rev-parse", "--show-toplevel"], cwd=request["cwd"], text=True).strip())
    dirty = subprocess.check_output(
        ["git", "status", "--porcelain", "--untracked-files=all"], cwd=root, text=True)
    if not dirty:
        sys.exit(0)
    result = subprocess.run(["bash", "scripts/check.sh"], cwd=root, check=False,
                            stdout=sys.stderr, stderr=sys.stderr)
except (KeyError, OSError, subprocess.CalledProcessError) as error:
    print(f"Could not run project checks: {error}", file=sys.stderr)
    sys.exit(2)
if result.returncode:
    print("Project checks failed. Fix the failure or report the exact blocker and unverified work.",
          file=sys.stderr)
    sys.exit(2)
