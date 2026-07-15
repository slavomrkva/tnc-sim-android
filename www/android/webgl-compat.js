// Android WebView 3D compatibility controller.
// Keep the normal renderer on healthy devices. If its context is lost during
// startup and does not recover, remember this WebView version and reload once
// with an explicit low-memory WebGL1 context.
(function(global){
  'use strict';

  var SAFE_UA_KEY = 'tncSimWebglSafeUaV1';
  var RELOAD_STATE_KEY = 'tncSimWebglReloadStateV1';
  var SWITCHED_KEY = 'tncSimWebglSwitchedV1';
  var EARLY_LOSS_WINDOW_MS = 15000;
  var RECOVERY_WAIT_MS = 2000;
  var restoredState = null;

  function userAgent(){ return (global.navigator && global.navigator.userAgent) || ''; }
  function isAndroidApp(){
    try{
      if(global.Capacitor){
        if(typeof global.Capacitor.getPlatform === 'function'
          && global.Capacitor.getPlatform() !== 'android') return false;
        if(typeof global.Capacitor.isNativePlatform === 'function'){
          return global.Capacitor.isNativePlatform();
        }
        return true;
      }
    }catch(e){}
    // Native Android WebView user-agents contain the standalone `wv` token;
    // Chrome on the same phone does not. This also covers very early bridge boot.
    return /(?:^|[;\s])wv(?:[;)\s]|$)/i.test(userAgent());
  }

  function readSafeMode(){
    if(!isAndroidApp()) return false;
    try{
      var saved = global.localStorage.getItem(SAFE_UA_KEY);
      if(saved && saved !== userAgent()){
        // Android System WebView was updated: retry the normal renderer once.
        global.localStorage.removeItem(SAFE_UA_KEY);
        return false;
      }
      return !!saved && saved === userAgent();
    }catch(e){ return false; }
  }

  var safeMode = readSafeMode();

  function rememberSafeMode(){
    try{
      global.localStorage.setItem(SAFE_UA_KEY, userAgent());
      safeMode = global.localStorage.getItem(SAFE_UA_KEY) === userAgent();
      return safeMode;
    }catch(e){ return false; }
  }

  function installRenderer(THREE){
    if(!safeMode || !THREE || !THREE.WebGLRenderer) return function(){};
    var OriginalRenderer = THREE.WebGLRenderer;
    function SafeRenderer(){
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
      if(!gl) throw new Error('Compatible WebGL1 context unavailable');
      return new OriginalRenderer({
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
    }
    SafeRenderer.prototype = OriginalRenderer.prototype;
    THREE.WebGLRenderer = SafeRenderer;
    return function(){
      if(THREE.WebGLRenderer === SafeRenderer) THREE.WebGLRenderer = OriginalRenderer;
    };
  }

  function saveReloadState(){
    try{
      var code = global.document.getElementById('code');
      var state = {
        code: code ? code.value : null,
        selectionStart: code && typeof code.selectionStart === 'number' ? code.selectionStart : 0,
        selectionEnd: code && typeof code.selectionEnd === 'number' ? code.selectionEnd : 0,
        tab: global.document.body ? global.document.body.getAttribute('data-mtab') : 'editor',
        view: typeof global.curView === 'string' ? global.curView : '3d'
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

  function watchRenderer(renderer){
    if(!isAndroidApp() || safeMode || !renderer || !renderer.domElement) return function(){};
    var canvas = renderer.domElement;
    var startedAt = global.performance.now();
    var lost = false;
    var timer = null;

    function onLost(){
      if(global.performance.now() - startedAt > EARLY_LOSS_WINDOW_MS) return;
      lost = true;
      if(timer) global.clearTimeout(timer);
      timer = global.setTimeout(function(){
        if(!lost || !rememberSafeMode()) return;
        saveReloadState();
        try{ global.sessionStorage.setItem(SWITCHED_KEY, '1'); }catch(e){}
        global.location.reload();
      }, RECOVERY_WAIT_MS);
    }

    function onRestored(){
      lost = false;
      if(timer){ global.clearTimeout(timer); timer = null; }
    }

    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);
    return function(){
      if(timer) global.clearTimeout(timer);
      canvas.removeEventListener('webglcontextlost', onLost, false);
      canvas.removeEventListener('webglcontextrestored', onRestored, false);
    };
  }

  function afterBoot(){
    if(restoredState && restoredState.tab === 'view'){
      global.setTimeout(function(){
        if(typeof global.mtabSwitch === 'function') global.mtabSwitch('view');
        if(typeof global.switchView === 'function'
          && (restoredState.view === '3d' || restoredState.view === '2d' || restoredState.view === 'tools')){
          global.switchView(restoredState.view);
        }
      }, 0);
    }
    if(safeMode){
      try{
        if(global.sessionStorage.getItem(SWITCHED_KEY) === '1'){
          global.sessionStorage.removeItem(SWITCHED_KEY);
          global.setTimeout(function(){
            if(typeof global._toast === 'function'){
              global._toast('3D compatibility mode enabled for this device.', false);
            }
          }, 0);
        }
      }catch(e){}
    }
  }

  global.AndroidWebGLCompat = {
    isSafeMode:function(){ return safeMode; },
    isAndroidApp:isAndroidApp,
    installRenderer:installRenderer,
    restoreSessionState:restoreSessionState,
    watchRenderer:watchRenderer,
    afterBoot:afterBoot,
    constants:{
      SAFE_UA_KEY:SAFE_UA_KEY,
      EARLY_LOSS_WINDOW_MS:EARLY_LOSS_WINDOW_MS,
      RECOVERY_WAIT_MS:RECOVERY_WAIT_MS
    }
  };
})(window);
