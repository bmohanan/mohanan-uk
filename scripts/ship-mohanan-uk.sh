#!/bin/bash
# One-shot: push to GitHub + deploy to Cloudflare Pages.
#
# Pairs `git push` (silent via macOS Keychain github.com creds) with
# `deploy-mohanan-uk.sh` (silent via macOS Keychain CF API token).
# Use this when you've finished editing + committing — it ships.
#
# Usage: ship-mohanan-uk.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$HOME/Documents/GitHub/mohanan-uk"
cd "$REPO_DIR"

# Push only if there's something to push (@{u} = upstream of current branch — git syntax, not shell brace expansion)
# shellcheck disable=SC1083
if [ "$(git rev-list --count @{u}..HEAD 2>/dev/null || echo 1)" -gt 0 ]; then
  echo "==> git push"
  git push
else
  echo "==> git: already up-to-date with origin/main"
fi

echo ""
echo "==> deploy"
"$SCRIPT_DIR/deploy-mohanan-uk.sh"
