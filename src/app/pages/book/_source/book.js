'use strict';
const paths={phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z',left:'M15 6l-6 6 6 6',close:'M6 6l12 12M18 6 6 18',check:'M5 12l4 4L19 6'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';
const TODAY='2026-09-17';
const addDays=(s,n)=>{const d=new Date(s+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const dayDiff=(a,b)=>Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/86400000);
const shortDate=s=>new Intl.DateTimeFormat('uk-UA',{day:'numeric',month:'long',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));

const ROOM_TYPES=[
 {id:'standard',name:'Стандарт',capacity:2,area:22,beds:'1 двоспальне ліжко',price:1200,features:['Wi-Fi','Кондиціонер','Душ'],desc:'Затишний номер для комфортного відпочинку в центрі міста.'},
 {id:'lux',name:'Люкс',capacity:2,area:28,beds:'1 двоспальне ліжко',price:1600,features:['Wi-Fi','Кондиціонер','Сніданок','Балкон'],desc:'Просторий номер із великим двоспальним ліжком, окремою ванною кімнатою та балконом.'},
 {id:'apartments',name:'Апартаменти',capacity:4,area:42,beds:'2 спальні + диван',price:2200,features:['Wi-Fi','Кондиціонер','Кухня','2 кімнати'],desc:'Просторі апартаменти для родини чи компанії — з окремою кухнею та двома кімнатами.'}
];
const CANCELLATION='Безкоштовне скасування до 48 годин до заїзду.';
const HOTEL={name:'Grand Hotel',checkIn:'14:00',checkOut:'11:00'};
const CONFLICT_START='2026-09-22',CONFLICT_END='2026-09-25';

const state={start:TODAY,end:addDays(TODAY,3),adults:2,children:0,selectedRoom:null,guest:{},prefs:[],arrival:'unknown',payment:'later',depositAmount:1500,bookingId:null,holdSeconds:600,holdTimer:null};

function nights(){return dayDiff(state.start,state.end)}
function totalPrice(){return state.selectedRoom?state.selectedRoom.price*nights():0}
function showScreen(id){
 $$('.screen').forEach(s=>s.classList.remove('active'));
 $('#'+id).classList.add('active');
 window.scrollTo({top:0,behavior:'instant'in window?'instant':'auto'});
 updateStickyBar();
}
function updateStickyBar(){
 const bar=$('#sticky-bar');
 const active=$('.screen.active').id;
 if(state.selectedRoom&&['screen-room-details','screen-guest','screen-payment'].includes(active)){
  bar.classList.add('show');
  bar.innerHTML=`<div class="sb-info">${state.start.slice(-2)}–${state.end.slice(-2)} вересня · ${state.selectedRoom.name}<b>${money(totalPrice())}</b></div><button class="btn primary" id="sb-continue">Продовжити</button>`;
  hydrate(bar);
 }else{
  bar.classList.remove('show');bar.innerHTML='';
 }
}
function guestDisplay(){return `${state.adults} дорослих${state.children?', '+state.children+' дітей':''}`}
function renderSearchFields(){
 $('#s-start').value=state.start;$('#s-end').value=state.end;
 $('#guest-toggle').textContent=guestDisplay();
 $('#adults-val').textContent=state.adults;$('#children-val').textContent=state.children;
}

function availableTypes(){
 // demo conflict: Lux is sold out for the 22–25 вересня window
 return ROOM_TYPES.filter(t=>!(t.id==='lux'&&state.start===CONFLICT_START&&state.end===CONFLICT_END));
}

function renderResults(){
 if(nights()>14){
  showErrorState();return;
 }
 if(nights()<=0){
  $('#results-block').innerHTML=`<p style="color:#a24b3f;font-size:12px;margin-bottom:20px">Виїзд має бути після заїзду.</p>`;
  return;
 }
 const types=availableTypes();
 if(!types.length){renderNoAvailability();return}
 $('#screen-no-availability').classList.remove('active');
 $('#results-block').innerHTML=`
 <h2 class="section-heading">Доступні номери</h2>
 <p class="section-sub">${shortDate(state.start)} – ${shortDate(state.end)} · ${nights()} ночі · ${guestDisplay()}</p>
 <div class="sort-row"><select id="sort-select"><option value="rec">Рекомендовані</option><option value="asc">Нижча ціна</option><option value="desc">Вища ціна</option></select></div>
 <div class="room-cards" id="room-cards"></div>`;
 renderRoomCards(types);
}
function renderRoomCards(types){
 const sort=$('#sort-select')?.value||'rec';
 let list=types.slice();
 if(sort==='asc')list.sort((a,b)=>a.price-b.price);
 if(sort==='desc')list.sort((a,b)=>b.price-a.price);
 $('#room-cards').innerHTML=list.filter(t=>t.capacity>=state.adults||state.adults<=t.capacity).map(t=>`
  <div class="room-card" data-room="${t.id}">
   ${HotelPhotos.image(t.id)}
   <div class="room-card-body">
    <div class="room-card-top"><h3>${t.name}</h3></div>
    <div class="room-facts">До ${t.capacity} гостей · ${t.area} м² · ${t.beds}</div>
    <div class="feature-tags">${t.features.map(f=>`<span>${f}</span>`).join('')}</div>
    <div class="room-card-bottom">
     <div class="price-block"><b class="per-night">${money(t.price)} / ніч</b><b class="total">${money(t.price*nights())}</b><small>за ${nights()} ночі</small></div>
     <div class="room-card-actions"><button class="btn secondary" data-details="${t.id}">Детальніше</button><button class="btn primary" data-select="${t.id}">Обрати номер</button></div>
    </div>
   </div>
  </div>`).join('')||'<p style="font-size:12px;color:#707174">Немає номерів для такої кількості гостей.</p>';
}
function renderNoAvailability(){
 showScreen('screen-no-availability');
 const altA=[addDays(state.start,-1),addDays(state.end,-1)],altB=[addDays(state.start,1),addDays(state.end,1)];
 $('#screen-no-availability').innerHTML=`<div class="no-avail">
  <h2>На ці дати немає вільних номерів</h2>
  <p>Спробуйте змінити дати або кількість гостей.</p>
  <div class="alt-dates">
   <button data-alt="${altA[0]},${altA[1]}"><b>${altA[0].slice(-2)}–${altA[1].slice(-2)} вересня</b>2 варіанти</button>
   <button data-alt="${altB[0]},${altB[1]}"><b>${altB[0].slice(-2)}–${altB[1].slice(-2)} вересня</b>3 варіанти</button>
  </div>
  <button class="btn secondary" id="btn-change-dates">Змінити дати</button>
 </div>`;
 hydrate($('#screen-no-availability'));
}
function showErrorState(){
 showScreen('screen-error');
 $('#screen-error').innerHTML=`<div class="error-state"><h2>Не вдалося перевірити доступність</h2><p>Спробуйте ще раз або зв’яжіться з готелем.</p><div class="success-actions"><button class="btn primary" id="btn-retry-search">Спробувати ще раз</button><a class="btn secondary" href="tel:+380671234567">Зателефонувати</a></div></div>`;
}

function roomDetailsScreen(id){
 const t=ROOM_TYPES.find(t=>t.id===id);
 $('#screen-room-details').innerHTML=`
 <button class="btn secondary" id="back-to-results" data-icon="left" style="margin-bottom:16px">Назад до результатів</button>
 <div class="gallery-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:16px">
  ${HotelPhotos.gallery(t.id)}
 </div>
 <h1 class="step-heading">${t.name}</h1>
 <p class="room-facts" style="margin-bottom:14px">До ${t.capacity} гостей · ${t.area} м² · ${t.beds} · ванна кімната</p>
 <p style="font-size:13px;color:#3a3a3c;margin-bottom:18px">${t.desc}</p>
 <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#707174;margin-bottom:10px">Зручності</h4>
 <div class="feature-tags" style="margin-bottom:20px">${t.features.map(f=>`<span>${f}</span>`).join('')}</div>
 <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#707174;margin-bottom:10px">Умови проживання</h4>
 <div class="quick-info" style="margin-bottom:20px"><span>Check-in після ${HOTEL.checkIn}</span><span>Check-out до ${HOTEL.checkOut}</span><span>Паління заборонено</span><span>Тварини за правилами готелю</span></div>
 <div class="review-card" style="margin-bottom:20px">
  <div class="review-row"><span>Стандартний тариф</span><b>${money(t.price)} / ніч</b></div>
  <div class="review-row"><span>${nights()} ночі</span><b>${money(t.price*nights())}</b></div>
  <p style="font-size:11.5px;color:#707174;margin-top:10px">${CANCELLATION}</p>
 </div>
 <button class="btn primary full" data-select="${t.id}">Обрати</button>
 `;
 hydrate($('#screen-room-details'));
 showScreen('screen-room-details');
}

function selectRoom(id){
 const t=ROOM_TYPES.find(t=>t.id===id);
 if(state.start===CONFLICT_START&&state.end===CONFLICT_END&&t.id==='lux'){
  alternativeRoomScreen();return;
 }
 state.selectedRoom=t;
 startHold();
 guestScreen();
}
function alternativeRoomScreen(){
 const alts=ROOM_TYPES.filter(t=>t.id!=='lux');
 $('#screen-no-availability').innerHTML=`<div class="no-avail">
  <h2>Цей номер щойно забронювали</h2>
  <p>Поки ви оформлювали бронювання, доступність змінилася. Ось інші варіанти:</p>
  <div class="room-cards" style="text-align:left">${alts.map(t=>`<div class="room-card" data-room="${t.id}">${HotelPhotos.image(t.id)}<div class="room-card-body"><div class="room-card-top"><h3>${t.name}</h3></div><div class="room-facts">До ${t.capacity} гостей</div><div class="room-card-bottom"><div class="price-block"><b class="total">${money(t.price*nights())}</b></div><button class="btn primary" data-select="${t.id}">Обрати</button></div></div></div>`).join('')}</div>
 </div>`;
 showScreen('screen-no-availability');
}

function startHold(){
 clearInterval(state.holdTimer);
 state.holdSeconds=600;
 state.holdTimer=setInterval(()=>{
  state.holdSeconds--;
  $$('.hold-timer').forEach(el=>el.textContent=holdLabel());
  if(state.holdSeconds<=0)clearInterval(state.holdTimer);
 },1000);
}
function holdLabel(){const m=Math.floor(state.holdSeconds/60),s=state.holdSeconds%60;return `${m}:${String(s).padStart(2,'0')}`}

function guestScreen(){
 const g=state.guest;
 $('#screen-guest').innerHTML=`
 <div class="two-col">
  <div>
   <button class="btn secondary" id="back-to-results-2" data-icon="left" style="margin-bottom:16px">Назад</button>
   <div class="hold-banner">Номер зарезервовано для вас ще: <b class="hold-timer">${holdLabel()}</b></div>
   <h1 class="step-heading">Ваші дані</h1>
   <p class="step-sub">Потрібні лише контакти для підтвердження бронювання.</p>
   <div class="form-grid">
    <label>Ім’я *<input id="g-first" value="${esc(g.first||'')}" required></label>
    <label>Прізвище<input id="g-last" value="${esc(g.last||'')}"></label>
    <label>Телефон *<input id="g-phone" value="${esc(g.phone||'')}" required></label>
    <label>Email<input id="g-email" type="email" value="${esc(g.email||'')}"></label>
   </div>
   <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#707174;margin:22px 0 4px">Побажання</h4>
   <div class="tag-pick" id="pref-tags">
    <button type="button" data-pref="Тихий номер">Тихий номер</button>
    <button type="button" data-pref="Дитяче ліжечко">Дитяче ліжечко</button>
    <button type="button" data-pref="Ранній заїзд">Ранній заїзд</button>
    <button type="button" data-pref="Пізній заїзд">Пізній заїзд</button>
   </div>
   <label style="display:block;font-size:12px;color:#3a3a3c;font-weight:600;margin-bottom:6px">Інші побажання</label>
   <textarea id="g-note" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:11px;font-size:13px;min-height:60px" placeholder="Наприклад: приїдемо трохи раніше">${esc(g.note||'')}</textarea>
   <p style="font-size:11px;color:#8b8c92;margin:6px 0 20px">Виконання побажань залежить від можливості готелю.</p>
   <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.4px;color:#707174;margin-bottom:10px">Орієнтовний час приїзду</h4>
   <select id="g-arrival" style="border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:24px">
    <option value="unknown">Не знаю</option><option value="before14">До 14:00</option><option value="14-18">14:00–18:00</option><option value="18-22">18:00–22:00</option><option value="after22">Після 22:00</option>
   </select>
   <button class="btn primary full" id="btn-to-payment">Продовжити</button>
  </div>
  <div class="summary-panel">${summaryHtml()}</div>
 </div>`;
 $$('#pref-tags button').forEach(b=>b.classList.toggle('active',state.prefs.includes(b.dataset.pref)));
 hydrate($('#screen-guest'));
 showScreen('screen-guest');
}
function summaryHtml(){
 const t=state.selectedRoom;
 return `<h4>Ваше бронювання</h4>
 <div class="summary-line"><span>Готель</span><b>${HOTEL.name}</b></div>
 <div class="summary-line"><span>Дати</span><b>${state.start.slice(-2)}–${state.end.slice(-2)} вересня</b></div>
 <div class="summary-line"><span>Ночей</span><b>${nights()}</b></div>
 <div class="summary-line"><span>Гостей</span><b>${guestDisplay()}</b></div>
 <div class="summary-line"><span>Номер</span><b>${t?t.name:'—'}</b></div>
 <div class="summary-line"><span>Проживання</span><b>${money(totalPrice())}</b></div>
 <div class="summary-line"><span>Додатково</span><b>0 ₴</b></div>
 <div class="summary-total"><span>Разом</span><span>${money(totalPrice())}</span></div>`;
}

function paymentScreen(){
 $('#screen-payment').innerHTML=`
 <div class="two-col">
  <div>
   <button class="btn secondary" id="back-to-guest" data-icon="left" style="margin-bottom:16px">Назад</button>
   <div class="hold-banner">Номер зарезервовано для вас ще: <b class="hold-timer">${holdLabel()}</b></div>
   <h1 class="step-heading">Оплата</h1>
   <div class="pay-options">
    <div class="pay-option ${state.payment==='later'?'selected':''}" data-pay="later"><b>Без оплати зараз</b><span>Оплата при заселенні.</span></div>
    <div class="pay-option ${state.payment==='deposit'?'selected':''}" data-pay="deposit"><b>Передоплата</b><span>Наприклад: ${money(state.depositAmount)}</span></div>
    <div class="pay-option ${state.payment==='full'?'selected':''}" data-pay="full"><b>Повна оплата</b><span>${money(totalPrice())}</span></div>
   </div>
   ${state.payment==='deposit'?`<div class="deposit-input"><label>Сума передоплати</label><input type="number" id="deposit-amount" value="${state.depositAmount}" min="1" max="${totalPrice()}"></div><p style="font-size:11.5px;color:#707174;margin-top:8px">Залишок можна оплатити під час заселення.</p>`:''}
   <div class="terms-row"><input type="checkbox" id="terms-check"><label for="terms-check">Я погоджуюся з <a href="#" id="link-rules">правилами бронювання</a> та <a href="#" id="link-privacy">умовами скасування</a>.</label></div>
   <button class="btn primary full" id="btn-to-review">${state.payment==='later'?'Підтвердити бронювання':'Перейти до оплати'}</button>
  </div>
  <div class="summary-panel">${summaryHtml()}</div>
 </div>`;
 hydrate($('#screen-payment'));
 showScreen('screen-payment');
}

function reviewScreen(){
 const t=state.selectedRoom,g=state.guest;
 const paidNow=state.payment==='full'?totalPrice():state.payment==='deposit'?state.depositAmount:0;
 $('#screen-review').innerHTML=`
 <button class="btn secondary" id="back-to-payment" data-icon="left" style="margin-bottom:16px">Назад</button>
 <h1 class="step-heading">Перевірте бронювання</h1>
 <div class="review-card">
  <div class="review-row"><span>Готель</span><b>${HOTEL.name}</b></div>
  <div class="review-row"><span>Дати</span><b>${state.start.slice(-2)}–${state.end.slice(-2)} вересня · ${nights()} ночі</b></div>
  <div class="review-row"><span>Гостей</span><b>${guestDisplay()}</b></div>
  <div class="review-row"><span>Номер</span><b>${t.name}</b></div>
  <div class="review-row"><span>Гість</span><b>${esc(((g.first||'')+' '+(g.last||'')).trim()||'—')}</b></div>
  <div class="review-row"><span>Телефон</span><b>${esc(g.phone||'—')}</b></div>
  <div class="review-row"><span>Оплата зараз</span><b>${money(paidNow)}</b></div>
  ${paidNow<totalPrice()?`<div class="review-row"><span>Залишок</span><b>${money(totalPrice()-paidNow)}</b></div>`:''}
  <div class="review-total"><span>Загальна сума</span><span>${money(totalPrice())}</span></div>
 </div>
 <button class="btn primary full" id="btn-confirm-booking" style="margin-top:20px">Підтвердити бронювання</button>
 `;
 hydrate($('#screen-review'));
 showScreen('screen-review');
}

function confirmBooking(){
 clearInterval(state.holdTimer);
 state.bookingId=1842;
 const t=state.selectedRoom,g=state.guest;
 const paidNow=state.payment==='full'?totalPrice():state.payment==='deposit'?state.depositAmount:0;
 $('#screen-success').innerHTML=`
 <div class="success-wrap">
  <div class="success-icon" data-icon="check"></div>
  <h1>Бронювання підтверджено</h1>
  <p>Дякуємо, ${esc(g.first||'')}!</p>
  <p>Ми очікуємо вас у ${HOTEL.name}.</p>
  <p class="booking-number">Номер бронювання #${state.bookingId}</p>
  <div class="success-details">
   <div class="sd-row"><span>Заїзд</span><b>${shortDate(state.start)}, після ${HOTEL.checkIn}</b></div>
   <div class="sd-row"><span>Виїзд</span><b>${shortDate(state.end)}, до ${HOTEL.checkOut}</b></div>
   <div class="sd-row"><span>Номер</span><b>${t.name}</b></div>
   <div class="sd-row"><span>Гості</span><b>${guestDisplay()}</b></div>
   <div class="sd-row"><span>Загальна сума</span><b>${money(totalPrice())}</b></div>
   <div class="sd-row"><span>Оплачено</span><b>${money(paidNow)}</b></div>
   <div class="sd-row"><span>Залишок</span><b>${money(totalPrice()-paidNow)}</b></div>
  </div>
  <div class="success-actions">
   <a class="btn primary" href="/confirmation/">Переглянути бронювання</a>
   <button class="btn secondary" id="btn-save-booking">Зберегти бронювання</button>
   <a class="btn secondary" href="tel:+380671234567">Зв’язатися з готелем</a>
  </div>
 </div>`;
 hydrate($('#screen-success'));
 showScreen('screen-success');
}

/* events */
$('#btn-search').addEventListener('click',()=>{
 if(nights()<=0){$('#results-block').innerHTML='<p style="color:#a24b3f;font-size:12px;margin-bottom:20px">Виїзд має бути після заїзду.</p>';return}
 renderResults();
 $('#results-block').scrollIntoView({behavior:'smooth',block:'start'});
});
$('#s-start').addEventListener('change',e=>{state.start=e.target.value;if(state.end<=state.start)state.end=addDays(state.start,3)});
$('#s-end').addEventListener('change',e=>{state.end=e.target.value});
$('#guest-toggle').addEventListener('click',()=>{$('#guest-popover').hidden=!$('#guest-popover').hidden});
$('#guest-done').addEventListener('click',()=>{$('#guest-popover').hidden=true;renderSearchFields()});
$('#btn-my-bookings').addEventListener('click',()=>alert('Функція «Мої бронювання» буде доступна незабаром.'));

document.addEventListener('click',e=>{
 if(!e.target.closest('.guest-wrap'))$('#guest-popover').hidden=true;
 const payOpt=e.target.closest('.pay-option');
 if(payOpt){state.payment=payOpt.dataset.pay;paymentScreen();return}
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.dataset.g){
  const key=el.dataset.g,d=Number(el.dataset.d);
  state[key]=Math.max(key==='adults'?1:0,state[key]+d);
  $('#adults-val').textContent=state.adults;$('#children-val').textContent=state.children;
  return;
 }
 if(el.dataset.details){roomDetailsScreen(el.dataset.details);return}
 if(el.dataset.select){selectRoom(el.dataset.select);return}
 if(el.id==='back-to-results'||el.id==='back-to-results-2'){showScreen('screen-search');return}
 if(el.id==='back-to-guest'){guestScreen();return}
 if(el.id==='back-to-payment'){paymentScreen();return}
 if(el.id==='sb-continue'){
  const active=$('.screen.active').id;
  if(active==='screen-room-details')guestScreen();
  else if(active==='screen-guest')$('#btn-to-payment')?.click();
  else if(active==='screen-payment')$('#btn-to-review')?.click();
  return;
 }
 if(el.dataset.pref){
  const p=el.dataset.pref,i=state.prefs.indexOf(p);
  if(i>-1)state.prefs.splice(i,1);else state.prefs.push(p);
  el.classList.toggle('active');
  return;
 }
 if(el.id==='btn-to-payment'){
  state.guest={first:$('#g-first').value.trim(),last:$('#g-last').value.trim(),phone:$('#g-phone').value.trim(),email:$('#g-email').value.trim(),note:$('#g-note').value.trim()};
  state.arrival=$('#g-arrival').value;
  if(!state.guest.first||!state.guest.phone){alert('Вкажіть ім’я та телефон.');return}
  paymentScreen();
  return;
 }
 if(el.id==='btn-to-review'){
  if(!$('#terms-check').checked){alert('Підтвердьте погодження з правилами бронювання.');return}
  reviewScreen();
  return;
 }
 if(el.id==='btn-confirm-booking'){confirmBooking();return}
 if(el.id==='btn-save-booking'){alert('Деталі бронювання збережено (демо).');return}
 if(el.id==='btn-change-dates'){showScreen('screen-search');return}
 if(el.dataset.alt){const[s,eD]=el.dataset.alt.split(',');state.start=s;state.end=eD;renderSearchFields();showScreen('screen-search');renderResults();return}
 if(el.id==='btn-retry-search'){showScreen('screen-search');return}
 if(el.id==='map-link'||el.id==='link-rules'||el.id==='link-privacy'){e.preventDefault();alert('Ця сторінка ще у розробці в демонстраційній версії.');return}
});
document.addEventListener('input',e=>{
 if(e.target.id==='deposit-amount')state.depositAmount=Number(e.target.value)||0;
});

renderSearchFields();
hydrate();
