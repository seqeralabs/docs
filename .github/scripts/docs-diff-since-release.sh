#!/usr/bin/env bash
# Lists what has changed in the working Enterprise docs since a frozen release
# snapshot, so you can see at a glance which pages need attention when writing
# content for the next Enterprise version.
#
# It diffs the frozen versioned snapshot against the live, non-versioned docs:
#   platform-enterprise_versioned_docs/version-<VERSION>/   (frozen baseline)
#   platform-enterprise_docs/                               (working copy -> next release)
#
# The report is derived live from the two trees, so it never goes stale.
#
# Usage:
#   .github/scripts/docs-diff-since-release.sh [VERSION] [--full]
#
#   VERSION   Baseline release to compare against (default: latest version-* snapshot)
#   --full    Also print the unified diff for every changed page
#
# Examples:
#   .github/scripts/docs-diff-since-release.sh            # summary vs latest snapshot
#   .github/scripts/docs-diff-since-release.sh 26.1       # summary vs v26.1
#   .github/scripts/docs-diff-since-release.sh 26.1 --full > since-26.1.md

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
VERSIONED_DIR="$REPO_ROOT/platform-enterprise_versioned_docs"
WORK="$REPO_ROOT/platform-enterprise_docs"

VERSION=""
FULL=false
for arg in "$@"; do
  case "$arg" in
    --full) FULL=true ;;
    -h|--help) sed -n '2,26p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    --*) echo "Unknown flag: $arg" >&2; exit 2 ;;
    *) VERSION="$arg" ;;
  esac
done

# Default to the highest-numbered frozen snapshot if no version was given.
if [[ -z "$VERSION" ]]; then
  VERSION="$(ls -d "$VERSIONED_DIR"/version-* 2>/dev/null \
    | sed 's#.*/version-##' | sort -V | tail -1)"
  [[ -n "$VERSION" ]] || { echo "No version-* snapshots found in $VERSIONED_DIR" >&2; exit 1; }
fi

BASE="$VERSIONED_DIR/version-$VERSION"
[[ -d "$BASE" ]] || { echo "No frozen snapshot at $BASE" >&2; exit 1; }
[[ -d "$WORK" ]] || { echo "No working docs at $WORK" >&2; exit 1; }

# Ignore non-content noise: binary assets, macOS cruft, and Docusaurus sidebars.
EXCLUDES=( --exclude=_images --exclude='.DS_Store' --exclude='*.json' )

# Strip a leading "$BASE/" or "$WORK/" prefix to get the doc-relative path.
rel() { local p="$1"; p="${p#"$BASE"/}"; p="${p#"$WORK"/}"; echo "$p"; }

added=()
removed=()
changed=()

# `diff -rq` classifies every path as added / removed / changed in one pass.
while IFS= read -r line; do
  case "$line" in
    "Only in $WORK"*)
      dir="${line#Only in }"; name="${dir##*: }"; dir="${dir%%: *}"
      added+=( "$(rel "$dir/$name")" ) ;;
    "Only in $BASE"*)
      dir="${line#Only in }"; name="${dir##*: }"; dir="${dir%%: *}"
      removed+=( "$(rel "$dir/$name")" ) ;;
    "Files "*" differ")
      f="${line#Files }"; f="${f% and *}"
      changed+=( "$(rel "$f")" ) ;;
  esac
done < <(diff -rq "${EXCLUDES[@]}" "$BASE" "$WORK" 2>/dev/null || true)

echo "# Enterprise docs changed since v$VERSION"
echo "_Baseline: platform-enterprise_versioned_docs/version-$VERSION/ vs platform-enterprise_docs/_"
echo
echo "Summary: ${#added[@]} new, ${#removed[@]} removed, ${#changed[@]} changed"
echo

if ((${#added[@]})); then
  echo "## New pages (likely new features) — ${#added[@]}"
  printf '  + %s\n' $(printf '%s\n' "${added[@]}" | sort)
  echo
fi

if ((${#removed[@]})); then
  echo "## Removed pages — ${#removed[@]}"
  printf '  - %s\n' $(printf '%s\n' "${removed[@]}" | sort)
  echo
fi

if ((${#changed[@]})); then
  echo "## Changed pages — ${#changed[@]}"
  while IFS= read -r f; do
    a=$(diff "$BASE/$f" "$WORK/$f" 2>/dev/null | grep -c '^>' || true)
    d=$(diff "$BASE/$f" "$WORK/$f" 2>/dev/null | grep -c '^<' || true)
    printf '  ~ %s  (+%s -%s)\n' "$f" "$a" "$d"
  done < <(printf '%s\n' "${changed[@]}" | sort)
  echo
fi

if $FULL && ((${#changed[@]} + ${#added[@]})); then
  echo "## Full unified diffs"
  echo
  for f in $(printf '%s\n' "${changed[@]}" "${added[@]}" | sort -u); do
    old="$BASE/$f"; [[ -f "$old" ]] || old=/dev/null
    echo '```diff'
    git --no-pager diff --no-index --no-color "$old" "$WORK/$f" 2>/dev/null || true
    echo '```'
    echo
  done
fi
