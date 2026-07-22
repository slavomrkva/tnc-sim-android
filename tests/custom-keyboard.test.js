const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ckSource = fs.readFileSync(path.join(root, 'www', 'android', 'custom-keyboard.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(root, 'www', 'android', 'styles.css'), 'utf8');
const htmlSource = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const coreSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');

// ── static wiring ──
assert.match(htmlSource, /android\/app\.js" defer><\/script>\s*<script src="android\/custom-keyboard\.js" defer>/,
  'custom-keyboard.js loads after app.js so its global wrappers land last');
assert.match(ckSource, /\{k:'7'\},\{k:'8'\},\{k:'9'\},\{a:'backspace'/, 'row 1 is 7 8 9 backspace');
assert.match(ckSource, /\{k:'4'\},\{k:'5'\},\{k:'6'\},\{a:'sign'/, 'row 2 is 4 5 6 +/-');
assert.match(ckSource, /\{k:'1'\},\{k:'2'\},\{k:'3'\},\{k:','/, 'row 3 is 1 2 3 decimal comma');
assert.match(ckSource, /\{a:'p',t:'P',cls:'ck-pi'\},\{a:'i',t:'I',cls:'ck-pi'\},\{a:'q',t:'Q'\},\{a:'ent'/, 'row 4 is P I Q ENT, P/I orange');
assert.match(ckSource, /\{k:'0'\},\{a:'noent'[^]*?\{a:'end'[^]*?\{a:'close'/, 'row 5 is 0 NO-ENT END hide');

// v3 multi-editor routing + TOOL DEF exception
assert.match(ckSource, /wrap\('renderBlkPanel'/, 'keyboard wires into BLK FORM wizard');
assert.match(ckSource, /wrap\('openMPanel'/, 'keyboard wires into Edit M panel');
assert.match(ckSource, /wrap\('openQPopup'/, 'keyboard wires into cycle-parameter Q editing');
assert.match(ckSource, /wrap\('openToolDefEdit', function\(\)\{ hide\(false\); blurEditorNow\(\); \}\)/,
  'TOOL DEF opens NO keyboard — custom hidden and native blurred away');
// BLK wizard active on every step (step 0 shape picker also shows the keyboard)
assert.match(ckSource, /if\(typeof BLK!=='undefined' && BLK\.active\) return \{\s*\n\s*kind:'input', input:el\('blkFbarVal'\)/,
  'BLK target is active on every step, not only when #blkFbarVal exists');
// Cycle-parameter Q bug: inserting Q clears freshInput so the next digit appends
assert.match(ckSource, /else if\(t\.q\)\{ freshInput=false; t\.q\(\); \}/,
  'Q insertion clears freshInput so the following digit appends to Q');
// Problems collapsed by default and hidden above the keyboard
assert.match(appSource, /var problemsOpen = false;/, 'Problems list is collapsed by default (summary row only)');
assert.match(cssSource, /html\.ck-open\s+body\[data-mtab="editor"\] \.problems,\s*\n\s*html\.kbd-open body\[data-mtab="editor"\] \.problems\{display:none !important;\}/,
  'Problems bar is hidden while either keyboard is open');
assert.match(ckSource, /window\.focusMobileInput=function\(\)\{\s*if\(FM\.active\)/,
  'native keyboard is suppressed while field mode owns input');

// panel changes
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-done\{display:none;\}/, 'DONE buttons hidden (ENT on keyboard)');
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-fmax\{display:none;\}/, 'duplicate Q control hidden');
assert.match(cssSource, /html\.ck-open \.ctx-panel \.fbar-drbtn\[title="Skip this field"\]\{display:none;\}/,
  'skip control hidden (NO ENT on keyboard)');
assert.doesNotMatch(cssSource, /fbar-nav\[onclick="fieldNext\(\)"\]\{display:none;\}/, 'the ▶ / → next control stays visible');
assert.match(cssSource, /html\.ck-open body\[data-mtab="editor"\] \.ctx-panel\{order:98/,
  'interactive panel re-orders to sit directly above the keyboard');

// P and I removed from the keypad; Q stays (it opens the Q-assignment builder)
assert.doesNotMatch(appSource, /var PI_KEYS=\[[^]*?\{l:'P'/, 'P removed from the keypad PI_KEYS row');
assert.doesNotMatch(appSource, /var PI_KEYS=\[[^]*?\{l:'I'/, 'I removed from the keypad PI_KEYS row');
assert.match(appSource, /var PI_KEYS=\[\s*\{l:'M'[^]*?\{l:'Q', sub:'Q parameter', code:'Q', qParam:true\},\s*\];/,
  'PI_KEYS keeps M and Q (Q opens the multi-step assignment builder)');
// keyboard wires the Q-builder numeric steps (operators stay panel buttons)
assert.match(ckSource, /wrap\('renderQParamPanel'/, 'keyboard drives the Q-assignment builder numeric steps');
assert.match(ckSource, /window\._qpFocusMobile=function/, 'native keyboard suppressed for the Q-builder');

// ── FM (guided field) behavior via the exposed dispatch ──
const ctx = {};
ctx.window = ctx;
ctx.navigator = { userAgent: 'Android test' };
ctx.document = {
  documentElement: { classList: { add(){}, remove(){}, toggle(){} } },
  querySelector(){ return null; },
  createElement(){ return { classList:{add(){},remove(){},toggle(){}}, setAttribute(){}, addEventListener(){}, style:{} }; },
  body: { appendChild(){} },
  _ids: {},
  getElementById(id){ return this._ids[id] || null; }
};
ctx.setTimeout = function(){};
vm.createContext(ctx);
vm.runInContext(coreSource, ctx); // real sanitizeVal / applyNumericSign
ctx.codeEl = { value:'', blur(){}, focus(){} };
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
ctx.BLK = { active:false };
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

// ── BLK FORM (real-input panel) routing ──
function makeInput(v){
  const listeners = {};
  return {
    value: v, inputMode: '',
    addEventListener(t, fn){ (listeners[t]||(listeners[t]=[])).push(fn); },
    dispatchEvent(ev){ (listeners[ev.type]||[]).forEach(fn=>fn(ev)); return true; },
    setAttribute(){}, focus(){}, select(){}
  };
}
ctx.Event = function(type){ this.type = type; };
const blkInput = makeInput('-50');
ctx.document._ids['blkFbarVal'] = blkInput;
ctx.BLK = { active:true, step:1, editLine:null, x0:0 };
let blkAdvanced = 0, blkInserted = 0;
ctx.blkConfirmStep = function(){ blkAdvanced++; };
ctx.blkStepRel = function(){ blkAdvanced++; };
ctx.insertBlkForm = function(){ blkInserted++; };
// simulate a fresh field render setting the replace-on-first-key flag
ctx.renderBlkPanel = function(){};
ctx.window._ckHandleKey; // keep reference

// emulate what the renderBlkPanel wrapper does: fresh input for the new field
// (the wrapper set freshInput=true; drive it by typing which should replace)
blkInput.value = '-50';
// The module's freshInput starts false, so type appends here — verify BLK routing
// works by using the sign/backspace/ent/end paths which don't depend on freshInput.
ctx._ckHandleKey(undefined, 'sign');
assert.strictEqual(blkInput.value, '+50', 'BLK +/- toggles the sign on the real input');
ctx._ckHandleKey('7');
assert.strictEqual(blkInput.value, '+507', 'BLK digit appends to the real input and fires input event');
ctx._ckHandleKey(',');
ctx._ckHandleKey('5');
assert.strictEqual(blkInput.value, '+507.5', 'BLK decimal comma writes "." into the real input');
ctx._ckHandleKey(undefined, 'backspace');
assert.strictEqual(blkInput.value, '+507.', 'BLK backspace edits the real input');
ctx._ckHandleKey(undefined, 'ent');
assert.strictEqual(blkAdvanced, 1, 'BLK ENT advances the wizard');
ctx._ckHandleKey(undefined, 'end');
assert.strictEqual(blkInserted, 1, 'BLK END commits the block');

console.log('custom keyboard v3 regression passed');
