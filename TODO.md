# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** newly discovered bugs and every
> fix attempt are recorded here. Once accepted, their evidence moves to
> `BUG_HISTORY.md`.

## Open bugs

- **C59 — Learn Cycle 209 used a non-editor block format and incomplete
  follow-on starters (implemented, awaiting acceptance).**
  The password solution placed Q257/Q256 on the `CYCL DEF 209` header, while
  the editor serializes every Q parameter on its own row; the following two
  tasks also omitted required Q336/Q403. The solution and both carried-forward
  starters now use the editor order Q200/Q201/Q239/Q203/Q204/Q257/Q256/Q336/
  Q403, and the guided Cycle 209 schema exposes Q403. Full Run-validation
  regressions cover all three tasks. Keep open until accepted in both products.

- **C58 — Lesson 7 task 1 left RR active on its retract (implemented,
  awaiting acceptance).**
  The password-completed program reached `L Z+50 FMAX` while RR was still
  active, so Check passed but Run correctly rejected the pure-Z compensated
  move and the uncancelled contour. The starter now uses the agreed
  `L Z+50 R0 FMAX`, with a full Run-validator regression. Keep open until
  accepted in both products.

- **C57 — APPR/DEP key stayed visually expanded after entering Practice
  (implemented, awaiting acceptance).**
  Replacing the context strip could remove the picker before its trigger state
  was cleared. Every idle-panel render now unconditionally collapses the
  APPR/DEP trigger. Keep open until accepted in both products.

- **C56 — False missing-spindle warning after safe FMAX positioning
  (implemented, awaiting acceptance).**
  The validator used its first positioning move as the gate for the
  first-cutting-move warning, so a safe `L ... FMAX` block could emit the
  warning before a later first feed block started the spindle with an embedded
  `M3`. Android 1.0.101 now tracks the first non-FMAX motion separately, while
  retaining tool checks on all positioning moves and the documented
  start/end-of-block M timing. Official circular/helix programs and dedicated
  M3/M4/M13/M14/M5 regressions cover both accepted and warning cases. Keep
  open until accepted in both products.

- **C55 — Validator ran during every programming action (implemented,
  awaiting acceptance).**
  Programming keys, the custom keyboard, guided panels, imports and raw text
  edits all shared `runValidation()` with simulation start, so inserting any
  function could immediately run static validation and toolpath parsing.
  Android 1.0.101 now uses that edit hook only to discard stale diagnostics;
  only Run and Step invoke full validation with `runValidation(false)`.
  Runtime and whole-source regressions prove that no programming action can
  request full validation. Keep open until accepted in both products.
