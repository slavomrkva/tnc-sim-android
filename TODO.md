# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** newly discovered bugs and every
> fix attempt are recorded here. Once accepted, their evidence moves to
> `BUG_HISTORY.md`.

## Open bugs

## C50 — Android CSS ignored Capacitor's native safe-area correction
**Reported:** 2026-07-28. **Repro:** launch the app on an Android WebView older
than 140 and inspect system-bar spacing and the injected
`--safe-area-inset-*` properties.

### Symptom
Capacitor injects corrected native inset values because older Android WebViews
can return inaccurate `env(safe-area-inset-*)` values, but the app CSS read
only the browser `env()` properties and ignored the correction.

### Attempts
- Attempt 1 — API 30 instrumentation/logcat confirmed early transient upstream
  injection warnings during document creation but also proved the native
  property is populated after load.
- Attempt 2 — changed Android layout spacing to prefer Capacitor's
  `--safe-area-inset-*` properties with `env(..., 0px)` fallbacks. The device
  test now asserts the native property after startup and Activity recreation.

### Status
Implemented in APP_VERSION 1.0.97; keep open until visual device acceptance.

## C49 — Closing the Android share sheet is reported as export failure
**Reported:** 2026-07-28. **Repro:** export a program and close a native share
sheet implementation that rejects its promise with a cancellation error.

### Symptom
The common promise catch treated cancellation exactly like a storage/plugin
failure and displayed a false red export error.

### Attempts
- Attempt 1 — added a native-plugin contract test for missing plugins,
  successful write/share, full storage and cancelled sharing. It reproduced
  the false error.
- Attempt 2 — ignore only cancellation-shaped share errors; preserve actionable
  errors for write failures and missing Filesystem/Share plugins.

### Status
Implemented in APP_VERSION 1.0.97; keep open until device acceptance.

## C47-C48 — Imported whitespace, BOM and line endings change program meaning
**Reported:** 2026-07-28. **Repro:** add repeated spaces to every inter-word
separator, or import a program beginning with a Unicode BOM and mixed CRLF/CR
line endings.

### Symptom
Validation accepted the whitespace variant after its command normalization,
but the parser's separate BLK FORM pre-scan ignored the blank and started the
simulation from its fallback home position. BOM/mixed-ending files retained
transport characters that could prevent structural commands from matching.

### Attempts
- Attempt 1 — a deterministic metamorphic test compared the complete canonical
  path for case, commas, line endings, block numbers, comments and whitespace;
  the whitespace case exposed the BLK FORM start-position divergence.
- Attempt 2 — applied one whitespace normalizer to validator, LBL expansion,
  BLK FORM pre-scan and motion parsing; stripped BOMs in direct parser input
  and normalized BOM/CRLF/CR during file import.
- Attempt 3 — verified nine equivalent spellings, 200 deterministic valid
  random programs and six invalid guards on web and Android.

### Status
Implemented in APP_VERSION 1.0.97; keep open until device acceptance.

## C46 — Radius compensation collapses complete and multi-turn CP paths
**Reported:** 2026-07-28. **Repro:** use the supported path from official
NC11101: activate RL on LP, run `CP IPA+9000 Z-30 DR+`, then `CP DR+`.

### Symptom
When analytic radius compensation joins adjacent arcs it normalizes the new
sweep into one revolution. A complete circle becomes a zero-angle primitive,
and a 25-turn helix loses its complete turns. Before C44/C45 this defect was
masked because the LP activation and angle-less CP were rejected earlier.

### Attempts
- Attempt 1 — after enabling the official LP/CP syntax, compared the retained
  CP segment count and final Z with the 25 turns and -30 mm depth defined by
  NC11101. The join helper reduced every `2*pi` contribution modulo one turn.
- Attempt 2 — when trimming an analytic arc, preserved the integer number of
  complete turns closest to the original sweep. The compensated helix now
  retains at least 3200 interpolated segments, ends at Z-30, and the following
  floor circle retains at least 128 segments.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C45 — Official angle-less `CP DR+` full circle is rejected and skipped
**Reported:** 2026-07-28. **Repro:** use the final floor pass `CP DR+` from
official HEIDENHAIN NC Solutions program 11101_en.h.

### Symptom
The validator requires PA or IPA on every CP block and reports a false error.
The parser also requires one of those tokens before creating an arc, so the
documented control-generated floor circle silently produces no movement when
validation is disabled.

### Attempts
- Attempt 1 — isolated the block after a valid polar helix and confirmed that
  the prior radius and polar origin are available. The official program
  describes this block as the circular path over the bore floor.
- Attempt 2 — interpreted angle-less CP with its mandatory DR direction as
  exactly one full revolution, while preserving existing PA/IPA and DR-sign
  checks. Validator and parser now agree and retain the full circle.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C44 — Radius compensation activated in an LP block is rejected by parser
**Reported:** 2026-07-28. **Repro:** use `LP PR+5 PA+0 RL` from official
HEIDENHAIN NC Solutions program 11101_en.h or the TNC 640 manual's
`LP PR+30 PA+0 RR` example.

### Symptom
The validator accepts RL/RR in supported LP blocks, but the parser marks only a
Cartesian L block as the compensation activation movement. Analytic
compensation then reports that activation must be in L and deletes the complete
LP/CP cutting run.

### Attempts
- Attempt 1 — reproduced the mismatch on two independent official examples and
  confirmed in the local 34059x-10 manual, page 167, that LP is the polar
  straight-line block and may contain RR.
- Attempt 2 — gave LP the same transition-aware activation marker as L while
  retaining its polar endpoint geometry. The official 25-turn helix subset now
  parses without diagnostics and keeps the compensated path.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C43 — A nested section repeat is silently dropped from a subprogram
**Reported:** 2026-07-28. **Repro:** use the supported subset of official HIT
solution 1226674: `CALL LBL 1`, with `LBL 2 ... CALL LBL 2 REP3` inside the
`LBL 1 ... LBL 0` subprogram.

### Symptom
Validation reports no problem, but the simulator executes only the first
position in LBL 1. Starting LBL 2 replaces the single active definition state,
so the remainder of the outer subprogram and all repeated positions disappear.
The expected five-hole row becomes one hole.

### Attempts
- Attempt 1 — removed only the unsupported Cycle 240 stage and reproduced the
  defect with the original supported Cycle 200, LBL and M99 structure. The
  flat label-definition collector cannot represent a program-section repeat
  nested inside an LBL 0-terminated subprogram.
- Attempt 2 — replaced the flat collector with bounded nested expansion.
  The retained official subset now drills all five expected positions at
  X20/35/50/65/80; direct recursion is stopped at 32 levels and expansion
  remains capped at 200000 blocks.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C42 — Program-section repeats without `LBL 0` expand through `END PGM`
**Reported:** 2026-07-28. **Repro:** use the official HEIDENHAIN HIT solution
1226658 structure `LBL 1 ... CALL LBL 1 REP6`.

### Symptom
The label expander implements only the subprogram form terminated by `LBL 0`.
For a documented program-section repeat, whose matching `CALL LBL ... REPn`
terminates the section, it captures every later block through `END PGM`.
Validation then reports repeated END/program-after-END errors and simulation
repeats the departure and program end instead of only the labeled contour.

### Attempts
- Attempt 1 — compact REP parsing exposed the incorrect expansion boundary.
  Confirmed in the local TNC 640 34059x-10 Klartext manual that a program
  section begins at `LBL n` and ends at its matching `CALL LBL n REPn`, whereas
  `LBL 0` terminates the distinct subprogram form.
- Attempt 2 — gave matching CALL LBL REP blocks their own section boundary
  while preserving LBL 0 subprograms and fall-through execution. The simplified
  official polar task now validates and expands only its intended contour.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C41 — Compact `REP6` is rejected and the repeated section is skipped
**Reported:** 2026-07-28. **Repro:** use the official HEIDENHAIN HIT solution
1226658 block `CALL LBL 1 REP6`.

### Symptom
The validator requires a space between REP and its count and reports the
official compact form as faulty. The label expander uses the same incomplete
grammar but emits no parser diagnostic, so it silently omits all requested
repetitions and produces an incomplete contour.

### Attempts
- Attempt 1 — reproduced the false validation error and missing repeated
  motion after simplifying only the unsupported APPR/DEP blocks. Confirmed in
  the local TNC 640 34059x-10 Klartext manual that the documented general form
  is `CALL LBL n REPn`; examples also use the spaced form `REP 2`.
- Attempt 2 — made parser, validator and guided-editor import accept both
  `REP6` and `REP 6` without changing repeat limits or generated editor syntax.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C40 — Supported cycles reject the official `Q...=AUTO` feed value
**Reported:** 2026-07-28. **Repro:** import the official HEIDENHAIN HIT
solution 1226649 containing Cycle 200 with `Q206= AUTO`.

### Symptom
The validator reports `AUTO` as an unsupported Q-expression token and then
reports required Q206 as missing. The parser stores no usable plunging feed, so
each of the eight valid M99 drilling calls reports an invalid Cycle 200 and
generates no cutting path. HEIDENHAIN's HIT solutions also use `AUTO` for
supported Cycle 208 feed parameters.

### Attempts
- Attempt 1 — reproduced the failure on the unmodified supported subset of
  official solution 1226649. Independent official HEIDENHAIN examples confirm
  `Q206=AUTO`; this is not a PDF extraction artifact. The simulator currently
  recognizes only its internal `FAUTO` spelling.
- Attempt 2 — normalized AUTO to the existing internal FAUTO value only for
  Q206 of supported Cycles 200/201/208; AUTO remains rejected for non-feed
  parameters. Official 1226649 now generates all eight drilling calls at F840,
  and the simplified 1206105 Cycle 208 task generates all eight bores at F1100.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.

## C39 — Official `F AUTO` syntax is rejected and can keep the wrong modal feed
**Reported:** 2026-07-28. **Repro:** import the HEIDENHAIN HIT 3-axis solution
1226650, or program a numeric positioning feed followed by `L ... F AUTO`.

### Symptom
The TNC 640 manual and the official HIT solution write the TOOL CALL feed
selection as two tokens, `F AUTO`. The simulator only recognizes its compact
`FAUTO` spelling. The validator reports `F` and `AUTO` as unsupported, while
the parser treats the block as if no feed had been programmed. This happens to
produce the expected feed when the prior modal feed still equals TOOL CALL, but
keeps the wrong feed after an intervening numeric positioning feed.

### Attempts
- Attempt 1 — reproduced three false validation errors on the unmodified
  official 1226650 program and isolated the parser-state defect with a numeric
  feed before `F AUTO`. Confirmed in the local TNC 640 34059x-10 Klartext
  manual that the F AUTO soft key transfers the TOOL CALL feed to subsequent
  blocks.
- Attempt 2 — normalized the official two-token form before all supported
  positioning families are validated or parsed. Unmodified 1226650 now runs
  without diagnostics and F AUTO correctly restores the TOOL CALL feed after a
  different numeric modal feed.

### Status
Implemented in APP_VERSION 1.0.96. Focused and full automated verification
pass; keep open until the release candidate is accepted.
