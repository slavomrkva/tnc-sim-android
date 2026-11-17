'use strict';
// Android port of the web v1.000 simplified UI (www/android/ui-shell.js).
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const html = read('www/index.html');
const shell = read('www/android/ui-shell.js');
const css = read('www/android/styles.css');

assert.match(html, /android\/custom-keyboard\.js" defer><\/script>\s*<script src="android\/ui-shell\.js" defer>/,
  'ui-shell.js loads last, after app.js and custom-keyboard.js');
assert.match(shell, /querySelector\('\.panel-header \.ph-tools'\)/, 'Help and Program join the Android tool row');
assert.match(shell, /querySelector\('\.panel-header \.ph-hdr-actions'\)/, 'Settings and About join the Android name row');
assert.match(shell, /documentElement\.classList\.add\('ui-shell'\)/, 'the old buttons are hidden only after mounting');
['openHelp', 'openMCodesList', 'importProgram', 'exportProgram', 'toggleKpHelp', 'openAboutPopup']
  .forEach(fn => assert.ok(shell.includes(`'${fn}'`) || shell.includes(fn + '()') || shell.includes(fn + ' ==='),
    `menus still reach ${fn}`));
assert.doesNotMatch(shell, /\/learn\/|play\.google\.com|header \.logo/, 'no website-only links or header in the app');
assert.doesNotMatch(shell, /getElementById\('qualityGroup'\)|tr\('3D quality'\)/, '3D quality stays only in Simulation controls');
assert.doesNotMatch(shell, /us-support|openBugReport/, 'no footer bug-report line in the app');
assert.match(read('www/core/theme-toast.js'), /openBugReport\(\)/, 'bug reports are reached from About');
assert.match(read('www/android/i18n-about-de.js'), /openBugReport\(\)/, 'German About keeps the bug report button');
assert.match(css, /html\.ui-shell \.ph-tools > #kpHelpBtn/, 'the app hides its old Help button behind the menu');
assert.doesNotMatch(css, /min-width:1025px\)\s*and\s*\(min-height:601px\)\s*\{[^}]*ui-shell/,
  'desktop-only ui-shell rules are not ported to the always-mobile app');
console.log('ui-shell.test.js: Android menus wired to the app header');
