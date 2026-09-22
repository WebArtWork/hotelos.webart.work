'use strict';
(function(){
 var KEY='hotelos_theme';
 function get(){try{return localStorage.getItem(KEY)||'dark'}catch(e){return 'dark'}}
 function apply(t){document.documentElement.setAttribute('data-theme',t)}
 function sync(){
  var t=get();
  document.querySelectorAll('[data-theme-toggle]').forEach(function(el){
   if(el.tagName==='SELECT'){el.value=t;return}
   if(el.tagName==='INPUT'&&el.type==='checkbox'){el.checked=t==='dark';return}
   el.setAttribute('aria-pressed',String(t==='dark'));
   el.classList.toggle('on',t==='dark');
  });
 }
 function set(t){try{localStorage.setItem(KEY,t)}catch(e){}apply(t);sync()}
 function toggle(){set(get()==='dark'?'light':'dark')}
 apply(get());
 document.addEventListener('DOMContentLoaded',sync);
 document.addEventListener('click',function(e){
  var el=e.target.closest('[data-theme-toggle]');
  if(el&&el.tagName!=='SELECT')toggle();
 });
 document.addEventListener('change',function(e){
  if(!e.target.matches||!e.target.matches('[data-theme-toggle]'))return;
  if(e.target.tagName==='SELECT')set(e.target.value);
  else if(e.target.type==='checkbox')set(e.target.checked?'dark':'light');
 });
 window.HotelTheme={get:get,set:set,toggle:toggle};
})();
