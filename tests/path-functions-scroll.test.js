const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'www','android','app.js'),'utf8');
const fields=fs.readFileSync(path.join(root,'www','core','field-editing.js'),'utf8');
const cycles=fs.readFileSync(path.join(root,'www','core','cycle-picker.js'),'utf8');
const keyboard=fs.readFileSync(path.join(root,'www','android','custom-keyboard.js'),'utf8');
const panels=fs.readFileSync(path.join(root,'www','android','panels.js'),'utf8');
const css=fs.readFileSync(path.join(root,'www','android','styles.css'),'utf8');

const expected=[
  'L','CHF','CC','C','CR','CT','RND','APPR/DEP'
];
const pathSection=(app.match(/var PATH_KEYS=\[([\s\S]*?)\n\];/)||[])[1]||'';
const labels=Array.from(pathSection.matchAll(/\{l:'([^']+)'/g), match => match[1]);
assert.deepStrictEqual(labels,expected,'path keys follow the HEIDENHAIN sequence');
assert.match(pathSection,/\{l:'APPR\/DEP',[^}]*apprDepPicker:true\}/,
  'APPR/DEP is represented by one family-picker key');
assert.match(panels,/function renderIdlePanel\(\)[\s\S]*setApprDepPickerExpanded\(false\)/,
  'Android idle-panel replacement always clears the APPR/DEP expanded state');

const pickerSection=(app.match(/var APPR_DEP_PICKER_GROUPS=\[([\s\S]*?)\n\];/)||[])[1]||'';
const pickerFunctions=Array.from(
  pickerSection.matchAll(/'((?:APPR|DEP) (?:LT|LN|CT|LCT))'/g),
  match => match[1]
);
const expectedPickerFunctions=[
  'APPR LT','APPR LN','APPR CT','APPR LCT',
  'DEP LT','DEP LN','DEP CT','DEP LCT'
];
assert.deepStrictEqual(pickerFunctions,expectedPickerFunctions,
  'family picker follows the documented APPR then DEP soft-key order');

[
  'APPR LT','APPR LN','APPR CT','APPR LCT',
  'APPR PLT','APPR PLN','APPR PCT','APPR PLCT',
  'DEP LT','DEP LN','DEP CT','DEP LCT','DEP PLCT'
].forEach(builder => assert.ok(app.includes(`'${builder}': {`),`${builder} builder exists`));

assert.match(css,/\.kp-row\{[^}]*flex-wrap:nowrap[^}]*overflow-x:auto[^}]*overflow-y:hidden/s,
  'path family stays on one horizontally scrollable row');
assert.match(css,/\.kp-row::\x2dwebkit-scrollbar\{display:none;\}/,
  'hidden scrollbar does not add panel height');
assert.match(css,/\.kp-row \.key\{[^}]*flex:0 0 46px;min-width:46px/s,
  'Android path keys use the standard 46px basis');
assert.match(css,/\.kp-row \.key\.appr-dep-key\{[^}]*flex-basis:46px;min-width:46px/s,
  'APPR/DEP keeps the same width as the other Android path keys');
assert.match(css,/\.appr-dep-picker\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/s,
  'APPR and DEP groups share one compact control-strip row');
assert.match(css,/\.appr-dep-picker-group\{[^}]*grid-template-columns:28px repeat\(4,minmax\(0,1fr\)\)/s,
  'each Android group fits four compact subfunction buttons');
assert.match(css,/\.appr-dep-picker-btn\{[^}]*min-height:26px[^}]*font-size:9px/s,
  'Android subfunction buttons are reduced to fit the existing strip');
assert.match(css,/\.appr-dep-picker-btn\{[^}]*background:var\(--key-pale\)[^}]*color:var\(--text2\)/s,
  'Android APPR/DEP subfunction buttons use the neutral grey key treatment');
assert.match(fields,/apprDepPicker:k\.apprDepPicker/,
  'family-picker action is retained when Android builds the keypad');
assert.match(fields,/id="apprDepKey"[^']*aria-controls="apprDepPicker"[^']*aria-expanded="false"/,
  'family key exposes its controlled panel and initial collapsed state');
assert.match(fields,/k\.apprDepPicker\?'<span class="kl"><span>APPR<\/span><span>DEP<\/span><\/span>'/,
  'family key stacks APPR above DEP like the HEIDENHAIN key');
assert.match(fields,/obj\.apprDepPicker[\s\S]*?toggleApprDepPicker\(\)/,
  'family key toggles the APPR/DEP panel');
assert.match(app,/function selectApprDepFunction\(builderKey\)\{[\s\S]*?closeApprDepPicker\(false\);[\s\S]*?enterFieldMode\(builderKey\);[\s\S]*?\}/,
  'selecting a subfunction closes the picker and opens guided parameter entry');
assert.doesNotMatch(app,/data-appr-dep-close/,
  'picker has no separate close button');
assert.match(cycles,/getElementById\('apprDepPicker'\)[\s\S]*?parentNode\.removeChild\(apprDepPicker\)/,
  'shared panel cleanup removes the contextual APPR/DEP picker');
assert.match(app,/function openApprDepPicker\(\)\{[\s\S]*?getElementById\('ctxPanel'\)[\s\S]*?panel\.appendChild\(picker\)/,
  'picker replaces the editor control strip');
assert.doesNotMatch(app,/querySelector\('\.editor-wrap'\)/,
  'picker never mounts over the program editor');
assert.match(css,/\.ctx-panel:has\(#apprDepPicker\)\{min-height:0;\}/,
  'picker may retain the existing compact control-strip height');
assert.match(css,/\.key\.appr-dep-key \.kl\{[^}]*flex-direction:column[^}]*font-size:9px/s,
  'the two-line key uses larger type without changing its dimensions');
assert.match(css,/\.key\.appr-dep-key \.kl span\+span\{[^}]*border-top:1px solid currentColor/s,
  'Android APPR and DEP labels are separated by the machine-style fraction rule');
assert.match(fields,/'APPR CT':'APPR PCT'/,'P maps APPR CT to PCT');
assert.match(fields,/'DEP LCT':'DEP PLCT'/,'P maps DEP LCT to PLCT');
assert.match(keyboard,/keyboardPolarTarget\(FM\.builderKey\)/,
  'Android P key uses the shared APPR/DEP polar mapping');
assert.match(keyboard,/wrapBefore\('openApprDepPicker', function\(\)\{ prepareOwner\('apprdep'\); \}\)/,
  'APPR/DEP picker claims the exclusive docked-panel owner');
assert.match(keyboard,/wrap\('closeCtxPanel', function\(\)\{[\s\S]*?setApprDepPickerExpanded\(false\)/,
  'generic panel cleanup also collapses the APPR/DEP trigger');
assert.match(keyboard,/pickerToggle=b\.id==='apprDepKey'&&panelOwner\(\)==='apprdep'&&!!el\('apprDepPicker'\)/,
  'the active APPR/DEP key remains available to close its own picker');
assert.match(css,/@media\(pointer:coarse\)\{[\s\S]*?\.appr-dep-picker-btn\{min-height:30px;\}/,
  'compact Android choices fit inside the existing control strip');

class PickerButton {
  constructor(attributes) {
    this.attributes=attributes;
    this.listeners={};
    this.focused=false;
  }
  addEventListener(type, listener) { this.listeners[type]=listener; }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, value) { this.attributes[name]=String(value); }
  focus() { this.focused=true; }
  click() {
    if(this.listeners.click) this.listeners.click.call(this);
  }
}

const runtimeActions=[];
const runtimeTrigger=new PickerButton({'aria-expanded':'false'});
runtimeTrigger.disabled=false;
function makeRuntimePicker() {
  return {
    id:'',
    className:'',
    attributes:{},
    html:'',
    functionButtons:[],
    parentNode:null,
    setAttribute(name,value) { this.attributes[name]=String(value); },
    set innerHTML(value) {
      this.html=value;
      this.functionButtons=Array.from(
        value.matchAll(/data-appr-dep-builder="([^"]+)"/g),
        match => new PickerButton({'data-appr-dep-builder':match[1]})
      );
    },
    get innerHTML() { return this.html; },
    querySelectorAll(selector) {
      return selector==='[data-appr-dep-builder]' ? this.functionButtons : [];
    }
  };
}
const runtimePanel={
  style:{height:''},
  innerHTML:'idle controls',
  picker:null,
  getBoundingClientRect() { return {height:68}; },
  appendChild(picker) { this.picker=picker; picker.parentNode=this; },
  removeChild(picker) {
    if(this.picker===picker) this.picker=null;
    picker.parentNode=null;
  }
};
const pickerImplementation=(app.match(
  /var APPR_DEP_PICKER_GROUPS=\[[\s\S]*?function selectApprDepFunction\(builderKey\)\{[\s\S]*?\n\}/
)||[])[0]||'';
const runtimeContext={
  document:{
    createElement:() => makeRuntimePicker(),
    getElementById:id => id==='ctxPanel'
      ? runtimePanel
      : (id==='apprDepKey'
        ? runtimeTrigger
        : (id==='apprDepPicker' ? runtimePanel.picker : null))
  },
  BUILDERS:Object.fromEntries(expectedPickerFunctions.map(name => [name,{}])),
  closeCtxPanel:() => {
    runtimeActions.push('close');
    if(runtimePanel.picker) runtimePanel.removeChild(runtimePanel.picker);
    runtimePanel.style.height='';
    runtimePanel.innerHTML='idle controls';
    runtimeTrigger.setAttribute('aria-expanded','false');
  },
  enterFieldMode:builderKey => runtimeActions.push('enter:'+builderKey),
  setTimeout:callback => callback()
};
vm.runInNewContext(pickerImplementation,runtimeContext);
runtimeContext.toggleApprDepPicker();
let runtimePicker=runtimePanel.picker;
assert.ok(runtimePicker,'first APPR/DEP press replaces the editor controls');
assert.strictEqual(runtimePanel.style.height,'68px',
  'opening preserves the existing Android control-strip height');
assert.deepStrictEqual(
  runtimePicker.functionButtons.map(button => button.getAttribute('data-appr-dep-builder')),
  expectedPickerFunctions,
  'rendered picker exposes every function in documented order'
);
assert.strictEqual(runtimePicker.html.includes('data-appr-dep-close'),false,
  'rendered picker has no dedicated close button');
assert.strictEqual(runtimeTrigger.getAttribute('aria-expanded'),'true',
  'opening the picker expands the family key');
assert.strictEqual(runtimePicker.functionButtons[0].focused,true,
  'opening the picker moves focus to its first function');
runtimeContext.toggleApprDepPicker();
assert.strictEqual(runtimePanel.picker,null,
  'second APPR/DEP press removes the picker');
assert.strictEqual(runtimePanel.style.height,'',
  'closing releases the preserved height for normal controls');
assert.strictEqual(runtimeTrigger.getAttribute('aria-expanded'),'false',
  'second APPR/DEP press collapses the family key');

runtimeContext.toggleApprDepPicker();
runtimePicker=runtimePanel.picker;
runtimeActions.length=0;
runtimePicker.functionButtons[2].click();
assert.deepStrictEqual(runtimeActions,['close','enter:APPR CT'],
  'a picker click closes selection and starts the chosen guided builder');
assert.strictEqual(runtimeTrigger.getAttribute('aria-expanded'),'false',
  'choosing an APPR function collapses the family key');

runtimeContext.toggleApprDepPicker();
runtimePicker=runtimePanel.picker;
runtimeActions.length=0;
runtimePicker.functionButtons[7].click();
assert.deepStrictEqual(runtimeActions,['close','enter:DEP LCT'],
  'departure choices route to their matching guided builder');

console.log('path-functions-scroll.test.js: APPR/DEP family picker, builders and one-row Android scrolling verified');
