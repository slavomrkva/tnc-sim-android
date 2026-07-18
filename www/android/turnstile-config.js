/* turnstile-config.js — Cloudflare Turnstile PUBLIC site key (Android app).
 *
 * Safe to commit: the site key is public by design. The matching SECRET lives
 * only as a Cloudflare Pages secret on the website side (the app reuses the
 * tncsim.org /api/report endpoint). See the website's docs/bug-report-setup.md.
 *
 * ▶ Use the SAME site key as the website (web/turnstile-config.js), and make
 *   sure the Turnstile widget lists "localhost" as an allowed hostname — the
 *   app's WebView runs at https://localhost.
 *
 * The value shipped here is Cloudflare's official "always passes, invisible"
 * TEST key so the report dialog works before a real widget is configured.
 * Replace it with the production site key before release.
 */
window.TURNSTILE_SITE_KEY = '1x00000000000000000000BB'; // <-- PUBLIC placeholder (test key). REPLACE ME.
