'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',send:'M3 3l18 9-18 9 3-9-3-9Zm3 9h15'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

/* ---- demo knowledge base ---- */
const KB={
 arrivals:[
  {time:'13:30',guest:'Анна Коваленко',room:'204 · Люкс',payment:'Оплачено',bookingId:1842,note:'Очікуваний час: 13:30'},
  {time:'14:00',guest:'Олег Бондар',room:'103 · Стандарт',payment:'Залишок: 1 200 ₴',bookingId:1847},
  {time:'16:30',guest:'Марія Петренко',room:'202 · Люкс',payment:'Оплачено',bookingId:1853}
 ],
 departures:4,
 occupied:22,totalRooms:28,needsCleaning:3,unpaidTotal:6200,
 unconfirmed:[{guest:'Ірина Шевченко',bookingId:1851,dates:'19–22 вересня'}],
 cancelledThisMonth:[{guest:'Тарас Гончар',bookingId:1810,reason:'Гість відмовився'}],
 weekBookings:5,tomorrowBookings:2,
 freeWeekend:[{number:'103',type:'Стандарт',price:1200},{number:'205',type:'Люкс',price:1800},{number:'301',type:'Апартаменти',price:2200}],
 freeNow:[{number:'103',type:'Стандарт'},{number:'205',type:'Люкс'}],
 blockedRooms:[{number:'302',reason:'Ремонт',period:'17–19 вересня'}],
 roomStatus:{'204':'Зайнятий (виїзд 20 вересня)','205':'Готовий, вільний','103':'Готовий, вільний'},
 guests:{
  'анна коваленко':{name:'Анна Коваленко',stays:4,favType:'Люкс',lastVisit:'20 серпня 2026',pref:'Тихий номер',tag:'Постійний гість',bookingId:1842,room:'204 · Люкс',dates:'17–20 вересня',total:4800,paid:4800},
  'олег бондар':{name:'Олег Бондар',stays:1,favType:'Стандарт',lastVisit:'—',pref:'',tag:'',bookingId:1847,room:'103 · Стандарт',dates:'17–18 вересня',total:3200,paid:2000},
  'марія петренко':{name:'Марія Петренко',stays:8,favType:'Люкс',lastVisit:'1 вересня 2026',pref:'Високий поверх',tag:'VIP',bookingId:1853,room:'202 · Люкс',dates:'20–23 вересня',total:7200,paid:7200}
 },
 ambiguous:{'олександр':['Олександр Мельник','Олександр Бондар','Олександр Коваль']},
 mostStays:{name:'Марія Петренко',stays:8},
 longTimeGone:18,
 newGuestsThisMonth:86,
 unpaidBookings:[{guest:'Олег Бондар',bookingId:1847,balance:1200},{guest:'Ірина Шевченко',bookingId:1851,balance:6400}],
 receivedToday:38400,
 depositsThisMonth:24800,
 refunds:[{guest:'Марія Петренко',bookingId:1812,amount:2400}],
 biggestBalance:{guest:'Ірина Шевченко',bookingId:1851,balance:6400},
 cleaning:{needs:[{number:'204',arrival:'13:30',assigned:null},{number:'207',arrival:'15:00',assigned:null}],inProgress:[{number:'206',assigned:'Марія',since:'12:20'}],ready:['103','205']},
 unassignedTasks:2,
 sales:{topSource:'Пряме бронювання',topCount:29,revenueMonth:428600,instagram:{count:15,revenue:76200},directShare:34,directSharePrev:31,returning:18},
 roomPrices:{'204':{type:'Люкс',price:1600},'205':{type:'Люкс',price:1800}}
};
const CURRENT_ROLE={value:HotelRole.get()};
const ROLE_LABEL={owner:'Owner',manager:'Manager',reception:'Reception',housekeeping:'Housekeeping'};
let pendingFlow=null;

const SUGGESTIONS=['Що сьогодні важливого?','Хто сьогодні заїжджає?','Які номери ще не готові?','Хто має неоплачений залишок?','Які номери вільні на вихідні?','Хто наші постійні гості?','Звідки приходить найбільше бронювань?','Скільки ми отримали цього місяця?'];
const INSIGHTS=[
 {title:'5 вільних номерів на вихідні',text:'Завантаження на наступні вихідні зараз 63%.',cta:'Переглянути календар',href:'/calendar/'},
 {title:'18 постійних гостей давно не поверталися',text:'Ці гості мають мінімум 2 попередні проживання і не були у вас понад 6 місяців.',cta:'Переглянути гостей',href:'/guests/'},
 {title:'Зросла частка прямих бронювань',text:'34% бронювань цього місяця були прямими проти 31% минулого місяця.',cta:'Переглянути продажі',href:'/sales/'}
];
const history=[
 {group:'Сьогодні',items:[{q:'Що сьогодні важливого?',time:'10:04'}]},
 {group:'Вчора',items:[{q:'Хто не оплатив?',time:'17:22'}]},
 {group:'15 вересня',items:[{q:'Вільні номери на вихідні',time:'14:40'}]}
];

const messages=[];

function renderWelcome(){
 $('#welcome-block').innerHTML=messages.length?'':`
 <div class="brief-card">
  <b class="title"><span data-icon="spark"></span>Ранковий огляд</b>
  <h2>Сьогодні у вас:</h2>
  <ul>
   <li>${KB.arrivals.length} заїзди</li>
   <li>${KB.departures} виїзди</li>
   <li>${KB.occupied} з ${KB.totalRooms} номерів зайняті</li>
   <li>${KB.needsCleaning} номери потребують прибирання</li>
   <li>${money(KB.unpaidTotal)} неоплачених залишків</li>
  </ul>
  <div class="attn">Потребує уваги: номер 204 ще прибирається, а наступний гість очікується о 13:30. Бронювання #1847 має залишок 1 200 ₴.</div>
  <button data-open-details>Відкрити деталі</button>
 </div>
 <div class="welcome">
  <span class="ai-label">HOTEL AI</span>
  <h2>Що хочете дізнатися про ваш готель?</h2>
  <p>Запитуйте звичайними словами. Hotel OS використає актуальні дані вашого готелю та покаже відповідь.</p>
  <div class="suggest-grid">${SUGGESTIONS.map(s=>`<button data-suggest="${esc(s)}">${esc(s)}</button>`).join('')}</div>
 </div>
 <div class="insights-row">${INSIGHTS.map(i=>`<div class="insight-card"><h4>${esc(i.title)}</h4><p>${esc(i.text)}</p><button data-goto="${i.href}">${esc(i.cta)} →</button></div>`).join('')}</div>`;
 hydrate($('#welcome-block'));
}

function itemCard(title,sub,extra){
 return `<div class="ai-item-card"><span><b>${esc(title)}</b><small>${esc(sub)}</small></span>${extra||''}</div>`;
}
function actionsHtml(actions){
 return `<div class="ai-actions">${actions.map(a=>a.href?`<a class="${a.primary?'primary':''}" href="${a.href}">${esc(a.label)}</a>`:`<button class="${a.primary?'primary':''}" ${a.attrs||''}>${esc(a.label)}</button>`).join('')}</div>`;
}
function sourceHtml(text){return `<div class="ai-source">${esc(text)}</div>`}

function pushMessage(role,html){messages.push({role,html});renderMessages()}
function renderMessages(){
 $('#messages').innerHTML=messages.map((m,i)=>{
  if(m.role==='user')return `<div class="msg-row user"><div class="bubble">${esc(m.text)}</div></div>`;
  return `<div class="msg-row ai"><div class="bubble">${m.html}${m.noFeedback?'':`<div class="feedback-row" data-msg="${i}"><span>Це було корисно?</span><button data-fb="up" data-idx="${i}">👍</button><button data-fb="down" data-idx="${i}">👎</button><div class="feedback-picked" id="fb-picked-${i}"></div></div>`}</div></div>`;
 }).join('');
 renderWelcome();
 hydrate($('#messages'));
 const scroll=$('#chat-scroll');scroll.scrollTop=scroll.scrollHeight;
}
function pushUser(text){messages.push({role:'user',text});renderMessages()}
function pushLoading(text){
 messages.push({role:'ai',html:`<span>${esc(text)}</span>`,noFeedback:true,loading:true});
 renderMessages();
 return messages.length-1;
}
function resolveLoading(idx,html,noFeedback){messages[idx]={role:'ai',html,noFeedback:!!noFeedback};renderMessages()}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function historyModal(){
 show('Історія',`<div class="history-list">${history.map(g=>`<div class="history-group"><small>${esc(g.group)}</small>${g.items.map(it=>`<button class="history-item" data-restore="${esc(it.q)}"><b>${esc(it.q)}</b><span>${it.time}</span></button>`).join('')}</div>`).join('')}</div>`);
}

/* ---- answer engine ---- */
function answer(qRaw){
 const q=qRaw.toLocaleLowerCase('uk-UA');
 const role=CURRENT_ROLE.value;

 if(role==='housekeeping'&&/(заробив|дохід|revenue|виторг|оплат|гроші)/.test(q)&&!/прибир/.test(q)){
  return{html:`<div class="perm-note">У вашої ролі немає доступу до фінансових даних.</div>`,noFeedback:true};
 }

 if(/олександр/.test(q)&&!/коваленко|бондар|петренко/.test(q)){
  const names=KB.ambiguous['олександр'];
  return{html:`<p>Знайдено ${names.length} гостей з ім’ям Олександр.</p><div class="ai-cards">${names.map(n=>itemCard(n,'Клікніть, щоб уточнити')).join('')}</div><p style="margin-top:10px">Кого ви маєте на увазі?</p>`};
 }
 if(/spa|спа/.test(q)){
  return{html:`<p>У Hotel OS недостатньо даних, щоб це визначити.</p><p>У профілях гостей зараз не зберігається інформація про використання SPA.</p>`};
 }

 if(/скасу.*(анн|1842)/.test(q)){
  const g=KB.guests['анна коваленко'];
  return{html:`<p>Знайдено:</p><div class="ai-cards">${itemCard(g.name,`Booking #${g.bookingId} · ${g.dates} · ${g.room}`,`<b>${money(g.paid)}</b>`)}</div>${actionsHtml([{label:'Перейти до скасування',href:'/booking/',primary:true}])}<p class="form-note" style="margin-top:8px">AI не скасовує бронювання напряму — потрібне підтвердження на сторінці бронювання.</p>`,source:'На основі даних бронювання #1842.'};
 }
 if(/нагадай.*(олег|1847|1 ?200)/.test(q)){
  return{html:`<p>Знайдено активне бронювання Олега Бондаря #1847.</p><p>Залишок: <b>${money(1200)}</b></p><p>Пропоноване повідомлення:</p><p style="background:#f7f7f8;border-radius:8px;padding:10px 12px">Вітаємо, Олеже!<br>Нагадуємо, що за вашим бронюванням залишилось оплатити 1 200 ₴.</p>${actionsHtml([{label:'Перейти до повідомлення',href:'/messages/',primary:true},{label:'Скасувати',attrs:'data-noop'}])}`};
 }
 if(/забронюй.*анн|заброн.*люкс/.test(q)){
  return{html:`<p>Знайдено гостя: <b>Анна Коваленко</b></p><p>На 20–23 вересня доступні:</p>${actionsHtml([{label:'204 · Люкс — 4 800 ₴',attrs:'data-flow-room="204"'},{label:'205 · Люкс — 5 400 ₴',attrs:'data-flow-room="205"'}])}`};
 }
 if(/напиши гост.*готов.*14:00|номер буде готов/.test(q)){
  return{html:`<p>Пропонований текст:</p><p style="background:#f7f7f8;border-radius:8px;padding:10px 12px">Вітаємо, Анно!<br>Ваш номер буде готовий до заселення після 14:00.<br>Якщо ваш час прибуття зміниться — можете написати нам у відповідь.</p>${actionsHtml([{label:'Використати повідомлення',href:'/messages/',primary:true},{label:'Змінити текст',attrs:'data-noop'}])}`};
 }

 if(/сьогодні важлив|що сьогодні|огляд дня/.test(q)){
  return{html:`<p>Сьогодні у вас <b>${KB.arrivals.length} заїзди</b> і <b>${KB.departures} виїзди</b>.</p><p><b>${KB.occupied} з ${KB.totalRooms}</b> номерів зайняті.</p><p><b>${KB.needsCleaning} номери</b> потребують прибирання.</p><p>За бронюваннями очікується <b>${money(KB.unpaidTotal)}</b> оплати.</p><p>Перше заселення — о <b>13:30</b>. Номер 204 потрібно підготувати до цього часу.</p>${actionsHtml([{label:'Заїзди',href:'/calendar/'},{label:'Прибирання',href:'/housekeeping/'},{label:'Оплати',href:'/payments/'}])}`,source:'На основі поточних даних Calendar, Housekeeping та Payments.'};
 }
 if(/хто.*заїжджа(є|ють).*сьогодні|заїзди сьогодні/.test(q)){
  return{html:`<p>Сьогодні очікується <b>${KB.arrivals.length} заїзди</b>.</p><div class="ai-cards">${KB.arrivals.map(a=>itemCard(a.time+' — '+a.guest,a.room+' · '+a.payment)).join('')}</div>${actionsHtml([{label:'Відкрити всі заїзди',href:'/calendar/',primary:true}])}`,source:`На основі ${KB.arrivals.length} бронювань на сьогодні.`};
 }
 if(/виїжджа(є|ють).*сьогодні|виїзди сьогодні/.test(q)){
  return{html:`<p>Сьогодні очікується <b>${KB.departures} виїзди</b>.</p>${actionsHtml([{label:'Відкрити календар',href:'/calendar/'}])}`};
 }
 if(/завтра.*бронюван|бронювань на завтра/.test(q)){
  return{html:`<p>На завтра заплановано <b>${KB.tomorrowBookings} бронювання</b>.</p>${actionsHtml([{label:'Відкрити календар',href:'/calendar/'}])}`};
 }
 if(/не підтвердж/.test(q)){
  return{html:`<p>Непідтверджені бронювання:</p><div class="ai-cards">${KB.unconfirmed.map(b=>itemCard(b.guest,`#${b.bookingId} · ${b.dates}`)).join('')}</div>${actionsHtml([{label:'Відкрити бронювання',href:'/booking/'}])}`};
 }
 if(/цього тижня.*заїжджа|заїзди.*тиждень/.test(q)){
  return{html:`<p>Цього тижня очікується <b>${KB.weekBookings} заїздів</b>.</p>${actionsHtml([{label:'Відкрити календар',href:'/calendar/'}])}`};
 }
 if(/скасован.*цього місяця|скасован.*бронюван/.test(q)){
  return{html:`<p>Скасовані бронювання цього місяця:</p><div class="ai-cards">${KB.cancelledThisMonth.map(b=>itemCard(b.guest,`#${b.bookingId} · ${b.reason}`)).join('')}</div>`};
 }
 if(/бронюван.*анн|покажи.*коваленко/.test(q)){
  const g=KB.guests['анна коваленко'];
  return{html:`<div class="ai-cards">${itemCard(g.name,`#${g.bookingId} · ${g.dates} · ${g.room}`,`<b>${money(g.total)}</b>`)}</div>${actionsHtml([{label:'Відкрити бронювання',href:'/booking/',primary:true}])}`};
 }
 if(/вільні.*(з \d|по \d|20.*23)/.test(q)||/номери вільні.*вересня/.test(q)){
  return{html:`<p>На 20–23 вересня доступні:</p><div class="ai-cards">${KB.freeWeekend.map(r=>itemCard(r.number+' · '+r.type,money(r.price)+' / ніч')).join('')}</div>${actionsHtml([{label:'Відкрити календар',href:'/calendar/'},{label:'Створити бронювання',href:'/new-booking/',primary:true}])}`};
 }

 if(/постійн.*гост|повторн.*гост.*хто/.test(q)){
  return{html:`<p>Постійні гості мають мінімум 2 завершених проживання. Наприклад: <b>Марія Петренко</b> (8 проживань), <b>Анна Коваленко</b> (4 проживання).</p>${actionsHtml([{label:'Переглянути гостей',href:'/guests/',primary:true}])}`};
 }
 if(/найбільше разів|найчастіше повертається/.test(q)){
  return{html:`<p><b>${KB.mostStays.name}</b> проживала у вас найбільше разів — ${KB.mostStays.stays}.</p>${actionsHtml([{label:'Відкрити профіль',href:'/guest/'}])}`};
 }
 if(/більше трьох разів/.test(q)){
  return{html:`<p><b>Марія Петренко</b> (8) та <b>Анна Коваленко</b> (4) поверталися більше трьох разів.</p>`};
 }
 if(/давно не був/.test(q)){
  return{html:`<p><b>${KB.longTimeGone} постійних гостей</b> мають мінімум 2 проживання і не були у вас понад 6 місяців.</p>${actionsHtml([{label:'Переглянути гостей',href:'/guests/',primary:true}])}`};
 }
 if(/нових гостей цього місяця|скільки нових/.test(q)){
  return{html:`<p>Цього місяця <b>${KB.newGuestsThisMonth} нових гостей</b>.</p>`};
 }
 if(/що ми знаємо про|про анну|про олега|про марію/.test(q)){
  const name=/олег/.test(q)?'олег бондар':/марі/.test(q)?'марія петренко':'анна коваленко';
  const g=KB.guests[name];
  return{html:`<p><b>${g.name}</b>${g.tag?' · '+g.tag:''}</p><p>${g.stays} проживання. Улюблений тип номера: ${g.favType}. Останній візит: ${g.lastVisit}.</p>${g.pref?`<p>Побажання: ${g.pref}.</p>`:''}${actionsHtml([{label:'Відкрити профіль',href:'/guest/',primary:true}])}`,source:'На основі профілю гостя та історії проживань.'};
 }
 if(/побажанн.*гост/.test(q)){
  return{html:`<p>Анна Коваленко: тихий номер, пізній check-in.</p>`};
 }

 if(/хто.*не оплат|не оплативши/.test(q)){
  return{html:`<p>Ще не оплатили:</p><div class="ai-cards">${KB.unpaidBookings.map(b=>itemCard(b.guest,`#${b.bookingId}`,`<b>${money(b.balance)}</b>`)).join('')}</div>${actionsHtml([{label:'Відкрити оплати',href:'/payments/',primary:true}])}`,source:'На основі активних бронювань з неоплаченим залишком.'};
 }
 if(/скільки.*отримали сьогодні|дохід сьогодні/.test(q)){
  return{html:`<p>Сьогодні отримано <b>${money(KB.receivedToday)}</b>.</p>${actionsHtml([{label:'Відкрити оплати',href:'/payments/'}])}`};
 }
 if(/очікується оплат|скільки очікується/.test(q)){
  return{html:`<p>Очікується оплат на суму <b>${money(KB.unpaidTotal+12400)}</b> за поточними бронюваннями.</p>`};
 }
 if(/заїжджа.*сьогодні.*борг|борг.*сьогодні/.test(q)){
  return{html:`<p>Сьогодні із заборгованістю заїжджає <b>Олег Бондар</b> — залишок ${money(1200)}.</p>${actionsHtml([{label:'Відкрити бронювання',href:'/booking/'}])}`};
 }
 if(/передоплат.*цього місяця|скільки передоплат/.test(q)){
  return{html:`<p>Цього місяця отримано передоплат на суму <b>${money(KB.depositsThisMonth)}</b>.</p>`};
 }
 if(/повернення|повернуто/.test(q)){
  return{html:`<p>Повернення цього місяця:</p><div class="ai-cards">${KB.refunds.map(r=>itemCard(r.guest,`#${r.bookingId}`,`<b>${money(r.amount)}</b>`)).join('')}</div>`};
 }
 if(/найбільший.*залишок|найбільший борг/.test(q)){
  return{html:`<p>Найбільший неоплачений залишок: <b>${KB.biggestBalance.guest}</b> · #${KB.biggestBalance.bookingId} · ${money(KB.biggestBalance.balance)}.</p>${actionsHtml([{label:'Відкрити бронювання',href:'/booking/'}])}`};
 }

 if(/номери зараз вільн|які номери вільн/.test(q)){
  return{html:`<p>Зараз вільні:</p><div class="ai-cards">${KB.freeNow.map(r=>itemCard(r.number+' · '+r.type,'Готовий')).join('')}</div>${actionsHtml([{label:'Відкрити номери',href:'/rooms/'}])}`};
 }
 if(/номери зайнят/.test(q)){
  return{html:`<p><b>${KB.occupied} з ${KB.totalRooms}</b> номерів зараз зайняті.</p>${actionsHtml([{label:'Відкрити номери',href:'/rooms/'}])}`};
 }
 if(/статус номера 204|номер 204/.test(q)){
  return{html:`<p>Номер 204: <b>${KB.roomStatus['204']}</b>.</p>${actionsHtml([{label:'Відкрити номер',href:'/rooms/'}])}`};
 }
 if(/звільниться номер 205|коли.*205/.test(q)){
  return{html:`<p>Номер 205 вже вільний і готовий.</p>`};
 }
 if(/заблоковані.*ремонт|номери.*заблоковані/.test(q)){
  return{html:`<div class="ai-cards">${KB.blockedRooms.map(r=>itemCard(r.number,`${r.reason} · ${r.period}`)).join('')}</div>${actionsHtml([{label:'Відкрити номери',href:'/rooms/'}])}`};
 }

 if(/потрібно прибрати|що ще прибрати/.test(q)){
  return{html:`<p>Потрібно прибрати:</p><div class="ai-cards">${KB.cleaning.needs.map(r=>itemCard('Номер '+r.number,r.arrival?'Заїзд о '+r.arrival:'')).join('')}</div>${actionsHtml([{label:'Відкрити прибирання',href:'/housekeeping/',primary:true}])}`};
 }
 if(/найтерміновіший|найважливіший номер/.test(q)){
  return{html:`<p>Найтерміновіший — <b>номер 204</b>: заїзд о 13:30, ще не готовий.</p>${actionsHtml([{label:'Відкрити прибирання',href:'/housekeeping/'}])}`};
 }
 if(/хто прибирає 204|прибирає.*204/.test(q)){
  return{html:`<p>Номер 204 ще не призначено на прибирання.</p>${actionsHtml([{label:'Призначити',href:'/housekeeping/'}])}`};
 }
 if(/заїзд у найближчі 2 години|найближчі 2 години/.test(q)){
  return{html:`<p>У найближчі 2 години заїжджає гість у номер <b>204</b> (13:30).</p>`};
 }
 if(/непризначені задачі/.test(q)){
  return{html:`<p>Так, <b>${KB.unassignedTasks} непризначені задачі</b> з прибирання.</p>${actionsHtml([{label:'Відкрити прибирання',href:'/housekeeping/'}])}`};
 }
 if(/номери вже готові|готові номери/.test(q)){
  return{html:`<p>Готові: ${KB.cleaning.ready.join(', ')}.</p>`};
 }

 if(/найбільше бронювань.*звідки|звідки.*найбільше/.test(q)){
  return{html:`<p><b>${KB.sales.topSource}</b> дає найбільше бронювань — ${KB.sales.topCount}.</p>${actionsHtml([{label:'Переглянути продажі',href:'/sales/',primary:true}])}`};
 }
 if(/дохід цього місяця|скільки.*отримали цього місяця/.test(q)){
  return{html:`<p>Дохід цього місяця — <b>${money(KB.sales.revenueMonth)}</b>.</p>`,source:'На основі 86 бронювань за 1–30 вересня.'};
 }
 if(/instagram/.test(q)){
  return{html:`<p>Instagram приніс <b>${KB.sales.instagram.count} бронювань</b> на <b>${money(KB.sales.instagram.revenue)}</b>.</p>${actionsHtml([{label:'Переглянути продажі',href:'/sales/'}])}`};
 }
 if(/частка прямих/.test(q)){
  return{html:`<p>Частка прямих бронювань — <b>${KB.sales.directShare}%</b> (було ${KB.sales.directSharePrev}% минулого місяця).</p>`};
 }
 if(/повторних гостей|скільки повторних/.test(q)){
  return{html:`<p>Повторних гостей цього місяця — <b>${KB.sales.returning}</b>.</p>`};
 }
 if(/змінилися продажі|порівняно з минулим місяцем/.test(q)){
  return{html:`<p>Прямі бронювання: ${KB.sales.directSharePrev}% → ${KB.sales.directShare}%. Дохід зростає порівняно з минулим місяцем.</p>${actionsHtml([{label:'Переглянути продажі',href:'/sales/'}])}`};
 }

 return null;
}

function fallbackAnswer(){
 return{html:`<p>Не знайшов точної відповіді на це запитання. Спробуйте одне з підказаних або перефразуйте.</p><div class="ai-cards">${SUGGESTIONS.slice(0,3).map(s=>itemCard(s,'Натисніть, щоб запитати')).join('')}</div>`};
}

function handleQuery(text){
 pushUser(text);
 const loadingText=/номер|вільн/i.test(text)?'Шукаю доступні номери...':'Перевіряю бронювання та дані готелю...';
 const idx=pushLoading(loadingText);
 setTimeout(()=>{
  const res=answer(text)||fallbackAnswer();
  let html=res.html;
  if(res.source)html+=sourceHtml(res.source);
  resolveLoading(idx,html,res.noFeedback);
 },500);
}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el.id==='btn-history'){historyModal();return}
 if(el.id==='btn-clear'){messages.length=0;renderMessages();toast('Чат очищено');return}
 if(el.dataset.restore){closeDialog();handleQuery(el.dataset.restore);return}
 if(el.dataset.suggest){handleQuery(el.dataset.suggest);return}
 if(el.dataset.quick){handleQuery(el.dataset.quick);return}
 if(el.id==='send-btn'){const ta=$('#composer-input');if(ta.value.trim()){handleQuery(ta.value.trim());ta.value='';ta.style.height='auto'}return}
 if(el.dataset.goto){window.location.href=el.dataset.goto;return}
 if(el.dataset.openDetails!==undefined){window.location.href='/dashboard/';return}
 if(el.dataset.flowRoom){
  const price=el.dataset.flowRoom==='204'?4800:5400;
  pushMessage('ai',`<p>Обрано номер ${el.dataset.flowRoom} · Люкс.</p><p><b>Анна Коваленко</b><br>Номер: ${el.dataset.flowRoom} · Люкс<br>Дати: 20–23 вересня<br>Сума: ${money(price)}</p>${actionsHtml([{label:'Відкрити форму бронювання',href:'/new-booking/',primary:true}])}`);
  return;
 }
 if(el.dataset.noop!==undefined){toast('Дію скасовано');return}
 if(el.dataset.fb){
  const i=Number(el.dataset.idx);
  $('#fb-picked-'+i).innerHTML=el.dataset.fb==='down'?`<div class="feedback-reasons"><button>Неточні дані</button><button>Не зрозумів запит</button><button>Неповна відповідь</button><button>Інше</button></div>`:'<span style="color:#8b6c30">Дякуємо за відгук!</span>';
  $$('.feedback-row[data-msg="'+i+'"] button[data-fb]').forEach(b=>b.classList.toggle('picked',b.dataset.fb===el.dataset.fb));
  hydrate();
  return;
 }
});
document.addEventListener('change',e=>{if(e.target.id==='role-select'){CURRENT_ROLE.value=e.target.value;HotelRole.set(e.target.value);toast('Роль (демо): '+ROLE_LABEL[CURRENT_ROLE.value])}});
$('#composer-input').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=Math.min(120,e.target.scrollHeight)+'px'});
$('#composer-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#send-btn').click()}});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');document.documentElement.classList.remove('no-scroll')}});

renderMessages();
hydrate();
