const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const editorSource = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
const fieldSource = fs.readFileSync(path.join(root, 'www', 'core', 'field-editing.js'), 'utf8');

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

// TOOL CALL inserts documented M comments and finishing the guided edit leaves
// the logical insertion anchor at the end of M8.
context.lastSel={start:lineOffset(codeEl.value,1),end:lineOffset(codeEl.value,1)};
context.enterFieldMode('TOOL CALL');
assert.match(codeEl.value, /TOOL CALL 1 S0\nM3 ; Spindle ON — clockwise\nM8 ; Coolant ON — flood/);
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

console.log('field-editing-workflow.test.js: TOOL CALL anchoring and Edit L incremental verified');
