const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

assert.doesNotMatch(read('www/android/app.js'), /\{l:'GOTO'|toolCallList/);
assert.doesNotMatch(read('www/core/block-form-panel.js'), /openGotoPanel|gotoSelect/);
assert.doesNotMatch(read('www/core/editor-core.js'), /function onGoto\b|toolCallList/);
assert.doesNotMatch(read('www/core/field-editing.js'), /gotoLine\s*:|openGotoPanel/);
assert.doesNotMatch(read('www/core/parser-engine.js'), /toolCallList|GOTO dropdown/);

console.log('goto-removed.test.js: all assertions passed');
