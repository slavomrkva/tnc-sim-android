# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs

## C15 — Embedded Android WebView loses the 3D EGL backing
**Reported:** 2026-07-15. **Repro:** current APK on BrowserStack Redmi Note 12
Pro / Android 12; the same device renders `tncsim.org` correctly in Chrome.
### Symptom
The APK shows the 3D fallback before simulation. Device logs report
`Failed to create EGLImage: EGL_BAD_PARAMETER`, an incompatible
`EGLImageBacking`, and the resulting invalid Chromium raster mailbox.
### Attempts
- Attempt 1 — compatibility analysis isolated the failure below parser/voxel
  code: web and Android `render3d.js` are identical, and Chrome works on the
  same GPU while the embedded WebView fails.
- Attempt 2 — Android APP_VERSION 1.0.39 adds a read-only diagnostic block to
  the existing fallback. It records renderer attempts, WebGL1/2, context
  attributes, GPU identity, buffer/viewport sizes, time to context loss and
  the WebView user-agent, with a copy button for short remote-device sessions.
- Attempt 3 — the 1.0.39 device result proved that WebGL2 with antialias and
  stencil was created, then lost after 5.67 seconds; the lighter creation
  attempts never ran. APP_VERSION 1.0.40 therefore forces an explicit WebGL1
  context with antialias/stencil off, low-power preference and pixel ratio 1.
### Status
Awaiting one BrowserStack run of the 1.0.40 safe-renderer debug APK. The
on-screen diagnostic remains active if this compatibility mode also fails.

## C12 — Light-theme 3D table grid is too dark
**Reported:** 2026-07-15. **Repro:** open the 3D simulation in the light theme.
### Symptom
The table grid uses near-black lines against the light scene.
### Attempts
- Attempt 1 — ported the user-accepted web v0.847 neutral-grey GridHelper
  palette and live theme recoloring into Android APP_VERSION 1.0.38.
### Status
Automated mobile-layout browser regression and Android debug build passed;
app/device visual verification remains before moving to `BUG_HISTORY.md`.

## C14 — Revealed hints leak into a newly opened lesson
**Reported:** 2026-07-15. **Repro:** reveal hints, return to the lesson list, then
open another lesson.
### Symptom
The newly opened lesson can retain the previous task and revealed hints.
### Attempts
- Attempt 1 — ported the user-accepted web reset of `task`, results, and hint
  level on every newly opened lesson into Android APP_VERSION 1.0.38. The
  desktop-only forced scroll was deliberately not ported.
### Status
Automated mobile-layout browser regression and Android debug build passed;
app/device verification remains before moving to `BUG_HISTORY.md`.

<!-- Template for a new bug (copy below "Open bugs"):

## <short title> — <one-line symptom>
**Reported:** <date>. **Repro:** <steps / device / only-on-device?>
### Symptom
<verbatim if possible>
### Attempts
- Attempt 1 — <what / hypothesis>: <result on device>.
- Attempt 2 — …
### Status
<current best understanding / next thing to try>
-->
