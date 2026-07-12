// onboarding -- android-specific (diverged from or absent in the other repo).

/* First-launch onboarding tour. Shows automatically only inside the app
   (window.Capacitor) on the first launch, then remembers via localStorage.
   Add ?onboard=1 to the URL to force it in a browser (for previewing). */
(function(){
  var N = 3, idx = 0;
  window.obGo = function(i){
    idx = Math.max(0, Math.min(N-1, i));
    var t = document.getElementById('onboardTrack');
    if(t) t.style.transform = 'translateX(-' + (idx*100) + '%)';
    var dots = document.getElementById('onboardDots');
    if(dots){ var h=''; for(var k=0;k<N;k++){ h += '<i class="'+(k===idx?'on':'')+'"></i>'; } dots.innerHTML = h; }
    var nx = document.getElementById('onboardNext');
    if(nx) nx.textContent = (idx===N-1) ? 'Get started' : 'Next';
  };
  window.obNext = function(){ if(idx < N-1) window.obGo(idx+1); else window.obClose(); };
  window.obClose = function(){
    var dont = document.getElementById('onboardDont');
    if(!dont || dont.checked){ try{ localStorage.setItem('tnc_onboarded','1'); }catch(e){} }
    var ov = document.getElementById('onboardOverlay');
    if(ov) ov.classList.remove('on');
  };
  function obShow(){ var ov = document.getElementById('onboardOverlay'); if(!ov) return; window.obGo(0); ov.classList.add('on'); }
  // swipe between slides
  var track = document.getElementById('onboardTrack');
  if(track){
    var x0 = null;
    track.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(e){
      if(x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if(Math.abs(dx) < 40) return;
      if(dx < 0) window.obNext(); else window.obGo(idx-1);
    }, {passive:true});
  }
  function maybeShow(){
    var force = /[?&]onboard=1/.test(location.search);
    var seen = false; try{ seen = !!localStorage.getItem('tnc_onboarded'); }catch(e){}
    if(force || (window.Capacitor && !seen)) obShow();
  }
  if(document.readyState === 'loading') window.addEventListener('load', maybeShow);
  else setTimeout(maybeShow, 60);
})();
