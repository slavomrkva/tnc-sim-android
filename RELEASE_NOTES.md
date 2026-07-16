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
