# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs

## C27 — Guided block editing could lose its insertion and contour context
**Reported:** 2026-07-23. **Repro:** insert TOOL CALL and then another block;
edit an L coordinate and press I; press CHF while an L editor is active; or
compose the reported Q41 / RL / CHF / RND contour one block at a time.
### Symptom
Automatic M3/M8 blocks had no descriptions and the next insertion could still
use the TOOL CALL anchor instead of M8. New L blocks forced visible FAUTO
instead of leaving F undefined. Whole-block programming keys could interrupt
an active field editor, and Edit L incremental input used a stale mobile
textarea selection instead of the current guided field. A just-inserted
CHF/RND or RL activation also raised an error before its following contour
block existed, even though the completed reported contour is valid.
### Attempts
- Attempt 1 — APP_VERSION 1.0.88 adds the standard M3/M8 comments and carries
  the TOOL CALL exit anchor through M8; leaves new positioning F undefined in
  accordance with the TNC 640 modal numeric-feed rule; locks the whole-block
  keypad for every active FM/BLK/M/Q/TOOL DEF/cycle editor; toggles incremental
  state on the current Edit L coordinate; and defers only incomplete trailing
  CHF/RND and RL diagnostics until Run/Step. The complete supplied Q41 contour
  now has a parser regression proving three CHF elements and the RND remain in
  the compensated toolpath.
- Attempt 2 — the APP_VERSION 1.0.87 device screenshot identified the actual
  generated errors at B1/B2/B3: zero-value/orphan RND and CHF blocks had been
  inserted at the program start by the editor conflict, so each bad block
  produced multiple diagnostics. APP_VERSION 1.0.88 also expands Problems to a
  large scrollable panel when its summary is tapped, instead of limiting nine
  diagnostics to the previous 140 px strip.
- Attempt 3 â€” a follow-up audit found keyboard-adjacent regressions beyond the
  reported contour: decimal F could be silently collapsed, cycle FAUTO was
  hidden, Q navigation crossed an empty block, and code/delete/Import/Learn
  transitions could leave stale editor owners. APP_VERSION 1.0.88 blocks
  decimal feed entry without rewriting a legacy imported value on open, keeps
  FAUTO visible, stops Q navigation at the logical boundary, centralizes editor
  cleanup and tracks empty TOOL DEF panels explicitly. Focused runtime and
  lifecycle regressions cover each case.
- Attempt 4 — the completed contour additionally ended with `CHF 3`,
  `L IX+3.02`, then `L IY+10 R0`. The analytic RL/RR engine treated the
  terminal 180-degree CHF departure as an ordinary inside corner and demanded
  an impossible intersection between opposite parallel offsets. APP_VERSION
  1.0.88 now recognizes only this degenerate-CHF departure at the end of a
  compensated run, preserves the earlier established tool-center lead-out, and
  adds the exact full-program regression. Genuine inside-corner errors remain
  blocking. The local TNC 640 manual does not explicitly define this
  degenerate departure, so it remains a narrow compatibility exception.
### Status
Focused editor, keyboard, validation and analytic radius-compensation
regressions pass. Keep open until APP_VERSION 1.0.88 is accepted on the real
Android device.

## C26 — Enter on a cycle can create a misnumbered row outside the program
**Reported:** 2026-07-23. **Repro:** place the native Android keyboard caret at
the end of any physical row of a multi-row `CYCL DEF`, then press Enter. Also
test Enter with `END PGM` active, both with a caret and a selected row.
### Symptom
The inserted empty row could follow physical textarea rows instead of the
logical TNC block, appear after `END PGM`, or be counted independently from the
cycle's numbering. Selection, Problems labels, delete and command insertion
used related but inconsistent physical-row rules.
### Attempts
- Attempt 1 — APP_VERSION 1.0.87 introduces a single logical NC block model for
  gutter numbering, grouped selection, Enter, programming-key insertion,
  deletion, Problems labels and export. `CYCL DEF` plus directly following Q
  rows is one block; Enter from any of those rows inserts/reuses one numbered
  empty block after it; Enter on `END PGM` is a no-op. A fallback also repairs
  Android IMEs that report Enter as `insertText` with null data. Parser and
  validator cycle-Q boundaries were aligned with the same rule.
### Status
All 24 Android regression tests and JavaScript syntax checks pass. Keep open
until APP_VERSION 1.0.87 is accepted on the real Android device. The matching
web-repository port is intentionally deferred to the next step.

## C23 — Closing practice leaves the Lesson autosave status visible
**Reported:** 2026-07-21. **Repro:** open a lesson practice, tap its close
button, and return to the editor without switching tabs.
### Symptom
The main program is restored, but the header can still say that lesson changes
are not saved. Switching to Simulate and back finally changes it to Saved.
### Attempts
- Attempt 1 — the web preview traced this to the practice close button calling
  partial `learnExit()` while `LEARN.open` remained true. Ported its complete
  `closeLearn()` handler and matching regression to Android APP_VERSION 1.0.73.
- Attempt 2 — user testing found the 700 ms green/orange alternation distracting
  while typing. Android APP_VERSION 1.0.74 now schedules one write within 30
  seconds, uses a neutral pending state and reserves orange for a real storage
  error, matching web v0.893.
### Status
Automated web and Android verification is in progress. Keep open until the
corrected preview and APK are accepted on their real target devices.

## C22 — Cutting-logic reference failures in feeds and fixed cycles
**Reported:** 2026-07-19. **Repro:** run the offline cutting-logic reference and
the focused parser cycle regression against GitHub `main`.
### Symptom
Decimal `TOOL CALL F` values were truncated; `L ... FAUTO` retained the prior
modal numeric feed instead of using the active Tool Call feed; Cycle 208 ignored
documented `Q370`; and Cycle 209 accepted negative `Q336` although the documented
range is `0...360` degrees.
### Attempts
- Attempt 1 — traced all four failures to the shared parser and verified the
  applicable TNC 640 rules in the locked offline manuals.
- Attempt 2 — ported the corrected web parser semantics and matching focused
  regressions into the Android `www/core` implementation.
- Attempt 3 — exposed the complete Cycle 208 parameter set, including Q370, in
  both insertion interfaces and added Q370 to every supplied Cycle 208 demo and
  applicable Learn program in Android APP_VERSION 1.0.70 and web v0.890.
### Status
Implemented in Android APP_VERSION 1.0.70 together with web v0.890. Automated
verification is in progress; keep open until both repository changes and a
real simulator/device run are accepted.

## V1 — Verify the new one-click Bug Report / Suggestion in the app
**Added:** 2026-07-18. **Repro:** APP_VERSION 1.0.64, on a real device with
network. This is a verification task, not a bug — no defect is known yet.
### What to check
The bug report was reworked to post to the website's `/api/report`
(`https://tncsim.org/api/report`) with invisible Cloudflare Turnstile, opening a
public GitHub issue without a GitHub account. It could not be exercised in the
build environment (Google SDK/Maven hosts were network-blocked, so no APK could
be built; the live Turnstile + network round-trip needs a device).
- Open "Report a problem" and "Suggest improvement": confirm the state-based
  prefill and the public-GitHub warning, and that Suggest keeps Send disabled
  until text is entered.
- Send a real report; confirm a public GitHub issue is created and its URL is
  shown in the dialog. Suggestions must NOT attach the NC program; bug reports
  must include it plus version/device/validator/area/JS-error context.
- Confirm graceful errors when offline / verification unavailable.
### Prerequisites (server-side, one-time)
- Cloudflare Worker deployment from web PR #19, with encrypted
  `GITHUB_TOKEN` + `TURNSTILE_SECRET_KEY` secrets set and deployed.
- Real Turnstile Site Key is installed in `www/android/turnstile-config.js`,
  matching the website key. The widget must keep `localhost` as an allowed
  hostname so the WebView can obtain a token.
### Status
APP_VERSION 1.0.65 contains the production public Site Key. Keep open until the
Worker is merged/configured and the complete flow is verified on a device.
Cross-repo setup lives in `slavomrkva/tnc-sim` PR #19 and its
`docs/bug-report-setup.md`.

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
- Attempt 12 — BrowserStack Redmi Note 12 Pro accepted the manual Compatibility
  choice but the same WebView session then reported `C15-MC0`; fully closing and
  reopening the app started the simulation successfully. The initial 3D error
  panel that offers Compatibility now tells the user to perform that full restart.
### Status
APP_VERSION 1.0.62 needs a simple device check: Normal mode must never switch
automatically; the Compatibility control outside the WebGL surface and the
error-panel button must both enter Compatibility mode and return to Normal without
losing the program. The Simulation controls drawer must preserve its open state,
the reduced mesh must cut material with all visible stock walls, and the restart
instruction must be readable on the failing device. Keep C15 open until that
manual flow is verified.

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
