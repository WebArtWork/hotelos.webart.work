'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';
const initials=n=>n.split(' ').slice(0,2).map(p=>p[0]).join('');

const guest={
 name:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',
 tags:['Постійний гість','Сім’я','VIP'],
 firstVisit:'12 березня 2025',lastVisit:'20 серпня 2026',
 nextStay:{start:'17 вересня',end:'20 вересня',room:'204',type:'Люкс',guests:2,total:4800,status:'Підтверджено',bookingId:1842},
 history:[
  {dates:'17–20 серпня 2026',room:'204',type:'Люкс',nights:3,guests:2,total:4800,status:'Завершено',source:'Instagram',payment:'Оплачено',bookingId:1764},
  {dates:'5–8 травня 2026',room:'202',type:'Люкс',nights:3,guests:2,total:6200,status:'Завершено',source:'Пряме бронювання',payment:'Оплачено',bookingId:1694},
  {dates:'14–18 грудня 2025',room:'301',type:'Апартаменти',nights:4,guests:3,total:10400,status:'Завершено',source:'Google',payment:'Оплачено',bookingId:1502}
 ],
 preferences:['Тихий номер','Високий поверх','Пізній заїзд','Сніданок'],
 notes:[{date:'20 серпня 2026',text:'Просила тихий номер подалі від ліфта.',by:'Олександр',important:false},{date:'8 травня 2026',text:'Може приїхати пізніше 22:00.',by:'Марія',important:true}],
 messages:[{date:'16 вересня · 14:00',text:'Інструкція перед заїздом'},{date:'14 вересня · 12:14',text:'Підтвердження бронювання'},{date:'22 серпня · 10:00',text:'Подяка після проживання'}],
 payments:[{date:'17 серпня 2026',amount:4800,bookingId:1842,method:'Карта'},{date:'5 травня 2026',amount:6200,bookingId:1694,method:'Банківський переказ'}],
 sources:[{name:'Instagram',count:2},{name:'Пряме бронювання',count:1},{name:'Google',count:1}],
 activity:[{date:'14 вересня 2026',text:'Створено нове бронювання #1842'},{date:'22 серпня 2026',text:'Надіслано повідомлення після проживання'},{date:'20 серпня 2026',text:'Завершено бронювання #1764'},{date:'17 серпня 2026',text:'Отримано оплату 4 800 ₴'},{date:'17 серпня 2026',text:'Гість заселився в номер 204'}]
};
const templates={confirm:'Вітаємо! Ваше бронювання підтверджено.',before:'Чекаємо на вас незабаром у Grand Hotel.',returning:'Будемо раді бачити вас знову у Grand Hotel!',custom:''};

function stays(){return guest.history.length}
function totalNights(){return guest.history.reduce((s,h)=>s+h.nights,0)}
function totalSpent(){return guest.history.reduce((s,h)=>s+h.total,0)}
function avgNights(){return Math.round(totalNights()/stays())}
function avgCheck(){return Math.round(totalSpent()/stays())}
function favoriteType(){const c={};guest.history.forEach(h=>c[h.type]=(c[h.type]||0)+1);return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]}
function upcomingCount(){return guest.nextStay?1:0}

function render(){
 $('#guest-name-h1').textContent=guest.name;
 $('#guest-tag-chips').innerHTML=guest.tags.map(t=>`<span class="tag-chip ${t==='VIP'||t==='Постійний гість'?'gold':''}" style="margin-left:8px">${esc(t)}</span>`).join('');
 $('#heading-sub').innerHTML=`<span>${esc(guest.phone)}</span><a href="mailto:${esc(guest.email)}">${esc(guest.email)}</a>`;
 $('#guest-avatar').textContent=initials(guest.name);
 $('#guest-name').textContent=guest.name;
 $('#guest-phone').textContent=guest.phone;
 $('#guest-email').textContent=guest.email;$('#guest-email').href='mailto:'+guest.email;
 $('#first-visit').textContent=guest.firstVisit;$('#last-visit').textContent=guest.lastVisit;
 $('#metrics-row').innerHTML=`<div><b>${stays()}</b><span>Проживання</span></div><div><b>${totalNights()}</b><span>Ночей</span></div><div><b>${money(totalSpent())}</b><span>Витрачено</span></div><div><b>${upcomingCount()}</b><span>Майбутнє бронювання</span></div>`;

 const ns=guest.nextStay;
 $('#status-card').innerHTML=ns?`<h2>Наступний заїзд</h2><div class="stay-facts">${ns.start}–${ns.end} · ${ns.room} · ${ns.type}<br>${ns.guests} гості · ${money(ns.total)}<br>Статус: <b>${ns.status}</b></div><button class="button primary" style="margin-top:12px" id="btn-open-next">Відкрити бронювання</button>`:`<div class="status-empty">Немає активних бронювань<br><button class="button primary" style="margin-top:12px" id="btn-create-from-empty">+ Створити бронювання</button></div>`;

 $('#stay-summary-row').innerHTML=`<div><b>${stays()}</b><span>Проживань</span></div><div><b>${totalNights()}</b><span>Всього ночей</span></div><div><b>${avgNights()} ночі</b><span>Сер. тривалість</span></div><div><b>${money(avgCheck())}</b><span>Сер. чек</span></div><div><b>${favoriteType()}</b><span>Улюблений тип</span></div>`;
 $('#history-list').innerHTML=guest.history.length?guest.history.map(h=>`<div class="history-card"><div><h3>${h.dates}</h3><div class="h-facts">${h.room} · ${h.type} · ${h.nights} ночі · ${h.guests} гості</div><div class="h-facts">Джерело: ${esc(h.source)} · <span class="pill ready">${h.payment}</span></div></div><div class="h-right"><b>${money(h.total)}</b><span class="pill">${h.status}</span><br><button class="text-action" data-open-booking="${h.bookingId}">Відкрити →</button></div></div>`).join('') : '<p class="empty-note">Гість ще не завершував проживання у вашому готелі.</p>';

 $('#pref-tags').innerHTML=guest.preferences.length?guest.preferences.map(p=>`<span>${esc(p)}</span>`).join(''):'<p class="empty-note">Побажання можна додати вручну або вони з’являться після бронювань.</p>';
 $('#pref-cards').innerHTML=`<div><small>Тип номера</small><b>${favoriteType()}</b></div><div><small>Час заїзду</small><b>${guest.history.length?'після 18:00':'—'}</b></div><div><small>Додаткові послуги</small><b>Сніданок</b></div>`;

 $('#notes-list').innerHTML=guest.notes.length?guest.notes.map(n=>`<div class="note-card ${n.important?'important':''}"><b>${n.date}</b><p>${esc(n.text)}</p><small>Додав(ла): ${esc(n.by)}</small></div>`).join(''):'<p class="empty-note">Важлива інформація про гостя з’являтиметься тут.</p>';

 $('#messages-timeline').innerHTML=guest.messages.map(m=>`<div class="timeline-item"><span class="t-date">${m.date}</span><b style="flex:1">${esc(m.text)}</b><span class="t-state">Надіслано</span></div>`).join('');

 $('#payment-summary-row').innerHTML=`<div><b>${money(totalSpent())}</b><span>Фактично отримано</span></div><div><b>0 ₴</b><span>Refunds</span></div><div><b>0 ₴</b><span>Outstanding</span></div>`;
 $('#payments-list').innerHTML=guest.payments.map(p=>`<div class="timeline-item"><span class="t-date">${p.date}</span><div><b>${money(p.amount)}</b><small>Бронювання #${p.bookingId} · ${esc(p.method)}</small></div></div>`).join('');

 $('#sources-list').innerHTML=guest.sources.map(s=>`<div class="source-row"><span>${esc(s.name)}</span><b>${s.count} бронюванн${s.count===1?'я':'я'}</b></div>`).join('');
 $('#sources-note').innerHTML=`Перше джерело: <b>${esc(guest.sources[guest.sources.length-1].name)}</b> · Останнє: <b>${esc(guest.sources[0].name)}</b>`;

 $('#tags-list').innerHTML=guest.tags.map(t=>`<span>${esc(t)}</span>`).join('')+`<span class="tag-add" id="tags-add-inline" role="button" tabindex="0">+ Додати тег</span>`;

 $('#activity-timeline').innerHTML=guest.activity.map(a=>`<div class="timeline-item"><span class="t-date">${a.date}</span><div>${esc(a.text)}</div></div>`).join('');

 hydrate();
}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function addNoteModal(){
 show('Додати нотатку',`<form class="demo-form" id="note-form"><label class="full">Напишіть важливу інформацію про гостя<textarea name="text" required maxlength="400"></textarea></label><label class="checkbox full"><input type="checkbox" name="important">Позначити як важливе</label><button class="button primary full" type="submit">Зберегти</button></form>`);
}
function addTagModal(){
 show('Додати тег',`<form class="demo-form" id="tag-form"><label class="full">Тег<select name="tag"><option>VIP</option><option>Бізнес</option><option>Сім’я</option><option>Інше</option></select></label><button class="button primary full" type="submit">Додати тег</button></form>`);
}
function addPrefModal(){
 show('Додати побажання',`<form class="demo-form" id="pref-form"><label class="full">Побажання<input name="pref" required maxlength="40"></label><button class="button primary full" type="submit">Додати</button></form>`);
}
function mergeModal(){
 show('Об’єднати профілі?',`<p>Знайдено схожий профіль:</p><div class="detail-grid"><div><small>Профіль 1</small><b>Анна Коваленко</b><br><small>${esc(guest.phone)}</small></div><div><small>Профіль 2</small><b>Anna Kovalenko</b><br><small>anna.k@example.com</small></div></div><p class="form-note">Після об’єднання: бронювання, оплати, нотатки, комунікація та теги буде об’єднано. Дію дозволено лише Owner / Manager.</p><div class="dialog-actions"><button class="button primary" id="confirm-merge">Об’єднати</button><button class="button secondary" data-close>Скасувати</button></div>`);
}
function deleteModal(){
 show('Видалити гостя?',`<div class="notice danger">Профіль має історію бронювань (${stays()}). Booking history повинна залишитися для фінансових записів.</div><p class="form-note">Рекомендуємо архівувати гостя замість повного видалення.</p><div class="dialog-actions"><button class="button primary" id="confirm-archive">Архівувати гостя</button><button class="button secondary destructive" id="confirm-delete-anyway">Все одно видалити</button></div>`);
}
function editModal(){
 const[first,...rest]=guest.name.split(' ');
 show('Редагувати профіль',`<form class="demo-form" id="edit-form">
  <label>Ім’я<input name="first" value="${esc(first)}" required></label>
  <label>Прізвище<input name="last" value="${esc(rest.join(' '))}"></label>
  <label>Телефон<input name="phone" value="${esc(guest.phone)}" required></label>
  <label>Email<input name="email" type="email" value="${esc(guest.email)}"></label>
  <label class="full">Теги (через кому)<input name="tags" value="${esc(guest.tags.join(', '))}"></label>
  <button class="button primary full" type="submit">Зберегти зміни</button>
 </form>`);
}
function messageModal(){
 show('Повідомлення гостю',`<p>Отримувач: ${esc(guest.name)}</p>
 <div class="template-row" id="channel-row"><button data-ch="email" class="active">Email</button><button data-ch="sms">SMS</button></div>
 <div class="template-row" id="template-row"><button data-t="confirm">Підтвердження</button><button data-t="before">Перед заїздом</button><button data-t="returning">Повернення</button><button data-t="custom" class="active">Власне повідомлення</button></div>
 <form class="demo-form" id="message-form"><label class="full">Текст повідомлення<textarea name="message" required maxlength="600" id="message-text"></textarea></label><button type="button" class="button secondary full" id="ai-generate">✦ Створити текст через AI</button><button class="button primary full" type="submit">Надіслати</button></form>`);
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const map={
  summary:`<p>Анна проживала у вас <b>${stays()}</b> рази.</p><p>Найчастіше обирає номери категорії «${favoriteType()}».</p><p>Зазвичай проживає <b>${avgNights()} ночі</b>.</p><p>У попередніх бронюваннях просила тихий номер.</p><p>Останній візит — <b>${guest.lastVisit}</b>.</p>`,
  prefs:`<p>${guest.preferences.map(esc).join(', ')}.</p>`,
  last:`<p>Востаннє гість проживав у вас <b>${guest.lastVisit}</b>.</p>`,
  spent:`<p>Загалом гість витратив <b>${money(totalSpent())}</b> за ${stays()} проживання.</p>`,
  offer:`<p>Вітаємо, Анно!</p><p>Будемо раді бачити вас знову. Маємо доступні номери категорії «${favoriteType()}», яку ви обирали раніше.</p><p>Якщо плануєте поїздку — із задоволенням підберемо зручні дати.</p><button id="use-ai-message">Використати повідомлення</button>`
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>Відповідь доступна лише в межах цього профілю.</p>'}</div>`;
 hydrate(box);
}

document.addEventListener('click',e=>{
 const moreWrap=e.target.closest('.more-wrap');
 if(!moreWrap)$('#more-menu').hidden=true;
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.dataset.view){show('Гості','<p>Повний список гостей ще у розробці в демонстраційній версії.</p>');return}
 if(el.dataset.openBooking||el.id==='btn-open-next'){window.location.href='/booking/';return}
 if(el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 switch(el.id){
  case 'more-toggle':$('#more-menu').hidden=!$('#more-menu').hidden;return;
  case 'btn-new-booking':case 'q-new-booking':case 'btn-create-from-empty':window.location.href='/new-booking/';return;
  case 'btn-message':case 'q-message':case 'btn-send-message':messageModal();return;
  case 'q-call':toast('Дзвінок демо: '+guest.phone);return;
  case 'q-note':case 'btn-add-note':case 'btn-add-note-menu':addNoteModal();return;
  case 'btn-add-tag':case 'btn-add-tag-menu':case 'tags-add-inline':addTagModal();return;
  case 'btn-add-pref':addPrefModal();return;
  case 'btn-merge':mergeModal();return;
  case 'btn-delete':deleteModal();return;
  case 'confirm-archive':closeDialog();toast('Гостя архівовано · Демо');return;
  case 'confirm-delete-anyway':closeDialog();toast('Гостя видалено · Демо');return;
  case 'confirm-merge':closeDialog();toast('Профілі об’єднано · Демо');return;
  case 'btn-edit':editModal();return;
  case 'btn-all-messages':show('Історія повідомлень',$('#messages-timeline').outerHTML);return;
  case 'btn-all-payments':show('Усі оплати',$('#payments-list').outerHTML);return;
  case 'ai-generate':{const ta=$('#message-text');if(ta)ta.value=`Добрий день, ${guest.name.split(' ')[0]}! Дякуємо, що обираєте Grand Hotel.`;return}
  case 'use-ai-message':messageModal();setTimeout(()=>{const ta=$('#message-text');if(ta)ta.value=templates.returning+' У нас доступні номери категорії «'+favoriteType()+'».';},0);return;
 }
 if(el.dataset.t){$$('#template-row button').forEach(b=>b.classList.remove('active'));el.classList.add('active');const ta=$('#message-text');if(ta)ta.value=templates[el.dataset.t]||'';return}
 if(el.dataset.ch){$$('#channel-row button').forEach(b=>b.classList.remove('active'));el.classList.add('active');return}
});

document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='note-form'){guest.notes.unshift({date:'17 вересня 2026',text:String(data.get('text')),by:'Олександр',important:!!data.get('important')});closeDialog();render();toast('Нотатку додано')}
 else if(f.id==='tag-form'){const t=String(data.get('tag'));if(!guest.tags.includes(t))guest.tags.push(t);closeDialog();render();toast('Тег додано')}
 else if(f.id==='pref-form'){guest.preferences.push(String(data.get('pref')).trim());closeDialog();render();toast('Побажання додано')}
 else if(f.id==='edit-form'){guest.name=String(data.get('first'))+' '+String(data.get('last'));guest.phone=String(data.get('phone'));guest.email=String(data.get('email'));guest.tags=String(data.get('tags')).split(',').map(s=>s.trim()).filter(Boolean);closeDialog();render();toast('Профіль оновлено')}
 else if(f.id==='message-form'){guest.messages.unshift({date:'17 вересня · зараз',text:String(data.get('message')).slice(0,60)});closeDialog();render();toast('Повідомлення надіслано · Демо')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');document.documentElement.classList.remove('no-scroll')}});

render();
