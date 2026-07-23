const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const editorSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');
const panelsSource = fs.readFileSync(path.join(root, 'www', 'android', 'panels.js'), 'utf8');
const fieldSource = fs.readFileSync(path.join(root, 'www', 'core', 'field-editing.js'), 'utf8');
const cycleSource = fs.readFileSync(path.join(root, 'www', 'core', 'cycle-picker.js'), 'utf8');
const blockSource = fs.readFileSync(path.join(root, 'www', 'core', 'block-form-panel.js'), 'utf8');

const context = {
  console,
  document: {getElementById(){ return null; }},
  window: {}
};
vm.createContext(context);
vm.runInContext(editorSource, context, {filename:'editor-core.js'});

function lineStart(code, index){
  return code.split('\n').slice(0, index).join('\n').length + (index ? 1 : 0);
}

function enterAt(code, line, column){
  const text = code.split('\n')[line];
  const pos = lineStart(code, line) + (column === undefined ? text.length : column);
  return context.planProgramBlockInsertion(code, pos, pos, '', 'enter');
}

const cycleProgram = [
  'BEGIN PGM TEST MM',
  'CYCL DEF 200',
  ' Q200=+2',
  ' Q201=-5',
  'L X+0 Y+0',
  'END PGM TEST MM'
].join('\n');

{
  const model = context.analyzeProgramRows(cycleProgram.split('\n'));
  assert.deepStrictEqual(Array.from(context.computeBlockNumbers(cycleProgram.split('\n'))),
    [0, 1, null, null, 2, 3], 'a cycle and all directly following Q rows form one numbered block');
  assert.strictEqual(model.blocks[1].anchor, 1);
  assert.strictEqual(model.blocks[1].end, 3);
  assert.strictEqual(model.rows[1].blockIndex, model.rows[2].blockIndex);
  assert.strictEqual(model.rows[2].blockIndex, model.rows[3].blockIndex);
}

for(const line of [1, 2, 3]){
  const plan = enterAt(cycleProgram, line);
  assert.strictEqual(plan.changed, true, `Enter on cycle physical row ${line} inserts a block`);
  assert.strictEqual(plan.value, cycleProgram.replace('\nL X+0 Y+0', '\n\nL X+0 Y+0'),
    'the empty block is placed after the complete cycle');
  assert.deepStrictEqual(Array.from(context.computeBlockNumbers(plan.value.split('\n'))),
    [0, 1, null, null, 2, 3, 4], 'the inserted empty block owns the next logical number');
}

{
  const line = 2;
  const start = lineStart(cycleProgram, line);
  const end = start + cycleProgram.split('\n')[line].length;
  const plan = context.planProgramBlockInsertion(cycleProgram, start, end, '', 'enter');
  assert.strictEqual(plan.changed, true, 'an active/selected cycle row behaves like a caret in that row');
  assert.strictEqual(plan.insertLine, 4);
}

{
  const once = enterAt(cycleProgram, 3).value;
  const again = enterAt(once, 3);
  assert.strictEqual(again.changed, false, 'Enter on the same cycle reuses its adjacent empty block');
  assert.strictEqual(again.reason, 'reuse-placeholder');
  const onPlaceholder = enterAt(once, 4);
  assert.strictEqual(onPlaceholder.changed, false, 'an already active empty block remains the insertion target');
}

for(const column of [0, 'END PGM TEST MM'.length]){
  const plan = enterAt(cycleProgram, 5, column);
  assert.strictEqual(plan.changed, false, 'Enter on END PGM is a strict no-op');
  assert.strictEqual(plan.reason, 'end-pgm');
  assert.strictEqual(plan.value, cycleProgram);
}

{
  const plan = context.planProgramBlockInsertion(
    cycleProgram, lineStart(cycleProgram, 3), lineStart(cycleProgram, 3),
    'TOOL CALL 1 Z S10000 F2000', 'command');
  assert.strictEqual(plan.insertLine, 4, 'a command requested on a Q row is inserted after the complete cycle');
}

{
  const plan = context.planProgramBlockInsertion(
    cycleProgram, lineStart(cycleProgram, 5), lineStart(cycleProgram, 5),
    'M30', 'command');
  assert.strictEqual(plan.insertLine, 5, 'a command requested on END PGM is inserted before END PGM');
  assert.ok(plan.value.endsWith('M30\nEND PGM TEST MM'));
}

{
  const plan = context.planProgramBlockInsertion('', 0, 0, 'BEGIN PGM TEST MM', 'command');
  assert.strictEqual(plan.value, 'BEGIN PGM TEST MM',
    'the first command can be inserted into the completely empty Learn editor');
  assert.strictEqual(plan.insertStart, 0);
}

{
  const withPlaceholder = enterAt(cycleProgram, 3).value;
  const plan = context.planProgramBlockInsertion(
    withPlaceholder, lineStart(withPlaceholder, 4), lineStart(withPlaceholder, 4),
    'M3', 'command');
  assert.strictEqual(plan.value, withPlaceholder.replace('\n\nL X+0 Y+0', '\nM3\nL X+0 Y+0'),
    'programming a command replaces the numbered empty block instead of adding another row');
}

{
  const code = 'BEGIN PGM TEST MM\nL X+0 ~\n Y+1\nEND PGM TEST MM';
  assert.deepStrictEqual(Array.from(context.computeBlockNumbers(code.split('\n'))), [0, 1, null, 2],
    'tilde continuation rows share the anchor block number');
}

{
  const code = 'BEGIN PGM TEST MM\nCYCL DEF 200\n Q200=+2\n\nQ201=-20\nEND PGM TEST MM\n';
  const model = context.analyzeProgramRows(code.split('\n'));
  assert.deepStrictEqual(Array.from(context.computeBlockNumbers(code.split('\n'))),
    [0, 1, null, 2, 3, 4, null],
    'an empty block ends a cycle continuation and a final textarea newline is not a program block');
  assert.strictEqual(model.blocks.length, 5);
}

{
  const downloads = [];
  context.codeEl = {value:'BEGIN PGM TEST MM\n\nEND PGM TEST MM\n'};
  context._docName = 'TEST.H';
  context._downloadTextFile = (text, name) => downloads.push({text, name});
  context.exportProgram();
  assert.strictEqual(downloads[0].text, '0  BEGIN PGM TEST MM\n1  \n2  END PGM TEST MM',
    'export preserves internal numbered empty blocks but drops the final textarea artifact');
}

{
  let undoCount = 0;
  context.codeEl = {
    value:cycleProgram,
    selectionStart:0,
    selectionEnd:0,
    setSelectionRange(start, end){ this.selectionStart=start; this.selectionEnd=end; }
  };
  context.lastSel = {start:0,end:0};
  context._selectedLine = 0;
  context._undoPush = () => { undoCount += 1; };
  context.updateLineNums = () => {};
  context.runValidation = () => {};
  context.dirty = false;
  context.FM = {active:false};
  context.deleteLineN(2, true);
  assert.strictEqual(context.codeEl.value, 'BEGIN PGM TEST MM\nL X+0 Y+0\nEND PGM TEST MM',
    'deleting any cycle row deletes the entire logical cycle');
  assert.strictEqual(undoCount, 1);
}

assert.match(appSource, /_editorBeforeInput[\s\S]*actualInserted[\s\S]*editorInsertBlankAfterActiveBlock\(\)/,
  'Android has an input-event fallback for IMEs that report Enter as insertText');
for(const [name, source] of [
  ['field editing', fieldSource],
  ['cycle picker', cycleSource],
  ['BLK FORM', blockSource]
]){
  assert.match(source, /insertProgramBlock\(/, `${name} uses the shared logical insertion primitive`);
}
assert.match(panelsSource, /analyzeProgramRows\(lines\)/);
assert.match(panelsSource, /model\.blocks\.length \+ ' blocks'/);

console.log('editor-block-model.test.js: logical numbering, selection, Enter, delete and export verified');
