# TNC Sim (Android) — Release notes

Per-release "What's new", newest first. **Copy the top entry into the Play
Console "What's new" field** when you ship that release. The detailed
technical/developer changelog lives in `NOTES.md`; this file is the short,
user-facing history.

> **For developers:** whenever you ship a meaningful or user-visible change,
> add a short line here under the release's `versionName (versionCode)`. Skip
> purely internal tweaks — those go only in `NOTES.md`. Keep it in plain
> language a user understands (it goes on the Play Store).

---

## Unreleased test build (APP_VERSION 1.0.71)
- The current NC program is now saved automatically on this device and restored after the app is reopened. The editor shows the save state; lesson exercises remain temporary and never overwrite the saved main program.

## Unreleased test build (APP_VERSION 1.0.70)
- Cycle 208 now offers its full bore-milling parameter set, including `Q370`, and all supplied Cycle 208 programs and lessons include the path-overlap value.

## Unreleased test build (APP_VERSION 1.0.69)
- Corrected decimal Tool Call feeds and `L ... FAUTO`, added the documented Cycle 208 `Q370` path overlap, and reject negative Cycle 209 `Q336` spindle angles.

## Unreleased test build (APP_VERSION 1.0.68)
- Updated the Android launcher, round and themed icons to the current TNC Sim design.

## Unreleased test build (APP_VERSION 1.0.67)
- After a report or suggestion is posted, the send button becomes Close instead of allowing the same item to be submitted again.

## Unreleased test build (APP_VERSION 1.0.66)
- Unified the light and dark themes with consistent neutral grays, teal actions and amber highlights; the 3D view, scrollbars and toolbar controls now match the same visual style.
- The one-click report dialog now explains its privacy behavior and the basic technical diagnostics it sends in a calmer, clearer way.

## Unreleased
- New one-click bug report: pick "Report a problem" or "Suggest improvement", optionally add a note, and tap Send — a public GitHub issue is opened for you, no GitHub account needed. Bug reports attach the current program, version and device details; suggestions attach only basic context (no program). A clear warning explains the report becomes a public GitHub issue.

## Unreleased test build (APP_VERSION 1.0.65)
- Enabled production verification for one-click problem reports and suggestions sent from the Android app.

## 1.0.4 (versionCode 5)
- More reliable 3D simulation: safer cycle feeds, FMAX handling, clean reruns
  and clearer recovery on affected Android WebViews.
- Improved CNC programming with more accurate radius compensation and validation.
- Better Tool Table workflows, demo programs and interactive Learn content.

## Unreleased test build (APP_VERSION 1.0.62)
- The initial 3D error now explains that the app must be fully closed and reopened after selecting Compatibility mode on affected Android WebViews.

## Unreleased test build (APP_VERSION 1.0.61)
- Re-running (Run/Step) a finished program no longer leaves coloured leftover cut surfaces from the previous run (e.g. purple countersink walls/spikes) where material was removed — every run now starts from clean stock, just like after Reset. Previously only a manual Reset cleared them.

## Unreleased test build (APP_VERSION 1.0.60)
- A contour after a drilling/milling cycle (e.g. CYCL DEF 208 called with M99) no longer cuts the material at rapid speed (FMAX) when its first cutting move has no F programmed — it now uses the last programmed feed (FAUTO). Previously the modal feed got stuck at FMAX after the cycle.

## Unreleased test build (APP_VERSION 1.0.59)
- The program name in the top-left header now follows the file: it shows the demo's name when you pick a demo, the file name when you import, the saved name when you export, and "program.H" for a new (cleared) program — instead of always showing "PROGRAM.H".

## Unreleased test build (APP_VERSION 1.0.58)
- Starting a radius-compensation (RL/RR) contour no longer shows "still active / program R0" errors while you are still typing it — those now appear only when you press Run/Step. Real geometry errors (e.g. tool radius too large) still show immediately.

## Unreleased test build (APP_VERSION 1.0.57)
- A rapid (FMAX) move into material now shows a collision warning but no longer stops the simulation — it keeps running to the end so you can watch the whole program.

## Unreleased test build (APP_VERSION 1.0.56)
- Fixed the garbled characters in the "Ready — press Run" status line at the bottom of the simulation view.

## Unreleased test build (APP_VERSION 1.0.55)
- Mobile number fields now place a pressed minus before the entered value and pressing minus again restores the positive value. Cycle editing opens a numeric keypad.
- Corrected supported TNC 640 RL/RR tool-centre paths and valid-radius checks for lines, circles, RND and CHF; interim L-block diagnostics are now one non-blocking warning.
- The L-block panel orders its parameters as XYZ, R, F, M.

## Unreleased test build (APP_VERSION 1.0.54)
- Groups Quality and the fully manual Compatibility mode toggle in a compact
  Simulation controls drawer outside the WebGL surface, while Speed stays close
  to Measure and the other simulation-surface controls. Refine appears on its
  own second row without moving Speed. The drawer's open state survives app
  restarts, and the app never switches modes automatically.
- Compatibility mode keeps reduced material cutting and now renders both sides
  of the workpiece surface so its top and side walls remain visible.

## Unreleased test build (APP_VERSION 1.0.53)
- Tested an automatic compatibility fallback after Android WebView context
  loss. This experimental automatic switching was removed before release.

## Diagnostic test build (APP_VERSION 1.0.52)
- Keeps reduced Low voxel cutting but restores the pre-optimization single-mesh
  GPU layout with one simple, uncoloured Lambert material for Mali/WebGL1.

## Diagnostic test build (APP_VERSION 1.0.51)
- Restores material cutting with three reduced voxel profiles (50/75/100) to
  find the stable Mali-G57 mesh limit in one test session.

## Diagnostic test build (APP_VERSION 1.0.50)
- Keeps the WebGL1 compatibility scene but temporarily omits the voxel cutting
  mesh to isolate the Mali-G57 context loss from the rest of 3D rendering.

## Diagnostic test build (APP_VERSION 1.0.49)
- Starts Android 3D directly in the lowest-memory WebGL1 mode to verify Mali
  compatibility before a failed normal renderer can affect the GPU process.

## Unreleased test build (APP_VERSION 1.0.48)
- Fixed Android devices that briefly showed 3D and then stayed on a rendering
  error instead of restarting once in compatibility mode.

## Unreleased test build (APP_VERSION 1.0.47)
- The 3D simulation now shows the LBL currently invoked by `CALL LBL`.

## Unreleased test build (APP_VERSION 1.0.46)
- Reworked the first Start here lesson into three concise orientation slides,
  with a visual preview of Hint 1–3 and an ungraded editor walkthrough.

## Unreleased test build (APP_VERSION 1.0.45)
- Corrected cycles 200, 201, 208 and 209 for depths, safe retracts, feeds,
  dwell behavior, spindle direction and tapping parameters.
- Reworked Cycle 208 and RL/RR/R0 cutting paths, and made invalid or unsupported
  blocks visible in Problems instead of silently ignoring their toolpaths.
- Complete Part and Angle Mill now execute their full intended L-block paths.

## Unreleased test build (APP_VERSION 1.0.44)
- Fixed Tool Table add, edit, delete, import and export workflows, including
  duplicate-number protection and safer validation of imported tools.
- Tool locking, replacement tools, radius oversize and tool-life fields now
  affect simulation consistently; misleading parameter descriptions were
  clarified.

## Unreleased test build (APP_VERSION 1.0.43)
- Simplified Start here to two direct slides: task → editor → Check, followed
  by a text-only explanation of the three progressive Hint levels. The existing
  five-step guided tour is unchanged.

## Unreleased test build (APP_VERSION 1.0.42)
- Ported the complete accepted Learn audit from web: stricter and more accurate
  task checks, clearer lessons and progressive hints, redesigned diagrams, and
  the shorter interactive Start here tutorial.
- Improved Learn accessibility with clearer focus states, larger diagram text
  and stronger light-theme contrast.

## 1.0.3 (versionCode 4)
- 3D now automatically enables a compatible rendering mode if Android WebView
  loses its GPU context, while retaining full quality on unaffected devices.
- Added four ready-to-run machining demos and expanded Learn tutorials, goals,
  hints, and guided practice.
- Improved cycles 200, 201, 208 and 209, including feeds, helical entry and
  visible retract moves.
- Export now uses the Android share sheet, with additional light-theme and
  mobile-layout fixes.

## Unreleased test build (APP_VERSION 1.0.38)
- Added four ready-to-run demos: Chamfering, Rough & Finish, Thread Hole, and
  Precise Hole.
- The light-theme 3D table grid is now a softer neutral grey. Opening another
  lesson starts with its practice hints closed.

## Unreleased test build (APP_VERSION 1.0.36)
- Fixed **Export** doing nothing: both the program Export button and the Tool
  Table's Export button now save the file via the system share sheet (pick
  Save/Drive/email/etc.) instead of silently failing.

## Unreleased test build (APP_VERSION 1.0.35)
- Fixed the tapping cycle (CYCL 209): setting Q256 to 0 (full retract) or Q257
  to 0 (single pass, no chip breaking) now actually works instead of being
  silently ignored.
- The Tool Table no longer shows a "? Help" hint that didn't apply on this app.
- Editing a feed (F) value no longer makes the on-screen keypad panel jump or
  grow — the FMAX/FAUTO/Q/skip options are now one compact dropdown.
- Fixed near-invisible text in light theme in the Learn practice tutorial's
  guided tour and the 3D view's "Tools used"/Measure panels.
- The 3D view's Run/Step/Stop buttons and view tabs no longer stretch overly
  wide on tablets.
- The Learn intro tutorial's guided tour now also points out how to leave
  Learn mode, go back to the lesson list, give up on a task, and what that
  hidden password button next to Reset actually does.

## Unreleased test build (APP_VERSION 1.0.33)
- Fixed bore-milling cycle (CYCL 208) feed and toolpath: automatic feed now
  correctly follows the tool call, and full-material bores enter each helix
  pass smoothly from the center instead of an unrealistic zero-radius spiral.
- Short internal retract/return moves in cycles 200, 201, 208 and 209 are now
  visible in the 3D simulation instead of appearing to teleport.
- Fixed tapping cycle (CYCL 209) retract speed to use the correct synchronized
  feed instead of rapid traverse.

## Unreleased test build (APP_VERSION 1.0.32)
- Added a Start here tutorial that explains how lessons and practice work.
- Every practice task now shows its goals and offers three progressive hints.
- Added a guided tour of the assignment, editor, goals, hints and Check button.
- Finishing a lesson now returns to the Learn lesson list.
- Smoother 3D machining: only changed parts of the workpiece mesh are rebuilt.
- Added Low, Default and High simulation quality, with matching Refine detail.

## 1.0.2 (versionCode 3)
- Added `BLKFORM OFF/ON` beside Measure and Path to hide or restore the
  workpiece while inspecting the toolpath.
- Programs can run without a workpiece when BLK FORM is omitted or both box
  corners are zero.
- Fixed the Measure panel overlapping BLKFORM on phones.
- Program text no longer scrolls behind editing and practice controls.
- Fixed unreadable tool/function names in light-mode interactive panels.
- Fixed RL/RR cancellation so a `L Z... R0` retract moves vertically instead
  of diagonally by the tool-radius compensation offset.
- Editing values and switching Learn tasks no longer makes the editor jump or
  unexpectedly reopen the on-screen keyboard.
- The bottom Editor / 3D / Learn tab bar behaves properly with the on-screen
  keyboard now: it no longer slides up with the keyboard, leaves no black gap
  above it, doesn't flicker or animate when the keyboard opens, and reliably
  reappears when you close the keyboard.
- Learn: fixed an empty dark strip at the bottom of the lessons — the lesson
  panel now fills the screen down to the bottom tabs.
- Improved light mode with a cleaner workspace, better contrast, and clearer controls.
- Fixed 3D model distortion when resizing the window or changing the layout.
- Minor bug fixes and stability improvements.
- New welcome tour on first launch.
- Cleaner top bar and editor toolbar.
- Full-width layout on tablets — the 3D simulation is no longer cramped.
- The app now uses its own icon.
- 3D engine is bundled — full offline support from the first launch.
- App version is shown in the About dialog.
- More reliable 3D on older phones and devices with aggressive GPU management.

## 1.0.1 (versionCode 2)
- Rebuilt the app (now a Capacitor build) for better offline use and a
  cleaner full-screen experience with no browser address bar.

## 1.0 (versionCode 1)
- Initial release.
