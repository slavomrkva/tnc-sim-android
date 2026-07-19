/* turnstile-config.js — Cloudflare Turnstile PUBLIC site key (Android app).
 *
 * Safe to commit: the site key is public by design. The matching SECRET lives
 * only as a Cloudflare Worker secret on the website side (the app reuses the
 * tncsim.org /api/report endpoint). See the website's docs/bug-report-setup.md.
 *
 * This is the SAME production Site Key as the website. The Invisible widget
 * lists "localhost" as an allowed hostname because the app's WebView runs at
 * https://localhost. Never use Cloudflare's always-pass test key in production.
 */
window.TURNSTILE_SITE_KEY = '0x4AAAAAAD4vKPMHsScVzVSp';
