# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs

## C12 — Light-theme 3D table grid is too dark
**Reported:** 2026-07-15. **Repro:** open the 3D simulation in the light theme.
### Symptom
The table grid uses near-black lines against the light scene.
### Attempts
- Attempt 1 — ported the user-accepted web v0.847 neutral-grey GridHelper
  palette and live theme recoloring into Android APP_VERSION 1.0.38.
### Status
Automated mobile-layout browser regression and Android debug build passed;
app/device visual verification remains before moving to `BUG_HISTORY.md`.

## C14 — Revealed hints leak into a newly opened lesson
**Reported:** 2026-07-15. **Repro:** reveal hints, return to the lesson list, then
open another lesson.
### Symptom
The newly opened lesson can retain the previous task and revealed hints.
### Attempts
- Attempt 1 — ported the user-accepted web reset of `task`, results, and hint
  level on every newly opened lesson into Android APP_VERSION 1.0.38. The
  desktop-only forced scroll was deliberately not ported.
### Status
Automated mobile-layout browser regression and Android debug build passed;
app/device verification remains before moving to `BUG_HISTORY.md`.

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
