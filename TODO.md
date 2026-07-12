# TODO / known open items

## NEEDS ON-DEVICE VERIFICATION: keyboard fix rewritten to use @capacitor/keyboard
`www/android/keyboard.js` was rewritten (`APP_VERSION 1.0.9`) to use the
native `@capacitor/keyboard` plugin's `keyboardDidShow`/`keyboardDidHide`
events instead of the `visualViewport`-baseline-polling workaround (see
NOTES.md rule #7 for the full history and why). `npm install
@capacitor/keyboard` + `npx cap sync android` were run — the native Gradle
module (`capacitor-keyboard`) is wired into `android/settings.gradle` via
the auto-generated `android/capacitor.settings.gradle`, and
`AndroidManifest.xml`'s `windowSoftInputMode="adjustResize"` (rule #9) is
already in place and still required.

**This has NOT been verified on a real device or emulator** — this class of
bug (and the plugin itself) doesn't exist in browser/htmlpreview preview at
all, only a real Android build can confirm it actually works (rule #9).
Before shipping a release built on this: `npx cap sync android` (if not
already fresh), build + install on a real device, open the editor tab, tap
into the code area to bring up the soft keyboard, confirm the bottom tab bar
hides cleanly (no black gap, no stuck-hidden-after-close), and confirm it
still works after rotating the device with the keyboard open. If it
misbehaves, rule #7 documents the old (working, shipped in `1.0.4`–`1.0.8`)
`visualViewport`-baseline approach as a fallback to revert to.

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
