# TNC Sim Android — technical changelog

Append one short entry for every push, newest first. Keep user-facing summaries
in root `RELEASE_NOTES.md`; keep detailed resolved-bug evidence in root
`BUG_HISTORY.md`.

History through APP_VERSION 1.0.36 is preserved in
[`project-notes-through-1.0.36.md`](project-notes-through-1.0.36.md).

## APP_VERSION 1.0.40 — Android safe WebGL test

- Forced the diagnostic Android build to explicit WebGL1 with antialias and
  stencil disabled, low-power preference and pixel ratio 1 after 1.0.39 proved
  that the preferred WebGL2 context was created and then lost after 5.67s.
- Kept the on-screen diagnostics active to verify the effective context and
  capture any remaining loss on the remote device.

## APP_VERSION 1.0.39 — Android WebGL diagnostics

- Added an on-screen diagnostic block to the Android 3D fallback for the
  WebView-only EGL/Skia failure, without changing renderer behaviour.
- Captures context creation attempts, WebGL/GPU details, buffer size, context
  loss timing and user-agent, with one-tap copying for remote-device tests.

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
