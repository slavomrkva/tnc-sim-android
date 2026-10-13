# Android audit fixes — test branch, 2026-10-12

Base: Android `93f99f5`, APP_VERSION 1.0.111. Result marker: **1.0.112**.
Reference: web test commit `87cf607` on `fix/web-audit-2026-10-12`.
This is a deliberate patch port, not a wholesale web synchronization. Web and
Android version numbers are independent. APK/AAB generation, Capacitor sync,
Play release identifiers, publishing and merging are outside this change.

## Audit mapping

| ID | Android result |
| --- | --- |
| A01 | Directed circular sweeps no longer add a revolution to a tiny positive/negative arc; full and multi-turn circles remain supported. |
| A02 | A bounded expression interpreter evaluates nested degree-based trigonometry. |
| A03 | Dirty paused programs validate and prepare again before Run. Clean M0/Step pauses resume at the existing position. |
| A04 | Rapid collision sampling covers horizontal and upward movement, including cycle positioning. Warnings remain non-blocking. |
| A05 | A stopped spindle cannot cut in live simulation or the Refine worker; movement through stock reports a collision. |
| A06 | Android already had a working no-WebGL boot and XY playback. Retained that implementation and its accessible manual recovery panel; added defensive renderer/measurement/quality guards. |
| A07 | Cycle 209 preserves small Q256 factors and never moves upward with the cutting spindle direction during re-entry; retracts stop at clearance. |
| A08 | Validation and execution share one evaluator, including subtraction of negative Q values. |
| A09 | ASIN, ACOS and ATAN work as complete function tokens and return degrees. |
| A10 | Cycle 208 selects an even subdivision count by radius, limiting XY chord error to 0.01 mm instead of a fixed 32 segments per revolution. This is a path tolerance, not a voxel-surface accuracy promise. |
| A11 | A cumulative 100,000 segment/iteration budget bounds cycle and arc generation plus compensation expansion. Excessive programs return an explicit error and no truncated path. |
| A12 | The status panel distinguishes M3, M4 and M5 using segment spindle direction. |
| A13 | View selectors are native buttons with pressed state, visible focus and a minimum 44 px height for touch and accessibility. |

## Android differences deliberately preserved

- Always-mobile Editor/Simulate/Learn layout, custom TNC keyboard ownership,
  Android viewport detection and native safe-area handling.
- App identity `org.tncsim.twa`, native export and independent Play version.
- Live/Refine voxel budgets of 12M/32M, compatibility resolution profiles and
  compatibility mesh behavior. Refine remains disabled in compatibility mode.
- Manual Normal/Compatibility switching and its recovery UI outside WebGL.
  Unlike web, a failed renderer does not hide the diagnostic 3D tab.
- Existing suspension of hidden 3D rendering and Android-specific controls.
- Android sources under `www/`; no web service worker or generated native assets.

## Verification

- Local result: **45/45 regression files passed**; **86 JavaScript files**
  passed `node --check` (Node v24.19.0). `git diff --check` passed.
- Run every root `tests/*.test.js` / `tests/*.test.mjs` with Node.
- New `android-audit-2026.test.js`: independent numerical expectations for
  formulas/arcs/cycles, pathological loop rejection, paused edits, collision
  dispatch and M4 status.
- New `android-audit-runtime.test.js`: actual failed-renderer boot branch,
  reachable Android recovery tab, pressed-state changes, and real Refine worker
  meshes with spindle on/off.
- Cycle regressions measure angular travel and axial pitch rather than assume
  a tessellation implementation. Existing keyboard, viewport, mobile lifecycle,
  compatibility, quality, localization and export regressions remain required.
- JavaScript syntax and `git diff --check` before push.

These are source/runtime regressions, not a claim of device or GPU acceptance.
No APK was built, so native acceptance remains open in TODO.md.

## Device acceptance after a later authorized build

1. Test portrait and landscape, the custom keypad and free-text keyboard;
   verify bottom tabs and system-bar spacing on a small phone.
2. Run a demo, pause, edit a coordinate and Run: use the changed path from the
   beginning. A malformed edit must block; a clean pause must resume in place.
3. Test the tiny CP arc and nested SIN/inverse-function examples from the
   numerical regression suite; check cycle 208 and both tapping hands in 209.
4. Verify horizontal FMAX through stock warns without stopping playback, and
   M5 motion leaves stock intact both live and after Refine.
5. Check Normal/Compatibility switching, failed-WebGL recovery, M4 display,
   TalkBack button labels/states and touch targets without keyboard overlap.

Merge only after acceptance. Android and web fixes remain independently reviewable.

## Phone acceptance and Play candidate — 2026-10-13

The owner installed test APK 1.0.113, accepted it and authorized preparation for Play. Build/test evidence: https://github.com/slavomrkva/tnc-sim-android/actions/runs/38352044743. Candidate production identifiers are 1.0.7/code 8; APP_VERSION 1.0.114. Earlier statements about no APK built describe the original source-only audit attempt.
