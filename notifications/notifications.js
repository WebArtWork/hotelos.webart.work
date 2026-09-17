'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',attention:'M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z',check:'M5 12l4 4L19 6'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

let notifications=[
 {id:1,kind:'warn',read:false,title:'Номер 204 ще не готовий',desc:'Заїзд о 13:30 · Відповідальна: Марія',time:'10 хв тому',href:'/housekeeping/',cta:'Відкрити прибирання'},
 {id:2,kind:'warn',read:false,title:'Не отримано оплату',desc:'Олег Бондар · Бронювання #1842 · Залишок 1 200 ₴',time:'32 хв тому',href:'/booking/',cta:'Відкрити бронювання'},
 {id:3,kind:'default',read:false,title:'Нове повідомлення від гостя',desc:'Ірина Шевченко запитує про ранній заїзд',time:'1 год тому',href:'/messages/',cta:'Відповісти'},
 {id:4,kind:'ok',read:true,title:'Оплату підтверджено',desc:'Бронювання #2004 · 4 800 ₴',time:'вчора',href:'/payments/',cta:'Деталі оплати'},
 {id:5,kind:'default',read:true,title:'Нове бронювання',desc:'Номер 101 · 19–21 вересня',time:'вчора',href:'/booking/',cta:'Відкрити бронювання'},
 {id:6,kind:'ok',read:true,title:'Прибирання завершено',desc:'Номер 305 готовий до заїзду',time:'2 дні тому',href:'/housekeeping/',cta:'Відкрити прибирання'},
];

let filter='all';
function render(){
 const items=notifications.filter(n=>filter==='all'||!n.read);
 const el=$('#list');
 if(!items.length){el.innerHTML='<div class="notif-empty">Немає непрочитаних сповіщень.</div>';return}
 el.innerHTML=items.map(n=>`<div class="notif-item ${n.read?'':'unread'} ${n.kind!=='default'?'n-'+n.kind:''}" data-id="${n.id}">
  <span class="n-icon" data-icon="${n.kind==='warn'?'attention':n.kind==='ok'?'check':'bell'}"></span>
  <div class="n-body"><b>${n.title}</b><p>${n.desc}</p><a href="${n.href}">${n.cta} →</a></div>
  <time>${n.time}</time>
 </div>`).join('');
 hydrate(el);
}

document.addEventListener('click',e=>{
 const tab=e.target.closest('[data-filter]');
 if(tab){filter=tab.dataset.filter;$$('.notif-tabs button').forEach(b=>b.classList.toggle('active',b===tab));render();return}
 if(e.target.closest('#btn-read-all')){notifications=notifications.map(n=>({...n,read:true}));render();return}
 const el=e.target.closest('button');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
});

hydrate();
render();
