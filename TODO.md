# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** newly discovered bugs and every
> fix attempt are recorded here. Once accepted, their evidence moves to
> `BUG_HISTORY.md`.

## Open bugs

- **October 2026 audit A01–A13 — Android port implemented, awaiting device
  acceptance.** Attempt 1 deliberately ports shared fixes from web test commit
  `87cf607` onto Android `93f99f5` (APP_VERSION 1.0.111 → 1.0.112).
  Numerical regressions cover small arcs, Q expressions, cycles 208/209 and
  cumulative path limits; runtime checks cover stale pause/resume, collisions,
  spindle-gated live/Refine cutting, status and accessible view buttons.
  A06's failed-WebGL startup fallback already existed on Android; preserve its
  visible manual Compatibility-mode recovery instead of copying web boot.
  Keep open until native testing and acceptance. No APK/AAB build, Capacitor
  sync, Play release or merge in this attempt. See
  [the Android audit port and device checklist](docs/android-audit-2026-10-12.md).

- **C62 / web issue #44 — compensated retrace skips the contour (implemented,
  awaiting Android acceptance).** The analytic loop check lacked the nominal
  source geometry for generated corner transitions and missed collinear
  nominal overlap. It mistook the reported return along an earlier edge for a
  compensation-created loop and dropped the whole RL run after `L Z-5 F400`.
  Attempt 1 ported the tested web branch's geometry-aware loop check and
  restricted the pure-Z validator diagnostic to blocks specifying Z. The
  exact six-pass program now retains every compensated pass, with or without
  its repeated `L Y+95`, and a genuinely new crossing is still rejected in
  the regression test. Keep open until accepted in the Android app.

- **C61 — Restored status expanded the Android header (implemented, awaiting
  acceptance).**
  The status shared the first header row with the language, theme and About
  actions. `Restored 12:34`, and especially `Wiederhergestellt 12:34`, could
  wrap or shift those controls. It now reads `Loaded 12:34` / `Geladen 12:34`
  inside a shrinking 76 px slot that preserves the time and uses ellipsis only
  as a fallback for enlarged text. Keep open until accepted on device.

- **C60 — Path-function X committed the provisional block (implemented,
  awaiting acceptance).**
  Opening a guided Path function immediately inserts its provisional block,
  but the panel X used the same `exitFieldMode()` path as Done and therefore
  left that block in the program. The panel now captures the complete
  pre-session program, selection, dirty state and undo/redo stacks: X restores
  them, while Done/END remain commits. Runtime regressions cover every
  Cartesian, polar and APPR/DEP builder, cancellation of edits to an existing
  block, and removal of multi-line guided insert side effects. Keep open until
  accepted in both products.
