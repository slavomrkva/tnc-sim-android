# TODO / known open items

## Deferred: keyboard bug — proper fix via @capacitor/keyboard plugin
The bottom tab bar / black-bar-above-keyboard issue (NOTES.md rules #7 and
#9) has had two rounds of JS-only fixes (`visualViewport` baseline tracking +
`adjustResize` manifest fix). It mostly works now, but the current approach
(polling `visualViewport` height against a remembered baseline) is inherently
a workaround. **Deliberately deferred, on purpose, until after the
core/web/android module-split refactor landed** (see NOTES.md rule #10 and
"Module map") — fixing it mid-refactor would have made it harder to tell
which category of change caused what. Now that the refactor is done and
verified, the next real attempt at this should replace the
`visualViewport`-polling logic (currently in `www/android/keyboard.js`) with
the `@capacitor/keyboard` plugin, which fires real
`keyboardWillShow`/`keyboardDidHide` events instead of inferring keyboard
state from viewport math. Needs a real device/emulator to verify (rule #9 —
this class of bug never reproduces in browser preview).

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
