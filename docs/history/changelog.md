# TNC Sim Android — technical changelog

Append one short entry for every push, newest first. Keep user-facing summaries
in root `RELEASE_NOTES.md`; keep detailed resolved-bug evidence in root
`BUG_HISTORY.md`.

History through APP_VERSION 1.0.36 is preserved in
[`project-notes-through-1.0.36.md`](project-notes-through-1.0.36.md).

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
