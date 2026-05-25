# mohanan.uk — Claude Code project notes

Static single-file portfolio for **Bimal Mohanan / BMC — Bimal Mohanan Consulting**, deployed on Cloudflare Pages.

This file is loaded automatically by any Claude Code session opened in this repo. Keep it short, factual, and current — it's the briefing doc you'd hand a competent stranger.

---

## Layout

| Path | What it is |
|---|---|
| `index.html` | The whole portfolio site (~3,800 lines, single file). Edit in place — no build step. |
| `_headers` | Cloudflare Pages response headers (security + asset caching). |
| `_redirects` | Cloudflare Pages redirects (currently: 301 `www.mohanan.uk → mohanan.uk`). |
| `brand/` | BMC visual identity kit (Brand Kit hub, templates, `brand/brand.css` tokens). Served at `mohanan.uk/brand/`. **Use these tokens for all new BMC artefacts.** |
| `insights/` | Long-form articles. Each subdirectory is one article (`insights/itam-finops-self-funding/index.html`). |
| `photo.jpg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` | Image assets shipped with the site. |
| `og-image.html` | Source for re-rendering the OG card via headless Chrome. `.gitignore`d; **do not ship**. |

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

- `git`: macOS Keychain (`github.com` / `bmohanan`)
- `wrangler` + Cloudflare API: macOS Keychain (`security find-generic-password -s "cloudflare-api-token-bmohanan"`)

Required token scopes: **Account · Cloudflare Pages:Edit**, **Account · Workers Scripts:Edit**, **Zone · DNS:Edit**, **Zone · Cache Purge:Purge**. If a deploy fails with `code 10000 Authentication error`, the token is missing a scope — see Cloudflare → Profile → API Tokens.

---

## Preview locally

```jsonc
// .claude/launch.json
{ "name": "portfolio", "runtimeExecutable": "python3",
  "runtimeArgs": ["-m", "http.server", "8765"], "port": 8765 }
```

The preview server is sandboxed to `/tmp/portfolio-fetch/` (TCC limits browser access to `~/Documents`). After editing `index.html` here, sync with:

```bash
cp -R ~/Documents/GitHub/mohanan-uk/. /tmp/portfolio-fetch/
```

Then browse at `http://localhost:8765/`.

---

## Conventions

- **Don't rewrite the design system**, the bento layout, or the section order without explicit ask. Targeted edits inside a section are fine.
- **Don't add nav items beyond ~10** without re-verifying the 720–960px navbar overflow behaviour.
- **Forward-looking surfaces lead with AWS + Azure + Oracle** (his current positioning). Past timeline roles stay Azure-heavy because that's historically accurate.
- **Preserve verbatim phrasing** he's authored: "Won't stop.", "Same fire.", "PaaS and SaaS, new patterns every week. My own ci/cd.", and the FinOps stance paragraph.
- **OG image** changes need re-rendering `og-image.html` via headless Chrome and re-shipping `og-image.png`. Prime LinkedIn Post Inspector + Twitter Card Validator after.
- **Email metadata** (iCloud MX, SPF, DKIM, Apple verification TXT) is on this DNS zone — never touch those records when fixing routing.

---

## Quick reference

| Need | Where |
|---|---|
| Live site | https://mohanan.uk/ (`www.mohanan.uk` 301s to apex) |
| Brand Kit hub | https://mohanan.uk/brand/ |
| Cloudflare Pages project | `mohanan-uk` (account `9d4d510b52ad7e294fce5415f544c587`, zone `05b4fd4ebaa7c8488749d4a695cdba82`) |
| Repo | https://github.com/bmohanan/mohanan-uk |
| Cal.com booking | `mohanan/30-catch-up` on `cal.eu` |
| Contact form backend | Web3Forms (mailto fallback if it errors) |
