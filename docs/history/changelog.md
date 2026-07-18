# TNC Sim Android — technical changelog

Append one short entry for every push, newest first. Keep user-facing summaries
in root `RELEASE_NOTES.md`; keep detailed resolved-bug evidence in root
`BUG_HISTORY.md`.

History through APP_VERSION 1.0.36 is preserved in
[`project-notes-through-1.0.36.md`](project-notes-through-1.0.36.md).

## APP_VERSION 1.0.59 — header shows the document (file) name

- The `#progTitleName` header no longer always reads "PROGRAM.H". It now tracks
  a `_docName` set from the file identity: the friendly demo name on demo pick,
  the imported filename on import, the saved filename on export, and `program.H`
  on Clear. `editor-core.js` owns `_docName`/`_setDocName`; `panels.js` renders
  it; `app.js` seeds it with the starter demo. Root cause: every demo/imported
  program uses `BEGIN PGM PROGRAM` internally, so the old `_progFileName(code)`
  parse always yielded `PROGRAM.H`.
- Export prefers a `.H` `_docName` (round-trips an imported filename) and
  otherwise falls back to the BEGIN PGM-derived name, then reflects it in the
  header. Adds `tests/doc-name-header.test.js` and NOTES rule 20.

## APP_VERSION 1.0.58 — defer in-progress radius-comp errors to Run

- Starting an RL/RR contour no longer flags two red errors while typing. The
  compensation completeness checks ("RL/RR still active … program R0 before END
  PGM" / "still active at END PGM") in `validateProgram` are now gated behind a
  new `liveEdit` argument, and the "contour not finished yet" `_rcReport`
  diagnostics carry an `incomplete`→`rcDefer` flag.
- `runValidation(liveEdit)` (editor-core) defaults to `liveEdit=true` and skips
  those deferred diagnostics; `onRun`/`onStep` (sim-controls) now call
  `runValidation(false)` so the checks run — and block Run — at simulation start.
- Genuine geometry errors (tool radius too large, non-positive effective radius,
  no valid intersection, inner corner too small) still show live, per user
  choice. Added NOTES rule 19 and `tests/radius-comp-live-defer.test.js`; bumped
  the version-marker assertion.

## APP_VERSION 1.0.57 — rapid-into-material collision warns without stopping

- `rapidCollision` (voxel-cutting.js) no longer sets `mode='idle'`, so a
  detected FMAX-into-material collision reports its pinned red warning but the
  simulation plays through to the end instead of halting. Real machine-proven
  programs (e.g. a rapid onto a pre-drilled floor) must not be blocked.
- Re-report guard changed from `mode==='idle'` to `window._collisionActive`, so
  only the first hit is reported and it stays latched via `updateStatus` until
  reset; `mode` is left untouched.
- Verified headless against a user program whose only real hit is a 0.5 mm
  rapid past a Ø15 CYCL 208 pre-drill floor: at High quality the warning fires
  and all segments still run; the 0.5 mm step is sub-voxel at Def/Low/compat so
  nothing is detected there (documented as a known voxel-resolution limit).
- Added NOTES rule 18. Bumps the version-marker assertion in
  `android-webgl-compat.test.js`.

## APP_VERSION 1.0.56 — fix mojibake in reset status line

- `parser-engine.js` reset built the status message from a double-encoded
  em-dash (UTF-8 `—` mangled through Windows-1252 into `â€"`), so the 3D view
  showed `Ready â€" press Run`. Replaced the corrupted literal with a real `—`
  (bytes `e2 80 94`). The web repo `tnc-sim` was unaffected — its literal was
  already correct — so this is Android-only.
- Side effect fixed: `view2d.js` guards a collision-active status against the
  exact string `'Ready — press Run'`; the corrupted literal never matched, so
  the reset message was mishandled while a collision was active. It matches now.

## APP_VERSION 1.0.55 — mobile editor and analytic radius compensation

- Ported the accepted web mobile sign toggle and decimal Q-field keyboard; L builder order is XYZ/R/F/M.
- Ported analytic TNC 640 RL/RR geometry for the supported L/C/CC/CR/CT/CP/RND/CHF contour subset and regressions for the supplied valid-radius contour.
- Collapsed temporary RL/RR diagnostics while a mobile L block is still being edited; full errors return after editing or when running the simulation.

## APP_VERSION 1.0.54 — manual Compatibility mode

- Removed the automatic context-loss watcher and its persistent WebView-UA
  decision. Normal rendering remains active until the user explicitly selects
  Compatibility mode.
- Added the same manual mode switch as a compact Compatibility toggle in a
  collapsible Simulation controls drawer outside the WebGL surface and to every
  3D error panel. The drawer groups Quality and Mode and remembers its open
  state, while Speed sits with Measure and the other simulation-surface controls.
  Refine occupies a dedicated second row when it becomes available, preventing
  the first-row controls from shifting after a simulation.
  The mode toggle remains accessible if the whole rendering surface turns white.
  Switching preserves the current program/view, reloads cleanly, persists only
  the user's choice and always offers a return to Normal mode.
- Clears the legacy APP_VERSION 1.0.53 automatic marker and uses a double-sided
  uniform material in Compatibility mode so no stock wall is back-face culled.

## APP_VERSION 1.0.53 — adaptive voxel compatibility candidate

- Redmi Note 14 completed visible material cutting in APP_VERSION 1.0.52,
  including the diagnostic High profile, confirming the stable monolithic GPU
  layout on an originally failing Mali device.
- Removed all globally forced diagnostic flags. Healthy devices again use the
  normal renderer, chunked mesh and 100/150/200 profiles.
- A persistent visible context loss is remembered for the exact Android
  WebView user-agent; the restart combines explicit WebGL1/DPR 1 with the
  verified monolithic mesh and reduced 50/75/100 profiles. A WebView update
  clears the marker and retries the normal renderer.
- Hides and guards Refine only in compatibility mode and changes its quality
  help to the real reduced resolutions; normal devices retain Refine unchanged.

## APP_VERSION 1.0.52 — monolithic voxel compatibility diagnostic

- Vivo V21 failed before playback even at the reduced 50-level Low profile,
  proving that cutting workload and raw voxel count were not the trigger.
- Restores one complete low-resolution voxel mesh instead of the July 14
  chunk group, removes its vertex-color buffer and uses a single-sided uniform
  Lambert material while preserving actual material removal.

## APP_VERSION 1.0.51 — reduced-voxel ramp diagnostic

- Re-enabled voxel cutting under forced WebGL1 with live Low/Def/High test
  resolutions 50/75/100 and matching 2.0/1.5/1.0 mm cell caps.
- Starts at Low so one clean Vivo V21 session can establish the highest stable
  geometry level without first allocating the previously failing mesh.

## APP_VERSION 1.0.50 — no-voxel Mali diagnostic

- Retains forced WebGL1, DPR 1, the stock box, grid, labels, lights, tool and
  render loop while omitting only voxel-grid and Marching Cubes mesh creation.
- Provides a same-device split between voxel GPU buffers and the remaining
  WebView/Three.js scene; this is diagnostic and not a release quality mode.

## APP_VERSION 1.0.49 — Mali WebGL1 first-boot diagnostic

- Forces the existing low-memory WebGL1 path before any normal renderer is
  created, and clamps pixel ratio 1 before Three.js allocates its backing store.
- Handles a null renderer as a controlled 2D fallback and reports whether
  WebGL1 context creation or Three.js renderer construction failed.

## APP_VERSION 1.0.48 — resilient Android WebGL recovery

- Replaced the silent localStorage/reload dependency with layered local,
  session and one-shot URL safe-mode recovery plus explicit navigation.
- Persistent visible context loss now switches to WebGL1 regardless of time
  since app boot; background losses wait until the app returns to foreground.
- Added visible failure diagnostics and regressions for two listeners, bridge
  readiness, storage failures, navigation fallback and late 3D activation.

## APP_VERSION 1.0.47 — called-LBL simulation status

- Ported the accepted web v0.866 `CALL LBL` status fix only; Android retains
  its mobile-native F selector and receives no desktop feed-menu changes.
- Added a parser regression for called and fall-through LBL status values.

## APP_VERSION 1.0.46 — first tutorial orientation lesson

- Ported only `L00` Start here from the older preview branch onto the current
  Android main: three information slides, visual Hint 1–3 progression and an
  ungraded editor/3D walkthrough.
- Hid the solution control for this intro lesson and added focused regressions,
  while preserving all mobile layout, WebView and voxel-limit behavior.

## APP_VERSION 1.0.45 — HEIDENHAIN cycle, cutting and validator corrections

- Ported accepted web v0.863 cycle 200/201/208/209 behavior, including explicit
  zero handling, depth validation, safe retracts, feeds, dwell events, spindle
  direction, Q239/Q403, Q334/Q342/Q351, RCUTS, ANGLE and PITCH.
- Ported DL/DR and RL/RR/R0 path corrections, Cycle 208 effective-radius and
  centre-before-retract handling, and parser diagnostics in the Problems panel.
- Restored Complete Part and Angle Mill L-block paths and added detailed cycle,
  validator, segment-order and demo regressions while preserving Android export
  and the lower Android voxel-memory budget.

## APP_VERSION 1.0.44 — Tool Table workflow hardening

- Ported the accepted web v0.862 Tool Table fixes for validated add, edit,
  delete, import and export behavior into the shared Android source.
- Added transactional import normalization, unique tool-number enforcement,
  safe text rendering, consistent simulation invalidation and regression tests.
- Made TL/RT replacement selection, DR geometry and TIME2/CUR.TIME behavior
  effective during simulation while preserving the Android native share export.

## APP_VERSION 1.0.43 — accepted shorter tutorial port

- Ported the accepted web v0.861 two-slide Start here lesson and its simpler
  diagram into Android.
- Kept the existing five-step coach and the Android-only no-forced-scroll Hint
  behavior unchanged.

## APP_VERSION 1.0.42 — accepted Learn audit port

- Ported the accepted web v0.858 Learn content, hints, grading rules, diagrams,
  tutorial flow, coach and accessibility improvements into the shared Android
  Learn modules.
- Added Android regression coverage that verifies all official answers, rejects
  starters and commented-out answers, and catches wrong Cycle 208 depth signs.
- Preserved the deliberate Android behavior that does not force desktop-panel
  scrolling after revealing a hint.

## APP_VERSION 1.0.41 — adaptive Android WebGL compatibility

- Prepared Play release 1.0.3 / versionCode 4 from the current accepted main.
- Kept normal WebGL quality by default and enabled the explicit low-memory
  WebGL1 renderer only after an early context loss remains unrestored.
- Persisted safe mode per Android WebView user-agent, restored the current
  program/view across the one-time reload, and retried normal mode after a
  WebView update.
- Added regression coverage for normal, failed and safe renderer paths.

## APP_VERSION 1.0.38 — machining demos and accepted web ports

- Added four shared demo programs with parser and motion regression coverage.
- Ported the accepted neutral-grey light-theme grid and new-lesson hint reset.
- Deliberately excluded the web desktop-only Learn panel scrolling change.

## APP_VERSION 1.0.37 — documentation damage control

- Closed Export and chunked 3D meshing after the user confirmed the current APK
  works correctly; added the missing Android lifecycle records for C8–C10.
- Replaced the growing root project notes with a concise current contract,
  archived the complete former notes, and routed future technical entries here.
- Tightened `CLAUDE.md` session routing so history is loaded only when relevant.
