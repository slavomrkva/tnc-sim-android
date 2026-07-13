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
  function apply(){
    if(!bar) bar = document.querySelector('.mtab-bar');
    if(vv.height >= baseline - 2) baseline = vv.height; // no keyboard right now — keep the reference fresh
    var kbdOpen = (baseline - vv.height) > 140;
    document.documentElement.style.setProperty('--vvh', vv.height + 'px');
    document.documentElement.classList.toggle('kbd-open', kbdOpen);
    document.documentElement.classList.toggle('editing-field', kbdOpen);
  }
  vv.addEventListener('resize', apply);
  vv.addEventListener('scroll', apply);
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ baseline = vv.height; apply(); }, 300); });
  apply();
})();
