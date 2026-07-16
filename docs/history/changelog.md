# TNC Sim Android — technical changelog

Append one short entry for every push, newest first. Keep user-facing summaries
in root `RELEASE_NOTES.md`; keep detailed resolved-bug evidence in root
`BUG_HISTORY.md`.

History through APP_VERSION 1.0.36 is preserved in
[`project-notes-through-1.0.36.md`](project-notes-through-1.0.36.md).

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
