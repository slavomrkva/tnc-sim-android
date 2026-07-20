const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const button = html.match(/<button id="mtabView"[\s\S]*?<\/button>/);

assert.ok(button, 'the bottom simulation tab must exist');
assert.match(button[0], /aria-label="Simulate in 3D"/, 'the tab must retain its 3D meaning for assistive technology');
assert.match(button[0], /<path d="M8 5l10 7-10 7z"[^>]*fill="currentColor"/, 'the tab must show a play icon');
assert.match(button[0], /<\/svg><\/span>Simulate<\/button>/, 'the visible tab label must be Simulate');
assert.doesNotMatch(button[0], />3D<\/button>/, 'the old visible 3D label must be removed');

console.log('Mobile Simulate tab regression passed.');
