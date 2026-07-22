// custom-keyboard -- android-specific (no counterpart in the web repo).

/* Android-only custom numeric TNC keyboard (approved prototype v3).

   Layout:
     7   8   9   ⌫
     4   5   6   +/−
     1   2   3   ,
     P   I   Q   ENT
     0  NO ENT END  ⌄

   The keyboard replaces the native Android soft keyboard for EVERY numeric /
   parameter interactive editor:
     - PATH FUNCTIONS guided fields (FM: L / C / CR / cycles …) — virtual values.
     - BLK FORM wizard        (#blkFbarVal input).
     - Edit M function        (#mCustomInput input).
     - Cycle parameter Q line (#qPanelInput input, openQPopup).
   TOOL DEF is the exception: editing it opens NO keyboard, only its docked
   picker panel in the bottom interaction area.

   Behavior (spec v3):
     - "," writes the "." decimal form the editor expects.
     - +/− toggles the sign of the current numeric token (never appends).
     - ENT confirms the current field and advances.
     - NO ENT skips the current optional field.
     - END finishes the interactive edit and hides the keyboard.
     - ⌄ only hides the keyboard (edit stays active; floating ⌃ reopens it).
     - P and I are orange; P toggles polar (L↔LP), I toggles incremental,
       Q inserts a Q-parameter reference into the active numeric field.

   Interactive panels while the keyboard is up (styles.css, html.ck-open):
     - The panel slides directly above the keyboard.
     - Its ▶ button is the "→ next value" control.
     - Duplicate DONE / skip / Q controls are hidden (ENT / NO ENT / Q live on
       the keyboard). P / I / Q are also permanently removed from the keypad
       (see PI_KEYS in app.js).

   Native keyboard suppression: FM fields go through the focusMobileInput
   override; the real-input panels get inputmode="none" while the keyboard is
   shown, and this keyboard drives their edits by dispatching input events so
   each panel's own oninput/commit logic still runs. */
(function(){
  if(typeof isMobile!=='function' || !isMobile()) return;

  var kb=null, reopenBtn=null;
  // When a real-input panel (BLK/M/QPopup) first shows a field, its preset
  // value is selected; the first typed key replaces it, later keys append.
  var freshInput=false;

  var KEYS=[
    {k:'7'},{k:'8'},{k:'9'},{a:'backspace',t:'⌫'},
    {k:'4'},{k:'5'},{k:'6'},{a:'sign',t:'+/−'},
    {k:'1'},{k:'2'},{k:'3'},{k:',',t:','},
    {a:'p',t:'P',cls:'ck-pi'},{a:'i',t:'I',cls:'ck-pi'},{a:'q',t:'Q'},{a:'ent',t:'ENT',cls:'ck-ent'},
    {k:'0'},{a:'noent',t:'NO<br>ENT',cls:'ck-noent'},{a:'end',t:'END',cls:'ck-end'},{a:'close',t:'⌄',cls:'ck-close'}
  ];

  function el(id){ return document.getElementById(id); }

  function ensureBuilt(){
    if(kb) return;
    var panel=document.querySelector('.editor-panel');
    if(!panel) return;
    var html='';
    KEYS.forEach(function(key){
      if(key.k!==undefined){
        html+='<button type="button" class="ck-key" data-key="'+key.k+'">'+(key.t||key.k)+'</button>';
      } else {
        html+='<button type="button" class="ck-key ck-action '+(key.cls||'')+'" data-action="'+key.a+'">'+key.t+'</button>';
      }
    });
    kb=document.createElement('section');
    kb.id='ckKeyboard';
    kb.setAttribute('aria-label','TNC keyboard');
    kb.innerHTML=html;
    // pointerdown preventDefault: keys must never steal focus (that would pop
    // the native keyboard or blur the active field); click still fires.
    kb.addEventListener('pointerdown',function(e){ e.preventDefault(); });
    kb.addEventListener('click',onKey);
    panel.appendChild(kb);
    reopenBtn=document.createElement('button');
    reopenBtn.id='ckReopen';
    reopenBtn.type='button';
    reopenBtn.setAttribute('aria-label','Show TNC keyboard');
    reopenBtn.textContent='⌃';
    reopenBtn.addEventListener('click',function(){ if(anEditorActive()) show(); });
    document.body.appendChild(reopenBtn);
  }

  function anEditorActive(){
    return (typeof FM!=='undefined' && FM.active)
      || (typeof BLK!=='undefined' && BLK.active && el('blkFbarVal'))
      || !!el('mCustomInput')
      || !!el('qPanelInput');
  }

  function suppressNative(){
    ['blkFbarVal','mCustomInput','qPanelInput'].forEach(function(id){
      var i=el(id); if(i) i.inputMode='none';
    });
  }

  function blurCodeSoon(){
    // A tap on the code area focuses the textarea before the click handler
    // opens the editor; drop that focus so the native keyboard closes. Never
    // blur the panel inputs — they own the visible caret.
    setTimeout(function(){
      var ae=document.activeElement;
      if(anEditorActive() && ae && (ae===codeEl || ae.id==='mobileInput')){
        try{ ae.blur(); }catch(e){}
      }
    },0);
  }

  function show(){
    ensureBuilt();
    if(!kb) return;
    document.documentElement.classList.add('ck-open');
    if(reopenBtn) reopenBtn.classList.remove('show');
    suppressNative();
    blurCodeSoon();
  }
  function hide(keepEditing){
    document.documentElement.classList.remove('ck-open');
    if(reopenBtn) reopenBtn.classList.toggle('show', !!keepEditing && anEditorActive());
  }

  // ── target abstraction: which editor is currently accepting input ──
  function currentTarget(){
    if(typeof FM!=='undefined' && FM.active) return {kind:'fm'};
    var b=el('blkFbarVal');
    if(b && typeof BLK!=='undefined' && BLK.active) return {
      kind:'input', input:b, sign:true, digitsOnly:false,
      ent:function(){ if(typeof blkConfirmStep==='function') blkConfirmStep(); },
      noent:function(){ if(typeof blkStepRel==='function') blkStepRel(1); },
      end:function(){ if(typeof insertBlkForm==='function') insertBlkForm(); }
    };
    var m=el('mCustomInput');
    if(m) return {
      kind:'input', input:m, sign:false, digitsOnly:true,
      ent:function(){ if(typeof _mPanelConfirm==='function') _mPanelConfirm(); },
      noent:function(){},
      end:function(){ if(typeof _mPanelConfirm==='function') _mPanelConfirm(); }
    };
    var q=el('qPanelInput');
    if(q) return {
      kind:'input', input:q, sign:true, digitsOnly:false,
      q:function(){ if(typeof qPanelInsertQ==='function') qPanelInsertQ(); },
      ent:function(){ if(typeof qPanelConfirm==='function') qPanelConfirm(); },
      noent:function(){},
      end:function(){ if(typeof qPanelConfirm==='function') qPanelConfirm(); }
    };
    return null;
  }

  // ── FM (guided field) input — virtual values on FM.fields[FM.idx] ──
  function fmField(){ return FM.active ? FM.fields[FM.idx] : null; }
  function fmType(ch){
    var f=fmField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    var patterns={coord:/[0-9.,+\-QqAaBbCc]/,num:/[0-9.,Qq]/,feed:/[0-9.QqFfAaXxUuTtOoMm]/,mfunc:/[0-9]/,mval:/[0-9]/};
    if(patterns[f.type] && !patterns[f.type].test(ch)) return;
    if(!FM.typing || f.type==='qval'){ f.val=''; FM.typing=true; }
    f.val+=ch;
    if(f.type==='qval') f.val=f.val.replace(/q/g,'Q').replace(/[^0-9.+\-QAUTOauto]/g,'');
    else f.val=sanitizeVal(f.val,f.type);
    refreshSelection();
  }
  function fmBackspace(){
    var f=fmField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    if(f.val===null || f.val==='') return;
    f.val=String(f.val).slice(0,-1);
    if(f.val===''&&f.opt&&(f.type==='coord'||f.type==='feed')) f.val=null;
    FM.typing=true;
    refreshSelection();
  }
  function fmSign(){
    var f=fmField();
    if(!f) return;
    if(f.type==='dr'){ setFieldVal(f.val==='-'?'+':'-'); return; }
    if(!_fieldAcceptsSign(f)) return;
    var cur=String(f.val===null||f.val===undefined?'':f.val);
    _setFieldSign(f, cur.charAt(0)==='-' ? '+' : '-');
  }
  function fmQ(){
    var f=fmField();
    if(!f) return;
    if(f.type==='coord'||f.type==='num'||f.type==='feed') toggleQField();
  }
  function fmNoEnt(){
    var f=fmField();
    if(!f) return;
    if(f.opt) setFieldVal(null); // skip = leave the optional field empty
    fieldNext();
  }

  // ── real-input panels (BLK/M/QPopup) — reuse each panel's own logic by
  //    editing its input value and dispatching an input event ──
  function fireInput(i){ i.dispatchEvent(new Event('input',{bubbles:true})); }
  function inputType(t, ch){
    var i=t.input;
    if(ch===',') ch='.';
    if(t.digitsOnly){ if(!/[0-9]/.test(ch)) return; }
    if(freshInput){ i.value=''; freshInput=false; }
    i.value+=ch;
    fireInput(i);
  }
  function inputBackspace(t){
    freshInput=false;
    t.input.value=String(t.input.value).slice(0,-1);
    fireInput(t.input);
  }
  function inputSign(t){
    if(!t.sign) return;
    freshInput=false;
    var cur=String(t.input.value);
    t.input.value=applyNumericSign(cur, cur.charAt(0)==='-' ? '+' : '-');
    fireInput(t.input);
  }

  function handleKey(key, action){
    var t=currentTarget();
    if(!t) return;
    if(key!==undefined && key!==null){
      if(t.kind==='fm') fmType(key); else inputType(t,key);
      return;
    }
    switch(action){
      case 'backspace': t.kind==='fm' ? fmBackspace() : inputBackspace(t); break;
      case 'sign':      t.kind==='fm' ? fmSign()      : inputSign(t); break;
      case 'p': if(t.kind==='fm' && typeof switchFieldMode==='function') switchFieldMode(FM.builderKey==='P'?'L':'P'); break;
      case 'i': if(t.kind==='fm' && typeof toggleIncrementalToken==='function') toggleIncrementalToken(); break;
      case 'q': if(t.kind==='fm') fmQ(); else if(t.q) t.q(); break;
      case 'ent':   t.kind==='fm' ? fieldNext() : t.ent(); break;
      case 'noent': t.kind==='fm' ? fmNoEnt()   : t.noent(); break;
      case 'end':   t.kind==='fm' ? exitFieldMode() : t.end(); break; // panel's own close wrapper hides the keyboard
      case 'close': hide(true); break; // hide only — edit stays active
    }
  }
  window._ckHandleKey=handleKey; // exposed for regression tests

  function onKey(e){
    var b=e.target.closest ? e.target.closest('button.ck-key') : null;
    if(!b) return;
    handleKey(b.dataset.key, b.dataset.action);
  }

  // ── wire into every editor via the global functions (classic scripts) ──
  function wrap(name, after){
    var orig=window[name];
    if(typeof orig!=='function') return;
    window[name]=function(){
      var r=orig.apply(this, arguments);
      try{ after.apply(this, arguments); }catch(e){}
      return r;
    };
  }

  // FM (path functions / cycle builders)
  wrap('selectField', function(){ if(FM.active) show(); });
  wrap('exitFieldMode', function(){ if(!FM.active) hide(false); });
  // Never raise the native keyboard for FM fields — this keyboard owns them.
  var _fmiOrig=window.focusMobileInput;
  if(typeof _fmiOrig==='function'){
    window.focusMobileInput=function(){
      if(FM.active){ blurCodeSoon(); return; }
      return _fmiOrig.apply(this, arguments);
    };
  }

  // BLK FORM wizard (renderBlkPanel runs on open and every field step)
  wrap('renderBlkPanel', function(){
    var i=el('blkFbarVal');
    if(typeof BLK!=='undefined' && BLK.active && i){ i.inputMode='none'; freshInput=true; show(); }
    else hide(false); // shape-picker step (no field) or closed
  });
  // Edit M function
  wrap('openMPanel', function(){
    var i=el('mCustomInput');
    if(i){ i.inputMode='none'; freshInput=true; show(); }
  });
  // Cycle parameter Q line
  wrap('openQPopup', function(){
    var i=el('qPanelInput');
    if(i){ i.inputMode='none'; freshInput=true; show(); }
  });
  // TOOL DEF exception — no keyboard, only the docked picker panel
  wrap('openToolDefEdit', function(){ hide(false); });

  // closing any editor hides the keyboard
  wrap('closeCtxPanel', function(){ hide(false); });
  wrap('closeQPopup', function(){ hide(false); });
})();
