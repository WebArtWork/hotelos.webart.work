'use strict';
const paths={overview:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',hotel:'M4 21V3h16v18M2 21h20M8 7h1m6 0h1M8 11h1m6 0h1M10 21v-5h4v5',calendar:'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18M8 15h1m6 0h1',booking:'M6 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2ZM8 8h8m-8 4h5',guests:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM17 3a4 4 0 0 1 0 8m5 10v-2a4 4 0 0 0-3-4',wallet:'M3 7V5a2 2 0 0 1 2-2h14v4M3 7h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7Zm14 5h4v5h-4v-5Z',clean:'M14 3 8 15m-2-2 9 5m-9-5-4 6 7 3 6-6M18 2v5m-2-2h4',message:'M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-1-4 8 8 0 0 1 8-8h2a8 8 0 0 1 8 7ZM8 10h8m-8 4h5',automation:'M13 2 4 14h7l-1 8 10-13h-7l1-7Z',chart:'M4 3v18h17M8 17v-4m5 4V7m5 10v-7',spark:'M12 3 14.5 9.5 21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM9 3h6l1 3 3 1 2 5-2 3-1 4-4 2-3-2-4-1-2-4 2-3 1-4 3-1Z',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10 21h4',menu:'M3 6h18M3 12h18M3 18h18',close:'M6 6l12 12M18 6 6 18'};
const icon=n=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[n]||paths.overview}"/></svg>`;
function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon))}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('uk-UA').format(n)+' ₴';

const sources=[
 {name:'Пряме бронювання',pct:34,count:29,revenue:142000,nights:84,repeat:8,avgStay:3.2,category:'Direct'},
 {name:'Booking.com',pct:28,count:24,revenue:121400,nights:68,repeat:3,avgStay:2.4,category:'OTA'},
 {name:'Instagram',pct:18,count:15,revenue:76200,nights:41,repeat:4,avgStay:3.1,category:'Social'},
 {name:'Google',pct:12,count:10,revenue:52400,nights:28,repeat:2,avgStay:2.9,category:'Social'},
 {name:'Телефон',pct:5,count:4,revenue:22600,nights:11,repeat:1,avgStay:2.8,category:'Offline'},
 {name:'Інше',pct:3,count:4,revenue:14000,nights:10,repeat:0,avgStay:2.5,category:'Other'}
];
const totalBookings=sources.reduce((s,x)=>s+x.count,0);
const totalRevenue=sources.reduce((s,x)=>s+x.revenue,0);
const directTrend=[['Квітень',21],['Травень',24],['Червень',26],['Липень',29],['Серпень',31],['Вересень',34]];
const returnSources=[['Пряме бронювання',44],['Телефон',22],['Instagram',17],['Google',11],['Інше',6]];
const campaigns=[{name:'Instagram Summer Story',count:8,revenue:34400},{name:'Google Business',count:12,revenue:48200}];
const defaultSourceConfig=[
 {name:'Пряме бронювання',category:'Direct',active:true},{name:'Сайт',category:'Direct',active:true},{name:'Instagram',category:'Social',active:true},
 {name:'Facebook',category:'Social',active:true},{name:'Google',category:'Social',active:true},{name:'Телефон',category:'Offline',active:true},
 {name:'Booking.com',category:'OTA',active:true},{name:'Walk-in',category:'Offline',active:true},{name:'Інше',category:'Other',active:true}
];
const sampleBookings={
 'Instagram':[{guest:'Анна Коваленко',dates:'17–20 вересня',room:'204 · Люкс',total:4800},{guest:'Олег Бондар',dates:'21–24 вересня',room:'205 · Люкс',total:5400}],
 'Пряме бронювання':[{guest:'Марія Петренко',dates:'20–23 вересня',room:'202 · Люкс',total:7200},{guest:'Наталія Коваль',dates:'18–21 вересня',room:'203 · Люкс',total:5200}],
 'Booking.com':[{guest:'Ірина Шевченко',dates:'19–22 вересня',room:'205 · Люкс',total:6400}],
 'Google':[{guest:'Тарас Гончар',dates:'22–23 вересня',room:'101 · Стандарт',total:2400}],
 'Телефон':[{guest:'Дмитро Левченко',dates:'17–20 вересня',room:'112 · Покращений',total:5800}],
 'Інше':[]
};

const state={compare:false,monthMetric:'bookings'};

function renderKpis(){
 $('#kpis').innerHTML=`
 <div class="kpi"><small>Бронювань</small><b>${totalBookings}</b><span>+12% до минулого місяця</span>${state.compare?'<span class="cmp">Минулий місяць: 78</span>':''}</div>
 <div class="kpi"><small>Дохід</small><b>${money(totalRevenue)}</b><span>фактично отримані платежі</span>${state.compare?'<span class="cmp">Минулий місяць: 391 200 ₴</span>':''}</div>
 <div class="kpi"><small>Середній чек</small><b>${money(Math.round(totalRevenue/totalBookings))}</b><span>&nbsp;</span>${state.compare?'<span class="cmp">Минулий місяць: 4 620 ₴</span>':''}</div>
 <div class="kpi gold"><small>Прямі бронювання</small><b>34%</b><span>29 бронювань</span>${state.compare?'<span class="cmp">Минулий місяць: 31%</span>':''}</div>`;
}
function renderSourceBars(){
 $('#source-bars').innerHTML=sources.map(s=>`<div class="source-bar-row" data-open-source="${esc(s.name)}"><div class="sbr-top"><span>${esc(s.name)}</span><b>${s.pct}%</b></div><div class="sbr-track"><span class="${s.category==='Direct'?'direct':''}" style="width:${s.pct}%"></span></div><div class="sbr-facts">${s.count} бронювань · ${money(s.revenue)}</div></div>`).join('');
}
function renderRevenueBars(){
 const max=Math.max(...sources.map(s=>s.revenue));
 $('#revenue-bars').innerHTML=sources.map(s=>`<div class="source-bar-row" data-open-source="${esc(s.name)}"><div class="sbr-top"><span>${esc(s.name)}</span><b>${money(s.revenue)}</b></div><div class="sbr-track"><span class="${s.category==='Direct'?'direct':''}" style="width:${s.revenue/max*100}%"></span></div></div>`).join('');
}
function renderSourceTable(){
 $('#source-tbody').innerHTML=sources.map(s=>`<tr data-open-source="${esc(s.name)}"><td class="name-cell">${esc(s.name)}</td><td><b>${s.count}</b></td><td>${s.nights} ночей</td><td><b>${money(s.revenue)}</b></td><td>${money(Math.round(s.revenue/s.count))}</td><td>${s.pct}%</td><td>${s.repeat} повторних</td></tr>`).join('');
}
function renderDirectCards(){
 const direct=sources.filter(s=>s.category==='Direct'||s.name==='Телефон');
 const directCount=sources.find(s=>s.name==='Пряме бронювання').count,directRev=sources.find(s=>s.name==='Пряме бронювання').revenue,directPct=sources.find(s=>s.name==='Пряме бронювання').pct;
 const otaCount=sources.find(s=>s.name==='Booking.com').count,otaRev=sources.find(s=>s.name==='Booking.com').revenue,otaPct=sources.find(s=>s.name==='Booking.com').pct;
 $('#direct-cards').innerHTML=`
 <div class="direct-card direct"><h3>Прямі</h3><b class="big">${directPct}%</b><div class="facts">${directCount} бронювань · ${money(directRev)}</div><ul><li>Сайт</li><li>Direct booking page</li><li>Телефон</li><li>Instagram</li><li>Google</li><li>Walk-in</li></ul></div>
 <div class="direct-card"><h3>Сторонні платформи</h3><b class="big">${otaPct}%</b><div class="facts">${otaCount} бронювання · ${money(otaRev)}</div><ul><li>Booking.com</li><li style="color:#c6c7c9">Airbnb (незабаром)</li><li style="color:#c6c7c9">Expedia (незабаром)</li></ul></div>`;
}
function renderDirectTrend(){
 const max=Math.max(...directTrend.map(d=>d[1]));
 $('#direct-trend').innerHTML=directTrend.map(([label,val],i)=>`<div class="tc-col"><b>${val}%</b><div class="tc-bar ${i===directTrend.length-1?'now':''}" style="height:${val/max*100}%"></div><span>${label.slice(0,3)}</span></div>`).join('');
 $('#direct-trend-sub').textContent='+13% за останні 6 місяців';
}
function renderMonthChart(){
 const bookingsSeed=[2,3,1,4,2,3,5,2,1,3,4,2,3,1,4,2,3,5,2,4,3,1,2,4,3,2,1,3,4,0];
 const revenueSeed=bookingsSeed.map(v=>v*Math.round(3500+Math.random()*2000));
 const data=state.monthMetric==='bookings'?bookingsSeed:revenueSeed;
 const max=Math.max(...data,1);
 $('#month-chart').innerHTML=data.map((v,i)=>`<span style="height:${Math.max(3,v/max*100)}%" title="${i+1} вересня"></span>`).join('');
}
function renderStayBreakdown(){
 $('#stay-breakdown').innerHTML=sources.slice(0,3).map(s=>`<div><span>${esc(s.name)}</span><b>${s.avgStay} ночі</b></div>`).join('');
}
function renderReturnSources(){
 $('#return-sources').innerHTML=returnSources.map(([name,pct])=>`<div class="return-source-row"><span>${esc(name)}</span><b>${pct}%</b></div>`).join('');
}
function renderCampaigns(){
 $('#campaign-cards').innerHTML=campaigns.map(c=>`<div class="campaign-card"><h4>${esc(c.name)}</h4><b>${c.count} бронювань</b><span>${money(c.revenue)}</span></div>`).join('');
}
function renderAll(){renderKpis();renderSourceBars();renderRevenueBars();renderSourceTable();renderDirectCards();renderDirectTrend();renderMonthChart();renderStayBreakdown();renderReturnSources();renderCampaigns();hydrate()}

/* dialogs & side panel */
const dialog=$('#details-dialog');let focusBefore=null,toastTimer;
function show(title,body){focusBefore=document.activeElement;$('#dialog-content').innerHTML=`<h2>${esc(title)}</h2>${body}`;hydrate(dialog);if(!dialog.open)dialog.showModal()}
function closeDialog(){dialog.close();if(focusBefore?.isConnected)focusBefore.focus()}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200)}

function openSourcePanel(name){
 const s=sources.find(s=>s.name===name);if(!s)return;
 const bookings=sampleBookings[name]||[];
 $('#side-body').innerHTML=`
 <h2 style="font-size:20px;margin:0 0 4px">${esc(s.name)}</h2>
 <p style="font-size:11px;color:#9b9ca2;margin:0 0 16px">1–30 вересня</p>
 <div class="info-grid"><dt>Бронювань</dt><dd>${s.count}</dd><dt>Дохід</dt><dd>${money(s.revenue)}</dd><dt>Середній чек</dt><dd>${money(Math.round(s.revenue/s.count))}</dd><dt>Ночей</dt><dd>${s.nights}</dd><dt>Повторних гостей</dt><dd>${s.repeat}</dd></div>
 <h5>Бронювання</h5>
 <div class="result-list">${bookings.length?bookings.map(b=>`<div class="result-item"><span><b>${esc(b.guest)}</b><small>${b.dates} · ${b.room}</small></span><span>${money(b.total)}</span></div>`).join(''):'<p class="form-note">Немає прикладів бронювань для показу.</p>'}</div>
 <button class="button secondary" style="width:100%;margin-top:14px" id="btn-view-all-source">Переглянути всі бронювання</button>
 `;
 hydrate($('#side-body'));
 $('#side-panel').classList.add('open');$('#side-scrim').hidden=false;
}
function closeSidePanel(){$('#side-panel').classList.remove('open');$('#side-scrim').hidden=true}

function manageSourcesModal(){
 show('Керувати джерелами',`<div id="source-manage-list">${defaultSourceConfig.map((s,i)=>`<div class="source-manage-row"><span>${esc(s.name)} <span class="pill">${s.category}</span></span><span class="switch ${s.active?'on':''}" data-toggle-source="${i}"></span></div>`).join('')}</div><button class="button secondary" style="width:100%;margin-top:16px" id="btn-add-source">+ Нове джерело</button>`);
}
function addSourceModal(){
 show('Нове джерело',`<form class="demo-form" id="add-source-form"><label class="full">Назва<input name="name" required placeholder="Туристична агенція"></label><label class="full">Категорія<select name="category"><option>Direct</option><option>OTA</option><option>Social</option><option>Partner</option><option>Offline</option><option>Other</option></select></label><button class="button primary full" type="submit">Додати</button></form>`);
}
function aiAnswer(key){
 const box=$('#ai-answer');
 const top=sources[0];
 const map={
  topSource:`<p>Найбільше бронювань дає <b>${esc(top.name)}</b> — ${top.count} бронювань (${top.pct}%).</p>`,
  instagram:(()=>{const ig=sources.find(s=>s.name==='Instagram');return `<p>Instagram приніс <b>${money(ig.revenue)}</b> з ${ig.count} бронювань.</p>`})(),
  directShare:`<p>Частка прямих бронювань цього місяця — <b>34%</b> (29 бронювань), що на 3 п.п. більше, ніж минулого місяця.</p>`,
  returning:`<p>Повторних гостей цього місяця — <b>18</b> (21% від усіх гостей).</p>`,
  growth:`<p>Найбільше зросли <b>Пряме бронювання</b> (+3 п.п.) та <b>Instagram</b>.</p>`
 };
 box.innerHTML=`<div class="ai-answer-box">${map[key]||'<p>AI використовує лише реальні sales, booking та payment дані.</p>'}<div class="dialog-actions" style="margin-top:0"><button class="button secondary" id="ai-view-bookings" style="margin-top:8px">Переглянути бронювання</button></div></div>`;
 hydrate(box);
}

document.addEventListener('click',e=>{
 const el=e.target.closest('button,a,tr');
 if(!el)return;
 if(el.matches('.mobile-menu')){const opened=$('#sidebar').classList.toggle('open');$('.nav-overlay').hidden=!opened;el.setAttribute('aria-expanded',String(opened));return}
 if(el.matches('.nav-overlay')){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;return}
 if(el.matches('[data-close]')){closeDialog();return}
 if(el.dataset.view){show('Розділ у розробці','<p>Цей розділ ще недоступний у демонстраційній версії.</p>');return}

 if(el.dataset.openSource){openSourcePanel(el.dataset.openSource);return}
 if(el.id==='btn-view-all-source'||el.id==='ai-view-bookings'||el.id==='btn-view-unknown'){toast('Список бронювань за фільтром ще у розробці в демо');return}
 if(el.id==='btn-export'){toast('Експорт CSV/XLSX · Демо');return}
 if(el.id==='compare-switch'){state.compare=!state.compare;el.classList.toggle('on',state.compare);el.setAttribute('aria-checked',String(state.compare));renderKpis();hydrate();return}
 if(el.dataset.metric){$$('.chart-toggle button').forEach(b=>b.classList.remove('active'));el.classList.add('active');state.monthMetric=el.dataset.metric;renderMonthChart();return}
 if(el.dataset.aiQ){aiAnswer(el.dataset.aiQ);return}
 if(el.id==='btn-manage-sources'){manageSourcesModal();return}
 if(el.id==='btn-add-source'){addSourceModal();return}
 if(el.dataset.toggleSource){const i=Number(el.dataset.toggleSource);defaultSourceConfig[i].active=!defaultSourceConfig[i].active;el.classList.toggle('on',defaultSourceConfig[i].active);return}
 if(el.id==='side-close'){closeSidePanel();return}
 if(el.id==='side-scrim'){closeSidePanel();return}
});
$('#side-scrim').addEventListener('click',closeSidePanel);
$('#side-close').addEventListener('click',closeSidePanel);
$('#compare-switch').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.click()}});
document.addEventListener('change',e=>{if(e.target.id==='period-select'){toast('Період змінено · Демо')}});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,data=new FormData(f);
 if(f.id==='add-source-form'){defaultSourceConfig.push({name:String(data.get('name')),category:String(data.get('category')),active:true});closeDialog();manageSourcesModal();toast('Джерело додано')}
});
document.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');$('.nav-overlay').hidden=true;closeSidePanel()}});

renderAll();
