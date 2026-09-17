'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',check:'M5 12l4 4L19 6'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';
const MS=86400000;
const toDate=s=>new Date(s+'T00:00:00Z');
const addDays=(s,n)=>{const d=toDate(s);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dayDiff=(a,b)=>Math.round((toDate(b)-toDate(a))/MS);
const shortDate=s=>new Intl.DateTimeFormat('uk-UA',{day:'numeric',month:'long',timeZone:'UTC'}).format(toDate(s));

const TODAY='2026-09-17';
const rooms=[
 {number:'101',type:'Стандарт',capacity:2,beds:'1 двоспальне ліжко',amenity:'Сніданок включено',price:1600},
 {number:'102',type:'Стандарт',capacity:2,beds:'1 двоспальне ліжко',amenity:'Сніданок включено',price:1600},
 {number:'103',type:'Стандарт',capacity:2,beds:'2 окремих ліжка',amenity:'Сніданок включено',price:1600},
 {number:'106',type:'Покращений',capacity:3,beds:'1 двоспальне + диван',amenity:'Балкон',price:2000},
 {number:'107',type:'Покращений',capacity:3,beds:'1 двоспальне + диван',amenity:'Балкон',price:2000},
 {number:'204',type:'Люкс',capacity:2,beds:'1 двоспальне ліжко',amenity:'Сніданок включено',price:1600},
 {number:'205',type:'Люкс',capacity:3,beds:'1 двоспальне + диван',amenity:'Балкон',price:1800},
 {number:'301',type:'Апартаменти',capacity:4,beds:'2 кімнати',amenity:'Кухня',price:2200},
 {number:'302',type:'Апартаменти',capacity:4,beds:'2 кімнати',amenity:'Кухня',price:2200}
];
const existingBookings=[{room:'204',start:'2026-09-22',end:'2026-09-25'},{room:'106',start:'2026-09-18',end:'2026-09-20'},{room:'301',start:'2026-09-19',end:'2026-09-21'}];
const guestsDb=[{name:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',stays:4,spent:28400},{name:'Олег Бондар',phone:'+380 50 222 11 33',email:'',stays:1,spent:2400},{name:'Марія Петренко',phone:'+380 63 456 78 90',email:'',stays:2,spent:14200}];

const state={
 start:TODAY,end:addDays(TODAY,3),
 adults:2,children:0,
 room:null,
 guest:{mode:'search',query:'',selected:null,newData:null},
 priceOverride:null,priceReason:'',priceNote:'',
 payment:'none',depositAmount:0,depositMethod:'Готівка',
 source:'',
 arrivalUnknown:true,arrivalTime:'',
 prefs:[],note:'',
 confirmSend:true,messageOverride:null
};

function nights(){return dayDiff(state.start,state.end)}
function roomsOverlap(room,start,end){return existingBookings.some(b=>b.room===room&&start<b.end&&end>b.start)}
function availableRooms(){
 const total=state.adults+state.children;
 return rooms.filter(r=>r.capacity>=total&&!roomsOverlap(r.number,state.start,state.end));
}
function basePrice(){return state.room?state.room.price*nights():0}
function finalPrice(){return state.priceOverride!=null?state.priceOverride:basePrice()}
function remaining(){const paid=state.payment==='full'?finalPrice():state.payment==='deposit'?state.depositAmount:0;return finalPrice()-paid}
function paidAmount(){return state.payment==='full'?finalPrice():state.payment==='deposit'?state.depositAmount:0}
function guestName(){return state.guest.selected?state.guest.selected.name:state.guest.newData?state.guest.newData.name+' '+(state.guest.newData.surname||''):'' }
function guestPhone(){return state.guest.selected?state.guest.selected.phone:state.guest.newData?state.guest.newData.phone:''}

function messageTemplate(){
 const firstName=guestName().split(' ')[0]||'Гостю';
 return `Вітаємо, ${firstName}!\nВаше бронювання в Grand Hotel підтверджено.\n${Number(state.start.slice(-2))}–${Number(state.end.slice(-2))} вересня\nНомер: ${state.room?state.room.type+' '+state.room.number:'—'}\n${nights()} ночі\nСума: ${money(finalPrice())}`;
}

function renderDates(){
 $('#f-start').value=state.start;$('#f-end').value=state.end;
 const n=nights();
 const bad=n<=0;
 $('#err-dates').classList.toggle('show',bad);
 $('#f-end').classList.toggle('invalid',bad);
 $('#nights-note').textContent=bad?'':`${shortDate(state.start)} – ${shortDate(state.end)} · ${n} ночі`;
}
function renderGuestsCount(){$('#adults-val').textContent=state.adults;$('#children-val').textContent=state.children}
function renderRooms(){
 const list=availableRooms();
 $('#rooms-sub').textContent=list.length?`Доступно ${list.length} номер${list.length===1?'':list.length<5?'и':'ів'} на вибрані дати.`:'На ці дати немає вільних номерів.';
 if(!nights()||nights()<=0){$('#room-cards').innerHTML='';return}
 if(!list.length){
  const altA=[addDays(state.start,-1),addDays(state.end,-1)],altB=[addDays(state.start,1),addDays(state.end,1)];
  $('#room-cards').innerHTML=`<div class="room-empty"><h3>На ці дати немає вільних номерів</h3><p>Спробуйте інші дати.</p><div class="alt-dates">
   <button type="button" data-alt="${altA[0]},${altA[1]}"><b>${Number(altA[0].slice(-2))}–${Number(altA[1].slice(-2))} вересня</b>${rooms.filter(r=>r.capacity>=state.adults+state.children&&!roomsOverlap(r.number,altA[0],altA[1])).length} номери доступні</button>
   <button type="button" data-alt="${altB[0]},${altB[1]}"><b>${Number(altB[0].slice(-2))}–${Number(altB[1].slice(-2))} вересня</b>${rooms.filter(r=>r.capacity>=state.adults+state.children&&!roomsOverlap(r.number,altB[0],altB[1])).length} номери доступні</button>
  </div></div>`;
  return;
 }
 $('#room-cards').innerHTML=list.map(r=>{
  const total=r.price*nights(),sel=state.room&&state.room.number===r.number;
  return `<div class="room-card ${sel?'selected':''}" data-room="${r.number}"><div><h3>${r.number} · ${r.type}</h3><div class="room-facts">До ${r.capacity} гостей · ${r.beds} · ${r.amenity}</div></div><div class="room-price"><b>${money(r.price)} / ніч</b><small>${nights()} ночі · ${money(total)}</small></div><button type="button">${sel?'Обрано':'Обрати'}</button></div>`;
 }).join('');
}
function renderGuestBlock(){
 const g=state.guest;
 let html='';
 if(g.selected){
  html=`<div class="guest-selected"><div><b>${esc(g.selected.name)}</b><span>${esc(g.selected.phone)}${g.selected.email?' · '+esc(g.selected.email):''} · ${g.selected.stays} проживання</span></div><button type="button" class="text-action" id="btn-change-guest">Змінити гостя</button></div>`;
 }else if(g.mode==='new'){
  const d=g.newData||{};
  html=`<div class="new-guest-form">
   <label>Ім’я *<input id="ng-name" value="${esc(d.name||'')}" required></label>
   <label>Прізвище<input id="ng-surname" value="${esc(d.surname||'')}"></label>
   <label>Телефон *<input id="ng-phone" value="${esc(d.phone||'')}" required></label>
   <label>Email<input id="ng-email" type="email" value="${esc(d.email||'')}"></label>
   <button type="button" class="text-action full" id="btn-back-search">← Пошук існуючого гостя</button>
  </div>`;
 }else{
  html=`<div class="guest-search"><input id="guest-query" placeholder="Ім’я або номер телефону" value="${esc(g.query)}"></div>
  <div class="guest-results" id="guest-results"></div>
  <button type="button" class="button secondary" id="btn-new-guest" style="margin-top:12px">+ Створити нового гостя</button>`;
 }
 $('#guest-block').innerHTML=html;
 if(!g.selected&&g.mode!=='new')renderGuestResults();
 hydrate($('#guest-block'));
}
function renderGuestResults(){
 const q=state.guest.query.trim().toLocaleLowerCase('uk-UA');
 const box=$('#guest-results');if(!box)return;
 if(!q){box.innerHTML='';return}
 const found=guestsDb.filter(g=>(g.name+' '+g.phone).toLocaleLowerCase('uk-UA').includes(q));
 box.innerHTML=found.map(g=>`<button type="button" class="guest-result" data-pick-guest="${esc(g.name)}"><span><b>${esc(g.name)}</b><small>${esc(g.phone)} · ${g.stays} попередні проживання · ${money(g.spent)} витрачено</small></span><span class="text-action">Обрати →</span></button>`).join('')||'<p class="form-note">Гостя не знайдено. Створіть нового.</p>';
}
function renderPrice(){
 const base=basePrice(),final=finalPrice();
 $('#price-lines').innerHTML=state.room?`<div class="price-line"><span>${state.room.number} · ${state.room.type}<br><small>${money(state.room.price)} × ${nights()} ночі</small></span><b>${money(base)}</b></div><div class="price-line"><span>Додаткові послуги</span><b>0 ₴</b></div>`:'<p class="form-note">Оберіть номер, щоб побачити вартість.</p>';
 $('#price-total-val').textContent=money(final);
 const disc=base-final;
 $('#discount-note').hidden=disc===0;
 if(disc!==0)$('#discount-note').textContent=(disc>0?'Знижка: ':'Надбавка: ')+money(Math.abs(disc))+(state.priceReason?' · '+state.priceReason:'');
}
function renderPayment(){
 $$('.pay-option').forEach(el=>el.classList.toggle('selected',el.dataset.pay===state.payment));
 $('#deposit-fields').hidden=state.payment!=='deposit';
 $('#deposit-amount').value=state.depositAmount||'';
 const final=finalPrice();
 const summary=state.payment==='none'?`Статус оплати: <b>Не оплачено</b> · Залишок: <b>${money(final)}</b>`:state.payment==='full'?`Статус оплати: <b>Оплачено</b>`:`Статус оплати: <b>Частково оплачено</b> · Залишок: <b>${money(remaining())}</b>`;
 $('#pay-summary').innerHTML=summary;
}
function renderPrefs(){$$('#prefs-tags button[data-pref]').forEach(b=>b.classList.toggle('active',state.prefs.includes(b.dataset.pref)))}
function renderMessage(){
 $('#confirm-switch').classList.toggle('on',state.confirmSend);
 $('#confirm-switch').setAttribute('aria-checked',String(state.confirmSend));
 $('#msg-preview').hidden=!state.confirmSend;
 $('#msg-preview').textContent=state.messageOverride!=null?state.messageOverride:messageTemplate();
 $('#btn-edit-message').hidden=!state.confirmSend;
}
function validation(){
 const errs=[];
 if(!(nights()>0))errs.push('dates');
 if(!state.room)errs.push('room');
 if(!guestName().trim()||!guestPhone().trim())errs.push('guest');
 if(!state.source)errs.push('source');
 return errs;
}
function renderSummary(){
 const errs=validation();
 const valid=errs.length===0;
 $('#summary-body').innerHTML=`
  <div class="summary-line"><span>Гість</span><b>${esc(guestName())||'—'}</b></div>
  <div class="summary-line"><span>Проживання</span><b>${nights()>0?shortDate(state.start)+' – '+shortDate(state.end):'—'}</b></div>
  <div class="summary-line"><span>Ночей</span><b>${nights()>0?nights():'—'}</b></div>
  <div class="summary-line"><span>Гостей</span><b>${state.adults} дорослих${state.children?', '+state.children+' дітей':''}</b></div>
  <div class="summary-line"><span>Номер</span><b>${state.room?state.room.number+' · '+state.room.type:'—'}</b></div>
  <div class="summary-line"><span>Ціна</span><b>${money(finalPrice())}</b></div>
  <div class="summary-line"><span>Оплачено</span><b>${money(paidAmount())}</b></div>
  <div class="summary-line"><span>Залишок</span><b>${money(remaining())}</b></div>
  <div class="summary-line"><span>Джерело</span><b>${state.source||'—'}</b></div>`;
 $$('#submit-btn,#submit-btn-2,#btn-mobile-submit').forEach(b=>b.disabled=!valid);
 if(!errs.includes('room'))$('#err-room').classList.remove('show');
 if(!errs.includes('guest'))$('#err-guest').classList.remove('show');
 if(!errs.includes('source'))$('#err-source').classList.remove('show');
}
function renderAll(){renderDates();renderGuestsCount();renderRooms();renderGuestBlock();renderPrice();renderPayment();renderPrefs();renderMessage();renderSummary();hydrate()}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function changePriceModal(){
 show('Змінити ціну',`<form class="demo-form" id="price-form">
  <label class="full">Стандартна ціна<input value="${money(basePrice())}" disabled></label>
  <label class="full">Фінальна ціна, ₴<input name="final" type="number" min="1" value="${finalPrice()}"></label>
  <label class="full">Причина<select name="reason"><option>Знижка</option><option>Постійний гість</option><option>Спецпропозиція</option><option>Власна ціна</option></select></label>
  <label class="full">Нотатка (необов’язково)<input name="note" maxlength="100"></label>
  <button class="button primary full" type="submit">Зберегти ціну</button>
 </form>`);
}
function editMessageModal(){
 show('Редагувати повідомлення',`<form class="demo-form" id="message-form"><label class="full">Текст повідомлення<textarea name="message" maxlength="600">${esc(state.messageOverride!=null?state.messageOverride:messageTemplate())}</textarea></label><button class="button primary full" type="submit">Зберегти текст</button></form>`);
}
function otherPrefModal(){
 show('Додати побажання',`<form class="demo-form" id="pref-form"><label class="full">Побажання<input name="pref" required maxlength="40"></label><button class="button primary full" type="submit">Додати</button></form>`);
}
function unavailableModal(){
 const alts=rooms.filter(r=>r.number!==state.room.number&&r.capacity>=state.adults+state.children&&!roomsOverlap(r.number,state.start,state.end));
 show('Номер щойно став недоступним',`<p>${state.room.number} · ${state.room.type} вже заброньовано на частину вибраних дат.</p><div class="room-cards">${alts.map(r=>`<div class="room-card" data-pick-alt="${r.number}"><div><h3>${r.number} · ${r.type}</h3><div class="room-facts">До ${r.capacity} гостей</div></div><button type="button">Обрати</button></div>`).join('')||'<p class="form-note">Вільних альтернатив немає.</p>'}</div>`);
}
function successModal(){
 show('Бронювання створено',`<div class="detail-grid"><div><small>Гість</small><b>${esc(guestName())}</b></div><div><small>Дати</small><b>${Number(state.start.slice(-2))}–${Number(state.end.slice(-2))} вер.</b></div><div><small>Номер</small><b>${state.room.number} · ${state.room.type}</b></div></div><p>Сума: <b>${money(finalPrice())}</b></p><div class="dialog-actions"><a class="button primary" href="/booking/">Відкрити бронювання</a><a class="button secondary" href="/calendar/">Повернутися до календаря</a><button class="button secondary" id="btn-create-another">Створити ще одне</button></div>`);
}

/* events */
$('#f-start').addEventListener('change',e=>{state.start=e.target.value;if(state.end<=state.start)state.end=addDays(state.start,1);renderAll()});
$('#f-end').addEventListener('change',e=>{state.end=e.target.value;renderAll()});
$$('.stepper button').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.step,d=Number(b.dataset.d);state[key]=Math.max(key==='adults'?1:0,state[key]+d);renderAll()}));
$$('.pay-option').forEach(el=>el.addEventListener('click',()=>{state.payment=el.dataset.pay;if(state.payment==='deposit'&&!state.depositAmount)state.depositAmount=Math.round(finalPrice()/2);renderAll()}));
$('#deposit-amount').addEventListener('input',e=>{state.depositAmount=Number(e.target.value)||0;renderAll()});
$('#deposit-method').addEventListener('change',e=>{state.depositMethod=e.target.value});
$('#f-source').addEventListener('change',e=>{state.source=e.target.value;renderSummary()});
$('#f-arrival-unknown').addEventListener('change',e=>{state.arrivalUnknown=e.target.checked;$('#f-arrival-time').disabled=state.arrivalUnknown});
$('#f-arrival-time').addEventListener('change',e=>{state.arrivalTime=e.target.value});
$('#f-note').addEventListener('input',e=>{state.note=e.target.value});
$('#confirm-switch').addEventListener('click',()=>{state.confirmSend=!state.confirmSend;renderMessage()});
$('#confirm-switch').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();state.confirmSend=!state.confirmSend;renderMessage()}});
$('#btn-change-price').addEventListener('click',changePriceModal);
$('#btn-edit-message').addEventListener('click',editMessageModal);
$('#btn-other-pref').addEventListener('click',otherPrefModal);

document.addEventListener('input',e=>{if(e.target.id==='guest-query'){state.guest.query=e.target.value;renderGuestResults()}});
document.addEventListener('click',e=>{
 if(e.target.closest('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;e.target.closest('.mobile-menu').setAttribute('aria-expanded',String(opened));return}
 if(e.target.closest('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;return}
 const roomCard=e.target.closest('.room-card[data-room]');
 if(roomCard){state.room=rooms.find(r=>r.number===roomCard.dataset.room);renderAll();return}
 const alt=e.target.closest('[data-alt]');
 if(alt){const[s,eD]=alt.dataset.alt.split(',');state.start=s;state.end=eD;renderAll();return}
 const pick=e.target.closest('[data-pick-guest]');
 if(pick){const g=guestsDb.find(g=>g.name===pick.dataset.pickGuest);state.guest.selected=g;renderGuestBlock();renderSummary();renderMessage();return}
 if(e.target.id==='btn-new-guest'){state.guest.mode='new';state.guest.newData={};renderGuestBlock();return}
 if(e.target.id==='btn-back-search'){state.guest.mode='search';renderGuestBlock();return}
 if(e.target.id==='btn-change-guest'){state.guest.selected=null;state.guest.mode='search';state.guest.query='';renderGuestBlock();renderSummary();renderMessage();return}
 const prefBtn=e.target.closest('[data-pref]');
 if(prefBtn){const p=prefBtn.dataset.pref;const i=state.prefs.indexOf(p);if(i>-1)state.prefs.splice(i,1);else state.prefs.push(p);renderPrefs();return}
 const pickAlt=e.target.closest('[data-pick-alt]');
 if(pickAlt){state.room=rooms.find(r=>r.number===pickAlt.dataset.pickAlt);closeDialog();renderAll();return}
 if(e.target.matches('[data-close]')){closeDialog();return}
 if(e.target.id==='btn-create-another'){window.location.reload();return}
 if(e.target.id==='submit-btn'||e.target.id==='submit-btn-2'||e.target.id==='btn-mobile-submit'){submitBooking();return}
});
document.addEventListener('input',e=>{
 if(['ng-name','ng-surname','ng-phone','ng-email'].includes(e.target.id)){
  state.guest.newData=state.guest.newData||{};
  state.guest.newData[e.target.id.replace('ng-','')]=e.target.value;
  renderSummary();renderMessage();
 }
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='price-form'){state.priceOverride=Number(data.get('final'));state.priceReason=String(data.get('reason'));state.priceNote=String(data.get('note')||'');closeDialog();renderAll();toast('Ціну оновлено')}
 else if(f.id==='message-form'){state.messageOverride=String(data.get('message'));closeDialog();renderMessage();toast('Текст повідомлення збережено')}
 else if(f.id==='pref-form'){state.prefs.push(String(data.get('pref')).trim());closeDialog();renderPrefs();toast('Побажання додано')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true}});

function submitBooking(){
 const errs=validation();
 if(errs.length){
  const first=errs[0];
  const targets={dates:'section-dates',room:'section-rooms',guest:'section-guest',source:'section-source'};
  document.getElementById(targets[first]).scrollIntoView({behavior:'smooth',block:'center'});
  if(first==='dates')$('#err-dates').classList.add('show');
  if(first==='room')$('#err-room').classList.add('show');
  if(first==='guest')$('#err-guest').classList.add('show');
  if(first==='source')$('#err-source').classList.add('show');
  return;
 }
 if(roomsOverlap(state.room.number,state.start,state.end)){unavailableModal();return}
 successModal();
}

renderAll();
