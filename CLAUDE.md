# mohanan.uk — Claude Code project notes

Static single-file portfolio for **Bimal Mohanan / BMC — Bimal Mohanan Consulting**, deployed on Cloudflare Pages.

This file is loaded automatically by any Claude Code session opened in this repo. Keep it short, factual, and current — it's the briefing doc you'd hand a competent stranger.

---

## Layout

| Path                                                                                 | What it is                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html`                                                                         | The whole portfolio site (~3,800 lines, single file). Edit in place — no build step.                                                                                                                                                       |
| `footer.js`                                                                          | Canonical 4-column site footer. Self-contained — injects scoped HTML + CSS into any page containing `<div data-bmc-footer></div>`. **Single source of truth** for all new content pages. See the "Canonical site footer" convention below. |
| `_headers`                                                                           | Cloudflare Pages response headers (security + asset caching).                                                                                                                                                                              |
| `_redirects`                                                                         | Cloudflare Pages redirects (currently: 301 `www.mohanan.uk → mohanan.uk`).                                                                                                                                                                 |
| `brand/`                                                                             | BMC visual identity kit (Brand Kit hub, templates, `brand/brand.css` tokens). Served at `mohanan.uk/brand/`. **Use these tokens for all new BMC artefacts.**                                                                               |
| `insights/`                                                                          | Long-form articles. Each subdirectory is one article (`insights/itam-finops-self-funding/index.html`).                                                                                                                                     |
| `photo.jpg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` | Image assets shipped with the site.                                                                                                                                                                                                        |
| `og-image.html`                                                                      | Source for re-rendering the OG card via headless Chrome. `.gitignore`d; **do not ship**.                                                                                                                                                   |

---

## Brand

- **BMC gradient**: 135° `#7c4dff → #d13cc0 (52%) → #4f7cff` (or the slightly cooler `#6a3df5 → #d136e6 → #3a7df5` set used by the Brand Kit — both are in-family).
- **Type trio**: Inter (sans, primary), Fraunces (serif, italic-only emphasis), JetBrains Mono (code, metadata, the `~bmc` mark).
- **Lockup**: rounded-square gradient badge containing `~bmc` in JetBrains Mono Medium, `~` at `opacity:.72`.
- Tokens: `brand/brand/brand.css` (single source of truth). The portfolio's `#brand` section inlines a scoped `--bmc-*` block; the rebranded insights article inlines a comparable `:root` block with the same gradient stops.

When asked to create new BMC artefacts (slides, logs, dashboards, docs), inherit from these tokens — don't invent a parallel palette.

---

## Deploy

The repo is direct-upload to Cloudflare Pages (project name: `mohanan-uk`). There is no git source / build pipeline.

```bash
ship-mohanan-uk.sh        # git push + wrangler pages deploy + cache purge
deploy-mohanan-uk.sh      # just the wrangler deploy + cache purge (if already pushed)
```

Both scripts live in `~/.local/bin/` and authenticate via:

- `git`: macOS Keychain (`github.com` / `bmohanan`) — current PAT lacks `workflow` scope; updates to `.github/workflows/*.yml` need the GitHub web UI or `gh auth login` with a richer token.
- `wrangler` + Cloudflare API: macOS Keychain (`security find-generic-password -s "cloudflare-api-token-bmohanan"`)

Required CF token scopes: **Account · Cloudflare Pages:Edit**, **Account · Workers Scripts:Edit**, **Zone · DNS:Edit**, **Zone · Cache Purge:Purge**. The deploy script fail-fasts with a scope hint if a probe to the Pages API returns non-200.

**Push goes to two places** (configured 2026-05-26): a regular `git push` writes to both GitHub (canonical) and an iCloud bare-repo mirror at `~/Library/Mobile Documents/com~apple~CloudDocs/git-mirror/mohanan-uk.git`. The mirror is backup-only; recovery is `git clone` from that path.

A **GitHub Actions workflow** at `.github/workflows/deploy.yml` mirrors the local ship script as a CI fallback. Triggers on push to main; runs link-check (lychee) on PRs; needs repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (already set).

---

## Preview locally

```jsonc
// .claude/launch.json
{
  "name": "portfolio",
  "runtimeExecutable": "python3",
  "runtimeArgs": ["-m", "http.server", "8765"],
  "port": 8765,
}
```

The preview server is sandboxed to `/tmp/portfolio-fetch/` (TCC limits browser access to `~/Documents`). After editing `index.html` here, sync with:

```bash
cp -R ~/Documents/GitHub/mohanan-uk/. /tmp/portfolio-fetch/
```

Then browse at `http://localhost:8765/`.

---

## Local dev tools (in `~/.local/bin/` unless noted)

Standalone binaries — no Homebrew, no sudo needed.

| Tool         | What it's for                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `gh`         | GitHub API — repo metadata, PRs, releases, secrets. Use this before reaching for Chrome. Auth via `gh auth login` (one-time).                    |
| `lychee`     | Link checker. Also runs in CI; lefthook fires it on `git push`.                                                                                  |
| `shellcheck` | Bash linter. Wired into lefthook for any `*.sh` / `*.bash` change.                                                                               |
| `lefthook`   | Git-hooks runner. Config in repo's `lefthook.yml`; install with `lefthook install` (writes to `.git/hooks/`).                                    |
| `jq`         | JSON pretty-printer — replaces the `python3 -m json.tool` workaround.                                                                            |
| `mise`       | Runtime version manager. Successor to the hand-rolled `~/.local/node/` setup; not yet activated here.                                            |
| `prettier`   | Formatter for HTML/CSS/JS/YAML/MD. Installed via `~/.local/node/bin/prettier` (npm global). Runs in lefthook pre-commit on non-hand-tuned files. |

**Hook config (`lefthook.yml`):**

- `pre-commit`: shellcheck on staged `.sh`, prettier-check on staged `.yml/.json/.md/.css/.js` (skips the hand-tuned `index.html` + insights + brand/).
- `pre-push`: lychee with the same args as CI (skip linkedin / cdn-cgi / mailto / tel; accept 307/308/405/999).
- Skip hooks for one commit with `LEFTHOOK=0 git commit ...`.

Tools resolved via **absolute paths** in `lefthook.yml` because git launches hooks with a stripped `PATH`. For `prettier` specifically, the hook prefixes `PATH=$HOME/.local/node/bin:$PATH` because prettier's shebang is `#!/usr/bin/env node`.

## Conventions

- **Typography rule (set 2026-05-26):** **Centered titles, justified paragraphs** — every page in this repo uses `h1, h2 { text-align: center; }` and `p { text-align: justify; hyphens: auto; text-wrap: pretty; }`. The block lives inline in each page's `<style>` (no shared stylesheet). **Apply to any new page you create.** If a specific element looks wrong under it (a nav link, a chip, a caption), override with a more specific selector — don't remove the global rule.
- **Canonical site footer (set 2026-05-26):** **Every new content page in `root/` or `insights/` MUST end with the shared `/footer.js` footer.** Drop in:
  ```html
  <!-- Canonical BMC footer — see /footer.js -->
  <div data-bmc-footer></div>
  <script defer src="/footer.js"></script>
  ```
  just before `</body>`. The script injects the full 4-column footer (brand · Explore · Engage · Focus) with scoped styles under `.bmc-footer-host`, so it cannot collide with host-page CSS. **Edit the footer in `/footer.js` only** — that is the single source of truth. `index.html` is the one exception: it still inlines its footer (historical), and any change to `/footer.js` should be mirrored there so the two stay visually identical. The `brand/` sub-site has its own footer pattern (different visual identity) and the `404.html` page is intentionally minimal — leave both alone.
- **Don't rewrite the design system**, the bento layout, or the section order without explicit ask. Targeted edits inside a section are fine.
- **Don't add nav items beyond ~10** without re-verifying the 720–960px navbar overflow behaviour.
- **Forward-looking surfaces lead with AWS + Azure + Oracle** (his current positioning). Past timeline roles stay Azure-heavy because that's historically accurate.
- **Preserve verbatim phrasing** he's authored: "Won't stop.", "Same fire.", "PaaS and SaaS, new patterns every week. My own ci/cd.", and the FinOps stance paragraph.
- **OG image** changes need re-rendering `og-image.html` via headless Chrome and re-shipping `og-image.png`. Prime LinkedIn Post Inspector + Twitter Card Validator after.
- **Email metadata** (iCloud MX, SPF, DKIM, Apple verification TXT) is on this DNS zone — never touch those records when fixing routing.

---

## Quick reference

| Need                     | Where                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| Live site                | https://mohanan.uk/ (`www.mohanan.uk` 301s to apex)                                                |
| Brand Kit hub            | https://mohanan.uk/brand/                                                                          |
| Cloudflare Pages project | `mohanan-uk` (account `9d4d510b52ad7e294fce5415f544c587`, zone `05b4fd4ebaa7c8488749d4a695cdba82`) |
| Repo                     | https://github.com/bmohanan/mohanan-uk                                                             |
| Cal.com booking          | `mohanan/30-catch-up` on `cal.eu`                                                                  |
| Contact form backend     | Web3Forms (mailto fallback if it errors)                                                           |
