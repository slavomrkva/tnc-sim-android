# Module-split refactor — historical context

Read this file only when changing module boundaries, shared-core
synchronization, CSS ownership, or the script-load order. Current contracts
live in the root Markdown files.

## Refactor context (2026-07-12)

- The web repo's `core/*.js` and this repo's `www/core/*.js` were byte-for-byte
  identical as of the split, verified mechanically. They can deliberately drift
  as either product changes. Do not assume they still match: compare the files
  or use the explicit one-way web → Android sync when that is the intended
  change.
- The first attempt at the refactor used a stale, roughly 30-commit-old local
  checkout of the web repo (`tnc-sim`). It lacked PWA support, the light-theme
  rework, Learn mode, and mobile tabs. It therefore wrongly treated Learn mode
  and mobile tabs as Android-only. That uncommitted attempt was discarded and
  redone against the real `origin/main`. If old references disagree with the
  current root documents and actual `www/core/` / `www/android/` contents,
  trust the current documents and files, not stale memory.
- CSS was not compared rule-by-rule between the two products; it was moved as a
  whole product-specific block (`web/styles.css` versus
  `www/android/styles.css`). A possible future `core/styles.css` is unstarted
  work, not a safe or verified refactor.
- Five small byte-identical, immediately executing anonymous IIFEs (version
  badge, bug-report `window.onerror` hook, panel-resize handle, view hint, and
  service-worker-registration guard) deliberately remain duplicated in each
  product's `app.js`. At least the version badge depends on `APP_VERSION` being
  assigned earlier in that same file. Moving those blocks to a `core/` script
  loaded first would break their execution order. This is intentional
  duplication, not a bug.
- When extracting a `function name(){...}` block, stop at its closing `}`. An
  earlier move captured trailing same-line content (`}/* next doc comment */`),
  leaving a broken comment fragment behind and silently breaking a different
  function. If a split-file move produces a blank app without a useful console
  error, inspect the exact concatenation boundary.
