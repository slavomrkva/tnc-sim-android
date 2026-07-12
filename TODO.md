# TODO / known open items

## HISTORY: bottom tab bar / black area above keyboard — full pre-refactor investigation log
This is the detailed, chronological record of everything tried in the
session that produced the `1.0.4`–`1.0.8` `visualViewport`-baseline
`www/android/keyboard.js` implementation the section below calls "known-
working". **Important caveat, read first:** at the point this investigation
was paused (`1.0.7`, handed off to the module-split refactor), the bug was
**not confirmed fixed** — the last real-device test still showed the problem.
"Known-working" in the section above means "worked better than the native
`@capacitor/keyboard` plugin attempt", not necessarily "fully resolved". If
this surfaces again, don't assume `1.0.4`–`1.0.8`'s approach is clean; verify
on a real device before trusting it.

### Symptom, as originally reported (verbatim, translated)
"When I go to edit a parameter and the keyboard slides up, the bottom panel
where you switch Editor/3D/Learn slides up with it (a remnant stays visible
above the keyboard). And when I hide the keyboard, the bottom panel is just
empty black space, [then] disappears." Two distinct problems in one report:
(1) the bar visibly sitting above/over the keyboard while it's open, and
(2) the bar vanishing/breaking after the keyboard closes.

### Attempt 1 — `visibility:hidden` → `transform:translateY(120%)` (fixed problem 2's "disappears" symptom, only partially)
**Hypothesis:** two mechanisms were both trying to control `.mtab-bar`
(a `position:fixed` + `transform:translateZ(0)` GPU-layered element): an old
`visualViewport`-vs-`window.innerHeight` offset-chasing rAF loop (originally
written to chase a *browser* address-bar show/hide animation — irrelevant
inside the Capacitor WebView) fighting a new focus/blur listener on the
hidden `#mobileInput`. On real Android WebView, toggling `visibility` on a
promoted compositing layer while the keyboard animates can leave a stale
blank/black composited tile instead of cleanly hiding.

**Fix:** skip the old rAF loop entirely when `window.Capacitor` is set (its
own keyboard-open detection reads ~0 forever in-app anyway, since the
WebView resizes `window.innerHeight` together with the viewport — the two
never diverge). Replace `visibility:hidden` with
`transform:translateY(120%) translateZ(0) !important` driven by a new
`editing-field` class toggled on `focusin`/`focusout` of editable elements.

**Result reported by user:** bar no longer disappeared into nothing, BUT a
**new, worse regression**: the bar could get **permanently stuck hidden**
after the keyboard closed, blocking all tab navigation (Editor/3D/Learn
unreachable).

### Attempt 2 — root-caused the stuck-hidden regression: focus/blur is the wrong signal entirely
**Root cause found:** `www/android/field-editing.js`'s `#mobileInput` blur
handler *deliberately* keeps that hidden input focused after the on-screen
keyboard visually dismisses, so the next quick field-edit doesn't need a
re-tap ("keep mobileInput focused when FM is active"). That means `blur`
does **not** reliably fire when the keyboard actually closes — the
`editing-field` class from Attempt 1 could get added but never removed,
because DOM focus state and actual keyboard visibility are two different
things in this app by design.

**Fix:** replaced focus/blur entirely with a `visualViewport`-height
comparison against a **remembered baseline** (captured once, silently
re-synced any time the viewport is at least as tall as the baseline — i.e.
whenever confidently no keyboard is covering anything, including after
rotation). `kbdOpen = (baseline - visualViewport.height) > 140`. This is
independent of DOM focus state entirely. Unified into one IIFE (previously
split across two competing mechanisms).

**Verified (in this session, not on-device):** a Playwright test that
monkey-patched `visualViewport.height` to simulate open→close *while keeping
`#mobileInput` focused throughout* (reproducing the exact stuck-focus
scenario) confirmed the bar correctly un-hid. This became the `1.0.4`
baseline implementation.

**Result reported by user after real-device test:** the stuck-permanently-
hidden bug was gone (confirmed: "spodny panel uz nemyzne" — bar no longer
disappears). But the *original* symptom — a black area remaining above the
keyboard while it's open — was still present. Attempt 2 fixed problem 2 from
the original report but not problem 1.

### Attempt 3 — `android:windowSoftInputMode="adjustResize"` (necessary, not sufficient)
**Hypothesis:** `AndroidManifest.xml`'s `<activity>` had no
`windowSoftInputMode` set at all. Without `adjustResize`, Android defaults to
panning the window under the keyboard instead of resizing available space —
meaning `visualViewport` (and `window.innerHeight`) might never actually
change size when the keyboard opens, so the Attempt 2 detection (entirely
dependent on `visualViewport` changing) would silently never fire, regardless
of how correct the JS logic was.

**Fix:** added `android:windowSoftInputMode="adjustResize"` to the
`<activity>` tag. Native manifest change — requires `npx cap sync android` +
a **real rebuild** (confirmed later in this investigation that Android
Studio's incremental "Run" can skip re-processing a manifest-only change;
full uninstall from device + Build → Clean Project + Rebuild Project was
needed to actually test it).

**Result reported by user after real-device test with a confirmed clean
rebuild (`APP_VERSION 1.0.6`):** black area above the keyboard **still
present**. This fix may still have been necessary/correct (untested in
isolation), but was not sufficient on its own.

### Attempt 4 — drop `.editor-panel`'s reserved bottom padding while `kbd-open`
**Hypothesis:** `body[data-mtab="editor"] .editor-panel` always reserves
`padding-bottom:calc(46px + safe-area)` so its scrollable content never runs
under the fixed tab bar. That reservation is unconditional — it doesn't know
or care that the bar is currently hidden during keyboard editing (Attempt
1/2's `editing-field`/`kbd-open` transform). Even with the bar itself fully
hidden, the *reserved space* for it remains, showing as a bare/unstyled dark
strip right above the keyboard.

**Fix:** added `html.kbd-open body[data-mtab="editor"]
.editor-panel{padding-bottom:0 !important;}`.

**Result reported by user (`APP_VERSION 1.0.7`, after a confirmed clean
rebuild):** black area **still present**, unchanged.

### Diagnostic dead end — tried to reproduce in a mobile browser to get a fast test loop
At this point (three real-device-only fix/rebuild/test cycles with no
success) we tried opening the same `www/index.html` in the phone's regular
mobile Chrome (not the Capacitor app) via a `raw.githack.com` preview link,
hoping to get a fast, non-native test loop for the remaining CSS/JS work.
**This didn't work as a diagnostic**: tapping the field didn't bring up a
real on-screen keyboard in the browser context at all (the synthetic
`#mobileInput.focus()` call doesn't reliably trigger a real IME the way it
does inside the installed app), so no signal either way. Abandoned — there is
**no known way to reproduce or test this specific bug outside a real
on-device Capacitor build**; budget accordingly before attempting further
fixes.

### Strongest remaining clue, never fully chased down before handoff
The user noticed that the **Learn-mode practice/task assignment panel**
(`#learnMobileBar`, shown during a lesson) *correctly* hides itself when the
keyboard opens, via the exact same `html.kbd-open ... {display:none
!important;}` mechanism as Attempt 2's fix for `.mtab-bar`. If that panel
reliably hides (user's own observation, not independently re-verified),
`kbd-open` detection is firing correctly at the right time — which would mean
the remaining black area is **not** a detection-timing problem, but some
other element or region entirely that was never identified. This thread was
not pursued further before the bug was deliberately deferred to
post-refactor work (see decision below). Whoever picks this up next should
start here rather than re-litigating detection timing.

### Decision to defer (made deliberately, not abandoned)
After three failed on-device fix attempts and a dead-end diagnostic path,
with no fast local test loop available, the user decided to explicitly defer
further debugging until *after* the module-split refactor, rather than keep
spending real-device rebuild cycles blind. The refactor prompt used for that
session explicitly listed this bug as deferred/out-of-scope, with a
suggestion to try the official `@capacitor/keyboard` plugin instead of the
hand-rolled `visualViewport` approach — see the section above for how that
went (reverted; also failed real-device testing, differently).

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
