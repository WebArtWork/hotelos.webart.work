'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',plus:'M12 5v14M5 12h14',left:'M15 6l-6 6 6 6',right:'M9 6l6 6-6 6',filter:'M4 5h16M7 12h10M10 19h4',check:'M5 12l4 4L19 6'};
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
const weekdayShort=s=>['Нд','Пн','Вт','Ср','Чт','Пт','Сб'][toDate(s).getUTCDay()];
const monthLabel=s=>new Intl.DateTimeFormat('uk-UA',{month:'long',year:'numeric',timeZone:'UTC'}).format(toDate(s));
const isWeekend=s=>{const d=toDate(s).getUTCDay();return d===0||d===6};
const initials=n=>n.split(' ').slice(0,2).map(p=>p[0]).join('');

const TODAY='2026-09-17';
const rooms=[
 {number:'101',type:'Стандарт',cap:'2 гості'},{number:'102',type:'Стандарт',cap:'2 гості'},{number:'103',type:'Стандарт',cap:'2 гості'},{number:'104',type:'Стандарт',cap:'2 гості'},{number:'105',type:'Стандарт',cap:'2 гості'},
 {number:'106',type:'Покращений',cap:'2–3 гості'},{number:'107',type:'Покращений',cap:'2–3 гості'},{number:'108',type:'Покращений',cap:'2–3 гості'},
 {number:'201',type:'Люкс',cap:'2–3 гості'},{number:'202',type:'Люкс',cap:'2–3 гості'},{number:'203',type:'Люкс',cap:'2–3 гості'},{number:'204',type:'Люкс',cap:'2–3 гості'},{number:'205',type:'Люкс',cap:'2–3 гості'},
 {number:'301',type:'Апартаменти',cap:'4 гості'},{number:'302',type:'Апартаменти',cap:'4 гості'}
];
const basePrice={'Стандарт':1600,'Покращений':2000,'Люкс':2400,'Апартаменти':3200};
const groupOrder=['Стандарт','Покращений','Люкс','Апартаменти'];
const sources=['Пряме бронювання','Instagram','Google','Телефон','Booking.com','Walk-in','Інше'];

const seed=[
 {id:2001,room:'204',name:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',start:'2026-09-17',end:'2026-09-20',guests:2,total:4800,paid:4800,status:'confirmed',source:'Instagram',notes:'Потрібен тихий номер. Очікуваний час прибуття: 13:30.'},
 {id:2002,room:'103',name:'Олег Бондар',phone:'+380 50 222 11 33',email:'',start:'2026-09-17',end:'2026-09-18',guests:1,total:2400,paid:1200,status:'checkedin',source:'Телефон',notes:''},
 {id:2003,room:'202',name:'Марія Петренко',phone:'+380 63 456 78 90',email:'',start:'2026-09-17',end:'2026-09-21',guests:2,total:9600,paid:9600,status:'confirmed',source:'Booking.com',notes:''},
 {id:2004,room:'205',name:'Ірина Шевченко',phone:'+380 97 654 32 10',email:'',start:'2026-09-18',end:'2026-09-20',guests:2,total:4800,paid:0,status:'pending',source:'Пряме бронювання',notes:'Заїзд орієнтовно ввечері.'},
 {id:2005,room:'106',name:'Дмитро Левченко',phone:'+380 66 111 22 33',email:'',start:'2026-09-19',end:'2026-09-23',guests:2,total:8000,paid:4000,status:'confirmed',source:'Google',notes:''},
 {id:2006,room:'101',name:'Олена Романюк',phone:'+380 68 222 33 44',email:'',start:'2026-09-20',end:'2026-09-22',guests:1,total:3200,paid:3200,status:'confirmed',source:'Сайт',notes:''},
 {id:2007,room:'302',name:'Максим Ткаченко',phone:'+380 63 333 44 55',email:'',start:'2026-09-21',end:'2026-09-24',guests:4,total:9600,paid:4800,status:'pending',source:'Booking.com',notes:''},
 {id:2008,room:'107',name:'Андрій Мельник',phone:'+380 50 444 55 66',email:'',start:'2026-09-22',end:'2026-09-24',guests:2,total:4000,paid:4000,status:'confirmed',source:'Пряме бронювання',notes:''},
 {id:2009,room:'203',name:'Наталія Коваль',phone:'+380 97 555 66 77',email:'',start:'2026-09-23',end:'2026-09-27',guests:3,total:9600,paid:9600,status:'confirmed',source:'Google',notes:''},
 {id:2010,room:'104',name:'Тарас Гончар',phone:'+380 66 777 88 99',email:'',start:'2026-09-18',end:'2026-09-19',guests:2,total:1600,paid:0,status:'cancelled',source:'Instagram',notes:'Скасовано гостем.'},
 {id:2011,room:'201',name:'Юлія Савчук',phone:'+380 68 888 99 00',email:'',start:'2026-09-24',end:'2026-09-27',guests:2,total:7200,paid:7200,status:'confirmed',source:'Walk-in',notes:''},
 {id:2012,room:'102',name:'Віктор Коваль',phone:'+380 63 999 00 11',email:'',start:'2026-09-25',end:'2026-09-28',guests:2,total:4800,paid:2400,status:'pending',source:'Телефон',notes:''}
];
const blocked=[{room:'301',start:'2026-09-25',end:'2026-09-28',reason:'Ремонт'}];

const state={bookings:seed.map(b=>({...b})),viewStart:TODAY,viewDays:14,search:'',filters:{status:new Set(['confirmed','pending','checkedin','cancelled']),types:new Set(groupOrder)},mobileDate:TODAY,mobileDays:1,selectedId:null,pendingMove:null};

function bookingsOverlap(room,start,end,excludeId){
 if(blocked.some(bl=>bl.room===room&&start<bl.end&&end>bl.start))return true;
 return state.bookings.some(b=>b.room===room&&b.id!==excludeId&&b.status!=='cancelled'&&start<b.end&&end>b.start);
}
function alternativesFor(type,start,end,excludeRoom){
 return rooms.filter(r=>r.type===type&&r.number!==excludeRoom&&!bookingsOverlap(r.number,start,end,null));
}
function statusLabel(s){return {confirmed:'Підтверджено',pending:'Очікує підтвердження',checkedin:'Заїхав',cancelled:'Скасовано'}[s]}
function paymentLabel(b){return b.paid<=0?'Не оплачено':b.paid<b.total?'Частково оплачено':'Оплачено'}

/* ---------- desktop grid ---------- */
function dateRange(){return Array.from({length:state.viewDays},(_,i)=>addDays(state.viewStart,i))}
function visibleRooms(){return rooms.filter(r=>state.filters.types.has(r.type))}
function visibleBookings(){return state.bookings.filter(b=>state.filters.status.has(b.status))}

function renderGrid(){
 const dates=dateRange();
 $('#range-label').textContent=monthLabel(state.viewStart);
 const grid=$('#cal-grid');
 grid.style.gridTemplateColumns=`170px repeat(${dates.length},minmax(88px,1fr))`;
 let html=`<div class="cal-head-room">НОМЕР</div>`;
 dates.forEach(d=>{html+=`<div class="cal-head-cell ${isWeekend(d)?'weekend':''} ${d===TODAY?'today':''}">${Number(d.slice(-2))} ${weekdayShort(d)}<small>${d===TODAY?'Сьогодні':''}</small></div>`});
 let row=2;
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 groupOrder.forEach(type=>{
  const list=visibleRooms().filter(r=>r.type===type);
  if(!list.length)return;
  html+=`<div class="cal-group-label" style="grid-row:${row}">${esc(type)}</div>`;row++;
  list.forEach(r=>{
   html+=`<div class="cal-room-cell" style="grid-row:${row}"><b>${r.number}</b><span>${r.type} · ${r.cap}</span></div>`;
   dates.forEach((d,ci)=>{
    const occupied=bookingsOverlap(r.number,d,addDays(d,1),null);
    html+=`<div class="cal-day-cell ${isWeekend(d)?'weekend':''} ${d===TODAY?'today':''} ${occupied?'has-block':''}" style="grid-row:${row};grid-column:${ci+2}" data-room="${r.number}" data-date="${d}"></div>`;
   });
   const blk=blocked.find(bl=>bl.room===r.number);
   if(blk){
    const s=Math.max(0,dayDiff(state.viewStart,blk.start)),e=Math.min(dates.length,dayDiff(state.viewStart,blk.end));
    if(e>0&&s<dates.length)html+=`<div class="cal-blocked" style="grid-row:${row};grid-column:${s+2}/${e+2}">Недоступно<br>${esc(blk.reason)}</div>`;
   }
   visibleBookings().filter(b=>b.room===r.number).forEach(b=>{
    const s=Math.max(0,dayDiff(state.viewStart,b.start)),e=Math.min(dates.length,dayDiff(state.viewStart,b.end));
    if(e<=0||s>=dates.length)return;
    const match=q&&(b.name+' '+b.room+' #'+b.id).toLocaleLowerCase('uk-UA').includes(q);
    html+=`<div class="booking-block status-${b.status} ${b.id===state.selectedId?'selected':''} ${match?'match':''}" draggable="${b.status!=='cancelled'}" style="grid-row:${row};grid-column:${s+2}/${e+2}" data-booking="${b.id}" tabindex="0" role="button" aria-label="Бронювання ${esc(b.name)}"><b>${esc(b.name)}</b><div class="bb-meta"><span>${dates.length&&s>=0?Number(b.start.slice(-2)):''}–${Number(b.end.slice(-2))} · ${b.guests} гост.</span>${b.paid<b.total&&b.status!=='cancelled'?'<span class="bb-unpaid" title="Не оплачено"></span>':''}</div></div>`;
   });
   row++;
  });
 });
 grid.innerHTML=html;hydrate(grid);
}

function bookingCard(b){
 const r=rooms.find(r=>r.number===b.room);
 return `<div class="hover-card"><b>${esc(b.name)}</b><p>Номер ${b.room} · ${r?r.type:''}</p><p>${shortDate(b.start)} – ${shortDate(b.end)}</p><p>${dayDiff(b.start,b.end)} ночі · ${b.guests} гості</p><div class="hc-amount">${money(b.total)}</div><p>${paymentLabel(b)}</p><p>${esc(b.source)}</p></div>`;
}
let hoverEl=null;
function showHover(target,b){
 hideHover();
 hoverEl=document.createElement('div');
 hoverEl.innerHTML=bookingCard(b);hoverEl=hoverEl.firstElementChild;
 document.body.appendChild(hoverEl);
 const r=target.getBoundingClientRect();
 hoverEl.style.left=Math.min(window.innerWidth-236,r.left)+'px';
 hoverEl.style.top=(r.bottom+8+window.scrollY)+'px';
}
function hideHover(){if(hoverEl){hoverEl.remove();hoverEl=null}}

/* ---------- side panel ---------- */
function openSidePanel(id){
 const b=state.bookings.find(b=>b.id===Number(id));if(!b)return;
 state.selectedId=b.id;renderGrid();
 const r=rooms.find(r=>r.number===b.room);
 $('#side-body').innerHTML=`
 <span class="pill ${b.status==='checkedin'?'ready':b.status==='pending'?'gold':''}">${statusLabel(b.status)}</span>
 <h2>${esc(b.name)}</h2>
 <p>${b.phone?esc(b.phone):'Телефон не вказано'}${b.email?' · '+esc(b.email):''}</p>
 <h5>Проживання</h5>
 <div class="detail-grid"><div><small>Номер</small><b>${b.room} · ${r?r.type:''}</b></div><div><small>Ночей</small><b>${dayDiff(b.start,b.end)}</b></div><div><small>Гостей</small><b>${b.guests}</b></div></div>
 <p>Заїзд: <b>${shortDate(b.start)}, після 14:00</b><br>Виїзд: <b>${shortDate(b.end)}, до 11:00</b></p>
 <h5>Оплата</h5>
 <div class="detail-grid"><div><small>Загальна сума</small><b>${money(b.total)}</b></div><div><small>Оплачено</small><b>${money(b.paid)}</b></div><div><small>Статус</small><b>${paymentLabel(b)}</b></div></div>
 <h5>Джерело</h5><p>${esc(b.source)}</p>
 <h5>Нотатки</h5><p>${b.notes?esc(b.notes):'Нотаток немає.'}</p>
 <div class="dialog-actions">
  <button class="button primary full" data-panel-open="${b.id}">Відкрити бронювання</button>
  <button class="button secondary" data-panel-room="${b.id}">Змінити номер</button>
  <button class="button secondary" data-panel-message="${b.id}">Надіслати повідомлення</button>
  ${b.paid<b.total&&b.status!=='cancelled'?`<button class="button secondary" data-panel-payment="${b.id}">Додати оплату</button>`:''}
  ${b.status!=='cancelled'?`<button class="button secondary" data-panel-cancel="${b.id}">Скасувати бронювання</button>`:''}
 </div>`;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true;state.selectedId=null;renderGrid()}

/* ---------- dialog helpers (quick booking / confirm / conflict) ---------- */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function quickBooking(room,date){
 const r=rooms.find(r=>r.number===room)||rooms[0];
 const start=date||TODAY,end=addDays(start,1);
 const price=basePrice[r.type];
 show('Нове бронювання',`<form class="demo-form" id="quick-form" data-room="${r.number}">
  <label class="full">Гість<input name="name" required maxlength="70" placeholder="Ім’я або телефон"></label>
  <label>Номер<select name="room">${rooms.map(x=>`<option value="${x.number}" ${x.number===r.number?'selected':''}>${x.number} · ${x.type}</option>`).join('')}</select></label>
  <label>Гостей<input name="guests" type="number" min="1" max="8" value="2"></label>
  <label>Заїзд<input name="start" type="date" required value="${start}"></label>
  <label>Виїзд<input name="end" type="date" required value="${end}"></label>
  <label>Ціна, ₴<input name="total" type="number" min="1" value="${price}"></label>
  <label>Джерело<select name="source">${sources.map(s=>`<option>${s}</option>`).join('')}</select></label>
  <label class="full">Оплата<select name="payment"><option value="0">Не оплачено</option><option value="half">Передоплата</option><option value="full">Оплачено</option></select></label>
  <p id="quick-error" class="full balance" role="alert" hidden></p>
  <button class="button primary full" type="submit">Створити бронювання</button>
  <a class="text-action full" style="text-align:center" href="/new-booking/">Відкрити повну форму →</a>
 </form>`);
}
function conflictModal(room,start,end,type){
 const alts=alternativesFor(type,start,end,room);
 show('Ці дати вже зайняті',`<p>Номер ${room} недоступний ${shortDate(start)} – ${shortDate(end)}.</p>
 <div class="result-list">${alts.length?alts.map(a=>`<button class="result-item" data-pick-room="${a.number}" data-pick-start="${start}" data-pick-end="${end}"><span><b>${a.number} · ${a.type}</b><small>${a.cap}</small></span><span>Обрати →</span></button>`).join(''):'<p class="form-note">Вільних номерів цього типу немає на ці дати.</p>'}</div>`);
}
function confirmMoveModal(b,newRoom,newStart,newEnd){
 const nights=dayDiff(b.start,b.end);
 show('Перемістити бронювання?',`<p>${esc(b.name)}</p><div class="detail-grid"><div><small>Було</small><b>${b.room} · ${Number(b.start.slice(-2))}–${Number(b.end.slice(-2))} вер.</b></div><div><small>Буде</small><b>${newRoom} · ${Number(newStart.slice(-2))}–${Number(newEnd.slice(-2))} вер.</b></div><div><small>Ночей</small><b>${nights}</b></div></div>
 <div class="dialog-actions"><button class="button primary" id="confirm-move">Підтвердити</button><button class="button secondary" data-close>Скасувати</button></div>`);
}

/* ---------- mobile ---------- */
function renderMobile(){
 $('#m-date').textContent=shortDate(state.mobileDate);
 const dates=Array.from({length:state.mobileDays},(_,i)=>addDays(state.mobileDate,i));
 const wrap=$('#mobile-rooms');
 wrap.innerHTML=rooms.map(r=>{
  const b=state.bookings.find(x=>dates.some(d=>x.room===r.number&&x.status!=='cancelled'&&d>=x.start&&d<x.end));
  const blk=blocked.find(x=>x.room===r.number&&dates.some(d=>d>=x.start&&d<x.end));
  if(blk)return `<div class="mobile-room-card"><div class="mrc-head"><b>${r.number}</b><span class="pill">Недоступно</span></div><p>${esc(blk.reason)}</p></div>`;
  if(b)return `<div class="mobile-room-card" data-booking="${b.id}"><div class="mrc-head"><b>${r.number}</b><span class="pill ${b.status==='checkedin'?'ready':b.status==='pending'?'gold':''}">${statusLabel(b.status)}</span></div><p class="mrc-guest">${esc(b.name)}</p><p>${Number(b.start.slice(-2))}–${Number(b.end.slice(-2))} вересня</p><p>${paymentLabel(b)}</p></div>`;
  return `<div class="mobile-room-card"><div class="mrc-head"><b>${r.number}</b><span class="pill ready">Вільний</span></div><p>${r.type} · ${r.cap}</p><button class="button secondary" data-quick-room="${r.number}" data-quick-date="${state.mobileDate}">+ Бронювання</button></div>`;
 }).join('');
}

/* ---------- render all ---------- */
function render(){renderGrid();renderMobile();hydrate()}

/* ---------- events ---------- */
$('#prev-range').addEventListener('click',()=>{state.viewStart=addDays(state.viewStart,-state.viewDays);render()});
$('#next-range').addEventListener('click',()=>{state.viewStart=addDays(state.viewStart,state.viewDays);render()});
$('#today-btn').addEventListener('click',()=>{state.viewStart=TODAY;state.mobileDate=TODAY;render()});
$$('.cal-views button').forEach(btn=>btn.addEventListener('click',()=>{$$('.cal-views button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.viewDays=Number(btn.dataset.days);render()}));
$('#m-prev').addEventListener('click',()=>{state.mobileDate=addDays(state.mobileDate,-state.mobileDays);renderMobile()});
$('#m-next').addEventListener('click',()=>{state.mobileDate=addDays(state.mobileDate,state.mobileDays);renderMobile()});
$$('.mobile-tabs button').forEach(btn=>btn.addEventListener('click',()=>{$$('.mobile-tabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.mobileDays=Number(btn.dataset.mdays);renderMobile()}));
$('#filters-toggle').addEventListener('click',()=>{$('#filters-panel').hidden=!$('#filters-panel').hidden});
$('#filters-clear').addEventListener('click',()=>{$$('#filters-panel input[type=checkbox]').forEach(c=>c.checked=true)});
$('#filters-apply').addEventListener('click',()=>{
 state.filters.status=new Set($$('#filters-panel section:first-of-type input:checked').map(c=>c.value));
 state.filters.types=new Set($$('#filters-panel section:last-of-type input:checked').map(c=>c.value));
 $('#filters-panel').hidden=true;render();
});
$('#cal-search').addEventListener('input',e=>{state.search=e.target.value;renderGrid()});
$('#side-close').addEventListener('click',closeSidePanel);
$('#side-scrim').addEventListener('click',closeSidePanel);

document.addEventListener('click',e=>{
 const filters=e.target.closest('.filters-wrap');
 if(!filters&&!$('#filters-panel').hidden)$('#filters-panel').hidden=true;
 const el=e.target.closest('button,a,[data-booking],[data-room]');
 if(!el)return;
 if(el.matches('[data-close]'))closeDialog();
 else if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;el.setAttribute('aria-expanded',String(opened))}
 else if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true}
 else if(el.dataset.action==='new-booking')quickBooking(rooms[0].number,TODAY);
 else if(el.dataset.action==='search')show('Пошук','<p>Використайте поле пошуку в панелі інструментів календаря.</p>');
 else if(el.dataset.action==='notifications')show('Сповіщення','<p>Демонстраційні сповіщення недоступні на цій сторінці.</p>');
 else if(el.dataset.action==='profile')show('Профіль','<p>Демонстраційний профіль власника.</p>');
 else if(el.dataset.view==='ai')show('Hotel AI','<p>AI-помічник доступний з головної сторінки огляду.</p>');
 else if(el.dataset.view)show(el.textContent.trim(),'<p>Цей розділ ще у розробці в демонстраційній версії.</p>');
 else if(el.dataset.quickRoom)quickBooking(el.dataset.quickRoom,el.dataset.quickDate);
 else if(el.dataset.pickRoom){conflictPick(el.dataset.pickRoom,el.dataset.pickStart,el.dataset.pickEnd)}
 else if(el.id==='confirm-move')applyPendingMove();
 else if(el.dataset.panelOpen)window.location.href='/booking/';
 else if(el.dataset.panelRoom)toast('Оберіть новий номер перетягнувши бронювання в календарі · Демо');
 else if(el.dataset.panelMessage){const b=state.bookings.find(b=>b.id===Number(el.dataset.panelMessage));show('Повідомлення гостю',`<p>${esc(b.name)}</p><form class="demo-form" id="message-form"><label class="full">Текст повідомлення<textarea name="message" required maxlength="500">Добрий день, ${esc(b.name.split(' ')[0])}! Чекаємо на вас у Grand Hotel.</textarea></label><button class="button primary full" type="submit">Підготувати чернетку</button></form>`)}
 else if(el.dataset.panelPayment){const b=state.bookings.find(b=>b.id===Number(el.dataset.panelPayment));show('Додати оплату',`<p>${esc(b.name)} · Залишок ${money(b.total-b.paid)}</p><form class="demo-form" id="payment-form" data-id="${b.id}"><label class="full">Сума, ₴<input name="amount" type="number" required min="1" max="${b.total-b.paid}" value="${b.total-b.paid}"></label><button class="button primary full" type="submit">Підтвердити оплату</button></form>`)}
 else if(el.dataset.panelCancel){const b=state.bookings.find(b=>b.id===Number(el.dataset.panelCancel));b.status='cancelled';closeSidePanel();render();toast('Бронювання скасовано · Демо')}
 else if(el.dataset.booking){openSidePanel(el.dataset.booking)}
});

document.addEventListener('mouseover',e=>{const el=e.target.closest('.booking-block');if(el){const b=state.bookings.find(b=>b.id===Number(el.dataset.booking));if(b)showHover(el,b)}});
document.addEventListener('mouseout',e=>{if(e.target.closest('.booking-block'))hideHover()});

document.addEventListener('click',e=>{
 const cell=e.target.closest('.cal-day-cell');
 if(cell&&!cell.classList.contains('has-block'))quickBooking(cell.dataset.room,cell.dataset.date);
});

/* drag & drop */
let dragId=null;
document.addEventListener('dragstart',e=>{const el=e.target.closest('.booking-block');if(el){dragId=Number(el.dataset.booking);e.dataTransfer.setData('text/plain',String(dragId))}});
document.addEventListener('dragover',e=>{if(e.target.closest('.cal-day-cell'))e.preventDefault()});
document.addEventListener('drop',e=>{
 const cell=e.target.closest('.cal-day-cell');if(!cell||dragId==null)return;e.preventDefault();
 const b=state.bookings.find(b=>b.id===dragId);if(!b)return;
 const nights=dayDiff(b.start,b.end);
 const newStart=cell.dataset.date,newEnd=addDays(newStart,nights),newRoom=cell.dataset.room;
 dragId=null;
 if(newRoom===b.room&&newStart===b.start)return;
 if(bookingsOverlap(newRoom,newStart,newEnd,b.id)){conflictModal(newRoom,newStart,newEnd,rooms.find(r=>r.number===newRoom).type);return}
 state.pendingMove={id:b.id,room:newRoom,start:newStart,end:newEnd};
 confirmMoveModal(b,newRoom,newStart,newEnd);
});
function applyPendingMove(){
 const m=state.pendingMove;if(!m)return;
 const b=state.bookings.find(b=>b.id===m.id);
 b.room=m.room;b.start=m.start;b.end=m.end;
 state.pendingMove=null;closeDialog();render();toast('Бронювання переміщено · Демо');
}
function conflictPick(room,start,end){closeDialog();quickBooking(room,start);setTimeout(()=>{const f=$('#quick-form');if(f)f.end.value=end},0)}

document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='quick-form'){
  const name=String(data.get('name')).trim(),room=String(data.get('room')),start=String(data.get('start')),end=String(data.get('end')),type=rooms.find(r=>r.number===room).type;
  const err=$('#quick-error');
  if(!name){err.textContent='Вкажіть ім’я гостя.';err.hidden=false;return}
  if(end<=start){err.textContent='Виїзд має бути після заїзду.';err.hidden=false;return}
  if(bookingsOverlap(room,start,end,null)){closeDialog();conflictModal(room,start,end,type);return}
  const payment=String(data.get('payment')),total=Number(data.get('total'));
  const b={id:Math.max(...state.bookings.map(b=>b.id))+1,room,name,phone:'',email:'',start,end,guests:Number(data.get('guests')),total,paid:payment==='full'?total:payment==='half'?Math.round(total/2):0,status:'confirmed',source:String(data.get('source')),notes:''};
  state.bookings.push(b);closeDialog();render();toast('Бронювання створено · #'+b.id);
 }else if(f.id==='payment-form'){
  const b=state.bookings.find(b=>b.id===Number(f.dataset.id)),amount=Number(data.get('amount'));
  if(amount<=0||amount>b.total-b.paid)return;
  b.paid+=amount;closeDialog();render();openSidePanel(b.id);toast('Оплату додано · '+money(amount));
 }else if(f.id==='message-form'){closeDialog();toast('Чернетку повідомлення підготовлено · Демо')}
});
for(const d of [dialog])d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSidePanel();$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true}});

render();
