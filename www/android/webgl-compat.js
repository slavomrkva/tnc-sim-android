// Android WebView 3D compatibility controller.
// Compatibility mode is an explicit user choice. Renderer failures never
// switch modes automatically; the error panel and the persistent controls
// drawer outside WebGL expose the same manual toggle.
(function(global){
  'use strict';

  var MODE_KEY = 'tncSimWebglCompatibilityModeV1';
  var SESSION_MODE_KEY = 'tncSimWebglCompatibilitySessionV1';
  var RELOAD_STATE_KEY = 'tncSimWebglReloadStateV1';
  var SWITCHED_KEY = 'tncSimWebglSwitchedV2';
  var MODE_QUERY_KEY = 'tncWebglCompat';
  var LEGACY_SAFE_UA_KEY = 'tncSimWebglSafeUaV1';
  var LEGACY_SESSION_SAFE_UA_KEY = 'tncSimWebglSafeSessionUaV1';
  var LEGACY_SAFE_QUERY_KEY = 'tncWebglSafe';
  var restoredState = null;
  var diagnostics = {
    native:false,
    stage:'boot',
    storage:'none',
    navigation:'none'
  };

  function userAgent(){ return (global.navigator && global.navigator.userAgent) || ''; }

  function isAndroidApp(){
    try{
      if(global.Capacitor){
        var platform = typeof global.Capacitor.getPlatform === 'function'
          ? global.Capacitor.getPlatform() : '';
        if(platform === 'android') return true;
        if(typeof global.Capacitor.isNativePlatform === 'function'
          && global.Capacitor.isNativePlatform() && /Android/i.test(userAgent())) return true;
        if(platform && platform !== 'android') return false;
      }
    }catch(e){}
    return /(?:^|[;\s])wv(?:[;)\s]|$)/i.test(userAgent());
  }

  function readStorage(storage, key){
    try{ return storage ? storage.getItem(key) : null; }
    catch(e){ return null; }
  }

  function writeStorage(storage, key, value){
    try{
      if(!storage) return false;
      storage.setItem(key, value);
      return storage.getItem(key) === value;
    }catch(e){ return false; }
  }

  function removeStorage(storage, key){
    try{ if(storage) storage.removeItem(key); }catch(e){}
  }

  function cleanupLegacyAutomaticMode(){
    // APP_VERSION 1.0.53 could persist safe mode after one context loss. That
    // automatic decision must not carry into the manual-only controller.
    removeStorage(global.localStorage, LEGACY_SAFE_UA_KEY);
    removeStorage(global.sessionStorage, LEGACY_SESSION_SAFE_UA_KEY);
  }

  function modeRequestedByUrl(){
    try{
      return new global.URL(global.location.href).searchParams.get(MODE_QUERY_KEY) === '1';
    }catch(e){ return false; }
  }

  function readMode(){
    diagnostics.native = isAndroidApp();
    if(!diagnostics.native) return false;
    return readStorage(global.localStorage, MODE_KEY) === '1'
      || readStorage(global.sessionStorage, SESSION_MODE_KEY) === '1'
      || modeRequestedByUrl();
  }

  cleanupLegacyAutomaticMode();
  var compatibilityMode = readMode();

  function installRenderer(THREE){
    if(!compatibilityMode || !THREE || !THREE.WebGLRenderer) return function(){};
    var OriginalRenderer = THREE.WebGLRenderer;
    function CompatibilityRenderer(){
      diagnostics.stage = 'compatibility-context';
      var canvas = global.document.createElement('canvas');
      var attrs = {
        alpha:false,
        antialias:false,
        depth:true,
        stencil:false,
        premultipliedAlpha:true,
        preserveDrawingBuffer:false,
        powerPreference:'low-power',
        failIfMajorPerformanceCaveat:false
      };
      var gl = canvas.getContext('webgl', attrs)
        || canvas.getContext('experimental-webgl', attrs);
      if(!gl){
        diagnostics.stage = 'compatibility-context-unavailable';
        throw new Error('Compatibility WebGL1 context unavailable');
      }
      try{
        var compatible = new OriginalRenderer({
          canvas:canvas,
          context:gl,
          alpha:false,
          antialias:false,
          depth:true,
          stencil:false,
          premultipliedAlpha:true,
          preserveDrawingBuffer:false,
          powerPreference:'low-power',
          failIfMajorPerformanceCaveat:false
        });
        if(compatible && typeof compatible.setPixelRatio === 'function'){
          var originalSetPixelRatio = compatible.setPixelRatio;
          compatible.setPixelRatio = function(){
            return originalSetPixelRatio.call(compatible, 1);
          };
        }
        diagnostics.stage = 'compatibility-renderer-ready';
        return compatible;
      }catch(e){
        diagnostics.stage = 'compatibility-renderer-failed';
        throw e;
      }
    }
    CompatibilityRenderer.prototype = OriginalRenderer.prototype;
    THREE.WebGLRenderer = CompatibilityRenderer;
    return function(){
      if(THREE.WebGLRenderer === CompatibilityRenderer) THREE.WebGLRenderer = OriginalRenderer;
    };
  }

  function saveReloadState(){
    try{
      var code = global.document.getElementById('code');
      var state = {
        code:code ? code.value : null,
        selectionStart:code && typeof code.selectionStart === 'number' ? code.selectionStart : 0,
        selectionEnd:code && typeof code.selectionEnd === 'number' ? code.selectionEnd : 0,
        tab:global.document.body ? global.document.body.getAttribute('data-mtab') : 'editor',
        view:typeof global.curView === 'string' ? global.curView : '3d'
      };
      global.sessionStorage.setItem(RELOAD_STATE_KEY, JSON.stringify(state));
    }catch(e){}
  }

  function restoreSessionState(code){
    try{
      var raw = global.sessionStorage.getItem(RELOAD_STATE_KEY);
      if(!raw) return;
      global.sessionStorage.removeItem(RELOAD_STATE_KEY);
      restoredState = JSON.parse(raw);
      if(code && typeof restoredState.code === 'string'){
        code.value = restoredState.code;
        var end = code.value.length;
        code.selectionStart = Math.min(restoredState.selectionStart || 0, end);
        code.selectionEnd = Math.min(restoredState.selectionEnd || 0, end);
      }
    }catch(e){ restoredState = null; }
  }

  function buildReloadUrl(enabled){
    try{
      var url = new global.URL(global.location.href);
      url.searchParams.delete(LEGACY_SAFE_QUERY_KEY);
      if(enabled) url.searchParams.set(MODE_QUERY_KEY, '1');
      else url.searchParams.delete(MODE_QUERY_KEY);
      return url.toString();
    }catch(e){ return global.location.href; }
  }

  function setMode(enabled){
    if(!isAndroidApp()) return false;
    enabled = !!enabled;
    saveReloadState();
    removeStorage(global.localStorage, MODE_KEY);
    removeStorage(global.sessionStorage, SESSION_MODE_KEY);
    diagnostics.storage = 'none';
    if(enabled){
      if(writeStorage(global.localStorage, MODE_KEY, '1')) diagnostics.storage = 'local';
      else if(writeStorage(global.sessionStorage, SESSION_MODE_KEY, '1')) diagnostics.storage = 'session';
      else diagnostics.storage = 'url';
    }
    compatibilityMode = enabled;
    try{ global.sessionStorage.setItem(SWITCHED_KEY, enabled ? 'compatibility' : 'normal'); }catch(e){}
    diagnostics.stage = 'manual-switch';
    var target = buildReloadUrl(enabled);
    try{
      diagnostics.navigation = 'replace';
      global.location.replace(target);
    }catch(e){
      try{
        diagnostics.navigation = 'reload';
        global.location.reload();
      }catch(e2){
        diagnostics.navigation = 'failed';
        if(typeof global._toast === 'function') global._toast('Could not switch 3D mode. Please restart the app.', false);
        return false;
      }
    }
    return true;
  }

  function toggleMode(){ return setMode(!compatibilityMode); }

  function modeLabel(){ return compatibilityMode ? 'Normal mode' : 'Compatibility mode'; }

  function updateControls(){
    if(!global.document) return;
    var button = global.document.getElementById('compatModeToggle');
    if(!button) return;
    var setting = global.document.getElementById('simulationModeSetting');
    if(!isAndroidApp()){
      button.style.display = 'none';
      if(setting) setting.style.display = 'none';
      return;
    }
    button.style.display = '';
    if(setting) setting.style.display = '';
    button.textContent = 'Compatibility';
    button.setAttribute('aria-pressed', compatibilityMode ? 'true' : 'false');
    button.title = compatibilityMode
      ? 'Compatibility mode is active; restart 3D with the normal renderer'
      : 'Restart 3D in low-memory Compatibility mode';
  }

  function attachErrorButton(container){
    if(!container || !isAndroidApp() || !global.document) return;
    var old = global.document.getElementById('view3dCompatibilityButton');
    if(old && old.parentNode) old.parentNode.removeChild(old);
    var target = container.firstElementChild || container;
    var button = global.document.createElement('button');
    button.id = 'view3dCompatibilityButton';
    button.type = 'button';
    button.className = 'compat-mode-action';
    button.textContent = modeLabel();
    button.setAttribute('aria-pressed', compatibilityMode ? 'true' : 'false');
    button.addEventListener('click', toggleMode);
    target.appendChild(button);
  }

  function reportRendererFailure(){
    if(!compatibilityMode) return;
    var code = diagnostics.stage === 'compatibility-context-unavailable'
      ? 'C15-MC0' : diagnostics.stage === 'compatibility-renderer-failed'
        ? 'C15-MR0' : 'C15-MU0';
    if(typeof global.show3DError === 'function'){
      global.show3DError('Compatibility mode could not start 3D on this device. '
        + 'Try Normal mode or continue with the editor and XY view. Diagnostic ' + code + '.');
    }
  }

  function afterBoot(){
    updateControls();
    if(restoredState && restoredState.tab === 'view'){
      global.setTimeout(function(){
        if(typeof global.mtabSwitch === 'function') global.mtabSwitch('view');
        if(typeof global.switchView === 'function'
          && (restoredState.view === '3d' || restoredState.view === '2d' || restoredState.view === 'tools')){
          global.switchView(restoredState.view);
        }
      }, 0);
    }
    try{
      var switched = global.sessionStorage.getItem(SWITCHED_KEY);
      if(switched){
        global.sessionStorage.removeItem(SWITCHED_KEY);
        global.setTimeout(function(){
          if(typeof global._toast === 'function'){
            global._toast(switched === 'compatibility' ? 'Compatibility mode enabled.' : 'Normal mode enabled.', false);
          }
        }, 0);
      }
    }catch(e){}
  }

  global.AndroidWebGLCompat = {
    isSafeMode:function(){ return compatibilityMode; },
    isAndroidApp:isAndroidApp,
    setMode:setMode,
    toggleMode:toggleMode,
    modeLabel:modeLabel,
    updateControls:updateControls,
    attachErrorButton:attachErrorButton,
    diagnostics:function(){
      return {
        native:diagnostics.native,
        stage:diagnostics.stage,
        storage:diagnostics.storage,
        navigation:diagnostics.navigation
      };
    },
    installRenderer:installRenderer,
    reportRendererFailure:reportRendererFailure,
    restoreSessionState:restoreSessionState,
    afterBoot:afterBoot,
    constants:{
      MODE_KEY:MODE_KEY,
      SESSION_MODE_KEY:SESSION_MODE_KEY,
      MODE_QUERY_KEY:MODE_QUERY_KEY
    }
  };

  updateControls();
})(window);
