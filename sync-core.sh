#!/usr/bin/env bash
# Manual, confirmation-gated sync of core/*.js from the web repo (tnc-sim,
# source of truth) into this repo's www/core/. NEVER runs automatically (no
# hook, no CI, no part of the release flow) -- you run it by hand when you
# know you want to pull a specific core-engine change from web into the app.
#
# Direction is always web -> android. Never edit www/core/*.js as if it were
# canonical here; if you need an android-only tweak to shared logic, that
# logic no longer belongs in core/ -- move the affected function(s) out to
# android/ instead (and mirror in web/ if web needs the same fix).
#
# Usage:
#   ./sync-core.sh                  # review + sync all core/*.js
#   ./sync-core.sh tool-table.js    # review + sync just one file
set -euo pipefail

WEB_REPO="${WEB_REPO:-../tnc-sim-repo}"
ANDROID_CORE="www/core"
WEB_CORE="$WEB_REPO/core"

if [ ! -d "$WEB_CORE" ]; then
  echo "Web repo core/ not found at $WEB_CORE (set WEB_REPO=/path/to/tnc-sim to override)." >&2
  exit 1
fi

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
  files=($(cd "$WEB_CORE" && ls *.js))
fi

for f in "${files[@]}"; do
  web_file="$WEB_CORE/$f"
  android_file="$ANDROID_CORE/$f"
  if [ ! -f "$web_file" ]; then
    echo "SKIP $f: not found in web repo's core/" >&2
    continue
  fi
  if [ ! -f "$android_file" ]; then
    echo "=== $f is NEW (no android copy yet) ==="
    cat "$web_file"
    read -p "Create www/core/$f from web? [y/N] " ans
    if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
      cp "$web_file" "$android_file"
      echo "Created $android_file"
    fi
    continue
  fi
  if diff -q "$web_file" "$android_file" > /dev/null 2>&1; then
    echo "OK   $f: already identical"
    continue
  fi
  echo "=== $f differs (web -> android) ==="
  diff -u "$android_file" "$web_file" || true
  read -p "Overwrite www/core/$f with the web version? [y/N] " ans
  if [[ "$ans" == "y" || "$ans" == "Y" ]]; then
    cp "$web_file" "$android_file"
    echo "Synced $android_file"
  else
    echo "Left $android_file unchanged"
  fi
done

echo
echo "Done. Remember: this only touches www/core/*.js. Run 'npx cap sync android'"
echo "and bump APP_VERSION before your next build, per NOTES.md."
