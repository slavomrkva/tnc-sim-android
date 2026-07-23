const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const button = html.match(/<button id="mtabView"[\s\S]*?<\/button>/);

assert.ok(button, 'the bottom simulation tab must exist');
assert.match(button[0], /aria-label="Simulate in 3D"/, 'the tab must retain its 3D meaning for assistive technology');
assert.match(button[0], /fill="none"[^>]*stroke="currentColor"[^>]*stroke-width="1\.9"/,
  'the tab play icon must use the same outlined visual weight as its peers');
assert.match(button[0], /<path d="M6 7\.2 19 10\.9a1\.2 1\.2 0 0 1 0 2\.2L6 16\.8/,
  'the tab must show the approved wide, rounded and vertically symmetric play outline');

const styles = fs.readFileSync(path.join(root, 'www', 'android', 'styles.css'), 'utf8');
assert.match(styles, /\.mtab-bar #mtabView \.mi svg\{width:26px;height:26px;\}/,
  'the Simulate icon must be slightly larger than the other tab icons');
assert.match(button[0], /<\/svg><\/span>Simulate<\/button>/, 'the visible tab label must be Simulate');
assert.doesNotMatch(button[0], />3D<\/button>/, 'the old visible 3D label must be removed');

console.log('Mobile Simulate tab regression passed.');
