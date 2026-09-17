'use strict';
const paths={eye:'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',eyeOff:'M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.1A11 11 0 0 1 12 5c7 0 11 7 11 7a13.3 13.3 0 0 1-3.1 3.8M6.1 6.5A13.6 13.6 0 0 0 1 12s4 7 11 7a10.9 10.9 0 0 0 4-.75',check:'M5 12l4 4L19 6'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const INVITE={hotel:'Grand Hotel',inviter:'Олександр Гончар',role:'reception',email:'iryna@example.com',first:'Ірина',last:'Петренко'};
const ROLE_LABEL={owner:'Власник',manager:'Менеджер',reception:'Рецепція',housekeeping:'Прибирання'};
const ROLE_CAPS={
 reception:{can:['працювати з календарем','створювати бронювання','заселяти та виселяти гостей','працювати з CRM гостей','додавати оплати','відповідати на повідомлення'],cannot:['налаштування готелю','управління командою','критичні фінансові налаштування'],cta:'Почати роботу',href:'/dashboard/'},
 manager:{can:['Dashboard','Calendar','Бронювання','Гості','Оплати','Прибирання','Повідомлення','Продажі'],cannot:['критичні налаштування безпеки','деактивація готелю'],cta:'Відкрити Dashboard',href:'/dashboard/'},
 housekeeping:{can:['бачити призначені номери','починати прибирання','відмічати номер готовим','повідомляти про проблеми'],cannot:['гостьові дані та оплати','фінансову інформацію','налаштування готелю'],cta:'Відкрити мої задачі',href:'/housekeeping/'},
 owner:{can:['повний доступ до Hotel OS','управління готелем та командою','фінансові та критичні налаштування'],cannot:[],cta:'Відкрити Dashboard',href:'/dashboard/'}
};

const state={pwVisible:false,busy:false};

function passwordChecks(pw){return{len:pw.length>=8,letter:/[a-zA-Z]/.test(pw),digit:/[0-9]/.test(pw)}}
function passwordStrength(pw){const c=passwordChecks(pw);const score=[c.len,c.letter,c.digit,pw.length>=12].filter(Boolean).length;return score<=2?'weak':score===3?'normal':'strong'}

/* ---------- screens ---------- */
function screenLogin(prefillEmail){
 return `<h1>Вхід до Hotel OS</h1><p class="sub">Увійдіть, щоб продовжити роботу з вашим готелем.</p>
 <form id="login-form">
  <div class="field"><label>Email</label><input type="email" id="login-email" placeholder="name@example.com" value="${esc(prefillEmail||'')}"><div class="field-error" id="err-login-email">Введіть правильну email-адресу.</div></div>
  <div class="field"><label>Пароль</label><div class="pw-wrap"><input type="password" id="login-password" placeholder="Ваш пароль"><button type="button" class="pw-toggle" data-pw-toggle="login-password" data-icon="eye"></button></div><div class="field-error" id="err-login-password">Введіть пароль.</div></div>
  <label class="check-row"><input type="checkbox" id="remember-me">Запам’ятати мене</label>
  <div id="login-error" class="notice" style="display:none"></div>
  <button class="btn primary" type="submit" id="login-submit">Увійти</button>
 </form>
 <div class="link-row"><button type="button" data-goto="forgot">Забули пароль?</button></div>
 <p class="bottom-note">Ще не використовуєте Hotel OS? <a href="/#pricing">Спробувати безкоштовно</a></p>`;
}
function screenForgot(){
 return `<h1>Відновлення пароля</h1><p class="sub">Введіть email, який використовується для входу в Hotel OS.</p>
 <form id="forgot-form">
  <div class="field"><label>Email</label><input type="email" id="forgot-email" placeholder="name@example.com"></div>
  <button class="btn primary" type="submit">Надіслати посилання</button>
 </form>
 <div class="link-row"><button type="button" data-goto="login">Повернутися до входу</button></div>`;
}
function screenCheckEmail(){
 return `<div class="status-icon" data-icon="check"></div><h1>Перевірте пошту</h1><p class="sub">Якщо акаунт з такою email-адресою існує, ми надіслали посилання для відновлення пароля.<br>Посилання діє обмежений час.</p>
 <button class="btn secondary" type="button" data-goto="login">Повернутися до входу</button>
 <p class="link-row"><button type="button" data-goto="newPassword">Демо: перейти за посиланням із листа →</button></p>`;
}
function screenNewPassword(){
 return `<h1>Створіть новий пароль</h1><p class="sub">Використайте новий пароль для входу в Hotel OS.</p>
 <form id="new-password-form">
  <div class="field"><label>Новий пароль</label><div class="pw-wrap"><input type="password" id="np-1"><button type="button" class="pw-toggle" data-pw-toggle="np-1" data-icon="eye"></button></div></div>
  <div class="strength" id="pw-strength-bar"><span></span></div>
  <div class="pw-reqs" id="pw-reqs"><span data-req="len">Мінімум 8 символів</span><span data-req="letter">Літера</span><span data-req="digit">Цифра</span></div>
  <div class="field"><label>Повторіть пароль</label><input type="password" id="np-2"><div class="field-error" id="err-np-match">Паролі не збігаються.</div></div>
  <button class="btn primary" type="submit">Зберегти пароль</button>
 </form>`;
}
function screenResetSuccess(){
 return `<div class="status-icon" data-icon="check"></div><h1>Пароль змінено</h1><p class="sub">Тепер ви можете увійти з новим паролем.</p><button class="btn primary" type="button" data-goto="login">Увійти</button>`;
}
function screenResetExpired(){
 return `<div class="status-icon danger">✕</div><h1>Посилання більше не діє</h1><p class="sub">Посилання для відновлення пароля прострочене або вже було використане.</p><button class="btn primary" type="button" data-goto="forgot">Надіслати нове посилання</button><div class="link-row"><button type="button" data-goto="login">Повернутися до входу</button></div>`;
}
function inviteCard(){
 return `<div class="invite-card"><div class="ic-row"><span>Готель</span><b>${INVITE.hotel}</b></div><div class="ic-row"><span>Роль</span><b>${ROLE_LABEL[INVITE.role]}</b></div><div class="ic-row"><span>Email</span><b>${esc(INVITE.email)}</b></div></div>`;
}
function screenInvitation(){
 return `<h1>Вас запросили до ${INVITE.hotel}</h1><p class="sub">${INVITE.inviter} запросив(ла) вас приєднатися до команди Hotel OS.</p>
 ${inviteCard()}
 <button class="btn primary" type="button" data-goto="createAccount">Продовжити</button>
 <div class="link-row"><button type="button" data-goto="invitationCancelled">Відхилити запрошення</button></div>`;
}
function screenInvitationExpired(){
 return `<div class="status-icon danger">✕</div><h1>Запрошення більше не діє</h1><p class="sub">Попросіть власника або менеджера надіслати нове запрошення.</p><button class="btn primary" type="button" data-goto="login">Перейти до входу</button>`;
}
function screenInvitationUsed(){
 return `<div class="status-icon gold">i</div><h1>Запрошення вже використано</h1><p class="sub">Цей доступ уже активований.</p><button class="btn primary" type="button" data-goto="login">Увійти</button>`;
}
function screenInvitationCancelled(){
 return `<div class="status-icon danger">✕</div><h1>Запрошення скасовано</h1><p class="sub">Доступ до цього готелю більше не активний.<br>Зверніться до адміністратора ${INVITE.hotel}.</p><button class="btn secondary" type="button" data-goto="login">Повернутися до входу</button>`;
}
function screenCreateAccount(){
 return `<h1>Створіть доступ</h1><p class="sub">Створіть пароль для входу в Hotel OS.</p>
 <form id="create-account-form">
  <div class="field"><label>Ім’я</label><input id="ca-first" value="${esc(INVITE.first)}"></div>
  <div class="field"><label>Прізвище</label><input id="ca-last" value="${esc(INVITE.last)}"></div>
  <div class="field"><label>Email</label><input value="${esc(INVITE.email)}" disabled></div>
  <div class="field"><label>Пароль</label><div class="pw-wrap"><input type="password" id="ca-pw1"><button type="button" class="pw-toggle" data-pw-toggle="ca-pw1" data-icon="eye"></button></div></div>
  <div class="pw-reqs" id="ca-pw-reqs"><span data-req="len">Мінімум 8 символів</span><span data-req="letter">Літера</span><span data-req="digit">Цифра</span></div>
  <div class="field"><label>Повторіть пароль</label><input type="password" id="ca-pw2"></div>
  <label class="check-row"><input type="checkbox" id="ca-terms">Я погоджуюся з умовами використання та політикою конфіденційності</label>
  <button class="btn primary" type="submit">Створити акаунт</button>
 </form>`;
}
function screenAccountCreated(){
 return `<div class="status-icon" data-icon="check"></div><h1>Готово</h1><p class="sub">Ваш доступ до ${INVITE.hotel} активовано.</p><span class="role-badge">${ROLE_LABEL[INVITE.role]}</span><button class="btn primary" type="button" data-goto="welcome">Відкрити Hotel OS</button>`;
}
function screenWelcome(role){
 const r=ROLE_CAPS[role];
 const name=role===INVITE.role?INVITE.first:'Олександре';
 return `<h1>Вітаємо в Hotel OS${role===INVITE.role?', '+name:''}</h1><p class="sub">Ви приєдналися до команди ${INVITE.hotel}.</p><span class="role-badge">${ROLE_LABEL[role]}</span>
 <p style="font-size:12.5px;font-weight:700;color:#3a3a3c;margin-bottom:6px">Ви можете:</p>
 <div class="capability-list">${r.can.map(c=>`<div class="can">${esc(c)}</div>`).join('')}${r.cannot.length?`<p style="font-size:11px;color:#9b9ca2;margin:10px 0 2px">Недоступно:</p>`+r.cannot.map(c=>`<div class="cannot">${esc(c)}</div>`).join(''):''}</div>
 <button class="btn primary" type="button" id="welcome-cta" data-href="${r.href}">${r.cta}</button>`;
}
function screenJoinConfirm(){
 return `<h1>Приєднатися до ${INVITE.hotel}?</h1><p class="sub">У вас уже є акаунт Hotel OS. Підтвердіть приєднання до нового готелю.</p>${inviteCard()}<button class="btn primary" type="button" data-goto="welcome">Приєднатися</button><div class="link-row"><button type="button" data-goto="login">Скасувати</button></div>`;
}
function screenHotelSwitcher(){
 return `<h1>Оберіть готель</h1><p class="sub">Ваш акаунт має доступ до кількох готелів.</p>
 <div class="hotel-pick" data-select-hotel="/dashboard/"><div><b>Grand Hotel</b><span>Роль: Менеджер</span></div><span>→</span></div>
 <div class="hotel-pick" data-select-hotel="/dashboard/"><div><b>Old Town Hotel</b><span>Роль: Власник</span></div><span>→</span></div>
 <button class="add-hotel" style="width:100%" id="btn-add-hotel">+ Додати готель</button>`;
}
function screenSessionExpired(){
 return `<h1>Сесію завершено</h1><p class="sub">Для безпеки увійдіть ще раз.</p>${screenLoginFormOnly('oleksandr@example.com')}`;
}
function screenLoginFormOnly(prefill){
 return `<form id="login-form">
  <div class="field"><label>Email</label><input type="email" id="login-email" value="${esc(prefill||'')}"><div class="field-error" id="err-login-email">Введіть правильну email-адресу.</div></div>
  <div class="field"><label>Пароль</label><div class="pw-wrap"><input type="password" id="login-password" placeholder="Ваш пароль"><button type="button" class="pw-toggle" data-pw-toggle="login-password" data-icon="eye"></button></div><div class="field-error" id="err-login-password">Введіть пароль.</div></div>
  <div id="login-error" class="notice" style="display:none"></div>
  <button class="btn primary" type="submit" id="login-submit">Увійти</button>
 </form>`;
}
function screenAccountDisabled(){
 return `<div class="status-icon danger">✕</div><h1>Доступ деактивовано</h1><p class="sub">Ваш доступ до ${INVITE.hotel} був вимкнений адміністратором.</p><button class="btn secondary" type="button" data-goto="login">Вийти</button>`;
}
function screenNoHotelAccess(){
 return `<h1>Немає активних готелів</h1><p class="sub">Ваш акаунт активний, але наразі ви не маєте доступу до жодного готелю.</p><a class="btn primary" href="/#pricing">Створити готель</a>`;
}
function screenRateLimit(){
 return `<div class="status-icon gold">!</div><h1>Забагато спроб входу</h1><p class="sub">Зачекайте трохи та спробуйте ще раз або відновіть пароль.</p><button class="btn primary" type="button" data-goto="forgot">Відновити пароль</button>`;
}
function screenGenericError(){
 return `<div class="status-icon danger">✕</div><h1>Щось пішло не так</h1><p class="sub">Не вдалося завершити операцію.</p><button class="btn primary" type="button" data-goto="login">Спробувати ще раз</button><div class="link-row"><button type="button" data-goto="login">Повернутися до входу</button></div>`;
}

const SCREENS={login:()=>screenLogin(),forgot:screenForgot,checkEmail:screenCheckEmail,newPassword:screenNewPassword,resetSuccess:screenResetSuccess,resetExpired:screenResetExpired,
 invitation:screenInvitation,invitationExpired:screenInvitationExpired,invitationUsed:screenInvitationUsed,invitationCancelled:screenInvitationCancelled,
 createAccount:screenCreateAccount,accountCreated:screenAccountCreated,welcome:()=>screenWelcome($('#demo-role').value),joinConfirm:screenJoinConfirm,hotelSwitcher:screenHotelSwitcher,
 sessionExpired:screenSessionExpired,accountDisabled:screenAccountDisabled,noHotelAccess:screenNoHotelAccess,rateLimit:screenRateLimit,genericError:screenGenericError};

function render(){
 const s=$('#demo-state').value;
 $('#auth-main').innerHTML=SCREENS[s]();
 hydrate($('#auth-main'));
 wirePasswordReqs();
}
function goto(name){$('#demo-state').value=name;render()}

function wirePasswordReqs(){
 const np=$('#np-1');
 if(np){
  np.addEventListener('input',()=>{
   const c=passwordChecks(np.value);
   $$('#pw-reqs span').forEach(el=>el.classList.toggle('ok',c[el.dataset.req]));
   const bar=$('#pw-strength-bar');bar.className='strength '+passwordStrength(np.value);
  });
 }
 const ca=$('#ca-pw1');
 if(ca){
  ca.addEventListener('input',()=>{
   const c=passwordChecks(ca.value);
   $$('#ca-pw-reqs span').forEach(el=>el.classList.toggle('ok',c[el.dataset.req]));
  });
 }
}

/* ---------- toast ---------- */
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a');
 if(!el)return;
 if(el.dataset.goto){goto(el.dataset.goto);return}
 if(el.dataset.pwToggle){
  const input=document.getElementById(el.dataset.pwToggle);
  const show=input.type==='password';
  input.type=show?'text':'password';
  el.dataset.icon=show?'eyeOff':'eye';el.innerHTML=icon(el.dataset.icon);
  return;
 }
 if(el.dataset.selectHotel){window.location.href=el.dataset.selectHotel;return}
 if(el.id==='btn-add-hotel'){toast('Створення нового готелю ще у розробці в демо');return}
 if(el.id==='welcome-cta'){window.location.href=el.dataset.href;return}
});

document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;
 if(f.id==='login-form'){
  const email=$('#login-email').value.trim(),password=$('#login-password').value;
  const emailErr=$('#err-login-email'),pwErr=$('#err-login-password'),loginErr=$('#login-error');
  emailErr.classList.remove('show');pwErr.classList.remove('show');loginErr.style.display='none';
  $('#login-email').classList.remove('invalid');$('#login-password').classList.remove('invalid');
  let bad=false;
  if(!/^\S+@\S+\.\S+$/.test(email)){emailErr.classList.add('show');$('#login-email').classList.add('invalid');bad=true}
  if(!password){pwErr.classList.add('show');$('#login-password').classList.add('invalid');bad=true}
  if(bad)return;
  if(email==='locked@example.com'){goto('rateLimit');return}
  const btn=$('#login-submit');btn.disabled=true;btn.textContent='Входимо...';
  setTimeout(()=>{
   btn.disabled=false;btn.textContent='Увійти';
   if(email==='fail@example.com'){loginErr.textContent='Не вдалося увійти. Email або пароль неправильні.';loginErr.style.display='block';return}
   window.location.href='/dashboard/';
  },700);
 }else if(f.id==='forgot-form'){
  goto('checkEmail');
 }else if(f.id==='new-password-form'){
  const p1=$('#np-1').value,p2=$('#np-2').value,c=passwordChecks(p1);
  const matchErr=$('#err-np-match');matchErr.classList.remove('show');
  if(!c.len||!c.letter||!c.digit){toast('Пароль не відповідає вимогам');return}
  if(p1!==p2){matchErr.classList.add('show');return}
  goto('resetSuccess');
 }else if(f.id==='create-account-form'){
  const p1=$('#ca-pw1').value,p2=$('#ca-pw2').value,c=passwordChecks(p1);
  if(!$('#ca-terms').checked){toast('Підтвердьте погодження з умовами використання');return}
  if(!c.len||!c.letter||!c.digit){toast('Пароль не відповідає вимогам');return}
  if(p1!==p2){toast('Паролі не збігаються');return}
  goto('accountCreated');
 }
});
document.addEventListener('change',e=>{if(e.target.id==='demo-state')render();if(e.target.id==='demo-role'&&$('#demo-state').value==='welcome')render()});

render();
