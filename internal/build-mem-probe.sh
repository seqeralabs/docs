#!/usr/bin/env bash
# TEMP DIAGNOSTIC (remove once the bundler-memory experiment concludes).
# Wraps `npm run build` to report VM resources and fine-grained memory pressure,
# so we can quantify peak bundler memory on a full-scope build and whether
# DISABLE_RSPACK_INCREMENTAL moves it.

TOTAL_KB="$(awk '/MemTotal/ {print $2}' /proc/meminfo)"
echo "--- build VM resources ---"
echo "vCPUs: $(nproc)  MemTotal: $((TOTAL_KB / 1024)) MiB"
free -h

# Sample every 1s (the 3s sampler missed the spike last time). Record timestamped
# "used MiB" so we can see the ramp and the tightest point even if the build dies.
SAMPLE_FILE="$(mktemp)"
(
  while true; do
    AVAIL_KB="$(awk '/MemAvailable/ {print $2}' /proc/meminfo)"
    echo "$(date +%s) $(( (TOTAL_KB - AVAIL_KB) / 1024 ))"
    sleep 1
  done > "$SAMPLE_FILE"
) &
SAMPLER_PID=$!
trap 'kill "$SAMPLER_PID" 2>/dev/null || true' EXIT

npm run build
STATUS=$?

kill "$SAMPLER_PID" 2>/dev/null || true
PEAK_USED="$(awk '{print $2}' "$SAMPLE_FILE" | sort -n | tail -1)"
echo "--- memory pressure during build ---"
echo "Peak used: ${PEAK_USED} MiB of $((TOTAL_KB / 1024)) MiB"
echo "Last 12 samples (epoch / used MiB) — ramp toward the tightest point:"
tail -n 12 "$SAMPLE_FILE"

exit $STATUS
