#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
classification_output="$("${repo_root}/scripts/agent/classify-work.sh" "${1:-HEAD}")"

work_class="$(printf '%s\n' "${classification_output}" | awk -F= '/^class=/{print $2}')"
confidence="$(printf '%s\n' "${classification_output}" | awk -F= '/^confidence=/{print $2}')"
reason="$(printf '%s\n' "${classification_output}" | awk -F= '/^reason=/{print $2}')"

cat <<EOF
Seqera docs pilot pre-PR check
Work class: ${work_class} (${confidence} confidence)
Why: ${reason}
EOF

cat <<'EOF'
Before push or PR creation, confirm:
- The local diff has been reviewed by a human.
- The change summary is clear enough for reviewer handoff.
- Any relevant validation that was run is recorded.
- Any validation intentionally skipped is called out explicitly.
EOF

case "${work_class}" in
  docs)
    cat <<'EOF'
Suggested PR notes:
- Mark this as docs-only work.
- Mention that human diff review was completed.
EOF
    ;;
  minor|poc)
    cat <<'EOF'
Suggested PR notes:
- Summarize the bounded repo or workflow impact.
- Mention targeted checks run, if any.
EOF
    ;;
  small-feature|medium|large)
    cat <<'EOF'
Suggested PR notes:
- Summarize behavior changes and affected surfaces.
- Include validation and any remaining risk.
EOF
    ;;
esac

cat <<'EOF'
Result:
- Advisory only for this pilot. This script reminds the operator to pause before remote publication.
EOF
