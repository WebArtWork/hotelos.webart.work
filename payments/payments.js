'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>(n<0?'−':'')+new Intl.NumberFormat('uk-UA').format(Math.abs(n))+' ₴';
const TODAY='2026-09-17';
const dayDiff=(a,b)=>Math.round((new Date(b)-new Date(a))/86400000);
const fmt=d=>new Intl.DateTimeFormat('uk-UA',{day:'numeric',month:'long'}).format(new Date(d));

const payments=[
 {id:1,date:'2026-09-17',time:'10:42',guest:'Анна Коваленко',bookingId:1842,room:'204',roomType:'Люкс',type:'Доплата',method:'Карта',amount:1800,status:'success',note:'Оплата при заселенні.',createdBy:'Олександр',dates:'17–20 вересня'},
 {id:2,date:'2026-09-17',time:'09:14',guest:'Олег Бондар',bookingId:1847,room:'103',roomType:'Стандарт',type:'Передоплата',method:'Банківський переказ',amount:1500,status:'success',note:'',createdBy:'Олександр',dates:'17–18 вересня'},
 {id:3,date:'2026-09-17',time:'08:40',guest:'Максим Ткаченко',bookingId:1855,room:'106',roomType:'Покращений',type:'Оплата',method:'Готівка',amount:2000,status:'success',note:'',createdBy:'Марія',dates:'16–19 вересня'},
 {id:4,date:'2026-09-17',time:'07:55',guest:'Дмитро Левченко',bookingId:1866,room:'112',roomType:'Покращений',type:'Оплата',method:'Онлайн',amount:5800,status:'success',note:'Оплата через сайт бронювання.',createdBy:'Онлайн',dates:'17–20 вересня'},
 {id:5,date:'2026-09-16',time:'18:20',guest:'Марія Петренко',bookingId:1812,room:'202',roomType:'Люкс',type:'Повернення',method:'Карта',amount:-2400,status:'refunded',note:'Скорочення терміну проживання.',createdBy:'Олександр',dates:'10–14 вересня'},
 {id:6,date:'2026-09-16',time:'11:05',guest:'Наталія Коваль',bookingId:1858,room:'203',roomType:'Люкс',type:'Передоплата',method:'Карта',amount:3000,status:'success',note:'',createdBy:'Олександр',dates:'18–21 вересня'},
 {id:7,date:'2026-09-15',time:'15:30',guest:'Андрій Мельник',bookingId:1860,room:'107',roomType:'Покращений',type:'Оплата',method:'Банківський переказ',amount:1600,status:'success',note:'',createdBy:'Марія',dates:'20–22 вересня'},
 {id:8,date:'2026-09-14',time:'12:11',guest:'Тарас Гончар',bookingId:1862,room:'101',roomType:'Стандарт',type:'Передоплата',method:'Готівка',amount:1400,status:'success',note:'',createdBy:'Олександр',dates:'22–23 вересня'},
 {id:9,date:'2026-09-12',time:'09:40',guest:'Юлія Савчук',bookingId:1864,room:'302',roomType:'Апартаменти',type:'Оплата',method:'Карта',amount:4000,status:'success',note:'',createdBy:'Олександр',dates:'24–27 вересня'},
 {id:10,date:'2026-09-10',time:'14:00',guest:'Віктор Коваль',bookingId:1690,room:'205',roomType:'Люкс',type:'Оплата',method:'Онлайн',amount:5400,status:'success',note:'',createdBy:'Онлайн',dates:'5–8 вересня'},
 {id:11,date:'2026-09-08',time:'10:22',guest:'Олена Романюк',bookingId:1671,room:'101',roomType:'Стандарт',type:'Оплата',method:'Карта',amount:3200,status:'success',note:'',createdBy:'Олександр',dates:'1–3 вересня'},
 {id:12,date:'2026-09-05',time:'17:15',guest:'Ірина Шевченко',bookingId:1652,room:'204',roomType:'Люкс',type:'Повернення',method:'Банківський переказ',amount:-1000,status:'refunded',note:'Помилкова оплата.',createdBy:'Олександр',dates:'28–30 серпня'}
];
const outstanding=[
 {bookingId:1847,guest:'Олег Бондар',room:'103',roomType:'Стандарт',dates:'17–18 вересня',total:3200,paid:2000,checkin:'2026-09-17',staying:false},
 {bookingId:1851,guest:'Ірина Шевченко',room:'205',roomType:'Люкс',dates:'19–22 вересня',total:6400,paid:0,checkin:'2026-09-19',staying:false},
 {bookingId:1855,guest:'Максим Ткаченко',room:'106',roomType:'Покращений',dates:'16–19 вересня',total:4000,paid:2000,checkin:'2026-09-16',staying:true},
 {bookingId:1858,guest:'Наталія Коваль',room:'203',roomType:'Люкс',dates:'18–21 вересня',total:5200,paid:3000,checkin:'2026-09-18',staying:false},
 {bookingId:1860,guest:'Андрій Мельник',room:'107',roomType:'Покращений',dates:'20–22 вересня',total:3600,paid:1600,checkin:'2026-09-20',staying:false},
 {bookingId:1862,guest:'Тарас Гончар',room:'101',roomType:'Стандарт',dates:'22–23 вересня',total:2400,paid:1400,checkin:'2026-09-22',staying:false},
 {bookingId:1864,guest:'Юлія Савчук',room:'302',roomType:'Апартаменти',dates:'24–27 вересня',total:6000,paid:4000,checkin:'2026-09-24',staying:false}
];

function remaining(o){return o.total-o.paid}
function outstandingRank(o){if(o.staying)return 0;if(o.checkin===TODAY)return 1;if(dayDiff(TODAY,o.checkin)===1)return 2;return 3}
function outstandingStatusLabel(o){if(o.staying)return'Гість проживає';if(o.checkin===TODAY)return'Заїжджає сьогодні';if(dayDiff(TODAY,o.checkin)===1)return'Заїжджає завтра';return'Майбутнє бронювання'}

const state={period:'month',tab:'all',search:'',filters:{methods:new Set(['Готівка','Карта','Банківський переказ','Онлайн','Інше']),types:new Set(['Оплата','Передоплата','Доплата','Повернення'])}};

function passesFilters(p){
 if(!state.filters.methods.has(p.method))return false;
 if(!state.filters.types.has(p.type))return false;
 return true;
}
function filteredPayments(){
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 let list=payments.filter(passesFilters);
 if(q)list=list.filter(p=>(p.guest+' #'+p.bookingId+' '+p.room).toLocaleLowerCase('uk-UA').includes(q));
 if(state.tab==='success')list=list.filter(p=>p.status==='success'&&p.type!=='Повернення');
 else if(state.tab==='refunded')list=list.filter(p=>p.status==='refunded');
 else if(state.tab==='partial')list=list.filter(p=>p.type==='Передоплата');
 else if(state.tab==='pending')list=[];
 return list.slice().sort((a,b)=>new Date(b.date+'T'+b.time)-new Date(a.date+'T'+a.time));
}

function renderKpis(){
 const todays=payments.filter(p=>p.date===TODAY&&p.status==='success');
 const receivedToday=todays.reduce((s,p)=>s+p.amount,0);
 const outstandingTotal=outstanding.reduce((s,o)=>s+remaining(o),0);
 const deposits=payments.filter(p=>p.type==='Передоплата').reduce((s,p)=>s+p.amount,0);
 const monthRefunds=payments.filter(p=>p.status==='refunded').reduce((s,p)=>s+Math.abs(p.amount),0);
 $('#kpis').innerHTML=`<div class="kpi"><small>Отримано сьогодні</small><b>${money(receivedToday)}</b><span>${todays.length} платежів</span></div><div class="kpi gold"><small>Очікується</small><b>${money(outstandingTotal)}</b><span>${outstanding.length} бронювань</span></div><div class="kpi"><small>Передоплати</small><b>${money(deposits)}</b><span>майбутні бронювання</span></div><div class="kpi"><small>Повернення</small><b>${money(monthRefunds)}</b><span>цього місяця</span></div>`;

 const methods=['Готівка','Карта','Банківський переказ','Онлайн'];
 $('#daily-grid').innerHTML=methods.map(m=>{const sum=todays.filter(p=>p.method===m).reduce((s,p)=>s+p.amount,0);return `<div><b>${money(sum)}</b><span>${m}</span></div>`}).join('');

 const monthReceived=payments.filter(p=>p.status==='success').reduce((s,p)=>s+p.amount,0);
 $('#mo-received').textContent=money(monthReceived);
 $('#mo-refunded').textContent=money(monthRefunds);
 $('#mo-outstanding').textContent=money(outstandingTotal);

 const upToday=outstanding.filter(o=>o.checkin===TODAY).reduce((s,o)=>s+remaining(o),0);
 const upTomorrow=outstanding.filter(o=>dayDiff(TODAY,o.checkin)===1).reduce((s,o)=>s+remaining(o),0);
 const upWeek=outstanding.filter(o=>{const d=dayDiff(TODAY,o.checkin);return d>=0&&d<=7}).reduce((s,o)=>s+remaining(o),0);
 $('#up-today').textContent=money(upToday);$('#up-tomorrow').textContent=money(upTomorrow);$('#up-week').textContent=money(upWeek);
}
function renderChart(){
 const seed=[420,510,380,600,720,540,610,700,480,390,650,720,800,610,590,900,940,1020,860,780,0,0,0,0,0,0,0,0,0,0];
 const max=Math.max(...seed,1);
 $('#bar-chart').innerHTML=seed.map((v,i)=>`<span class="${i+1===17?'today':''}" style="height:${Math.max(4,v/max*100)}%" title="${i+1} вересня"></span>`).join('');
}
function renderOutstanding(){
 const list=outstanding.slice().sort((a,b)=>outstandingRank(a)-outstandingRank(b));
 if(!list.length){
  $('#outstanding-cards').innerHTML='';
  $('#outstanding-section').innerHTML='<div class="success-state"><h3>Усе оплачено</h3><p>Наразі немає бронювань із неоплаченим залишком.</p></div>';
  return;
 }
 $('#outstanding-cards').innerHTML=list.map(o=>`<div class="out-card ${outstandingRank(o)<=1?'urgent':''}" data-outstanding="${o.bookingId}">
  <h3>${esc(o.guest)}</h3>
  <div class="oc-facts">#${o.bookingId} · ${o.dates} · ${o.room} · ${o.roomType}</div>
  <div class="oc-status">${outstandingStatusLabel(o)}</div>
  <div class="oc-facts">Total: ${money(o.total)} · Paid: ${money(o.paid)}</div>
  <div class="oc-remaining">${money(remaining(o))}</div>
  <div class="oc-actions"><button class="primary" data-quick-pay="${o.bookingId}">Додати оплату</button><button data-remind="${o.bookingId}">${outstandingRank(o)<=1?'Нагадати гостю':'Надіслати нагадування'}</button></div>
 </div>`).join('');
}
function statusTagHtml(p){
 if(p.status==='refunded')return `<span class="status-tag refunded">Повернено</span>`;
 return `<span class="status-tag success">Успішно</span>`;
}
function renderTable(){
 const list=filteredPayments();
 $('#empty-state').hidden=true;
 if(payments.length===0){
  $('.table-card').hidden=true;$('#payment-cards').hidden=true;
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Платежів поки немає</h2><p>Оплати з’являться тут після першого бронювання.</p><a class="button primary" href="/new-booking/">Створити бронювання</a></div>`;
  return;
 }
 $('.table-card').hidden=false;$('#payment-cards').hidden=false;
 if(!list.length){
  $('.table-card').hidden=true;$('#payment-cards').hidden=true;
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Нічого не знайдено</h2><p>Спробуйте змінити фільтри або період.</p></div>`;
  return;
 }
 $('#payments-tbody').innerHTML=list.map(p=>`<tr data-payment="${p.id}">
  <td>${fmt(p.date)} · ${p.time}</td>
  <td class="guest-cell">${esc(p.guest)}</td>
  <td>#${p.bookingId}</td>
  <td>${p.room}</td>
  <td><b>${p.type}</b></td>
  <td>${p.method}</td>
  <td class="amount-cell ${p.amount<0?'negative':''}"><b>${money(p.amount)}</b></td>
  <td>${statusTagHtml(p)}</td>
 </tr>`).join('');
 $('#payment-cards').innerHTML=list.map(p=>`<div class="payment-card" data-payment="${p.id}">
  <div class="pc-top"><span class="pc-amount ${p.amount<0?'negative':''}">${money(p.amount)}</span>${statusTagHtml(p)}</div>
  <div class="pc-guest">${esc(p.guest)}</div>
  <p>#${p.bookingId} · Номер ${p.room}</p>
  <p>${p.method}</p>
  <p>${fmt(p.date)} · ${p.time}</p>
 </div>`).join('');
}
function renderAll(){renderKpis();renderChart();renderOutstanding();renderTable();hydrate()}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openPaymentPanel(id){
 const p=payments.find(p=>p.id===Number(id));if(!p)return;
 $('#side-body').innerHTML=`
 ${statusTagHtml(p)}
 <div class="big-amount ${p.amount<0?'negative':''}">${money(p.amount)}</div>
 <h5>Гість</h5>
 <p style="margin:0;font-size:13px;font-weight:700">${esc(p.guest)}</p>
 <button class="text-action" style="margin-top:6px" data-open-guest>Відкрити гостя →</button>
 <h5>Бронювання</h5>
 <p style="margin:0;font-size:12px">#${p.bookingId}<br>${p.dates}<br>${p.room} · ${p.roomType}</p>
 <button class="text-action" style="margin-top:6px" data-open-booking>Відкрити бронювання →</button>
 <h5>Деталі</h5>
 <div class="info-grid"><dt>Тип</dt><dd>${p.type}</dd><dt>Метод</dt><dd>${p.method}</dd><dt>Дата</dt><dd>${fmt(p.date)} 2026 · ${p.time}</dd><dt>Створив(ла)</dt><dd>${esc(p.createdBy)}</dd></div>
 <h5>Нотатка</h5>
 <p style="margin:0;font-size:12px">${p.note?esc(p.note):'Нотатки немає.'}</p>
 <div class="dialog-actions">
  <button class="button secondary" data-edit-note="${p.id}">Редагувати нотатку</button>
  ${p.status==='success'?`<button class="button secondary" data-refund="${p.id}">Повернути кошти</button>`:''}
 </div>`;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function addPaymentModal(prefillBookingId){
 const pre=prefillBookingId?outstanding.find(o=>o.bookingId===Number(prefillBookingId)):null;
 show('Додати оплату',`<form class="demo-form" id="add-payment-form" data-booking="${pre?pre.bookingId:''}">
  <label class="full">Бронювання<input id="booking-search" placeholder="Гість або номер бронювання" value="${pre?pre.guest+' · #'+pre.bookingId:''}" ${pre?'readonly':''}></label>
  <div class="full" id="booking-summary">${pre?bookingSummaryHtml(pre):'<p class="form-note">Знайдіть бронювання, щоб побачити суму, оплачено та залишок.</p>'}</div>
  <label class="full">Сума платежу, ₴<input name="amount" type="number" min="1" id="pay-amount" value="${pre?remaining(pre):''}"></label>
  <label>Спосіб<select name="method"><option>Готівка</option><option>Карта</option><option>Банківський переказ</option><option>Онлайн</option><option>Інше</option></select></label>
  <label>Дата<input name="date" type="date" value="2026-09-17"></label>
  <label class="full">Нотатка (необов’язково)<input name="note" maxlength="120"></label>
  <p class="full" id="overpay-warning"></p>
  <button class="button primary full" type="submit">Зберегти оплату</button>
 </form>`);
 if(pre){
  $('#add-payment-form').dataset.total=pre.total;$('#add-payment-form').dataset.paid=pre.paid;
 }
 $('#booking-search').addEventListener('input',e=>{
  if(pre)return;
  const q=e.target.value.trim().toLocaleLowerCase('uk-UA');
  const match=outstanding.find(o=>(o.guest+' #'+o.bookingId).toLocaleLowerCase('uk-UA').includes(q));
  if(match&&q.length>2){
   $('#booking-summary').innerHTML=bookingSummaryHtml(match);
   $('#pay-amount').value=remaining(match);
   $('#add-payment-form').dataset.total=match.total;$('#add-payment-form').dataset.paid=match.paid;$('#add-payment-form').dataset.bookingId=match.bookingId;$('#add-payment-form').dataset.guest=match.guest;
  }
 });
 $('#pay-amount').addEventListener('input',()=>{
  const f=$('#add-payment-form');const rem=Number(f.dataset.total||0)-Number(f.dataset.paid||0);
  const val=Number($('#pay-amount').value);
  const warn=$('#overpay-warning');
  if(rem&&val>rem){warn.innerHTML=`<div class="notice danger">Сума перевищує залишок<br>Залишок: <b>${money(rem)}</b> · Введено: <b>${money(val)}</b> · Різниця: <b>${money(val-rem)}</b></div>`}
  else warn.innerHTML='';
 });
}
function bookingSummaryHtml(o){
 return `<div class="detail-grid" style="margin:10px 0"><div><small>Сума бронювання</small><b>${money(o.total)}</b></div><div><small>Оплачено</small><b>${money(o.paid)}</b></div><div><small>Залишок</small><b>${money(remaining(o))}</b></div></div>`;
}
function refundModal(id){
 const p=payments.find(p=>p.id===Number(id));if(!p)return;
 show('Повернення коштів',`<form class="demo-form" id="refund-form" data-id="${p.id}">
  <p class="full">Оригінальний платіж: <b>${money(p.amount)}</b> · Максимум до повернення: <b>${money(p.amount)}</b></p>
  <label class="full">Сума повернення, ₴<input name="amount" type="number" min="1" max="${p.amount}" value="${p.amount}"></label>
  <label class="full">Причина<select name="reason"><option>Скасування бронювання</option><option>Зміна бронювання</option><option>Помилкова оплата</option><option>Інше</option></select></label>
  <label class="full">Нотатка (необов’язково)<input name="note" maxlength="120"></label>
  <button class="button primary full destructive" type="submit">Підтвердити повернення</button>
 </form>`);
}
function reminderModal(bookingId){
 const o=outstanding.find(o=>o.bookingId===Number(bookingId));if(!o)return;
 show('Нагадування про оплату',`<p>Гість: ${esc(o.guest)} · Залишок: <b>${money(remaining(o))}</b></p>
 <form class="demo-form" id="reminder-form"><label class="full">Текст повідомлення<textarea name="text" maxlength="400">Вітаємо, ${esc(o.guest.split(' ')[0])}!\nНагадуємо, що за вашим бронюванням #${o.bookingId} залишилось оплатити ${money(remaining(o))}.</textarea></label>
 <button type="button" class="button secondary full" id="ai-rewrite">✦ Переписати через AI</button>
 <button class="button primary full" type="submit">Надіслати</button></form>`);
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const todays=payments.filter(p=>p.date===TODAY&&p.status==='success');
 const receivedToday=todays.reduce((s,p)=>s+p.amount,0);
 const monthRefunds=payments.filter(p=>p.status==='refunded').reduce((s,p)=>s+Math.abs(p.amount),0);
 const deposits=payments.filter(p=>p.type==='Передоплата').reduce((s,p)=>s+p.amount,0);
 const unpaidToday=outstanding.filter(o=>o.checkin===TODAY||o.staying);
 const biggest=outstanding.slice().sort((a,b)=>remaining(b)-remaining(a))[0];
 const map={
  unpaid:unpaidToday.length?`<p>${unpaidToday.map(o=>`${esc(o.guest)} — залишок ${money(remaining(o))}`).join('<br>')}</p>`:'<p>Сьогодні всі заїзди оплачені.</p>',
  today:`<p>Сьогодні отримано <b>${money(receivedToday)}</b> (${todays.length} платежів).</p>`,
  debt:biggest?`<p>Найбільший борг: <b>${esc(biggest.guest)}</b> · #${biggest.bookingId} · ${money(remaining(biggest))}.</p>`:'<p>Заборгованостей немає.</p>',
  deposits:`<p>Передоплат зафіксовано на суму <b>${money(deposits)}</b>.</p>`,
  refunds:`<p>Цього місяця повернено <b>${money(monthRefunds)}</b>.</p>`
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>AI відповідає лише на основі даних оплат.</p>'}</div>`;
}

document.addEventListener('click',e=>{
 if(!e.target.closest('.filters-wrap'))$('#filters-panel').hidden=true;
 const el=e.target.closest('button,a,input');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el&&el.matches('[data-close]')){closeDialog();return}
 if(el&&el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el&&el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el&&el.dataset.tab){$$('#tabs button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.tab=el.dataset.tab;renderTable();return}
 if(el&&el.id==='filters-toggle'){$('#filters-panel').hidden=!$('#filters-panel').hidden;return}
 if(el&&el.id==='filters-clear'){$$('#filters-panel input[type=checkbox]').forEach(c=>c.checked=true);return}
 if(el&&el.id==='filters-apply'){
  const sections=$$('#filters-panel section');
  state.filters.methods=new Set([...sections[0].querySelectorAll('input:checked')].map(c=>c.value));
  state.filters.types=new Set([...sections[1].querySelectorAll('input:checked')].map(c=>c.value));
  $('#filters-panel').hidden=true;renderTable();return;
 }
 if(el&&el.id==='btn-add-payment'){addPaymentModal();return}
 if(el&&el.id==='btn-export'){toast('Експорт оплат · Демо');return}
 if(el&&el.dataset.quickPay){addPaymentModal(el.dataset.quickPay);return}
 if(el&&el.dataset.remind){reminderModal(el.dataset.remind);return}
 if(el&&el.dataset.editNote){show('Редагувати нотатку',`<form class="demo-form" id="note-form"><label class="full">Нотатка<textarea name="note" maxlength="200"></textarea></label><button class="button primary full" type="submit">Зберегти</button></form>`);return}
 if(el&&el.dataset.refund){closeSidePanel();refundModal(el.dataset.refund);return}
 if(el&&el.dataset.openGuest!==undefined){window.location.href='/guest/';return}
 if(el&&el.dataset.openBooking!==undefined){window.location.href='/booking/';return}
 if(el&&el.id==='ai-rewrite'){const ta=document.querySelector('#reminder-form textarea');if(ta)ta.value='Доброго дня! Ввічливо нагадуємо про залишок оплати за вашим бронюванням. Будемо вдячні, якщо ви зможете внести суму до заїзду.';return}
 if(el&&el.id==='side-close'){closeSidePanel();return}
 if(el&&el.id==='side-scrim'){closeSidePanel();return}

 const row=e.target.closest('tr[data-payment],.payment-card[data-payment]');
 if(row){openPaymentPanel(row.dataset.payment);return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);
document.addEventListener('input',e=>{if(e.target.id==='search-input'){state.search=e.target.value;renderTable()}});
document.addEventListener('change',e=>{if(e.target.id==='period-select'){state.period=e.target.value;toast('Період змінено · Демо')}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-payment-form'){
  const amount=Number(data.get('amount'));if(!amount||amount<=0){toast('Вкажіть суму платежу');return}
  const total=Number(f.dataset.total||0),paid=Number(f.dataset.paid||0);
  if(total&&amount>total-paid){return}
  const bookingId=Number(f.dataset.bookingId||f.dataset.booking)||Math.floor(1800+Math.random()*200);
  const guest=f.dataset.guest||'Гість';
  payments.unshift({id:Math.max(...payments.map(p=>p.id))+1,date:String(data.get('date')),time:new Date().toTimeString().slice(0,5),guest,bookingId,room:'—',roomType:'',type:total&&paid===0?'Оплата':'Доплата',method:String(data.get('method')),amount,status:'success',note:data.get('note')?String(data.get('note')):'',createdBy:'Олександр',dates:''});
  const o=outstanding.find(o=>o.bookingId===bookingId);if(o){o.paid+=amount;if(o.paid>=o.total){outstanding.splice(outstanding.indexOf(o),1)}}
  closeDialog();renderAll();toast('Оплату збережено · '+money(amount));
 }else if(f.id==='refund-form'){closeDialog();toast('Повернення оформлено · Демо')}
 else if(f.id==='note-form'){closeDialog();toast('Нотатку збережено')}
 else if(f.id==='reminder-form'){closeDialog();toast('Нагадування надіслано · Демо')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');closeSidePanel()}});

renderAll();
