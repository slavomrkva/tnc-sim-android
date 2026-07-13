# TODO / known open items

> **Bug lifecycle (see NOTES.md rule #14):** a newly discovered bug goes HERE,
> and every fix attempt for it is logged here as it happens (what was tried,
> what the result was). When it's finally fixed, the whole entry is **removed
> from this file and moved to `BUG_HISTORY.md`** (with root cause + all the
> attempts). Open bugs live here; resolved bugs live in `BUG_HISTORY.md`.

## Open bugs
_None right now._

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

---

## Housekeeping from the module-split refactor (2026-07-12)
- The web repo's `core/*.js` and this repo's `www/core/*.js` are byte-for-
  byte identical as of the split, verified mechanically. They will drift the
  moment either side gets an unrelated edit — that's expected and fine (see
  `sync-core.sh`), just don't assume they're still identical without
  checking.
- The first attempt at this refactor (same day) was built against a stale,
  ~30-commit-old local checkout of the web repo (`tnc-sim`) that was missing
  PWA support, the light-theme rework, Learn mode, and mobile tabs. That
  attempt wrongly concluded Learn mode / mobile tabs were android-exclusive
  and had to be fully discarded (never committed) and redone against the
  real `origin/main`. If a future session finds references to an "old"
  module breakdown that doesn't match this file, trust this file and the
  actual `core/`/`android/` directory contents, not stale memory.
- CSS was NOT diffed rule-by-rule between the two repos (only moved as one
  whole block per repo, `web/styles.css` vs `www/android/styles.css`) — if a
  future session wants a `core/styles.css`, that's unstarted work, not
  verified as safe.
- 5 small, byte-identical, **immediately-executing** anonymous IIFEs
  (version-badge, bug-report `window.onerror` hook, panel-resize handle,
  view-hint, SW-registration guard) were deliberately left duplicated in
  each side's own `app.js` rather than factored into `core/`, because they
  execute immediately on script load (not on a later call) and at least one
  depends on `APP_VERSION` being assigned earlier in the same file — pulling
  them into a `core/` file that loads before `app.js` would break that
  ordering. Not a bug, just a known duplication; see NOTES.md "Module map".
