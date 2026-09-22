'use strict';
(function(){
 var KEY='hotelos_role';
 var LABELS={owner:'Власник',manager:'Менеджер',reception:'Ресепшн',housekeeping:'Прибирання'};
 function get(){try{return localStorage.getItem(KEY)||'owner'}catch(e){return 'owner'}}
 function set(r){try{localStorage.setItem(KEY,r)}catch(e){}apply()}
 function isOwner(){var r=get();return r==='owner'||r==='manager'}
 function apply(){
  var role=get();
  document.querySelectorAll('[data-role-select]').forEach(function(sel){sel.value=role});
 }
 document.addEventListener('DOMContentLoaded',apply);
 document.addEventListener('change',function(e){
  if(e.target && e.target.matches && e.target.matches('[data-role-select]'))set(e.target.value);
 });
 window.HotelRole={get:get,set:set,isOwner:isOwner,apply:apply,LABELS:LABELS};
})();
