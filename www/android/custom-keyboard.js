// custom-keyboard -- android-specific (no counterpart in the web repo).

/* Android-only custom numeric TNC keyboard (approved prototype v3).

   Layout:
     7   8   9      Q
     4   5   6      ◀
     1   2   3      ENT ▶
     0   ,   +/−    NO ENT
     ⌫   P   I      END ⌄

   The keyboard replaces the native Android soft keyboard for EVERY numeric /
   parameter interactive editor:
     - PATH FUNCTIONS guided fields (FM: L / C / CR / cycles …) — virtual values.
     - BLK FORM wizard        (from the BOX/CYL shape picker through every field).
     - Edit M function        (#mCustomInput input).
     - Cycle parameter Q line (#qPanelInput input, openQPopup).
     - Q-parameter builder    (openQParamPanel — operators/functions stay panel
                               buttons; number and value steps take keys).
   TOOL DEF is the exception: editing it opens NO keyboard (custom or native),
   only its docked picker panel in the bottom interaction area.

   Behavior (spec v3, layout revised):
     - "," writes the "." decimal form the editor expects.
     - +/− toggles the sign of the current numeric token (never appends).
     - ◀ steps back to the previous field.
     - ENT ▶ confirms the current field and advances to the next.
     - NO ENT skips the current optional field.
     - END ⌄ finishes the interactive edit AND hides the keyboard (the old
       hide-only ⌄ was merged into END).
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
    {k:'7'},{k:'8'},{k:'9'},{a:'q',t:'Q'},
    {k:'4'},{k:'5'},{k:'6'},{a:'prev',t:'◀'},
    {k:'1'},{k:'2'},{k:'3'},{a:'ent',t:'ENT ▶',cls:'ck-ent'},
    {k:'0'},{k:',',t:','},{a:'sign',t:'+/−'},{a:'noent',t:'NO<br>ENT',cls:'ck-noent'},
    {a:'backspace',t:'⌫'},{a:'p',t:'P',cls:'ck-pi'},{a:'i',t:'I',cls:'ck-pi'},{a:'end',t:'END ⌄',cls:'ck-end'}
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

  // The Q-assignment builder renders into #ctxPanel across three steps
  // (Q number → operator → value); only steps 0 and 2 expose #qpFbarVal, so
  // detect it by the QP.* onclick handlers its panel always emits.
  function qpBuilderOpen(){
    if(typeof QP==='undefined') return false;
    var cp=el('ctxPanel');
    return !!cp && /QP\.(step|op|fn)\s*=/.test(cp.innerHTML);
  }

  function anEditorActive(){
    return (typeof FM!=='undefined' && FM.active)
      || (typeof BLK!=='undefined' && BLK.active && el('blkFbarVal'))
      || !!el('mCustomInput')
      || !!el('qPanelInput')
      || qpBuilderOpen();
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

  function blurEditorNow(){
    // Unconditionally drop editor focus (TOOL DEF: no keyboard of any kind —
    // neither the custom one nor the native one that a codeEl tap would raise).
    setTimeout(function(){
      [codeEl, el('mobileInput')].forEach(function(x){ if(x){ try{ x.blur(); }catch(e){} } });
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
    // BLK wizard: active on every step. Step 0 (BOX/CYL shape picker) has no
    // #blkFbarVal — the keyboard still shows so ENT advances to the first field.
    if(typeof BLK!=='undefined' && BLK.active) return {
      kind:'input', input:el('blkFbarVal'), sign:true, digitsOnly:false,
      prev:function(){ if(typeof blkStepRel==='function') blkStepRel(-1); },
      // ENT ▶ = advance to the next field (even when editing an existing BLK);
      // on the last field blkNextStep commits. END is the explicit commit.
      ent:function(){ if(typeof blkNextStep==='function') blkNextStep(); },
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
      // In a cycle's Q-parameter list, ENT ▶ confirms and jumps to the next
      // Q line (down), ◀ to the previous (up); END just confirms and closes.
      prev:function(){ qParamNav(-1); },
      ent:function(){ qParamNav(1); },
      noent:function(){ qParamNav(1); },
      end:function(){ if(typeof qPanelConfirm==='function') qPanelConfirm(); }
    };
    // Q-parameter assignment builder (openQParamPanel): virtual QP state, its
    // operators/functions are panel buttons, so only the numeric Q-number and
    // value steps take keyboard input.
    if(qpBuilderOpen()) return {kind:'qp'};
    return null;
  }

  // ── Q builder (QP) — numeric entry on QP.num (step 0) / QP.val (step 2) ──
  function qpKey(){ return QP.step===0 ? 'num' : (QP.step===2 ? 'val' : null); }
  function qpShow(t){ var e=el('qpFbarVal'); if(e) e.textContent=QP[t]||(t==='num'?'1':'0'); }
  function qpType(ch){
    var t=qpKey(); if(!t) return;
    if(ch===',') ch='.';
    var allowed = t==='num' ? /[0-9]/ : /[0-9Qq.+\-*\/()]/;
    if(!allowed.test(ch)) return;
    if(!QP._typing){ QP[t]=(t==='num')?'':keepSign(QP[t]); QP._typing=true; }
    QP[t]=String(QP[t])+(ch==='q'?'Q':ch);
    qpShow(t);
  }
  function qpBackspace(){
    var t=qpKey(); if(!t) return;
    QP._typing=true;
    QP[t]=String(QP[t]).slice(0,-1);
    qpShow(t);
  }
  function qpSign(){
    if(QP.step!==2) return;
    QP._typing=true;
    QP.val=applyNumericSign(QP.val, String(QP.val).charAt(0)==='-' ? '+' : '-');
    qpShow('val');
  }
  function qpEnt(){
    if(QP.step<2){ QP.step++; if(typeof renderQParamPanel==='function') renderQParamPanel(); }
    else if(typeof qpInsert==='function') qpInsert();
  }
  function qpPrev(){ if(QP.step>0){ QP.step--; if(typeof renderQParamPanel==='function') renderQParamPanel(); } }

  // ── cycle Q-parameter list: confirm current line, hop to the adjacent Q line ──
  function qParamNav(dir){
    if(typeof _qPopupLine==='undefined' || _qPopupLine<0) return;
    var cur=_qPopupLine;
    if(typeof qPanelConfirm==='function') qPanelConfirm();
    if(el('qPanelInput')) return; // validation failed → popup still open, don't move
    var lines=codeEl.value.split('\n');
    var i=cur+dir;
    while(i>=0 && i<lines.length){
      if(/^\s*Q\d+\s*=/.test(lines[i])){ if(typeof openQPopup==='function') openQPopup(i); return; }
      // a non-empty, non-Q line means we've left the cycle's parameter block
      if(lines[i].trim()!=='' && !/^\s*Q\d+/.test(lines[i])) return;
      i+=dir;
    }
  }

  // ── insertion anchor + per-block defaults for guided inserts (FM) ──
  function ensureInsertAnchor(){
    // Only when there is no live editor caret (mobile: the custom keyboard has
    // blurred #code). If nothing was ever placed (lastSel still 0/0), anchor a
    // new CHF/RND/L before END PGM instead of dropping it at the program top.
    if(document.activeElement===codeEl) return;
    if(!lastSel || lastSel.start!==0 || lastSel.end!==0) return;
    var lines=codeEl.value.split('\n');
    var target=lines.length-1;
    for(var i=0;i<lines.length;i++){ if(/END PGM/i.test(lines[i])){ target=Math.max(0,i-1); break; } }
    var pos=0; for(var j=0;j<target;j++) pos+=lines[j].length+1;
    lastSel={start:pos,end:pos};
  }
  function applyInsertDefaults(label){
    if(typeof FM==='undefined' || !FM.active) return;
    var changed=false;
    if(label==='TOOL CALL'){
      FM.fields.forEach(function(f){
        if(f.p==='S' && (f.val===null||f.val===''||f.val==='0')){ f.val='10000'; changed=true; }
        if(f.p==='F' && (f.val===null||f.val==='')){ f.val='2000'; changed=true; }
      });
      // enterFieldMode auto-appends bare "M3"/"M8" after a new TOOL CALL — give
      // them the same descriptive comment a manual M insertion would add.
      var tcIdx=codeEl.value.slice(0,FM.lineStart).split('\n').length-1;
      var lines=codeEl.value.split('\n'), mEdited=false;
      for(var k=tcIdx+1;k<=tcIdx+2 && k<lines.length;k++){
        var mm=lines[k].match(/^\s*(M\d+)\s*$/);
        if(mm){
          var desc=(typeof _mDescFor==='function')?_mDescFor(mm[1]):null;
          if(desc){ lines[k]=mm[1]+' ; '+desc; mEdited=true; }
        }
      }
      if(mEdited){ codeEl.value=lines.join('\n'); changed=true; }
    }
    // A freshly inserted move's feed defaults to FAUTO instead of an empty "—".
    FM.fields.forEach(function(f){ if(f.type==='feed' && (f.val===null||f.val==='')){ f.val='AUTO'; changed=true; } });
    if(changed && typeof selectField==='function') selectField(FM.idx);
  }

  // When the first typed key replaces a field's preset value, keep any leading
  // sign so overwriting −20 with 5 stays −5 until +/− is pressed (never wipes it).
  function keepSign(val){
    var s=String(val==null?'':val);
    return (s.charAt(0)==='-'||s.charAt(0)==='+') ? s.charAt(0) : '';
  }

  // ── FM (guided field) input — virtual values on FM.fields[FM.idx] ──
  function fmField(){ return FM.active ? FM.fields[FM.idx] : null; }
  function fmType(ch){
    var f=fmField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    var patterns={coord:/[0-9.,+\-QqAaBbCc]/,num:/[0-9.,Qq]/,feed:/[0-9.QqFfAaXxUuTtOoMm]/,mfunc:/[0-9]/,mval:/[0-9]/};
    if(patterns[f.type] && !patterns[f.type].test(ch)) return;
    if(!FM.typing || f.type==='qval'){ f.val=(f.type==='qval')?'':keepSign(f.val); FM.typing=true; }
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
    var i=t.input; if(!i) return; // e.g. BLK shape-picker step — nothing to type
    if(ch===',') ch='.';
    if(t.digitsOnly){ if(!/[0-9]/.test(ch)) return; }
    if(freshInput){ i.value=keepSign(i.value); freshInput=false; }
    i.value+=ch;
    fireInput(i);
  }
  function inputBackspace(t){
    if(!t.input) return;
    freshInput=false;
    t.input.value=String(t.input.value).slice(0,-1);
    fireInput(t.input);
  }
  function inputSign(t){
    if(!t.sign || !t.input) return;
    freshInput=false;
    var cur=String(t.input.value);
    t.input.value=applyNumericSign(cur, cur.charAt(0)==='-' ? '+' : '-');
    fireInput(t.input);
  }

  function handleKey(key, action){
    var t=currentTarget();
    if(!t) return;
    if(key!==undefined && key!==null){
      if(t.kind==='fm') fmType(key);
      else if(t.kind==='qp') qpType(key);
      else inputType(t,key);
      return;
    }
    switch(action){
      case 'backspace': t.kind==='fm' ? fmBackspace() : t.kind==='qp' ? qpBackspace() : inputBackspace(t); break;
      case 'sign':      t.kind==='fm' ? fmSign()      : t.kind==='qp' ? qpSign()      : inputSign(t); break;
      case 'p': if(t.kind==='fm' && typeof switchFieldMode==='function') switchFieldMode(FM.builderKey==='P'?'L':'P'); break;
      case 'i': if(t.kind==='fm' && typeof toggleIncrementalToken==='function') toggleIncrementalToken(); break;
      // Inserting a Q reference is a deliberate edit — the next digit must
      // append to the "Q", not be treated as the first char that replaces the
      // preselected value (that wiped the Q on the first try before).
      case 'q': if(t.kind==='fm') fmQ(); else if(t.kind==='qp') qpType('Q'); else if(t.q){ freshInput=false; t.q(); } break;
      case 'prev':  t.kind==='fm' ? (typeof fieldPrev==='function'&&fieldPrev()) : t.kind==='qp' ? qpPrev() : (t.prev&&t.prev()); break;
      case 'ent':   t.kind==='fm' ? fieldNext() : t.kind==='qp' ? qpEnt() : t.ent(); break;
      case 'noent': t.kind==='fm' ? fmNoEnt()   : t.kind==='qp' ? qpEnt() : t.noent(); break;
      case 'end':   t.kind==='fm' ? exitFieldMode() : t.kind==='qp' ? (typeof qpInsert==='function'&&qpInsert()) : t.end(); break; // END ⌄ — the panel's own close wrapper also hides the keyboard
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
  // Guided insert (CHF/RND/L/TOOL CALL…): commit any in-progress edit first so
  // no half-filled line is left dangling, fix the anchor when no caret is placed,
  // and apply per-block defaults (TOOL CALL S/F, feed→FAUTO).
  var _efmOrig=window.enterFieldMode;
  if(typeof _efmOrig==='function'){
    window.enterFieldMode=function(label){
      if(typeof FM!=='undefined' && FM.active){ if(typeof exitFieldMode==='function') try{ exitFieldMode(); }catch(e){} }
      else ensureInsertAnchor();
      var r=_efmOrig.apply(this, arguments);
      applyInsertDefaults(label);
      return r;
    };
  }
  // Never raise the native keyboard for FM fields — this keyboard owns them.
  var _fmiOrig=window.focusMobileInput;
  if(typeof _fmiOrig==='function'){
    window.focusMobileInput=function(){
      if(FM.active){ blurCodeSoon(); return; }
      return _fmiOrig.apply(this, arguments);
    };
  }

  // BLK FORM wizard (renderBlkPanel runs on open and every step). Show the
  // keyboard on every step, including step 0's BOX/CYL shape picker, so ENT
  // can advance from there; only the field steps have an input to type into.
  wrap('renderBlkPanel', function(){
    if(typeof BLK!=='undefined' && BLK.active){
      var i=el('blkFbarVal');
      if(i){ i.inputMode='none'; freshInput=true; }
      show();
    } else hide(false);
  });
  // Edit M function
  wrap('openMPanel', function(){
    var i=el('mCustomInput');
    if(i){ i.inputMode='none'; freshInput=true; show(); }
  });
  // Cycle parameter Q line — show keyboard, paint the .qedit line marker and
  // scroll the edited parameter into view so it's clear which one is active.
  wrap('openQPopup', function(){
    var i=el('qPanelInput');
    if(i){
      i.inputMode='none'; freshInput=true; show();
      if(typeof updateLineNums==='function') updateLineNums();
      if(typeof _qPopupLine!=='undefined' && _qPopupLine>=0 && codeEl){
        var lh=parseFloat(getComputedStyle(codeEl).lineHeight)||20;
        var t=Math.max(0,_qPopupLine*lh - codeEl.clientHeight/2);
        codeEl.scrollTop=t; var lns=el('lineNums'); if(lns) lns.scrollTop=t;
      }
    }
  });
  // Q-parameter assignment builder — show keyboard on every step (the operator
  // step has no numeric field, but ENT must still advance it). On the first
  // step (parameter number) add a ▶ cue so it's clear entry continues.
  wrap('renderQParamPanel', function(){
    if(!qpBuilderOpen()) return;
    show();
    if(QP.step===0){
      var val=el('qpFbarVal');
      if(val && val.parentNode && !val.parentNode.querySelector('.ck-qp-cue')){
        var cue=document.createElement('span');
        cue.className='ck-qp-cue';
        cue.textContent='▶';
        cue.style.cssText='color:var(--accent);font-size:15px;margin-left:6px;font-family:var(--mono);';
        val.parentNode.insertBefore(cue, val.nextSibling);
      }
    }
  });
  // Its focus helper would raise the native keyboard on #mobileInput — the
  // custom keyboard owns QP input, so keep the native keyboard closed.
  var _qpfmOrig=window._qpFocusMobile;
  if(typeof _qpfmOrig==='function'){
    window._qpFocusMobile=function(){ if(qpBuilderOpen()){ blurCodeSoon(); return; } return _qpfmOrig.apply(this, arguments); };
  }

  // TOOL DEF exception — no keyboard at all (custom hidden AND the native one
  // that a codeEl tap would raise is blurred away), only the docked picker.
  wrap('openToolDefEdit', function(){ hide(false); blurEditorNow(); });

  // closing any editor hides the keyboard
  wrap('closeCtxPanel', function(){ hide(false); });
  // also refresh the gutter so the .qedit marker clears (closeQPopup set _qPopupLine=-1)
  wrap('closeQPopup', function(){ hide(false); if(typeof updateLineNums==='function') updateLineNums(); });
})();
