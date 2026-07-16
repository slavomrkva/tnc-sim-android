'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'android', 'webgl-compat.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');

function storage(){
  const values = new Map();
  return {
    getItem:key => values.has(key) ? values.get(key) : null,
    setItem:(key, value) => values.set(key, String(value)),
    removeItem:key => values.delete(key)
  };
}

function environment(local, session){
  let now = 0;
  let reloads = 0;
  let timerId = 0;
  const timers = new Map();
  const window = {
    navigator:{userAgent:'Android WebView/145'},
    Capacitor:{getPlatform:() => 'android', isNativePlatform:() => true},
    localStorage:local,
    sessionStorage:session,
    performance:{now:() => now},
    location:{reload:() => { reloads += 1; }},
    document:{
      body:{getAttribute:() => 'view'},
      getElementById:() => ({value:'BEGIN PGM TEST', selectionStart:2, selectionEnd:4}),
      createElement:() => ({getContext:(api, attrs) => api === 'webgl' ? {api, attrs} : null})
    },
    setTimeout:fn => { const id = ++timerId; timers.set(id, fn); return id; },
    clearTimeout:id => timers.delete(id)
  };
  window.window = window;
  vm.runInNewContext(source, {window});
  return {
    window,
    setNow:value => { now = value; },
    runTimers:() => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); },
    reloads:() => reloads
  };
}

function canvas(){
  const listeners = {};
  return {
    listeners,
    addEventListener:(name, fn) => { listeners[name] = fn; },
    removeEventListener:name => { delete listeners[name]; }
  };
}

// Healthy devices keep the original renderer and full-quality settings.
const local = storage();
const session = storage();
const normal = environment(local, session);
assert.strictEqual(normal.window.AndroidWebGLCompat.isAndroidApp(), true);
assert.strictEqual(normal.window.AndroidWebGLCompat.isSafeMode(), false);
function OriginalRenderer(options){ this.options = options; }
const normalThree = {WebGLRenderer:OriginalRenderer};
normal.window.AndroidWebGLCompat.installRenderer(normalThree)();
assert.strictEqual(normalThree.WebGLRenderer, OriginalRenderer);

// A transient startup loss that restores within the grace period stays normal.
const transient = environment(storage(), storage());
const transientCanvas = canvas();
transient.window.AndroidWebGLCompat.watchRenderer({domElement:transientCanvas});
transient.setNow(4000);
transientCanvas.listeners.webglcontextlost();
transientCanvas.listeners.webglcontextrestored();
transient.runTimers();
assert.strictEqual(transient.reloads(), 0);
assert.strictEqual(transient.window.AndroidWebGLCompat.isSafeMode(), false);

// Later lifecycle/background losses do not permanently lower rendering quality.
const late = environment(storage(), storage());
const lateCanvas = canvas();
late.window.AndroidWebGLCompat.watchRenderer({domElement:lateCanvas});
late.setNow(16001);
lateCanvas.listeners.webglcontextlost();
late.runTimers();
assert.strictEqual(late.reloads(), 0);
assert.strictEqual(late.window.AndroidWebGLCompat.isSafeMode(), false);

// Opening the Android repository in a regular desktop browser never enables
// or learns the native WebView fallback.
const preview = environment(storage(), storage());
preview.window.Capacitor = null;
preview.window.navigator.userAgent = 'Mozilla/5.0 Chrome/145 Safari/537.36';
vm.runInNewContext(source, {window:preview.window});
assert.strictEqual(preview.window.AndroidWebGLCompat.isAndroidApp(), false);
assert.strictEqual(preview.window.AndroidWebGLCompat.isSafeMode(), false);

// A persistent early context loss is remembered and triggers exactly one reload.
const firstCanvas = canvas();
normal.window.AndroidWebGLCompat.watchRenderer({domElement:firstCanvas});
normal.setNow(5670);
firstCanvas.listeners.webglcontextlost();
normal.runTimers();
assert.strictEqual(normal.reloads(), 1);
assert.strictEqual(local.getItem('tncSimWebglSafeUaV1'), 'Android WebView/145');

// The reload uses explicit WebGL1 with reduced GPU buffers.
const safe = environment(local, session);
assert.strictEqual(safe.window.AndroidWebGLCompat.isSafeMode(), true);
const safeThree = {WebGLRenderer:OriginalRenderer};
const restore = safe.window.AndroidWebGLCompat.installRenderer(safeThree);
const renderer = new safeThree.WebGLRenderer({antialias:true});
assert.strictEqual(renderer.options.context.api, 'webgl');
assert.strictEqual(renderer.options.antialias, false);
assert.strictEqual(renderer.options.stencil, false);
assert.strictEqual(renderer.options.powerPreference, 'low-power');
restore();
assert.strictEqual(safeThree.WebGLRenderer, OriginalRenderer);

// A WebView update clears the device-specific safe marker and retries quality mode.
const updatedEnv = environment(local, storage());
updatedEnv.window.navigator.userAgent = 'Android WebView/146';
vm.runInNewContext(source, {window:updatedEnv.window});
assert.strictEqual(updatedEnv.window.AndroidWebGLCompat.isSafeMode(), false);

// Integration order and release markers.
assert.ok(index.indexOf('android/webgl-compat.js') < index.indexOf('android/app.js'));
assert.match(app, /var APP_VERSION = '1\.0\.47';/);
assert.match(app, /_androidWebGLCompat\.isSafeMode\(\)/);
assert.match(app, /renderer\.setPixelRatio\(1\)/);

console.log('android-webgl-compat.test.js: adaptive Android WebGL fallback verified');
