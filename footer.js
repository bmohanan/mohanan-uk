/* =====================================================================
 * BMC canonical footer — single source of truth.
 *
 * Usage on any page:
 *   <div data-bmc-footer></div>
 *   <script defer src="/footer.js"></script>
 *
 * The script replaces the marker with the full <footer> markup and
 * injects scoped styles. All styles are nested under .bmc-footer-host
 * so they cannot leak into or be overridden by host-page CSS.
 *
 * If you change the footer, change it HERE — every page picks it up
 * on next deploy. No per-page edits needed.
 *
 * NOTE: index.html historically inlined the footer with the same class
 * names (.footer-grid, .footer-brand, etc.). Those inline rules are
 * unscoped and target the OLD inline <footer>. The script-injected
 * footer uses the same class names but they all sit under
 * .bmc-footer-host, so the two systems do not collide.
 * ===================================================================== */
(function () {
  "use strict";

  // ----- Font dependency (Space Grotesk) ---------------------------------
  // The wordmark uses Space Grotesk. Most BMC pages already load it, but
  // some (e.g. the insights article) don't. Inject it on demand.
  if (!document.querySelector('link[href*="Space+Grotesk"]')) {
    if (
      !document.querySelector(
        'link[href*="fonts.googleapis.com"][rel="preconnect"]',
      )
    ) {
      const pre = document.createElement("link");
      pre.rel = "preconnect";
      pre.href = "https://fonts.googleapis.com";
      document.head.appendChild(pre);
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }

  // ----- Scoped styles ---------------------------------------------------
  const css = `
    .bmc-footer-host {
      /* Scoped design tokens — won't leak to host page. */
      --bmc-text-1: rgba(255, 255, 255, 0.96);
      --bmc-text-2: rgba(255, 255, 255, 0.7);
      --bmc-text-3: rgba(255, 255, 255, 0.5);
      --bmc-accent-cyan: #00d9ff;
      --bmc-glass-bg: rgba(255, 255, 255, 0.04);
      --bmc-glass-border: rgba(255, 255, 255, 0.1);
      --bmc-radius-pill: 999px;

      padding: 64px 0 32px;
      border-top: 1px solid var(--bmc-glass-border);
      margin-top: 80px;
      color: var(--bmc-text-2);
      font-family: 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
    .bmc-footer-host *, .bmc-footer-host *::before, .bmc-footer-host *::after { box-sizing: border-box; }
    .bmc-footer-host a { color: inherit; text-decoration: none; }
    .bmc-footer-host h4, .bmc-footer-host p, .bmc-footer-host ul { margin: 0; padding: 0; }
    .bmc-footer-host ul { list-style: none; }

    .bmc-footer-host .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 24px;
    }
    .bmc-footer-host .footer-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 40px;
    }
    .bmc-footer-host .footer-lockup {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0 0 18px;
    }
    .bmc-footer-host .brand-mark {
      width: 38px; height: 38px;
      border-radius: 11px;
      background: linear-gradient(135deg, #b15cff 0%, #ff2ec8 100%);
      display: grid; place-items: center;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.04em;
      box-shadow: 0 0 24px rgba(177, 92, 255, 0.4);
    }
    .bmc-footer-host .brand-mark--lg {
      width: 56px; height: 56px;
      border-radius: 14px;
      font-size: 15px;
      letter-spacing: -0.05em;
      box-shadow: 0 0 32px rgba(177, 92, 255, 0.45);
    }
    .bmc-footer-host .footer-wordmark {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .bmc-footer-host .footer-wordmark-name {
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--bmc-text-1);
      letter-spacing: -0.01em;
    }
    .bmc-footer-host .footer-wordmark-sub {
      font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: var(--bmc-text-3);
      letter-spacing: 0.02em;
      margin-top: 2px;
    }
    .bmc-footer-host .footer-tagline {
      font-size: 14px;
      line-height: 1.6;
      color: var(--bmc-text-2);
      margin: 0 0 14px;
      max-width: 420px;
    }
    .bmc-footer-host .footer-location {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 12px;
      color: var(--bmc-text-3);
      letter-spacing: 0.04em;
      margin: 0;
    }
    .bmc-footer-host .footer-col-title {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      color: var(--bmc-text-3);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin: 0 0 16px;
    }
    .bmc-footer-host .footer-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .bmc-footer-host .footer-links a {
      font-size: 14px;
      color: var(--bmc-text-2);
      transition: color 0.2s ease;
    }
    .bmc-footer-host .footer-links a:hover { color: var(--bmc-accent-cyan); }
    .bmc-footer-host .footer-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .bmc-footer-host .footer-tags li {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 11px;
      color: var(--bmc-text-3);
      padding: 5px 10px;
      border-radius: var(--bmc-radius-pill);
      background: var(--bmc-glass-bg);
      border: 1px solid var(--bmc-glass-border);
    }
    .bmc-footer-host .footer-bottom {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      align-items: center;
      justify-content: space-between;
      padding-top: 28px;
      border-top: 1px solid var(--bmc-glass-border);
    }
    .bmc-footer-host .footer-meta {
      color: var(--bmc-text-3);
      font-size: 13px;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
    }
    .bmc-footer-host .footer-socials { display: flex; gap: 10px; }
    .bmc-footer-host .social {
      width: 42px; height: 42px;
      border-radius: 12px;
      background: var(--bmc-glass-bg);
      border: 1px solid var(--bmc-glass-border);
      display: grid; place-items: center;
      color: var(--bmc-text-2);
      transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
    }
    .bmc-footer-host .social:hover {
      color: var(--bmc-accent-cyan);
      border-color: rgba(0, 217, 255, 0.5);
      background: rgba(0, 217, 255, 0.08);
      transform: translateY(-2px);
    }
    .bmc-footer-host .social svg { width: 18px; height: 18px; }

    @media (max-width: 880px) {
      .bmc-footer-host .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    }
    @media (max-width: 560px) {
      .bmc-footer-host .footer-grid { grid-template-columns: 1fr; gap: 28px; }
    }
  `;

  const style = document.createElement("style");
  style.setAttribute("data-bmc-footer-styles", "");
  style.textContent = css;
  document.head.appendChild(style);

  // ----- Markup ----------------------------------------------------------
  // Keep links absolute (e.g. /#about, https://...) so the footer works
  // from any depth in the URL tree (insights/foo/, brand/bar/, etc.).
  const html = `
<footer class="bmc-footer-host">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-lockup">
          <span class="brand-mark brand-mark--lg" aria-hidden="true">~bmc</span>
          <div class="footer-wordmark">
            <span class="footer-wordmark-name">Bimal Mohanan</span>
            <span class="footer-wordmark-sub">Consulting</span>
          </div>
        </div>
        <p class="footer-tagline">
          Bimal Mohanan Consulting &mdash; cloud transformation, FinOps and operational
          excellence for AWS &amp; Azure enterprises. Strategy, delivery and the
          commercial fluency to make hyperscalers pay back their promise.
        </p>
        <p class="footer-location">London &middot; United Kingdom &middot; Open to UK &amp; EMEA engagements</p>
      </div>

      <div class="footer-col">
        <h4 class="footer-col-title">Explore</h4>
        <ul class="footer-links">
          <li><a href="/#about">About</a></li>
          <li><a href="/#skills">Skills</a></li>
          <li><a href="/#foundations">Foundations</a></li>
          <li><a href="/#experience">Experience</a></li>
          <li><a href="/#leadership">Leadership</a></li>
          <li><a href="/#now">Now</a></li>
          <li><a href="/#testimonials">Recommendations</a></li>
          <li><a href="/insights/itam-finops-self-funding/">Insights &mdash; ITAM &amp; FinOps</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-col-title">Engage</h4>
        <ul class="footer-links">
          <li><a href="/#schedule">Schedule a 30-min call</a></li>
          <li><a href="/#contact">Send a message</a></li>
          <li><a href="mailto:bimal@mohanan.uk">bimal@mohanan.uk</a></li>
          <li><a href="tel:+447301288711">+44 7301 288 711</a></li>
          <li><a href="https://www.linkedin.com/in/bimalmohanan/" target="_blank" rel="noopener">LinkedIn &mdash; /in/bimalmohanan</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 class="footer-col-title">Focus</h4>
        <ul class="footer-tags">
          <li>AWS</li>
          <li>Azure</li>
          <li>Hybrid Cloud</li>
          <li>FinOps</li>
          <li>Unit Economics</li>
          <li>Managed Services</li>
          <li>Pre-Sales</li>
          <li>Psychological Safety</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-meta">
        BMC &mdash; Bimal Mohanan Consulting &middot; &copy; <span data-bmc-footer-year>2026</span> &middot; Crafted in the UK
      </div>
      <div class="footer-socials">
        <a class="social" href="https://www.linkedin.com/in/bimalmohanan/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
        </a>
        <a class="social" href="mailto:bimal@mohanan.uk" aria-label="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </a>
        <a class="social" href="tel:+447301288711" aria-label="Phone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>`.trim();

  // ----- Inject ----------------------------------------------------------
  const marker = document.querySelector("[data-bmc-footer]");
  if (marker) {
    marker.insertAdjacentHTML("afterend", html);
    marker.remove();
  } else {
    // No marker — append to end of body. Useful for quick adoption.
    document.body.insertAdjacentHTML("beforeend", html);
  }

  // Set the year dynamically so the footer ages gracefully.
  document.querySelectorAll("[data-bmc-footer-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
