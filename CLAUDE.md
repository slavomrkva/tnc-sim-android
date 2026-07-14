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
6. Keep root Markdown as a small navigation layer: update an existing relevant
   section instead of duplicating it, put background and retired detail in its
   existing `docs/history/` topic, and do not create new root `.md` files unless
   the information is a new current contract.

## Non-negotiables

- Edit app content in `www/`; run `npx cap sync android` before every build
  after a `www/` change.
- Every push bumps `APP_VERSION` in `www/android/app.js` by one last segment,
  updates `NOTES.md`, and uses the `1.0.x` series.
- Before every push, verify that `origin` is `tnc-sim-android`; never commit a
  keystore, recovery codes, build artifacts, or unrelated local files.
- A user-visible change also gets a short `RELEASE_NOTES.md` entry. Add a new
  numbered NOTES rule only for a durable, non-obvious pitfall.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- `graphify-out/` is tracked in git, not local-only: commit its changed files together with the
  code change that triggered them, in the same push. This repo has no persistent local checkout
  (worked on from phone and computer), so the graph must be current on GitHub after every push.
