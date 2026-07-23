const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'core', 'editor-core.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'www', 'android', 'styles.css'), 'utf8');

const classes = new Set();
const head = {
  attrs:{},
  setAttribute(name,value){ this.attrs[name]=value; }
};
const panel = {
  classList:{
    toggle(name,force){ if(force) classes.add(name); else classes.delete(name); },
    remove(name){ classes.delete(name); }
  },
  querySelector(selector){ return selector==='.problems-head'?head:null; }
};
const list = {style:{}};
const context = {
  console,
  problemsOpen:false,
  document:{
    getElementById(id){
      if(id==='problems') return panel;
      if(id==='problemsList') return list;
      return null;
    }
  }
};
vm.createContext(context);
vm.runInContext(source,context,{filename:'editor-core.js'});

context.toggleProblems();
assert.strictEqual(context.problemsOpen,true);
assert.strictEqual(list.style.display,'block');
assert.ok(classes.has('expanded'),'opening Problems adds the expanded layout');
assert.strictEqual(head.attrs['aria-expanded'],'true');

context.toggleProblems();
assert.strictEqual(context.problemsOpen,false);
assert.strictEqual(list.style.display,'none');
assert.ok(!classes.has('expanded'),'closing Problems removes the expanded layout');
assert.strictEqual(head.attrs['aria-expanded'],'false');

assert.match(css,/\.problems\.expanded\{max-height:min\(50vh,420px\);\}/,
  'expanded Problems can use half of the phone viewport');
assert.match(css,/\.problems\.expanded \.problems-list\{flex:1;\}/,
  'the expanded diagnostic list owns the remaining height and scrolls');

console.log('problems-panel.test.js: expanded mobile diagnostics verified');
