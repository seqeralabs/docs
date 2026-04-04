#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
classification_output="$("${repo_root}/scripts/agent/classify-work.sh" "${1:-HEAD}")"

work_class="$(printf '%s\n' "${classification_output}" | awk -F= '/^class=/{print $2}')"
confidence="$(printf '%s\n' "${classification_output}" | awk -F= '/^confidence=/{print $2}')"
reason="$(printf '%s\n' "${classification_output}" | awk -F= '/^reason=/{print $2}')"

cat <<EOF
Seqera docs pilot pre-commit check
Work class: ${work_class} (${confidence} confidence)
Why: ${reason}
EOF

case "${work_class}" in
  docs)
    cat <<'EOF'
Guidance:
- Human review is sufficient for this pilot tier.
- Optional: run `npm run markdownlint` if the change touches covered Markdown or MDX content.
EOF
    ;;
  minor)
    cat <<'EOF'
Guidance:
- This looks like low-risk repo or tooling work.
- Consider a targeted check such as `npm run markdownlint` or `npm run typecheck`, depending on the files changed.
EOF
    ;;
  poc)
    cat <<'EOF'
Guidance:
- Record what you validated and what is intentionally left experimental.
- Keep the diff easy to review and easy to revert.
EOF
    ;;
  small-feature|medium|large)
    cat <<'EOF'
Guidance:
- This change likely affects behavior or workflow.
- Run relevant automated validation before commit and record any gaps in your handoff or summary.
EOF
    ;;
  *)
    cat <<'EOF'
Guidance:
- Classification was inconclusive; use conservative judgment and run any relevant targeted checks.
EOF
    ;;
esac

cat <<'EOF'
Result:
- Advisory only for this pilot. No blocking checks are enforced by this script yet.
EOF
