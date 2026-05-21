#!/bin/bash
# Classify a PR by the kind of changes it contains.
# Output: "rename", "minor", "content", or "major"
set -e

BASE="${1:-origin/master}"
HEAD="${2:-HEAD}"

GLOB=( '*.md' '*.mdx' )

RENAMED=$(git diff --diff-filter=R --name-only "$BASE...$HEAD" -- "${GLOB[@]}" | grep -c . || true)
ADDED=$(git diff --diff-filter=A --name-only "$BASE...$HEAD" -- "${GLOB[@]}" | grep -c . || true)
TOTAL=$(git diff --name-only "$BASE...$HEAD" -- "${GLOB[@]}" | grep -c . || true)

NUMSTAT=$(git diff --numstat "$BASE...$HEAD" -- "${GLOB[@]}")
LINES_ADDED=$(echo "$NUMSTAT" | awk '$1 != "-" { sum += $1 } END { print sum+0 }')
LINES_REMOVED=$(echo "$NUMSTAT" | awk '$2 != "-" { sum += $2 } END { print sum+0 }')
NET_LINES=$((LINES_ADDED + LINES_REMOVED))

if [ "$ADDED" -gt 0 ] || [ "$LINES_ADDED" -gt 200 ]; then
  echo "major"
  exit 0
fi

if [ "$TOTAL" -gt 0 ] && [ "$RENAMED" -eq "$TOTAL" ]; then
  echo "rename"
  exit 0
fi

if [ "$NET_LINES" -lt 50 ]; then
  echo "minor"
  exit 0
fi

echo "content"
