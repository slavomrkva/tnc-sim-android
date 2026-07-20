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
    values,
    getItem(key){
      if(options.failReads) throw new Error('storage read failed');
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value){
      if(options.failWrites) throw new Error('storage write failed');
      values.set(key, String(value));
    },
    removeItem(key){ values.delete(key); }
  };
}

function domElement(tag = 'div'){
  return {
    tag,
    id:'',
    type:'',
    className:'',
    textContent:'',
    style:{},
    attributes:new Map(),
    children:[],
    listeners:new Map(),
    parentNode:null,
    setAttribute(name, value){ this.attributes.set(name, String(value)); },
    addEventListener(name, fn){ this.listeners.set(name, fn); },
    appendChild(child){ child.parentNode = this; this.children.push(child); return child; },
    removeChild(child){ this.children = this.children.filter(item => item !== child); child.parentNode = null; }
  };
}

function environment(local, session, options = {}){
  const navigations = [];
  const errors = [];
  const toasts = [];
  const timers = [];
  const code = domElement('textarea');
  code.value = options.code || 'BEGIN PGM TEST';
  code.selectionStart = 2;
  code.selectionEnd = 4;
  const toggle = domElement('button');
  toggle.id = 'compatModeToggle';
  const elements = new Map([['code', code], ['compatModeToggle', toggle]]);
  const document = {
    body:{getAttribute:() => 'view'},
    getElementById:id => elements.get(id) || null,
    createElement(tag){
      const item = domElement(tag);
      if(tag === 'canvas'){
        item.getContext = api => !options.webglUnavailable && api === 'webgl' ? {api} : null;
      }
      return item;
    }
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
    location,
    document,
    curView:'3d',
    _docName:options.docName || 'part.H',
    show3DError:message => errors.push(message),
    _toast:message => toasts.push(message),
    setTimeout(fn){ timers.push(fn); return timers.length; },
    clearTimeout(){}
  };
  window._setDocName = name => { window._docName = name; };
  window.window = window;
  vm.runInNewContext(source, {window});
  return {window, document, elements, toggle, navigations, errors, toasts, timers};
}

function OriginalRenderer(options){
  this.options = options;
  this.pixelRatios = [];
}
OriginalRenderer.prototype.setPixelRatio = function(value){
  this.pixelRatios.push(value);
  return this;
};

// Normal rendering is the default and no renderer event can switch it.
const normalLocal = storage();
const normalSession = storage();
const normal = environment(normalLocal, normalSession);
assert.strictEqual(normal.window.AndroidWebGLCompat.isAndroidApp(), true);
assert.strictEqual(normal.window.AndroidWebGLCompat.isSafeMode(), false);
assert.strictEqual(normal.toggle.textContent, 'Compatibility');
assert.strictEqual(normal.toggle.attributes.get('aria-pressed'), 'false');
assert.doesNotMatch(source, /webglcontextlost|watchRenderer|RECOVERY_WAIT_MS/);
assert.doesNotMatch(app, /\.watchRenderer\(/);

// Only an explicit user action stores Compatibility mode and reloads.
assert.strictEqual(normal.window.AndroidWebGLCompat.toggleMode(), true);
assert.strictEqual(normalLocal.getItem('tncSimWebglCompatibilityModeV1'), '1');
assert.strictEqual(normal.navigations.length, 1);
assert.match(normal.navigations[0].target, /tncWebglCompat=1/);
assert.ok(normalSession.getItem('tncSimWebglReloadStateV1'));
const reloadState = JSON.parse(normalSession.getItem('tncSimWebglReloadStateV1'));
assert.strictEqual(reloadState.docName, 'part.H');
const reloaded = environment(normalLocal, normalSession, {code:'DEFAULT CODE', docName:'program.H'});
reloaded.window.AndroidWebGLCompat.restoreSessionState(reloaded.elements.get('code'));
assert.strictEqual(reloaded.elements.get('code').value, 'BEGIN PGM TEST');
assert.strictEqual(reloaded.window._docName, 'part.H');

// A manually remembered mode starts the proven WebGL1/DPR1 renderer.
const remembered = environment(normalLocal, storage());
assert.strictEqual(remembered.window.AndroidWebGLCompat.isSafeMode(), true);
assert.strictEqual(remembered.toggle.textContent, 'Compatibility');
const rememberedThree = {WebGLRenderer:OriginalRenderer};
const restore = remembered.window.AndroidWebGLCompat.installRenderer(rememberedThree);
const renderer = new rememberedThree.WebGLRenderer({antialias:true});
renderer.setPixelRatio(2);
assert.strictEqual(renderer.options.context.api, 'webgl');
assert.strictEqual(renderer.options.antialias, false);
assert.strictEqual(renderer.options.stencil, false);
assert.strictEqual(renderer.options.powerPreference, 'low-power');
assert.deepStrictEqual(renderer.pixelRatios, [1]);
restore();
assert.strictEqual(rememberedThree.WebGLRenderer, OriginalRenderer);

// Normal mode is also a manual action and clears the persistent preference.
assert.strictEqual(remembered.window.AndroidWebGLCompat.setMode(false), true);
assert.strictEqual(normalLocal.getItem('tncSimWebglCompatibilityModeV1'), null);
assert.doesNotMatch(remembered.navigations[0].target, /tncWebglCompat=1/);

// A normal-mode error explains the required full restart before the user taps
// Compatibility; the error panel also receives the same manual toggle.
const normalError = environment(storage(), storage());
const normalErrorContainer = domElement();
normalErrorContainer.firstElementChild = domElement();
normalError.window.AndroidWebGLCompat.attachErrorButton(normalErrorContainer);
const normalErrorHint = normalErrorContainer.firstElementChild.children[0];
const normalErrorButton = normalErrorContainer.firstElementChild.children[1];
assert.strictEqual(normalErrorHint.id, 'view3dCompatibilityRestartHint');
assert.strictEqual(normalErrorHint.textContent,
  'After selecting Compatibility, fully close and reopen the app.');
assert.strictEqual(normalErrorButton.textContent, 'Compatibility mode');

// If the same WebView session cannot create WebGL1 immediately after the
// switch, do not repeat the restart hint: Compatibility is already selected.
const errorContainer = domElement();
errorContainer.firstElementChild = domElement();
normal.window.AndroidWebGLCompat.attachErrorButton(errorContainer);
assert.strictEqual(errorContainer.firstElementChild.children.length, 1);
const errorButton = errorContainer.firstElementChild.children[0];
assert.strictEqual(errorButton.id, 'view3dCompatibilityButton');
assert.strictEqual(errorButton.textContent, 'Normal mode');
assert.strictEqual(typeof errorButton.listeners.get('click'), 'function');

// The old one-loss automatic marker is discarded during migration.
const legacyLocal = storage();
legacyLocal.setItem('tncSimWebglSafeUaV1', 'old automatic decision');
const legacySession = storage();
legacySession.setItem('tncSimWebglSafeSessionUaV1', 'old automatic decision');
const migrated = environment(legacyLocal, legacySession);
assert.strictEqual(migrated.window.AndroidWebGLCompat.isSafeMode(), false);
assert.strictEqual(legacyLocal.getItem('tncSimWebglSafeUaV1'), null);
assert.strictEqual(legacySession.getItem('tncSimWebglSafeSessionUaV1'), null);

// Storage restrictions still allow the explicit button to carry mode in URL.
const urlOnly = environment(storage({failWrites:true}), storage({failWrites:true}));
assert.strictEqual(urlOnly.window.AndroidWebGLCompat.setMode(true), true);
assert.match(urlOnly.navigations[0].target, /tncWebglCompat=1/);
const urlBoot = environment(storage(), storage(), {href:urlOnly.navigations[0].target});
assert.strictEqual(urlBoot.window.AndroidWebGLCompat.isSafeMode(), true);

// Desktop previews cannot persist or enter the Android-only mode.
const preview = environment(storage(), storage(), {
  capacitor:null,
  ua:'Mozilla/5.0 Chrome/145 Safari/537.36'
});
assert.strictEqual(preview.window.AndroidWebGLCompat.isAndroidApp(), false);
assert.strictEqual(preview.window.AndroidWebGLCompat.setMode(true), false);
assert.strictEqual(preview.navigations.length, 0);
assert.strictEqual(preview.toggle.style.display, 'none');

// A failed Compatibility renderer offers Normal mode instead of auto-retrying.
const failedLocal = storage();
failedLocal.setItem('tncSimWebglCompatibilityModeV1', '1');
const failed = environment(failedLocal, storage(), {webglUnavailable:true});
const failedThree = {WebGLRenderer:OriginalRenderer};
const restoreFailed = failed.window.AndroidWebGLCompat.installRenderer(failedThree);
assert.throws(() => new failedThree.WebGLRenderer(), /WebGL1 context unavailable/);
restoreFailed();
failed.window.AndroidWebGLCompat.reportRendererFailure();
assert.match(failed.errors[0], /Try Normal mode/);
assert.match(failed.errors[0], /C15-MC0/);

// Integration order, visible controls and release markers.
assert.ok(index.indexOf('android/webgl-compat.js') < index.indexOf('android/app.js'));
assert.match(index, /id="compatModeToggle"[^>]*>Compatibility<\/button>/);
const compatibilityToggleIndex = index.indexOf('id="compatModeToggle"');
const viewAreaIndex = index.indexOf('<div class="view-area">');
assert.ok(compatibilityToggleIndex < viewAreaIndex,
  'the permanent Compatibility mode control must stay outside the WebGL view area');
assert.doesNotMatch(index.slice(viewAreaIndex), /id="compatModeToggle"/);
assert.match(index, /id="simulationSettingsPanel"[^>]*hidden/);
assert.match(render3d, /AndroidWebGLCompat\.attachErrorButton\(box\)/);
assert.match(app, /var APP_VERSION = '1\.0\.71';/);
assert.match(app, /var VX_COMPAT_MODE = !!\(window\.AndroidWebGLCompat/);
assert.match(app, /VX_RES_LEVELS = \[50, 75, 100\]/);

console.log('android-webgl-compat.test.js: manual Compatibility mode verified');
