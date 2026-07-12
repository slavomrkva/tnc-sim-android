# TNC Sim Android

Standalone Capacitor Android app. The whole app is `www/index.html` — edit it
directly here. This repo is independent of the web repo (`slavomrkva/tnc-sim`);
nothing auto-syncs, and changes here cannot affect the website.

Read `NOTES.md` in this repo root before making any change — it has the
project map, non-obvious rules (applicationId, keystore signing, the correct
`origin` remote, `cap sync` before building), and the edit/preview/release
flows.

**Every push must bump `APP_VERSION` in `www/index.html` by +1 on the last
segment — no exceptions.** App stays in the `1.0.x` series (see NOTES.md rule
#8; web repo separately uses `0.80x`, never confuse the two schemes).

For user-visible or important changes, also add a short line to
`RELEASE_NOTES.md` — its top entry is what goes into the Play Console
"What's new" box for the next release.

After making a change, also update `NOTES.md`: add a line to its Changelog,
and add a new numbered rule under "NON-OBVIOUS RULES" if you hit a
non-obvious pitfall.
