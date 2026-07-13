# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs

## C2 — RL/RR korekcia pri záverečnom pohybe Z+20 vedie nástroj šikmo do modelu
**Repos:** web + Android. **Reported:** 2026-07-13.

### Symptom
Pri poslednom bloku `L Z+20 R0` má ísť nástroj rovno hore. V simulácii však ide
šikmo ešte do modelu, akoby sa po ceste snažil napraviť korekciu. To je
nesprávne.

### Repro program
```text
LBL 1
L X-20 Y+235 Z+50 FMAX
L Z+Q1
L Y+230 FAUTO RL
L X+101
CHF 15
L Y+200
RND R5.5
L X+161
RND R5.5
L Y+230
CHF 15
L X+296
CHF 15
L Y+200
RND R5.5
L X+366
CHF 15
L Y+0
CHF 15
L X+0
CHF 15
L Y+231
CHF 16
L X+20
L Z+20 R0
LBL 0
END PGM PROGRAM
```

### Status
Open across both repos. Web fix verified and merged; identical Android 1.0.27
port is implemented and awaiting real-device verification.

### Analysis (2026-07-13)
- The defect is in the shared `www/core/parser-engine.js` radius-compensation
  postprocessor, not voxel cutting or rendering. `offsetRun()` finishes an
  RL/RR run at the laterally offset tool-centre point, then rewrites only the
  following R0 segment's `from` to that point. Its `to` remains the nominal
  programmed XY target. For `L Z+20 R0`, whose programmed XY displacement is
  zero, this creates an artificial diagonal by exactly the compensation offset.
- The relevant boundary code is identical in the web copy. The validator
  intentionally accepts this block because R0 clears compensation before the
  pure-Z-under-RL/RR check.
- A safe fix must recognise a zero-XY R0 cancellation, keep the complete Z
  segment at the last compensated XY position, and carry that physical
  position through any later Z-only blocks. The first later XY move may then
  lead out to its programmed target. Merely changing `nextSeg.from` or
  `nextSeg.to` alone would leave either a diagonal or a discontinuity.
- Regression coverage should include RL and RR, ordinary lateral R0 lead-out,
  R0 on a pure Z retract, multiple following Z-only moves, and a later XY move.

### Attempts
- **Web v0.821/v0.822:** user verified the reported mobile-web contour retracts
  vertically; the fix was merged to web `main`.
- **Android 1.0.27:** ported the identical `offsetRun()` continuity change and
  regression harness. A zero-XY R0 keeps the last compensated physical XY
  through Z/state-only segments; the first later XY move leads out to its
  nominal target. Tests cover RL, RR, lateral R0, repeated Z retracts, a later
  XY lead-out, and the full reported RND/CHF contour. Awaiting device test.

## C5 — Textové pole prechádza pod ovládacie panely
**Repos:** web + Android. **Reported:** 2026-07-13.

### Symptom
Textové pole ide v pozadí za ovládacie panely s tlačidlami Path functions a
ďalšími ovládacími prvkami. Treba určiť vertikálne hranice textového poľa, aby
obsah neprechádzal pod tieto panely.

### Status
Open.

<!-- Template for a new bug (copy below "Open bugs"):

## <short title> — <one-line symptom>
**Reported:** <date>. **Repro:** <steps / device / only-on-device?>
### Symptom
<verbatim if possible>
### Attempts
- Attempt 1 — <what / hypothesis>: <result on device>.
- Attempt 2 — …
### Status
<current best understanding / next thing to try>
-->
