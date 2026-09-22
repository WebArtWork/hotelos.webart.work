'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const HOTEL={name:'Grand Hotel',address:'вул. Старобульварна, 10, Кам’янець-Подільський',phone:'+380 67 123 45 67',email:'hotel@example.com',checkIn:'14:00',checkOut:'11:00',reception:'08:00–23:00',breakfast:'08:00–10:00',wifi:'GrandHotel'};
const booking={
 id:1842,guestFirst:'Анна',guest:'Анна Коваленко',start:'17 вересня',end:'20 вересня',year:'2026',nights:3,adults:2,
 roomType:'Люкс',roomNumber:'204',capacity:2,area:28,beds:'1 двоспальне ліжко',features:['Wi-Fi','Кондиціонер','Сніданок','Балкон'],
 total:4800,paid:1500,deposit:1500,
 arrivalTime:'14:30',
 prefs:['Тихий номер'],
 cancellation:'Безкоштовно до 48 годин до заїзду.'
};
const state={view:'return',arrivalTime:booking.arrivalTime};

function balance(){return booking.total-booking.paid}
function statusHeader(kind){
 const map={
  confirmed:{icon:'✓',cls:'',h:'Бронювання підтверджено',sub:`Дякуємо, ${booking.guestFirst}!<br>Ми очікуємо вас у ${HOTEL.name}.`,pill:['confirmed','Підтверджено']},
  return:{icon:'✓',cls:'',h:'Ваше бронювання',sub:`${HOTEL.name}<br>${booking.start}–${booking.end} ${booking.year}`,pill:['confirmed','Підтверджено']},
  staying:{icon:'✦',cls:'gold',h:'Гарного відпочинку!',sub:`Ви зараз проживаєте в ${HOTEL.name}.`,pill:['staying','Заїхав']},
  done:{icon:'✓',cls:'muted',h:'Дякуємо, що гостювали у нас',sub:`Сподіваємося, вам сподобалося проживання в ${HOTEL.name}.`,pill:['done','Завершено']},
  cancelled:{icon:'✕',cls:'danger',h:'Бронювання скасовано',sub:'Це бронювання більше не активне.',pill:['cancelled','Скасовано']}
 };
 const m=map[kind];
 return `<div class="status-header" id="status-header"><div class="status-icon ${m.cls}">${m.icon}</div><h1>${m.h}</h1><p>${m.sub}</p><div class="booking-number">Номер бронювання #${booking.id}</div><span class="status-pill ${m.pill[0]}">${m.pill[1]}</span></div>`;
}
function stayCard(){
 return `<div class="card" id="stay-details"><h2>Деталі проживання</h2><div class="stay-grid">
  <div><small>Заїзд</small><b>${booking.start}</b><span>після ${HOTEL.checkIn}</span></div>
  <div><small>Виїзд</small><b>${booking.end}</b><span>до ${HOTEL.checkOut}</span></div>
  <div><small>Тривалість</small><b>${booking.nights} ночі</b></div>
  <div><small>Гості</small><b>${booking.adults} дорослих</b></div>
 </div></div>`;
}
function roomCard(){
 return `<div class="card" id="room-card"><h2>Номер</h2><div class="room-visual">
  <figure class="room-image">${HotelPhotos.image(booking.roomType)}<figcaption>Ілюстративне фото · Згенеровано AI</figcaption></figure>
  <div><h3>${booking.roomType}${booking.roomNumber?' · '+booking.roomNumber:''}</h3><div class="facts">До ${booking.capacity} гостей · ${booking.area} м² · ${booking.beds}</div><div class="feature-tags">${booking.features.map(f=>`<span>${f}</span>`).join('')}</div><button class="btn secondary" style="margin-top:12px" id="btn-room-details">Детальніше про номер</button></div>
 </div></div>`;
}
function paymentCard(kind){
 const bal=balance();
 let statusLabel='',note='',action='';
 if(kind==='pending'){statusLabel='Перевіряємо оплату';note='Номер утримано за вами, поки перевіряється оплата (зазвичай кілька секунд). Бронювання ще не підтверджено остаточно.';action=`<button class="btn secondary" id="btn-refresh-status">Оновити статус</button>`}
 else if(kind==='failed'){statusLabel='Оплату не завершено';note='Номер НЕ заброньовано — оплату не було завершено, тому місце не утримується. Спробуйте оплатити ще раз або зв’яжіться з готелем, щоб утримати номер іншим способом.';action=`<div class="action-row"><button class="btn primary" id="btn-retry-pay">Спробувати оплатити ще раз</button><button class="btn secondary" id="btn-contact-2">Зв’язатися з готелем</button></div>`}
 else if(bal<=0){statusLabel='Оплачено повністю';note='Додаткових платежів за проживання не очікується.'}
 else{statusLabel='Частково оплачено';note='Залишок можна оплатити під час заселення.';action=`<button class="btn primary full" id="btn-pay-balance">Оплатити ${money(bal)}</button><p class="pay-note">Безпечна онлайн-оплата.</p>`}
 return `<div class="card" id="payment-card"><h2>Оплата</h2><div class="pay-figures"><div><b>${money(booking.total)}</b><small>Загальна сума</small></div><div><b>${money(kind==='failed'||kind==='pending'?0:booking.paid)}</b><small>Оплачено</small></div><div><b>${money(kind==='failed'||kind==='pending'?booking.total:bal)}</b><small>Залишок</small></div></div><span class="status-pill ${bal<=0&&kind!=='failed'&&kind!=='pending'?'confirmed':kind==='failed'?'failed':'partial'}">${statusLabel}</span><p class="pay-note">${note}</p>${action}</div>`;
}
function arrivalCard(){
 return `<div class="card" id="arrival-card"><h2>Перед заїздом</h2>
 <div class="arrival-row"><div><small>Час заселення</small><b>Після ${HOTEL.checkIn}</b></div></div>
 <div class="arrival-row" style="margin-top:12px"><div><small>Орієнтовний час прибуття</small><b>${state.arrivalTime?state.arrivalTime:'Час ще не вказано'}</b></div><button class="btn secondary" id="btn-update-arrival">${state.arrivalTime?'Змінити час прибуття':'Повідомити час прибуття'}</button></div>
 <p class="pay-note" style="margin-top:14px">Рецепція працює з ${HOTEL.reception}. Після прибуття зверніться на рецепцію та назвіть номер бронювання: <b>#${booking.id}</b>.</p>
 </div>`;
}
function requestsCard(){
 return `<div class="card" id="requests-card"><h2>Ваші побажання</h2>${booking.prefs.length?`<div class="tags">${booking.prefs.map(p=>`<span>${esc(p)}</span>`).join('')}</div>`:''}<p class="pay-note">Ми врахуємо побажання, якщо це буде можливо.</p><button class="btn secondary" id="btn-add-request">Додати побажання</button></div>`;
}
function locationCard(){
 return `<div class="card" id="location-card"><h2>Як нас знайти</h2><p style="font-size:13px;margin:0 0 12px"><b>${HOTEL.name}</b><br>${HOTEL.address}</p><div class="action-row"><button class="btn secondary" id="btn-open-map">Відкрити карту</button><button class="btn secondary" id="btn-directions">Прокласти маршрут</button></div></div>`;
}
function contactCard(){
 return `<div class="card" id="contact-card"><h2>Потрібна допомога?</h2><p class="pay-note">Якщо плани змінилися або маєте питання — зв’яжіться з нами.</p><div class="action-row"><a class="btn secondary" href="tel:${HOTEL.phone.replace(/\s/g,'')}">Зателефонувати</a><button class="btn secondary" id="btn-message-hotel">Написати</button></div><div class="contact-block"><b>${HOTEL.phone}</b><br>${HOTEL.email}</div></div>`;
}
function rulesCard(){
 return `<div class="card" id="rules-card"><h2>Правила бронювання</h2><div class="rules-grid"><div><small>Заселення</small>після ${HOTEL.checkIn}</div><div><small>Виїзд</small>до ${HOTEL.checkOut}</div><div><small>Скасування</small>${booking.cancellation}</div><div><small>Передоплата</small>${money(booking.deposit)}</div></div><button class="text-link" id="btn-full-rules" style="margin-top:12px;font-size:11px;font-weight:700;color:#8b6c30">Повні правила →</button></div>`;
}
function modifyCard(){
 return `<div class="card"><h2>Хочете змінити бронювання?</h2><p class="pay-note">Змінити дати, номер або кількість гостей можна лише через готель.</p><button class="btn secondary" id="btn-modify">Зв’язатися з готелем</button></div>`;
}
function timelineCard(){
 return `<div class="card" id="timeline-card"><h2>Статус бронювання</h2><div class="timeline-mini">
  <div class="done"><span class="dot"></span>Бронювання створено</div>
  <div class="${booking.paid>0?'done':''}"><span class="dot"></span>Передоплату отримано</div>
  <div><span class="dot"></span>Заїзд · ${booking.start}</div>
  <div><span class="dot"></span>Виїзд · ${booking.end}</div>
 </div></div>`;
}
function upcomingCard(){
 return `<div class="card" id="upcoming-card"><h2>Що буде далі</h2>
 <div class="upcoming-msg"><b>За день до приїзду</b><span>Ми надішлемо нагадування та інформацію про заселення.</span></div>
 <div class="upcoming-msg"><b>У день заїзду</b><span>За потреби уточнимо час вашого прибуття.</span></div>
 </div>`;
}
function duringStayCard(){
 return `<div class="card" id="during-stay-card"><h2>Інформація про проживання</h2><div class="rules-grid"><div><small>Wi-Fi</small>${HOTEL.wifi}</div><div><small>Сніданок</small>${HOTEL.breakfast}</div><div><small>Рецепція</small>${HOTEL.reception}</div><div><small>Check-out</small>до ${HOTEL.checkOut}</div></div></div>`;
}
function actionsRow(kind){
 if(kind==='return'||kind==='confirmed'){
  return `<div class="action-row"><button class="btn secondary" id="btn-add-calendar">Додати до календаря</button><button class="btn secondary" id="btn-save">Зберегти підтвердження</button><button class="btn secondary" id="btn-share">Поділитися</button></div>`;
 }
 if(kind==='staying')return `<div class="action-row"><button class="btn secondary" id="btn-message-hotel">Написати готелю</button></div>`;
 return '';
}

function renderSticky(){
 const bar=$('#sticky-pay');
 if(state.view==='return'&&balance()>0){
  bar.classList.add('show');
  bar.innerHTML=`<span style="font-size:12px;color:#707174">Залишок: <b style="color:#161616">${money(balance())}</b></span><button class="btn primary" id="btn-pay-balance-sticky">Оплатити ${money(balance())}</button>`;
 }else{bar.classList.remove('show');bar.innerHTML=''}
}

function render(){
 const v=state.view;
 const main=$('#main');
 if(v==='invalid'){
  main.innerHTML=`<div class="expired-wrap"><h2>Не вдалося відкрити бронювання</h2><p>Посилання недійсне або більше не доступне.</p><a class="btn primary" href="tel:${HOTEL.phone.replace(/\s/g,'')}">Зв’язатися з готелем</a></div>`;
  renderSticky();return;
 }
 if(v==='cancelled'){
  main.innerHTML=`${statusHeader('cancelled')}
  <div class="two-col"><div>
   <div class="card"><h2>Бронювання</h2><div class="stay-grid" style="grid-template-columns:1fr 1fr"><div><small>Дати</small><b>${booking.start}–${booking.end}</b></div><div><small>Номер</small><b>${booking.roomType}</b></div></div></div>
   ${booking.paid>0?`<div class="card"><h2>Повернення</h2><b style="font-size:20px;display:block">${money(booking.paid)}</b><span class="status-pill confirmed" style="margin-top:8px">Повернення виконано</span></div>`:''}
  </div><div>${contactCard()}</div></div>
  <div class="action-row" style="justify-content:center;margin-top:8px"><a class="btn primary" href="/new-booking/">Створити нове бронювання</a><a class="btn secondary" href="tel:${HOTEL.phone.replace(/\s/g,'')}">Зв’язатися з готелем</a></div>`;
  renderSticky();return;
 }
 if(v==='done'){
  main.innerHTML=`${statusHeader('done')}
  <div class="two-col"><div>
   <div class="card"><h2>Проживання</h2><div class="stay-grid" style="grid-template-columns:1fr 1fr"><div><small>Дати</small><b>${booking.start}–${booking.end}</b></div><div><small>Номер</small><b>${booking.roomType}</b></div></div></div>
   ${timelineCard()}
  </div><div>${contactCard()}</div></div>
  <div class="action-row" style="justify-content:center;margin-top:8px"><a class="btn primary" href="/book/">Забронювати знову</a><button class="btn secondary" id="btn-review">Залишити відгук</button></div>`;
  renderSticky();hydrateEvents();return;
 }

 const headerKind=v==='new'?'confirmed':v==='staying'?'staying':'return';
 let paymentKind='normal';
 if(v==='paid')paymentKind='paid';else if(v==='pending')paymentKind='pending';else if(v==='failed')paymentKind='failed';
 const effectivePaid=v==='paid'?booking.total:v==='failed'||v==='pending'?0:booking.paid;
 const origPaid=booking.paid;booking.paid=effectivePaid;

 main.innerHTML=`${statusHeader(headerKind)}
 <div class="two-col">
  <div>
   ${stayCard()}
   ${roomCard()}
   ${v==='staying'?duringStayCard():arrivalCard()}
   ${requestsCard()}
   ${v!=='staying'?upcomingCard():''}
  </div>
  <div>
   ${paymentCard(paymentKind)}
   ${locationCard()}
   ${contactCard()}
   ${rulesCard()}
   ${v!=='staying'?modifyCard():''}
  </div>
 </div>
 ${actionsRow(v==='new'?'confirmed':v)}
 `;
 booking.paid=origPaid;
 renderSticky();
 hydrateEvents();
}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function arrivalModal(){
 const opts=['До 14:00','14:00–16:00','16:00–18:00','18:00–22:00','Після 22:00','Ще не знаю'];
 show('Коли ви плануєте приїхати?',`<div class="option-cards">${opts.map(o=>`<button data-pick-arrival="${o}">${o}</button>`).join('')}</div><label style="display:block;font-size:11.5px;color:#707174;margin-bottom:6px">Або точний час</label><input type="time" id="arrival-exact" style="border:1px solid #dedfe1;border-radius:8px;padding:9px;font-size:13px;margin-bottom:14px;width:100%"><button class="btn primary full" id="save-arrival">Зберегти</button>`);
}
function requestModal(){
 show('Додаткове побажання',`<div class="tag-pick" id="req-tags"><button type="button" data-req="Тихий номер">Тихий номер</button><button type="button" data-req="Дитяче ліжечко">Дитяче ліжечко</button><button type="button" data-req="Ранній заїзд">Ранній заїзд</button><button type="button" data-req="Пізній заїзд">Пізній заїзд</button></div><textarea id="req-text" placeholder="Напишіть побажання"></textarea><button class="btn primary full" id="save-request">Надіслати</button>`);
}
function contactModal(){
 show('Потрібна допомога?',`<p style="font-size:12.5px;color:#707174;margin-bottom:14px">Якщо плани змінилися або маєте питання — зв’яжіться з нами.</p><div class="action-row"><a class="btn primary" href="tel:${HOTEL.phone.replace(/\s/g,'')}">Зателефонувати</a><button class="btn secondary" id="msg-hotel-inner">Написати</button></div><div class="contact-block" style="margin-top:14px"><b>${HOTEL.phone}</b><br>${HOTEL.email}</div>`);
}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.id==='dialog-close'){closeDialog();return}
 if(el.id==='btn-update-arrival'){arrivalModal();return}
 if(el.dataset.pickArrival){$$('[data-pick-arrival]').forEach(b=>b.classList.remove('selected'));el.classList.add('selected');$('#arrival-exact').dataset.picked=el.dataset.pickArrival;return}
 if(el.id==='save-arrival'){
  const picked=$('#arrival-exact').value||$('#arrival-exact').dataset.picked||'Ще не знаю';
  state.arrivalTime=picked;
  closeDialog();render();toast('Час прибуття збережено. Рецепція вже бачить оновлення.');
  return;
 }
 if(el.id==='btn-add-request'){requestModal();return}
 if(el.dataset.req){el.classList.toggle('active');return}
 if(el.id==='save-request'){
  $$('#req-tags button.active').forEach(b=>booking.prefs.includes(b.dataset.req)||booking.prefs.push(b.dataset.req));
  closeDialog();render();toast('Побажання надіслано готелю');
  return;
 }
 if(el.id==='btn-contact-top'||el.id==='btn-contact-2'||el.id==='btn-modify'){contactModal();return}
 if(el.id==='msg-hotel-inner'||el.id==='btn-message-hotel'){closeDialog();toast('Функція повідомлень доступна незабаром');return}
 if(el.id==='btn-room-details'){toast('Детальна сторінка номера ще у розробці в демо');return}
 if(el.id==='btn-pay-balance'||el.id==='btn-pay-balance-sticky'||el.id==='btn-retry-pay'){toast('Перенаправлення на безпечну оплату... (демо)');return}
 if(el.id==='btn-refresh-status'){toast('Статус оплати оновлено (демо)');return}
 if(el.id==='btn-open-map'||el.id==='btn-directions'){toast('Карти ще у розробці в демо');return}
 if(el.id==='btn-full-rules'){toast('Повні правила бронювання ще у розробці в демо');return}
 if(el.id==='btn-add-calendar'){toast('Подію додано до календаря (демо .ics)');return}
 if(el.id==='btn-save'){toast('Підтвердження збережено');return}
 if(el.id==='btn-share'){if(navigator.share){navigator.share({title:'Моє бронювання — Grand Hotel',text:`Бронювання #${booking.id}`,url:location.href}).catch(()=>{})}else toast('Посилання скопійовано (демо)')}
 if(el.id==='btn-review'){toast('Форма відгуку ще у розробці в демо');return}
});
document.addEventListener('change',e=>{if(e.target.id==='demo-state'){state.view=e.target.value;render()}});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function hydrateEvents(){}

render();
