# scripts/

Deploy + ship automation for mohanan.uk. **Single source of truth** for
the build-and-deploy flow — these scripts used to live in `~/.local/bin/`
where they were untracked and could silently drift (e.g. when a new
file like `footer.js` was added but the deploy allowlist forgot it).

## Files

| File                   | What it does                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `ship-mohanan-uk.sh`   | One-shot: `git push` → `deploy-mohanan-uk.sh`. The command you run after committing.          |
| `deploy-mohanan-uk.sh` | Stages the public files into a tmp dir, runs `wrangler pages deploy`, purges Cloudflare edge. |
| `install-symlinks.sh`  | One-time per Mac: symlinks both scripts into `~/.local/bin/` so they're on `PATH`.            |

## Usage (on this Mac, already wired up)

```bash
# Make a commit, then:
ship-mohanan-uk.sh

# Just re-deploy (no commit needed — e.g. after editing files on disk):
deploy-mohanan-uk.sh
```

## Setting up on a fresh Mac

```bash
# 1. Clone the repo
git clone git@github.com:bmohanan/mohanan-uk.git ~/Documents/GitHub/mohanan-uk
cd ~/Documents/GitHub/mohanan-uk

# 2. Store the Cloudflare API token in Keychain (one-time)
security add-generic-password -s "cloudflare-api-token-bmohanan" -a "$USER" -w 'YOUR_TOKEN'

# 3. Install symlinks into ~/.local/bin/ (assumes ~/.local/bin is on PATH)
./scripts/install-symlinks.sh

# 4. Ship something
ship-mohanan-uk.sh
```

## Why symlinks (not copies)

A symlink means `~/.local/bin/ship-mohanan-uk.sh` always resolves to the
repo version. Edit the script in `scripts/`, commit, and it's immediately
live on this Mac — no second step to remember.

If we'd kept copies, a change to the deploy allowlist could land in the
repo and never reach the user's `PATH`, silently shipping the wrong file
set (or missing files like `footer.js`).

## Deploy allowlist

`deploy-mohanan-uk.sh` stages a **hardcoded list** of public files (plus
the `brand/` and `insights/` directories). If you add a new top-level
asset (e.g. another `*.js`, an `.xml` sitemap, a `manifest.json`),
**add it to the `for f in ...` loop** or it won't ship.
