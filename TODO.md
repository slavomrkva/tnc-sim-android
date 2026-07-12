# TODO / known open items

## RESOLVED: @capacitor/keyboard plugin attempt reverted (real-device tested)
`www/android/keyboard.js` was briefly rewritten (`APP_VERSION 1.0.9`) to use
the native `@capacitor/keyboard` plugin's `keyboardDidShow`/`keyboardDidHide`
events instead of the `visualViewport`-baseline approach. **Tested on a real
device and confirmed broken**: on keyboard open the bottom tab bar visibly
slid up together with the keyboard before hiding, leaving a black gap above
the keyboard in between; on keyboard close the gap stayed black for a moment
before the bar slid back in — a real UX regression, not just cosmetic.

Reverted in `1.0.10`: `www/android/keyboard.js` restored byte-for-byte to
the `1.0.4`–`1.0.8` `visualViewport`-baseline implementation, and
`@capacitor/keyboard` was fully uninstalled (`npm uninstall
@capacitor/keyboard` + `npx cap sync android`) rather than left installed
but unused. See NOTES.md rule #7 for the full writeup — **do not retry the
native-events approach without the ability to iterate directly on a real
device**; it can't be debugged from source or in browser preview, and it
already failed once in exactly the way rule #9 warns about (timing/ordering
issues that only show up on-device).

If keyboard behavior needs further work in the future, the current
`visualViewport`-baseline approach is the known-working baseline — start
from understanding *why* it works (rule #7) before changing it.

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
