'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',search:'M21 21 16 16M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

const INDEX=[
 {group:'Гості',icon:'guests',title:'Ірина Шевченко',sub:'+380 97 654 32 10 · 3 бронювання',href:'/guest/'},
 {group:'Гості',icon:'guests',title:'Олег Бондар',sub:'#1842 · Заборгованість 1 200 ₴',href:'/guest/'},
 {group:'Бронювання',icon:'booking',title:'Бронювання #1842',sub:'Олег Бондар · 17–20 вересня · Не оплачено',href:'/booking/'},
 {group:'Бронювання',icon:'booking',title:'Бронювання #2004',sub:'Ірина Шевченко · 18–20 вересня · Очікує',href:'/booking/'},
 {group:'Номери',icon:'hotel',title:'Номер 205',sub:'Стандарт · 2 гості · Зайнятий',href:'/rooms/'},
 {group:'Номери',icon:'hotel',title:'Номер 101',sub:'Стандарт · 2 гості · Вільний',href:'/rooms/'},
 {group:'Оплати',icon:'wallet',title:'Оплата #P-118',sub:'1 200 ₴ · Очікує підтвердження',href:'/payments/'},
];

function render(q){
 const el=$('#results');
 const query=q.trim().toLocaleLowerCase('uk-UA').replace('#','');
 if(!query){el.innerHTML='';return}
 const hits=INDEX.filter(i=>(i.title+' '+i.sub).toLocaleLowerCase('uk-UA').replace('#','').includes(query));
 if(!hits.length){el.innerHTML='<div class="search-empty"><h3>Нічого не знайдено</h3><p>Спробуйте інший запит — ім’я гостя, номер кімнати чи номер бронювання.</p></div>';return}
 const groups={};
 hits.forEach(h=>{(groups[h.group]=groups[h.group]||[]).push(h)});
 el.innerHTML=Object.entries(groups).map(([g,items])=>`<div class="search-group"><h3>${g}</h3>${items.map(i=>`<a class="search-result" href="${i.href}"><span class="r-icon" data-icon="${i.icon}"></span><span class="r-body"><b>${i.title}</b><span>${i.sub}</span></span></a>`).join('')}</div>`).join('');
 hydrate(el);
}

$('#q').addEventListener('input',e=>render(e.target.value));
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-q]');
 if(b){$('#q').value=b.dataset.q;render(b.dataset.q);$('#q').focus();return}
 const el=e.target.closest('button');
 if(el&&el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;document.documentElement.classList.toggle('no-scroll',opened);el.setAttribute('aria-expanded',String(opened));return}
 if(el&&el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;document.documentElement.classList.remove('no-scroll');return}
});

hydrate();
const params=new URLSearchParams(location.search);
if(params.get('q')){$('#q').value=params.get('q');render(params.get('q'))}
