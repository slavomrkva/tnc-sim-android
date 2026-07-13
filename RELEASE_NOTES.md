# TNC Sim (Android) — Release notes

Per-release "What's new", newest first. **Copy the top entry into the Play
Console "What's new" field** when you ship that release. The detailed
technical/developer changelog lives in `NOTES.md`; this file is the short,
user-facing history.

> **For developers:** whenever you ship a meaningful or user-visible change,
> add a short line here under the release's `versionName (versionCode)`. Skip
> purely internal tweaks — those go only in `NOTES.md`. Keep it in plain
> language a user understands (it goes on the Play Store).
>
> **Release archive:** after every shipped Android release, archive the signed
> `.aab` outside this repository using `android-<version>-code-<versionCode>.aab`,
> create the matching Git tag `android-v<version>-code-<versionCode>`, and create
> a GitHub Release with the `.aab` attached. For web releases, create the matching
> `web-v<APP_VERSION>` Git tag. Never commit `.aab` or `.apk` artifacts to Git.

---

## 1.0.3 (versionCode 4)
- The bottom Editor / 3D / Learn tab bar behaves properly with the on-screen
  keyboard now: it no longer slides up with the keyboard, leaves no black gap
  above it, doesn't flicker or animate when the keyboard opens, and reliably
  reappears when you close the keyboard.
- Learn: fixed an empty dark strip at the bottom of the lessons — the lesson
  panel now fills the screen down to the bottom tabs.
- Improved light mode with a cleaner workspace, better contrast, and clearer controls.
- Fixed 3D model distortion when resizing the window or changing the layout.
- Minor bug fixes and stability improvements.

## 1.0.2 (versionCode 3)
- New welcome tour on first launch.
- Cleaner top bar and editor toolbar.
- Full-width layout on tablets — the 3D simulation is no longer cramped.
- The bottom tab bar no longer gets in the way when the keyboard is open.
- The app now uses its own icon.
- 3D engine is bundled — full offline support from the first launch.
- App version is shown in the About dialog.
- More reliable 3D on older phones and devices with aggressive GPU management.

## 1.0.1 (versionCode 2)
- Rebuilt the app (now a Capacitor build) for better offline use and a
  cleaner full-screen experience with no browser address bar.

## 1.0 (versionCode 1)
- Initial release.
