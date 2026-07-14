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
