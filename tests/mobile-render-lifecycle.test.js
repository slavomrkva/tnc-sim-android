'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'core', 'sim-controls.js'), 'utf8');

let activeTab = 'editor';
let timeoutCallback = null;
let timeoutDelay = null;
let frameCallback = null;
let renderCalls = 0;
let contextChecks = 0;
let deltaCalls = 0;

const ctx = {
  document:{
    body:{getAttribute(name){ return name === 'data-mtab' ? activeTab : null; }},
    getElementById(){ return null; }
  },
  _isMTab(){ return true; },
  setTimeout(callback, delay){ timeoutCallback = callback; timeoutDelay = delay; },
  requestAnimationFrame(callback){ frameCallback = callback; },
  clock:{getDelta(){ deltaCalls++; return 0.016; }},
  THREE_OK:true,
  renderer:{
    getContext(){ contextChecks++; return {isContextLost(){ return false; }}; },
    render(){ renderCalls++; }
  },
  glContextLost:false,
  resizeToDisplay(){ return false; },
  mode:'idle',
  atcAnim:false,
  VX:{dirty:false},
  controls:null,
  pendingToolNum:null,
  updateATC(){},
  scene:{},
  camera:{},
  console
};

vm.createContext(ctx);
vm.runInContext(source, ctx, {filename:'sim-controls.js'});

ctx.loop();
assert.strictEqual(renderCalls, 0, 'hidden mobile Editor must not render WebGL');
assert.strictEqual(contextChecks, 0, 'hidden mobile Editor must not even touch the WebGL context');
assert.strictEqual(deltaCalls, 1, 'hidden loop keeps the clock warm without advancing simulation');
assert.strictEqual(timeoutDelay, 100, 'hidden loop retries at a low-cost cadence');
assert.strictEqual(frameCallback, null, 'hidden loop does not maintain a full-rate animation frame');

timeoutCallback();
assert.strictEqual(typeof frameCallback, 'function', 'hidden loop schedules one future visibility check');
activeTab = 'view';
frameCallback();
assert.strictEqual(renderCalls, 1, 'rendering resumes after Simulate becomes visible');
assert.strictEqual(contextChecks, 2,
  'visible render performs the existing context availability and loss checks');

assert.match(source, /function onRun\(\)\{\s*if\(typeof _isMTab==='function' && _isMTab\(\)\) mtabSwitch\('view'\);/,
  'Run still reveals Simulate before it starts advancing the program');

console.log('mobile-render-lifecycle.test.js: hidden WebGL pause and visible resume verified');
