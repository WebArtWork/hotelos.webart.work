'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const NOW=new Date('2026-09-17T12:00:00');
const TODAY='2026-09-17',TOMORROW='2026-09-18';
const staffList=['Марія','Олена','Ірина'];
const CHECKLIST=['Постіль замінена','Ванна прибрана','Рушники замінені','Сміття винесено','Мінібар перевірено','Поверхні прибрані','Номер перевірено'];

function mins(a,b){return Math.round((b-a)/60000)}
function timeLabel(d){return d.toTimeString().slice(0,5)}
function arrivalDate(dayLabel,time){const base=dayLabel==='today'?TODAY:TODAY===dayLabel?TODAY:dayLabel;return new Date((dayLabel==='today'?TODAY:dayLabel)+'T'+time+':00')}

function buildRooms(){
 const TYPES={'Стандарт':2,'Покращений':3,'Люкс':2,'Апартаменти':4};
 const list=[];let n=0;
 const push=(number,type)=>list.push({number,type,capacity:TYPES[type],status:'ready',assigned:null,cleanedAt:'11:10',cleanedBy:staffList[n++%staffList.length]});
 for(let i=101;i<=110;i++)push(String(i),'Стандарт');
 for(let i=111;i<=114;i++)push(String(i),'Покращений');
 for(let i=201;i<=208;i++)push(String(i),'Люкс');
 for(let i=301;i<=306;i++)push(String(i),'Апартаменти');
 const set=(num,o)=>Object.assign(list.find(r=>r.number===num),o);

 set('204',{status:'needs-cleaning',type:'Люкс',checkoutTime:'11:08',nextArrivalDate:TODAY,nextArrivalTime:'13:30',nextGuests:2,assigned:null,prep:['Дитяче ліжечко'],internalNote:'Тихий номер'});
 set('106',{status:'needs-cleaning',type:'Покращений',checkoutTime:'09:50',nextArrivalDate:TODAY,nextArrivalTime:'16:30',nextGuests:2,assigned:null,prep:[],internalNote:''});
 set('302',{status:'needs-cleaning',type:'Апартаменти',checkoutTime:'10:40',nextArrivalDate:TOMORROW,nextArrivalTime:'14:00',nextGuests:4,assigned:null,prep:['2 додаткові рушники'],internalNote:''});

 set('207',{status:'cleaning',type:'Стандарт',assigned:'Марія',startedAt:'12:20',nextArrivalDate:TODAY,nextArrivalTime:'15:00',nextGuests:2,prep:[],internalNote:''});
 set('206',{status:'cleaning',type:'Люкс',assigned:'Ірина',startedAt:'11:05',nextArrivalDate:null,nextArrivalTime:null,prep:[],internalNote:''});

 set('103',{status:'ready',type:'Стандарт',cleanedAt:'11:42',cleanedBy:'Марія',nextArrivalDate:TOMORROW,nextArrivalTime:'14:00'});
 set('205',{status:'ready',type:'Люкс',cleanedAt:'10:20',cleanedBy:'Ірина',nextArrivalDate:null,nextArrivalTime:null});

 set('301',{status:'occupied',type:'Апартаменти',guest:'Анна Коваленко',checkoutDate:'20 вересня',doNotDisturb:true});
 const occupiedExtra=['201','101','111','303'];
 occupiedExtra.forEach((num,i)=>set(num,{status:'occupied',guest:['Олег Бондар','Марія Петренко','Ірина Шевченко','Дмитро Левченко'][i],checkoutDate:['18 вересня','21 вересня','19 вересня','23 вересня'][i],doNotDisturb:i===1}));

 list.forEach(r=>{r.history=[{date:'17 вересня',by:r.cleanedBy||'Марія',range:'11:12–11:41',dur:'29 хв',status:'Completed'},{date:'15 вересня',by:'Олена',range:'10:54–11:28',dur:'34 хв',status:'Completed'}]});
 return list;
}
const rooms=buildRooms();

function priorityOf(r){
 if(r.status!=='needs-cleaning')return null;
 if(!r.nextArrivalDate)return'low';
 if(r.nextArrivalDate===TOMORROW)return'low';
 const arrival=new Date(r.nextArrivalDate+'T'+r.nextArrivalTime+':00');
 const diff=mins(NOW,arrival);
 if(diff<=60)return'critical';
 if(diff<=180)return'high';
 return'normal';
}
function priorityLabel(p){return{critical:'Критично',high:'Високий',normal:'Звичайний',low:'Низький'}[p]||''}
function countdown(r){
 if(!r.nextArrivalDate)return'';
 const arrival=new Date(r.nextArrivalDate+'T'+r.nextArrivalTime+':00');
 const diff=mins(NOW,arrival);
 if(diff<0)return'заїзд уже почався';
 const h=Math.floor(diff/60),m=diff%60;
 return(h?h+' год ':'')+m+' хв';
}
function nextArrivalLabel(r){
 if(!r.nextArrivalDate)return'—';
 if(r.nextArrivalDate===TODAY)return r.nextArrivalTime;
 if(r.nextArrivalDate===TOMORROW)return'завтра · '+r.nextArrivalTime;
 return r.nextArrivalDate+' · '+r.nextArrivalTime;
}

function counts(){
 return{
  needs:rooms.filter(r=>r.status==='needs-cleaning').length,
  cleaning:rooms.filter(r=>r.status==='cleaning').length,
  ready:rooms.filter(r=>r.status==='ready').length,
  occupied:rooms.filter(r=>r.status==='occupied').length
 };
}

const state={dayFilter:'today',viewMode:'board',mobileTab:'needs-cleaning',sort:'arrival',filters:{staff:new Set([...staffList,'Не призначено']),priority:new Set(['critical','high','normal','low'])}};

function passesFilters(r){
 const assignedLabel=r.assigned||'Не призначено';
 if(!state.filters.staff.has(assignedLabel)&&r.status!=='ready'&&r.status!=='occupied')return false;
 const p=priorityOf(r);
 if(p&&!state.filters.priority.has(p))return false;
 return true;
}
function dayPasses(r){
 if(state.dayFilter==='all')return true;
 if(r.status==='ready'||r.status==='occupied')return true;
 if(!r.nextArrivalDate)return state.dayFilter==='today';
 return r.nextArrivalDate===(state.dayFilter==='today'?TODAY:TOMORROW);
}
function sortRooms(list){
 const sorters={
  arrival:(a,b)=>{const av=a.nextArrivalDate?new Date(a.nextArrivalDate+'T'+a.nextArrivalTime+':00'):new Date('2100-01-01');const bv=b.nextArrivalDate?new Date(b.nextArrivalDate+'T'+b.nextArrivalTime+':00'):new Date('2100-01-01');return av-bv},
  room:(a,b)=>a.number.localeCompare(b.number,'uk',{numeric:true}),
  checkout:(a,b)=>(a.checkoutTime||'99:99').localeCompare(b.checkoutTime||'99:99'),
  staff:(a,b)=>(a.assigned||'zzz').localeCompare(b.assigned||'zzz','uk')
 };
 return list.slice().sort(sorters[state.sort]);
}
function filteredByStatus(status){return sortRooms(rooms.filter(r=>r.status===status&&passesFilters(r)&&dayPasses(r)))}

function renderKpis(){
 const c=counts();
 const urgent=rooms.filter(r=>r.status==='needs-cleaning'&&priorityOf(r)==='critical').length;
 $('#kpis').innerHTML=`<div class="kpi gold"><small>Потребують прибирання</small><b>${c.needs}</b><span>${urgent?urgent+' має заїзд менше ніж через 2 години':'усе під контролем'}</span></div><div class="kpi"><small>Прибираються</small><b>${c.cleaning}</b></div><div class="kpi"><small>Готові</small><b>${c.ready}</b></div><div class="kpi"><small>Зайняті</small><b>${c.occupied}</b></div>`;
}
function renderAlerts(){
 const alerts=[];
 rooms.filter(r=>r.status==='needs-cleaning').forEach(r=>{
  if(r.nextArrivalDate===TODAY){const diff=mins(NOW,new Date(r.nextArrivalDate+'T'+r.nextArrivalTime+':00'));if(diff>0&&diff<=60)alerts.push(`<div class="alert-row"><span>⚠</span><span><b>Номер ще не готовий</b> · ${r.number} · ${r.type} · Заїзд через ${countdown(r)}.</span><button class="text-action" data-open-room="${r.number}">Відкрити →</button></div>`);}
  if(!r.assigned&&(priorityOf(r)==='critical'||priorityOf(r)==='high'))alerts.push(`<div class="alert-row"><span>⚠</span><span><b>Задачу не призначено</b> · ${r.number} · Заїзд о ${r.nextArrivalTime||'—'}.</span><button class="text-action" data-assign="${r.number}">Призначити →</button></div>`);
 });
 rooms.filter(r=>r.status==='cleaning').forEach(r=>{
  const started=new Date(TODAY+'T'+r.startedAt+':00');
  if(mins(started,NOW)>45)alerts.push(`<div class="alert-row warn"><span>⏱</span><span>Прибирання триває довше звичайного · Номер ${r.number} · Розпочато ${mins(started,NOW)} хв тому.</span></div>`);
 });
 const unassignedCount=rooms.filter(r=>r.status==='needs-cleaning'&&!r.assigned).length;
 $('#alerts-strip').innerHTML=alerts.join('')+(unassignedCount?`<div class="alert-row warn"><span>⚠</span><span><b>Є непризначені задачі</b> · ${unassignedCount} номер${unassignedCount===1?'':'и'} потребують прибирання.</span><button class="text-action" id="btn-distribute">Розподілити →</button></div>`:'');
}
function taskCardHtml(r){
 const p=priorityOf(r);
 if(r.status==='needs-cleaning'){
  return `<div class="task-card priority-${p}" data-room="${r.number}">
   <div class="tc-top"><div><div class="tc-num">${r.number} · ${r.type}</div></div>${p?`<span class="priority-tag ${p}">${priorityLabel(p)}</span>`:''}</div>
   <div class="tc-facts">Гість виїхав: <b>${r.checkoutTime}</b></div>
   <div class="tc-facts">Наступний заїзд: <b>${nextArrivalLabel(r)}</b></div>
   ${r.nextArrivalDate?`<div class="tc-countdown">До заїзду: ${countdown(r)}</div>`:''}
   <div class="tc-facts">Призначено: <b>${r.assigned||'Не призначено'}</b></div>
   <div class="tc-actions"><button class="primary" data-assign="${r.number}">Призначити</button></div>
  </div>`;
 }
 if(r.status==='cleaning'){
  return `<div class="task-card" data-room="${r.number}">
   <div class="tc-top"><div class="tc-num">${r.number} · ${r.type}</div></div>
   <div class="tc-facts">Працівник: <b>${r.assigned}</b></div>
   <div class="tc-facts">Початок: ${r.startedAt} · Тривалість: ${mins(new Date(TODAY+'T'+r.startedAt+':00'),NOW)} хв</div>
   ${r.nextArrivalDate?`<div class="tc-facts">Наступний заїзд: ${nextArrivalLabel(r)}</div>`:''}
   <div class="tc-actions"><button data-open-room="${r.number}">Відкрити</button><button class="primary" data-complete="${r.number}">Позначити готовим</button></div>
  </div>`;
 }
 if(r.status==='ready'){
  return `<div class="task-card" data-room="${r.number}">
   <div class="tc-top"><div class="tc-num">${r.number} · ${r.type}</div><span class="pill ready">Готовий</span></div>
   <div class="tc-facts">Прибрано: ${r.cleanedAt} · ${r.cleanedBy}</div>
   <div class="tc-facts">Наступний заїзд: ${nextArrivalLabel(r)}</div>
  </div>`;
 }
 return `<div class="task-card" data-room="${r.number}">
  <div class="tc-top"><div class="tc-num">${r.number} · ${r.type}</div><span class="pill dark">Зайнятий</span></div>
  <div class="tc-facts">Гість: <b>${esc(r.guest)}</b></div>
  <div class="tc-facts">Виїзд: ${r.checkoutDate} · до 11:00</div>
  ${r.doNotDisturb?'<div class="tc-facts">🔕 Не турбувати</div>':''}
 </div>`;
}
function renderBoard(){
 const cols=[['needs','needs-cleaning','ПОТРЕБУЮТЬ ПРИБИРАННЯ'],['cleaning','cleaning','ПРИБИРАЮТЬСЯ'],['ready','ready','ГОТОВІ'],['occupied','occupied','ЗАЙНЯТІ']];
 $('#board').innerHTML=cols.map(([cls,status,label])=>{
  const list=filteredByStatus(status);
  return `<div class="board-col ${cls}"><h2>${label} <span class="count">${list.length}</span></h2><div class="board-col-body">${list.map(taskCardHtml).join('')||'<p class="form-note">Немає номерів у цій колонці.</p>'}</div></div>`;
 }).join('');
}
function renderList(){
 const all=sortRooms(rooms.filter(r=>passesFilters(r)&&dayPasses(r)));
 $('#list-table').innerHTML=`<table><thead><tr><th>Номер</th><th>Статус</th><th>Виїзд</th><th>Наступний заїзд</th><th>Працівник</th><th>Пріоритет</th></tr></thead><tbody>${all.map(r=>{const p=priorityOf(r);return `<tr data-room="${r.number}"><td class="num-cell">${r.number}</td><td>${{'needs-cleaning':'Потребує прибирання',cleaning:'Прибирається',ready:'Готовий',occupied:'Зайнятий'}[r.status]}</td><td>${r.checkoutTime||'—'}</td><td>${nextArrivalLabel(r)}</td><td>${r.assigned||r.cleanedBy||'—'}</td><td>${p?`<span class="priority-tag ${p}">${priorityLabel(p)}</span>`:'—'}</td></tr>`}).join('')}</tbody></table>`;
}
function renderMobile(){
 const list=filteredByStatus(state.mobileTab);
 $('#mobile-cards').innerHTML=list.map(taskCardHtml).join('')||'<p class="form-note" style="text-align:center;padding:20px 0">Немає номерів у цій категорії.</p>';
}
function renderTeam(){
 const data=[['Марія',6,1],['Олена',4,0],['Ірина',3,1]];
 $('#team-row').innerHTML=`<h2 style="grid-column:1/-1;font-size:15px;font-weight:800;width:100%">Команда сьогодні</h2>`+data.map(([name,done,inProgress])=>`<div class="team-card"><b>${name}</b><span class="tm-num">${done}</span><span>Завершено сьогодні</span><span class="tm-num" style="margin-top:6px">${inProgress}</span><span>У процесі</span></div>`).join('');
}
function renderAll(){
 renderKpis();renderAlerts();
 const total=counts();const anyActive=total.needs+total.cleaning>0;
 $('#board').hidden=state.viewMode!=='board';
 $('#list-table').hidden=state.viewMode!=='list';
 $('#empty-state').hidden=true;
 if(!anyActive&&state.dayFilter!=='all'){
  $('#board').hidden=true;$('#list-table').hidden=true;
  $('#empty-state').hidden=false;
  $('#empty-state').innerHTML=`<div class="empty-state">✓<h2>Усі номери готові</h2><p>На цей момент немає активних задач з прибирання.</p></div>`;
 }else{
  if(state.viewMode==='board')renderBoard();else renderList();
 }
 renderMobile();renderTeam();hydrate();
}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openRoomPanel(number){
 const r=rooms.find(r=>r.number===number);if(!r)return;
 const p=priorityOf(r);
 $('#side-body').innerHTML=`
 <h5>Номер ${r.number}</h5>
 <div class="info-grid"><dt>Тип</dt><dd>${r.type}</dd>${r.checkoutTime?`<dt>Виїзд</dt><dd>${r.checkoutTime}</dd>`:''}${r.nextArrivalDate?`<dt>Наступний заїзд</dt><dd>${nextArrivalLabel(r)}</dd><dt>Гостей</dt><dd>${r.nextGuests||'—'}</dd>`:''}${p?`<dt>Пріоритет</dt><dd>${priorityLabel(p)}</dd>`:''}</div>

 ${r.prep&&r.prep.length?`<div class="prep-block" style="margin-top:18px"><h5>Для наступного гостя</h5><ul>${r.prep.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
 ${r.internalNote?`<h5>Внутрішня нотатка</h5><p style="margin:0;font-size:12px">${esc(r.internalNote)}</p>`:''}

 <h5>Дії</h5>
 <div class="dialog-actions">
  ${r.status==='needs-cleaning'?`<button class="button primary" data-start="${r.number}">Почати прибирання</button><button class="button secondary" data-assign="${r.number}">Призначити</button>`:''}
  ${r.status==='cleaning'?`<button class="button primary" data-complete="${r.number}">Номер готовий</button>`:''}
  <button class="button secondary" data-issue="${r.number}">Повідомити про проблему</button>
 </div>

 ${r.status==='cleaning'?`<h5>Чек-лист</h5><div class="checklist">${CHECKLIST.map((c,i)=>`<label><input type="checkbox" data-check="${i}">${c}</label>`).join('')}</div>`:''}

 <h5>Історія прибирання</h5>
 ${r.history.map(h=>`<div class="history-item"><b>${h.date}</b><p>Прибрала: ${h.by}<br>${h.range} · ${h.dur} · ${h.status}</p></div>`).join('')}
 `;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function assignModal(number){
 const r=rooms.find(r=>r.number===number);
 show('Призначити',`<form class="demo-form" id="assign-form" data-room="${number}"><label class="full">Працівник<select name="staff"><option value="">Не призначено</option>${staffList.map(s=>`<option ${r.assigned===s?'selected':''}>${s}</option>`).join('')}</select></label><button class="button primary full" type="submit">Зберегти</button></form>`);
}
function addTaskModal(){
 show('Нова задача',`<form class="demo-form" id="add-task-form">
  <label class="full">Номер<select name="room">${rooms.map(r=>`<option value="${r.number}">${r.number} · ${r.type}</option>`).join('')}</select></label>
  <label>Тип<select name="type"><option>Прибирання після виїзду</option><option>Додаткове прибирання</option><option>Заміна білизни</option><option>Підготовка номера</option><option>Інше</option></select></label>
  <label>Призначити<select name="staff"><option value="">Не призначено</option>${staffList.map(s=>`<option>${s}</option>`).join('')}</select></label>
  <label>Дедлайн (необов’язково)<input name="deadline" type="time"></label>
  <label class="full">Нотатка (необов’язково)<textarea name="note" maxlength="200"></textarea></label>
  <button class="button primary full" type="submit">Створити задачу</button>
 </form>`);
}
function issueModal(number){
 show('Повідомити про проблему',`<form class="demo-form" id="issue-form" data-room="${number}">
  <p class="full">Номер ${number}</p>
  <label>Тип проблеми<select name="type"><option>Освітлення</option><option>Сантехніка</option><option>Кондиціонер</option><option>Меблі</option><option>Техніка</option><option>Інше</option></select></label>
  <label>Пріоритет<select name="priority"><option>Звичайна</option><option>Термінова</option></select></label>
  <label class="full">Опис<textarea name="desc" required maxlength="300"></textarea></label>
  <button type="button" class="button secondary full" id="btn-add-photo">Додати фото</button>
  <button class="button primary full" type="submit">Надіслати</button>
 </form>`);
}
function blockRoomFollowup(number){
 show('Позначити номер недоступним?',`<p>Номер ${number} буде позначений недоступним і заблокований у Календарі. Дія доступна лише Manager / Owner.</p><div class="dialog-actions"><button class="button primary destructive" id="confirm-block-${number}">Позначити недоступним</button><button class="button secondary" data-close>Не зараз</button></div>`);
}
function completeModal(number){
 show('Позначити номер готовим?',`<p>Номер ${number}</p><div class="dialog-actions"><button class="button primary" id="confirm-complete-${number}">Готово</button><button class="button secondary" data-close>Скасувати</button></div>`);
}
function distributeModal(){
 const unassigned=rooms.filter(r=>r.status==='needs-cleaning'&&!r.assigned);
 show('Розподілити задачі',`<div class="demo-form" style="grid-template-columns:1fr">${unassigned.map(r=>`<label class="full">${r.number} · ${r.type}<select data-distribute="${r.number}"><option value="">Не призначено</option>${staffList.map(s=>`<option>${s}</option>`).join('')}</select></label>`).join('')}</div><button class="button primary full" id="save-distribute" style="margin-top:14px">Зберегти призначення</button>`);
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const notReady=rooms.filter(r=>r.status==='needs-cleaning'||r.status==='cleaning');
 const first=rooms.filter(r=>r.status==='needs-cleaning').slice().sort((a,b)=>['critical','high','normal','low'].indexOf(priorityOf(a))-['critical','high','normal','low'].indexOf(priorityOf(b)))[0];
 const cleaning204=rooms.find(r=>r.number==='204');
 const soon=rooms.filter(r=>r.nextArrivalDate===TODAY&&mins(NOW,new Date(r.nextArrivalDate+'T'+r.nextArrivalTime+':00'))<=120&&mins(NOW,new Date(r.nextArrivalDate+'T'+r.nextArrivalTime+':00'))>=0);
 const unassigned=rooms.filter(r=>r.status==='needs-cleaning'&&!r.assigned);
 const map={
  notReady:notReady.length?`<p>${notReady.map(r=>`${r.number} — ${r.status==='cleaning'?'прибирається':'потребує прибирання'}`).join('<br>')}</p>`:'<p>Усі номери готові.</p>',
  firstPriority:first?`<p>В першу чергу: <b>${first.number} · ${first.type}</b> — пріоритет «${priorityLabel(priorityOf(first))}».</p>`:'<p>Немає номерів, що потребують прибирання.</p>',
  whoCleaning:cleaning204&&cleaning204.status==='cleaning'?`<p>Номер 204 прибирає <b>${cleaning204.assigned}</b>.</p>`:'<p>Номер 204 наразі не прибирається.</p>',
  soonArrivals:soon.length?`<p>${soon.map(r=>`${r.number} — заїзд о ${r.nextArrivalTime}`).join('<br>')}</p>`:'<p>Найближчими 2 годинами заїздів не заплановано.</p>',
  unassigned:unassigned.length?`<p>Так, ${unassigned.length} непризначені задачі: ${unassigned.map(r=>r.number).join(', ')}.</p>`:'<p>Непризначених задач немає.</p>'
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>AI відповідає лише на основі даних прибирання.</p>'}</div>`;
}

document.addEventListener('click',e=>{
 if(!e.target.closest('.filters-wrap'))$('#filters-panel').hidden=true;
 const el=e.target.closest('button,a,input');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el&&el.matches('[data-close]')){closeDialog();return}
 if(el&&el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el&&el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el&&el.dataset.day){$$('#day-tabs button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.dayFilter=el.dataset.day;renderAll();return}
 if(el&&el.dataset.viewMode){$$('.view-switch button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.viewMode=el.dataset.viewMode;renderAll();return}
 if(el&&el.dataset.mtab){$$('#mobile-tabs button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.mobileTab=el.dataset.mtab;renderMobile();return}
 if(el&&el.id==='filters-toggle'){$('#filters-panel').hidden=!$('#filters-panel').hidden;return}
 if(el&&el.id==='filters-clear'){$$('#filters-panel input[type=checkbox]').forEach(c=>c.checked=true);return}
 if(el&&el.id==='filters-apply'){
  const sections=$$('#filters-panel section');
  state.filters.staff=new Set([...sections[0].querySelectorAll('input:checked')].map(c=>c.value));
  state.filters.priority=new Set([...sections[1].querySelectorAll('input:checked')].map(c=>c.value));
  $('#filters-panel').hidden=true;renderAll();return;
 }
 if(el&&el.id==='btn-add-task'){addTaskModal();return}
 if(el&&el.id==='btn-distribute'){distributeModal();return}
 if(el&&el.id==='save-distribute'){
  $$('[data-distribute]').forEach(sel=>{const r=rooms.find(r=>r.number===sel.dataset.distribute);if(r)r.assigned=sel.value||null});
  closeDialog();renderAll();toast('Задачі розподілено');return;
 }
 if(el&&el.dataset.assign){assignModal(el.dataset.assign);return}
 if(el&&el.dataset.start){const r=rooms.find(r=>r.number===el.dataset.start);r.status='cleaning';r.assigned=r.assigned||'Марія';r.startedAt=timeLabel(NOW);closeDialog();renderAll();openRoomPanel(r.number);toast('Прибирання розпочато');return}
 if(el&&el.dataset.complete){completeModal(el.dataset.complete);return}
 if(el&&el.id&&el.id.startsWith('confirm-complete-')){const num=el.id.replace('confirm-complete-','');const r=rooms.find(r=>r.number===num);r.status='ready';r.cleanedAt=timeLabel(NOW);r.cleanedBy=r.assigned||'Марія';r.assigned=null;closeDialog();closeSidePanel();renderAll();toast('Номер '+num+' готовий');return}
 if(el&&el.dataset.issue){issueModal(el.dataset.issue);return}
 if(el&&el.id==='btn-add-photo'){toast('Додавання фото — демо');return}
 if(el&&el.id&&el.id.startsWith('confirm-block-')){closeDialog();toast('Номер позначено недоступним · Демо');return}
 if(el&&el.dataset.openRoom){closeDialog();openRoomPanel(el.dataset.openRoom);return}
 if(el&&el.id==='side-close'){closeSidePanel();return}
 if(el&&el.id==='side-scrim'){closeSidePanel();return}

 const card=e.target.closest('.task-card[data-room],tr[data-room]');
 if(card&&!e.target.closest('.tc-actions')){openRoomPanel(card.dataset.room);return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);
document.addEventListener('change',e=>{if(e.target.id==='sort-select'){state.sort=e.target.value;renderAll()}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='assign-form'){
  const r=rooms.find(r=>r.number===f.dataset.room);r.assigned=String(data.get('staff'))||null;
  closeDialog();renderAll();toast(r.assigned?'Призначено: '+r.assigned:'Призначення знято');
 }else if(f.id==='add-task-form'){
  closeDialog();toast('Задачу створено · Демо');
 }else if(f.id==='issue-form'){
  const num=f.dataset.room,priority=String(data.get('priority'));
  closeDialog();toast('Проблему надіслано · Демо');
  if(priority==='Термінова')setTimeout(()=>blockRoomFollowup(num),300);
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');closeSidePanel()}});

renderAll();
