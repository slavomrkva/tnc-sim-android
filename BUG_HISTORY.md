# Bug history — resolved bugs & how they were fixed

Archive of **resolved** bugs. Open/active bugs live in `TODO.md`; when one is
fixed it moves here (see the workflow rule in `NOTES.md` — "Bug lifecycle").

Keep, for every entry: the symptom as reported, the root cause once found, and
**every approach that was tried — including the ones that failed** and why. The
failed attempts are the most valuable part: they stop a future session (which
has no memory of this work) from burning real-device rebuild cycles re-trying
something already known not to work.

Newest first.

---

## Learn tab: dead near-black empty strip at the bottom (single-column layout)
**Repos:** web `tnc-sim` (v0.812) + android `tnc-sim-android` (1.0.16).
**Resolved:** 2026-07-13. **Verified:** web headless (Playwright 390×844) + on
device.

### Symptom
In the single-column (mobile / narrow) layout, the **Learn** tab had a strip of
bare near-black page background at the bottom, between the last visible lesson
and the bottom tab bar — wasted space. Present on web too, smaller.

### Root cause
Unlike the Editor and 3D tabs, the Learn tab had **no full-height flex layout**.
It relied on default block flow plus an arbitrary cap
`body[data-mtab="learn"] #learnPanel .lp-body{max-height:calc(100svh - 220px)}`,
so `#learnPanel` ended at its content height and everything below it down to the
tab bar was body background (`--bg`).

### Fix
Gave the Learn tab the same full-height flex treatment as the 3D tab
(`body[data-mtab="learn"]{height:100svh;display:flex;flex-direction:column;
padding-bottom:calc(46px + safe-area)}`, `.sim-container`/`.sim-main` `flex:1`,
`#learnPanel` `flex:1`) and replaced the `max-height` cap with
`max-height:none;flex:1` so `.lp-body` fills to just above the tab bar. CSS-only,
in `www/android/styles.css` (mirrors `web/styles.css`). Measured gap panel→bar:
**71px → 0**.

---

## Bottom tab bar jumps / black gap above the keyboard / bar disappears (Android)
**Repo:** android `tnc-sim-android`. **Long-running** — spanned `1.0.4`–`1.0.16`.
**Resolved:** 2026-07-13 (verified on a real device at `1.0.16`).

### Symptom (as originally reported, translated)
"When I go to edit a parameter and the keyboard slides up, the bottom panel
where you switch Editor/3D/Learn slides up with it (a remnant stays visible above
the keyboard). And when I hide the keyboard, the bottom panel is just empty black
space, then disappears." Three distinct problems: (1) the bar sitting above/over
the keyboard while open, (2) a black gap above the keyboard, (3) the bar
vanishing/breaking after the keyboard closes.

### Hard constraint (kept costing time — read this first)
**This class of bug is invisible in browser/`htmlpreview` preview — it only
reproduces in a real on-device Capacitor build.** Inside the Capacitor WebView
`window.innerHeight` resizes together with the keyboard, and the soft-keyboard /
`adjustResize` behaviour doesn't exist in a desktop browser. Every fix had to be
verified on a physical phone (full `npx cap sync android` + clean rebuild). A
temporary on-device **debug HUD** (added `1.0.14`, removed `1.0.17`) was what
finally broke the blind-guessing loop — it painted live viewport metrics
(`baseline`, `visualViewport.height`, `innerHeight`, diff, `kbdOpen`, the
`kbd-open`/`editing-field` classes, and the `.mtab-bar` rect) so real numbers
could be read off the device.

### Approaches tried, in order
1. **`visibility:hidden` on the bar** — flipping visibility on a
   `transform:translateZ(0)`-promoted GPU layer left a stale blank/black
   composited tile on Android WebView instead of hiding. **Failed.** Replaced by
   `transform:translateY(120%)` (keeps the layer composited the whole time).
2. **focus/blur on the hidden `#mobileInput`** to drive hide/show — the app
   deliberately *keeps that input focused* after the keyboard is dismissed (so
   the next quick edit needs no re-tap), so `blur` never reliably fires on close
   → bar stuck hidden forever, tab navigation dead. **Failed.** Focus state ≠
   keyboard-visibility state in this app.
3. **`offset = window.innerHeight - visualViewport.height`** detection — reads
   ~0 forever in the WebView (both shrink together). **Failed.** Replaced by a
   remembered **baseline**: `kbdOpen = (baseline - visualViewport.height) > 140`,
   baseline re-synced whenever the viewport is at least as tall as it. This is
   the surviving detection (NOTES rule #7).
4. **Missing `android:windowSoftInputMode="adjustResize"`** in the manifest —
   without it Android *pans* instead of resizing, so `visualViewport` never
   changes and no JS detection can fire. Added it (NOTES rule #9). Necessary,
   not sufficient on its own.
5. **Native `@capacitor/keyboard` plugin** (`keyboardDidShow`/`Hide`) — looked
   "correct" but on a real device the bar slid up with the keyboard and left a
   black gap; the discrete events don't stay in sync with the resize animation
   the way a continuous `visualViewport` listener does. **Reverted** (`1.0.9`→
   `1.0.10`), dependency uninstalled. **Do not retry without on-device iteration.**
6. **Only one of two bottom reservations dropped while `kbd-open`** — the black
   gap was two independent `padding-bottom` reservations: `.editor-panel`
   (dropped in `1.0.7`) **and** `body{padding-bottom:50px}` (missed until
   `1.0.11`). Both now drop via `html.kbd-open body[data-mtab="editor"]{
   padding-bottom:0 !important}` (NOTES rule #11). This killed the black gap.
7. **Bar `transition:transform .16s ease`** — the bar *animated* (slid down)
   when the keyboard opened, sliding through the region the keyboard was
   animating into = the "flicker on open" and the feeling that the bar moves.
   Removed in `1.0.15` (NOTES rule #13): the bar still hides while typing
   (mandatory — a static `bottom:0` bar sits on the keyboard in the resizing
   WebView) but now hides/appears **instantly**, no animation.

### Final resolved state
- Detection: remembered-baseline `visualViewport` height (rule #7).
- `android:windowSoftInputMode="adjustResize"` in the manifest (rule #9).
- Bar hidden via `transform:translateY(120%)`, **no transition** (rule #13).
- Both bottom `padding-bottom` reservations dropped while `kbd-open` (rule #11).
- Confirmed on a real device at `1.0.16`: nothing left above the keyboard, no
  black gap, bar returns cleanly on close, no flicker/animation. Debug HUD
  removed in `1.0.17`.
