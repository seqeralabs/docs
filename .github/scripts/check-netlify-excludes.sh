#!/usr/bin/env bash
# Reminds contributors which doc sections are included/excluded in Netlify
# deploy previews based on the current netlify.toml deploy-preview context.
# Non-blocking: exits 0 always.

TOML="$(git rev-parse --show-toplevel)/netlify.toml"

if [[ ! -f "$TOML" ]]; then
  exit 0
fi

# Parallel arrays: var name and friendly label
VARS=(
  EXCLUDE_CHANGELOG
  EXCLUDE_PLATFORM_ENTERPRISE
  EXCLUDE_PLATFORM_CLOUD
  EXCLUDE_PLATFORM_API
  EXCLUDE_PLATFORM_CLI
  EXCLUDE_PLATFORM_OPENAPI
  EXCLUDE_MULTIQC
  EXCLUDE_FUSION
  EXCLUDE_WAVE
)
LABELS=(
  "Changelog"
  "Platform Enterprise"
  "Platform Cloud"
  "Platform API"
  "Platform CLI"
  "Platform OpenAPI"
  "MultiQC"
  "Fusion"
  "Wave"
)

# Extract vars set to "true" in the deploy-preview context block
in_block=false
excluded_vars=""

while IFS= read -r line; do
  if [[ "$line" =~ \[context\.deploy-preview\.build\.environment\] ]]; then
    in_block=true
    continue
  fi
  if $in_block && [[ "$line" =~ ^\[.+\] ]]; then
    break
  fi
  if $in_block; then
    for var in "${VARS[@]}"; do
      if [[ "$line" =~ $var[[:space:]]*=[[:space:]]*\"true\" ]]; then
        excluded_vars="$excluded_vars $var"
      fi
    done
  fi
done < "$TOML"

included=()
excluded=()

for i in "${!VARS[@]}"; do
  var="${VARS[$i]}"
  label="${LABELS[$i]}"
  if [[ "$excluded_vars" == *" $var"* ]]; then
    excluded+=("  - $label")
  else
    included+=("  - $label")
  fi
done

echo ""
echo "┌─ Netlify deploy preview scope (netlify.toml) ──────────────────────┐"
if [[ ${#included[@]} -gt 0 ]]; then
  echo "│ INCLUDED in preview build:"
  for s in "${included[@]}"; do echo "│ $s"; done
fi
if [[ ${#excluded[@]} -gt 0 ]]; then
  echo "│ EXCLUDED from preview build:"
  for s in "${excluded[@]}"; do echo "│ $s"; done
fi
echo "│"
echo "│ To change scope, edit [context.deploy-preview.build.environment]"
echo "│ in netlify.toml before opening your PR."
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""

exit 0
