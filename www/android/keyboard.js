// keyboard -- android-specific (diverged from or absent in the other repo).

/* Hide the bottom mobile tab bar (and pin the true visible viewport) while the
   on-screen keyboard is actually covering the screen.
   Detected by comparing visualViewport.height against a REMEMBERED "no
   keyboard" baseline — NOT against the live window.innerHeight. Two earlier
   approaches were tried and both failed:
   1. offset = window.innerHeight - visualViewport.height: reads ~0 forever
      inside the Capacitor WebView, because it resizes window.innerHeight
      together with the keyboard, so the two live values never actually
      diverge.
   2. focus/blur on the hidden #mobileInput: this app deliberately keeps that
      input focused after the on-screen keyboard is dismissed (see the "keep
      mobileInput focused when FM is active" blur handler, so the next quick
      edit doesn't need a re-tap) — so blur does not reliably fire when the
      keyboard actually closes, leaving the bar permanently hidden and the
      app stuck (confirmed on a real device).
   This approach avoids both problems: `baseline` is captured once (and
   silently re-synced any time the viewport is at least as tall as it —
   i.e. whenever we're confident no keyboard is covering anything, including
   after rotation), so the keyboard's shrink amount is always measured
   against a stable reference instead of two numbers that move together. */
(function(){
  if(!window.visualViewport) return;
  var vv = window.visualViewport;
  var bar = null;
  var baseline = vv.height;

  /* =====================================================================
     TEMPORARY on-device DEBUG HUD — added 1.0.14 to finally get real
     numbers off the device for the long-standing "bottom bar jumps/black
     gap above keyboard" bug (this bug is invisible in browser preview, so
     we've been fixing blind — see TODO.md / NOTES rule #7). It only READS
     state and paints an overlay; it never touches the kbd-open /
     editing-field classes (rule #7: only one mechanism drives those).
     REMOVE this whole block once the bug is diagnosed. Flip DBG to disable.
     ===================================================================== */
  var DBG = true, hud = null, maxDiff = 0, raf = 0, ticks = 0;
  function paint(){
    if(!DBG) return;
    if(!hud){
      if(!document.body) return;
      hud = document.createElement('div');
      hud.id = '_kbHud';
      hud.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;'
        + 'background:rgba(0,0,0,.82);color:#0f0;font:11px/1.35 monospace;'
        + 'padding:4px 7px;white-space:pre;pointer-events:none;'
        + 'border-bottom-right-radius:6px;';
      document.body.appendChild(hud);
    }
    if(!bar) bar = document.querySelector('.mtab-bar');
    var diff = Math.round(baseline - vv.height);
    if(diff > maxDiff) maxDiff = diff;
    var kbdOpen = diff > 140;
    var cls = document.documentElement.classList;
    var br = bar ? bar.getBoundingClientRect() : null;
    var cs = bar ? getComputedStyle(bar).transform : '';
    hud.textContent =
        'base ' + Math.round(baseline) + '   vvh ' + Math.round(vv.height) + '\n'
      + 'innerH ' + window.innerHeight + '   offT ' + Math.round(vv.offsetTop) + '\n'
      + 'diff ' + diff + '   maxDiff ' + maxDiff + '\n'
      + 'kbdOpen ' + kbdOpen
        + '   cls ' + (cls.contains('kbd-open') ? 'K' : '-') + (cls.contains('editing-field') ? 'E' : '-') + '\n'
      + 'tab ' + document.body.getAttribute('data-mtab') + '\n'
      + 'barTop ' + (br ? Math.round(br.top) : '—') + '  barBot ' + (br ? Math.round(br.bottom) : '—') + '\n'
      + 'xform ' + (cs && cs !== 'none' ? cs.replace(/matrix\([^)]*\)/, function(m){ return m.length > 24 ? '…' + m.slice(-14) : m; }) : 'none');
  }
  // Sample for a short while after each change so the HUD captures the
  // transient frames of the keyboard open/close animation, not just the
  // settled value.
  function sample(){ paint(); if(++ticks < 60){ raf = requestAnimationFrame(sample); } else { raf = 0; } }
  function kickSample(){ ticks = 0; if(!raf) raf = requestAnimationFrame(sample); }
  /* ============================ end DEBUG HUD ============================ */

  function apply(){
    if(!bar) bar = document.querySelector('.mtab-bar');
    if(vv.height >= baseline - 2) baseline = vv.height; // no keyboard right now — keep the reference fresh
    var kbdOpen = (baseline - vv.height) > 140;
    document.documentElement.style.setProperty('--vvh', vv.height + 'px');
    document.documentElement.classList.toggle('kbd-open', kbdOpen);
    document.documentElement.classList.toggle('editing-field', kbdOpen);
    kickSample(); // DEBUG: keep the HUD live through the animation
  }
  vv.addEventListener('resize', apply);
  vv.addEventListener('scroll', apply);
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseline = vv.height; apply(); }, 300); });
  apply();
})();
