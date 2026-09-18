'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',left:'M15 6l-6 6 6 6',send:'M3 3l18 9-18 9 3-9-3-9Zm3 9h15',phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z',attach:'M21 11 12 20a4 4 0 0 1-6-6l9-9a3 3 0 0 1 4 4l-9 9a1.5 1.5 0 0 1-2-2l8-8'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const HOTEL={name:'Grand Hotel',checkInTime:'14:00',checkOutTime:'11:00'};
const TEMPLATES=[
 {id:'confirm',name:'Підтвердження бронювання',category:'Бронювання',channel:'Email',chip:'Підтвердження',text:'Вітаємо, {{guest.firstName}}!\n\nВаше бронювання в {{hotel.name}} підтверджено.\n\nЗаїзд: {{booking.checkIn}}\nВиїзд: {{booking.checkOut}}\nНомер: {{room.name}}\nСума: {{booking.total}}\n\nБудемо раді вас бачити!'},
 {id:'arrival',name:'Перед заїздом',category:'Заїзд',channel:'Email',chip:'Перед заїздом',text:'Вітаємо, {{guest.firstName}}!\n\nНагадуємо, що завтра очікуємо вас у {{hotel.name}}.\nЗаселення доступне після {{hotel.checkInTime}}.\n\nЯкщо вже знаєте приблизний час прибуття — напишіть нам у відповідь.'},
 {id:'payment',name:'Нагадування про оплату',category:'Оплата',channel:'SMS',chip:'Оплата',text:'Вітаємо, {{guest.firstName}}!\n\nЗа вашим бронюванням залишилося оплатити {{booking.balance}}.\n\nЯкщо оплату вже здійснено — можете проігнорувати це повідомлення.'},
 {id:'checkout',name:'Нагадування про виїзд',category:'Виїзд',channel:'Email',chip:'Check-out',text:'Доброго ранку, {{guest.firstName}}!\n\nНагадуємо, що сьогодні check-out до {{hotel.checkOutTime}}.\n\nДякуємо, що обрали {{hotel.name}}.'},
 {id:'thanks',name:'Після проживання',category:'Подяка',channel:'Email',chip:'Подяка',text:'Дякуємо, {{guest.firstName}}, що гостювали у нас!\n\nБудемо раді бачити вас знову. Якщо матимете хвилину — будемо вдячні за ваш відгук.'},
 {id:'prepay-dm',name:'Пропозиція номера в месенджері',category:'Продаж',channel:'Telegram',chip:'AI-продаж',text:'Вітаємо! На ці дати вільний номер «{{room.name}}» — {{booking.total}}.\n\nЗабронювати й надіслати посилання на передоплату?'}
];
const VARIABLES=[['Ім’я гостя','{{guest.firstName}}'],['Назва готелю','{{hotel.name}}'],['Дата заїзду','{{booking.checkIn}}'],['Дата виїзду','{{booking.checkOut}}'],['Номер','{{room.name}}'],['Тип номера','{{room.type}}'],['Сума','{{booking.total}}'],['Залишок','{{booking.balance}}'],['Час check-in','{{hotel.checkInTime}}'],['Час check-out','{{hotel.checkOutTime}}']];

const conversations=[
 {id:1842,guest:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',room:'204',roomType:'Люкс',dates:'17–20 вересня',status:'Підтверджено',payment:'Оплачено',arrival:'14:30',balance:0,total:4800,stays:4,pref:'Тихий номер',context:'today',contextLabel:'Заїзд сьогодні',unread:2,archived:false,
  messages:[
   {date:'14 вересня',time:'12:11',from:'system',text:'Бронювання підтверджено'},
   {date:'14 вересня',time:'12:14',from:'hotel',text:`Вітаємо, Анно!\n\nВаше бронювання в ${HOTEL.name} підтверджено.\n\n17–20 вересня\n204 · Люкс\n4 800 ₴`,status:'read'},
   {date:'14 вересня',time:'12:19',from:'guest',text:'Дякую!'},
   {date:'14 вересня',time:'12:20',from:'system',text:'Отримано оплату 2 000 ₴'},
   {date:'16 вересня',time:'14:00',from:'hotel',text:'Вітаємо, Анно! Нагадуємо, що завтра очікуємо вас у Grand Hotel. Заселення доступне після 14:00.',status:'read',auto:true,rule:'За 24 години до заїзду'},
   {date:'17 вересня',time:'09:05',from:'system',text:'Час заїзду змінено на 13:30'},
   {date:'17 вересня',time:'10:04',from:'hotel',text:'Доброго дня! Підкажіть, будь ласка, приблизний час вашого прибуття.',status:'read'},
   {date:'17 вересня',time:'10:11',from:'guest',text:'Будемо приблизно о 14:30.'},
   {date:'17 вересня',time:'12:42',from:'guest',text:'Дякую, будемо приблизно о 14:30.'}
  ]},
 {id:1847,guest:'Олег Бондар',phone:'+380 50 222 11 33',email:'',room:'103',roomType:'Стандарт',dates:'17–18 вересня',status:'Підтверджено',payment:'Частково оплачено',arrival:'—',balance:1200,total:3200,stays:1,pref:'',context:'today',contextLabel:'Очікується оплата',unread:0,archived:false,
  messages:[
   {date:'17 вересня',time:'09:14',from:'system',text:'Отримано передоплату 1 500 ₴'},
   {date:'17 вересня',time:'11:15',from:'hotel',text:'Нагадуємо про залишок оплати 1 200 ₴.',status:'sent'},
   {date:'17 вересня',time:'11:16',from:'hotel',text:'Ваш рахунок на email надіслано.',status:'failed',failReason:'Email адреса недоступна.'}
  ]},
 {id:1853,guest:'Марія Петренко',phone:'+380 63 456 78 90',email:'maria@example.com',room:'202',roomType:'Люкс',dates:'20–23 вересня',status:'Підтверджено',payment:'Оплачено',arrival:'—',balance:0,total:7200,stays:8,pref:'Високий поверх',context:'upcoming',contextLabel:'Заїзд через 3 дні',unread:0,archived:false,
  messages:[
   {date:'16 вересня',time:'17:40',from:'hotel',text:'Ваше бронювання підтверджено.',status:'read'}
  ]},
 {id:1858,guest:'Наталія Коваль',phone:'+380 97 555 66 77',email:'natalia@example.com',room:'203',roomType:'Люкс',dates:'18–21 вересня',status:'Підтверджено',payment:'Частково оплачено',arrival:'—',balance:2200,total:5200,stays:5,pref:'Ранній заїзд',context:'upcoming',contextLabel:'Заїзд завтра',unread:1,archived:false,
  messages:[
   {date:'16 вересня',time:'10:00',from:'hotel',text:'Вітаємо, Наталіє! Ваше бронювання підтверджено.',status:'read'},
   {date:'17 вересня',time:'09:30',from:'guest',text:'Чи можливий ранній заїзд, орієнтовно о 11:00?'}
  ],
  scheduled:{date:'Завтра',time:'10:00',text:'Інструкція перед заїздом'}},
 {id:1690,guest:'Тарас Гончар',phone:'+380 66 777 88 99',email:'',room:'101',roomType:'Стандарт',dates:'5–8 вересня',status:'Виїхав',payment:'Оплачено',arrival:'—',balance:0,total:2400,stays:1,pref:'',context:'former',contextLabel:'Колишній гість',unread:0,archived:false,
  messages:[
   {date:'8 вересня',time:'11:20',from:'hotel',text:'Дякуємо, Тарасе, що гостювали у нас! Будемо раді бачити вас знову.',status:'read'}
  ]}
];

const state={activeId:conversations[0].id,filter:'all',sort:'activity',search:'',draft:{}};

function activeConvo(){return conversations.find(c=>c.id===state.activeId)}
function lastMessage(c){return c.messages[c.messages.length-1]}
function needsResponse(c){const l=lastMessage(c);return l&&l.from==='guest'}
function isToday(c){return c.messages.some(m=>m.date==='17 вересня')||c.context==='today'}

function fillTemplate(tpl,c){
 const firstName=c.guest.split(' ')[0];
 return tpl.text
  .replace(/{{guest.firstName}}/g,firstName)
  .replace(/{{hotel.name}}/g,HOTEL.name)
  .replace(/{{hotel.checkInTime}}/g,HOTEL.checkInTime)
  .replace(/{{hotel.checkOutTime}}/g,HOTEL.checkOutTime)
  .replace(/{{booking.checkIn}}/g,c.dates.split('–')[0]+' вересня')
  .replace(/{{booking.checkOut}}/g,c.dates)
  .replace(/{{room.name}}/g,c.room+' · '+c.roomType)
  .replace(/{{room.type}}/g,c.roomType)
  .replace(/{{booking.total}}/g,money(c.total))
  .replace(/{{booking.balance}}/g,money(c.balance));
}

function filteredConvos(){
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 let list=conversations.filter(c=>!c.archived);
 if(q)list=list.filter(c=>(c.guest+' #'+c.id+' '+c.room).toLocaleLowerCase('uk-UA').includes(q));
 if(state.filter==='unread')list=list.filter(c=>c.unread>0);
 else if(state.filter==='today')list=list.filter(isToday);
 else if(state.filter==='upcoming')list=list.filter(c=>c.context==='upcoming');
 else if(state.filter==='needsResponse')list=list.filter(needsResponse);
 const sorters={
  activity:(a,b)=>new Date('2026-'+dateToMD(lastMessage(b).date)+'T'+lastMessage(b).time)-new Date('2026-'+dateToMD(lastMessage(a).date)+'T'+lastMessage(a).time),
  unread:(a,b)=>b.unread-a.unread,
  arrival:(a,b)=>(a.context==='today'?0:a.context==='upcoming'?1:2)-(b.context==='today'?0:b.context==='upcoming'?1:2)
 };
 return list.slice().sort(sorters[state.sort]);
}
function dateToMD(label){
 const months={'вересня':'09','серпня':'08','грудня':'12'};
 const m=label.match(/(\d+)\s+(\S+)/);if(!m)return'09-17';
 const day=m[1].padStart(2,'0'),mon=months[m[2]]||'09';
 return mon+'-'+day;
}

function renderConvList(){
 const list=filteredConvos();
 $('#conv-items').innerHTML=list.length?list.map(c=>{
  const l=lastMessage(c);
  return `<button class="conv-item ${c.unread>0?'unread':''} ${c.id===state.activeId?'active':''}" data-open-convo="${c.id}">
   <div class="ci-top"><span class="ci-name">${esc(c.guest)}</span><span class="ci-time">${l.time}</span></div>
   <div class="ci-room">${c.room?c.room+' · ':''}#${c.id}</div>
   <div class="ci-preview">${esc(l.from==='system'?l.text:l.text.split('\n')[0])}</div>
   <div class="ci-bottom"><span class="ci-context ${c.context==='today'?'gold':''}">${esc(c.contextLabel)}</span>${c.unread>0?`<span class="ci-unread-badge">${c.unread}</span>`:''}</div>
  </button>`;
 }).join(''):'<div class="conv-empty">Розмов не знайдено.</div>';
}

function messageStatusLabel(s){return{scheduled:'Заплановано',sending:'Надсилається',sent:'Надіслано',delivered:'Доставлено',read:'Прочитано',failed:'Помилка'}[s]||''}

function renderChat(){
 const c=activeConvo();
 if(!c){$('#conv-active').innerHTML='<div class="chat-empty">Оберіть розмову зі списку.</div>';return}
 c.unread=0;
 let lastDate=null,body='';
 c.messages.forEach(m=>{
  if(m.date!==lastDate){body+=`<div class="date-sep">${m.date}</div>`;lastDate=m.date}
  if(m.from==='system'){body+=`<div class="system-event">${esc(m.text)}</div>`;return}
  if(m.status==='failed'){
   body+=`<div class="msg-row ${m.from}"><div class="bubble failed">${esc(m.text)}<div class="b-meta">${m.time} · Не вдалося надіслати${m.failReason?' · '+esc(m.failReason):''}</div><div class="fail-actions"><button data-retry>Повторити</button><button data-change-channel>Змінити канал</button></div></div></div>`;
   return;
  }
  body+=`<div class="msg-row ${m.from}"><div class="bubble">${esc(m.text).replace(/\n/g,'<br>')}<div class="b-meta"><span>${m.time}</span>${m.status?`<span>· ${messageStatusLabel(m.status)}</span>`:''}${m.auto?`<span class="auto-tag" title="Надіслано правилом: «${esc(m.rule||'')}»" data-open-automation>Автоматично</span>`:''}</div></div></div>`;
 });
 if(c.scheduled)body+=`<div class="scheduled-card"><b>${c.scheduled.date} · ${c.scheduled.time}</b><br>Заплановано<br>${esc(c.scheduled.text)}<div class="sched-actions"><button data-edit-scheduled>Редагувати</button><button data-cancel-scheduled>Скасувати</button></div></div>`;

 $('#conv-active').innerHTML=`
 <div class="conv-active-head">
  <div><button class="icon-button mobile-back" id="mobile-back" aria-label="Назад" data-icon="left"></button></div>
  <div style="flex:1"><h2>${esc(c.guest)}</h2><p>${c.room?c.room+' · '+c.roomType+' · ':''}${c.dates} · <span class="ci-context ${c.context==='today'?'gold':''}" style="margin-left:4px">${esc(c.contextLabel)}</span></p></div>
  <div class="cah-actions">
   <button aria-label="Подзвонити" data-icon="phone" data-call></button>
   <button aria-label="Відкрити гостя" data-icon="guests" data-open-guest></button>
   <button aria-label="Відкрити бронювання" data-icon="booking" data-open-booking></button>
   <button aria-label="Ще" data-icon="menu" data-more-convo></button>
  </div>
 </div>
 <div class="chat-body" id="chat-body">${body}</div>
 <div class="composer-wrap">
  <div class="channel-row"><span style="font-size:10px;color:#9b9ca2">Канал</span><select id="channel-select"><option>Email</option><option>SMS</option><option>Instagram</option><option>Telegram</option></select></div>
  <div class="template-chips">${TEMPLATES.map(t=>`<button data-insert-template="${t.id}">${t.chip}</button>`).join('')}</div>
  <div class="composer-row" style="position:relative">
   <button class="composer-icon" aria-label="Додати вкладення" data-icon="attach" data-attach></button>
   <textarea id="composer-input" rows="1" placeholder="Напишіть повідомлення..."></textarea>
   <button class="composer-icon ai" aria-label="AI" data-icon="spark" id="ai-toggle"></button>
   <button class="send-btn" aria-label="Надіслати" data-icon="send" id="send-btn"></button>
   <div class="ai-popover" id="ai-popover" hidden>
    <button data-ai="reply">Написати відповідь</button>
    <button data-ai="shorter">Зробити коротше</button>
    <button data-ai="polite">Зробити ввічливіше</button>
    <button data-ai="translate">Перекласти</button>
    <button data-ai="payment">Нагадати про оплату</button>
    <button data-ai="arrival">Дати інструкцію перед заїздом</button>
   </div>
  </div>
 </div>`;
 hydrate($('#conv-active'));
 const body_=$('#chat-body');body_.scrollTop=body_.scrollHeight;
 const ta=$('#composer-input');
 ta.addEventListener('input',()=>{ta.style.height='auto';ta.style.height=Math.min(120,ta.scrollHeight)+'px'});
 ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}});
}
function renderContext(){
 const c=activeConvo();
 if(!c){$('#context-panel').innerHTML='';return}
 $('#context-panel').innerHTML=`
 <h5>Гість</h5>
 <p class="cp-name">${esc(c.guest)}</p>
 <p class="cp-contact">${esc(c.phone)}${c.email?'<br>'+esc(c.email):''}</p>
 <p class="cp-stays">${c.stays} проживання</p>
 <button class="button secondary" data-open-guest style="width:100%">Відкрити профіль</button>

 <h5>Бронювання</h5>
 <div class="info-grid"><dt>№</dt><dd>#${c.id}</dd><dt>Дати</dt><dd>${c.dates}</dd><dt>Номер</dt><dd>${c.room||'—'} · ${c.roomType||''}</dd><dt>Статус</dt><dd>${c.status}</dd><dt>Оплата</dt><dd>${c.payment}</dd><dt>Заїзд</dt><dd>${c.arrival}</dd></div>
 <button class="button secondary" data-open-booking style="width:100%;margin-top:10px">Відкрити бронювання</button>

 <h5>Корисно знати</h5>
 ${c.stays>=2?`<div class="useful-item"><b>Постійний гість</b>${c.stays} проживання</div>`:''}
 ${c.pref?`<div class="useful-item"><b>Побажання</b>${esc(c.pref)}</div>`:''}
 ${c.arrival&&c.arrival!=='—'?`<div class="useful-item"><b>Очікуваний час прибуття</b>${c.arrival}</div>`:''}
 `;
 hydrate($('#context-panel'));
}
function renderAll(){renderChat();renderConvList();renderContext();hydrate()}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function sendMessage(){
 const ta=$('#composer-input');const text=ta.value.trim();if(!text)return;
 const c=activeConvo();
 c.messages.push({date:'17 вересня',time:new Date().toTimeString().slice(0,5),from:'hotel',text,status:'sent'});
 ta.value='';ta.style.height='auto';
 renderChat();renderConvList();
 toast('Повідомлення надіслано');
}
function newMessageModal(){
 show('Нове повідомлення',`<form class="demo-form" id="new-message-form">
  <label class="full">Одержувач<input id="nm-recipient" placeholder="Ім’я, телефон або бронювання" list="nm-list" autocomplete="off"></label>
  <datalist id="nm-list">${conversations.map(c=>`<option value="${esc(c.guest)}">`).join('')}</datalist>
  <label>Канал<select name="channel"><option>Email</option><option>SMS</option><option>Instagram</option><option>Telegram</option></select></label>
  <label>Шаблон<select id="nm-template"><option value="">Без шаблону</option>${TEMPLATES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></label>
  <label class="full">Повідомлення<textarea name="message" id="nm-text" required maxlength="800"></textarea></label>
  <button class="button primary full" type="submit">Надіслати</button>
 </form>`);
 $('#nm-template').addEventListener('change',e=>{
  const tpl=TEMPLATES.find(t=>t.id===e.target.value);
  const guestName=$('#nm-recipient').value.trim();
  const convo=conversations.find(c=>c.guest===guestName)||conversations[0];
  $('#nm-text').value=tpl?fillTemplate(tpl,convo):'';
 });
}
function templatesModal(){
 show('Шаблони повідомлень',`<p>Створіть повідомлення, які команда може використовувати повторно.</p>
 <div class="template-list">${TEMPLATES.map(t=>`<div class="template-card"><h4>${esc(t.name)} <span class="pill">${t.channel}</span></h4><p>${esc(t.text)}</p></div>`).join('')}</div>
 <button class="button secondary" id="btn-new-template">+ Новий шаблон</button>`);
}
function newTemplateModal(){
 closeDialog();
 setTimeout(()=>{
  show('Новий шаблон',`<form class="demo-form" id="new-template-form">
   <label>Назва<input name="name" required></label>
   <label>Категорія<input name="category"></label>
   <label class="full">Канал<select name="channel"><option>Email</option><option>SMS</option><option>Instagram</option><option>Telegram</option></select></label>
   <label class="full">Повідомлення<textarea name="message" id="nt-text" required maxlength="800"></textarea></label>
   <div class="full var-chips">${VARIABLES.map(([label,token])=>`<button type="button" data-insert-var="${token}">${label}</button>`).join('')}</div>
   <button class="button primary full" type="submit">Зберегти шаблон</button>
  </form>`);
 },50);
}
function aiSuggest(action){
 const c=activeConvo();
 const lastGuestMsg=[...c.messages].reverse().find(m=>m.from==='guest');
 const late=lastGuestMsg&&/23:00|пізн/i.test(lastGuestMsg.text);
 const map={
  reply:late?`Вітаємо, ${c.guest.split(' ')[0]}!\n\nТак, пізнє заселення можливе. Ми очікуватимемо вас приблизно о 23:00 та надішлемо необхідні інструкції перед прибуттям.\n\nГарної дороги!`:`Доброго дня, ${c.guest.split(' ')[0]}! Дякуємо за повідомлення, ми врахували цю інформацію.`,
  shorter:$('#composer-input').value?$('#composer-input').value.split('.').slice(0,1).join('.')+'.':'Дякуємо, врахували.',
  polite:'Щиро дякуємо за ваше повідомлення! '+($('#composer-input').value||'Будемо раді допомогти.'),
  translate:'[EN] Thank you for your message. We will be happy to help.',
  payment:fillTemplate(TEMPLATES.find(t=>t.id==='payment'),c),
  arrival:fillTemplate(TEMPLATES.find(t=>t.id==='arrival'),c)
 };
 return map[action]||'';
}

document.addEventListener('click',e=>{
 if(!e.target.closest('#ai-toggle')&&!e.target.closest('#ai-popover')){const pop=$('#ai-popover');if(pop)pop.hidden=true}
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el.dataset.openConvo){state.activeId=Number(el.dataset.openConvo);renderAll();document.body.classList.add('chat-open');return}
 if(el.dataset.filter){$$('#conv-filters button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.filter=el.dataset.filter;renderConvList();return}
 if(el.id==='mobile-back'){document.body.classList.remove('chat-open');return}
 if(el.id==='btn-templates'){templatesModal();return}
 if(el.id==='btn-new-template'){newTemplateModal();return}
 if(el.id==='btn-new-message'){newMessageModal();return}
 if(el.dataset.insertVar){const ta=$('#nt-text');if(ta){ta.value+=el.dataset.insertVar;ta.focus()}return}
 if(el.dataset.insertTemplate){const t=TEMPLATES.find(t=>t.id===el.dataset.insertTemplate);const c=activeConvo();const ta=$('#composer-input');ta.value=fillTemplate(t,c);ta.dispatchEvent(new Event('input'));ta.focus();return}
 if(el.id==='ai-toggle'){const pop=$('#ai-popover');pop.hidden=!pop.hidden;return}
 if(el.dataset.ai){const text=aiSuggest(el.dataset.ai);$('#composer-input').value=text;$('#composer-input').dispatchEvent(new Event('input'));$('#ai-popover').hidden=true;$('#composer-input').focus();return}
 if(el.id==='send-btn'){sendMessage();return}
 if(el.dataset.attach!==undefined){toast('Додавання вкладень — демо');return}
 if(el.dataset.call!==undefined){toast('Дзвінок демо: '+activeConvo().phone);return}
 if(el.dataset.openGuest!==undefined){window.location.href='/guest/';return}
 if(el.dataset.openBooking!==undefined){window.location.href='/booking/';return}
 if(el.dataset.moreConvo!==undefined){
  show('Розмова',`<div class="dialog-actions"><button class="button secondary" id="mark-unread">Позначити непрочитаним</button><button class="button secondary" id="archive-convo">Архівувати розмову</button></div>`);
  return;
 }
 if(el.id==='mark-unread'){activeConvo().unread=1;closeDialog();renderConvList();toast('Позначено непрочитаним');return}
 if(el.id==='archive-convo'){activeConvo().archived=true;closeDialog();state.activeId=conversations.find(c=>!c.archived)?.id;renderAll();toast('Розмову архівовано');return}
 if(el.dataset.retry!==undefined){toast('Повторна спроба надсилання...');return}
 if(el.dataset.changeChannel!==undefined){toast('Канал змінено на SMS · Демо');return}
 if(el.dataset.openAutomation!==undefined){window.location.href='/automations/';return}
 if(el.dataset.editScheduled!==undefined){show('Редагувати заплановане повідомлення',`<form class="demo-form" id="edit-sched-form"><label class="full">Текст<textarea name="text">${esc(activeConvo().scheduled.text)}</textarea></label><button class="button primary full" type="submit">Зберегти</button></form>`);return}
 if(el.dataset.cancelScheduled!==undefined){const c=activeConvo();c.scheduled=null;renderChat();toast('Заплановане повідомлення скасовано');return}
});
document.addEventListener('input',e=>{if(e.target.id==='conv-search'){state.search=e.target.value;renderConvList()}});
document.addEventListener('change',e=>{if(e.target.id==='sort-select'){state.sort=e.target.value;renderConvList()}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='new-message-form'){closeDialog();toast('Повідомлення надіслано · Демо')}
 else if(f.id==='new-template-form'){closeDialog();toast('Шаблон збережено · Демо')}
 else if(f.id==='edit-sched-form'){activeConvo().scheduled.text=String(data.get('text'));closeDialog();renderChat();toast('Заплановане повідомлення оновлено')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');document.documentElement.classList.remove('no-scroll')}});

renderAll();
