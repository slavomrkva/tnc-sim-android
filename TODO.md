# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Feature requests

- **German (DE) localization for the app.** Web (`slavomrkva/tnc-sim`) already
  has a full EN/DE language switch: UI, Help/Tool Table tooltips, M list +
  auto-inserted M comments, cycle names/parameters, demo program comments,
  all 16 Learn lessons, and the About popup — see that repo's
  `docs/history/changelog.md` v0.869–v0.872. Port the same web-only overlay
  approach here (`www/android/`), keeping `www/core/` byte-identical to web's
  `core/`. **Not started — do not begin until explicitly requested.**

## Open bugs

## C18 — HEIDENHAIN cycles, compensated cutting and validator audit
**Reported:** 2026-07-16. **Repro:** cycles 200/201/208/209, Complete Part and
Angle Mill on the accepted web v0.863 programs.
### Symptom
Explicit zero and positive depths, second clearances, Cycle 208 effective
radius/retract sequencing, small RL/RR radii and programmed DL/DR could produce
wrong or silently omitted paths. Parser-only geometry and unsupported-block
errors were not visible in Problems; Complete Part and Angle Mill exposed the
silent L-block failure.
### Attempts
- Attempt 1 — ported the user-accepted web v0.863 implementation into Android
  APP_VERSION 1.0.45 from a fresh GitHub `main`, preserving the Android native
  export path and its conservative 12-million-voxel WebView memory guard.
- Attempt 2 — ported the cycle audit, exact demo, tool-table and validator
  regressions. They verify segment order, coordinates, feeds/FMAX, directions,
  pass counts, diagnostics and absence of rejected cutting paths.
### Status
Web behavior is accepted. Keep this Android entry open until the debug APK is
exercised on a device. Thread-flank fidelity, machine Q403 caps and
version-dependent Q342 behavior additionally require an offline control or a
real HEIDENHAIN machine.

## C17 — Tool Table CRUD, parameters and import/export were inconsistent
**Reported:** 2026-07-16. **Repro:** add or renumber tools, import malformed or
duplicate JSON, lock a called tool, or change DR/TIME2 and rerun simulation.
### Symptom
Tool numbers could collide, imported rows bypassed validation and unsafe text
could be rendered as HTML. Several changes left stale simulation state, and
TL/RT, DR and TIME2/CUR.TIME behavior did not match their descriptions.
### Attempts
- Attempt 1 — ported the user-accepted web v0.862 fix into Android APP_VERSION
  1.0.44, retaining the Android-only Filesystem + Share export implementation.
  Added shared regression coverage for CRUD, normalized transactional import,
  safe rendering, replacement tools, geometry compensation and tool life.
### Status
Web behavior is accepted. All nine Android JavaScript regressions, Capacitor
sync and the APP_VERSION 1.0.44 debug APK build pass; keep open until the APK
workflows are verified on a device.

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
- Attempt 5 — BrowserStack OPPO Reno6 reproduced a real persistent loss on
  APP_VERSION 1.0.46: 3D rendered for about 0.5 seconds, the canvas went white,
  then the generic context-loss message remained permanently instead of
  reloading into compatibility mode. APP_VERSION 1.0.48 hardens native Android
  detection, uses session/URL recovery if local storage fails, replaces the
  fragile same-page reload with an explicit safe-mode navigation, waits through
  background losses, and shows a diagnostic code if navigation still fails.
- Attempt 6 — BrowserStack Vivo V21 / Mali-G57 on APP_VERSION 1.0.48 proved
  that navigation reached safe mode, but the immediate post-crash WebGL1 boot
  could not construct a renderer (`3D view could not start`). APP_VERSION
  1.0.49 is a same-device diagnostic: it starts WebGL1 before any WebGL2 loss,
  clamps DPR 1 before allocation, keeps 2D alive after a null renderer and
  distinguishes WebGL1 context failure from Three.js construction failure.
- Attempt 7 — A clean Vivo V21 run on APP_VERSION 1.0.49 created WebGL1 and
  rendered briefly, then lost the context within about 0.5 seconds despite
  antialias/stencil off, low-power preference and DPR 1. APP_VERSION 1.0.50
  keeps the stock, grid, labels, lights, tool and render loop but omits only the
  voxel grids and chunked Marching Cubes mesh to isolate the largest GPU-buffer
  allocation from the rest of the scene.
- Attempt 8 — APP_VERSION 1.0.50 remained stable on the same Vivo V21 with the
  voxel/Marching Cubes path disabled; the expected stock box and toolpath were
  visible but material was not cut. APP_VERSION 1.0.51 restores cutting with
  50/75/100 live voxel resolutions and 2.0/1.5/1.0 mm cell caps, starting at
  Low so the stable mesh threshold can be tested in one session.
- Attempt 9 — APP_VERSION 1.0.51 lost the context on Vivo V21 immediately after
  opening 3D even at Low, before playback began. This rules out cutting load
  and a simple voxel-count threshold. APP_VERSION 1.0.52 keeps the reduced Low
  grid but restores the pre-July-14 monolithic GPU layout: one full mesh, one
  single-sided Lambert material and no vertex-color buffer.
- Attempt 10 — APP_VERSION 1.0.52 rendered and cut material successfully on an
  originally failing Redmi Note 14, including diagnostic High (resolution 100).
  APP_VERSION 1.0.53 turns that proven renderer into the safe-mode half of the
  adaptive flow: normal devices retain chunked 100/150/200 rendering; only a
  device with a persistent visible context loss restarts into WebGL1/DPR 1,
  monolithic 50/75/100 rendering keyed to its current WebView user-agent.
  Refine is unavailable only in that mode to avoid its 300–500 coloured mesh.
- Attempt 11 — APP_VERSION 1.0.54 removes the untestable automatic decision.
  Normal rendering stays selected until the user taps Compatibility in either
  the persistent Simulation controls drawer outside the WebGL surface or a 3D
  error panel;
  the same control returns to Normal mode. The manual choice survives restart,
  while the old automatic
  marker is cleared. The reduced monolithic mesh now uses DoubleSide so the top
  and positive side walls are not hidden by back-face culling.
### Status
APP_VERSION 1.0.54 needs a simple device check: Normal mode must never switch
automatically; the Compatibility control outside the WebGL surface and the
error-panel button must both enter Compatibility mode and return to Normal without
losing the program. The Simulation controls drawer must preserve its open state,
and the reduced mesh must cut material with all visible stock walls. Keep C15
open until that manual flow is verified.

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
