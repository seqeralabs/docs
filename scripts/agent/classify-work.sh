#!/usr/bin/env bash

set -euo pipefail

BASE_REF="${1:-HEAD}"
HEAD_REF="${2:-}"

if [[ -n "${HEAD_REF}" ]]; then
  diff_range="${BASE_REF}...${HEAD_REF}"
elif [[ "${BASE_REF}" == "HEAD" ]]; then
  diff_range=""
else
  diff_range="${BASE_REF}"
fi

if [[ -z "${diff_range}" ]]; then
  changed_files="$(
    {
      git diff --name-only --diff-filter=ACMR HEAD
      git ls-files --others --exclude-standard
    } | sed '/^$/d' | sort -u
  )"
else
  changed_files="$(git diff --name-only --diff-filter=ACMR "${diff_range}")"
fi

if [[ -z "${changed_files}" ]]; then
  cat <<'EOF'
class=docs
confidence=low
reason=No changed files were detected; defaulting to docs for an empty diff.
EOF
  exit 0
fi

total_files="$(printf '%s\n' "${changed_files}" | sed '/^$/d' | wc -l | tr -d ' ')"
docs_only_regex='(\.md|\.mdx|\.mdoc|\.txt|\.rst|\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp|\.avif)$'

docs_count="$(printf '%s\n' "${changed_files}" | grep -E "${docs_only_regex}" || true)"
docs_count="$(printf '%s\n' "${docs_count}" | sed '/^$/d' | wc -l | tr -d ' ')"

workflow_count="$(printf '%s\n' "${changed_files}" | grep -E '^(\.github/|scripts/agent/)' || true)"
workflow_count="$(printf '%s\n' "${workflow_count}" | sed '/^$/d' | wc -l | tr -d ' ')"

code_count="$(printf '%s\n' "${changed_files}" | grep -E '(\.js|\.mjs|\.cjs|\.ts|\.tsx|\.json|\.ya?ml|\.sh|\.css)$' || true)"
code_count="$(printf '%s\n' "${code_count}" | sed '/^$/d' | wc -l | tr -d ' ')"

build_surface_count="$(printf '%s\n' "${changed_files}" | grep -E '^(src/|internal/|netlify/|platform-api-docs/scripts/)' || true)"
build_surface_count="$(printf '%s\n' "${build_surface_count}" | sed '/^$/d' | wc -l | tr -d ' ')"

classification="docs"
confidence="medium"
reason="All detected changes are content-oriented docs assets."

if [[ "${workflow_count}" -gt 0 && "${total_files}" -le 4 && "${build_surface_count}" -eq 0 ]]; then
  classification="minor"
  confidence="medium"
  reason="The diff touches lightweight workflow or automation files with bounded repo impact."
fi

if [[ "${docs_count}" -eq "${total_files}" ]]; then
  classification="docs"
  confidence="high"
  reason="All detected files look like documentation content or static doc assets."
elif [[ "${build_surface_count}" -gt 0 && "${total_files}" -le 5 ]]; then
  classification="small-feature"
  confidence="medium"
  reason="The diff changes docs-site behavior or generation code in a bounded surface area."
elif [[ "${build_surface_count}" -gt 5 || "${total_files}" -gt 12 ]]; then
  classification="medium"
  confidence="low"
  reason="The diff spans a wider surface area and likely needs planning and broader validation."
elif [[ "${code_count}" -gt 0 ]]; then
  classification="minor"
  confidence="low"
  reason="The diff includes code or automation, but it still appears limited in scope."
fi

cat <<EOF
class=${classification}
confidence=${confidence}
reason=${reason}
files=${total_files}
EOF
