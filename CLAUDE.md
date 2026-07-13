# TNC Sim Android

Standalone Capacitor Android app. The app source is `www/`: `www/index.html`
is the shell and it loads classic JS/CSS modules from `www/core/` and
`www/android/`. This repo is independent of `slavomrkva/tnc-sim`; nothing
syncs automatically.

## Start of every session

1. Read every root Markdown file and `store/README.md` before analysing or
   editing.
2. For a bug, read `TODO.md` and the relevant `BUG_HISTORY.md` entry. Cross-repo
   bugs must be tracked in both repositories.
3. For a Play release, read `RELEASE_NOTES.md` and the Release flow in
   `NOTES.md`.
4. Read `docs/history/` only when a current root document links to the relevant
   topic.
5. When shortening documentation, move durable detail to `docs/history/` and
   leave a focused root link; do not discard project context.

## Non-negotiables

- Edit app content in `www/`; run `npx cap sync android` before every build
  after a `www/` change.
- Every push bumps `APP_VERSION` in `www/android/app.js` by one last segment,
  updates `NOTES.md`, and uses the `1.0.x` series.
- Before every push, verify that `origin` is `tnc-sim-android`; never commit a
  keystore, recovery codes, build artifacts, or unrelated local files.
- A user-visible change also gets a short `RELEASE_NOTES.md` entry. Add a new
  numbered NOTES rule only for a durable, non-obvious pitfall.
