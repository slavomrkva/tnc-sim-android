const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ckSource = fs.readFileSync(path.join(root, 'www', 'android', 'custom-keyboard.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'www', 'android', 'styles.css'), 'utf8');
const htmlSource = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const coreSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');

// ── static wiring ──
assert.match(htmlSource, /android\/app\.js" defer><\/script>\s*<script src="android\/custom-keyboard\.js" defer>/,
  'custom-keyboard.js loads after app.js so its global wrappers land last');
assert.match(ckSource, /\{k:'7'\},\{k:'8'\},\{k:'9'\},\{a:'backspace'/, 'row 1 is 7 8 9 backspace');
assert.match(ckSource, /\{k:'4'\},\{k:'5'\},\{k:'6'\},\{a:'sign'/, 'row 2 is 4 5 6 +/-');
assert.match(ckSource, /\{k:'1'\},\{k:'2'\},\{k:'3'\},\{k:','/, 'row 3 is 1 2 3 decimal comma');
assert.match(ckSource, /\{a:'p'[^]*?\{a:'i'[^]*?\{a:'q'[^]*?\{a:'ent'/, 'row 4 is P I Q ENT');
assert.match(ckSource, /\{k:'0'\},\{a:'noent'[^]*?\{a:'end'[^]*?\{a:'close'/, 'row 5 is 0 NO-ENT END hide');
assert.match(ckSource, /window\.focusMobileInput=function\(\)\{\s*if\(FM\.active\)/,
  'native keyboard is suppressed while field mode owns input');
assert.match(cssSource, /html\.ck-open \.keypad \.key\.pi-key\{display:none;\}/, 'duplicate P/I keypad keys hide');
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-fmax\{display:none;\}/, 'duplicate Q control hides');
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-drbtn\[title="Skip this field"\]\{display:none;\}/,
  'duplicate NO ENT (skip) control hides');
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-nav\[onclick="fieldNext\(\)"\]\{display:none;\}/,
  'duplicate ENT (next) control hides');
assert.match(cssSource, /html\.ck-open body\[data-mtab="editor"\] \.ctx-panel\{order:98/,
  'interactive panel re-orders to sit directly above the keyboard');
assert.match(ckSource, /\{a:'p',t:'P',cls:'ck-pi'\},\{a:'i',t:'I',cls:'ck-pi'\}/, 'P and I keys carry the orange style');

// ── behavior: drive the exposed dispatch with the real core sanitizers ──
const ctx = {};
ctx.window = ctx;
ctx.navigator = { userAgent: 'Android test' };
ctx.document = {
  documentElement: { classList: { add(){}, remove(){}, toggle(){} } },
  querySelector(){ return null; },
  createElement(){ return { classList:{add(){},remove(){},toggle(){}}, setAttribute(){}, addEventListener(){}, style:{} }; },
  body: { appendChild(){} }
};
ctx.setTimeout = function(){};
vm.createContext(ctx);
vm.runInContext(coreSource, ctx); // real sanitizeVal / applyNumericSign
ctx.codeEl = { value:'', blur(){}, focus(){} };
ctx.lineNums = { };
ctx.FM = { active:true, builderKey:'L', idx:0, typing:false,
  fields:[{ p:'X', type:'coord', opt:true, val:'0' }] };
ctx.refreshSelection = function(){};
ctx._fieldAcceptsSign = function(f){ return !!f && f.type==='coord'; };
ctx._setFieldSign = function(f, sign){ f.val = ctx.applyNumericSign(f.val, sign); ctx.FM.typing = true; };
ctx.setFieldVal = function(v){ ctx.FM.fields[ctx.FM.idx].val = v; ctx.FM.typing = true; };
let advanced = 0, exited = 0;
ctx.fieldNext = function(){ advanced++; };
ctx.exitFieldMode = function(){ ctx.FM.active = false; exited++; };
ctx.selectField = function(){};
ctx.focusMobileInput = function(){};
ctx.switchFieldMode = function(){};
ctx.toggleIncrementalToken = function(){};
ctx.toggleQField = function(){ ctx.FM.fields[ctx.FM.idx].val = '+Q'; };
vm.runInContext(ckSource, ctx);
assert.strictEqual(typeof ctx._ckHandleKey, 'function', 'dispatch hook is exposed');

const f = ctx.FM.fields[0];
ctx._ckHandleKey('1');
ctx._ckHandleKey('2');
assert.strictEqual(f.val, '12', 'first digit replaces the preset value, second appends');
ctx._ckHandleKey(',');
ctx._ckHandleKey('5');
assert.strictEqual(f.val, '12.5', 'decimal comma writes the "." decimal form');
ctx._ckHandleKey(undefined, 'sign');
assert.strictEqual(f.val, '-12.5', '+/- toggles the sign instead of appending');
ctx._ckHandleKey(undefined, 'sign');
assert.strictEqual(f.val, '+12.5', 'a second +/- flips the sign back');
ctx._ckHandleKey(undefined, 'backspace');
assert.strictEqual(f.val, '+12.', 'backspace removes the last character');
ctx._ckHandleKey(undefined, 'ent');
assert.strictEqual(advanced, 1, 'ENT confirms the field and advances');
ctx.FM.typing = true;
ctx._ckHandleKey(undefined, 'noent');
assert.strictEqual(f.val, null, 'NO ENT skips the optional field');
assert.strictEqual(advanced, 2, 'NO ENT advances to the next field');
ctx._ckHandleKey(undefined, 'q');
assert.strictEqual(f.val, '+Q', 'Q inserts a Q parameter reference');
ctx._ckHandleKey(undefined, 'end');
assert.strictEqual(exited, 1, 'END exits interactive editing');
assert.strictEqual(ctx.FM.active, false, 'field mode is closed after END');
ctx._ckHandleKey('9');
assert.strictEqual(f.val, '+Q', 'keys are ignored once field mode ended');

console.log('custom keyboard regression passed');
