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
   2. focus/blur on the hidden #mobileInput: focus state does not reliably
      describe whether the Android soft keyboard is actually visible.
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
  var keyboardOpen = false;
  function apply(){
    if(!bar) bar = document.querySelector('.mtab-bar');
    if(!keyboardOpen && vv.height >= baseline - 2) baseline = vv.height;
    var drop = baseline - vv.height;
    if(!keyboardOpen && drop > 140) keyboardOpen = true;
    else if(keyboardOpen && drop < 80) keyboardOpen = false;
    var kbdOpen = keyboardOpen;
    document.documentElement.style.setProperty('--vvh', vv.height + 'px');
    document.documentElement.classList.toggle('kbd-open', kbdOpen);
    document.documentElement.classList.toggle('editing-field', kbdOpen);
  }
  vv.addEventListener('resize', apply);
  vv.addEventListener('scroll', apply);
  window.addEventListener('orientationchange', function(){
    keyboardOpen = false;
    setTimeout(function(){ baseline = vv.height; apply(); }, 300);
  });
  apply();
})();
