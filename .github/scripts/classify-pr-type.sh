#!/bin/bash
# Classifies PR as "rename" or "content" based on git diff analysis

set -e

BASE_REF=${1:-master}
HEAD_REF=${2:-HEAD}

# Get diff stats
SUMMARY=$(git diff --summary "$BASE_REF...$HEAD_REF")
STAT=$(git diff --stat "$BASE_REF...$HEAD_REF")
DIFF=$(git diff --numstat "$BASE_REF...$HEAD_REF")

# Count rename operations
RENAME_COUNT=$(echo "$SUMMARY" | grep -c "rename" || echo 0)

# Count total changed files
TOTAL_FILES=$(echo "$DIFF" | wc -l | tr -d ' ')

# Count files with significant content changes (>10 lines added+deleted)
CONTENT_CHANGES=$(echo "$DIFF" | awk '{if ($1+$2 > 10) print}' | wc -l | tr -d ' ')

# Calculate rename ratio
if [[ $TOTAL_FILES -gt 0 ]]; then
  RENAME_RATIO=$((RENAME_COUNT * 100 / TOTAL_FILES))
else
  RENAME_RATIO=0
fi

# Classification logic:
# - If >70% of files are renames AND <5 files have significant content changes: "rename"
# - Otherwise: "content"

if [[ $RENAME_RATIO -gt 70 ]] && [[ $CONTENT_CHANGES -lt 5 ]]; then
  echo "rename"
else
  echo "content"
fi

# Debug output (appears in GitHub Actions logs)
echo "  Rename count: $RENAME_COUNT" >&2
echo "  Total files: $TOTAL_FILES" >&2
echo "  Content changes: $CONTENT_CHANGES" >&2
echo "  Rename ratio: ${RENAME_RATIO}%" >&2
