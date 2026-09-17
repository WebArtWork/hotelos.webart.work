'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const TYPES={
 'Стандарт':{price:1200,capacity:2,beds:'1 двоспальне ліжко',amenities:['Wi-Fi','Кондиціонер','Телевізор','Душ']},
 'Покращений':{price:1500,capacity:3,beds:'1 двоспальне + диван',amenities:['Wi-Fi','Кондиціонер','Телевізор','Душ','Балкон']},
 'Люкс':{price:1600,capacity:2,beds:'1 двоспальне ліжко',amenities:['Wi-Fi','Кондиціонер','Телевізор','Фен','Мінібар','Сніданок']},
 'Апартаменти':{price:2200,capacity:4,beds:'2 спальні + диван',amenities:['Wi-Fi','Кондиціонер','Телевізор','Кухня','Пральна машина']}
};
const guestNames=['Олег Бондар','Марія Петренко','Ірина Шевченко','Дмитро Левченко','Наталія Коваль','Максим Ткаченко','Андрій Мельник','Тарас Гончар','Юлія Савчук','Віктор Коваль'];

function buildRooms(){
 const list=[];
 let gi=0;
 const push=(number,type,floor,overrides={})=>{
  const base=TYPES[type];
  list.push(Object.assign({number,type,floor,capacity:base.capacity,beds:base.beds,area:22+Math.floor(Math.random()*10),price:base.price,amenities:base.amenities,status:'occupied',guest:guestNames[gi++%guestNames.length],checkout:'20 вересня',maintenanceNotes:[]},overrides));
 };
 for(let i=101;i<=110;i++)push(String(i),'Стандарт',1);
 for(let i=111;i<=114;i++)push(String(i),'Покращений',1);
 for(let i=201;i<=208;i++)push(String(i),'Люкс',2);
 for(let i=301;i<=306;i++)push(String(i),'Апартаменти',3);

 const set=(num,overrides)=>Object.assign(list.find(r=>r.number===num),overrides);
 set('204',{status:'occupied',guest:'Анна Коваленко',checkin:'17 вересня',checkout:'20 вересня',nights:3,payment:'Оплачено',nextGuest:'Олег Бондар',nextStart:'21 вересня',nextEnd:'23 вересня',nextArrival:'14:30',maintenanceNotes:[{date:'12 вересня',text:'Потрібно замінити лампу біля ліжка.',status:'Виконано'},{date:'2 серпня',text:'Перевірити кондиціонер.',status:'Виконано'}]});
 set('103',{status:'ready',guest:null,nextGuest:null,nextArrival:'21 вересня',lastCleaned:'17 вересня · 11:40',cleanedBy:'Марія'});
 set('205',{status:'ready',guest:null,nextArrival:null,lastCleaned:'16 вересня · 10:20',cleanedBy:'Оксана'});
 set('207',{status:'needs-cleaning',guest:null,checkoutTime:'11:08',assigned:null});
 set('302',{status:'needs-cleaning',guest:null,checkoutTime:'10:40',assigned:null});
 set('206',{status:'cleaning',guest:null,assigned:'Марія',startedAt:'12:20',nextArrival:'13:30'});
 set('301',{status:'unavailable',guest:null,reason:'Ремонт',blockStart:'17 вересня',blockEnd:'19 вересня'});
 return list;
}
const rooms=buildRooms();

function typeOrder(){return ['Стандарт','Покращений','Люкс','Апартаменти']}
function counts(){
 const occupied=rooms.filter(r=>r.status==='occupied').length;
 const ready=rooms.filter(r=>r.status==='ready').length;
 const cleaningKpi=rooms.filter(r=>r.status==='needs-cleaning'||r.status==='cleaning').length;
 const unavailable=rooms.filter(r=>r.status==='unavailable').length;
 return{total:rooms.length,occupied,ready,cleaningKpi,unavailable};
}

const state={search:'',segment:'all',viewMode:'cards',filters:{types:new Set(typeOrder()),statuses:new Set(['ready','occupied','needs-cleaning','cleaning','unavailable']),capacity:new Set(['1','2','3','4'])}};

function capBucket(cap){return cap>=4?'4':cap>=3?'3':String(cap)}
function passesFilters(r){
 if(!state.filters.types.has(r.type))return false;
 if(!state.filters.statuses.has(r.status))return false;
 if(!state.filters.capacity.has(capBucket(r.capacity)))return false;
 return true;
}
function filteredRooms(){
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 let list=rooms.filter(passesFilters);
 if(q)list=list.filter(r=>(r.number+' '+r.type).toLocaleLowerCase('uk-UA').includes(q));
 if(state.segment==='ready')list=list.filter(r=>r.status==='ready');
 else if(state.segment==='occupied')list=list.filter(r=>r.status==='occupied');
 else if(state.segment==='cleaning')list=list.filter(r=>r.status==='needs-cleaning'||r.status==='cleaning');
 else if(state.segment==='unavailable')list=list.filter(r=>r.status==='unavailable');
 return list;
}
function statusLabel(s){return{occupied:'Зайнятий',ready:'Готовий','needs-cleaning':'Потребує прибирання',cleaning:'Прибирається',unavailable:'Недоступний'}[s]}

function renderKpis(){
 const c=counts();
 $('#kpis').innerHTML=`<div class="kpi"><small>Усього номерів</small><b>${c.total}</b></div><div class="kpi"><small>Зайняті</small><b>${c.occupied}</b><span>${Math.round(c.occupied/c.total*100)}%</span></div><div class="kpi"><small>Вільні</small><b>${c.ready}</b></div><div class="kpi"><small>Потребують прибирання</small><b>${c.cleaningKpi}</b></div><div class="kpi"><small>Недоступні</small><b>${c.unavailable}</b></div>`;
}

function roomCardHtml(r){
 const sub=r.status==='occupied'?`<div class="rc-guest">${esc(r.guest)}</div><div class="rc-sub">До: ${r.checkout}</div>`
  :r.status==='ready'?`<div class="rc-sub">${r.nextArrival?'Наступний заїзд: '+r.nextArrival:'Вільний зараз'}</div>`
  :r.status==='needs-cleaning'?`<div class="rc-sub">Виїзд: ${r.checkoutTime||'—'}</div><div class="rc-sub">Призначено: ${r.assigned||'не призначено'}</div>`
  :r.status==='cleaning'?`<div class="rc-sub">${r.assigned} · з ${r.startedAt}</div>${r.nextArrival?`<div class="rc-warning">До заїзду о ${r.nextArrival}</div>`:''}`
  :`<div class="rc-sub">${esc(r.reason)}</div><div class="rc-sub">${r.blockStart}–${r.blockEnd}</div>`;
 const action=r.status==='ready'?`<button data-quick-book="${r.number}">Створити бронювання</button>`
  :r.status==='needs-cleaning'?`<button class="primary" data-assign-clean="${r.number}">Призначити прибирання</button>`
  :r.status==='cleaning'?`<button data-open-task="${r.number}">Відкрити задачу</button>`
  :r.status==='unavailable'?`<button data-edit-block="${r.number}">Редагувати блокування</button>`
  :`<button data-open-booking="${r.number}">Відкрити бронювання</button>`;
 return `<div class="room-card status-${r.status}" data-room="${r.number}">
  <div class="rc-top"><div><div class="rc-num">${r.number}</div><div class="rc-type">${r.type}</div></div><span class="status-tag ${r.status}">${statusLabel(r.status)}</span></div>
  <div class="rc-facts">${r.capacity} гості · ${r.beds}</div>
  <div class="rc-price">${money(r.price)} / ніч</div>
  ${sub}
  <div class="rc-actions">${action}</div>
 </div>`;
}
function renderCards(){
 const list=filteredRooms();
 const groups=typeOrder().map(t=>{
  const items=list.filter(r=>r.type===t);
  if(!items.length)return'';
  return `<div class="type-group"><h2>${t} <span>${items.length} номер${items.length===1?'':'и'}</span></h2><div class="room-cards">${items.map(roomCardHtml).join('')}</div></div>`;
 }).join('');
 $('#rooms-container').innerHTML=`<div class="type-groups">${groups}</div>`;
}
function renderList(){
 const list=filteredRooms();
 $('#rooms-container').innerHTML=`<div class="table-card"><div class="table-wrap"><table><thead><tr><th>Номер</th><th>Тип</th><th>Місткість</th><th>Ціна</th><th>Поточний гість</th><th>Наступний заїзд</th><th>Прибирання</th><th>Статус</th><th></th></tr></thead><tbody>${list.map(r=>`<tr data-room="${r.number}">
  <td class="num-cell">${r.number}</td><td>${r.type}</td><td>${r.capacity} гості</td><td><b>${money(r.price)}</b></td>
  <td>${r.status==='occupied'?esc(r.guest):'—'}</td>
  <td>${r.status==='ready'&&r.nextArrival?r.nextArrival:r.status==='occupied'&&r.nextGuest?r.nextStart:'—'}</td>
  <td>${r.status==='cleaning'?'Прибирається':r.status==='needs-cleaning'?'Потребує прибирання':'—'}</td>
  <td><span class="status-tag ${r.status}">${statusLabel(r.status)}</span></td>
  <td class="row-menu-wrap"><button data-row-menu="${r.number}" aria-label="Дії">⋯</button></td>
 </tr>`).join('')}</tbody></table></div></div>`;
}
function renderRooms(){
 if(rooms.length===0){
  $('#rooms-container').hidden=true;$('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Додайте номерний фонд</h2><p>Створіть номери, щоб почати працювати з календарем та бронюваннями.</p><button class="button primary" id="empty-add-room">+ Додати перший номер</button><p class="form-note" style="margin-top:14px">Після цього ви зможете створювати бронювання та приймати гостей.</p></div>`;
  hydrate();return;
 }
 const list=filteredRooms();
 $('#rooms-container').hidden=false;$('#empty-state').hidden=true;
 if(!list.length){
  $('#rooms-container').hidden=true;$('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Номерів не знайдено</h2><p>Спробуйте змінити пошук або фільтри.</p></div>`;
  hydrate();return;
 }
 if(state.viewMode==='cards')renderCards();else renderList();
 hydrate();
}
function renderAll(){renderKpis();renderRooms()}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openRoomPanel(number){
 const r=rooms.find(r=>r.number===number);if(!r)return;
 $('#side-body').innerHTML=`
 <span class="status-tag ${r.status}">${statusLabel(r.status)}</span>
 <h2>Номер ${r.number}</h2>
 <div class="dialog-actions"><button class="button secondary" data-edit-room="${r.number}">Редагувати</button><a class="button primary" href="/new-booking/">+ Нове бронювання</a></div>

 <h5>Основна інформація</h5>
 <div class="info-grid"><dt>Тип</dt><dd>${r.type}</dd><dt>Поверх</dt><dd>${r.floor}</dd><dt>Місткість</dt><dd>${r.capacity} гості</dd><dt>Площа</dt><dd>${r.area} м²</dd></div>

 <h5>Спальні місця</h5>
 <p style="margin:0;font-size:12px">${r.beds}<br>Місткість: ${r.capacity} дорослих</p>

 <h5>Зручності</h5>
 <div class="tags">${r.amenities.map(a=>`<span>${esc(a)}</span>`).join('')}</div>

 <h5>Ціна</h5>
 <div class="info-grid"><dt>Базова ціна</dt><dd>${money(r.price)} / ніч</dd><dt>Вихідні</dt><dd>${money(Math.round(r.price*1.12/100)*100)}</dd><dt>Додатковий гість</dt><dd>+400 ₴</dd></div>

 ${r.status==='occupied'?`<h5>Поточне проживання</h5><p style="margin:0;font-size:12px"><b>${esc(r.guest)}</b><br>${r.checkin}–${r.checkout} · ${r.nights} ночі<br>Оплата: <b>${r.payment}</b></p><button class="text-action" style="margin-top:8px" data-open-booking="${r.number}">Відкрити бронювання →</button>`:''}
 ${r.nextGuest?`<h5>Наступне бронювання</h5><p style="margin:0;font-size:12px">${r.nextStart}–${r.nextEnd}<br><b>${esc(r.nextGuest)}</b> · Заїзд: ${r.nextArrival}</p><button class="text-action" style="margin-top:8px" data-open-booking="${r.number}">Відкрити бронювання →</button>`:''}

 <h5>Найближчі дати</h5>
 <div class="mini-timeline"><span class="${r.status==='occupied'?'busy':'free'}" style="flex:2">17–20</span><span class="free" style="flex:1">20–21</span><span class="busy" style="flex:2">21–23</span><span class="free" style="flex:3">23–27</span></div>
 <button class="text-action" style="margin-top:8px" data-open-calendar>Відкрити в календарі →</button>

 <h5>Прибирання</h5>
 <p style="margin:0;font-size:12px">Статус: <b>${statusLabel(r.status==='occupied'?'ready':r.status)}</b>${r.lastCleaned?`<br>Останнє прибирання: ${r.lastCleaned}<br>Виконав(ла): ${r.cleanedBy}`:''}</p>
 <button class="text-action" style="margin-top:8px" data-view="housekeeping">Відкрити прибирання →</button>

 ${r.maintenanceNotes.length?`<h5>Технічні нотатки</h5>${r.maintenanceNotes.map(n=>`<div class="note-card"><b>${n.date}</b><p>${esc(n.text)}</p><span class="pill ready">${n.status}</span></div>`).join('')}`:''}

 <h5>Дії</h5>
 <div class="dialog-actions">
  <button class="button secondary" data-block-room="${r.number}">Заблокувати номер</button>
  <button class="button secondary" data-change-status="${r.number}">Змінити статус</button>
 </div>`;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function addRoomModal(){
 show('Додати номер',`<form class="demo-form" id="add-room-form">
  <label>Номер / назва<input name="number" required maxlength="8" placeholder="204"></label>
  <label>Тип<select name="type">${typeOrder().map(t=>`<option>${t}</option>`).join('')}<option>Інше</option></select></label>
  <label>Поверх<input name="floor" type="number" min="0" value="1"></label>
  <label>Місткість (дорослі)<input name="capacity" type="number" min="1" value="2"></label>
  <label class="full">Базова ціна, ₴<input name="price" type="number" min="1" value="1600"></label>
  <button class="button primary full" type="submit">Додати номер</button>
 </form>`);
}
function roomTypesModal(){
 show('Типи номерів',`<div class="result-list">
  <div class="result-item"><span><b>Стандарт</b><small>8 номерів · 2 гості</small></span><span>від 1 200 ₴</span></div>
  <div class="result-item"><span><b>Покращений</b><small>4 номери · 3 гості</small></span><span>від 1 500 ₴</span></div>
  <div class="result-item"><span><b>Люкс</b><small>6 номерів · 2–3 гості</small></span><span>від 1 600 ₴</span></div>
  <div class="result-item"><span><b>Апартаменти</b><small>4 номери · 4 гості</small></span><span>від 2 200 ₴</span></div>
 </div><button class="button secondary" id="btn-add-type">+ Додати тип</button>`);
}
function addTypeModal(){
 show('Створити тип номера',`<form class="demo-form" id="add-type-form">
  <label class="full">Назва<input name="name" required placeholder="Люкс"></label>
  <label class="full">Опис<textarea name="desc" placeholder="Просторий номер для двох гостей."></textarea></label>
  <label>Місткість за замовчуванням<input name="capacity" type="number" min="1" value="2"></label>
  <label>Базова ціна, ₴<input name="price" type="number" min="1" value="1600"></label>
  <button class="button primary full" type="submit">Створити тип</button>
 </form>`);
}
function blockRoomModal(number){
 show('Зробити номер недоступним',`<form class="demo-form" id="block-form" data-room="${number}">
  <p class="full">Номер ${number}</p>
  <label>Початок<input name="start" type="date" value="2026-09-17"></label>
  <label>Кінець<input name="end" type="date" value="2026-09-19"></label>
  <label class="full">Причина<select name="reason"><option>Ремонт</option><option>Технічні роботи</option><option>Приватне використання</option><option>Інше</option></select></label>
  <label class="full">Нотатка (необов’язково)<input name="note" maxlength="120"></label>
  <p class="full form-note">Номер буде недоступний для нових бронювань і позначений у Календарі.</p>
  <button class="button primary full" type="submit">Заблокувати</button>
 </form>`);
}
function changeStatusModal(number){
 const r=rooms.find(r=>r.number===number);
 show('Змінити статус',`<form class="demo-form" id="status-form" data-room="${number}">
  <label class="full">Статус<select name="status">
   <option value="ready" ${r.status==='ready'?'selected':''}>Готовий</option>
   <option value="needs-cleaning" ${r.status==='needs-cleaning'?'selected':''}>Потребує прибирання</option>
   <option value="cleaning" ${r.status==='cleaning'?'selected':''}>Прибирається</option>
   <option value="occupied" ${r.status==='occupied'?'selected':''}>Зайнятий</option>
   <option value="unavailable" ${r.status==='unavailable'?'selected':''}>Недоступний</option>
  </select></label>
  <p class="full form-note">Статус «Зайнятий» встановлюється автоматично при заїзді гостя.</p>
  <button class="button primary full" type="submit">Зберегти статус</button>
 </form>`);
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const free=rooms.filter(r=>r.status==='ready').map(r=>r.number);
 const toClean=rooms.filter(r=>r.status==='needs-cleaning'||r.status==='cleaning').map(r=>r.number);
 const blocked=rooms.filter(r=>r.status==='unavailable');
 const map={
  freeToday:free.length?`<p>Сьогодні вільні номери: <b>${free.join(', ')}</b>.</p>`:'<p>Наразі всі номери зайняті.</p>',
  toClean:toClean.length?`<p>Потрібно прибрати: <b>${toClean.join(', ')}</b>.</p>`:'<p>Усі номери прибрані.</p>',
  freeWeekend:`<p>За поточним графіком на вихідні орієнтовно вільні: <b>${free.join(', ')||'—'}</b> (залежно від бронювань).</p>`,
  popular:`<p>Найчастіше бронюють номери категорії <b>Люкс</b> — за даними останніх місяців.</p>`,
  blocked:blocked.length?`<p>${blocked.map(r=>`Номер <b>${r.number}</b> — ${esc(r.reason)} (${r.blockStart}–${r.blockEnd})`).join('<br>')}</p>`:'<p>Заблокованих номерів немає.</p>'
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>AI відповідає лише на основі даних номерного фонду.</p>'}</div>`;
}

document.addEventListener('click',e=>{
 $$('.row-menu').forEach(m=>{if(!e.target.closest('.row-menu-wrap'))m.remove()});
 if(!e.target.closest('.filters-wrap'))$('#filters-panel').hidden=true;
 const el=e.target.closest('button,a,input');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el&&el.matches('[data-close]')){closeDialog();return}
 if(el&&el.dataset.view==='housekeeping'){window.location.href='/housekeeping/';return}

 if(el&&el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el&&el.dataset.viewMode){$$('.view-switch button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.viewMode=el.dataset.viewMode;renderRooms();return}
 if(el&&el.dataset.seg){$$('#chips-mobile button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.segment=el.dataset.seg;renderRooms();return}
 if(el&&el.id==='filters-toggle'){$('#filters-panel').hidden=!$('#filters-panel').hidden;return}
 if(el&&el.id==='filters-clear'){$$('#filters-panel input[type=checkbox]').forEach(c=>c.checked=true);return}
 if(el&&el.id==='filters-apply'){
  const sections=$$('#filters-panel section');
  state.filters.types=new Set([...sections[0].querySelectorAll('input:checked')].map(c=>c.value));
  state.filters.statuses=new Set([...sections[1].querySelectorAll('input:checked')].map(c=>c.value));
  state.filters.capacity=new Set([...sections[2].querySelectorAll('input:checked')].map(c=>c.value));
  $('#filters-panel').hidden=true;renderRooms();return;
 }
 if(el&&(el.id==='btn-add-room'||el.id==='empty-add-room')){addRoomModal();return}
 if(el&&el.id==='btn-room-types'){roomTypesModal();return}
 if(el&&el.id==='btn-add-type'){addTypeModal();return}
 if(el&&el.dataset.quickBook){window.location.href='/new-booking/';return}
 if(el&&el.dataset.assignClean){const r=rooms.find(r=>r.number===el.dataset.assignClean);r.status='cleaning';r.assigned='Марія';r.startedAt=new Date().toTimeString().slice(0,5);renderAll();toast('Прибирання призначено · Демо');return}
 if(el&&el.dataset.openTask){show('Задача прибирання','<p>Повний трекер задач прибирання ще у розробці в демонстраційній версії.</p>');return}
 if(el&&el.dataset.editBlock){blockRoomModal(el.dataset.editBlock);return}
 if(el&&el.dataset.openBooking){window.location.href='/booking/';return}
 if(el&&el.dataset.openCalendar!==undefined){window.location.href='/calendar/';return}
 if(el&&el.dataset.editRoom){show('Редагувати номер',`<form class="demo-form" id="edit-room-form" data-room="${el.dataset.editRoom}"><label>Тип<select name="type">${typeOrder().map(t=>`<option>${t}</option>`).join('')}</select></label><label>Ціна, ₴<input name="price" type="number" min="1" value="${rooms.find(r=>r.number===el.dataset.editRoom).price}"></label><button class="button primary full" type="submit">Зберегти</button></form>`);return}
 if(el&&el.dataset.blockRoom){blockRoomModal(el.dataset.blockRoom);return}
 if(el&&el.dataset.changeStatus){changeStatusModal(el.dataset.changeStatus);return}
 if(el&&el.dataset.rowMenu){
  e.stopPropagation();
  const existing=document.getElementById('rm-'+el.dataset.rowMenu);
  $$('.row-menu').forEach(m=>m.remove());
  if(!existing){el.closest('.row-menu-wrap').insertAdjacentHTML('beforeend',`<div class="row-menu" id="rm-${el.dataset.rowMenu}">
   <button data-edit-room="${el.dataset.rowMenu}">Редагувати</button>
   <button data-quick-book="${el.dataset.rowMenu}">Створити бронювання</button>
   <button data-block-room="${el.dataset.rowMenu}">Заблокувати номер</button>
   <button data-change-status="${el.dataset.rowMenu}">Змінити статус</button>
  </div>`);}
  return;
 }
 if(el&&el.id==='side-close'){closeSidePanel();return}
 if(el&&el.id==='side-scrim'){closeSidePanel();return}

 const card=e.target.closest('.room-card[data-room]');
 if(card&&!e.target.closest('.rc-actions')){openRoomPanel(card.dataset.room);return}
 const row=e.target.closest('tr[data-room]');
 if(row&&!e.target.closest('.row-menu-wrap')){openRoomPanel(row.dataset.room);return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);

document.addEventListener('input',e=>{if(e.target.id==='search-input'){state.search=e.target.value;renderRooms()}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-room-form'){
  const type=String(data.get('type'));const base=TYPES[type]||TYPES['Стандарт'];
  rooms.push({number:String(data.get('number')),type,floor:Number(data.get('floor')),capacity:Number(data.get('capacity')),beds:base.beds,area:24,price:Number(data.get('price')),amenities:base.amenities,status:'ready',guest:null,maintenanceNotes:[],lastCleaned:'—',cleanedBy:'—'});
  closeDialog();renderAll();toast('Номер додано');
 }else if(f.id==='add-type-form'){closeDialog();toast('Тип номера створено · Демо')}
 else if(f.id==='block-form'){
  const r=rooms.find(r=>r.number===f.dataset.room);
  r.status='unavailable';r.reason=String(data.get('reason'));r.blockStart=data.get('start');r.blockEnd=data.get('end');
  closeDialog();renderAll();toast('Номер заблоковано');
 }else if(f.id==='status-form'){
  const r=rooms.find(r=>r.number===f.dataset.room);r.status=String(data.get('status'));
  closeDialog();renderAll();toast('Статус оновлено');
 }else if(f.id==='edit-room-form'){
  const r=rooms.find(r=>r.number===f.dataset.room);r.type=String(data.get('type'));r.price=Number(data.get('price'));
  closeDialog();renderAll();toast('Зміни збережено');
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');closeSidePanel()}});

renderAll();
