'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'www', 'android', 'webgl-compat.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'www', 'android', 'app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const render3d = fs.readFileSync(path.join(root, 'www', 'core', 'render3d.js'), 'utf8');

function storage(options = {}){
  const values = new Map();
  return {
    getItem:key => {
      if(options.failReads) throw new Error('storage read failed');
      return values.has(key) ? values.get(key) : null;
    },
    setItem:(key, value) => {
      if(options.failWrites) throw new Error('storage write failed');
      values.set(key, String(value));
    },
    removeItem:key => values.delete(key)
  };
}

function eventTarget(){
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, fn){
      if(!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(fn);
    },
    removeEventListener(name, fn){
      const list = listeners.get(name) || [];
      const index = list.indexOf(fn);
      if(index >= 0) list.splice(index, 1);
    },
    dispatch(name, event = {}){
      event.type = name;
      event.defaultPrevented = false;
      event.preventDefault = () => { event.defaultPrevented = true; };
      for(const fn of [...(listeners.get(name) || [])]) fn(event);
      return event;
    }
  };
}

function environment(local, session, options = {}){
  let now = 0;
  let timerId = 0;
  const timers = new Map();
  const navigations = [];
  const errors = [];
  const documentEvents = eventTarget();
  const document = {
    ...documentEvents,
    hidden:false,
    visibilityState:'visible',
    body:{getAttribute:() => 'view'},
    getElementById:() => ({value:'BEGIN PGM TEST', selectionStart:2, selectionEnd:4}),
    createElement:() => ({
      getContext:(api, attrs) => !options.webglUnavailable && api === 'webgl'
        ? {api, attrs} : null
    })
  };
  const location = {
    href:options.href || 'http://localhost/index.html',
    replace(target){
      if(options.replaceThrows) throw new Error('replace failed');
      navigations.push({type:'replace', target});
    },
    reload(){
      if(options.reloadThrows) throw new Error('reload failed');
      navigations.push({type:'reload', target:this.href});
    }
  };
  const window = {
    URL,
    navigator:{userAgent:options.ua || 'Mozilla/5.0 (Linux; Android 13; wv) Android WebView/145'},
    Capacitor:options.capacitor === undefined
      ? {getPlatform:() => 'android', isNativePlatform:() => true}
      : options.capacitor,
    localStorage:local,
    sessionStorage:session,
    performance:{now:() => now},
    location,
    document,
    show3DError:message => errors.push(message),
    setTimeout(fn, delay = 0){
      const id = ++timerId;
      timers.set(id, {fn, due:now + delay});
      return id;
    },
    clearTimeout:id => timers.delete(id)
  };
  if(options.safeMode){
    try{ local.setItem('tncSimWebglSafeUaV1', window.navigator.userAgent); }catch(e){}
  }
  window.window = window;
  vm.runInNewContext(source, {window});

  function advance(ms){
    const target = now + ms;
    for(;;){
      let nextId = null;
      let next = null;
      for(const [id, timer] of timers){
        if(timer.due <= target && (!next || timer.due < next.due)){
          nextId = id;
          next = timer;
        }
      }
      if(!next) break;
      now = next.due;
      timers.delete(nextId);
      next.fn();
    }
    now = target;
  }

  return {
    window,
    advance,
    setNow:value => { now = value; },
    setHidden(hidden){
      document.hidden = hidden;
      document.visibilityState = hidden ? 'hidden' : 'visible';
      document.dispatch('visibilitychange');
    },
    navigations,
    errors
  };
}

function canvas(){ return eventTarget(); }

function OriginalRenderer(options){ this.options = options; }

// A device remembered after a real context loss starts WebGL1 before a normal
// renderer can poison the WebView GPU process, and clamps every DPR request.
const remembered = environment(storage(), storage(), {safeMode:true});
assert.strictEqual(remembered.window.AndroidWebGLCompat.isSafeMode(), true);
function PixelRenderer(options){
  this.options = options;
  this.pixelRatios = [];
}
PixelRenderer.prototype.setPixelRatio = function(value){
  this.pixelRatios.push(value);
  return this;
};
const rememberedThree = {WebGLRenderer:PixelRenderer};
const restoreRemembered = remembered.window.AndroidWebGLCompat.installRenderer(rememberedThree);
const rememberedRenderer = new rememberedThree.WebGLRenderer({antialias:true});
rememberedRenderer.setPixelRatio(1.5);
rememberedRenderer.setPixelRatio(2);
assert.strictEqual(rememberedRenderer.options.context.api, 'webgl');
assert.deepStrictEqual(rememberedRenderer.pixelRatios, [1, 1]);
assert.strictEqual(remembered.window.AndroidWebGLCompat.diagnostics().stage, 'safe-renderer-ready');
restoreRemembered();
assert.strictEqual(rememberedThree.WebGLRenderer, PixelRenderer);

// A first-boot WebGL1 failure reports an actionable stage instead of letting
// prepare() continue with a null renderer and abort the rest of app boot.
const noWebGL1 = environment(storage(), storage(), {
  safeMode:true,
  webglUnavailable:true
});
const noWebGLThree = {WebGLRenderer:OriginalRenderer};
const restoreNoWebGL = noWebGL1.window.AndroidWebGLCompat.installRenderer(noWebGLThree);
assert.throws(() => new noWebGLThree.WebGLRenderer(), /WebGL1 context unavailable/);
restoreNoWebGL();
noWebGL1.window.AndroidWebGLCompat.reportRendererFailure();
assert.match(noWebGL1.errors[0], /C15-SC0/);

// Healthy devices keep the original renderer and full-quality settings.
const local = storage();
const session = storage();
const normal = environment(local, session);
assert.strictEqual(normal.window.AndroidWebGLCompat.isAndroidApp(), true);
assert.strictEqual(normal.window.AndroidWebGLCompat.isSafeMode(), false);
const normalThree = {WebGLRenderer:OriginalRenderer};
normal.window.AndroidWebGLCompat.installRenderer(normalThree)();
assert.strictEqual(normalThree.WebGLRenderer, OriginalRenderer);

// Capacitor's explicit Android platform wins even if bridge readiness briefly
// makes isNativePlatform() return false.
const bridgeRace = environment(storage(), storage(), {
  capacitor:{getPlatform:() => 'android', isNativePlatform:() => false}
});
assert.strictEqual(bridgeRace.window.AndroidWebGLCompat.isAndroidApp(), true);

// A transient context loss that restores within the grace period stays normal.
const transient = environment(storage(), storage());
const transientCanvas = canvas();
transient.window.AndroidWebGLCompat.watchRenderer({domElement:transientCanvas});
const transientEvent = transientCanvas.dispatch('webglcontextlost');
assert.strictEqual(transientEvent.defaultPrevented, true);
transient.advance(1000);
transientCanvas.dispatch('webglcontextrestored');
transient.advance(2000);
assert.strictEqual(transient.navigations.length, 0);
assert.strictEqual(transient.window.AndroidWebGLCompat.isSafeMode(), false);

// A persistent visible loss switches even when 3D is opened long after boot.
const lateVisibleLocal = storage();
const lateVisible = environment(lateVisibleLocal, storage());
const lateVisibleCanvas = canvas();
lateVisible.window.AndroidWebGLCompat.watchRenderer({domElement:lateVisibleCanvas});
lateVisible.setNow(60000);
lateVisibleCanvas.dispatch('webglcontextlost');
lateVisible.advance(1999);
assert.strictEqual(lateVisible.navigations.length, 0);
lateVisible.advance(1);
assert.strictEqual(lateVisible.navigations.length, 1);
assert.strictEqual(lateVisible.navigations[0].type, 'replace');
assert.match(lateVisible.navigations[0].target, /tncWebglSafe=1/);
assert.strictEqual(lateVisibleLocal.getItem('tncSimWebglSafeUaV1'), lateVisible.window.navigator.userAgent);

// The generic renderer listener can call preventDefault without suppressing
// the compatibility listener registered on the same canvas.
const shared = environment(storage(), storage());
const sharedCanvas = canvas();
let genericErrors = 0;
sharedCanvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  shared.window.setTimeout(() => { genericErrors += 1; }, 2500);
});
shared.window.AndroidWebGLCompat.watchRenderer({domElement:sharedCanvas});
const sharedEvent = sharedCanvas.dispatch('webglcontextlost');
assert.strictEqual(sharedEvent.defaultPrevented, true);
assert.strictEqual(sharedCanvas.listeners.get('webglcontextlost').length, 2);
shared.advance(2000);
assert.strictEqual(shared.navigations.length, 1);
assert.strictEqual(genericErrors, 0);

// Background loss is not treated as a device defect unless it remains lost
// after the app becomes visible again.
const background = environment(storage(), storage());
const backgroundCanvas = canvas();
background.window.AndroidWebGLCompat.watchRenderer({domElement:backgroundCanvas});
background.setHidden(true);
backgroundCanvas.dispatch('webglcontextlost');
background.advance(5000);
assert.strictEqual(background.navigations.length, 0);
background.setHidden(false);
background.advance(2000);
assert.strictEqual(background.navigations.length, 1);

// Becoming hidden after the timer was armed also defers navigation until the
// app returns to foreground.
const backgroundRace = environment(storage(), storage());
const backgroundRaceCanvas = canvas();
backgroundRace.window.AndroidWebGLCompat.watchRenderer({domElement:backgroundRaceCanvas});
backgroundRaceCanvas.dispatch('webglcontextlost');
backgroundRace.advance(100);
backgroundRace.setHidden(true);
backgroundRace.advance(3000);
assert.strictEqual(backgroundRace.navigations.length, 0);
backgroundRace.setHidden(false);
backgroundRace.advance(2000);
assert.strictEqual(backgroundRace.navigations.length, 1);

// Failure to write localStorage falls back to sessionStorage instead of
// silently abandoning recovery.
const sessionFallbackSession = storage();
const sessionFallback = environment(storage({failWrites:true}), sessionFallbackSession);
const sessionFallbackCanvas = canvas();
sessionFallback.window.AndroidWebGLCompat.watchRenderer({domElement:sessionFallbackCanvas});
sessionFallbackCanvas.dispatch('webglcontextlost');
sessionFallback.advance(2000);
assert.strictEqual(sessionFallback.navigations.length, 1);
assert.strictEqual(
  sessionFallbackSession.getItem('tncSimWebglSafeSessionUaV1'),
  sessionFallback.window.navigator.userAgent
);
assert.strictEqual(sessionFallback.window.AndroidWebGLCompat.diagnostics().storage, 'session');

// If both Web Storage implementations reject writes, the reload URL itself
// carries the one-shot safe-mode request.
const urlFallback = environment(storage({failWrites:true}), storage({failWrites:true}));
const urlFallbackCanvas = canvas();
urlFallback.window.AndroidWebGLCompat.watchRenderer({domElement:urlFallbackCanvas});
urlFallbackCanvas.dispatch('webglcontextlost');
urlFallback.advance(2000);
const safeUrl = urlFallback.navigations[0].target;
assert.match(safeUrl, /tncWebglSafe=1/);
const urlSafeBoot = environment(storage(), storage(), {href:safeUrl});
assert.strictEqual(urlSafeBoot.window.AndroidWebGLCompat.isSafeMode(), true);

// A failed replace falls back to the original reload operation.
const reloadFallback = environment(storage(), storage(), {replaceThrows:true});
const reloadFallbackCanvas = canvas();
reloadFallback.window.AndroidWebGLCompat.watchRenderer({domElement:reloadFallbackCanvas});
reloadFallbackCanvas.dispatch('webglcontextlost');
reloadFallback.advance(2000);
assert.deepStrictEqual(reloadFallback.navigations.map(item => item.type), ['reload']);
assert.strictEqual(reloadFallback.window.AndroidWebGLCompat.diagnostics().navigation, 'reload');

// If navigation remains on the broken page, expose a visible diagnostic code
// instead of leaving only the ambiguous generic renderer message.
const watchdog = environment(storage(), storage());
const watchdogCanvas = canvas();
watchdog.window.AndroidWebGLCompat.watchRenderer({domElement:watchdogCanvas});
watchdogCanvas.dispatch('webglcontextlost');
watchdog.advance(3500);
assert.strictEqual(watchdog.errors.length, 1);
assert.match(watchdog.errors[0], /C15-N1A1L1SLRR/);

// Opening the Android repository in a regular desktop browser never enables
// or learns the native WebView fallback.
const preview = environment(storage(), storage(), {
  capacitor:null,
  ua:'Mozilla/5.0 Chrome/145 Safari/537.36'
});
assert.strictEqual(preview.window.AndroidWebGLCompat.isAndroidApp(), false);
assert.strictEqual(preview.window.AndroidWebGLCompat.isSafeMode(), false);

// The safe boot uses explicit WebGL1 with reduced GPU buffers.
const safe = environment(lateVisibleLocal, session);
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
const updatedEnv = environment(lateVisibleLocal, storage(), {
  ua:'Mozilla/5.0 (Linux; Android 13; wv) Android WebView/146'
});
assert.strictEqual(updatedEnv.window.AndroidWebGLCompat.isSafeMode(), false);

// Integration order and release markers.
assert.ok(index.indexOf('android/webgl-compat.js') < index.indexOf('android/app.js'));
assert.match(app, /var APP_VERSION = '1\.0\.53';/);
assert.doesNotMatch(app, /renderer\.setPixelRatio\(1\)/);
assert.match(app, /if\(THREE_OK && renderer\)/);
assert.doesNotMatch(index, /__TNC_(?:FORCE_WEBGL1|SKIP_VOXELS|VOXEL_RAMP|MONOLITHIC_VOXEL)_DIAGNOSTIC/);
assert.match(app, /var VX_COMPAT_MODE = !!\(window\.AndroidWebGLCompat/);
assert.match(app, /window\.AndroidWebGLCompat\.isSafeMode\(\)/);
assert.match(app, /var VX_RES_LEVELS = \[100, 150, 200\];/);
assert.match(app, /VX_RES_LEVELS = \[50, 75, 100\]/);
assert.doesNotMatch(render3d, /_skipVoxelsDiagnostic/);
assert.match(render3d, /if\(prog\.hasStock!==false\) vxInit\(prog\)/);

console.log('android-webgl-compat.test.js: resilient Android WebGL recovery verified');
