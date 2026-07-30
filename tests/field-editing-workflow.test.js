const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const editorSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
const fieldSource = fs.readFileSync(path.join(root, 'www', 'core', 'field-editing.js'), 'utf8');
const keyboardSource = fs.readFileSync(path.join(root, 'www', 'android', 'custom-keyboard.js'), 'utf8');

const ctxPanel = {innerHTML:'', style:{}};
const mobileInput = {
  value:'',
  setAttribute(){},
  focus(){},
  blur(){}
};
const document = {
  activeElement:null,
  getElementById(id){
    if(id==='ctxPanel') return ctxPanel;
    if(id==='mobileInput') return mobileInput;
    return null;
  },
  querySelector(){ return null; }
};
const codeEl = {
  value:'BEGIN PGM TEST MM\nL X+0 Y+0 R0\nEND PGM TEST MM',
  selectionStart:0,
  selectionEnd:0,
  scrollTop:0,
  focus(){ document.activeElement=this; },
  setSelectionRange(start,end){ this.selectionStart=start; this.selectionEnd=end; }
};

const context = {
  console,
  window:{},
  document,
  navigator:{userAgent:'Android workflow test'},
  requestAnimationFrame(fn){ fn(); },
  codeEl,
  lineNums:{scrollTop:0},
  lastSel:{start:0,end:0},
  FM:{active:false},
  BLK:{active:false},
  BUILDERS:{
    'L':{cmd:'L',fields:[
      {p:'X',type:'coord',prompt:'X',opt:true},
      {p:'Y',type:'coord',prompt:'Y',opt:true},
      {p:'Z',type:'coord',prompt:'Z',opt:true},
      {p:'',type:'rc',prompt:'R',opt:true},
      {p:'F',type:'feed',prompt:'F',opt:true},
      {p:'M',type:'mval',prompt:'M',opt:true}
    ]},
    'TOOL CALL':{cmd:'TOOL CALL',fields:[
      {p:'',type:'tool',prompt:'T',opt:false},
      {p:'S',type:'num',prompt:'S',opt:false},
      {p:'F',type:'num',prompt:'F',opt:true}
    ]},
    'APPR CT':{cmd:'APPR CT',fields:[
      {p:'R',type:'num',prompt:'R',opt:false}
    ]},
    'APPR PCT':{cmd:'APPR PCT',fields:[
      {p:'R',type:'num',prompt:'R',opt:false}
    ]},
    'DEP CT':{cmd:'DEP CT',fields:[
      {p:'R',type:'num',prompt:'R',opt:false}
    ]}
  },
  _undoStack:[],
  _undoMax:50,
  _selectedLine:0,
  dirty:false,
  _undoPush(){},
  updateLineNums(){},
  runValidation(){},
  renderIdlePanel(){},
  closeQPopup(){},
  getToolByNum(){ return null; },
  _cancelMobileFocus(){},
  _liveEditClear(){}
};
context.window=context;
vm.createContext(context);
vm.runInContext(editorSource, context, {filename:'editor-core.js'});
vm.runInContext(fieldSource, context, {filename:'field-editing.js'});
context.runValidation=()=>{};
context._liveEditLine=-1;
context._liveEditClear=()=>{ context._liveEditLine=-1; };

function lineOffset(value,index){
  return value.split('\n').slice(0,index).join('\n').length+(index?1:0);
}

// Merely opening a legacy/imported decimal TOOL CALL feed must round-trip it
// exactly even though new guided F input is intentionally whole-number-only.
const parsedToolCall=context.parseExistingLine(
  'TOOL CALL 1 Z S3000 F420.500 DL-1.25 DR+0.50',
  'TOOL CALL'
);
assert.strictEqual(parsedToolCall[2].val,'420.500',
  'TOOL CALL parser preserves all decimal feed digits on editor open');

const parsedCompactRepeat=context.parseExistingLine('CALL LBL 2 REP6','LBL CALL');
assert.strictEqual(parsedCompactRepeat[0].val,'2',
  'CALL LBL editor preserves the label number from compact REP syntax');
assert.strictEqual(parsedCompactRepeat[1].val,'6',
  'CALL LBL editor recognizes the documented compact REP6 count');

assert.strictEqual(context.tokenFor({p:'',type:'rc',opt:true,val:null}),'',
  'NO ENT on optional radius compensation serializes as omission, never literal null');

context.FM={active:true,builderKey:'APPR CT'};
assert.strictEqual(context.tokenFor({p:'R',type:'num',opt:false,val:'10'}),'R+10',
  'Android APPR CT emits the required positive radius sign automatically');
context.FM={active:true,builderKey:'APPR PCT'};
assert.strictEqual(context.tokenFor({p:'R',type:'num',opt:false,val:'8.5'}),'R+8.5',
  'Android APPR PCT emits the required positive radius sign automatically');
context.FM={active:true,builderKey:'DEP CT'};
assert.strictEqual(context.tokenFor({p:'R',type:'num',opt:false,val:'-8'}),'R-8',
  'Android DEP CT preserves the selected negative radius');
context.FM={active:false};

// TOOL CALL inserts documented M comments and finishing the guided edit leaves
// the logical insertion anchor at the end of M8.
context.lastSel={start:lineOffset(codeEl.value,1),end:lineOffset(codeEl.value,1)};
context.enterFieldMode('TOOL CALL');
assert.match(codeEl.value, /TOOL CALL 1 S10000 F2000\nM3 ; Spindle ON — clockwise\nM8 ; Coolant ON — flood/);
context.exitFieldMode();
assert.strictEqual(context.lastSel.start, codeEl.value.indexOf('M8 ;')+'M8 ; Coolant ON — flood'.length,
  'TOOL CALL completion anchors the next command at the end of M8');
context.insertProgramBlock('L X+20',context.lastSel.start,context.lastSel.end,{mode:'command'});
assert.match(codeEl.value, /M8 ; Coolant ON — flood\nL X\+20\nEND PGM/,
  'the next programmed block is inserted after the automatic M8 block');

// Editing an existing L uses the current guided coordinate field, independent
// of the stale textarea/lastSel position left behind after Android blur.
const lLine=codeEl.value.split('\n').findIndex(line => line==='L X+20');
const lStart=lineOffset(codeEl.value,lLine);
codeEl.setSelectionRange(lStart+2,lStart+2);
context.lastSel={start:0,end:0};
const info=context.getCaretLine();
context.enterFieldModeOnLine(info);
assert.strictEqual(context.FM.idx,0);
context.toggleIncrementalToken();
assert.strictEqual(context.FM.fields[0].incr,true);
assert.ok(codeEl.value.split('\n')[lLine].startsWith('L IX+20'),
  'I toggles the active X field during Edit L even when lastSel is stale');

assert.match(fieldSource, /onclick="cancelFieldMode\(\)"[^>]*aria-label="Cancel input"/,
  'the guided-panel X is wired to transaction cancel, not Done');
assert.match(keyboardSource, /wrap\('cancelFieldMode'[^]*?hide\(false\)/,
  'cancelling a guided panel also closes the Android custom keyboard');

const pathBuilders=[
  'L','P','CHF','CC','C','CR','CT','CP','RND',
  'APPR LT','APPR LN','APPR CT','APPR LCT',
  'APPR PLT','APPR PLN','APPR PCT','APPR PLCT',
  'DEP LT','DEP LN','DEP CT','DEP LCT','DEP PLCT'
];
pathBuilders.forEach(label => {
  if(!context.BUILDERS[label]){
    context.BUILDERS[label]={
      cmd:label==='P'?'LP':label,
      fields:[{p:'X',type:'coord',prompt:'X',opt:true}]
    };
  }
});

const cancelProgram='BEGIN PGM CANCEL MM\nL X+0 Y+0 R0\nEND PGM CANCEL MM';
for(const label of pathBuilders){
  codeEl.value=cancelProgram;
  const anchor=lineOffset(codeEl.value,1)+'L X+0 Y+0 R0'.length;
  codeEl.setSelectionRange(anchor,anchor);
  context.lastSel={start:anchor,end:anchor};
  context.dirty=false;
  context._undoStack.length=0;
  context._redoStack=['redo-before-'+label];
  context.enterFieldMode(label);
  assert.notStrictEqual(codeEl.value,cancelProgram,`${label} inserts a provisional block`);
  context.cancelFieldMode();
  assert.strictEqual(codeEl.value,cancelProgram,`${label} X removes the complete provisional block`);
  assert.strictEqual(context.FM.active,false,`${label} X closes field mode`);
  assert.strictEqual(context.dirty,false,`${label} X restores the prior dirty state`);
  assert.deepStrictEqual(Array.from(context._undoStack),[],`${label} X removes its no-op undo entry`);
  assert.deepStrictEqual(Array.from(context._redoStack),['redo-before-'+label],
    `${label} X preserves pre-existing redo history`);
  assert.strictEqual(codeEl.selectionStart,anchor,`${label} X restores the original caret`);
}

// X on an existing path block is also a cancellation, but it restores the
// original block instead of deleting it.
codeEl.value='BEGIN PGM CANCEL MM\nC X+10 Y+20 DR+\nEND PGM CANCEL MM';
context.BUILDERS.C={cmd:'C',fields:[
  {p:'X',type:'coord',prompt:'X',opt:true},
  {p:'Y',type:'coord',prompt:'Y',opt:true},
  {p:'DR',type:'dr',prompt:'DR',opt:false}
]};
const existingCStart=lineOffset(codeEl.value,1);
codeEl.setSelectionRange(existingCStart+2,existingCStart+2);
context.lastSel={start:existingCStart+2,end:existingCStart+2};
const existingCProgram=codeEl.value;
context.enterFieldModeOnLine(context.getCaretLine());
context.FM.fields[0].val='+99';
context.refreshSelection();
assert.match(codeEl.value,/C X\+99 Y\+20 DR\+/,'existing C changes while its panel is open');
context.cancelFieldMode();
assert.strictEqual(codeEl.value,existingCProgram,
  'X restores an existing path block instead of keeping partial edits or deleting it');

// The same transaction also covers guided builders with automatic companion
// lines, so cancellation cannot leave TOOL CALL's M3/M8 suffix behind.
codeEl.value=cancelProgram;
const toolAnchor=lineOffset(codeEl.value,1)+'L X+0 Y+0 R0'.length;
codeEl.setSelectionRange(toolAnchor,toolAnchor);
context.lastSel={start:toolAnchor,end:toolAnchor};
context.enterFieldMode('TOOL CALL');
assert.match(codeEl.value,/TOOL CALL[\s\S]*M3[\s\S]*M8/);
context.cancelFieldMode();
assert.strictEqual(codeEl.value,cancelProgram,
  'X removes a complete multi-line guided insertion transaction');

console.log('field-editing-workflow.test.js: guided insertion, existing edit and transactional X cancel verified');
