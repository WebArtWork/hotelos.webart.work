'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';
const initials=n=>n.split(' ').slice(0,2).map(p=>p[0]).join('');
const MS=86400000;
const TODAY='2026-09-17';
const dayDiff=(a,b)=>Math.round((new Date(b)-new Date(a))/MS);
const fmt=iso=>iso?new Intl.DateTimeFormat('uk-UA',{day:'numeric',month:'long',year:'numeric'}).format(new Date(iso)):'';

const guestsDb=[
 {id:1,name:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',tags:['Постійний гість'],stays:4,nights:12,spent:28400,lastVisit:'2026-08-20',nextBooking:'2026-09-17',room:'204 · Люкс',staying:false,prefs:['Тихий номер','Пізній check-in']},
 {id:2,name:'Олег Бондар',phone:'+380 50 222 11 33',email:'',tags:[],stays:1,nights:2,spent:3200,lastVisit:'2026-07-12',nextBooking:null,room:null,staying:false,prefs:[]},
 {id:3,name:'Марія Петренко',phone:'+380 63 456 78 90',email:'maria@example.com',tags:['VIP'],stays:8,nights:31,spent:74800,lastVisit:'2026-09-01',nextBooking:'2026-10-05',room:'202 · Люкс',staying:false,prefs:['Високий поверх']},
 {id:4,name:'Ірина Шевченко',phone:'+380 97 654 32 10',email:'',tags:['Сім’я'],stays:2,nights:5,spent:9200,lastVisit:'2025-12-20',nextBooking:null,room:null,staying:false,prefs:['Дитяче ліжечко']},
 {id:5,name:'Дмитро Левченко',phone:'+380 66 111 22 33',email:'',tags:[],stays:0,nights:0,spent:0,lastVisit:null,nextBooking:'2026-09-25',room:'106 · Покращений',staying:false,prefs:[]},
 {id:6,name:'Олена Романюк',phone:'+380 68 222 33 44',email:'',tags:['Постійний гість'],stays:3,nights:7,spent:15400,lastVisit:'2026-09-16',nextBooking:null,room:'101',staying:true,prefs:['Тихий номер']},
 {id:7,name:'Максим Ткаченко',phone:'+380 63 333 44 55',email:'',tags:[],stays:1,nights:3,spent:6600,lastVisit:'2026-06-10',nextBooking:null,room:null,staying:false,prefs:[]},
 {id:8,name:'Наталія Коваль',phone:'+380 97 555 66 77',email:'natalia@example.com',tags:['Постійний гість','Бізнес'],stays:5,nights:14,spent:31200,lastVisit:'2026-08-25',nextBooking:'2026-11-02',room:'203 · Люкс',staying:false,prefs:['Ранній заїзд']},
 {id:9,name:'Андрій Мельник',phone:'+380 50 444 55 66',email:'',tags:[],stays:2,nights:4,spent:8000,lastVisit:'2026-03-01',nextBooking:null,room:null,staying:false,prefs:[]},
 {id:10,name:'Тарас Гончар',phone:'+380 66 777 88 99',email:'',tags:[],stays:1,nights:1,spent:1600,lastVisit:'2026-09-10',nextBooking:null,room:null,staying:false,prefs:[]}
];

function statusOf(g){
 if(g.staying)return{key:'staying',label:'У готелі'};
 if(g.nextBooking===TODAY)return{key:'today',label:'Приїжджає сьогодні'};
 if(g.nextBooking)return{key:g.stays>0?'upcoming':'new',label:g.stays>0?'Має бронювання':'Новий гість'};
 if(g.stays>0)return{key:'former',label:'Колишній гість'};
 return{key:'new',label:'Новий гість'};
}
function isAway(g){return g.stays>=2&&g.lastVisit&&dayDiff(g.lastVisit,TODAY)>180}
function isRegular(g){return g.stays>=2}

const state={search:'',segment:'all',sort:'activity',selected:new Set(),filters:{stays:new Set(['1','2-3','4-5','6+']),tags:new Set(['Постійний гість','VIP','Бізнес','Сім’я'])}};

function staysBucket(n){return n<=1?'1':n<=3?'2-3':n<=5?'4-5':'6+'}
function passesFilters(g){
 if(!state.filters.stays.has(staysBucket(g.stays)))return false;
 if(g.tags.length&&!g.tags.some(t=>state.filters.tags.has(t)))return false;
 return true;
}
function filteredGuests(){
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 let list=guestsDb.filter(g=>passesFilters(g));
 if(q)list=list.filter(g=>(g.name+' '+g.phone+' '+g.email).toLocaleLowerCase('uk-UA').includes(q));
 if(state.segment==='staying')list=list.filter(g=>g.staying);
 else if(state.segment==='upcoming')list=list.filter(g=>!!g.nextBooking);
 else if(state.segment==='regular')list=list.filter(isRegular);
 else if(state.segment==='new')list=list.filter(g=>g.stays===0);
 else if(state.segment==='away')list=list.filter(isAway);
 const sorters={
  activity:(a,b)=>new Date(b.nextBooking||b.lastVisit||0)-new Date(a.nextBooking||a.lastVisit||0),
  name:(a,b)=>a.name.localeCompare(b.name,'uk'),
  stays:(a,b)=>b.stays-a.stays,
  spent:(a,b)=>b.spent-a.spent,
  visit:(a,b)=>new Date(b.lastVisit||0)-new Date(a.lastVisit||0)
 };
 return list.slice().sort(sorters[state.sort]);
}

function renderKpis(){
 const total=1284,newMonth=86,repeat=guestsDb.filter(isRegular).length,back=42;
 $('#kpis').innerHTML=`<div class="kpi"><small>Усього гостей</small><b>${total.toLocaleString('uk-UA')}</b><span>за весь час</span></div><div class="kpi"><small>Нових цього місяця</small><b>${newMonth}</b><span>+14% до минулого місяця</span></div><div class="kpi"><small>Повторних гостей</small><b>214</b><span>17% бази</span></div><div class="kpi"><small>Повернулися цього місяця</small><b>${back}</b><span>гості з попередньою історією</span></div>`;
}

function statusTagHtml(g){const s=statusOf(g);return `<span class="status-tag ${s.key}">${s.label}</span>`}

function renderList(){
 const list=filteredGuests();
 $('#empty-state').hidden=true;
 if(guestsDb.length===0){
  $('.table-card').hidden=true;$('#guest-cards').hidden=true;
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Гостей поки немає</h2><p>Гості автоматично з’являтимуться тут після створення бронювань.</p><div class="empty-actions"><a class="button primary" href="/new-booking/">Створити бронювання</a><button class="button secondary" id="empty-add-guest">+ Додати гостя</button></div></div>`;
  hydrate();return;
 }
 if(!list.length){
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Гостя не знайдено</h2><p>Перевірте ім’я або номер телефону.</p><div class="empty-actions"><button class="button primary" id="empty-new-guest">+ Створити нового гостя</button></div></div>`;
  $('#guests-tbody').innerHTML='';$('#guest-cards').innerHTML='';
  hydrate();return;
 }
 $('#guests-tbody').innerHTML=list.map(g=>`<tr data-guest="${g.id}">
  <td><input type="checkbox" class="row-check" data-check="${g.id}" ${state.selected.has(g.id)?'checked':''}></td>
  <td class="name-cell">${esc(g.name)}${g.tags.length?`<small>${g.tags.map(esc).join(' · ')}</small>`:''}</td>
  <td class="contacts-cell"><span>${esc(g.phone)}</span>${g.email?`<span>${esc(g.email)}</span>`:''}</td>
  <td><b>${g.stays}</b></td>
  <td><b>${g.nights}</b></td>
  <td><b>${money(g.spent)}</b></td>
  <td>${g.lastVisit?fmt(g.lastVisit):'Ще не проживав'}</td>
  <td>${g.nextBooking?fmt(g.nextBooking):'—'}</td>
  <td>${statusTagHtml(g)}</td>
  <td class="row-actions"><button data-row-menu="${g.id}" aria-label="Дії">⋯</button></td>
 </tr>`).join('');
 $('#guest-cards').innerHTML=list.map(g=>`<div class="guest-card" data-guest="${g.id}">
  <div class="gc-top"><div><h3>${esc(g.name)}</h3><div class="gc-contact">${esc(g.phone)}</div></div>${statusTagHtml(g)}</div>
  <div class="gc-stats">${g.stays} проживання · ${g.nights} ночей</div>
  <div class="gc-spent">${money(g.spent)}</div>
  <div class="gc-visit">Останній візит: ${g.lastVisit?fmt(g.lastVisit):'Ще не проживав'}</div>
  <button class="button secondary" data-open-preview="${g.id}">Відкрити</button>
 </div>`).join('');
 $('#select-all').checked=list.length>0&&list.every(g=>state.selected.has(g.id));
 hydrate();
 renderBulkBar();
}
function renderBulkBar(){
 $('#bulk-bar').classList.toggle('show',state.selected.size>0);
 $('#bulk-count').textContent=state.selected.size+' вибрано';
}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function quickPreview(g){
 show(g.name,`<p>${g.stays} проживання · ${money(g.spent)} витрачено</p>
 <h5 style="font-size:9px;letter-spacing:1px;color:#9b9ca2;text-transform:uppercase;margin:18px 0 8px">Контакти</h5>
 <p style="margin:0">${esc(g.phone)}${g.email?'<br>'+esc(g.email):''}</p>
 <h5 style="font-size:9px;letter-spacing:1px;color:#9b9ca2;text-transform:uppercase;margin:18px 0 8px">Останнє проживання</h5>
 <p style="margin:0">${g.room&&g.lastVisit?g.room+'<br>'+fmt(g.lastVisit):'Ще не проживав'}</p>
 <h5 style="font-size:9px;letter-spacing:1px;color:#9b9ca2;text-transform:uppercase;margin:18px 0 8px">Наступне бронювання</h5>
 <p style="margin:0">${g.nextBooking?(g.room||'')+'<br>'+fmt(g.nextBooking):'Немає'}</p>
 ${g.prefs.length?`<h5 style="font-size:9px;letter-spacing:1px;color:#9b9ca2;text-transform:uppercase;margin:18px 0 8px">Побажання</h5><div class="detail-grid" style="grid-template-columns:1fr">${g.prefs.map(p=>`<div>${esc(p)}</div>`).join('')}</div>`:''}
 <div class="dialog-actions"><button class="button primary" data-open-profile="${g.id}">Відкрити профіль</button><a class="button secondary" href="/new-booking/">Створити бронювання</a></div>`);
}
function rowMenuFor(g){
 return `<div class="row-menu" id="row-menu-${g.id}">
  <button data-open-profile="${g.id}">Відкрити профіль</button>
  <button data-new-booking="${g.id}">Створити бронювання</button>
  <button data-message="${g.id}">Надіслати повідомлення</button>
  <button data-add-note="${g.id}">Додати нотатку</button>
  <button data-edit="${g.id}">Редагувати</button>
  <button data-merge="${g.id}">Об’єднати дублікати</button>
  <button class="destructive" data-delete="${g.id}">Видалити</button>
 </div>`;
}
function openProfile(id){if(id===1)window.location.href='/guest/';else toast('Профіль ще у розробці для цього демо-гостя')}
function addGuestModal(){
 show('Новий гість',`<form class="demo-form" id="add-guest-form">
  <label class="full">Ім’я *<input name="first" required maxlength="40"></label>
  <label class="full">Прізвище<input name="last" maxlength="40"></label>
  <label>Телефон *<input name="phone" id="ag-phone" required maxlength="20"></label>
  <label>Email<input name="email" type="email"></label>
  <label class="full">Нотатка<textarea name="note" maxlength="300"></textarea></label>
  <div class="full" id="duplicate-warning"></div>
  <button class="button primary full" type="submit">Додати гостя</button>
 </form>`);
 $('#ag-phone').addEventListener('input',e=>{
  const v=e.target.value.replace(/\s/g,'');
  const dup=guestsDb.find(g=>g.phone.replace(/\s/g,'')===v&&v.length>6);
  $('#duplicate-warning').innerHTML=dup?`<div class="notice">Схоже, цей гість уже є в CRM<br><b>${esc(dup.name)}</b> · ${dup.stays} проживання<div class="dialog-actions"><button type="button" class="button secondary" data-use-existing="${dup.id}">Відкрити існуючого</button><button type="button" class="button secondary" id="create-anyway">Все одно створити нового</button></div></div>`:'';
 });
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const byStays=[...guestsDb].sort((a,b)=>b.stays-a.stays)[0];
 const bySpend=[...guestsDb].sort((a,b)=>b.spent-a.spent)[0];
 const away=guestsDb.filter(isAway);
 const thisWeek=guestsDb.filter(g=>g.nextBooking&&dayDiff(TODAY,g.nextBooking)>=0&&dayDiff(TODAY,g.nextBooking)<=7);
 const map={
  returning:`<p>Найчастіше повертається <b>${esc(byStays.name)}</b> — ${byStays.stays} проживання.</p>`,
  topspend:`<p>Найбільше витратила <b>${esc(bySpend.name)}</b> — ${money(bySpend.spent)}.</p>`,
  away:away.length?`<p>${away.map(g=>esc(g.name)).join(', ')} — не були у нас понад 6 місяців.</p>`:'<p>Усі активні гості поверталися протягом останніх 6 місяців.</p>',
  week:thisWeek.length?`<p>${thisWeek.map(g=>`${esc(g.name)} — ${fmt(g.nextBooking)}`).join('<br>')}</p>`:'<p>На цьому тижні бронювань не заплановано.</p>',
  newcount:`<p>Цього місяця <b>86 нових гостей</b>, +14% до минулого місяця.</p>`
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>AI відповідає лише на основі даних CRM.</p>'}</div>`;
}

document.addEventListener('click',e=>{
 $$('.row-menu').forEach(m=>{if(!e.target.closest('.row-actions'))m.remove()});
 if(!e.target.closest('.filters-wrap'))$('#filters-panel').hidden=true;
 const el=e.target.closest('button,a,input');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el&&el.matches('[data-close]')){closeDialog();return}
 if(el&&el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el&&el.dataset.seg){$$('#segments button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.segment=el.dataset.seg;renderList();return}
 if(el&&el.id==='filters-toggle'){$('#filters-panel').hidden=!$('#filters-panel').hidden;return}
 if(el&&el.id==='filters-clear'){$$('#filters-panel input[type=checkbox]').forEach(c=>c.checked=true);return}
 if(el&&el.id==='filters-apply'){
  state.filters.stays=new Set($$('#filters-panel section:first-of-type input:checked').map(c=>c.value));
  state.filters.tags=new Set($$('#filters-panel section:last-of-type input:checked').map(c=>c.value));
  $('#filters-panel').hidden=true;renderList();return;
 }
 if(el&&el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el&&(el.id==='btn-add-guest'||el.id==='empty-add-guest'||el.id==='empty-new-guest')){addGuestModal();return}
 if(el&&el.id==='btn-export'){toast('Експорт CRM · Демо')}
 if(el&&el.id==='bulk-tag'){show('Додати тег кільком гостям',`<p>${state.selected.size} гостей буде позначено тегом.</p><form class="demo-form" id="bulk-tag-form"><label class="full">Тег<select name="tag"><option>VIP</option><option>Постійний гість</option><option>Бізнес</option><option>Сім’я</option></select></label><button class="button primary full" type="submit">Застосувати</button></form>`);return}
 if(el&&el.id==='bulk-message'){show('Масова розсилка','<p class="form-note">Масова розсилка повідомлень буде доступна незабаром.</p>');return}
 if(el&&el.id==='bulk-export'){toast('Обраних гостей експортовано · Демо');return}
 if(el&&el.id==='select-all'){
  const list=filteredGuests();
  if(el.checked)list.forEach(g=>state.selected.add(g.id));else list.forEach(g=>state.selected.delete(g.id));
  renderList();return;
 }
 if(el&&el.dataset.check){
  const id=Number(el.dataset.check);
  if(el.checked)state.selected.add(id);else state.selected.delete(id);
  renderBulkBar();return;
 }
 if(el&&el.dataset.rowMenu){
  e.stopPropagation();
  const existing=document.getElementById('row-menu-'+el.dataset.rowMenu);
  $$('.row-menu').forEach(m=>m.remove());
  if(!existing){const g=guestsDb.find(g=>g.id===Number(el.dataset.rowMenu));el.closest('.row-actions').insertAdjacentHTML('beforeend',rowMenuFor(g));}
  return;
 }
 if(el&&el.dataset.openPreview){const g=guestsDb.find(g=>g.id===Number(el.dataset.openPreview));quickPreview(g);return}
 if(el&&el.dataset.openProfile){closeDialog();openProfile(Number(el.dataset.openProfile));return}
 if(el&&el.dataset.newBooking){window.location.href='/new-booking/';return}
 if(el&&el.dataset.message){const g=guestsDb.find(g=>g.id===Number(el.dataset.message));show('Повідомлення гостю',`<p>Отримувач: ${esc(g.name)}</p><form class="demo-form" id="msg-form"><label class="full">Текст повідомлення<textarea name="message" required maxlength="500">Добрий день, ${esc(g.name.split(' ')[0])}!</textarea></label><button class="button primary full" type="submit">Надіслати</button></form>`);return}
 if(el&&el.dataset.addNote){const g=guestsDb.find(g=>g.id===Number(el.dataset.addNote));show('Додати нотатку',`<p>${esc(g.name)}</p><form class="demo-form" id="note-form"><label class="full">Нотатка<textarea name="text" required maxlength="300"></textarea></label><button class="button primary full" type="submit">Зберегти</button></form>`);return}
 if(el&&el.dataset.edit){const g=guestsDb.find(g=>g.id===Number(el.dataset.edit));show('Редагувати гостя',`<form class="demo-form" id="edit-form"><label class="full">Ім’я<input name="name" value="${esc(g.name)}" required></label><label>Телефон<input name="phone" value="${esc(g.phone)}"></label><label>Email<input name="email" value="${esc(g.email)}"></label><input type="hidden" name="id" value="${g.id}"><button class="button primary full" type="submit">Зберегти</button></form>`);return}
 if(el&&el.dataset.merge){show('Об’єднати дублікати',`<p class="form-note">Дублікатів для цього гостя не знайдено.</p>`);return}
 if(el&&el.dataset.delete){const g=guestsDb.find(g=>g.id===Number(el.dataset.delete));show('Видалити гостя?',`${g.stays>0?`<div class="notice">Профіль має історію бронювань (${g.stays}). Рекомендуємо архівувати замість видалення.</div><div class="dialog-actions"><button class="button primary" data-archive="${g.id}">Архівувати гостя</button><button class="button secondary destructive" data-force-delete="${g.id}">Все одно видалити</button></div>`:`<div class="dialog-actions"><button class="button primary destructive" data-force-delete="${g.id}">Видалити</button><button class="button secondary" data-close>Скасувати</button></div>`}`);return}
 if(el&&el.dataset.archive){closeDialog();toast('Гостя архівовано · Демо');return}
 if(el&&el.dataset.forceDelete){const id=Number(el.dataset.forceDelete);const i=guestsDb.findIndex(g=>g.id===id);if(i>-1)guestsDb.splice(i,1);closeDialog();renderList();toast('Гостя видалено · Демо');return}
 if(el&&el.dataset.useExisting){closeDialog();openProfile(Number(el.dataset.useExisting));return}
 if(el&&el.id==='create-anyway'){$('#duplicate-warning').innerHTML='';toast('Продовжуйте заповнення форми');return}

 const row=e.target.closest('tr[data-guest]');
 if(row&&!e.target.closest('input,button')){const g=guestsDb.find(g=>g.id===Number(row.dataset.guest));quickPreview(g);return}
});

document.addEventListener('input',e=>{
 if(e.target.id==='search-input'){state.search=e.target.value;renderList()}
});
document.addEventListener('change',e=>{
 if(e.target.id==='sort-select'){state.sort=e.target.value;renderList()}
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-guest-form'){
  const name=String(data.get('first'))+' '+String(data.get('last')||'').trim();
  guestsDb.unshift({id:Math.max(...guestsDb.map(g=>g.id))+1,name:name.trim(),phone:String(data.get('phone')),email:String(data.get('email')||''),tags:[],stays:0,nights:0,spent:0,lastVisit:null,nextBooking:null,room:null,staying:false,prefs:[]});
  closeDialog();renderList();toast('Гостя додано');
 }else if(f.id==='bulk-tag-form'){
  const tag=String(data.get('tag'));
  state.selected.forEach(id=>{const g=guestsDb.find(g=>g.id===id);if(g&&!g.tags.includes(tag))g.tags.push(tag)});
  closeDialog();renderList();toast('Тег додано вибраним гостям');
 }else if(f.id==='msg-form'||f.id==='note-form'){
  closeDialog();toast(f.id==='msg-form'?'Повідомлення надіслано · Демо':'Нотатку збережено');
 }else if(f.id==='edit-form'){
  const g=guestsDb.find(g=>g.id===Number(data.get('id')));if(g){g.name=String(data.get('name'));g.phone=String(data.get('phone'));g.email=String(data.get('email'))}
  closeDialog();renderList();toast('Зміни збережено');
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');document.documentElement.classList.remove('no-scroll')}});

renderKpis();renderList();hydrate();
