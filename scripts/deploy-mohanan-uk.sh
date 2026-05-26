#!/bin/bash
# Deploy mohanan.uk to Cloudflare Pages (project: mohanan-uk899)
#
# Pulls the Cloudflare API token from macOS Keychain (no plaintext on disk),
# stages only the 6 production files (excluding .git, .gitignore, wrangler.jsonc,
# og-image.html, scripts, etc.), and pushes via `wrangler pages deploy`.
#
# Usage: deploy-mohanan-uk.sh
# Exit codes: 0 success, 1 missing prereqs, 2 token missing, 3 deploy failed

set -euo pipefail

REPO_DIR="$HOME/Documents/GitHub/mohanan-uk"
STAGE_DIR="$(mktemp -d -t mohanan-uk-deploy)"
PROJECT_NAME="mohanan-uk"
ACCOUNT_ID="9d4d510b52ad7e294fce5415f544c587"
KEYCHAIN_SERVICE="cloudflare-api-token-bmohanan"

# Resolve wrangler from a fixed path so the script works regardless of the
# caller's PATH (subshells from Claude Code, cron, etc.). Falls back to PATH
# if the fixed path is missing for any reason.
WRANGLER="$HOME/.local/node/bin/wrangler"
[ -x "$WRANGLER" ] || WRANGLER="$(command -v wrangler 2>/dev/null || true)"

# wrangler's shebang is `#!/usr/bin/env node`, so node also needs to be on
# PATH (just resolving the wrangler binary itself isn't enough).
[ -d "$HOME/.local/node/bin" ] && export PATH="$HOME/.local/node/bin:$PATH"

# shellcheck disable=SC2329  # cleanup is invoked indirectly via `trap` below
cleanup() { rm -rf "$STAGE_DIR"; }
trap cleanup EXIT

# ---- Prereqs ----
[ -n "$WRANGLER" ] && [ -x "$WRANGLER" ] || { echo "ERROR: wrangler not found at $HOME/.local/node/bin/wrangler or on PATH"; exit 1; }
[ -d "$REPO_DIR" ] || { echo "ERROR: $REPO_DIR missing"; exit 1; }

# ---- Token from Keychain ----
CLOUDFLARE_API_TOKEN="$(security find-generic-password -s "$KEYCHAIN_SERVICE" -a "$USER" -w 2>/dev/null || true)"
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "ERROR: no Cloudflare API token in Keychain (service: $KEYCHAIN_SERVICE)"
  echo "Store one with:"
  echo "  security add-generic-password -s '$KEYCHAIN_SERVICE' -a \"\$USER\" -w 'YOUR_TOKEN'"
  exit 2
fi

# ---- Fail-fast scope check ----
# Probe the Pages projects endpoint — if this 200s, Cloudflare Pages:Edit is on the token.
# Any other code means the rest of the script will explode obscurely, so explain why now.
SCOPE_HTTP="$(curl -s -o /dev/null -w '%{http_code}' \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")"
if [ "$SCOPE_HTTP" != "200" ]; then
  echo "ERROR: Cloudflare API token rejected by Pages endpoint (HTTP $SCOPE_HTTP)"
  echo ""
  echo "The token in Keychain '$KEYCHAIN_SERVICE' is missing one or more of:"
  echo "  - Account → Cloudflare Pages:Edit   (required for wrangler pages deploy)"
  echo "  - Account → Workers Scripts:Edit    (for one-time domain admin)"
  echo "  - Zone → DNS:Edit                    (for DNS work)"
  echo "  - Zone → Cache Purge:Purge           (for the post-deploy cache flush)"
  echo ""
  echo "Edit the token at https://dash.cloudflare.com/profile/api-tokens"
  echo "(editing keeps the same secret, so no Keychain change needed)"
  exit 2
fi

# ---- Stage only public files ----
echo "Staging public files -> $STAGE_DIR"
for f in index.html 404.html footer.js photo.jpg favicon.svg favicon-32.png apple-touch-icon.png og-image.png _headers _redirects; do
  if [ -f "$REPO_DIR/$f" ]; then
    cp "$REPO_DIR/$f" "$STAGE_DIR/$f"
  else
    echo "WARNING: $f missing from repo, skipping"
  fi
done

# Stage public directories (BMC brand kit + long-form insights).
for d in brand insights; do
  if [ -d "$REPO_DIR/$d" ]; then
    cp -R "$REPO_DIR/$d" "$STAGE_DIR/$d"
  fi
done

ls -lh "$STAGE_DIR"

# ---- Deploy ----
echo ""
echo "Deploying to Cloudflare Pages project: $PROJECT_NAME"
export CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"

if "$WRANGLER" pages deploy "$STAGE_DIR" \
     --project-name="$PROJECT_NAME" \
     --branch=main \
     --commit-dirty=true; then
  echo ""
  echo "Deploy succeeded."

  # ---- Purge Cloudflare edge cache so the new build is visible immediately,
  #      not after the default 30-60s cache TTL on the prior build.
  #      Needs Zone → Cache Purge:Purge on the API token (added 2026-05-26).
  ZONE_ID="05b4fd4ebaa7c8488749d4a695cdba82"
  echo ""
  echo "Purging Cloudflare edge cache..."
  if curl -sf -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
       -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       -H "Content-Type: application/json" \
       --data '{"purge_everything":true}' >/dev/null; then
    echo "  cache purged — mohanan.uk is live now."
  else
    echo "  WARNING: cache purge failed (token may lack Cache Purge scope). Edits will appear within ~60s."
  fi
  exit 0
else
  echo "ERROR: wrangler pages deploy failed"
  exit 3
fi
