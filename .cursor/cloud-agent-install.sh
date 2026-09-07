#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"
export DISABLE_RSPACK_INCREMENTAL="${DISABLE_RSPACK_INCREMENTAL:-true}"

# Node 22+ is required (see package.json engines and .nvmrc).
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but not installed." >&2
  exit 1
fi

node_major="$(node -p "process.versions.node.split('.')[0]")"
if [[ "${node_major}" -lt 22 ]]; then
  echo "Node.js >= 22 is required (found $(node --version))." >&2
  exit 1
fi

# package-lock.json pins darwin-arm64 @rspack bindings; use npm install on Linux.
if [[ ! -d node_modules ]]; then
  npm install
else
  npm install --prefer-offline --no-audit --no-fund
fi

npm run fetch-docs-oss

echo "Install complete."
