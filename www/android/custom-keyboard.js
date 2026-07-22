// custom-keyboard -- android-specific (no counterpart in the web repo).

/* Android-only custom numeric TNC keyboard (approved prototype v2).
   While guided field editing (FM) is active, this on-screen keyboard replaces
   the native Android soft keyboard entirely:

     7   8   9   ⌫
     4   5   6   +/−
     1   2   3   ,
     P   I   Q   ENT
     0  NO ENT END  ⌄

   - Digits and the decimal comma feed the active FM field through the same
     sanitize pipeline the hidden #mobileInput used, so "," writes the "."
     decimal form the editor expects.
   - +/− toggles the sign of the active value (never appends a character).
   - ENT confirms the active field and advances; NO ENT skips the active
     optional field; END commits the line and exits interactive editing.
   - ⌄ only hides the keyboard (edit stays active, floating ⌃ reopens it).
   - While the keyboard is shown, `html.ck-open` hides the duplicate P / I /
     Q / ENT / NO ENT controls in the keypad and interactive panel and slides
     the panel down so it sits directly above the keyboard (styles.css).
   The native keyboard is suppressed by overriding focusMobileInput() during
   FM — never focus #mobileInput while FM is active or both keyboards show. */
(function(){
  if(typeof isMobile!=='function' || !isMobile()) return;

  var kb=null, reopenBtn=null;

  var KEYS=[
    {k:'7'},{k:'8'},{k:'9'},{a:'backspace',t:'⌫'},
    {k:'4'},{k:'5'},{k:'6'},{a:'sign',t:'+/−'},
    {k:'1'},{k:'2'},{k:'3'},{k:',',t:','},
    {a:'p',t:'P',cls:'ck-pi'},{a:'i',t:'I',cls:'ck-pi'},{a:'q',t:'Q'},{a:'ent',t:'ENT',cls:'ck-ent'},
    {k:'0'},{a:'noent',t:'NO<br>ENT',cls:'ck-noent'},{a:'end',t:'END',cls:'ck-end'},{a:'close',t:'⌄',cls:'ck-close'}
  ];

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
    // the native keyboard or blur the editor mid-edit); click still fires.
    kb.addEventListener('pointerdown',function(e){ e.preventDefault(); });
    kb.addEventListener('click',onKey);
    panel.appendChild(kb);
    reopenBtn=document.createElement('button');
    reopenBtn.id='ckReopen';
    reopenBtn.type='button';
    reopenBtn.setAttribute('aria-label','Show TNC keyboard');
    reopenBtn.textContent='⌃';
    reopenBtn.addEventListener('click',function(){ if(FM.active) show(); });
    document.body.appendChild(reopenBtn);
  }

  function blurEditorSoon(){
    // A tap on the code area focuses the textarea before the click handler
    // enters field mode; drop that focus so the native keyboard closes.
    setTimeout(function(){
      var ae=document.activeElement;
      if(FM.active && ae && (ae===codeEl || ae.id==='mobileInput')){
        try{ ae.blur(); }catch(e){}
      }
    },0);
  }

  function show(){
    ensureBuilt();
    if(!kb) return;
    document.documentElement.classList.add('ck-open');
    if(reopenBtn) reopenBtn.classList.remove('show');
    blurEditorSoon();
  }
  function hide(keepEditing){
    document.documentElement.classList.remove('ck-open');
    if(reopenBtn) reopenBtn.classList.toggle('show', !!keepEditing && FM.active);
  }

  function activeField(){ return FM.active ? FM.fields[FM.idx] : null; }

  // Same per-character pipeline the hidden #mobileInput input handler uses,
  // so typed values sanitize identically (incl. "," -> "." for coord/num).
  function typeChar(ch){
    var f=activeField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    var patterns={coord:/[0-9.,+\-QqAaBbCc]/,num:/[0-9.,Qq]/,feed:/[0-9.QqFfAaXxUuTtOoMm]/,mfunc:/[0-9]/,mval:/[0-9]/};
    if(patterns[f.type] && !patterns[f.type].test(ch)) return;
    if(!FM.typing || f.type==='qval'){ f.val=''; FM.typing=true; }
    f.val+=ch;
    if(f.type==='qval') f.val=f.val.replace(/q/g,'Q').replace(/[^0-9.+\-QAUTOauto]/g,'');
    else f.val=sanitizeVal(f.val,f.type);
    refreshSelection();
  }

  function doBackspace(){
    var f=activeField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    if(f.val===null || f.val==='') return;
    f.val=String(f.val).slice(0,-1);
    if(f.val===''&&f.opt&&(f.type==='coord'||f.type==='feed')) f.val=null;
    FM.typing=true;
    refreshSelection();
  }

  function toggleSign(){
    var f=activeField();
    if(!f) return;
    if(f.type==='dr'){ setFieldVal(f.val==='-'?'+':'-'); return; }
    if(!_fieldAcceptsSign(f)) return;
    var cur=String(f.val===null||f.val===undefined?'':f.val);
    _setFieldSign(f, cur.charAt(0)==='-' ? '+' : '-');
  }

  function qRef(){
    var f=activeField();
    if(!f) return;
    if(f.type==='coord'||f.type==='num'||f.type==='feed') toggleQField();
  }

  function noEnt(){
    var f=activeField();
    if(!f) return;
    if(f.opt) setFieldVal(null); // skip = leave the optional field empty
    fieldNext();
  }

  function handleKey(key,action){
    if(!FM.active) return;
    if(key!==undefined && key!==null){ typeChar(key); return; }
    switch(action){
      case 'backspace': doBackspace(); break;
      case 'sign': toggleSign(); break;
      case 'p': switchFieldMode(FM.builderKey==='P'?'L':'P'); break;
      case 'i': toggleIncrementalToken(); break;
      case 'q': qRef(); break;
      case 'ent': fieldNext(); break;
      case 'noent': noEnt(); break;
      case 'end': exitFieldMode(); break; // exitFieldMode wrapper hides the keyboard
      case 'close': hide(true); break;    // hide only — edit stays active
    }
  }
  window._ckHandleKey=handleKey; // exposed for regression tests

  function onKey(e){
    var b=e.target.closest ? e.target.closest('button.ck-key') : null;
    if(!b) return;
    handleKey(b.dataset.key, b.dataset.action);
  }

  // ── wire into field mode via the global functions (classic scripts) ──
  var _sfOrig=window.selectField;
  window.selectField=function(i){
    _sfOrig(i);
    if(FM.active) show();
  };
  var _efOrig=window.exitFieldMode;
  window.exitFieldMode=function(keepCaret){
    _efOrig(keepCaret);
    if(!FM.active) hide(false);
  };
  // Never raise the native keyboard for FM fields — this keyboard owns them.
  var _fmiOrig=window.focusMobileInput;
  window.focusMobileInput=function(){
    if(FM.active){ blurEditorSoon(); return; }
    _fmiOrig();
  };
})();
