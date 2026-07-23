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
     - "," writes the "." decimal form the editor expects, except for feed
       fields, which deliberately accept whole numbers only.
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
       the keyboard). P and I are permanently removed from the keypad; Q stays
       there as the Q-assignment builder entry point (see PI_KEYS in app.js).

   Native keyboard suppression: FM fields go through the focusMobileInput
   override; the real-input panels get inputmode="none" while the keyboard is
   shown, and this keyboard drives their edits by dispatching input events so
   each panel's own oninput/commit logic still runs. Keys are enabled per
   editor/field, P/I expose selection, preset replacement preserves its sign,
   rejected commits flash, and holding backspace clears the current value. */
(function(){
  if(typeof isMobile!=='function' || !isMobile()) return;

  var kb=null, reopenBtn=null;
  var backspaceHoldTimer=null, backspaceHoldConsumed=false;
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
    kb.addEventListener('pointerdown',onPointerDown);
    kb.addEventListener('pointerup',cancelBackspaceHold);
    kb.addEventListener('pointercancel',cancelBackspaceHold);
    kb.addEventListener('pointerleave',cancelBackspaceHold);
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

  function panelOwner(){
    var cp=el('ctxPanel');
    return cp && cp.dataset ? (cp.dataset.editorOwner||'') : '';
  }

  function markPanelOwner(kind){
    var cp=el('ctxPanel');
    if(cp && cp.dataset) cp.dataset.editorOwner=kind;
  }

  function clearPanelOwner(kind){
    var cp=el('ctxPanel');
    if(!cp || !cp.dataset) return;
    if(!kind || cp.dataset.editorOwner===kind) delete cp.dataset.editorOwner;
  }

  function anEditorActive(){
    return (typeof FM!=='undefined' && FM.active)
      || (typeof BLK!=='undefined' && BLK.active)
      || !!el('mCustomInput')
      || !!el('qPanelInput')
      || !!el('toolDefPicker')
      || !!el('cyclePicker')
      || !!panelOwner()
      || qpBuilderOpen();
  }

  // The large programming keypad inserts or opens whole blocks. While any
  // block/parameter editor owns the session, every one of those actions can
  // interrupt the current edit (for example CHF while editing an L block).
  // Lock them visually and intercept synthetic/direct dispatch as well. The
  // custom TNC keyboard remains independently enabled per current field.
  function updateProgrammingKeyLock(){
    var pad=el('keypad');
    if(!pad) return;
    var locked=anEditorActive();
    var buttons=pad.querySelectorAll('button.key');
    for(var i=0;i<buttons.length;i++){
      var b=buttons[i];
      if(b.dataset.editBaseDisabled===undefined)
        b.dataset.editBaseDisabled=b.disabled?'1':'0';
      var disabled=locked||b.dataset.editBaseDisabled==='1';
      b.disabled=disabled;
      b.setAttribute('aria-disabled',disabled?'true':'false');
      b.classList.toggle('edit-locked',locked);
    }
  }
  var programmingPad=el('keypad');
  if(programmingPad){
    programmingPad.addEventListener('click',function(e){
      if(!anEditorActive()) return;
      var key=e.target&&e.target.closest?e.target.closest('button.key'):null;
      if(!key) return;
      e.preventDefault();
      if(typeof e.stopImmediatePropagation==='function') e.stopImmediatePropagation();
    },true);
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
    updateKeyStates();
    updateProgrammingKeyLock();
  }
  function hide(keepEditing){
    cancelBackspaceHold();
    backspaceHoldConsumed=false;
    document.documentElement.classList.remove('ck-open');
    if(reopenBtn) reopenBtn.classList.toggle('show', !!keepEditing && anEditorActive());
    updateProgrammingKeyLock();
  }

  // ── target abstraction: which editor is currently accepting input ──
  function currentTarget(){
    if(typeof FM!=='undefined' && FM.active) return {kind:'fm',editor:'fm'};
    // BLK wizard: active on every step. Step 0 (BOX/CYL shape picker) has no
    // #blkFbarVal — the keyboard still shows so ENT advances to the first field.
    if(typeof BLK!=='undefined' && BLK.active) return {
      kind:'input', editor:'blk', input:el('blkFbarVal'), sign:true, digitsOnly:false,
      prev:function(){ if(typeof blkStepRel==='function') blkStepRel(-1); },
      // ENT ▶ = advance to the next field (even when editing an existing BLK);
      // on the last field blkNextStep commits. END is the explicit commit.
      ent:function(){ if(typeof blkNextStep==='function') blkNextStep(); },
      noent:function(){ if(typeof blkStepRel==='function') blkStepRel(1); },
      end:function(){ if(typeof insertBlkForm==='function') insertBlkForm(); }
    };
    var m=el('mCustomInput');
    if(m) return {
      kind:'input', editor:'m', input:m, sign:false, digitsOnly:true,
      ent:function(){ if(typeof _mPanelConfirm==='function') _mPanelConfirm(); },
      noent:function(){},
      end:function(){ if(typeof _mPanelConfirm==='function') _mPanelConfirm(); }
    };
    var q=el('qPanelInput');
    if(q) return {
      kind:'input', editor:'q', input:q, sign:true, digitsOnly:false,
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
    if(qpBuilderOpen()) return {kind:'qp',editor:'qp'};
    return null;
  }

  function keepSign(val){
    var s=String(val==null?'':val);
    return (s.charAt(0)==='-'||s.charAt(0)==='+') ? s.charAt(0) : '';
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
      // An empty program row is a logical NC-block boundary. Never jump from
      // a cycle's Q list into an unrelated standalone Q assignment beyond it.
      if(lines[i].trim()==='') return;
      if(/^\s*Q\d+\s*=/.test(lines[i])){ if(typeof openQPopup==='function') openQPopup(i); return; }
      // Any non-Q line means we've left the cycle's parameter block.
      if(!/^\s*Q\d+/.test(lines[i])) return;
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
    }
    // Leave a freshly inserted positioning block's feed undefined. Like the
    // real control, an omitted F keeps the previously programmed numeric feed
    // (normally the TOOL CALL feed at the start of a contour).
    if(changed && typeof selectField==='function') selectField(FM.idx);
  }

  // ── FM (guided field) input — virtual values on FM.fields[FM.idx] ──
  function fmField(){ return FM.active ? FM.fields[FM.idx] : null; }
  function wholeFeedField(f){
    return !!f && (f.type==='feed' ||
      (typeof FM!=='undefined' && FM.builderKey==='TOOL CALL' && f.p==='F'));
  }
  function fmType(ch){
    var f=fmField();
    if(!f || f.type==='tool' || f.type==='dr' || f.type==='rc') return;
    if(wholeFeedField(f) && (ch===','||ch==='.')) return;
    var patterns={coord:/[0-9.,+\-QqAaBbCc]/,num:/[0-9.,Qq]/,feed:/[0-9QqFfAaXxUuTtOoMm]/,mfunc:/[0-9]/,mval:/[0-9]/};
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

  function keyEnabled(t,key,action){
    if(!t) return false;
    if(key!==undefined && key!==null){
      if(t.kind==='fm'){
        var f=fmField();
        if(!f || f.type==='tool'||f.type==='dr'||f.type==='rc') return false;
        if(wholeFeedField(f) && (key===','||key==='.')) return false;
        if(key===',') return f.type==='coord'||f.type==='num'||f.type==='qval';
        if(key==='.') return f.type==='coord'||f.type==='num'||f.type==='qval';
        return f.type==='coord'||f.type==='num'||f.type==='feed'||f.type==='mfunc'||f.type==='mval'||f.type==='qval';
      }
      if(t.kind==='qp') return QP.step===0 ? /[0-9]/.test(key) : QP.step===2;
      if(!t.input) return false;
      if(t.editor==='m') return /[0-9]/.test(key);
      return /[0-9,]/.test(key);
    }
    if(t.kind==='fm'){
      var ff=fmField();
      if(!ff) return false;
      if(action==='backspace') return ff.type!=='tool'&&ff.type!=='dr'&&ff.type!=='rc';
      if(action==='sign') return ff.type==='dr'||(typeof _fieldAcceptsSign==='function'&&_fieldAcceptsSign(ff));
      if(action==='q') return ff.type==='coord'||ff.type==='num'||ff.type==='feed';
      if(action==='p') return FM.builderKey==='L'||FM.builderKey==='P';
      if(action==='i') return typeof fieldAllowsIncremental==='function' &&
        fieldAllowsIncremental(FM.builderKey,ff);
      if(action==='prev') return FM.idx>0;
      if(action==='noent') return !!ff.opt;
      return action==='ent'||action==='end';
    }
    if(t.kind==='qp'){
      if(action==='backspace') return QP.step===0||QP.step===2;
      if(action==='sign'||action==='q') return QP.step===2;
      if(action==='prev') return QP.step>0;
      return action==='ent'||action==='noent'||action==='end';
    }
    if(t.editor==='m'){
      return action==='backspace'||action==='ent'||action==='end';
    }
    if(t.editor==='blk'){
      if(action==='backspace'||action==='sign') return !!t.input;
      if(action==='prev') return typeof BLK!=='undefined'&&BLK.step>1;
      return action==='ent'||action==='noent'||action==='end';
    }
    if(t.editor==='q'){
      if(action==='backspace'||action==='sign'||action==='q') return !!t.input;
      return action==='prev'||action==='ent'||action==='noent'||action==='end';
    }
    return false;
  }

  function updateKeyStates(){
    if(!kb) return;
    var t=currentTarget();
    var buttons=kb.querySelectorAll('button.ck-key');
    for(var i=0;i<buttons.length;i++){
      var b=buttons[i], key=b.dataset.key, action=b.dataset.action;
      var enabled=keyEnabled(t,key,action);
      b.disabled=!enabled;
      b.setAttribute('aria-disabled',enabled?'false':'true');
      var selected =
        (action==='p' && t && t.kind==='fm' && FM.builderKey==='P') ||
        (action==='i' && t && t.kind==='fm' && !!fmField() && !!fmField().incr);
      b.classList.toggle('ck-selected',!!selected);
      if(action==='p'||action==='i') b.setAttribute('aria-pressed',selected?'true':'false');
    }
  }

  function flashInvalid(input,action){
    if(!input || !input.classList) return;
    input.classList.remove('ck-invalid');
    input.classList.add('ck-invalid');
    var actionKey=null;
    if(kb){
      var buttons=kb.querySelectorAll('button.ck-key');
      for(var i=0;i<buttons.length;i++){
        if(buttons[i].dataset.action===action){ actionKey=buttons[i]; break; }
      }
    }
    if(actionKey) actionKey.classList.add('ck-invalid');
    setTimeout(function(){
      if(input.classList) input.classList.remove('ck-invalid');
      if(actionKey && actionKey.classList) actionKey.classList.remove('ck-invalid');
    },360);
  }

  function clearCurrentValue(){
    var t=currentTarget();
    if(!t || !keyEnabled(t,null,'backspace')) return;
    if(t.kind==='fm'){
      var f=fmField();
      f.val=(f.opt&&(f.type==='coord'||f.type==='feed'))?null:'';
      FM.typing=true;
      refreshSelection();
    } else if(t.kind==='qp'){
      var qpk=qpKey();
      if(!qpk) return;
      QP[qpk]='';
      QP._typing=true;
      qpShow(qpk);
    } else if(t.input){
      freshInput=false;
      t.input.value='';
      fireInput(t.input);
    }
  }

  function cancelBackspaceHold(){
    if(backspaceHoldTimer!==null){
      clearTimeout(backspaceHoldTimer);
      backspaceHoldTimer=null;
    }
  }

  function onPointerDown(e){
    e.preventDefault();
    var b=e.target.closest ? e.target.closest('button.ck-key') : null;
    if(!b || b.disabled || b.dataset.action!=='backspace') return;
    cancelBackspaceHold();
    backspaceHoldConsumed=false;
    backspaceHoldTimer=setTimeout(function(){
      backspaceHoldTimer=null;
      if(b.disabled) return;
      clearCurrentValue();
      backspaceHoldConsumed=true;
      b.classList.add('ck-held');
      setTimeout(function(){ b.classList.remove('ck-held'); },160);
      updateKeyStates();
    },550);
  }

  function handleKey(key, action){
    var t=currentTarget();
    if(!t) return;
    if(!keyEnabled(t,key,action)){ updateKeyStates(); return; }
    var commitInput=(action==='ent'||action==='end') && t.kind==='input' &&
      (t.editor==='m'||t.editor==='q') ? t.input : null;
    if(key!==undefined && key!==null){
      if(t.kind==='fm') fmType(key);
      else if(t.kind==='qp') qpType(key);
      else inputType(t,key);
      updateKeyStates();
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
    if(commitInput){
      var after=currentTarget();
      if(after && after.kind==='input' && after.input===commitInput) flashInvalid(commitInput,action);
    }
    updateKeyStates();
  }
  window._ckHandleKey=handleKey; // exposed for regression tests

  function onKey(e){
    var b=e.target.closest ? e.target.closest('button.ck-key') : null;
    if(!b || b.disabled) return;
    if(b.dataset.action==='backspace' && backspaceHoldConsumed){
      backspaceHoldConsumed=false;
      return;
    }
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

  function wrapBefore(name, before){
    var orig=window[name];
    if(typeof orig!=='function') return;
    window[name]=function(){
      before.apply(this, arguments);
      return orig.apply(this, arguments);
    };
  }

  // A real-input panel must advertise inputmode=none before its synchronous
  // focus request. Applying it only after renderBlkPanel/openQPopup returns is
  // too late on WebViews that decide which IME to show at focus time.
  function suppressNativeBeforeFocus(name){
    var orig=window[name];
    if(typeof orig!=='function') return;
    window[name]=function(){
      var focusOrig=window._focusEditorControl;
      if(typeof focusOrig!=='function') return orig.apply(this, arguments);
      window._focusEditorControl=function(input){
        if(input) input.inputMode='none';
        return focusOrig.apply(this, arguments);
      };
      try{ return orig.apply(this, arguments); }
      finally{ window._focusEditorControl=focusOrig; }
    };
  }

  // All parameter editors share one ctx panel and one custom keyboard. Close
  // every competing owner before a new one opens; currentTarget() must never
  // have to resolve two simultaneously active editors by priority.
  function prepareOwner(kind){
    if(kind!=='fm' && typeof FM!=='undefined' && FM.active &&
       typeof exitFieldMode==='function') exitFieldMode(true);
    if(kind!=='q' && el('qPanelInput') && typeof closeQPopup==='function'){
      closeQPopup();
    }
    var competingCtx =
      (kind!=='blk' && typeof BLK!=='undefined' && BLK.active) ||
      (kind!=='m' && !!el('mCustomInput')) ||
      (kind!=='qp' && qpBuilderOpen()) ||
      (!!panelOwner() && panelOwner()!==kind);
    if(competingCtx && typeof closeCtxPanel==='function') closeCtxPanel();
  }

  // Lifecycle operations that replace or structurally change the program must
  // never leave a panel holding stale line offsets. This is also used when the
  // user taps back into the code while another editor owns the session.
  function endAllEditorInput(options){
    options=options||{};
    cancelBackspaceHold();
    if(typeof FM!=='undefined' && FM.active &&
       typeof exitFieldMode==='function') exitFieldMode(true);
    if(typeof _qPopupLine!=='undefined' && _qPopupLine>=0 &&
       typeof closeQPopup==='function') closeQPopup();
    var hasCtxOwner =
      (typeof BLK!=='undefined' && BLK.active) ||
      !!el('mCustomInput') || !!el('toolDefPicker') || !!el('cyclePicker') ||
      qpBuilderOpen() || !!panelOwner();
    if(hasCtxOwner && typeof closeCtxPanel==='function') closeCtxPanel();
    clearPanelOwner();
    hide(false);
    if(typeof _cancelMobileFocus==='function') _cancelMobileFocus(!options.keepCodeFocus);
    if(!options.keepCodeFocus){
      try{
        if(document.activeElement && document.activeElement.blur)
          document.activeElement.blur();
      }catch(e){}
    }
    updateProgrammingKeyLock();
  }
  window._endAllEditorInput=endAllEditorInput;

  // FM (path functions / cycle builders)
  wrap('selectField', function(){ if(FM.active) show(); });
  wrap('exitFieldMode', function(){ if(!FM.active) hide(false); });
  // Guided insert (CHF/RND/L/TOOL CALL…): commit any in-progress edit first so
  // no half-filled line is left dangling, fix the anchor when no caret is placed,
  // and apply per-block defaults (TOOL CALL S/F only).
  var _efmOrig=window.enterFieldMode;
  if(typeof _efmOrig==='function'){
    window.enterFieldMode=function(label){
      prepareOwner('fm');
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
  wrapBefore('openBlkFormPanel', function(){ prepareOwner('blk'); });
  suppressNativeBeforeFocus('renderBlkPanel');
  wrap('renderBlkPanel', function(){
    if(typeof BLK!=='undefined' && BLK.active){
      markPanelOwner('blk');
      var i=el('blkFbarVal');
      if(i){ i.inputMode='none'; freshInput=true; }
      show();
    } else hide(false);
  });
  // Edit M function
  wrapBefore('openMPanel', function(){ prepareOwner('m'); });
  wrap('openMPanel', function(){
    markPanelOwner('m');
    var i=el('mCustomInput');
    if(i){ i.inputMode='none'; freshInput=true; show(); }
  });
  // Cycle parameter Q line
  wrapBefore('openQPopup', function(){ prepareOwner('q'); });
  suppressNativeBeforeFocus('openQPopup');
  wrap('openQPopup', function(){
    markPanelOwner('q');
    var i=el('qPanelInput');
    if(i){ i.inputMode='none'; freshInput=true; show(); }
  });
  // Q-parameter assignment builder — show keyboard on every step (the operator
  // step has no numeric field, but ENT must still advance it). On the first
  // step (parameter number) add a ▶ cue so it's clear entry continues.
  wrapBefore('openQParamPanel', function(){ prepareOwner('qp'); });
  wrap('renderQParamPanel', function(){
    if(!qpBuilderOpen()) return;
    markPanelOwner('qp');
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
  wrapBefore('insertToolDef', function(){ prepareOwner('tool'); });
  wrap('insertToolDef', function(){ markPanelOwner('tool'); hide(false); blurEditorNow(); });
  wrapBefore('openToolDefEdit', function(){ prepareOwner('tool'); });
  wrap('openToolDefEdit', function(){ markPanelOwner('tool'); hide(false); blurEditorNow(); });
  // Cycle selection is also an exclusive docked panel. It takes no numeric
  // keyboard input, but whole-block programming keys stay locked until close.
  wrapBefore('openCyclePicker', function(){ prepareOwner('cycle'); });
  wrap('openCyclePicker', function(){ markPanelOwner('cycle'); hide(false); blurEditorNow(); });

  // closing any editor hides the keyboard
  wrap('closeCtxPanel', function(){ clearPanelOwner(); hide(false); });
  wrap('closeQPopup', function(){ clearPanelOwner('q'); hide(false); });
})();
