# TNC Sim Android

Standalone Capacitor Android app. The app source is `www/`: `www/index.html`
is the shell and it loads classic JS/CSS modules from `www/core/` and
`www/android/`. This repo is independent of `slavomrkva/tnc-sim`; nothing
syncs automatically.

## Start of every session

1. Read `CLAUDE.md`, `NOTES.md`, and `TODO.md`. Read `README.md` only for product
   orientation.
2. For a bug, read only the relevant `BUG_HISTORY.md` entry. Cross-repo bugs
   must be tracked in both repositories.
3. For a Play release, read `RELEASE_NOTES.md`, the release flow in `NOTES.md`,
   and `store/README.md` only when store assets/listing are involved.
4. Read `docs/history/` only when a current document links to the relevant
   topic. Historical files are context, not current instructions.

## Non-negotiables

- Edit app content in `www/`; run `npx cap sync android` before every build
  after a `www/` change.
- Every push bumps `APP_VERSION` in `www/android/app.js` by one last segment,
  adds a short entry to `docs/history/changelog.md`, and uses the `1.0.x`
  series. Update `NOTES.md` only when a current contract changes.
- Before every push, verify that `origin` is `tnc-sim-android`; never commit a
  keystore, recovery codes, build artifacts, or unrelated local files.
- A user-visible change also gets a short `RELEASE_NOTES.md` entry. Add a new
  numbered NOTES rule only for a durable, non-obvious pitfall.

## Documentation budget

- `CLAUDE.md` routes the session; `NOTES.md` contains current contracts;
  `TODO.md` contains only open work; `BUG_HISTORY.md` preserves resolved bug
  evidence; `docs/history/changelog.md` is the append-only technical log.
- Do not copy historical detail back into root navigation files. Preserve it in
  `docs/history/` and leave one link from the current rule that still matters.
- Prefer tightening an existing rule over adding another. If a rule only
  describes a resolved incident, move the incident to history and keep only
  the invariant that prevents recurrence.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

For codebase questions, query the tracked graph first when
`graphify-out/graph.json` exists (`graphify query`, then `path`/`explain` as
needed). Use the wiki for broad navigation and the full report only for broad
architecture review. After code changes run `graphify update .` and commit the
current tracked graph and cache changes with the same push. Do not commit its
dated backup directories; Git history already preserves prior graphs. Prune
obsolete cache blobs rather than accumulating them. Documentation-only changes
do not require a graph rebuild.
