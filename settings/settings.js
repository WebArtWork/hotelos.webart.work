'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const SECTIONS=[
 {id:'general',label:'Загальне'},{id:'contacts',label:'Контакти та локація'},{id:'stay',label:'Заселення та виїзд'},
 {id:'booking',label:'Бронювання'},{id:'payments',label:'Оплати'},{id:'rules',label:'Правила'},
 {id:'bookingpage',label:'Booking Page'},{id:'messages',label:'Повідомлення'},{id:'automations',label:'Автоматизації'},
 {id:'notifications',label:'Сповіщення'},{id:'sources',label:'Джерела бронювань'},{id:'ai',label:'AI'},{id:'security',label:'Безпека'}
];
const OWNER_ONLY=new Set(['payments','rules','ai','security']);
const READONLY_ROLES={reception:true,housekeeping:true};

const settings={
 name:'Grand Hotel',shortName:'Grand',type:'Бутик-готель',
 description:'Невеликий бутик-готель у центрі Кам’янця-Подільського.',
 currency:'UAH — ₴',language:'Українська',timezone:'Europe/Kyiv',
 phone:'+380 67 123 45 67',email:'hotel@example.com',altPhone:'',website:'',instagram:'',facebook:'',
 country:'Україна',city:'Кам’янець-Подільський',street:'Старобульварна',building:'10',zip:'',
 arrivalInstructions:'Вхід до готелю знаходиться з боку внутрішнього дворика. Паркінг доступний праворуч від центрального входу.',
 checkIn:'14:00',checkOut:'11:00',receptionFrom:'08:00',receptionTo:'23:00',
 lateCheckin:true,lateCheckinNote:'Для заїзду після 23:00 зв’яжіться з адміністрацією заздалегідь.',
 earlyCheckin:'available',lateCheckout:'available',
 minNights:1,maxNights:'',sameDayBooking:true,sameDayCutoff:'20:00',futureDays:365,
 bookingStatus:'auto',roomAssignment:'manual',
 paymentRule:'percent',fixedDeposit:1500,percentDeposit:30,
 methodCash:true,methodBank:true,methodCard:true,onlineProvider:false,bankDetails:'',
 cancellationType:'flexible',cancellationHours:48,cancellationCustom:'',
 smoking:'Заборонено',pets:'За попереднім погодженням',children:'Діти будь-якого віку вітаються',quietFrom:'22:00',quietTo:'08:00',extraGuests:'За додаткову плату, за погодженням з готелем.',
 customRules:'Ключ-картка повинна бути повернута під час виїзду.',
 bookingPageActive:true,slug:'grand-hotel',bpTitle:'Забронюйте номер напряму',bpDesc:'Оберіть дати та номер — підтвердження займе лише кілька хвилин.',
 bpShowDescription:true,bpShowAmenities:true,bpShowPhotos:true,bpShowLocation:true,bpShowCancellation:true,bpShowPhone:true,bpShowEmail:false,bpShowInstagram:false,
 emailSenderName:'Grand Hotel',replyTo:'hotel@example.com',defaultChannel:'email',
 quietHoursOn:true,quietHoursFrom:'22:00',quietHoursTo:'08:00',
 notifyNewBooking:true,notifyCancellation:true,notifyPayment:true,notifyMessage:true,notifyRoomNotReady:true,notifyHousekeeping:false,notifyAutomationError:true,notifyChannel:'inapp',
 aiEnabled:true,aiBookings:true,aiGuests:true,aiFinance:true,aiSales:true,aiMessages:true,
 prefix:'GH-',nextNumber:1843,
 legalName:'',legalId:'',legalAddress:'',legalOpen:false
};
const sources=[
 {name:'Пряме бронювання',active:true},{name:'Сайт',active:true},{name:'Instagram',active:true},{name:'Google',active:true},
 {name:'Facebook',active:true},{name:'Телефон',active:true},{name:'Booking.com',active:true},{name:'Walk-in',active:true},{name:'Інше',active:true}
];
const history=[
 {date:'17 вересня · 15:42',by:'Олександр',text:'змінив check-in: 13:00 → 14:00'},
 {date:'16 вересня · 11:10',by:'Олександр',text:'змінив передоплату: 20% → 30%'}
];
const onboarding=[
 {label:'Основна інформація',done:true},{label:'Контакти',done:true},{label:'Номери',done:true},
 {label:'Правила бронювання',done:false},{label:'Оплати',done:false},{label:'Booking Page',done:false},{label:'Автоматизації',done:false}
];

const state={section:'general',dirty:false,role:HotelRole.get(),pendingSection:null};

function isReadonly(){return READONLY_ROLES[state.role]}
function isLocked(sectionId){return isReadonly()||(OWNER_ONLY.has(sectionId)&&state.role!=='owner')}

function markDirty(){if(isReadonly())return;state.dirty=true;renderSaveStatus()}
function renderSaveStatus(){
 const el=$('#save-status');
 el.textContent=state.dirty?'Є незбережені зміни':'Зміни збережено';
 el.classList.toggle('dirty',state.dirty);
 $('#btn-save').disabled=!state.dirty;
}
function renderOnboard(){
 const done=onboarding.filter(o=>o.done).length;
 $('#onboard-card').innerHTML=`<h2>Налаштуйте готель</h2><div class="onboard-progress">${done} з ${onboarding.length} готово</div><div class="onboard-list">${onboarding.map(o=>`<span class="${o.done?'done':''}">${esc(o.label)}</span>`).join('')}</div>`;
}
function renderNav(){
 $('#settings-nav').innerHTML=SECTIONS.map(s=>`<button data-section="${s.id}" class="${state.section===s.id?'active':''}">${s.label}${isLocked(s.id)?' 🔒':''}</button>`).join('');
 $('#mobile-nav-select').innerHTML=SECTIONS.map(s=>`<option value="${s.id}" ${state.section===s.id?'selected':''}>${s.label}</option>`).join('');
}

function field(label,inputHtml,help,full){
 return `<div class="field ${full?'full':''}"><label>${label}${help?`<small class="help"> · ${help}</small>`:''}</label>${inputHtml}</div>`;
}
function toggleRow(key,title,sub,disabled){
 return `<div class="toggle-row"><div><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div><span class="switch ${settings[key]?'on':''} ${disabled?'disabled':''}" data-toggle="${key}"></span></div>`;
}

function sectionGeneral(){
 return `<div class="settings-card" id="appearance">
  <h2>Оформлення</h2><p class="card-sub">Тема інтерфейсу Hotel OS — застосовується одразу і запам'ятовується в цьому браузері.</p>
  <div class="toggle-row" style="border-top:0"><div><b>Темна тема</b><span class="sub">За замовчуванням Hotel OS відкривається в темній темі</span></div><button class="theme-toggle" data-theme-toggle aria-label="Перемкнути тему"><span class="dot"></span><span class="theme-toggle-label"></span></button></div>
 </div>
 <div class="settings-card" id="general">
  <h2>Загальна інформація</h2><p class="card-sub">Основна інформація, яка використовується всередині Hotel OS та на публічних сторінках.</p>
  <div class="field-grid">
   ${field('Назва готелю *',`<input data-bind="name" value="${esc(settings.name)}">`)}
   ${field('Коротка назва',`<input data-bind="shortName" value="${esc(settings.shortName)}">`,'для компактного UI')}
   ${field('Тип об’єкта',`<select data-bind="type"><option ${settings.type==='Готель'?'selected':''}>Готель</option><option ${settings.type==='Бутик-готель'?'selected':''}>Бутик-готель</option><option ${settings.type==='Апарт-готель'?'selected':''}>Апарт-готель</option><option ${settings.type==='Гостьовий будинок'?'selected':''}>Гостьовий будинок</option><option ${settings.type==='Вілла'?'selected':''}>Вілла</option><option ${settings.type==='Апартаменти'?'selected':''}>Апартаменти</option><option ${settings.type==='Інше'?'selected':''}>Інше</option></select>`)}
   ${field('Валюта',`<select data-bind="currency"><option>UAH — ₴</option><option disabled>EUR (незабаром)</option><option disabled>USD (незабаром)</option></select>`)}
   ${field('Мова',`<select data-bind="language"><option>Українська</option></select>`,'Release A — лише українська')}
   ${field('Часовий пояс',`<select data-bind="timezone"><option>Europe/Kyiv</option></select>`,'використовується для бронювань, повідомлень та автоматизацій')}
   ${field('Опис',`<textarea data-bind="description">${esc(settings.description)}</textarea>`,'показується на Booking Page','full')}
  </div>
  <div class="subhead">Логотип та фото</div>
  <div class="field-grid">
   <div class="field"><label>Логотип</label><div style="display:flex;gap:8px"><button class="button secondary" id="btn-upload-logo">Завантажити логотип</button><button class="text-action" id="btn-remove-logo">Видалити</button></div></div>
   <div class="field"><label>Головне фото</label><small class="help" style="display:block;margin-bottom:6px">Використовується на Booking Page · рекомендовано 16:9</small><button class="button secondary" id="btn-upload-cover">Завантажити фото</button></div>
  </div>
 </div>`;
}
function sectionContacts(){
 return `<div class="settings-card" id="contacts">
  <h2>Контакти</h2>
  <div class="field-grid">
   ${field('Телефон',`<input data-bind="phone" value="${esc(settings.phone)}">`)}
   ${field('Email',`<input data-bind="email" type="email" value="${esc(settings.email)}">`)}
   ${field('Додатковий телефон',`<input data-bind="altPhone" value="${esc(settings.altPhone)}">`)}
   ${field('Website',`<input data-bind="website" value="${esc(settings.website)}">`)}
   ${field('Instagram',`<input data-bind="instagram" value="${esc(settings.instagram)}">`)}
   ${field('Facebook',`<input data-bind="facebook" value="${esc(settings.facebook)}">`)}
  </div>
 </div>
 <div class="settings-card">
  <h2>Адреса</h2>
  <div class="field-grid">
   ${field('Країна',`<input data-bind="country" value="${esc(settings.country)}">`)}
   ${field('Місто',`<input data-bind="city" value="${esc(settings.city)}">`)}
   ${field('Вулиця',`<input data-bind="street" value="${esc(settings.street)}">`)}
   ${field('Будинок',`<input data-bind="building" value="${esc(settings.building)}">`)}
   ${field('Поштовий індекс',`<input data-bind="zip" value="${esc(settings.zip)}">`)}
  </div>
  <button class="button secondary" id="btn-check-map" style="margin-top:14px">Перевірити на карті</button>
  <div class="subhead">Як знайти готель</div>
  ${field('Інструкція для гостей',`<textarea data-bind="arrivalInstructions">${esc(settings.arrivalInstructions)}</textarea>`,'показується на Booking Confirmation','full')}
 </div>`;
}
function sectionStay(){
 return `<div class="settings-card" id="checkin-checkout">
  <h2>Заселення та виїзд</h2>
  <div class="field-grid">
   ${field('Check-in',`<input type="time" data-bind="checkIn" value="${settings.checkIn}">`)}
   ${field('Check-out',`<input type="time" data-bind="checkOut" value="${settings.checkOut}">`)}
   ${field('Рецепція з',`<input type="time" data-bind="receptionFrom" value="${settings.receptionFrom}">`)}
   ${field('Рецепція до',`<input type="time" data-bind="receptionTo" value="${settings.receptionTo}">`)}
  </div>
  <div class="subhead">Пізнє заселення</div>
  ${toggleRow('lateCheckin','Дозволено')}
  ${settings.lateCheckin?field('Інструкція',`<textarea data-bind="lateCheckinNote">${esc(settings.lateCheckinNote)}</textarea>`,'','full'):''}
  <div class="subhead">Ранній заїзд</div>
  ${field('',`<select data-bind="earlyCheckin"><option value="none" ${settings.earlyCheckin==='none'?'selected':''}>Не гарантується</option><option value="available" ${settings.earlyCheckin==='available'?'selected':''}>Доступний за наявності</option><option value="paid" ${settings.earlyCheckin==='paid'?'selected':''}>Дозволено за доплату</option></select>`,'','full')}
  <div class="subhead">Пізній виїзд</div>
  ${field('',`<select data-bind="lateCheckout"><option value="none" ${settings.lateCheckout==='none'?'selected':''}>Не гарантується</option><option value="available" ${settings.lateCheckout==='available'?'selected':''}>Доступний за наявності</option><option value="paid" ${settings.lateCheckout==='paid'?'selected':''}>Дозволено за доплату</option></select>`,'','full')}
 </div>`;
}
function sectionBooking(){
 return `<div class="settings-card" id="booking-rules">
  <h2>Правила бронювання</h2>
  <div class="field-grid">
   ${field('Мінімальна кількість ночей',`<input type="number" min="1" data-bind="minNights" value="${settings.minNights}">`)}
   ${field('Максимальна кількість ночей',`<input type="number" min="1" data-bind="maxNights" value="${esc(settings.maxNights)}">`,'необов’язково')}
   ${field('Максимальний період бронювання наперед',`<input type="number" min="1" data-bind="futureDays" value="${settings.futureDays}">`,'днів')}
  </div>
  <div class="subhead">Бронювання на сьогодні</div>
  ${toggleRow('sameDayBooking','Дозволити')}
  ${settings.sameDayBooking?field('Приймати бронювання на сьогодні до',`<input type="time" data-bind="sameDayCutoff" value="${settings.sameDayCutoff}">`,'','full'):''}
 </div>
 <div class="settings-card">
  <h2>Нове бронювання</h2>
  <div class="option-cards">
   <div class="opt-card ${settings.bookingStatus==='auto'?'selected':''}" data-pick="bookingStatus" data-val="auto"><b>Підтверджувати автоматично</b><span>Рекомендовано для прямого бронювання, якщо availability та оплата задоволені.</span></div>
   <div class="opt-card ${settings.bookingStatus==='pending'?'selected':''}" data-pick="bookingStatus" data-val="pending"><b>Створювати як «Очікує підтвердження»</b><span>Персонал підтверджує вручну.</span></div>
  </div>
 </div>
 <div class="settings-card">
  <h2>Призначення номера</h2>
  <div class="option-cards">
   <div class="opt-card ${settings.roomAssignment==='auto'?'selected':''}" data-pick="roomAssignment" data-val="auto"><b>Автоматично</b><span>Hotel OS обирає конкретний вільний номер потрібного типу.</span></div>
   <div class="opt-card ${settings.roomAssignment==='manual'?'selected':''}" data-pick="roomAssignment" data-val="manual"><b>Менеджер призначає пізніше</b><span>Гість бронює лише тип номера. Рекомендовано.</span></div>
  </div>
 </div>`;
}
function sectionPayments(){
 const total=5000;
 const required=settings.paymentRule==='none'?0:settings.paymentRule==='fixed'?settings.fixedDeposit:settings.paymentRule==='percent'?Math.round(total*settings.percentDeposit/100):total;
 return `<div class="settings-card" id="payments">
  <h2>Правила оплати</h2><p class="card-sub">Визначте, що гість повинен оплатити під час прямого бронювання.</p>
  <div class="option-cards">
   <div class="opt-card ${settings.paymentRule==='none'?'selected':''}" data-pick="paymentRule" data-val="none"><b>Оплата не потрібна</b><span>Повна оплата при заселенні.</span></div>
   <div class="opt-card ${settings.paymentRule==='fixed'?'selected':''}" data-pick="paymentRule" data-val="fixed"><b>Фіксована передоплата</b><span>Наприклад, 1 500 ₴.</span>${settings.paymentRule==='fixed'?`<input type="number" data-bind="fixedDeposit" value="${settings.fixedDeposit}">`:''}</div>
   <div class="opt-card ${settings.paymentRule==='percent'?'selected':''}" data-pick="paymentRule" data-val="percent"><b>Передоплата у відсотках</b><span>Наприклад, 30%.</span>${settings.paymentRule==='percent'?`<input type="number" min="0" max="100" data-bind="percentDeposit" value="${settings.percentDeposit}">`:''}</div>
   <div class="opt-card ${settings.paymentRule==='full'?'selected':''}" data-pick="paymentRule" data-val="full"><b>Повна оплата</b><span>100% під час бронювання.</span></div>
  </div>
  <div class="preview-box">Бронювання: <b>${money(total)}</b> · Потрібно зараз: <b>${money(required)}</b> · Залишок: <b>${money(total-required)}</b></div>
 </div>
 <div class="settings-card">
  <h2>Способи оплати</h2>
  ${toggleRow('methodCash','Готівка')}
  ${toggleRow('methodBank','Банківський переказ')}
  ${toggleRow('methodCard','Карта на місці')}
  <div class="subhead">Онлайн-оплата</div>
  <div class="toggle-row" style="border-top:0"><div><b>Провайдер</b><span>${settings.onlineProvider?'Підключено · '+settings.onlineProvider:'monobank, LiqPay, WayForPay'}</span></div><button class="button secondary" id="btn-connect-online">${settings.onlineProvider?'Керувати':'Підключити онлайн-оплату'}</button></div>
  <div class="toggle-row"><div><b>Фіскальний чек (ПРРО)</b><span>Автоматичний чек через Checkbox після кожної оплати</span></div><span class="pill">у розробці</span></div>
  ${settings.methodBank?`<div class="subhead">Банківські реквізити</div>${field('',`<textarea data-bind="bankDetails" placeholder="IBAN, отримувач, банк...">${esc(settings.bankDetails)}</textarea>`,'показується гостю лише якщо обрано банківський переказ','full')}`:''}
 </div>`;
}
function sectionRules(){
 return `<div class="settings-card" id="policies">
  <h2>Політика скасування</h2>
  <div class="option-cards">
   <div class="opt-card ${settings.cancellationType==='flexible'?'selected':''}" data-pick="cancellationType" data-val="flexible"><b>Гнучка</b><span>Безкоштовне скасування до X годин до заїзду.</span>${settings.cancellationType==='flexible'?`<input type="number" data-bind="cancellationHours" value="${settings.cancellationHours}">`:''}</div>
   <div class="opt-card ${settings.cancellationType==='nonrefundable'?'selected':''}" data-pick="cancellationType" data-val="nonrefundable"><b>Передоплата не повертається</b></div>
   <div class="opt-card ${settings.cancellationType==='custom'?'selected':''}" data-pick="cancellationType" data-val="custom"><b>Власне правило</b>${settings.cancellationType==='custom'?`<textarea data-bind="cancellationCustom" style="margin-top:8px">${esc(settings.cancellationCustom)}</textarea>`:''}</div>
  </div>
  <div class="subhead">Як це бачить гість</div>
  <div class="preview-box">${settings.cancellationType==='flexible'?`Безкоштовне скасування доступне до ${settings.cancellationHours} годин до заїзду. Після цього передоплата не повертається.`:settings.cancellationType==='nonrefundable'?'Передоплата не повертається у разі скасування.':(settings.cancellationCustom||'Правило ще не вказано.')}</div>
 </div>
 <div class="settings-card">
  <h2>Правила проживання</h2>
  <div class="field-grid">
   ${field('Куріння',`<select data-bind="smoking"><option ${settings.smoking==='Заборонено'?'selected':''}>Заборонено</option><option ${settings.smoking==='Дозволено у визначених місцях'?'selected':''}>Дозволено у визначених місцях</option></select>`)}
   ${field('Домашні тварини',`<select data-bind="pets"><option ${settings.pets==='Не дозволені'?'selected':''}>Не дозволені</option><option ${settings.pets==='Дозволені'?'selected':''}>Дозволені</option><option ${settings.pets==='За попереднім погодженням'?'selected':''}>За попереднім погодженням</option></select>`)}
   ${field('Тиша з',`<input type="time" data-bind="quietFrom" value="${settings.quietFrom}">`)}
   ${field('Тиша до',`<input type="time" data-bind="quietTo" value="${settings.quietTo}">`)}
   ${field('Діти',`<input data-bind="children" value="${esc(settings.children)}">`,'','full')}
   ${field('Додаткові гості',`<input data-bind="extraGuests" value="${esc(settings.extraGuests)}">`,'','full')}
  </div>
  <div class="subhead">Додаткові правила</div>
  ${field('',`<textarea data-bind="customRules">${esc(settings.customRules)}</textarea>`,'з’являється на Booking Page, Booking Confirmation та в умовах','full')}
 </div>`;
}
function sectionBookingPage(){
 return `<div class="settings-card" id="booking-page">
  <h2>Сторінка прямого бронювання <span class="pill ${settings.bookingPageActive?'ready':''}" style="margin-left:8px">${settings.bookingPageActive?'Активна':'Вимкнена'}</span></h2>
  ${toggleRow('bookingPageActive','Booking Page')}
  <div class="subhead">Посилання для бронювання</div>
  <div class="link-row"><code>hotelos.app/${esc(settings.slug)}</code><button class="text-action" id="btn-copy-link">Копіювати</button><a class="text-action" href="/book/" target="_blank">Відкрити</a></div>
  <div class="field" style="margin-top:12px"><label>Slug</label><div class="slug-field"><span>hotelos.app/</span><input id="slug-input" value="${esc(settings.slug)}"></div><small class="help">Зміна посилання може призвести до того, що старе посилання перестане працювати.</small></div>
 </div>
 <div class="settings-card">
  <h2>Вміст сторінки</h2>
  <div class="field-grid">
   ${field('Заголовок',`<input data-bind="bpTitle" value="${esc(settings.bpTitle)}">`,'','full')}
   ${field('Короткий опис',`<textarea data-bind="bpDesc">${esc(settings.bpDesc)}</textarea>`,'','full')}
  </div>
  <div class="subhead">Що показувати</div>
  ${toggleRow('bpShowDescription','Опис готелю')}${toggleRow('bpShowAmenities','Зручності')}${toggleRow('bpShowPhotos','Фото номерів')}${toggleRow('bpShowLocation','Розташування')}${toggleRow('bpShowCancellation','Правила скасування')}${toggleRow('bpShowPhone','Телефон')}${toggleRow('bpShowEmail','Email')}${toggleRow('bpShowInstagram','Instagram')}
  <a class="button secondary" href="/book/" target="_blank" style="margin-top:16px">Переглянути Booking Page</a>
 </div>`;
}
function sectionMessages(){
 return `<div class="settings-card" id="messaging">
  <h2>Комунікація з гостями</h2>
  <div class="field-grid">
   ${field('Відправник Email',`<input data-bind="emailSenderName" value="${esc(settings.emailSenderName)}">`)}
   ${field('Reply-to',`<input data-bind="replyTo" value="${esc(settings.replyTo)}">`)}
   ${field('SMS відправник',`<input value="Не налаштовано" disabled>`,'залежить від провайдера')}
   ${field('Основний канал',`<select data-bind="defaultChannel"><option value="email" ${settings.defaultChannel==='email'?'selected':''}>Email, а якщо немає — SMS</option><option value="sms" ${settings.defaultChannel==='sms'?'selected':''}>SMS</option></select>`)}
  </div>
 </div>
 <div class="settings-card">
  <h2>Тихі години для повідомлень</h2>
  ${toggleRow('quietHoursOn','Не надсилати автоматичні повідомлення вночі')}
  ${settings.quietHoursOn?`<div class="field-grid" style="margin-top:12px">${field('Від',`<input type="time" data-bind="quietHoursFrom" value="${settings.quietHoursFrom}">`)}${field('До',`<input type="time" data-bind="quietHoursTo" value="${settings.quietHoursTo}">`)}</div><p class="card-sub" style="margin-top:10px">Автоматизації, заплановані в цей період, надсилаються одразу після його завершення.</p>`:''}
 </div>`;
}
function sectionAutomations(){
 return `<div class="settings-card" id="automations">
  <h2>Автоматизації</h2>
  <p class="card-sub">6 активних · підтвердження, перед заїздом, час прибуття, оплата, check-out, після проживання.</p>
  <a class="button secondary" href="/automations/">Керувати автоматизаціями →</a>
 </div>`;
}
function sectionNotifications(){
 return `<div class="settings-card" id="notifications">
  <h2>Сповіщення</h2>
  ${toggleRow('notifyNewBooking','Нове бронювання')}
  ${toggleRow('notifyCancellation','Скасування')}
  ${toggleRow('notifyPayment','Оплата')}
  ${toggleRow('notifyMessage','Нове повідомлення гостя')}
  ${toggleRow('notifyRoomNotReady','Номер не готовий перед заїздом')}
  ${toggleRow('notifyHousekeeping','Housekeeping issue')}
  ${toggleRow('notifyAutomationError','Помилка автоматизації')}
  <div class="subhead">Канал сповіщень (для вас)</div>
  ${field('',`<select data-bind="notifyChannel"><option value="inapp" ${settings.notifyChannel==='inapp'?'selected':''}>In-app</option><option value="email" ${settings.notifyChannel==='email'?'selected':''}>Email</option></select>`,'','full')}
 </div>`;
}
function sectionSources(){
 return `<div class="settings-card" id="sources">
  <h2>Джерела бронювань</h2>
  <div id="sources-list">${sources.map((s,i)=>`<div class="source-row"><span>${esc(s.name)}</span><span class="switch ${s.active?'on':''}" data-toggle-source="${i}"></span></div>`).join('')}</div>
  <button class="button secondary" id="btn-add-source" style="margin-top:16px">+ Додати джерело</button>
 </div>`;
}
function sectionAi(){
 return `<div class="settings-card" id="ai">
  <h2>Hotel AI</h2><p class="card-sub">Визначте, як AI-помічник може працювати з даними готелю.</p>
  ${toggleRow('aiEnabled','Увімкнути AI-помічника')}
  <div class="subhead">Можливості AI</div>
  ${toggleRow('aiBookings','Відповіді про бронювання',null,!settings.aiEnabled)}
  ${toggleRow('aiGuests','Відповіді про гостей',null,!settings.aiEnabled)}
  ${toggleRow('aiFinance','Фінансова інформація',null,!settings.aiEnabled)}
  ${toggleRow('aiSales','Sales insights',null,!settings.aiEnabled)}
  ${toggleRow('aiMessages','Допомога з повідомленнями',null,!settings.aiEnabled)}
  <div class="ai-limits">AI може: підготувати повідомлення, відкрити потрібний запис, заповнити форму, запропонувати дію.<br><br>AI <span class="cannot">не може</span> без підтвердження: скасовувати бронювання, повертати гроші, видаляти дані, надсилати повідомлення, змінювати фінансові записи.</div>
 </div>
 <div class="settings-card" id="ai-knowledge">
  <h2>База знань AI</h2><p class="card-sub">Завантажте документи готелю — AI відповідатиме гостям правилами саме вашого об’єкта, без вигаданих фактів.</p>
  <div class="kb-upload" id="kb-upload">
   <div class="kb-drop"><span data-icon="spark"></span><b>Перетягніть PDF або оберіть файл</b><span>Правила проживання, прайс, FAQ · до 20 МБ</span><input type="file" id="kb-file" accept="application/pdf" class="sr-only"><label class="button secondary" for="kb-file">Обрати файл</label></div>
   <div class="kb-files" id="kb-files">
    <div class="kb-file"><span data-icon="spark"></span><div><b>Правила_проживання_2026.pdf</b><small>Оновлено 3 вересня · 240 КБ</small></div><span class="pill ready">Індексовано</span></div>
    <div class="kb-file"><span data-icon="spark"></span><div><b>Прайс_номерів.pdf</b><small>Оновлено 12 вересня · 96 КБ</small></div><span class="pill ready">Індексовано</span></div>
   </div>
  </div>
 </div>`;
}
function sectionSecurity(){
 return `<div class="settings-card" id="security">
  <h2>Нумерація бронювань</h2>
  <div class="field-grid">
   ${field('Префікс',`<input data-bind="prefix" value="${esc(settings.prefix)}">`,'необов’язково')}
   ${field('Наступний номер',`<input value="${esc(settings.prefix)}${settings.nextNumber}" disabled>`)}
  </div>
 </div>
 <div class="settings-card">
  <h2>Дані компанії</h2>
  ${settings.legalOpen?`<div class="field-grid">${field('Назва компанії / ФОП',`<input data-bind="legalName" value="${esc(settings.legalName)}">`)}${field('ЄДРПОУ / ІПН',`<input data-bind="legalId" value="${esc(settings.legalId)}">`)}${field('Юридична адреса',`<input data-bind="legalAddress" value="${esc(settings.legalAddress)}">`,'','full')}</div>`:`<button class="button secondary" id="btn-add-legal">Додати юридичні дані</button>`}
 </div>
 <div class="settings-card">
  <h2>Дані готелю</h2><p class="card-sub">Доступно лише Owner.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="button secondary" id="export-guests">Експортувати гостей</button><button class="button secondary" id="export-bookings">Експортувати бронювання</button><button class="button secondary" id="export-payments">Експортувати оплати</button></div>
 </div>
 <div class="settings-card">
  <h2>Історія змін</h2>
  ${history.map(h=>`<div class="history-item"><b>${h.date}</b><p>${esc(h.by)} ${esc(h.text)}</p></div>`).join('')}
 </div>
 <div class="settings-card danger-zone">
  <h2>Небезпечна зона</h2>
  <div class="danger-row"><div><b>Деактивувати Booking Page</b><span>Публічне бронювання стане недоступним. CRM та дані не видаляються.</span></div><button class="button secondary destructive" id="btn-deactivate-bp">Деактивувати</button></div>
  <div class="danger-row"><div><b>Деактивувати готель</b><span>Доступно лише Owner.</span></div><button class="button secondary destructive" id="btn-deactivate-hotel">Деактивувати</button></div>
 </div>`;
}
const RENDERERS={general:sectionGeneral,contacts:sectionContacts,stay:sectionStay,booking:sectionBooking,payments:sectionPayments,rules:sectionRules,bookingpage:sectionBookingPage,messages:sectionMessages,automations:sectionAutomations,notifications:sectionNotifications,sources:sectionSources,ai:sectionAi,security:sectionSecurity};

function renderContent(){
 const locked=isLocked(state.section);
 $('#settings-content').innerHTML=(locked?`<div class="readonly-note">${isReadonly()?'У вашої ролі немає доступу до редагування цього розділу.':'Цей розділ доступний лише для Owner.'}</div>`:'')+RENDERERS[state.section]();
 $$('#settings-content input,#settings-content select,#settings-content textarea,#settings-content button').forEach(el=>{if(locked&&!['A'].includes(el.tagName))el.disabled=true});
 hydrate($('#settings-content'));
}
function renderAll(){renderOnboard();renderNav();renderContent();renderSaveStatus()}

/* dialogs */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function unsavedModal(nextSection){
 state.pendingSection=nextSection;
 show('Є незбережені зміни',`<div class="dialog-actions"><button class="button primary" id="uc-save">Зберегти</button><button class="button secondary destructive" id="uc-discard">Вийти без збереження</button><button class="button secondary" id="uc-stay" data-close>Залишитися</button></div>`);
}
function addSourceModal(){
 show('Нове джерело',`<form class="demo-form" id="add-source-form"><label class="full">Назва<input name="name" required placeholder="Туристична агенція"></label><button class="button primary full" type="submit">Додати</button></form>`);
}

function goToSection(id){state.section=id;renderNav();renderContent();window.scrollTo({top:0,behavior:'smooth'})}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
 if(el.matches('[data-close]')){closeDialog();return}

 if(el.dataset.section){
  if(state.dirty){unsavedModal(el.dataset.section);return}
  goToSection(el.dataset.section);return;
 }
 if(el.id==='uc-save'){state.dirty=false;renderSaveStatus();closeDialog();toast('Зміни збережено');goToSection(state.pendingSection);return}
 if(el.id==='uc-discard'){state.dirty=false;renderSaveStatus();closeDialog();goToSection(state.pendingSection);return}

 if(el.id==='btn-save'){state.dirty=false;renderSaveStatus();toast('Зміни збережено');return}
 if(el.dataset.toggle){
  if(isLocked(state.section))return;
  const key=el.dataset.toggle;settings[key]=!settings[key];
  markDirty();renderContent();return;
 }
 if(el.dataset.pick){
  if(isLocked(state.section))return;
  settings[el.dataset.pick]=el.dataset.val;markDirty();renderContent();return;
 }
 if(el.dataset.toggleSource!==undefined){const i=Number(el.dataset.toggleSource);sources[i].active=!sources[i].active;markDirty();renderContent();return}
 if(el.id==='btn-add-source'){addSourceModal();return}
 if(el.id==='btn-add-legal'){settings.legalOpen=true;markDirty();renderContent();return}
 if(el.id==='btn-copy-link'){navigator.clipboard?.writeText('https://hotelos.app/'+settings.slug).catch(()=>{});toast('Посилання скопійовано');return}
 if(el.id==='btn-check-map'){toast('Перевірка на карті ще у розробці в демо');return}
 if(el.id==='btn-connect-online'){toast('Підключення онлайн-оплати ще у розробці в демо');return}
 if(el.id==='btn-upload-logo'||el.id==='btn-upload-cover'||el.id==='btn-remove-logo'){toast('Завантаження файлів ще у розробці в демо');return}
 if(el.id==='export-guests'||el.id==='export-bookings'||el.id==='export-payments'){toast('Експорт CSV · Демо');return}
 if(el.id==='btn-deactivate-bp'){show('Деактивувати Booking Page?','<p>Публічне бронювання стане недоступним. Дані CRM залишаться без змін.</p><div class="dialog-actions"><button class="button primary destructive" id="confirm-deactivate-bp">Деактивувати</button><button class="button secondary" data-close>Скасувати</button></div>');return}
 if(el.id==='confirm-deactivate-bp'){settings.bookingPageActive=false;closeDialog();markDirty();if(state.section==='bookingpage')renderContent();toast('Booking Page деактивовано');return}
 if(el.id==='btn-deactivate-hotel'){show('Деактивувати готель?','<p>Ця дія доступна лише Owner і вимагає підтвердження з підтримкою Hotel OS.</p><div class="dialog-actions"><button class="button secondary" data-close>Зрозуміло</button></div>');return}
});
document.addEventListener('input',e=>{
 const key=e.target.dataset.bind;
 if(key){settings[key]=e.target.value;markDirty()}
 if(e.target.id==='slug-input'){settings.slug=e.target.value;markDirty();$$('.link-row code').forEach(c=>c.textContent='hotelos.app/'+settings.slug)}
});
document.addEventListener('change',e=>{
 if(e.target.dataset.bind&&e.target.tagName==='SELECT'){settings[e.target.dataset.bind]=e.target.value;markDirty();renderContent()}
 if(e.target.id==='role-select'){state.role=e.target.value;HotelRole.set(e.target.value);renderNav();renderContent();toast('Роль (демо): '+e.target.value)}
 if(e.target.id==='kb-file'){
  const f=e.target.files[0];if(!f)return;
  const row=document.createElement('div');row.className='kb-file';
  row.innerHTML=`<span data-icon="spark"></span><div><b>${esc(f.name)}</b><small>Індексується…</small></div><span class="pill gold">Обробка</span>`;
  $('#kb-files').prepend(row);hydrate(row);
  setTimeout(()=>{row.querySelector('small').textContent='Щойно завантажено';row.querySelector('.pill').className='pill ready';row.querySelector('.pill').textContent='Індексовано';toast('AI проіндексував '+f.name)},1200);
  e.target.value='';
 }
 if(e.target.id==='mobile-nav-select'){
  if(state.dirty){unsavedModal(e.target.value);return}
  goToSection(e.target.value);
 }
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-source-form'){sources.push({name:String(data.get('name')),active:true});closeDialog();markDirty();renderContent();toast('Джерело додано')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');document.documentElement.classList.remove('no-scroll')}});
window.addEventListener('beforeunload',e=>{if(state.dirty){e.preventDefault();e.returnValue=''}});

const HASH_TO_SECTION={general:'general',appearance:'general',contacts:'contacts','checkin-checkout':'stay','booking-rules':'booking',payments:'payments',policies:'rules','booking-page':'bookingpage',messaging:'messages',automations:'automations',notifications:'notifications',sources:'sources',ai:'ai','ai-knowledge':'ai',security:'security'};
(function initFromHash(){
 const hashId=(location.hash||'').slice(1);
 if(HASH_TO_SECTION[hashId])state.section=HASH_TO_SECTION[hashId];
})();
renderAll();
hydrate();
