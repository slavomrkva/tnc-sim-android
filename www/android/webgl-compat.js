// Android WebView 3D compatibility controller.
// Keep the normal renderer on healthy devices. If its context is lost while
// the app is visible and does not recover, remember this WebView version
// and reload once with an explicit low-memory WebGL1 context.
(function(global){
  'use strict';

  var SAFE_UA_KEY = 'tncSimWebglSafeUaV1';
  var SESSION_SAFE_UA_KEY = 'tncSimWebglSafeSessionUaV1';
  var RELOAD_STATE_KEY = 'tncSimWebglReloadStateV1';
  var SWITCHED_KEY = 'tncSimWebglSwitchedV1';
  var SAFE_QUERY_KEY = 'tncWebglSafe';
  var RECOVERY_WAIT_MS = 2000;
  var RELOAD_WATCHDOG_MS = 1500;
  var restoredState = null;
  var diagnostics = {
    native:false,
    attached:false,
    loss:false,
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
        // getPlatform() is the authoritative Capacitor signal. Do not reject a
        // real Android WebView merely because isNativePlatform() is temporarily
        // false while the bridge finishes booting.
        if(platform === 'android') return true;
        if(typeof global.Capacitor.isNativePlatform === 'function'
          && global.Capacitor.isNativePlatform() && /Android/i.test(userAgent())) return true;
        if(platform && platform !== 'android') return false;
      }
    }catch(e){}
    // Native Android WebView user-agents contain the standalone `wv` token;
    // Chrome on the same phone does not. This also covers very early bridge boot.
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

  function safeRequestedByUrl(){
    try{
      return new global.URL(global.location.href).searchParams.get(SAFE_QUERY_KEY) === '1';
    }catch(e){ return false; }
  }

  function buildSafeReloadUrl(){
    try{
      var url = new global.URL(global.location.href);
      url.searchParams.set(SAFE_QUERY_KEY, '1');
      return url.toString();
    }catch(e){ return global.location.href; }
  }

  function readSafeMode(){
    diagnostics.native = isAndroidApp();
    if(!diagnostics.native) return false;
    var ua = userAgent();
    var saved = readStorage(global.localStorage, SAFE_UA_KEY)
      || readStorage(global.sessionStorage, SESSION_SAFE_UA_KEY);
    if(saved && saved !== ua){
      // Android System WebView was updated: retry the normal renderer once.
      removeStorage(global.localStorage, SAFE_UA_KEY);
      removeStorage(global.sessionStorage, SESSION_SAFE_UA_KEY);
      return false;
    }
    return (!!saved && saved === ua) || safeRequestedByUrl();
  }

  var safeMode = readSafeMode();

  function rememberSafeMode(){
    var ua = userAgent();
    if(writeStorage(global.localStorage, SAFE_UA_KEY, ua)) diagnostics.storage = 'local';
    else if(writeStorage(global.sessionStorage, SESSION_SAFE_UA_KEY, ua)) diagnostics.storage = 'session';
    else diagnostics.storage = 'url';
    // The reload URL is an independent one-shot carrier when WebView storage is
    // unavailable, so recovery must not silently stop on a failed localStorage.
    safeMode = true;
    return true;
  }

  function installRenderer(THREE){
    if(!safeMode || !THREE || !THREE.WebGLRenderer) return function(){};
    var OriginalRenderer = THREE.WebGLRenderer;
    function SafeRenderer(){
      diagnostics.stage = 'safe-context';
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
        diagnostics.stage = 'safe-context-unavailable';
        throw new Error('Compatible WebGL1 context unavailable');
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
        // init3D normally requests up to 1.5 DPR. Safe mode stays at DPR 1 for
        // the renderer lifetime; clamping the first request is essential too,
        // changing to DPR 1 only after scene construction already allocates a
        // large backing store and immediately reallocates it on fragile Mali.
        if(compatible && typeof compatible.setPixelRatio === 'function'){
          var originalSetPixelRatio = compatible.setPixelRatio;
          compatible.setPixelRatio = function(){
            return originalSetPixelRatio.call(compatible, 1);
          };
        }
        diagnostics.stage = 'safe-renderer-ready';
        return compatible;
      }catch(e){
        diagnostics.stage = 'safe-renderer-failed';
        throw e;
      }
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
    diagnostics.native = isAndroidApp();
    if(!diagnostics.native || safeMode || !renderer || !renderer.domElement) return function(){};
    var canvas = renderer.domElement;
    var lost = false;
    var timer = null;
    var watchdog = null;

    function isHidden(){
      return !!(global.document && (global.document.hidden
        || global.document.visibilityState === 'hidden'));
    }

    function diagnosticCode(){
      return 'C15-N' + (diagnostics.native ? '1' : '0')
        + 'A' + (diagnostics.attached ? '1' : '0')
        + 'L' + (diagnostics.loss ? '1' : '0')
        + 'S' + diagnostics.storage.charAt(0).toUpperCase()
        + 'R' + diagnostics.navigation.charAt(0).toUpperCase();
    }

    function showNavigationFailure(){
      diagnostics.stage = 'navigation-failed';
      if(typeof global.show3DError === 'function'){
        global.show3DError('3D compatibility mode could not restart automatically. '
          + 'Please send diagnostic ' + diagnosticCode() + '. The editor and lessons keep working.');
      }
    }

    function navigateToSafeMode(){
      saveReloadState();
      rememberSafeMode();
      try{ global.sessionStorage.setItem(SWITCHED_KEY, '1'); }catch(e){}
      diagnostics.stage = 'navigation';
      var target = buildSafeReloadUrl();
      try{
        diagnostics.navigation = 'replace';
        global.location.replace(target);
      }catch(e){
        try{
          diagnostics.navigation = 'reload';
          global.location.reload();
        }catch(e2){
          diagnostics.navigation = 'failed';
          showNavigationFailure();
          return;
        }
      }
      watchdog = global.setTimeout(showNavigationFailure, RELOAD_WATCHDOG_MS);
    }

    function scheduleSwitch(){
      if(!lost || isHidden()){
        diagnostics.stage = lost ? 'waiting-visible' : 'restored';
        return;
      }
      if(timer) global.clearTimeout(timer);
      diagnostics.stage = 'waiting-recovery';
      timer = global.setTimeout(function(){
        timer = null;
        if(!lost) return;
        if(isHidden()){
          diagnostics.stage = 'waiting-visible';
          return;
        }
        navigateToSafeMode();
      }, RECOVERY_WAIT_MS);
    }

    function onLost(event){
      // The shared renderer listener also does this, but the Android recovery
      // controller must remain correct if module order changes in the future.
      if(event && typeof event.preventDefault === 'function') event.preventDefault();
      lost = true;
      diagnostics.loss = true;
      scheduleSwitch();
    }

    function onRestored(){
      lost = false;
      diagnostics.loss = false;
      diagnostics.stage = 'restored';
      if(timer){ global.clearTimeout(timer); timer = null; }
    }

    function onVisibilityChange(){
      if(lost && !isHidden()) scheduleSwitch();
    }

    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);
    if(global.document && global.document.addEventListener){
      global.document.addEventListener('visibilitychange', onVisibilityChange, false);
    }
    diagnostics.attached = true;
    diagnostics.stage = 'watching';
    return function(){
      if(timer) global.clearTimeout(timer);
      if(watchdog) global.clearTimeout(watchdog);
      canvas.removeEventListener('webglcontextlost', onLost, false);
      canvas.removeEventListener('webglcontextrestored', onRestored, false);
      if(global.document && global.document.removeEventListener){
        global.document.removeEventListener('visibilitychange', onVisibilityChange, false);
      }
    };
  }

  function reportRendererFailure(){
    if(!safeMode) return;
    var code = diagnostics.stage === 'safe-context-unavailable'
      ? 'C15-SC0' : diagnostics.stage === 'safe-renderer-failed'
        ? 'C15-SR0' : 'C15-SU0';
    if(typeof global.show3DError === 'function'){
      global.show3DError('3D compatibility renderer could not start on this device. '
        + 'Please send diagnostic ' + code + '. The editor, XY view and lessons keep working.');
    }
    if(typeof global._toast === 'function'){
      global._toast('3D compatibility test failed: ' + code, false);
    }
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
    diagnostics:function(){
      return {
        native:diagnostics.native,
        attached:diagnostics.attached,
        loss:diagnostics.loss,
        stage:diagnostics.stage,
        storage:diagnostics.storage,
        navigation:diagnostics.navigation
      };
    },
    installRenderer:installRenderer,
    reportRendererFailure:reportRendererFailure,
    restoreSessionState:restoreSessionState,
    watchRenderer:watchRenderer,
    afterBoot:afterBoot,
    constants:{
      SAFE_UA_KEY:SAFE_UA_KEY,
      SESSION_SAFE_UA_KEY:SESSION_SAFE_UA_KEY,
      RECOVERY_WAIT_MS:RECOVERY_WAIT_MS,
      RELOAD_WATCHDOG_MS:RELOAD_WATCHDOG_MS
    }
  };
})(window);
