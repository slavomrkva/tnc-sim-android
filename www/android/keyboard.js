// keyboard -- android-specific (diverged from or absent in the other repo).

/* Hide the bottom mobile tab bar (and pin the true visible viewport) while the
   on-screen keyboard is actually covering the screen.

   Uses the native @capacitor/keyboard plugin's keyboardDidShow/keyboardDidHide
   events (see TODO.md) instead of inferring keyboard state from
   visualViewport height. Two earlier visualViewport-based approaches were
   tried and both had real problems:
   1. offset = window.innerHeight - visualViewport.height: reads ~0 forever
      inside the Capacitor WebView, because it resizes window.innerHeight
      together with the keyboard, so the two live values never actually
      diverge.
   2. baseline-vs-visualViewport.height polling (the previous fix): worked,
      but was an inherent workaround -- inferring an on/off state from
      continuous height comparisons, with its own edge cases around
      rotation and re-syncing the baseline.
   The native plugin fires a real, unambiguous "keyboard is open/closed"
   event, so no polling or baseline-tracking is needed at all. Requires
   android:windowSoftInputMode="adjustResize" in AndroidManifest.xml (rule
   #9) so window.innerHeight is already correctly resized by the time
   keyboardDidShow fires -- keyboardDidShow (not keyboardWillShow) is used
   specifically so the resize has already happened when we read it.
   Only active inside the actual Capacitor app (window.Capacitor) -- there
   is no keyboard plugin in a plain browser preview, and this class of bug
   cannot be verified there anyway (rule #9): only on a real device/emulator. */
(function(){
  if(!window.Capacitor) return;
  function applyState(isOpen){
    if(isOpen) document.documentElement.style.setProperty('--vvh', window.innerHeight + 'px');
    document.documentElement.classList.toggle('kbd-open', isOpen);
    document.documentElement.classList.toggle('editing-field', isOpen);
  }
  window.addEventListener('keyboardDidShow', function(){ applyState(true); });
  window.addEventListener('keyboardDidHide', function(){ applyState(false); });
})();
