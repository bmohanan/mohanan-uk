#!/bin/bash
# Symlink the ship + deploy scripts into ~/.local/bin/ so they're on PATH
# and edits to the in-repo versions take effect immediately.
#
# Idempotent: re-running replaces any stale symlinks/files at the targets.
#
# Usage: ./scripts/install-symlinks.sh

set -euo pipefail

REPO_SCRIPTS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/.local/bin"

[ -d "$TARGET_DIR" ] || mkdir -p "$TARGET_DIR"

for s in ship-mohanan-uk.sh deploy-mohanan-uk.sh; do
  SRC="$REPO_SCRIPTS/$s"
  DST="$TARGET_DIR/$s"
  [ -f "$SRC" ] || { echo "ERROR: $SRC missing"; exit 1; }
  [ -x "$SRC" ] || chmod +x "$SRC"
  rm -f "$DST"
  ln -s "$SRC" "$DST"
  echo "  ✓ $DST -> $SRC"
done

# Sanity: warn if ~/.local/bin isn't on PATH
case ":$PATH:" in
  *":$TARGET_DIR:"*) ;;
  *) echo ""
     echo "WARNING: $TARGET_DIR is not on your PATH."
     echo "         Add this to your shell rc (~/.zshrc or ~/.bashrc):"
     echo "           export PATH=\"\$HOME/.local/bin:\$PATH\""
     ;;
esac
