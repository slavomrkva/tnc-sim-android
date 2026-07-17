# Bug history — resolved bugs & how they were fixed

Archive of **resolved** bugs. Open/active bugs live in `TODO.md`; when one is
fixed it moves here (see the workflow rule in `NOTES.md` — "Bug lifecycle").

Keep, for every entry: the symptom as reported, the root cause once found, and
**every approach that was tried — including the ones that failed** and why. The
failed attempts are the most valuable part: they stop a future session (which
has no memory of this work) from burning real-device rebuild cycles re-trying
something already known not to work.

Newest first.

---

## 2026-07-17 — ported mobile numeric editing and TNC 640 RL/RR corrections
**Repos:** Android `tnc-sim-android` APP_VERSION 1.0.55, from accepted web v0.868 behavior.

### Ported correction
- Mobile minus input now normalizes to the front of BLK FORM, guided L/C/CC/CR and cycle Q values and toggles a negative value back to positive. The Q editor requests the decimal keypad.
- L builder fields are XYZ/R/F/M; temporary radius-compensation diagnostics while composing an L block are consolidated to one warning.
- The shared parser now retains exact supported contour primitives through RL/RR calculation instead of offsetting display chords. It covers L, C, CR, CT, CP, RND and CHF with exact analytic offsets, inner intersections, outer transition arcs and the correct RND tangency distance.

### Verification
- Android parser and focused editing regressions cover the reported PROGRAM.H geometry, valid/invalid radii, entry activation, R0, circles, RND, CR, CT and CP. Native keyboard/device verification remains a recommended final smoke check after installation.

## C19 — CALL LBL status was blank in the 3D simulation
**Repos:** Android `tnc-sim-android` APP_VERSION 1.0.47, ported from accepted
web v0.866. **Resolved/accepted:** 2026-07-16.

### Symptom and root cause
Expanded `CALL LBL n` segments use the source line of the call to preserve
editor highlighting. The status panel treated that line as ordinary source,
scanned past `LBL 0`, and displayed an empty LBL value.

### Accepted fix and verification
- Resolve an explicit `CALL LBL n` before scanning surrounding labels, keeping
  the existing source-line highlighting intact.
- Added a focused parser regression; all Android JavaScript regressions,
  Capacitor sync and debug build were run for this accepted port.

## C16 — Complete Learn correctness, content and visual audit
**Repos:** web `tnc-sim` and Android `tnc-sim-android`. **Resolved:** Android
APP_VERSION 1.0.42, ported from accepted web v0.858. **Accepted:** the lesson
package was accepted by the user on 2026-07-15; Android regressions and build
were verified during the port.

### Symptom and root causes
Some tasks could pass from starter code, comments, wrong-sign depths or motion
created by an older cycle. Several Q parameters were not scoped to the requested
cycle. Lesson explanations and hints included ambiguous machining claims, while
many diagrams were generic, too small, geometrically misleading or crowded by
labels. The Start here lesson repeated a long coach instead of giving the
student a short interactive first success.

### Attempts and accepted fixes
- Tightened grading around executable code, scoped cycle parameters and ordered
  sequences; all official solutions pass while starters and regression cheats
  fail.
- Improved lesson wording, progressive hints, control semantics, contrast and
  diagram alternatives.
- Rebuilt the reported Lesson 7, 9, 11, 13 and 14 visuals, including the 90°
  countersink and Cycle 208 edge-breaking geometry, then cleared intersecting
  labels through iterative preview review.
- Rebuilt Start here around read, try, check and improve, reduced its coach to
  five essential actions and made the warm-up genuinely checked.
- Replaced the cramped tutorial status graphics with full-width Goals, Hint and
  Check cards. The final web preview was accepted before this Android port.
- A final accepted refinement reduced Start here to two direct slides. The
  first shows task → editor → Check; the second explains the three progressive
  Hint levels in text without an image. The five-step coach stayed unchanged.

## Export (program and Tool Table) did nothing on device
**Repo:** Android `tnc-sim-android`. **Resolved:** APP_VERSION 1.0.36.
**Verified:** 2026-07-15 when the user confirmed the freshly built current APK
works correctly.

### Symptom and cause
Both exports used a Blob URL plus synthetic `<a download>`. Android WebView
reported download-attribute support but had no `DownloadListener`, so the path
silently saved nothing.

### Attempts and fix
- The Android-only helpers moved from shared `www/core/editor-core.js` to
  `www/android/app.js`.
- Official `@capacitor/filesystem` and `@capacitor/share` plugins write the file
  to app cache and open the system share sheet. Existing FileProvider cache
  coverage was reused; Capacitor sync registered both plugins. The first build
  was intentionally kept open pending device evidence, then accepted after the
  user's 1.0.36 APK test.

## C10 — Cycle 209 explicit zero values were ignored
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** Android 1.0.35. **Accepted:** 2026-07-15.

Single-line Cycle 209 defaults used `qm[n] || default`, discarding valid
`Q256=0` and `Q257=0`. The Android port uses
`Q !== undefined ? Q : default`, preserving full retract and single-pass
semantics. The user confirmed the current build works correctly.

## C9 — Short drilling/tapping retracts appeared to teleport
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** Android 1.0.33. **Accepted:** 2026-07-15.

Correct short cycle reversals could finish inside one display frame. Only
cycle-internal marked reversals now receive one held midpoint render. Cycle 200
remains FMAX and Cycle 209 remains synchronized at pitch × spindle speed;
ordinary rapid and arc motion is unchanged. Parser regressions passed and the
current build was accepted by the user.

## C8 — Cycle 208 used the wrong FAUTO feed and uneven helix infeed
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** Android 1.0.33. **Accepted:** 2026-07-15.

Cycle `FAUTO` incorrectly followed a later modal contour feed, and helix depth
calculation excluded Q200 safety travel. The port keeps `toolCallFeed` separate,
calculates full safeZ-to-depthZ revolutions, and enters solid stock through a
semicircular lead-in to constant-radius helices. Automated regressions passed;
the user accepted the current behavior.

## C7 — 3D stock updates stalled during machining
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** Android 1.0.31. **Verified:** 2026-07-15 in the current APK.

### Symptom and cause
Every cut rebuilt the complete voxel mesh, causing visible stalls while
Marching Cubes rescanned and re-uploaded the full grid.

### Attempts and fix
- Web profiling isolated pauses above 50 ms to stock rebuilds, not tool motion.
- Accepted web chunking divided the live mesh into 32×32-cell XY chunks with a
  one-cell dirty halo and exact-geometry regressions.
- Android ported chunking, recursive Measure raycasting, group-safe disposal,
  Low/Default/High profiles, and conservative 12M live / 32M Refine budgets.
  Automated geometry/profile tests and a debug build passed; the user then
  confirmed the current APK works correctly.

## C6 — Measure panel overlapped the mobile BLKFORM control
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** 2026-07-13 in web v0.828 and Android 1.0.30.

### Symptom
`BLKFORM OFF` appeared not to work on mobile, and enabling Measure placed its
floating panel over the BLKFORM button.

### Root cause and fix
`#measureOverlay` used the same fixed top strip as the wrapping canvas button
row. It now opens 6px below the measured bottom of the complete row and has a
mobile-safe maximum width. BLKFORM also forces an immediate WebGL repaint;
turning stock off closes and disables Measure. The web fix was verified at
390×844 and then deliberately ported to the Android source.

## C5 — Editor text passed behind mobile control panels
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** 2026-07-13 in web v0.825 and Android 1.0.30.

### Symptom
Program text scrolled behind Path functions, contextual editors and practice
controls because the whole editor panel was the scroll owner and those controls
were sticky overlays without firm vertical boundaries.

### Root cause and fix
The mobile editor is now a bounded flex column: its controls remain real rows
in normal flow, while only the code viewport scrolls in the remaining space.
Opening a context or practice row therefore reduces the code height instead of
covering it. Android keeps its existing WebView keyboard detection and hides
the practice row while the keyboard is open.

## C2 — Pure-Z R0 cancellation moved diagonally after an RL/RR contour
**Repos:** web `tnc-sim` (v0.822; `cc1f5ea`, merged by `67b8393`) + Android
`tnc-sim-android` (1.0.27; `55c0ace`).
**Resolved:** 2026-07-13. **Verified:** automated full-contour regression and
user testing on current mobile web and Android app.

### Symptom
At the end of an RL/RR contour, `L Z+20 R0` should retract straight up. The
simulator instead moved diagonally back toward the programmed contour and could
cut into the model while retracting.

### Repro contour
```text
LBL 1
L X-20 Y+235 Z+50 FMAX
L Z+Q1
L Y+230 FAUTO RL
L X+101
CHF 15
L Y+200
RND R5.5
L X+161
RND R5.5
L Y+230
CHF 15
L X+296
CHF 15
L Y+200
RND R5.5
L X+366
CHF 15
L Y+0
CHF 15
L X+0
CHF 15
L Y+231
CHF 16
L X+20
L Z+20 R0
LBL 0
END PGM PROGRAM
```

### Root cause
The shared radius-compensation postprocessor ended the RL/RR run at the
laterally offset physical tool-centre point. `offsetRun()` then rewrote only
the following R0 segment's `from`, while its `to` retained the nominal XY.
Because `L Z+20 R0` has zero programmed XY displacement, this manufactured a
diagonal exactly equal to the compensation offset. It was a path-segment bug,
not voxel cutting or rendering.

### Attempts and fix
- The first tempting one-endpoint changes were rejected during analysis:
  modifying only `from` preserves the diagonal, while modifying only `to`
  creates a segment discontinuity.
- Web branch `fix/c2-r0-pure-z` made a zero-XY R0 keep the full retract at the
  last compensated physical XY. That actual position is carried through later
  Z/state-only segments; the first later XY move leads out to its nominal
  target. The user verified the web result, then the identical shared-core
  change was ported to Android.
- Added `tests/parser-radius-comp.test.js` in both repos. It covers RL, RR,
  ordinary lateral R0, repeated Z retracts, a state-only segment, later XY
  lead-out, and the complete reported RND/CHF contour. Android also passed
  Capacitor sync and debug build before its main push.

The user subsequently confirmed the current Android app also retracts correctly.

---

## C4 — Placement of a newly inserted block relative to the active line
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved/accepted:** 2026-07-13 in web v0.823 and Android 1.0.28.
**Verified:** user testing in the current Android app.

### Original expectation
With the caret at the end of a non-empty active line, the next block should be
inserted directly below it without an extra blank line. On an empty active
line, the new block should replace that line.

### Resolution note
This entry described a desired interaction rule rather than a separately
isolated runtime failure. After the C1 focus/selection stabilisation, the user
confirmed that current insertion placement works according to their intended
workflow. It is not necessarily a literal implementation of every sentence in
the original expectation, but the observed behaviour is explicitly accepted
as correct. No additional C4 code change was made. Do not reopen or rewrite the
placement logic merely to match the old wording without a new concrete repro.

---

## C3 — RND/CHF occasionally inserted at the start of the program
**Repos:** web `tnc-sim` + Android `tnc-sim-android`.
**Resolved:** 2026-07-13 in web v0.823 and Android 1.0.28.
**Verified:** user no longer observes the symptom in the current Android app.

### Symptom
While programming, inserting RND or CHF could place the block at the very
start of the program instead of near the active line.

### Root cause and resolution
No independent RND/CHF parser or insertion defect was isolated. The strongest
evidence is that the stale/default selection produced by C1's competing focus
and delayed-refocus paths sometimes made insertion use position zero. C1
removed that race and stabilised the saved caret/selection. No separate C3 code
change was required, and the user confirmed the symptom is absent in the
current app. If it ever recurs, capture the active line, selection offsets and
exact insertion button; treat that as a new concrete repro rather than
reapplying the old focus timers.

---

## C1 — Mobile editor focus/scroll jumping during value editing and Learn
**Repos:** web `tnc-sim` (v0.819, `b1e111d`) + Android
`tnc-sim-android` (1.0.25, `e5a8fb6`).
**Resolved:** 2026-07-13. **Verified:** local forced-mobile browser checks and
user testing on real mobile web and Android devices.

### Symptom
Opening or editing a field could pull the editor toward the first line and
fight the user's scroll position. Showing/dismissing the keyboard and changing
or leaving a Learn task could also jump the editor or reopen the keyboard.

### Root cause
Focus had several competing owners. The hidden `#mobileInput` lived at the top
of the scroll flow, multiple render paths scheduled delayed focus, and
`_preserveEditorScroll()` repeatedly rewrote `scrollTop` during the keyboard
animation. A global blur handler then refocused the hidden input even after an
edit session had ended. Learn could replace the program while a field/Q/BLK
editor or pending focus still referred to the old code. Keyboard visibility
also lacked hysteresis in changing viewport regimes.

### Attempts and fix
- The old mitigation used delayed focus plus scroll restores at 60, 200, 450
  and 700 ms. It did not stabilise the UI; it fought the browser's own keyboard
  scrolling and produced the visible oscillation.
- Web branch `debug/c1-mobile-focus` replaced those timers with one cancellable
  focus request using `preventScroll`, moved the hidden input to a fixed
  off-content position, cancelled focus when editing ends, and explicitly
  closed editor input before Learn replaces/restores code. Keyboard state got
  a baseline fallback and open/close hysteresis. Forced-mobile checks confirmed
  no delayed refocus; real-phone web testing then confirmed the behaviour.
- Android branch `debug/c1-android-focus` ported the shared fix, removed its
  blur-refocus loop, and kept the Capacitor-specific remembered
  `visualViewport` baseline while adding hysteresis. The debug APK built and
  the user verified the app on device before merge.

The related C3 insertion report remains open for an independent retest; fixing
the shared focus race removes its suspected trigger but does not prove C3 by
itself.

---

## Learn tab: dead near-black empty strip at the bottom (single-column layout)
**Repos:** web `tnc-sim` (v0.812) + android `tnc-sim-android` (1.0.16).
**Resolved:** 2026-07-13. **Verified:** web headless (Playwright 390×844) + on
device.

### Symptom
In the single-column (mobile / narrow) layout, the **Learn** tab had a strip of
bare near-black page background at the bottom, between the last visible lesson
and the bottom tab bar — wasted space. Present on web too, smaller.

### Root cause
Unlike the Editor and 3D tabs, the Learn tab had **no full-height flex layout**.
It relied on default block flow plus an arbitrary cap
`body[data-mtab="learn"] #learnPanel .lp-body{max-height:calc(100svh - 220px)}`,
so `#learnPanel` ended at its content height and everything below it down to the
tab bar was body background (`--bg`).

### Fix
Gave the Learn tab the same full-height flex treatment as the 3D tab
(`body[data-mtab="learn"]{height:100svh;display:flex;flex-direction:column;
padding-bottom:calc(46px + safe-area)}`, `.sim-container`/`.sim-main` `flex:1`,
`#learnPanel` `flex:1`) and replaced the `max-height` cap with
`max-height:none;flex:1` so `.lp-body` fills to just above the tab bar. CSS-only,
in `www/android/styles.css` (mirrors `web/styles.css`). Measured gap panel→bar:
**71px → 0**.

---

## Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android)
**Repo:** android `tnc-sim-android`. **Long-running** — spanned `1.0.4`–`1.0.16`.
**Resolved:** 2026-07-13 (verified on a real device at `1.0.16`).

### Symptom (as originally reported, translated)
"When I go to edit a parameter and the keyboard slides up, the bottom panel
where you switch Editor/3D/Learn slides up with it (a remnant stays visible above
the keyboard). And when I hide the keyboard, the bottom panel is just empty black
space, then disappears." Three distinct problems: (1) the bar sitting above/over
the keyboard while open, (2) a black gap above the keyboard, (3) the bar
vanishing/breaking after the keyboard closes.

### Hard constraint (kept costing time — read this first)
**This class of bug is invisible in browser/`htmlpreview` preview — it only
reproduces in a real on-device Capacitor build.** Inside the Capacitor WebView
`window.innerHeight` resizes together with the keyboard, and the soft-keyboard /
`adjustResize` behaviour doesn't exist in a desktop browser. Every fix had to be
verified on a physical phone (full `npx cap sync android` + clean rebuild). A
temporary on-device **debug HUD** (added `1.0.14`, removed `1.0.17`) was what
finally broke the blind-guessing loop — it painted live viewport metrics
(`baseline`, `visualViewport.height`, `innerHeight`, diff, `kbdOpen`, the
`kbd-open`/`editing-field` classes, and the `.mtab-bar` rect) so real numbers
could be read off the device.

### Approaches tried, in order
1. **`visibility:hidden` on the bar** — flipping visibility on a
   `transform:translateZ(0)`-promoted GPU layer left a stale blank/black
   composited tile on Android WebView instead of hiding. **Failed.** Replaced by
   `transform:translateY(120%)` (keeps the layer composited the whole time).
2. **focus/blur on the hidden `#mobileInput`** to drive hide/show — the app
   deliberately *keeps that input focused* after the keyboard is dismissed (so
   the next quick edit needs no re-tap), so `blur` never reliably fires on close
   → bar stuck hidden forever, tab navigation dead. **Failed.** Focus state ≠
   keyboard-visibility state in this app.
3. **`offset = window.innerHeight - visualViewport.height`** detection — reads
   ~0 forever in the WebView (both shrink together). **Failed.** Replaced by a
   remembered **baseline**: `kbdOpen = (baseline - visualViewport.height) > 140`,
   baseline re-synced whenever the viewport is at least as tall as it. This is
   the surviving detection (NOTES rule #7).
4. **Missing `android:windowSoftInputMode="adjustResize"`** in the manifest —
   without it Android *pans* instead of resizing, so `visualViewport` never
   changes and no JS detection can fire. Added it (NOTES rule #9). Necessary,
   not sufficient on its own.
5. **Native `@capacitor/keyboard` plugin** (`keyboardDidShow`/`Hide`) — looked
   "correct" but on a real device the bar slid up with the keyboard and left a
   black gap; the discrete events don't stay in sync with the resize animation
   the way a continuous `visualViewport` listener does. **Reverted** (`1.0.9`→
   `1.0.10`), dependency uninstalled. **Do not retry without on-device iteration.**
6. **Only one of two bottom reservations dropped while `kbd-open`** — the black
   gap was two independent `padding-bottom` reservations: `.editor-panel`
   (dropped in `1.0.7`) **and** `body{padding-bottom:50px}` (missed until
   `1.0.11`). Both now drop via `html.kbd-open body[data-mtab="editor"]{
   padding-bottom:0 !important}` (NOTES rule #11). This killed the black gap.
7. **Bar `transition:transform .16s ease`** — the bar *animated* (slid down)
   when the keyboard opened, sliding through the region the keyboard was
   animating into = the "flicker on open" and the feeling that the bar moves.
   Removed in `1.0.15` (NOTES rule #13): the bar still hides while typing
   (mandatory — a static `bottom:0` bar sits on the keyboard in the resizing
   WebView) but now hides/appears **instantly**, no animation.

### Final resolved state
- Detection: remembered-baseline `visualViewport` height (rule #7).
- `android:windowSoftInputMode="adjustResize"` in the manifest (rule #9).
- Bar hidden via `transform:translateY(120%)`, **no transition** (rule #13).
- Both bottom `padding-bottom` reservations dropped while `kbd-open` (rule #11).
- Confirmed on a real device at `1.0.16`: nothing left above the keyboard, no
  black gap, bar returns cleanly on close, no flicker/animation. Debug HUD
  removed in `1.0.17`.
