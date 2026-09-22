'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=n=>n.split(' ').slice(0,2).map(p=>p[0]).join('');

const ROLES={
 owner:{label:'Власник',desc:'Повний доступ до Hotel OS та управління готелем.',access:['Dashboard','Calendar','Бронювання','Гості','Номери','Оплати','Прибирання','Повідомлення','Автоматизації','Продажі','AI','Команда','Налаштування','Дані та експорт']},
 manager:{label:'Менеджер',desc:'Керує щоденною роботою готелю та персоналом.',access:['Dashboard','Calendar','Бронювання','Гості','Номери','Оплати','Прибирання','Повідомлення','Автоматизації','Продажі','AI'],optional:['Команда','Налаштування']},
 reception:{label:'Рецепція',desc:'Працює з гостями, бронюваннями, заселенням та оплатами.',access:['Dashboard','Calendar','Бронювання','Гості','Номери','Оплати','Повідомлення','AI (операційне)']},
 housekeeping:{label:'Прибирання',desc:'Бачить лише інформацію, необхідну для підготовки номерів.',access:['Мої задачі','Прибирання','базова інформація про номери']}
};
const MATRIX=[
 ['Dashboard','owner,manager,reception'],['Calendar','owner,manager,reception'],['Бронювання','owner,manager,reception'],
 ['Гості','owner,manager,reception'],['Оплати','owner,manager,reception'],['Прибирання','owner,manager,reception,housekeeping'],
 ['Повідомлення','owner,manager,reception'],['Автоматизації','owner,manager'],['Продажі','owner,manager'],
 ['AI','owner,manager,reception,housekeeping:обмежено'],['Команда','owner,manager:optional'],['Налаштування','owner,manager:optional']
];

const employees=[
 {id:1,first:'Олександр',last:'Гончар',email:'oleksandr@example.com',phone:'+380 67 111 22 33',role:'owner',status:'active',joined:'1 січня 2026',lastActivity:'сьогодні · 15:24',online:true,
  activity:[{time:'15:24',text:'Змінив статус номера 204'},{time:'11:02',text:'Переглянув звіт продажів'}],perms:{}},
 {id:2,first:'Марія',last:'Коваль',email:'maria@example.com',phone:'+380 63 222 33 44',role:'manager',status:'active',joined:'4 серпня 2026',lastActivity:'12 хв тому',online:true,
  activity:[{time:'15:18',text:'Створила бронювання #1847'},{time:'14:42',text:'Додала оплату 1 500 ₴'},{time:'13:16',text:'Заселила Анну Коваленко'}],
  perms:{canRefund:true,canManageTeam:false,canEditSettings:false},todayStats:{bookings:4,checkins:3,payments:6}},
 {id:3,first:'Ірина',last:'Петренко',email:'iryna@example.com',phone:'+380 97 333 44 55',role:'reception',status:'active',joined:'12 серпня 2026',lastActivity:'34 хв тому',online:true,shift:'08:00–20:00',
  activity:[{time:'12:58',text:'Змінила номер у бронюванні #1841'},{time:'11:20',text:'Додала оплату 800 ₴'}],
  perms:{canSeeFinance:false,canCancelBooking:false}},
 {id:4,first:'Олена',last:'Бондар',email:'olena@example.com',phone:'+380 66 444 55 66',role:'housekeeping',status:'active',joined:'20 серпня 2026',lastActivity:'2 год тому',online:false,
  tasks:{done:5,inProgress:1,remaining:2},activity:[{time:'12:20',text:'Розпочала прибирання номера 207'},{time:'11:41',text:'Завершила прибирання номера 103'}]},
 {id:5,first:'Оксана',last:'Мельник',email:'oksana@example.com',phone:'+380 50 555 66 77',role:'housekeeping',status:'active',joined:'2 вересня 2026',lastActivity:'вчора · 18:10',online:false,
  tasks:{done:4,inProgress:0,remaining:0},activity:[{time:'17:55',text:'Завершила прибирання номера 101'}]},
 {id:6,first:'Тарас',last:'Швець',email:'taras@example.com',phone:'+380 63 666 77 88',role:'reception',status:'active',joined:'5 вересня 2026',lastActivity:'3 дні тому',online:false,shift:'20:00–08:00',
  activity:[{time:'20:40',text:'Заселив Олега Бондаря'}],perms:{canSeeFinance:false,canCancelBooking:false}},
 {id:7,first:'Юлія',last:'Савчук',email:'yulia@example.com',phone:'',role:'reception',status:'invited',invitedOn:'17 вересня · 15:20',lastActivity:'—',online:false,perms:{}}
];

const state={segment:'all',search:''};

function fullName(e){return e.first+' '+e.last}
function statusLabel(s){return{active:'Активний',invited:'Запрошено',deactivated:'Деактивований'}[s]}
function isLastOwner(e){return e.role==='owner'&&employees.filter(x=>x.role==='owner'&&x.status==='active').length<=1}

function counts(){
 return{
  total:employees.length,
  active:employees.filter(e=>e.status==='active').length,
  invited:employees.filter(e=>e.status==='invited').length,
  online:employees.filter(e=>e.online).length
 };
}
function renderKpis(){
 const c=counts();
 $('#kpis').innerHTML=`<div class="kpi"><small>Працівників</small><b>${c.total}</b></div><div class="kpi"><small>Активні</small><b>${c.active}</b></div><div class="kpi gold"><small>Запрошення</small><b>${c.invited}</b><span>${c.invited?'очікує підтвердження':'немає очікуючих'}</span></div><div class="kpi"><small>Зараз у системі</small><b>${c.online}</b></div>`;
}
function passesFilters(e){
 const q=state.search.trim().toLocaleLowerCase('uk-UA');
 if(q&&!(fullName(e)+' '+e.email+' '+e.phone+' '+ROLES[e.role].label).toLocaleLowerCase('uk-UA').includes(q))return false;
 if(state.segment==='inactive')return e.status==='deactivated';
 if(state.segment!=='all')return e.role===state.segment;
 return true;
}
function filtered(){return employees.filter(passesFilters)}

function renderList(){
 const list=filtered();
 $('#empty-state').hidden=true;
 if(!list.length){
  $('.table-card').hidden=true;$('#emp-cards').hidden=true;
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state"><h2>Нікого не знайдено</h2><p>Спробуйте змінити пошук або фільтр.</p></div>`;
  return;
 }
 $('.table-card').hidden=false;$('#emp-cards').hidden=false;
 $('#team-tbody').innerHTML=list.map(e=>`<tr data-open="${e.id}">
  <td class="name-cell"><span class="avatar">${initials(fullName(e))}${e.online?'<span class="online-dot"></span>':''}</span><span><b>${esc(fullName(e))}</b><small>${e.status==='invited'?'Запрошення надіслано '+e.invitedOn:e.email}</small></span></td>
  <td><span class="role-chip ${e.role}">${ROLES[e.role].label}</span></td>
  <td>${e.email||'—'}${e.phone?'<br>'+e.phone:''}</td>
  <td><span class="status-tag ${e.status}">${statusLabel(e.status)}</span></td>
  <td>${e.lastActivity}</td>
  <td><button class="text-action" data-open="${e.id}">Відкрити →</button></td>
 </tr>`).join('');
 $('#emp-cards').innerHTML=list.map(e=>`<div class="emp-card" data-open="${e.id}"><span class="avatar">${initials(fullName(e))}${e.online?'<span class="online-dot"></span>':''}</span><div class="ec-body"><b>${esc(fullName(e))}</b><span class="ec-role">${ROLES[e.role].label}</span><div class="ec-activity">${statusLabel(e.status)} · ${e.lastActivity}</div></div></div>`).join('');
 hydrate();
}
function renderAll(){renderKpis();renderList()}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openProfile(id){
 const e=employees.find(e=>e.id===Number(id));if(!e)return;
 const roleInfo=ROLES[e.role];
 let extraStats='';
 if(e.role==='housekeeping'&&e.tasks)extraStats=`<h5>Задачі сьогодні</h5><div class="stat-trio"><div><b>${e.tasks.done}</b><span>Завершено</span></div><div><b>${e.tasks.inProgress}</b><span>У процесі</span></div><div><b>${e.tasks.remaining}</b><span>Залишилось</span></div></div><button class="button secondary" style="width:100%;margin-top:10px" data-goto="/housekeeping/">Відкрити задачі</button>`;
 if(e.role==='manager'&&e.todayStats)extraStats=`<h5>Сьогодні</h5><div class="stat-trio"><div><b>${e.todayStats.bookings}</b><span>Бронювань</span></div><div><b>${e.todayStats.checkins}</b><span>Заїздів</span></div><div><b>${e.todayStats.payments}</b><span>Оплат</span></div></div>`;

 $('#side-body').innerHTML=`
 <div class="profile-top"><span class="avatar-lg">${initials(fullName(e))}</span><div><h2 style="font-size:19px;margin:0 0 4px">${esc(fullName(e))}</h2><span class="role-chip ${e.role}">${roleInfo.label}</span> <span class="status-tag ${e.status}">${statusLabel(e.status)}</span></div></div>
 ${e.status==='invited'?`<div class="notice">Запрошення надіслано ${e.invitedOn}. Обліковий запис ще не активовано.</div><div class="dialog-actions"><button class="button secondary" data-resend="${e.id}">Надіслати повторно</button><button class="button secondary destructive" data-cancel-invite="${e.id}">Скасувати запрошення</button></div>`:''}
 ${e.status!=='invited'?`
 <h5>Контакти</h5>
 <p style="margin:0;font-size:12px">${e.email||'—'}${e.phone?'<br>'+e.phone:''}</p>
 <h5>Профіль</h5>
 <div class="info-grid"><dt>Роль</dt><dd>${roleInfo.label}</dd><dt>Приєднався(лась)</dt><dd>${e.joined}</dd><dt>Остання активність</dt><dd>${e.lastActivity}</dd>${e.shift?`<dt>Зміна</dt><dd>${e.shift}</dd>`:''}</div>
 ${extraStats}
 <h5>Дії</h5>
 <div class="dialog-actions">
  <button class="button secondary" data-edit="${e.id}">Редагувати</button>
  <button class="button secondary" data-change-role="${e.id}">Змінити роль</button>
  ${e.status==='active'?`<button class="button secondary destructive" data-deactivate="${e.id}" ${isLastOwner(e)?'disabled title="Готель повинен мати щонайменше одного власника"':''}>Деактивувати доступ</button>`:`<button class="button primary" data-reactivate="${e.id}">Відновити доступ</button>`}
 </div>
 ${e.role!=='owner'?`<h5>Дозволи</h5>${permissionToggles(e)}`:''}
 ${e.role!=='housekeeping'||true?`<h5>Сповіщення</h5>${notificationToggles(e)}`:''}
 <h5>Остання активність</h5>
 ${(e.activity||[]).map(a=>`<div class="activity-item"><b>${a.time}</b><p>${esc(a.text)}</p></div>`).join('')||'<p class="form-note">Активності ще немає.</p>'}
 <h5>Безпека</h5>
 <p style="margin:0;font-size:12px">Останній вхід: ${e.lastActivity}</p>
 <button class="button secondary" style="margin-top:10px" data-end-sessions="${e.id}">Завершити всі сесії</button>
 `:''}
 `;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function permissionToggles(e){
 const map=e.role==='manager'?[['canRefund','Може здійснювати повернення'],['canManageTeam','Може керувати командою'],['canEditSettings','Може змінювати налаштування']]
  :e.role==='reception'?[['canSeeFinance','Може бачити фінансові показники'],['canCancelBooking','Може скасовувати бронювання']]:[];
 if(!map.length)return'';
 return map.map(([key,label])=>`<div class="toggle-row"><b>${label}</b><span class="switch ${e.perms[key]?'on':''}" data-perm="${e.id}:${key}"></span></div>`).join('');
}
function notificationToggles(e){
 const opts=[['notifyBooking','Нове бронювання'],['notifyMessage','Нове повідомлення'],['notifyPayment','Оплата'],['notifyHousekeeping','Housekeeping alerts'],['notifyAutomation','Automation errors']];
 e.notif=e.notif||{notifyBooking:true,notifyMessage:true,notifyPayment:e.role!=='housekeeping',notifyHousekeeping:e.role==='housekeeping'||e.role==='owner'||e.role==='manager',notifyAutomation:e.role==='owner'||e.role==='manager'};
 return opts.map(([key,label])=>`<div class="toggle-row"><b>${label}</b><span class="switch ${e.notif[key]?'on':''}" data-notif="${e.id}:${key}"></span></div>`).join('');
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function addEmployeeModal(){
 show('Додати працівника',`<form class="demo-form" id="add-form">
  <label>Ім’я *<input name="first" required></label>
  <label>Прізвище<input name="last"></label>
  <label>Email *<input name="email" type="email" required></label>
  <label>Телефон<input name="phone"></label>
  <label class="full">Роль<select name="role"><option value="manager">Менеджер</option><option value="reception">Рецепція</option><option value="housekeeping">Прибирання</option></select></label>
  <p class="full form-note">Роль «Власник» не призначається через цю форму.</p>
  <button class="button primary full" type="submit">Далі</button>
 </form>`);
}
function invitePreviewModal(data){
 const roleLabel=ROLES[data.role].label;
 show('Запросити працівника',`<p>${esc(data.first+' '+(data.last||''))}<br>${esc(data.email)}</p><p>Роль: <b>${roleLabel}</b></p>
 <div class="role-access-list">${ROLES[data.role].access.map(a=>`<span>${a}</span>`).join('')}</div>
 <p class="form-note">Працівник отримає посилання для створення доступу до Hotel OS.</p>
 <div class="dialog-actions"><button class="button primary" id="send-invite">Надіслати запрошення</button><button class="button secondary" data-close>Скасувати</button></div>`);
 $('#send-invite').dataset._pending=JSON.stringify(data);
}
function inviteSentModal(data){
 show('Запрошення надіслано',`<p>${esc(data.first+' '+(data.last||''))}<br>${esc(data.email)}</p><span class="status-tag invited">Очікує активації</span>
 <div class="dialog-actions"><button class="button secondary" id="copy-invite-link">Скопіювати посилання</button><button class="button primary" data-close>Закрити</button></div>`);
}
function roleMatrixModal(){
 show('Ролі та доступ',`<table class="matrix-table"><thead><tr><th>Функція</th><th>Власник</th><th>Менеджер</th><th>Рецепція</th><th>Прибирання</th></tr></thead><tbody>
 ${MATRIX.map(([label,val])=>{
  const cells=['owner','manager','reception','housekeeping'].map(r=>{
   if(val.includes(r+':optional'))return'<td>optional</td>';
   if(val.includes(r+':обмежено'))return'<td>обмежено</td>';
   return `<td>${val.split(',').some(v=>v.split(':')[0]===r)?'✓':'—'}</td>`;
  }).join('');
  return `<tr><td>${label}</td>${cells}</tr>`;
 }).join('')}
 </tbody></table><p class="form-note" style="margin-top:14px">Release A використовує заздалегідь визначені ролі з кількома опціональними дозволами — без складного редактора політик.</p>`);
}
function changeRoleModal(id){
 const e=employees.find(e=>e.id===Number(id));
 show('Змінити роль',`<form class="demo-form" id="change-role-form" data-id="${id}"><label class="full">Поточна роль<input value="${ROLES[e.role].label}" disabled></label><label class="full">Нова роль<select name="role">${Object.keys(ROLES).filter(r=>r!=='owner').map(r=>`<option value="${r}" ${e.role===r?'selected':''}>${ROLES[r].label}</option>`).join('')}</select></label><p class="full form-note" id="role-warning"></p><button class="button primary full" type="submit">Змінити роль</button></form>`);
}
function editModal(id){
 const e=employees.find(e=>e.id===Number(id));
 show('Редагувати працівника',`<form class="demo-form" id="edit-form" data-id="${id}"><label>Ім’я<input name="first" value="${esc(e.first)}" required></label><label>Прізвище<input name="last" value="${esc(e.last)}"></label><label>Email<input name="email" type="email" value="${esc(e.email)}"></label><label>Телефон<input name="phone" value="${esc(e.phone||'')}"></label><button class="button primary full" type="submit">Зберегти</button></form>`);
}
function deactivateModal(id){
 const e=employees.find(e=>e.id===Number(id));
 const taskNote=e.role==='housekeeping'
  ?'<p class="form-note"><b>Задачі прибирання, призначені на неї/нього, лишаться призначеними.</b> Перепризначте їх вручну на сторінці Прибирання або переведіть у чергу непризначених задач — деактивація доступу сама по собі цього не робить.</p>'
  :e.role==='reception'
  ?'<p class="form-note"><b>Бронювання та діалоги, які вона/він вів(ла), не переприв’язуються автоматично.</b> Перевірте незавершені діалоги в Повідомленнях і передайте їх колегам.</p>'
  :'';
 show('Деактивувати працівника?',`<p>${esc(fullName(e))} більше не зможе входити в Hotel OS.</p><p>Її/його попередні дії та історія залишаться в системі під її/його іменем — деактивація не переписує авторство минулих дій.</p>${taskNote}<div class="dialog-actions"><button class="button primary destructive" id="confirm-deactivate" data-id="${e.id}">Деактивувати</button><button class="button secondary" data-close>Скасувати</button></div>`);
}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a,tr');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.matches('[data-close]')){closeDialog();return}

 if(el.dataset.seg){$$('#segments button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.segment=el.dataset.seg;renderList();return}
 if(el.id==='btn-add-employee'){addEmployeeModal();return}
 if(el.id==='btn-role-matrix'){roleMatrixModal();return}
 if(el.id==='send-invite'){
  const data=JSON.parse(el.dataset._pending);
  employees.push({id:Math.max(...employees.map(e=>e.id))+1,first:data.first,last:data.last||'',email:data.email,phone:data.phone||'',role:data.role,status:'invited',invitedOn:'17 вересня · зараз',lastActivity:'—',online:false,perms:{}});
  closeDialog();renderAll();setTimeout(()=>inviteSentModal(data),150);
  return;
 }
 if(el.id==='copy-invite-link'){navigator.clipboard?.writeText('https://hotelos.app/invite/DEMO-TOKEN').catch(()=>{});toast('Посилання скопійовано');return}
 if(el.dataset.open){openProfile(el.dataset.open);return}
 if(el.dataset.resend){toast('Запрошення надіслано повторно');return}
 if(el.dataset.cancelInvite){const id=Number(el.dataset.cancelInvite);const i=employees.findIndex(e=>e.id===id);if(i>-1)employees.splice(i,1);closeSidePanel();closeDialog();renderAll();toast('Запрошення скасовано');return}
 if(el.dataset.edit){editModal(el.dataset.edit);return}
 if(el.dataset.changeRole){changeRoleModal(el.dataset.changeRole);return}
 if(el.dataset.deactivate){deactivateModal(el.dataset.deactivate);return}
 if(el.id==='confirm-deactivate'){
  const target=employees.find(e=>e.id===Number(el.dataset.id));
  if(target){target.status='deactivated';target.online=false}
  closeDialog();closeSidePanel();renderAll();toast('Доступ деактивовано');
  return;
 }
 if(el.dataset.reactivate){const emp=employees.find(e=>e.id===Number(el.dataset.reactivate));emp.status='active';closeSidePanel();renderAll();toast('Доступ відновлено');return}
 if(el.dataset.perm){const[id,key]=el.dataset.perm.split(':');const emp=employees.find(e=>e.id===Number(id));emp.perms[key]=!emp.perms[key];el.classList.toggle('on',emp.perms[key]);toast('Дозвіл оновлено');return}
 if(el.dataset.notif){const[id,key]=el.dataset.notif.split(':');const emp=employees.find(e=>e.id===Number(id));emp.notif[key]=!emp.notif[key];el.classList.toggle('on',emp.notif[key]);return}
 if(el.dataset.endSessions){toast('Усі сесії завершено');return}
 if(el.dataset.goto){window.location.href=el.dataset.goto;return}
 if(el.id==='side-close'){closeSidePanel();return}
 if(el.id==='side-scrim'){closeSidePanel();return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);
document.addEventListener('input',e=>{if(e.target.id==='search-input'){state.search=e.target.value;renderList()}});
document.addEventListener('change',e=>{
 if(e.target.name==='role'&&e.target.closest('#change-role-form')){
  const newRole=e.target.value;
  $('#role-warning').textContent=(newRole==='manager')?'Працівник отримає доступ до фінансової та операційної інформації.':'';
 }
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-form'){
  const payload={first:String(data.get('first')).trim(),last:String(data.get('last')||'').trim(),email:String(data.get('email')).trim(),phone:String(data.get('phone')||'').trim(),role:String(data.get('role'))};
  if(!payload.first||!payload.email){toast('Вкажіть ім’я та email');return}
  closeDialog();setTimeout(()=>invitePreviewModal(payload),100);
 }else if(f.id==='change-role-form'){
  const id=Number(f.dataset.id),emp=employees.find(e=>e.id===id);emp.role=String(data.get('role'));
  closeDialog();renderAll();openProfile(id);toast('Роль змінено');
 }else if(f.id==='edit-form'){
  const id=Number(f.dataset.id),emp=employees.find(e=>e.id===id);
  emp.first=String(data.get('first'));emp.last=String(data.get('last'));emp.email=String(data.get('email'));emp.phone=String(data.get('phone'));
  closeDialog();renderAll();openProfile(id);toast('Зміни збережено');
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');closeSidePanel()}});

renderAll();
