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
  code: Chrome works on the same GPU while the embedded WebView fails.
- Attempt 2 — local diagnostic APP_VERSION 1.0.39 proved on RMX3785 / Android
  13 / Mali-G57 that WebGL2 with antialias and stencil was created, then lost
  after 5.67 seconds; constructor fallback attempts therefore never ran.
- Attempt 3 — local APP_VERSION 1.0.40 forced WebGL1 with antialias/stencil off,
  low-power preference and pixel ratio 1. It rendered successfully on Xiaomi
  Redmi Note 9 and Realme 8; BrowserStack Free did not expose the failing models
  for the same-build comparison.
- Attempt 4 — release candidate APP_VERSION 1.0.41 keeps the normal renderer on
  healthy devices. Only an unrestored startup context loss stores a safe-mode
  marker, preserves the program/view, and reloads once with explicit WebGL1.
  The marker is tied to the WebView user-agent, so a WebView update retries the
  normal quality renderer automatically.
### Status
Preparing versionName 1.0.3 / versionCode 4 for Google Play Closed testing.
Keep this open until the adaptive build is verified on an originally failing
device; the successful safe-mode tests do not provide that same-device A/B yet.

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
