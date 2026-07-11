# TNC Sim — Android app

The **Android app** for [TNC Sim](https://tncsim.org), a free, open-source
simulator for Heidenhain TNC (Klartext) CNC programming. Built with
**Capacitor** — the whole app is `www/index.html`, wrapped in a native Android
shell so it runs fully offline with no browser address bar. Published on the
Play Store as `org.tncsim.twa`.

This repo is standalone: the app content in `www/` is its own source and is
independent of the website repo.

## What it does

- 3D simulation of Klartext programs — `L`, `C`, `CC`, `CR`, `RND`, `CHF`, cycles, Q parameters
- RL/RR radius compensation
- Tool table with flat, ball-nose, torus, and conical tool shapes
- 15 interactive lessons, live syntax highlighting, dark/light theme
- Works fully offline (Three.js is bundled, no CDN)

## Project layout

- `www/` — the app itself (`index.html` + bundled `vendor/` Three.js + icons).
  **Edit here.**
- `android/` — native Android/Gradle project.
- `capacitor.config.json` — Capacitor config (`appId`, `webDir: www`).
- `NOTES.md` — project map, rules, and the edit/preview/release flows. Read it first.

## Build

```bash
npm install
npx cap sync android
npx cap open android   # then Generate Signed Bundle in Android Studio
```

## Status

Early release. Not a substitute for verification on a real control — don't make
machining decisions from it without checking the program another way first.

## License

See [LICENSE](LICENSE).

## Disclaimer

Not affiliated with or endorsed by HEIDENHAIN GmbH. "Heidenhain" and "TNC" are
trademarks of their respective owner, used here only to describe compatibility.
