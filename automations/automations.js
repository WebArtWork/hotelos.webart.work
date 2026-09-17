'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18',check:'M5 12l4 4L19 6'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const HOTEL={name:'Grand Hotel',checkInTime:'14:00'};
const CHANNELS=['Email','SMS'];
const TEMPLATE_LIB=[
 {id:'confirm',name:'Підтвердження бронювання',recommended:true,text:'Вітаємо, {{guest.firstName}}!\nВаше бронювання в {{hotel.name}} підтверджено.'},
 {id:'arrival',name:'Перед заїздом',recommended:true,text:'Вітаємо, {{guest.firstName}}!\nНагадуємо, що завтра очікуємо вас у {{hotel.name}}. Заселення доступне після {{hotel.checkInTime}}.'},
 {id:'payment',name:'Нагадування про оплату',recommended:true,text:'Вітаємо, {{guest.firstName}}!\nЗа вашим бронюванням залишилося оплатити {{booking.balance}}.'},
 {id:'arrivalTime',name:'Запит часу прибуття',recommended:true,text:'Підкажіть, будь ласка, приблизний час вашого прибуття.'},
 {id:'checkout',name:'Нагадування про check-out',recommended:false,text:'Доброго ранку, {{guest.firstName}}! Нагадуємо, що сьогодні check-out.'},
 {id:'thanks',name:'Подяка після проживання',recommended:false,text:'Дякуємо, {{guest.firstName}}, що гостювали у нас!'}
];
const WHEN_OPTIONS=['Створено бронювання','Бронювання підтверджено','Перед заїздом','У день заїзду','Після заселення','Перед виїздом','Після виїзду','Оплата отримана','Є неоплачений залишок'];
const TIMING_BEFORE=['1 година','3 години','12 годин','24 години','2 дні'];

const automations=[
 {id:1,name:'Підтвердження бронювання',when:'Створено бронювання',timing:null,condition:null,channel:'Email',template:'confirm',active:true,statsToday:4,statsMonth:86,description:'Автоматично надсилає гостю підтвердження одразу після створення бронювання.',history30:{done:86,ok:85,fail:1,scheduled:0}},
 {id:2,name:'Інструкція перед заїздом',when:'Перед заїздом',timing:'24 години',condition:null,channel:'Email',template:'arrival',active:true,statsToday:3,statsMonth:54,next:'Сьогодні · 14:00',nextCount:3,description:'Надсилає інформацію про заселення за добу до заїзду.',history30:{done:54,ok:52,fail:2,scheduled:6}},
 {id:3,name:'Запитати час прибуття',when:'У день заїзду',timing:'09:00',condition:'Час прибуття невідомий',channel:'Email',template:'arrivalTime',active:true,statsToday:2,statsMonth:31,description:'Якщо гість не вказав час прибуття, Hotel OS запитує це вранці у день заїзду.',history30:{done:31,ok:30,fail:0,scheduled:2}},
 {id:4,name:'Нагадування про оплату',when:'Перед заїздом',timing:'24 години',condition:'Є неоплачений залишок',channel:'Email',template:'payment',active:true,statsToday:1,statsMonth:22,description:'Нагадує гостю про неоплачений залишок перед заїздом.',history30:{done:48,ok:46,fail:2,scheduled:8}},
 {id:5,name:'Нагадування про виїзд',when:'Перед виїздом',timing:'09:00',condition:null,channel:'Email',template:'checkout',active:true,statsToday:2,statsMonth:28,description:'Нагадує гостю про час check-out у день виїзду.',history30:{done:28,ok:28,fail:0,scheduled:3}},
 {id:6,name:'Подяка після проживання',when:'Після виїзду',timing:'2 години',condition:null,channel:'Email',template:'thanks',active:true,statsToday:1,statsMonth:19,description:'Надсилає подяку через 2 години після виїзду гостя.',history30:{done:19,ok:19,fail:0,scheduled:1}}
];
const historyLog=[
 {time:'17 вересня · 11:15',name:'Нагадування про оплату',guest:'Олег Бондар',bookingId:1847,channel:'Email',result:'sent'},
 {time:'17 вересня · 09:00',name:'Перед заїздом',guest:'Анна Коваленко',bookingId:1842,channel:'Email',result:'failed',reason:'Email не вказано.'},
 {time:'17 вересня · 09:00',name:'Нагадування про оплату',guest:'Марія Петренко',bookingId:1853,channel:'Email',result:'skipped',reason:'Бронювання вже оплачено.'},
 {time:'16 вересня · 14:00',name:'Інструкція перед заїздом',guest:'Анна Коваленко',bookingId:1842,channel:'Email',result:'sent'},
 {time:'14 вересня · 12:14',name:'Підтвердження бронювання',guest:'Анна Коваленко',bookingId:1842,channel:'Email',result:'sent'}
];
const upcomingRuns=[
 {time:'Сьогодні · 14:00',guest:'Анна Коваленко',bookingId:1842,name:'Перед заїздом'},
 {time:'Сьогодні · 16:00',guest:'Олег Бондар',bookingId:1847,name:'Нагадування про оплату'},
 {time:'Завтра · 09:00',guest:'Марія Петренко',bookingId:1851,name:'Час прибуття'}
];

const state={tab:'active',wizard:null};

function counts(){
 const active=automations.filter(a=>a.active).length;
 const today=automations.reduce((s,a)=>s+a.statsToday,0);
 const scheduled=24;
 const attention=historyLog.filter(h=>h.result==='failed').length;
 return{active,today,scheduled,attention};
}
function renderKpis(){
 const c=counts();
 $('#kpis').innerHTML=`<div class="kpi"><small>Активні</small><b>${c.active}</b><span>автоматизацій працюють</span></div><div class="kpi"><small>Виконано сьогодні</small><b>${c.today}</b><span>автоматичних дій</span></div><div class="kpi"><small>Заплановано</small><b>${c.scheduled}</b><span>на найближчі 7 днів</span></div><div class="kpi ${c.attention?'gold':''}"><small>Потребують уваги</small><b>${c.attention}</b><span>${c.attention?'не вдалося виконати':'все працює'}</span></div>`;
}
function flowLabel(a){
 return `<span>Коли: <b>${esc(a.when)}${a.timing?' · '+esc(a.timing):''}</b></span>${a.condition?`<span class="arrow">→</span><span>Якщо: <b>${esc(a.condition)}</b></span>`:''}<span class="arrow">→</span><span>Дія: <b>Надіслати ${a.channel}</b></span>`;
}
function automationCard(a){
 return `<div class="auto-card ${a.active?'':'inactive'}" data-open-automation="${a.id}">
  <div class="ac-main">
   <h3>${esc(a.name)}</h3>
   <div class="ac-flow">${flowLabel(a)}</div>
   <div class="ac-stats">${a.next?`Наступне: ${a.next} · ${a.nextCount} гостям`:`Сьогодні: ${a.statsToday} · Цього місяця: ${a.statsMonth}`}</div>
  </div>
  <div class="ac-right">
   <span class="pill ${a.active?'ready':''}">${a.active?'Активна':'Вимкнена'}</span>
   <button class="secondary text-action" data-edit-automation="${a.id}" style="border:1px solid #d9d9dd;padding:8px 12px;border-radius:6px">Редагувати</button>
   <span class="switch ${a.active?'on':''}" data-toggle="${a.id}" role="switch" aria-checked="${a.active}" tabindex="0"></span>
  </div>
 </div>`;
}
function renderTabContent(){
 const box=$('#tab-content');
 $('#upcoming-card').hidden=state.tab!=='active';
 if(state.tab==='active'){
  const list=automations.filter(a=>a.active);
  box.innerHTML=list.length?`<div class="automation-cards">${list.map(automationCard).join('')}</div>`:emptyStateHtml();
 }else if(state.tab==='disabled'){
  const list=automations.filter(a=>!a.active);
  box.innerHTML=list.length?`<div class="automation-cards">${list.map(automationCard).join('')}</div>`:`<div class="empty-state"><h2>Немає вимкнених автоматизацій</h2><p>Усі автоматизації зараз активні.</p></div>`;
 }else if(state.tab==='templates'){
  box.innerHTML=`<div class="template-cards">${TEMPLATE_LIB.map(t=>{
   const exists=automations.some(a=>a.template===t.id);
   return `<div class="template-card2">${t.recommended?'<span class="rec">Рекомендовано</span>':''}<h3>${esc(t.name)}</h3><p>${esc(t.text.split('\n')[0])}</p>${exists?'<span class="pill ready">Вже додано</span>':`<button class="button secondary" data-add-preset="${t.id}">Додати</button>`}</div>`;
  }).join('')}</div>`;
 }else if(state.tab==='history'){
  box.innerHTML=`<div class="history-table"><table><thead><tr><th>Час</th><th>Автоматизація</th><th>Гість</th><th>Бронювання</th><th>Канал</th><th>Результат</th></tr></thead><tbody>${historyLog.map(h=>`<tr><td>${h.time}</td><td><b>${esc(h.name)}</b></td><td>${esc(h.guest)}</td><td>#${h.bookingId}</td><td>${h.channel}</td><td><span class="status-tag ${h.result}">${{sent:'Надіслано',failed:'Помилка',skipped:'Пропущено'}[h.result]}</span>${h.result==='failed'?`<div style="margin-top:4px"><small style="color:#9c4c3d">${esc(h.reason)}</small> · <button class="text-action" data-retry-history>Повторити</button></div>`:h.result==='skipped'?`<div style="margin-top:4px"><small style="color:#9b9ca2">${esc(h.reason)}</small></div>`:''}</td></tr>`).join('')}</tbody></table></div>`;
 }
 hydrate(box);
}
function emptyStateHtml(){
 return `<div class="empty-state"><h2>Автоматизуйте повторювані задачі</h2><p>Hotel OS може автоматично підтверджувати бронювання, нагадувати про оплату та комунікувати з гостями до і після проживання.</p><div class="empty-actions"><button class="button primary" id="btn-enable-recommended">Увімкнути рекомендовані</button><button class="button secondary" id="btn-new-automation-2">+ Створити автоматизацію</button></div></div>`;
}
function renderUpcoming(){
 $('#upcoming-list').innerHTML=upcomingRuns.map(u=>`<div class="upcoming-row"><span class="time">${u.time}</span><span style="flex:1">${esc(u.guest)} · #${u.bookingId}</span><b>${esc(u.name)}</b></div>`).join('');
}
function renderAll(){renderKpis();renderTabContent();renderUpcoming();hydrate()}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openAutomationPanel(id){
 const a=automations.find(a=>a.id===id);if(!a)return;
 $('#side-body').innerHTML=`
 <span class="pill ${a.active?'ready':''}">${a.active?'Активна':'Вимкнена'}</span>
 <h2 style="font-size:20px;margin:8px 0 4px">${esc(a.name)}</h2>
 <p style="font-size:12px;color:#9b9ca2;margin:0 0 14px">${esc(a.description)}</p>

 <h5>Правило</h5>
 <div class="rule-chain">
  <div class="rule-step"><small>Коли</small><b>${esc(a.when)}${a.timing?' · '+esc(a.timing):''}</b></div>
  ${a.condition?`<div class="rule-arrow">↓</div><div class="rule-step"><small>Умова</small><b>${esc(a.condition)}</b></div>`:''}
  <div class="rule-arrow">↓</div>
  <div class="rule-step"><small>Дія</small><b>Надіслати ${a.channel}</b><br><span style="font-size:11px;color:#9b9ca2">Шаблон: ${TEMPLATE_LIB.find(t=>t.id===a.template)?.name||'—'}</span></div>
 </div>

 <h5>За останні 30 днів</h5>
 <div class="stats-grid"><div><b>${a.history30.done}</b><span>Виконано</span></div><div><b>${a.history30.ok}</b><span>Успішно</span></div><div><b>${a.history30.fail}</b><span>Помилки</span></div><div><b>${a.history30.scheduled}</b><span>Заплановано</span></div></div>

 ${upcomingRuns.filter(u=>u.name===a.when||u.name===a.name).length?`<h5>Найближчі виконання</h5>${upcomingRuns.filter(u=>u.name===a.when||u.name===a.name).map(u=>`<div class="upcoming-row"><span class="time">${u.time}</span><span style="flex:1">${esc(u.guest)}</span></div>`).join('')}`:''}

 <h5>Дії</h5>
 <div class="dialog-actions">
  <button class="button secondary" data-edit-automation="${a.id}">Редагувати</button>
  <button class="button secondary" data-duplicate="${a.id}">Дублювати</button>
  <button class="button secondary" data-archive-automation="${a.id}">Архівувати</button>
  ${a.active?`<button class="button secondary destructive" data-disable="${a.id}">Вимкнути</button>`:`<button class="button primary" data-enable="${a.id}">Увімкнути</button>`}
 </div>`;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function disableConfirm(id){
 show('Вимкнути автоматизацію?','<p>Заплановані дії цієї автоматизації більше не виконуватимуться.</p>'+`<div class="dialog-actions"><button class="button primary destructive" id="confirm-disable-${id}">Вимкнути</button><button class="button secondary" data-close>Скасувати</button></div>`);
}
function addPresetModal(templateId){
 const t=TEMPLATE_LIB.find(t=>t.id===templateId);
 show('Додати автоматизацію?',`<p>Hotel OS вже підготував рекомендовані налаштування.</p><div class="rule-chain"><div class="rule-step"><small>Шаблон</small><b>${esc(t.name)}</b></div></div><div class="preview-box">${esc(t.text)}</div><div class="dialog-actions"><button class="button primary" data-confirm-preset="${templateId}">Додати та увімкнути</button><button class="button secondary" data-configure-preset="${templateId}">Налаштувати</button></div>`);
}

/* creation wizard */
const WIZARD_STEPS=['when','condition','action','review'];
function newWizard(prefill){
 state.wizard=Object.assign({step:0,when:null,timing:null,condition:'Без додаткових умов',action:'message',channel:'Email',template:null,customText:''},prefill||{});
 renderWizard();
}
function renderWizard(){
 const w=state.wizard;
 const i=w.step;
 let body='';
 if(WIZARD_STEPS[i]==='when'){
  body=`<h2>Коли запустити автоматизацію?</h2><div class="option-cards">${WHEN_OPTIONS.map(o=>`<button data-pick-when="${esc(o)}" class="${w.when===o?'selected':''}">${o}</button>`).join('')}</div>
  ${w.when==='Перед заїздом'||w.when==='Перед виїздом'?`<p style="font-size:11px;color:#9b9ca2;margin-top:10px">За скільки часу?</p><div class="option-cards">${TIMING_BEFORE.map(t=>`<button data-pick-timing="${t}" class="${w.timing===t?'selected':''}">${t}</button>`).join('')}</div>`:''}
  ${w.when==='У день заїзду'||w.when==='Після заселення'?`<p style="font-size:11px;color:#9b9ca2;margin-top:10px">О котрій годині?</p><label class="full"><input type="time" id="wiz-time" value="${w.timing&&w.timing.includes(':')?w.timing:'09:00'}"></label>`:''}
  ${w.when==='Після виїзду'?`<p style="font-size:11px;color:#9b9ca2;margin-top:10px">Через скільки часу?</p><div class="option-cards"><button data-pick-timing="2 години" class="${w.timing==='2 години'?'selected':''}">2 години</button><button data-pick-timing="24 години" class="${w.timing==='24 години'?'selected':''}">24 години</button></div>`:''}`;
 }else if(WIZARD_STEPS[i]==='condition'){
  const conditions=['Без додаткових умов','Не оплачено','Частково оплачено','Оплачено','Час прибуття невідомий','Час прибуття відомий','Новий гість','Постійний гість'];
  body=`<h2>Чи потрібна додаткова умова?</h2><div class="option-cards">${conditions.map(c=>`<button data-pick-condition="${esc(c)}" class="${w.condition===c?'selected':''}">${c}</button>`).join('')}</div>`;
 }else if(WIZARD_STEPS[i]==='action'){
  body=`<h2>Що має зробити Hotel OS?</h2>
  <div class="option-cards"><button data-pick-action="message" class="selected">Надіслати повідомлення</button><button data-pick-action="internal">Створити внутрішнє нагадування</button><button data-pick-action="notify">Повідомити персонал</button></div>
  <label class="full" style="margin-top:12px">Канал<select id="wiz-channel"><option ${w.channel==='Email'?'selected':''}>Email</option><option ${w.channel==='SMS'?'selected':''}>SMS</option></select></label>
  <label class="full" style="margin-top:12px">Шаблон<select id="wiz-template"><option value="">Без шаблону</option>${TEMPLATE_LIB.map(t=>`<option value="${t.id}" ${w.template===t.id?'selected':''}>${t.name}</option>`).join('')}</select></label>
  <div class="preview-box" id="wiz-preview">${w.template?esc(TEMPLATE_LIB.find(t=>t.id===w.template).text):'Оберіть шаблон, щоб побачити попередній перегляд.'}</div>`;
 }else if(WIZARD_STEPS[i]==='review'){
  const tpl=TEMPLATE_LIB.find(t=>t.id===w.template);
  body=`<h2>Перевірте автоматизацію</h2>
  <div class="rule-chain">
   <div class="rule-step"><small>Коли</small><b>${esc(w.when||'—')}${w.timing?' · '+esc(w.timing):''}</b></div>
   <div class="rule-arrow">↓</div>
   <div class="rule-step"><small>Якщо</small><b>${esc(w.condition)}</b></div>
   <div class="rule-arrow">↓</div>
   <div class="rule-step"><small>Тоді</small><b>Надіслати гостю ${w.channel}</b>${tpl?`<br>«${esc(tpl.name)}»`:''}</div>
  </div>
  ${tpl?`<div class="preview-box">${esc(tpl.text)}</div>`:''}`;
 }
 show('Нова автоматизація',`${body}<div class="step-dots">${WIZARD_STEPS.map((s,idx)=>`<span class="${idx===i?'active':''}"></span>`).join('')}</div>
 <div class="wizard-actions">
  <button class="button secondary" id="wiz-back" ${i===0?'disabled':''}>Назад</button>
  ${i<WIZARD_STEPS.length-1?`<button class="button primary" id="wiz-next">Продовжити</button>`:`<div style="display:flex;gap:10px"><button class="button secondary" id="wiz-save-off">Зберегти вимкненою</button><button class="button primary" id="wiz-enable">Увімкнути автоматизацію</button></div>`}
 </div>`);
 if(WIZARD_STEPS[i]==='action'){
  $('#wiz-template').addEventListener('change',e=>{state.wizard.template=e.target.value||null;const t=TEMPLATE_LIB.find(t=>t.id===state.wizard.template);$('#wiz-preview').textContent=t?t.text:'Оберіть шаблон, щоб побачити попередній перегляд.'});
  $('#wiz-channel').addEventListener('change',e=>{state.wizard.channel=e.target.value});
 }
 if(WIZARD_STEPS[i]==='when'){
  const timeInput=$('#wiz-time');if(timeInput)timeInput.addEventListener('change',e=>{state.wizard.timing=e.target.value});
 }
}
function aiCreateModal(){
 show('Створити через AI',`<form class="demo-form" id="ai-create-form"><label class="full">Опишіть, що має робити автоматизація<textarea name="prompt" placeholder="Наприклад: За день до приїзду попроси гостя повідомити час заїзду." required maxlength="300"></textarea></label><button class="button primary full" type="submit">Запропонувати</button></form>`);
}
function aiParsePrompt(text){
 const low=text.toLocaleLowerCase('uk-UA');
 const w={when:'Перед заїздом',timing:'24 години',condition:'Час прибуття невідомий',channel:'Email',template:'arrivalTime'};
 if(/оплат/.test(low)){w.condition='Не оплачено';w.template='payment'}
 if(/виїзд|check-?out/.test(low)){w.when='Перед виїздом';w.timing='09:00';w.condition='Без додаткових умов';w.template='checkout'}
 if(/подяк|дякуємо/.test(low)){w.when='Після виїзду';w.timing='2 години';w.condition='Без додаткових умов';w.template='thanks'}
 return w;
}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el.dataset.tab){$$('#tabs button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.tab=el.dataset.tab;renderTabContent();return}
 if(el.id==='btn-history'){$$('#tabs button').forEach(b=>b.classList.remove('active'));$('[data-tab="history"]').classList.add('active');state.tab='history';renderTabContent();return}
 if(el.id==='btn-new-automation'||el.id==='btn-new-automation-2'||el.id==='floating-add'){newWizard();return}
 if(el.id==='btn-ai-create'){aiCreateModal();return}
 if(el.id==='btn-enable-recommended'){automations.forEach(a=>a.active=true);renderAll();toast('Рекомендовані автоматизації увімкнено');return}
 if(el.dataset.addPreset){addPresetModal(el.dataset.addPreset);return}
 if(el.dataset.confirmPreset){
  const t=TEMPLATE_LIB.find(t=>t.id===el.dataset.confirmPreset);
  automations.push({id:Math.max(...automations.map(a=>a.id))+1,name:t.name,when:'Створено бронювання',timing:null,condition:null,channel:'Email',template:t.id,active:true,statsToday:0,statsMonth:0,description:t.text.split('\n')[0],history30:{done:0,ok:0,fail:0,scheduled:0}});
  closeDialog();renderAll();toast('Автоматизацію додано та увімкнено');return;
 }
 if(el.dataset.configurePreset){closeDialog();newWizard({template:el.dataset.configurePreset,channel:TEMPLATE_LIB.find(t=>t.id===el.dataset.configurePreset).channel||'Email'});return}
 if(el.dataset.openAutomation){openAutomationPanel(Number(el.dataset.openAutomation));return}
 if(el.dataset.editAutomation){closeSidePanel();closeDialog();const a=automations.find(a=>a.id===Number(el.dataset.editAutomation));newWizard({when:a.when,timing:a.timing,condition:a.condition||'Без додаткових умов',channel:a.channel,template:a.template});return}
 if(el.dataset.duplicate){
  const a=automations.find(a=>a.id===Number(el.dataset.duplicate));
  automations.push(Object.assign({},a,{id:Math.max(...automations.map(x=>x.id))+1,name:a.name+' (копія)',statsToday:0,statsMonth:0,history30:{done:0,ok:0,fail:0,scheduled:0}}));
  closeSidePanel();renderAll();toast('Автоматизацію дубльовано');return;
 }
 if(el.dataset.archiveAutomation){const id=Number(el.dataset.archiveAutomation);const idx=automations.findIndex(a=>a.id===id);if(idx>-1)automations.splice(idx,1);closeSidePanel();renderAll();toast('Автоматизацію архівовано');return}
 if(el.dataset.disable){disableConfirm(el.dataset.disable);return}
 if(el.id&&el.id.startsWith('confirm-disable-')){const id=Number(el.id.replace('confirm-disable-',''));automations.find(a=>a.id===id).active=false;closeDialog();closeSidePanel();renderAll();toast('Автоматизацію вимкнено');return}
 if(el.dataset.enable){automations.find(a=>a.id===Number(el.dataset.enable)).active=true;closeSidePanel();renderAll();toast('Автоматизацію увімкнено');return}
 if(el.dataset.toggle){
  const a=automations.find(a=>a.id===Number(el.dataset.toggle));
  if(a.active)disableConfirm(a.id);else{a.active=true;renderAll();toast('Автоматизацію увімкнено')}
  return;
 }
 if(el.dataset.retryHistory!==undefined){toast('Спробу повторено · Демо');return}
 if(el.id==='wiz-back'){state.wizard.step--;renderWizard();return}
 if(el.id==='wiz-next'){state.wizard.step++;renderWizard();return}
 if(el.dataset.pickWhen){state.wizard.when=el.dataset.pickWhen;state.wizard.timing=null;renderWizard();return}
 if(el.dataset.pickTiming){state.wizard.timing=el.dataset.pickTiming;renderWizard();return}
 if(el.dataset.pickCondition){state.wizard.condition=el.dataset.pickCondition;renderWizard();return}
 if(el.dataset.pickAction){state.wizard.action=el.dataset.pickAction;renderWizard();return}
 if(el.id==='wiz-enable'||el.id==='wiz-save-off'){
  const w=state.wizard;
  automations.push({id:Math.max(...automations.map(a=>a.id))+1,name:(TEMPLATE_LIB.find(t=>t.id===w.template)?.name)||w.when,when:w.when||'Створено бронювання',timing:w.timing,condition:w.condition==='Без додаткових умов'?null:w.condition,channel:w.channel,template:w.template,active:el.id==='wiz-enable',statsToday:0,statsMonth:0,description:'Нова автоматизація, створена вручну.',history30:{done:0,ok:0,fail:0,scheduled:0}});
  closeDialog();renderAll();toast(el.id==='wiz-enable'?'Автоматизацію увімкнено':'Автоматизацію збережено вимкненою');return;
 }
 if(el.id==='side-close'){closeSidePanel();return}
 if(el.id==='side-scrim'){closeSidePanel();return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='ai-create-form'){
  const w=aiParsePrompt(String(data.get('prompt')));
  closeDialog();setTimeout(()=>newWizard(Object.assign(w,{step:3})),50);
 }
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');closeSidePanel()}});

renderAll();
