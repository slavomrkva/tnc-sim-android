# TNC Sim Android — current project contract

This is the concise, current operating map. Historical detail through 1.0.36
is preserved in
[`docs/history/project-notes-through-1.0.36.md`](docs/history/project-notes-through-1.0.36.md),
and the continuing technical log lives in
[`docs/history/changelog.md`](docs/history/changelog.md). Do not copy those
histories back here.

## Product and source layout

This is the standalone Capacitor Android app for TNC Sim, published as
`org.tncsim.twa`. It replaced the old TWA under the same Play listing.

- `www/` is the app source. Edit `www/index.html`, `www/core/`, and
  `www/android/`; never edit generated `android/app/src/main/assets/public/`.
- `www/core/` contains deliberately shared logic. The web repo's `core/` is the
  reference for intentional ports, but nothing syncs automatically.
- `www/android/` contains forced-mobile layout, WebView keyboard behavior,
  onboarding, styles, Android export handling, and order-sensitive boot code.
- `android/` is the native Gradle project. Run `npx cap sync android` before
  every build after a `www/` change.
- `sync-core.sh` is manual, confirmation-gated, and one-way web → Android. Do
  not overwrite either product wholesale; preserve documented Android limits.

The detailed module-split rationale is in
[`docs/history/module-split-refactor.md`](docs/history/module-split-refactor.md).

## Versioning

- `APP_VERSION` in `www/android/app.js` is the on-device build marker. Stay in
  the permanent `1.0.x` sequence and increment the final segment on every push.
- `versionCode` and `versionName` in `android/app/build.gradle` are independent
  Play Store identifiers. Change them only for an actual Play release and make
  `versionCode` higher than every code already uploaded.
- Record every push briefly in `docs/history/changelog.md`. Update this file
  only when a current contract changes. Add `RELEASE_NOTES.md` only for a
  meaningful user-visible change.

## Edit, build, and release

1. Edit source under `www/` and preview in a browser when the behavior is not
   Capacitor-only.
2. Run `npm install` when dependencies changed, then `npx cap sync android`.
3. Build/test on a device for WebView, keyboard, export, or native behavior.
4. Before push, verify `origin` is `tnc-sim-android`, inspect the exact diff,
   and check that no keystore, recovery codes, build artifacts, or unrelated
   local files are included.
5. For Play: use a new `versionCode`, the original signing keystore, and the
   current `RELEASE_NOTES.md` entry. Upload to the existing `org.tncsim.twa`
   listing.
6. After a shipped release, create `android-v<version>-code-<versionCode>`, a
   GitHub Release with the signed bundle attached, and retain the latest four
   shipped releases. Never commit APK/AAB artifacts.

## Current non-obvious invariants

0. **Always mobile layout:** Android unconditionally uses the single-column
   Editor/3D/Learn layout. Preserve hardcoded `_isMTab()`/`isMob()` behavior and
   Android CSS when porting web changes.
1. **Package identity:** `applicationId` and Capacitor `appId` stay
   `org.tncsim.twa`; changing either creates a different Play app.
2. **Signing:** every Play release uses the original private keystore, which is
   never committed.
3. **Remote safety:** verify `origin` before every push; this checkout lineage
   has previously pointed at the web repo.
4. **Secret hygiene:** inspect staged files; `.gitignore` cannot remove secrets
   already committed.
5. **Source ownership:** `www/` is authoritative. Generated assets are not.
6. **Capacitor sync:** after any `www/` change, sync before building or the APK
   will contain stale content.
7. **Keyboard detection:** only the remembered `visualViewport.height`
   baseline drives `kbd-open`/`editing-field`. Do not replace it with focus,
   inner-height offsets, visibility toggles, or native keyboard events. Device
   verification is mandatory. Full failed-attempt history is in
   `BUG_HISTORY.md`.
8. **Build marker:** `APP_VERSION` is intentionally separate from Play version
   identifiers.
9. **Native resize mode:** keep
   `android:windowSoftInputMode="adjustResize"`; keyboard detection cannot work
   without it.
10. **Module boundaries:** keep order-sensitive IIFEs in `www/android/app.js`;
    see the module-split history before moving scripts or shared CSS.
11. **Keyboard spacing:** while `kbd-open`, remove the editor body's bottom-tab
    reservation or it becomes a dark strip above the keyboard.
12. **Renderer resize:** `loop()` keeps calling `resizeToDisplay()`; window
    `resize` alone misses container changes.
13. **Bottom tab bar:** it hides instantly while editing; do not animate its
    transform.
14. **Bug lifecycle:** new/open bugs live in `TODO.md`; log every attempt there.
    On acceptance, move symptom, cause, attempts, and device evidence to
    `BUG_HISTORY.md` in the same change. Mirror cross-repo bugs.
15. **Chunked voxel limits:** keep the one-cell dirty halo, recursive Measure
    raycasting, group-safe disposal, and Android's lower 12M live / 32M Refine
    guards during shared-core ports.
16. **Zero is a valid Q value:** use `Q !== undefined ? Q : default`, never
    `Q || default` for cycle parameters.
17. **Adaptive Android WebGL:** healthy devices must start with the normal
    quality renderer. Persist the explicit WebGL1 safe mode only after a
    context loss remains unrestored while the app is visible; a background
    loss waits until foreground. Key it to the Android WebView user-agent so a
    WebView update retries normal quality, and never force safe mode globally.

Add a numbered rule only for a durable invariant that is not already covered.
Resolved narratives belong in `BUG_HISTORY.md`; retired architecture detail and
the technical log belong in `docs/history/`.

## Testing before push or release

- Run relevant parser/geometry/browser tests.
- Run `npx cap sync android` after the last `www/` change before building.
- Test native-only behavior on a device or emulator.
- Confirm package identity, remote, staged files, version markers, and signing
  key requirements.
- Keep GitHub `main` current after acceptance; a local APK alone is not done.
