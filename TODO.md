# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** newly discovered bugs and every
> fix attempt are recorded here. Once accepted, their evidence moves to
> `BUG_HISTORY.md`.

## Open bugs

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
