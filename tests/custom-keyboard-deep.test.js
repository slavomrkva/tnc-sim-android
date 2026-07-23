const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const keyboardSource = fs.readFileSync(
  path.join(root, 'www', 'android', 'custom-keyboard.js'),
  'utf8'
);

class FakeClassList {
  constructor() {
    this.values = new Set();
  }
  add(...names) {
    names.forEach(name => this.values.add(name));
  }
  remove(...names) {
    names.forEach(name => this.values.delete(name));
  }
  contains(name) {
    return this.values.has(name);
  }
  toggle(name, force) {
    if (force === true) {
      this.values.add(name);
      return true;
    }
    if (force === false) {
      this.values.delete(name);
      return false;
    }
    if (this.values.has(name)) {
      this.values.delete(name);
      return false;
    }
    this.values.add(name);
    return true;
  }
}

class FakeEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.bubbles = !!init.bubbles;
    this.defaultPrevented = false;
    this.target = init.target || null;
    this.currentTarget = null;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}

function matchesSelector(el, selector) {
  if (!el) return false;
  if (selector.charAt(0) === '#') return el.id === selector.slice(1);
  if (selector.charAt(0) === '.') return el.classList.contains(selector.slice(1));

  const attr = selector.match(/\[data-([a-z-]+)(?:="([^"]*)")?\]/);
  const withoutAttr = attr ? selector.replace(attr[0], '') : selector;
  const parts = withoutAttr.split('.');
  const tag = parts[0];
  const cls = parts[1];
  if (tag && el.tagName.toLowerCase() !== tag.toLowerCase()) return false;
  if (cls && !el.classList.contains(cls)) return false;
  if (attr) {
    const key = attr[1].replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    if (!(key in el.dataset)) return false;
    if (attr[2] !== undefined && el.dataset[key] !== attr[2]) return false;
  }
  return true;
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = String(tagName || 'div').toUpperCase();
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.children = [];
    this.classList = new FakeClassList();
    this.dataset = {};
    this.style = {};
    this.attributes = {};
    this.listeners = {};
    this.value = '';
    this.textContent = '';
    this.scrollTop = 0;
    this.clientHeight = 200;
    this._id = '';
    this._innerHTML = '';
    this._inputMode = '';
  }

  get id() {
    return this._id;
  }
  set id(value) {
    if (this._id) this.ownerDocument.unregisterId(this._id, this);
    this._id = String(value || '');
    if (this._id) this.ownerDocument.registerId(this);
  }

  get inputMode() {
    return this._inputMode;
  }
  set inputMode(value) {
    this._inputMode = String(value);
    if (this.id) this.ownerDocument.log.push(this.id + ':inputmode=' + this._inputMode);
  }

  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(value) {
    this.children.slice().forEach(child => child.remove());
    this._innerHTML = String(value || '');

    const buttonRe = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
    let match;
    while ((match = buttonRe.exec(this._innerHTML)) !== null) {
      const button = this.ownerDocument.createElement('button');
      const attrs = match[1];
      const classMatch = attrs.match(/\bclass="([^"]*)"/i);
      if (classMatch) {
        classMatch[1].split(/\s+/).filter(Boolean).forEach(name => button.classList.add(name));
      }
      const idMatch = attrs.match(/\bid="([^"]*)"/i);
      if (idMatch) button.id = idMatch[1];
      const keyMatch = attrs.match(/\bdata-key="([^"]*)"/i);
      if (keyMatch) button.dataset.key = keyMatch[1];
      const actionMatch = attrs.match(/\bdata-action="([^"]*)"/i);
      if (actionMatch) button.dataset.action = actionMatch[1];
      button.textContent = match[2].replace(/<[^>]+>/g, '');
      this.appendChild(button);
    }
  }

  setAttribute(name, value) {
    const normalized = String(name).toLowerCase();
    this.attributes[normalized] = String(value);
    if (normalized === 'id') this.id = value;
    if (normalized === 'inputmode') this.inputMode = value;
    if (normalized.startsWith('data-')) {
      const key = normalized.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) {
    const normalized = String(name).toLowerCase();
    if (normalized === 'id') return this.id;
    if (normalized === 'inputmode') return this.inputMode;
    return this.attributes[normalized] || null;
  }

  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    this.ownerDocument.registerTree(child);
    return child;
  }

  insertBefore(child, reference) {
    if (!reference || !this.children.includes(reference)) return this.appendChild(child);
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.splice(this.children.indexOf(reference), 0, child);
    this.ownerDocument.registerTree(child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      this.ownerDocument.unregisterTree(child);
      child.parentNode = null;
    }
    return child;
  }

  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }

  addEventListener(type, listener) {
    (this.listeners[type] || (this.listeners[type] = [])).push(listener);
  }

  dispatchEvent(event) {
    if (!event.target) event.target = this;
    event.currentTarget = this;
    (this.listeners[event.type] || []).slice().forEach(listener => listener.call(this, event));
    if (event.bubbles && this.parentNode) this.parentNode.dispatchEvent(event);
    return !event.defaultPrevented;
  }

  focus() {
    this.ownerDocument.activeElement = this;
    this.ownerDocument.log.push((this.id || this.tagName.toLowerCase()) + ':focus');
  }

  blur() {
    if (this.ownerDocument.activeElement === this) this.ownerDocument.activeElement = this.ownerDocument.body;
    this.ownerDocument.log.push((this.id || this.tagName.toLowerCase()) + ':blur');
  }

  select() {
    this.ownerDocument.log.push((this.id || this.tagName.toLowerCase()) + ':select');
  }

  closest(selector) {
    let node = this;
    while (node) {
      if (matchesSelector(node, selector)) return node;
      node = node.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const found = [];
    const visit = node => {
      node.children.forEach(child => {
        if (matchesSelector(child, selector)) found.push(child);
        visit(child);
      });
    };
    visit(this);
    return found;
  }
}

class FakeDocument {
  constructor(log) {
    this.log = log;
    this.ids = {};
    this.documentElement = new FakeElement('html', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.body);
    this.activeElement = this.body;
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  getElementById(id) {
    return this.ids[id] || null;
  }

  querySelector(selector) {
    if (matchesSelector(this.documentElement, selector)) return this.documentElement;
    if (matchesSelector(this.body, selector)) return this.body;
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector) {
    const found = [];
    if (matchesSelector(this.documentElement, selector)) found.push(this.documentElement);
    if (matchesSelector(this.body, selector)) found.push(this.body);
    return found.concat(this.documentElement.querySelectorAll(selector));
  }

  registerId(el) {
    this.ids[el.id] = el;
  }

  unregisterId(id, el) {
    if (this.ids[id] === el) delete this.ids[id];
  }

  registerTree(el) {
    if (el.id) this.registerId(el);
    el.children.forEach(child => this.registerTree(child));
  }

  unregisterTree(el) {
    if (el.id) this.unregisterId(el.id, el);
    el.children.forEach(child => this.unregisterTree(child));
  }
}

function applyNumericSign(value, sign) {
  const text = String(value == null ? '' : value).replace(/^[+-]/, '').replace(/[+-]$/, '');
  return sign + text;
}

function createHarness() {
  const log = [];
  const timers = [];
  const cancelledTimers = new Set();
  let nextTimerId = 1;
  const document = new FakeDocument(log);
  const editorPanel = document.createElement('div');
  editorPanel.classList.add('editor-panel');
  document.body.appendChild(editorPanel);
  const ctxPanel = document.createElement('div');
  ctxPanel.id = 'ctxPanel';
  editorPanel.appendChild(ctxPanel);
  const codeEl = document.createElement('textarea');
  codeEl.id = 'code';
  codeEl.value = 'Q200=1\nQ201=2\nL X+0';
  editorPanel.appendChild(codeEl);
  const mobileInput = document.createElement('input');
  mobileInput.id = 'mobileInput';
  editorPanel.appendChild(mobileInput);
  const keypad = document.createElement('div');
  keypad.id = 'keypad';
  const programKey = document.createElement('button');
  programKey.classList.add('key');
  keypad.appendChild(programKey);
  document.body.appendChild(keypad);

  const context = {
    console,
    document,
    navigator: { userAgent: 'Android deep-test' },
    Event: FakeEvent,
    setTimeout(fn) {
      const id = nextTimerId++;
      timers.push({ id, fn });
      return id;
    },
    clearTimeout(id) {
      cancelledTimers.add(id);
    },
    isMobile() { return true; },
    applyNumericSign,
    sanitizeVal(value) { return String(value).replace(',', '.'); },
    codeEl,
    lastSel: { start: 0, end: 0 },
    FM: {
      active: false,
      builderKey: 'L',
      idx: 0,
      typing: false,
      fields: [{ p: 'X', type: 'coord', opt: true, val: '0' }]
    },
    BLK: { active: false, step: 0, editLine: null },
    QP: { num: '1', op: '=', val: '', fn: '', step: 0, _typing: false },
    _qPopupLine: -1,
    refreshSelection() { log.push('refreshSelection'); },
    _fieldAcceptsSign(field) { return !!field && field.type === 'coord'; },
    fieldAllowsIncremental(builderKey, field) {
      const p = String(field && field.p || '').toUpperCase();
      if (builderKey === 'L') return /^[XYZABC]$/.test(p);
      if (builderKey === 'CC') return /^[XY]$/.test(p);
      if (builderKey === 'P') return p === 'PA';
      if (builderKey === 'CP') return p === 'PA' || p === 'Z';
      return false;
    },
    _setFieldSign(field, sign) {
      field.val = applyNumericSign(field.val, sign);
      context.FM.typing = true;
    },
    setFieldVal(value) {
      context.FM.fields[context.FM.idx].val = value;
      context.FM.typing = true;
    },
    fieldNext() { log.push('fieldNext'); },
    fieldPrev() { log.push('fieldPrev'); },
    switchFieldMode() { log.push('switchFieldMode'); },
    toggleIncrementalToken() { log.push('toggleIncrementalToken'); },
    toggleQField() {
      context.FM.fields[context.FM.idx].val = '+Q';
      context.FM.typing = true;
    },
    blkStepRel(direction) { log.push('blkStepRel:' + direction); },
    blkNextStep() { log.push('blkNextStep'); },
    insertBlkForm() {
      log.push('insertBlkForm');
      context.closeCtxPanel();
    },
    qPanelInsertQ() {
      const input = document.getElementById('qPanelInput');
      if (!input) return;
      const sign = /^[+-]/.test(input.value) ? input.value.charAt(0) : '';
      input.value = sign + 'Q';
      input.focus();
    },
    qPanelConfirm() {
      log.push('qPanelConfirm:' + context._qPopupLine);
      context.closeQPopup();
    },
    _mPanelConfirm() {
      log.push('mPanelConfirm');
      context.closeCtxPanel();
    },
    qpInsert() {
      log.push('qpInsert');
      context.closeCtxPanel();
    },
    renderIdlePanel() { log.push('renderIdlePanel'); },
    requestAnimationFrame(fn) {
      fn();
      return 1;
    }
  };
  context.window = context;

  function clearPanel() {
    ctxPanel.innerHTML = '';
  }

  function makeInput(id, value, inputMode) {
    const input = document.createElement('input');
    input.id = id;
    input.value = value;
    input.inputMode = inputMode;
    ctxPanel.appendChild(input);
    return input;
  }

  context._focusEditorControl = function(input) {
    log.push('_focusEditorControl:' + input.id);
    input.focus();
  };
  context._qpFocusMobile = function() {
    log.push('_qpFocusMobile');
    context._focusEditorControl(mobileInput);
  };
  context.selectField = function(index) {
    context.FM.idx = index;
    context.FM.typing = false;
    log.push('selectField:' + index);
  };
  context.exitFieldMode = function() {
    log.push('exitFieldMode');
    context.FM.active = false;
  };
  context.focusMobileInput = function() {
    log.push('focusMobileInput');
    context._focusEditorControl(mobileInput);
  };
  context.renderBlkPanel = function() {
    log.push('renderBlkPanel');
    clearPanel();
    if (context.BLK.active && context.BLK.step > 0) {
      const input = makeInput('blkFbarVal', '-50', 'decimal');
      context._focusEditorControl(input);
    }
  };
  context.openBlkFormPanel = function() {
    log.push('openBlkFormPanel');
    context.BLK.active = true;
    context.BLK.step = 1;
    context.renderBlkPanel();
  };
  context.openMPanel = function() {
    log.push('openMPanel');
    clearPanel();
    const input = makeInput('mCustomInput', '', 'numeric');
    context.setTimeout(() => context._focusEditorControl(input), 30);
  };
  context.openQPopup = function(lineIndex) {
    log.push('openQPopup:' + lineIndex);
    if (context.FM.active) context.exitFieldMode(true);
    clearPanel();
    context._qPopupLine = lineIndex;
    const input = makeInput('qPanelInput', lineIndex === 0 ? '1' : '2', 'decimal');
    context._focusEditorControl(input);
  };
  context.closeQPopup = function() {
    log.push('closeQPopup');
    clearPanel();
    context._qPopupLine = -1;
  };
  context.renderQParamPanel = function() {
    log.push('renderQParamPanel:' + context.QP.step);
    clearPanel();
    context.QP._typing = false;
    ctxPanel._innerHTML = '<button onclick="QP.step=' + context.QP.step
      + ';QP.op=QP.op;QP.fn=QP.fn;renderQParamPanel()">step</button>';
    if (context.QP.step === 0 || context.QP.step === 2) {
      const value = document.createElement('span');
      value.id = 'qpFbarVal';
      value.textContent = context.QP.step === 0 ? context.QP.num : (context.QP.val || '0');
      ctxPanel.appendChild(value);
    }
    context._qpFocusMobile();
  };
  context.openQParamPanel = function() {
    context.QP.num = '1';
    context.QP.op = '=';
    context.QP.val = '';
    context.QP.fn = '';
    context.QP.step = 0;
    context.QP._typing = false;
    context.renderQParamPanel();
  };
  context.openToolDefEdit = function() {
    log.push('openToolDefEdit');
    clearPanel();
    makeInput('toolDefPicker', '1', 'none');
  };
  context.insertToolDef = function() {
    log.push('insertToolDef');
    clearPanel(); // empty Tool Table: panel exists but no #toolDefPicker
  };
  context.openCyclePicker = function() {
    log.push('openCyclePicker');
    clearPanel();
    makeInput('cyclePicker', '200', 'none');
  };
  context.closeCtxPanel = function() {
    log.push('closeCtxPanel');
    clearPanel();
    context.BLK.active = false;
    context.BLK.step = 0;
  };

  vm.createContext(context);
  vm.runInContext(keyboardSource, context);

  return {
    context,
    document,
    log,
    editorPanel,
    ctxPanel,
    codeEl,
    mobileInput,
    keypad,
    programKey,
    flushTimers() {
      while (timers.length) {
        const timer = timers.shift();
        if (!cancelledTimers.has(timer.id)) timer.fn();
      }
    },
    clearLog() {
      log.length = 0;
    },
    makeInput
  };
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function keyboardKey(h, kind, value) {
  const keyboard = h.document.getElementById('ckKeyboard');
  assert.ok(keyboard, 'the custom keyboard must be mounted');
  const button = keyboard.children.find(child => child.dataset[kind] === value);
  assert.ok(button, 'missing keyboard key data-' + kind + '="' + value + '"');
  return button;
}

test('opening BLK while FM is active transfers ownership before routing input', () => {
  const h = createHarness();
  const c = h.context;
  c.FM.active = true;
  c.FM.fields[0].val = '0';

  c.openBlkFormPanel();
  const input = h.document.getElementById('blkFbarVal');
  let inputEvents = 0;
  input.addEventListener('input', () => inputEvents++);
  c._ckHandleKey('7');

  assert.strictEqual(c.FM.active, false, 'opening BLK must close the previous FM session');
  assert.strictEqual(c.BLK.active, true, 'BLK must be the sole active editor');
  assert.strictEqual(c.FM.fields[0].val, '0', 'the old FM value must not receive BLK keys');
  assert.strictEqual(input.value, '-7', 'the first BLK key replaces the magnitude and preserves its sign');
  assert.strictEqual(inputEvents, 1, 'BLK mutation dispatches exactly one input event');
  assert.ok(h.log.indexOf('exitFieldMode') < h.log.indexOf('openBlkFormPanel'),
    'FM exits before BLK opens');
});

test('opening M while FM is active transfers ownership and enforces digit-only routing', () => {
  const h = createHarness();
  const c = h.context;
  c.FM.active = true;
  c.FM.fields[0].val = '12';

  c.openMPanel();
  h.flushTimers();
  const input = h.document.getElementById('mCustomInput');
  let inputEvents = 0;
  input.addEventListener('input', () => inputEvents++);
  c._ckHandleKey(',');
  c._ckHandleKey(undefined, 'sign');
  c._ckHandleKey('8');

  assert.strictEqual(c.FM.active, false, 'opening M must close the previous FM session');
  assert.strictEqual(c.FM.fields[0].val, '12', 'the old FM value must not receive M keys');
  assert.strictEqual(input.value, '8', 'M accepts the digit but rejects comma and sign');
  assert.strictEqual(inputEvents, 1, 'only the accepted M digit emits input');
  c._ckHandleKey(undefined, 'ent');
  assert.ok(h.log.includes('mPanelConfirm'), 'M ENT uses the panel commit handler');
});

test('peer panel transitions keep exactly one real or virtual owner', () => {
  const h = createHarness();
  const c = h.context;

  c.openBlkFormPanel();
  assert.ok(h.document.getElementById('blkFbarVal'), 'BLK starts as the real-input owner');

  c.openMPanel();
  assert.strictEqual(c.BLK.active, false, 'opening M clears BLK state');
  assert.strictEqual(h.document.getElementById('blkFbarVal'), null, 'opening M removes the BLK input');
  assert.ok(h.document.getElementById('mCustomInput'), 'M becomes the real-input owner');

  c.openQParamPanel();
  assert.strictEqual(h.document.getElementById('mCustomInput'), null, 'opening QP removes the M input');
  c._ckHandleKey('6');
  assert.strictEqual(c.QP.num, '6', 'keys route to the QP virtual owner after the transition');

  c.openQPopup(1);
  assert.strictEqual(h.document.getElementById('qpFbarVal'), null, 'opening Q popup removes QP controls');
  const qInput = h.document.getElementById('qPanelInput');
  c._ckHandleKey('3');
  assert.strictEqual(qInput.value, '3', 'keys route to the Q-popup real input');

  c.openBlkFormPanel();
  assert.strictEqual(h.document.getElementById('qPanelInput'), null, 'opening BLK closes the Q popup');
  assert.strictEqual(c._qPopupLine, -1, 'Q popup state is cleared before BLK takes ownership');
  assert.ok(h.document.getElementById('blkFbarVal'), 'BLK becomes the final owner');
});

test('BLK and Q disable the native input mode before synchronous focus', () => {
  const h = createHarness();
  const c = h.context;

  c.openBlkFormPanel();
  const blkNone = h.log.indexOf('blkFbarVal:inputmode=none');
  const blkFocus = h.log.indexOf('blkFbarVal:focus');
  assert.ok(blkNone >= 0 && blkNone < blkFocus,
    'BLK inputmode=none must be applied before focus requests the IME');

  h.clearLog();
  c.closeCtxPanel();
  h.clearLog();
  c.openQPopup(0);
  const qNone = h.log.indexOf('qPanelInput:inputmode=none');
  const qFocus = h.log.indexOf('qPanelInput:focus');
  assert.ok(qNone >= 0 && qNone < qFocus,
    'Q inputmode=none must be applied before focus requests the IME');
});

test('Q real input supports Q references and dispatches input for typed digits', () => {
  const h = createHarness();
  const c = h.context;
  c.openQPopup(0);
  const input = h.document.getElementById('qPanelInput');
  let inputEvents = 0;
  input.addEventListener('input', () => inputEvents++);

  c._ckHandleKey(undefined, 'q');
  c._ckHandleKey('2');
  c._ckHandleKey('5');

  assert.strictEqual(input.value, 'Q25', 'digits append after keyboard-driven Q insertion');
  assert.strictEqual(inputEvents, 2, 'each typed Q-reference digit emits input');
});

test('Q ENT and previous navigate adjacent parameter lines after successful commit', () => {
  const h = createHarness();
  const c = h.context;
  c.openQPopup(0);
  c._ckHandleKey(undefined, 'ent');
  assert.strictEqual(c._qPopupLine, 1, 'ENT moves from Q200 to the next Q parameter');

  c._ckHandleKey(undefined, 'prev');
  assert.strictEqual(c._qPopupLine, 0, 'previous moves back to the prior Q parameter');
  assert.ok(h.log.includes('qPanelConfirm:0'), 'the current Q line is committed before moving');
  assert.ok(h.log.includes('qPanelConfirm:1'), 'the reverse move also commits first');
});

test('Q navigation stops at an empty logical block boundary', () => {
  const h = createHarness();
  const c = h.context;
  h.codeEl.value = 'Q200=1\nQ201=2\n\nQ41=0\nL X+0';
  c.openQPopup(1);
  const openCallsBefore = h.log.filter(item => item.startsWith('openQPopup:')).length;

  c._ckHandleKey(undefined, 'ent');

  assert.strictEqual(c._qPopupLine, -1, 'the current Q popup commits and closes');
  assert.strictEqual(
    h.log.filter(item => item.startsWith('openQPopup:')).length,
    openCallsBefore,
    'ENT does not jump across the empty block into Q41'
  );
});

test('Q navigation stays on the current line when panel validation keeps the input open', () => {
  const h = createHarness();
  const c = h.context;
  c.openQPopup(0);
  const openCallsBefore = h.log.filter(item => item.startsWith('openQPopup:')).length;
  c.qPanelConfirm = function() {
    h.log.push('qPanelConfirm:blocked');
  };

  c._ckHandleKey(undefined, 'ent');

  assert.strictEqual(c._qPopupLine, 0, 'failed validation keeps the same Q line active');
  assert.ok(h.document.getElementById('qPanelInput'), 'failed validation keeps the popup input mounted');
  assert.strictEqual(
    h.log.filter(item => item.startsWith('openQPopup:')).length,
    openCallsBefore,
    'failed validation does not open another Q line'
  );
  const input = h.document.getElementById('qPanelInput');
  const ent = keyboardKey(h, 'action', 'ent');
  assert.ok(input.classList.contains('ck-invalid'), 'the rejected input gets visible invalid feedback');
  assert.ok(ent.classList.contains('ck-invalid'), 'the rejected commit key gets visible invalid feedback');
  h.flushTimers();
  assert.strictEqual(input.classList.contains('ck-invalid'), false, 'input feedback clears after the animation');
  assert.strictEqual(ent.classList.contains('ck-invalid'), false, 'key feedback clears after the animation');
});

test('QP builder routes number, operator, value, previous and final insert steps', () => {
  const h = createHarness();
  const c = h.context;
  c.openQParamPanel();

  c._ckHandleKey('4');
  assert.strictEqual(c.QP.num, '4', 'first number key replaces the default Q number');
  c._ckHandleKey(undefined, 'ent');
  assert.strictEqual(c.QP.step, 1, 'ENT advances to the operator step');
  c._ckHandleKey('9');
  assert.strictEqual(c.QP.num, '4', 'numeric keys are ignored on the operator step');
  c._ckHandleKey(undefined, 'ent');
  assert.strictEqual(c.QP.step, 2, 'ENT advances from operator to value');
  c._ckHandleKey(undefined, 'q');
  c._ckHandleKey('7');
  assert.strictEqual(c.QP.val, 'Q7', 'QP value accepts a Q reference and number');
  c._ckHandleKey(undefined, 'prev');
  assert.strictEqual(c.QP.step, 1, 'previous returns to the operator step');
  c._ckHandleKey(undefined, 'ent');
  c._ckHandleKey(undefined, 'end');
  assert.ok(h.log.includes('qpInsert'), 'END commits the completed QP builder');
  assert.strictEqual(h.document.documentElement.classList.contains('ck-open'), false,
    'QP commit closes the custom keyboard');
});

test('show/hide lifecycle and TOOL DEF exception keep keyboard state consistent', () => {
  const h = createHarness();
  const c = h.context;
  c.openMPanel();
  assert.strictEqual(h.document.documentElement.classList.contains('ck-open'), true,
    'opening an owned editor shows the keyboard');
  c.closeCtxPanel();
  assert.strictEqual(h.document.documentElement.classList.contains('ck-open'), false,
    'closing the panel hides the keyboard');

  c.openMPanel();
  c.openToolDefEdit(3);
  h.flushTimers();
  assert.strictEqual(h.document.documentElement.classList.contains('ck-open'), false,
    'TOOL DEF explicitly hides the custom keyboard');
  assert.ok(h.log.includes('code:blur'), 'TOOL DEF drops editor focus');
  assert.ok(h.log.includes('mobileInput:blur'), 'TOOL DEF drops hidden mobile-input focus');
});

test('delegated DOM events route child clicks and pointerdown preserves focus', () => {
  const h = createHarness();
  const c = h.context;
  c.openMPanel();
  h.flushTimers();
  const input = h.document.getElementById('mCustomInput');
  const keyboard = h.document.getElementById('ckKeyboard');
  assert.ok(keyboard, 'show builds the keyboard DOM once');
  assert.strictEqual((keyboard.listeners.click || []).length, 1, 'keyboard uses one delegated click listener');

  const seven = keyboard.children.find(child => child.dataset.key === '7');
  const label = h.document.createElement('span');
  seven.appendChild(label);
  const pointer = new FakeEvent('pointerdown', { bubbles: true });
  const focusedBefore = h.document.activeElement;
  label.dispatchEvent(pointer);
  assert.strictEqual(pointer.defaultPrevented, true, 'pointerdown is cancelled before a key can steal focus');
  assert.strictEqual(h.document.activeElement, focusedBefore, 'pointerdown leaves the real input focused');

  label.dispatchEvent(new FakeEvent('click', { bubbles: true }));
  assert.strictEqual(input.value, '7', 'a click from a key child delegates to the correct key');
  c.openMPanel();
  assert.strictEqual(h.document.querySelectorAll('#ckKeyboard').length, 1,
    'reopening an editor does not duplicate the keyboard DOM');
});

test('first replacement keeps the existing sign in FM, Q, BLK and QP values', () => {
  const fm = createHarness();
  fm.context.FM.active = true;
  fm.context.FM.fields[0].val = '-20';
  fm.context.selectField(0);
  fm.context._ckHandleKey('5');
  assert.strictEqual(fm.context.FM.fields[0].val, '-5', 'FM preserves a negative sign');

  const q = createHarness();
  q.context.openQPopup(0);
  q.document.getElementById('qPanelInput').value = '-20';
  q.context._ckHandleKey('5');
  assert.strictEqual(q.document.getElementById('qPanelInput').value, '-5',
    'Q popup preserves a negative sign');

  const qp = createHarness();
  qp.context.openQParamPanel();
  qp.context.QP.step = 2;
  qp.context.QP.val = '-20';
  qp.context.renderQParamPanel();
  qp.context._ckHandleKey('5');
  assert.strictEqual(qp.context.QP.val, '-5', 'Q builder preserves a negative value sign');
});

test('key availability follows the active editor and QP step', () => {
  const h = createHarness();
  const c = h.context;
  c.openMPanel();
  assert.strictEqual(!!keyboardKey(h, 'key', '7').disabled, false, 'M enables digits');
  assert.strictEqual(!!keyboardKey(h, 'key', ',').disabled, true, 'M disables decimal comma');
  assert.strictEqual(!!keyboardKey(h, 'action', 'sign').disabled, true, 'M disables sign');
  assert.strictEqual(!!keyboardKey(h, 'action', 'q').disabled, true, 'M disables Q');
  assert.strictEqual(!!keyboardKey(h, 'action', 'prev').disabled, true, 'M disables previous');
  assert.strictEqual(!!keyboardKey(h, 'action', 'noent').disabled, true, 'M disables NO ENT');
  assert.strictEqual(!!keyboardKey(h, 'action', 'ent').disabled, false, 'M enables ENT');
  assert.strictEqual(!!keyboardKey(h, 'action', 'end').disabled, false, 'M enables END');

  c.openBlkFormPanel();
  assert.strictEqual(!!keyboardKey(h, 'key', ',').disabled, false, 'BLK value enables comma');
  assert.strictEqual(!!keyboardKey(h, 'action', 'sign').disabled, false, 'BLK value enables sign');
  assert.strictEqual(!!keyboardKey(h, 'action', 'q').disabled, true, 'BLK disables Q');
  assert.strictEqual(!!keyboardKey(h, 'action', 'p').disabled, true, 'BLK disables P');
  assert.strictEqual(!!keyboardKey(h, 'action', 'i').disabled, true, 'BLK disables I');

  c.openQParamPanel();
  c._ckHandleKey(undefined, 'ent');
  assert.strictEqual(c.QP.step, 1, 'test reaches the operator step');
  assert.strictEqual(!!keyboardKey(h, 'key', '7').disabled, true, 'QP operator disables digits');
  assert.strictEqual(!!keyboardKey(h, 'key', ',').disabled, true, 'QP operator disables comma');
  assert.strictEqual(!!keyboardKey(h, 'action', 'backspace').disabled, true,
    'QP operator disables backspace');
  assert.strictEqual(!!keyboardKey(h, 'action', 'prev').disabled, false,
    'QP operator enables previous');
  assert.strictEqual(!!keyboardKey(h, 'action', 'ent').disabled, false, 'QP operator enables ENT');
});

test('feed fields reject both decimal separators while other numeric fields keep them', () => {
  const h = createHarness();
  const c = h.context;
  c.FM.active = true;
  c.FM.builderKey = 'L';
  c.FM.fields = [{ p: 'F', type: 'feed', opt: true, val: '4' }];
  c.selectField(0);
  c.FM.typing = true;

  assert.strictEqual(!!keyboardKey(h, 'key', ',').disabled, true,
    'positioning feed visibly disables the decimal key');
  c._ckHandleKey(',');
  c._ckHandleKey('.');
  assert.strictEqual(c.FM.fields[0].val, '4',
    'direct dispatch cannot change a feed through a decimal separator');

  c.FM.builderKey = 'TOOL CALL';
  c.FM.fields = [{ p: 'F', type: 'num', opt: true, val: '420.500' }];
  c.selectField(0);
  c.FM.typing = true;
  assert.strictEqual(!!keyboardKey(h, 'key', ',').disabled, true,
    'TOOL CALL feed is whole-number-only too');
  c._ckHandleKey('.');
  assert.strictEqual(c.FM.fields[0].val, '420.500',
    'rejecting dot does not rewrite an existing legacy decimal feed');
});

test('the programming keypad stays locked for every active editor owner', () => {
  const h = createHarness();
  const c = h.context;

  c.FM.active = true;
  c.selectField(0);
  assert.strictEqual(!!h.programKey.disabled, true, 'FM locks whole-block programming keys');
  c.exitFieldMode();
  assert.strictEqual(!!h.programKey.disabled, false, 'ending FM unlocks programming keys');

  c.openMPanel();
  assert.strictEqual(!!h.programKey.disabled, true, 'M editing locks programming keys');
  c.closeCtxPanel();
  assert.strictEqual(!!h.programKey.disabled, false, 'closing M editing unlocks programming keys');

  c.openToolDefEdit();
  assert.strictEqual(!!h.programKey.disabled, true, 'TOOL DEF editing locks programming keys without opening a keyboard');
  c.closeCtxPanel();
  assert.strictEqual(!!h.programKey.disabled, false, 'closing TOOL DEF editing unlocks programming keys');

  c.insertToolDef();
  assert.strictEqual(h.document.getElementById('toolDefPicker'), null,
    'empty Tool Table reproduces the TOOL DEF panel without a picker');
  assert.strictEqual(!!h.programKey.disabled, true,
    'the panel owner marker still locks programming keys without #toolDefPicker');
  c._endAllEditorInput();
  assert.strictEqual(!!h.programKey.disabled, false,
    'central lifecycle cleanup closes the empty TOOL DEF owner');
});

test('central lifecycle cleanup closes real, virtual and docked editor owners', () => {
  const h = createHarness();
  const c = h.context;

  c.openMPanel();
  assert.ok(h.document.getElementById('mCustomInput'), 'M editor is open');
  c._endAllEditorInput({ keepCodeFocus: true });
  assert.strictEqual(h.document.getElementById('mCustomInput'), null, 'M editor closes');
  assert.strictEqual(h.document.documentElement.classList.contains('ck-open'), false,
    'custom keyboard closes with the owner');

  c.openQParamPanel();
  assert.strictEqual(h.ctxPanel.dataset.editorOwner, 'qp', 'Q builder owns the panel');
  c._endAllEditorInput();
  assert.strictEqual(h.ctxPanel.dataset.editorOwner, undefined, 'Q builder owner marker clears');

  c.openCyclePicker();
  assert.strictEqual(h.ctxPanel.dataset.editorOwner, 'cycle', 'cycle picker owns the panel');
  c._endAllEditorInput();
  assert.strictEqual(h.document.getElementById('cyclePicker'), null, 'cycle picker closes');
});

test('P and I expose selected state for the current FM mode', () => {
  const h = createHarness();
  const c = h.context;
  c.FM.active = true;
  c.FM.builderKey = 'P';
  c.FM.fields = [
    { p: 'PR', type: 'coord', opt: true, val: '+50', incr: false },
    { p: 'PA', type: 'coord', opt: true, val: '+180', incr: false },
    { p: 'M', type: 'mval', opt: true, val: '99' }
  ];
  c.selectField(0);
  const p = keyboardKey(h, 'action', 'p');
  const i = keyboardKey(h, 'action', 'i');
  assert.ok(p.classList.contains('ck-selected'), 'P is selected in P mode');
  assert.strictEqual(p.getAttribute('aria-pressed'), 'true', 'P announces pressed state');
  assert.strictEqual(!!p.disabled, false, 'P remains actionable in P mode');
  assert.strictEqual(!!i.disabled, true, 'I remains unavailable for unsupported incremental PR');

  c.selectField(1);
  assert.strictEqual(!!i.disabled, false, 'I is actionable for PA in an LP block with M99');
  c._ckHandleKey(undefined, 'i');
  assert.ok(h.log.includes('toggleIncrementalToken'),
    'the Android I key routes LP PA through the incremental conversion');

  c.FM.builderKey = 'L';
  c.FM.fields = [{ p: 'X', type: 'coord', opt: true, val: '+10', incr: true }];
  c.selectField(0);
  assert.strictEqual(p.classList.contains('ck-selected'), false, 'P clears outside P mode');
  assert.ok(i.classList.contains('ck-selected'), 'I is selected for an incremental L coordinate');
  assert.strictEqual(i.getAttribute('aria-pressed'), 'true', 'I announces pressed state');
  assert.strictEqual(!!i.disabled, false, 'I is actionable for an L coordinate');

  c.FM.builderKey = 'CR';
  c.FM.fields[0].incr = false;
  c.selectField(0);
  assert.strictEqual(!!p.disabled, true, 'P is disabled for a non-L/P builder');
  assert.strictEqual(!!i.disabled, true, 'I is disabled for a non-L builder');
});

test('long press backspace clears a value and consumes the following click', () => {
  const h = createHarness();
  h.context.openBlkFormPanel();
  const input = h.document.getElementById('blkFbarVal');
  let inputEvents = 0;
  input.addEventListener('input', () => inputEvents++);
  const backspace = keyboardKey(h, 'action', 'backspace');

  backspace.dispatchEvent(new FakeEvent('pointerdown', { bubbles: true }));
  h.flushTimers();
  assert.strictEqual(input.value, '', 'the hold clears the entire current value');
  assert.strictEqual(inputEvents, 1, 'the clear emits exactly one input event');
  backspace.dispatchEvent(new FakeEvent('pointerup', { bubbles: true }));
  backspace.dispatchEvent(new FakeEvent('click', { bubbles: true }));
  assert.strictEqual(input.value, '', 'the synthetic click after a hold is consumed');
  assert.strictEqual(inputEvents, 1, 'the consumed click emits no second input event');
});

test('short backspace keeps single-character deletion and cancelled holds never clear', () => {
  const h = createHarness();
  h.context.openBlkFormPanel();
  const input = h.document.getElementById('blkFbarVal');
  input.value = '123';
  let inputEvents = 0;
  input.addEventListener('input', () => inputEvents++);
  const backspace = keyboardKey(h, 'action', 'backspace');

  backspace.dispatchEvent(new FakeEvent('pointerdown', { bubbles: true }));
  backspace.dispatchEvent(new FakeEvent('pointerup', { bubbles: true }));
  backspace.dispatchEvent(new FakeEvent('click', { bubbles: true }));
  h.flushTimers();
  assert.strictEqual(input.value, '12', 'a short press removes exactly one character');
  assert.strictEqual(inputEvents, 1, 'a short press emits exactly one input event');
});

test('long press backspace clears virtual FM and QP values too', () => {
  const fm = createHarness();
  fm.context.FM.active = true;
  fm.context.FM.fields[0].val = '-20';
  fm.context.selectField(0);
  keyboardKey(fm, 'action', 'backspace')
    .dispatchEvent(new FakeEvent('pointerdown', { bubbles: true }));
  fm.flushTimers();
  assert.strictEqual(fm.context.FM.fields[0].val, null, 'optional FM coordinate is fully cleared');

  const qp = createHarness();
  qp.context.openQParamPanel();
  qp.context.QP.step = 2;
  qp.context.QP.val = '-20';
  qp.context.renderQParamPanel();
  keyboardKey(qp, 'action', 'backspace')
    .dispatchEvent(new FakeEvent('pointerdown', { bubbles: true }));
  qp.flushTimers();
  assert.strictEqual(qp.context.QP.val, '', 'QP virtual value is fully cleared');
});

let failures = 0;
tests.forEach(({ name, fn }) => {
  try {
    fn();
    console.log('ok - ' + name);
  } catch (error) {
    failures++;
    console.error('not ok - ' + name);
    console.error(error.stack || error);
  }
});

if (failures) {
  console.error(failures + ' custom keyboard deep regression(s) failed');
  process.exitCode = 1;
} else {
  console.log('custom keyboard deep runtime regression passed (' + tests.length + ' cases)');
}
