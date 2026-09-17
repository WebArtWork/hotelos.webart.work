'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',plus:'M12 5v14M5 12h14',phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const statusMeta={new:{label:'Нове',step:0},confirmed:{label:'Підтверджено',step:1},checkedin:{label:'Заїхав',step:2},checkedout:{label:'Виїхав',step:3},cancelled:{label:'Скасовано',step:-1}};
const steps=['Нове','Підтверджено','Заїхав','Виїхав'];
const templates={confirm:'Добрий день, Анно! Підтверджуємо ваше бронювання номера 204 з 17 по 20 вересня.',arrival:'Добрий день! Чекаємо на вас 17 вересня після 14:00. Якщо приїдете раніше — дайте знати.',checkin:'Доброго ранку! Ваш номер 204 готовий. Чекаємо на заїзд.',payment:'Нагадуємо, що по бронюванню #1842 залишок до оплати 1 800 ₴.',custom:''};

const state={
 id:1842,
 name:'Анна Коваленко',phone:'+380 67 123 45 67',email:'anna@example.com',
 room:'204',roomType:'Люкс',
 checkin:'17 вересня',checkinTime:'після 14:00',checkout:'20 вересня',checkoutTime:'до 11:00',nights:3,adults:2,
 expectedArrival:'13:30',
 total:4800,paid:3000,
 status:'confirmed',
 createdDate:'14 вересня 2026',source:'Instagram',campaign:'Summer stories',referrer:'instagram.com',
 additionalGuests:['Олексій Коваленко'],previousStays:2,
 roomReady:true,roomStaff:'Марія',roomReadyTime:'13:10',
 notes:'Потрібен тихий номер.\nГість приїде раніше стандартного часу.\nПросив дитяче ліжечко.',
 preferences:['Тихий номер','Високий поверх','Дитяче ліжечко'],
 extras:[{name:'Сніданок × 2',price:600},{name:'Паркінг × 3 дні',price:450},{name:'Late checkout',price:500}],
 payments:[{date:'14 вересня',amount:2000,method:'Онлайн',note:'Успішно'},{date:'16 вересня',amount:1000,method:'Банківський переказ',note:'Додано вручну'}],
 messages:[{date:'14 вересня · 12:14',text:'Підтвердження бронювання',state:'sent'},{date:'16 вересня · 14:00',text:'Інструкція перед заїздом',state:'sent'},{date:'17 вересня · 10:00',text:'Повідомлення про check-in',state:'scheduled'}],
 timeline:[{date:'14 вересня · 12:11',text:'Бронювання створено',meta:'Instagram'},{date:'14 вересня · 12:14',text:'Підтвердження надіслано'},{date:'14 вересня · 12:20',text:'Отримано оплату 2 000 ₴'},{date:'16 вересня · 17:42',text:'Додано оплату 1 000 ₴'},{date:'17 вересня · 09:05',text:'Час прибуття змінено на 13:30'}]
};

function balance(){return state.total-state.paid}
function extrasTotal(){return state.extras.reduce((s,e)=>s+e.price,0)}
function pushHistory(text,meta){state.timeline.push({date:'17 вересня · '+new Date().toTimeString().slice(0,5),text,meta})}

function render(){
 const meta=statusMeta[state.status];
 $('#status-chip').className='status-chip '+state.status;$('#status-chip').textContent=meta.label;
 $('#heading-sub').textContent=`Створено ${state.createdDate} · ${state.source}`;
 $('#guest-name').textContent=state.name;
 $('#guest-contact').innerHTML=`${esc(state.phone)} · <a href="mailto:${esc(state.email)}">${esc(state.email)}</a>`;
 $('#stay-dl').innerHTML=`<dt>Номер</dt><dd>${state.room} · ${state.roomType}</dd><dt>Заїзд</dt><dd>${state.checkin}, ${state.checkinTime}</dd><dt>Виїзд</dt><dd>${state.checkout}, ${state.checkoutTime}</dd><dt>Тривалість</dt><dd>${state.nights} ночі</dd><dt>Гостей</dt><dd>${state.adults} дорослих</dd><dt>Очікуваний заїзд</dt><dd>${state.expectedArrival}</dd>`;
 const paymentStatus=state.paid<=0?'Не оплачено':state.paid<state.total?'Частково оплачено':'Оплачено';
 $('#finance-figures').innerHTML=`<div><small>Загальна сума</small><b>${money(state.total)}</b></div><div><small>Оплачено</small><b>${money(state.paid)}</b></div><div class="balance"><small>Залишок</small><b>${money(balance())}</b></div>`;
 $('#status-flow').innerHTML=state.status==='cancelled'?`<p class="form-note">Бронювання скасовано.</p>`:steps.map((s,i)=>`<div class="step ${i<meta.step?'done':''} ${i===meta.step?'current':''}">${s}</div>`).join('');

 $('#guests-list').innerHTML=`<div class="result-item"><span><b>${esc(state.name)}</b><small>${state.previousStays} попередні проживання</small></span><span class="pill gold">Гість</span></div>`+
  state.additionalGuests.map(g=>`<div class="result-item"><span><b>${esc(g)}</b><small>Додатковий гість</small></span></div>`).join('')+
  `<button class="button secondary" id="btn-add-guest">+ Додати гостя</button>`;

 $('#room-number').textContent=state.room;$('#room-type').textContent=state.room+' · '+state.roomType;
 $('#room-status-pill').className='pill '+(state.roomReady?'ready':'gold');$('#room-status-pill').textContent=state.roomReady?'Готовий':'Прибирається';
 $('#room-warning').hidden=state.roomReady;
 if(!state.roomReady)$('#room-warning').innerHTML=`Номер ще прибирається<br>Відповідальний: <b>${state.roomStaff}</b> · Очікується готовність о <b>${state.roomReadyTime}</b>`;

 $('#pay-total').textContent=money(state.total);$('#pay-paid').textContent=money(state.paid);$('#pay-balance').textContent=money(balance());
 $('#payment-history').innerHTML=state.payments.map(p=>`<div class="timeline-item"><span class="t-date">${p.date}</span><div><b>${money(p.amount)}</b><small>${esc(p.method)}</small></div><span class="t-state sent">${esc(p.note)}</span></div>`).join('')||'<p class="form-note">Оплат ще немає.</p>';

 $('#extras-list').innerHTML=state.extras.map(e=>`<div class="extras-row"><span>${esc(e.name)}</span><b>${money(e.price)}</b></div>`).join('')+`<div class="extras-total"><span>Разом</span><span>${money(extrasTotal())}</span></div>`;

 $('#notes-text').textContent=state.notes||'Нотаток немає.';
 $('#preferences-tags').innerHTML=state.preferences.map(p=>`<span>${esc(p)}</span>`).join('')+`<span class="tag-add" id="btn-add-pref" role="button" tabindex="0">+ Додати побажання</span>`;

 $('#messages-timeline').innerHTML=state.messages.map(m=>`<div class="timeline-item"><span class="t-date">${m.date}</span><b style="flex:1">${esc(m.text)}</b><span class="t-state ${m.state}">${m.state==='sent'?'Надіслано':'Заплановано'}</span></div>`).join('');
 $('#history-timeline').innerHTML=state.timeline.slice().reverse().map(t=>`<div class="timeline-item"><span class="t-date">${t.date}</span><div><b>${esc(t.text)}</b>${t.meta?`<small>${esc(t.meta)}</small>`:''}</div></div>`).join('');

 $('#source-name').textContent=state.source;$('#source-campaign').textContent=state.campaign;$('#source-referrer').textContent=state.referrer;

 const primaryLabel=state.status==='checkedin'?'Оформити виїзд':state.status==='checkedout'?'Виїзд оформлено':state.status==='cancelled'?'Скасовано':'Заселити гостя';
 $('#btn-primary-action').textContent=primaryLabel;
 $('#btn-primary-action').disabled=state.status==='checkedout'||state.status==='cancelled';
 $('#btn-mobile-primary').textContent=primaryLabel;
 $('#btn-mobile-primary').disabled=$('#btn-primary-action').disabled;

 hydrate();
}

/* dialog helpers */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function checkinModal(){
 show('Заселити гостя?',`<p>${esc(state.name)}</p><div class="detail-grid"><div><small>Номер</small><b>${state.room}</b></div><div><small>Дати</small><b>${state.checkin}–${state.checkout}</b></div><div><small>Номер</small><b>${state.roomReady?'Готовий':'Прибирається'}</b></div></div><p>Оплата: <b>${balance()>0?'Залишок '+money(balance()):'Оплачено повністю'}</b></p>${balance()>0?'<label class="demo-form" style="grid-template-columns:1fr"><span class="checkbox" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="pay-later">Оплату буде внесено пізніше</span></label>':''}<div class="dialog-actions"><button class="button primary" id="confirm-checkin">Підтвердити заселення</button><button class="button secondary" data-close>Скасувати</button></div>`);
}
function checkoutModal(){
 const b=balance();
 show('Оформити виїзд?',`<p>${esc(state.name)} · Номер ${state.room}</p><div class="detail-grid"><div><small>Залишок</small><b>${money(b)}</b></div></div>${b>0?`<div class="notice danger">Є неоплачений залишок<br><b>${money(b)}</b></div><div class="dialog-actions"><button class="button primary" id="checkout-add-payment">Додати оплату</button><button class="button secondary destructive" id="confirm-checkout-anyway">Все одно оформити виїзд</button></div>`:`<div class="dialog-actions"><button class="button primary" id="confirm-checkout">Підтвердити виїзд</button><button class="button secondary" data-close>Скасувати</button></div>`}`);
}
function addPaymentModal(){
 show('Додати оплату',`<form class="demo-form" id="payment-form"><label class="full">Сума, ₴<input name="amount" type="number" required min="1" max="${balance()}" value="${balance()}"></label><label>Тип<select name="method"><option>Готівка</option><option>Карта</option><option>Банківський переказ</option><option>Онлайн</option><option>Інше</option></select></label><label>Дата<input name="date" type="date" value="2026-09-17"></label><label class="full">Нотатка (необов’язково)<input name="note" maxlength="120"></label><button class="button primary full" type="submit">Зберегти оплату</button></form>`);
}
function addExtraModal(){
 show('Додати послугу',`<form class="demo-form" id="extra-form"><label class="full">Назва<input name="name" required maxlength="60" placeholder="Наприклад, Трансфер"></label><label class="full">Ціна, ₴<input name="price" type="number" required min="1" value="200"></label><button class="button primary full" type="submit">Додати послугу</button></form>`);
}
function editNotesModal(){
 show('Редагувати нотатки',`<form class="demo-form" id="notes-form"><label class="full">Нотатки<textarea name="notes" maxlength="500">${esc(state.notes)}</textarea></label><p class="full form-note">Бачить лише персонал.</p><button class="button primary full" type="submit">Зберегти нотатки</button></form>`);
}
function addPrefModal(){
 show('Додати побажання',`<form class="demo-form" id="pref-form"><label class="full">Побажання<input name="pref" required maxlength="40" placeholder="Наприклад, Пізній виїзд"></label><button class="button primary full" type="submit">Додати</button></form>`);
}
function addGuestModal(){
 show('Додати гостя',`<form class="demo-form" id="guest-form"><label class="full">Ім’я гостя<input name="name" required maxlength="60"></label><button class="button primary full" type="submit">Додати гостя</button></form>`);
}
function editModal(){
 show('Редагувати бронювання',`<form class="demo-form" id="edit-form">
  <label class="full">Гість<input name="name" required value="${esc(state.name)}"></label>
  <label>Номер<input name="room" value="${state.room}"></label>
  <label>Тип номера<input name="roomType" value="${esc(state.roomType)}"></label>
  <label>Заїзд<input name="checkin" value="${state.checkin}"></label>
  <label>Виїзд<input name="checkout" value="${state.checkout}"></label>
  <label>Гостей<input name="adults" type="number" min="1" value="${state.adults}"></label>
  <label>Ціна, ₴<input name="total" type="number" min="1" value="${state.total}"></label>
  <label>Очікуваний заїзд<input name="expectedArrival" value="${state.expectedArrival}"></label>
  <label>Джерело<input name="source" value="${esc(state.source)}"></label>
  <label>Статус<select name="status"><option value="new" ${state.status==='new'?'selected':''}>Нове</option><option value="confirmed" ${state.status==='confirmed'?'selected':''}>Підтверджено</option><option value="checkedin" ${state.status==='checkedin'?'selected':''}>Заїхав</option><option value="checkedout" ${state.status==='checkedout'?'selected':''}>Виїхав</option></select></label>
  <p class="full form-note">Зміна номера, дат або ціни потребує підтвердження при збереженні.</p>
  <button class="button primary full" type="submit">Зберегти зміни</button>
 </form>`);
}
function cancelModal(){
 show('Скасувати бронювання?',`<form class="demo-form" id="cancel-form"><label class="full">Причина<select name="reason"><option>Гість відмовився</option><option>Не отримано оплату</option><option>Помилка</option><option>Інше</option></select></label><p class="full form-note">Оплачено: ${money(state.paid)}</p><div class="full dialog-actions"><label class="checkbox"><input type="radio" name="refund" value="refund" checked>Повернути оплату</label><label class="checkbox"><input type="radio" name="refund" value="none">Не повертати</label></div><button class="button primary full destructive" type="submit">Скасувати бронювання</button></form>`);
}
function deleteModal(){
 show('Видалити бронювання?',`<p>Цю дію не можна скасувати. Демонстраційне видалення діє лише до перезавантаження сторінки.</p><div class="dialog-actions"><button class="button primary destructive" id="confirm-delete">Видалити</button><button class="button secondary" data-close>Скасувати</button></div>`);
}
function messageModal(prefill){
 show('Написати гостю',`<p>Отримувач: ${esc(state.name)}</p><div class="template-row" id="template-row">
  <button data-t="confirm">Підтвердження</button><button data-t="arrival">Перед заїздом</button><button data-t="checkin">Check-in</button><button data-t="payment">Оплата</button><button data-t="custom" class="active">Власне повідомлення</button>
 </div><form class="demo-form" id="message-form"><label class="full">Текст повідомлення<textarea name="message" required maxlength="600" id="message-text">${esc(prefill||'')}</textarea></label><button type="button" class="button secondary full" id="ai-generate">✦ Створити за допомогою AI</button><button class="button primary full" type="submit">Надіслати</button></form>`);
}
function aiAnswer(key){
 const map={
  summary:`<p>Бронювання #1842 · <b>${esc(state.name)}</b> · Номер ${state.room}, ${state.checkin}–${state.checkout}.</p><p>Сума ${money(state.total)}, оплачено ${money(state.paid)}, залишок ${money(balance())}.</p>`,
  todo:`<p>${balance()>0?'Потрібно отримати залишок '+money(balance())+'.':'Оплата закрита.'}</p><p>${state.roomReady?'Номер готовий до заїзду.':'Номер ще прибирається.'}</p>`,
  message:`<p>Приклад: «Добрий день, ${esc(state.name.split(' ')[0])}! Чекаємо на вас ${state.checkin} ${state.checkinTime}.»</p>`,
  balance:balance()>0?`<p>Так, залишок до оплати — <b>${money(balance())}.</b></p>`:'<p>Ні, бронювання оплачено повністю.</p>',
  returning:state.previousStays>0?`<p>Так, гість проживав у вас <b>${state.previousStays}</b> раз(и) раніше.</p>`:'<p>Це перше проживання гостя.</p>'
 };
 show('Hotel AI',map[key]||'<p>Відповідь доступна лише в межах цього бронювання.</p>');
}

document.addEventListener('click',e=>{
 const moreWrap=e.target.closest('.more-wrap');
 if(!moreWrap)$('#more-menu').hidden=true;
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;return}
 switch(el.id){
  case 'more-toggle':$('#more-menu').hidden=!$('#more-menu').hidden;return;
  case 'btn-primary-action':case 'btn-mobile-primary':
   if(state.status==='checkedin')checkoutModal();else if(state.status!=='checkedout'&&state.status!=='cancelled')checkinModal();return;
  case 'confirm-checkin':state.status='checkedin';pushHistory('Гостя заселено');closeDialog();render();toast('Гостя заселено · Демо');return;
  case 'confirm-checkout':case 'confirm-checkout-anyway':state.status='checkedout';state.roomReady=false;pushHistory('Оформлено виїзд');closeDialog();render();toast('Виїзд оформлено · Номер потребує прибирання');return;
  case 'checkout-add-payment':closeDialog();addPaymentModal();return;
  case 'btn-add-payment':case 'btn-add-payment-2':addPaymentModal();return;
  case 'btn-payment-history':document.getElementById('payment-history').scrollIntoView({behavior:'smooth',block:'center'});return;
  case 'btn-refund':show('Повернути кошти',`<p>Сума до повернення: <b>${money(state.paid)}</b></p><p class="form-note">Демонстраційна дія. Реальний переказ не здійснюється.</p>`);return;
  case 'btn-remind':pushHistory('Надіслано нагадування про оплату');render();toast('Нагадування надіслано · Демо');return;
  case 'btn-add-extra':addExtraModal();return;
  case 'btn-edit-notes':editNotesModal();return;
  case 'btn-add-pref':addPrefModal();return;
  case 'btn-add-guest':addGuestModal();return;
  case 'btn-change-room':toast('Оберіть новий номер у календарі · Демо');return;
  case 'btn-open-room':show('Номер '+state.room,`<p>${state.roomType} · ${state.roomReady?'Готовий':'Прибирається'}</p>`);return;
  case 'btn-edit':editModal();return;
  case 'btn-duplicate':toast('Бронювання дубльовано · Демо');return;
  case 'btn-cancel':cancelModal();return;
  case 'btn-delete':deleteModal();return;
  case 'confirm-delete':closeDialog();toast('Бронювання видалено · Демо');return;
  case 'btn-message':case 'btn-send-message':messageModal(templates.custom);return;
  case 'btn-all-messages':show('Історія повідомлень',$('#messages-timeline').outerHTML);return;
  case 'ai-generate':{const ta=$('#message-text');if(ta)ta.value=`Добрий день, ${state.name.split(' ')[0]}! Дякуємо за бронювання номера ${state.room}. Якщо виникнуть питання — пишіть нам.`;return}
 }
 if(el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el.dataset.t){$$('#template-row button').forEach(b=>b.classList.remove('active'));el.classList.add('active');const ta=$('#message-text');if(ta)ta.value=templates[el.dataset.t]||'';return}
});

document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='payment-form'){
  const amount=Number(data.get('amount'));if(amount<=0||amount>balance())return;
  state.paid+=amount;state.payments.push({date:'17 вересня',amount,method:String(data.get('method')),note:data.get('note')?String(data.get('note')):'Додано вручну'});
  pushHistory('Додано оплату '+money(amount));closeDialog();render();toast('Оплату збережено · '+money(amount));
 }else if(f.id==='extra-form'){
  state.extras.push({name:String(data.get('name')),price:Number(data.get('price'))});closeDialog();render();toast('Послугу додано');
 }else if(f.id==='notes-form'){
  state.notes=String(data.get('notes')).trim();closeDialog();render();toast('Нотатки збережено');
 }else if(f.id==='pref-form'){
  state.preferences.push(String(data.get('pref')).trim());closeDialog();render();toast('Побажання додано');
 }else if(f.id==='guest-form'){
  state.additionalGuests.push(String(data.get('name')).trim());closeDialog();render();toast('Гостя додано');
 }else if(f.id==='edit-form'){
  const critical=data.get('room')!==state.room||data.get('checkin')!==state.checkin||data.get('checkout')!==state.checkout||Number(data.get('total'))!==state.total;
  Object.assign(state,{name:String(data.get('name')),room:String(data.get('room')),roomType:String(data.get('roomType')),checkin:String(data.get('checkin')),checkout:String(data.get('checkout')),adults:Number(data.get('adults')),total:Number(data.get('total')),expectedArrival:String(data.get('expectedArrival')),source:String(data.get('source')),status:String(data.get('status'))});
  if(critical)pushHistory('Внесено критичні зміни (номер/дати/ціна)');
  closeDialog();render();toast('Зміни збережено'+(critical?' · Потребувало підтвердження':''));
 }else if(f.id==='cancel-form'){
  state.status='cancelled';pushHistory('Бронювання скасовано: '+data.get('reason'));closeDialog();render();toast('Бронювання скасовано · Демо');
 }else if(f.id==='message-form'){
  state.messages.push({date:'17 вересня · зараз',text:String(data.get('message')).slice(0,60),state:'sent'});
  pushHistory('Надіслано повідомлення гостю');closeDialog();render();toast('Повідомлення надіслано · Демо');
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true}});

render();
