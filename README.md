# mohanan.uk

Personal portfolio for **Bimal Mohanan** — cloud transformation leader, FinOps practitioner, CEO of **BMC (Bimal Mohanan Consulting)**. Live at [mohanan.uk](https://mohanan.uk).

Single-file static site (one `index.html`), deployed on **Cloudflare Pages**, with a brand kit and long-form insights under their own paths.

## Structure

```
index.html              ← whole site, single file
_headers                ← Cloudflare Pages security + cache rules
_redirects              ← www → apex 301
brand/                  ← BMC Brand Kit hub + templates (served at /brand/)
  brand/brand.css       ← single source of truth for brand tokens
insights/               ← long-form articles
  itam-finops-self-funding/
photo.jpg               ← profile photo
favicon.svg             ← gradient mark
og-image.png            ← social-card image (regenerated from og-image.html)
```

## Stack

- **Hosting**: Cloudflare Pages (project `mohanan-uk`, direct-upload via `wrangler`)
- **DNS / TLS / CDN**: Cloudflare
- **Booking**: Cal.com (`mohanan/30-catch-up`)
- **Contact form**: Web3Forms with mailto fallback
- **No build step** — hand-edit `index.html`, ship.

## Local dev

```bash
python3 -m http.server 8765      # serve current dir
open http://localhost:8765/      # view
```

## Deploy

Two helper scripts in `~/.local/bin/` (Cloudflare API token in macOS Keychain):

```bash
ship-mohanan-uk.sh    # git push + wrangler pages deploy + edge cache purge
deploy-mohanan-uk.sh  # just the wrangler deploy + purge
```

## Brand kit

The BMC visual identity lives at [/brand/](https://mohanan.uk/brand/) — `~bmc` lockup, three-stop violet→magenta→blue gradient, Inter / Fraunces / JetBrains Mono. Tokens at `brand/brand/brand.css`. Templates: Logo System, Deck, Letter, Cost Review, Proposal, Company Overview.

## Insights

- [ITAM and FinOps Programmes That Fund Themselves](https://mohanan.uk/insights/itam-finops-self-funding/) — a self-funding model for cost-optimisation programmes.

---

© Bimal Mohanan / BMC. Source MIT-licenced where not personal — please don't reuse the photo, bio or brand mark.
