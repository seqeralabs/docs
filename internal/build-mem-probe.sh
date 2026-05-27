#!/usr/bin/env bash
# TEMP DIAGNOSTIC (remove once full-build memory headroom is validated).
# Wraps `npm run build` to report the build VM's resources and the peak memory
# pressure during the build, so we can confirm a full doc build (all products
# included) stays comfortably under the Firecracker MicroVM's ~10 GiB.

echo "--- build VM resources ---"
echo "vCPUs: $(nproc)"
free -h
echo "--- cgroup mem cap (bytes; empty = no cgroup limit, i.e. Firecracker VM boundary is the cap) ---"
cat /sys/fs/cgroup/memory.max 2>/dev/null \
  || cat /sys/fs/cgroup/memory/memory.limit_in_bytes 2>/dev/null \
  || echo "(none)"

# Sample MemAvailable every 3s in the background; its minimum over the build is
# the point of peak memory pressure. Captured even if the build OOMs.
SAMPLE_FILE="$(mktemp)"
( while true; do awk '/MemAvailable/ {print $2}' /proc/meminfo; sleep 3; done > "$SAMPLE_FILE" ) &
SAMPLER_PID=$!
trap 'kill "$SAMPLER_PID" 2>/dev/null || true' EXIT

npm run build
STATUS=$?

kill "$SAMPLER_PID" 2>/dev/null || true
MIN_KB="$(sort -n "$SAMPLE_FILE" | head -1)"
if [ -n "$MIN_KB" ]; then
  echo "--- peak memory pressure during build ---"
  echo "Lowest MemAvailable: $((MIN_KB / 1024)) MiB free at the tightest point (VM total ~10 GiB)"
fi

exit $STATUS
