(()=>{
'use strict';
const d=document,w=window;
const $=(s,r=d)=>r.querySelector(s), $$=(s,r=d)=>[...r.querySelectorAll(s)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const n=v=>Number(v||0);
const ALLOWED=new Set(['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios']);

function getDash(){try{return typeof dash!=='undefined'?dash:null}catch{return null}}
function getTeam(){const x=getDash();return Array.isArray(x?.individual)?x.individual:[]}
function getCats(){const x=getDash();return Array.isArray(x?.team)?x.team:[]}

function css(){
 if(d.getElementById('admTeamRestructureStyle'))return;
 const s=d.createElement('style');s.id='admTeamRestructureStyle';s.textContent=`
.topicIncentivos{display:none!important}
#admQuickNav,#admQuickOverlay{display:none!important}
#app:not(.hide){padding-bottom:0!important}
#app.admSideReady>.wrap{padding-bottom:28px!important}

/* Visão da Equipe = mesma linguagem visual do link do consultor/Rogério */
#admConsultorView{position:fixed;inset:0;z-index:600;background:#f3f6f8;overflow:auto;color:#142236;font-family:Arial,sans-serif}
#admConsultorView[hidden]{display:none!important}
.acvTop{background:radial-gradient(circle at 18% 28%,rgba(255,95,95,.34),transparent 30%),radial-gradient(circle at 72% 72%,rgba(255,0,0,.18),transparent 32%),linear-gradient(118deg,#ff1717 0%,#d0000b 34%,#5c0004 68%,#050505 100%);color:#fff;padding:14px 18px;box-shadow:0 8px 24px rgba(80,0,0,.22);position:sticky;top:0;z-index:20}
.acvTopIn{width:min(1180px,100%);margin:auto;display:flex;align-items:center;gap:12px}
.acvBrand{min-width:0;flex:1}.acvBrand b{display:block;font-size:20px;font-weight:950}.acvBrand small{display:block;font-size:11px;color:#ffe5e8;margin-top:3px}
.acvSupervisor{background:#fff;color:#b4000b;border-radius:999px;padding:8px 12px;font-weight:950;font-size:12px;white-space:nowrap}
.acvBack{border:0;background:#202020;color:#fff;border-radius:12px;padding:10px 13px;font-weight:900;white-space:nowrap}
.acvWrap{width:min(1180px,calc(100% - 22px));margin:16px auto 72px;display:grid;gap:13px}
.acvHello{background:#fff;border:1px solid #e2e8ed;border-radius:18px;padding:13px 15px;box-shadow:0 5px 16px #172b400e;display:flex;align-items:center;gap:11px}
.acvAvatar{width:48px;height:48px;border-radius:50%;background:#e30613;display:grid;place-items:center;color:#fff;font-size:24px;flex:0 0 auto}
.acvHelloText{min-width:0;flex:1}.acvHelloText strong{font-size:20px;color:#172736}.acvHelloText small{display:block;margin-top:3px;color:#6d7985;font-weight:700;font-size:12px}
.acvRouteBox{min-width:270px}.acvRouteBox label{display:block;font-size:9px;font-weight:950;color:#607386;margin-bottom:4px;text-transform:uppercase}
.acvRoute{width:100%;height:42px;border-radius:11px;border:1px solid #d5dde4;background:#fff;color:#142236;padding:0 34px 0 11px;font-weight:900}
.acvMainGrid{display:grid;grid-template-columns:minmax(0,1.22fr) minmax(330px,.78fr);gap:14px}
.acvSearch{background:linear-gradient(135deg,#df0010,#bd000a 75%,#990006);border-radius:20px;padding:15px;color:#fff;box-shadow:0 9px 22px #c9001728;overflow:hidden}
.acvSearchTitle{display:flex;align-items:center;gap:10px}.acvSearchIcon{width:48px;height:48px;border-radius:13px;background:#ffffff18;display:grid;place-items:center;font-size:26px;flex:0 0 auto}
.acvSearchTitle b{font-size:24px}.acvSearchTitle small{display:block;color:#ffe4e7;font-size:11px;margin-top:2px}
.acvSearchRow{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px}.acvSearchRow input{min-width:0;width:100%;box-sizing:border-box;background:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:15px;color:#172736}.acvSearchRow button{border:0;border-radius:12px;background:#fff;color:#d0000d;font-weight:950;padding:0 18px}
.acvPvControls{margin-top:11px;background:#ffffff13;border:1px solid #ffffff35;border-radius:14px;padding:10px}.acvPvLabel{font-size:12px;font-weight:900;margin-bottom:8px}.acvDays{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.acvDay{height:35px;border:1px solid #ffffff45;background:#ffffff12;color:#fff;border-radius:8px;font-size:10px;font-weight:900}.acvDay.on{background:#fff;color:#d0000d}
.acvList{width:100%;margin-top:8px;border:0;border-radius:10px;padding:10px;background:#202020;color:#fff;font-weight:900}
.acvQuickBox{background:#fff;border:1px solid #e0e7ed;border-radius:19px;padding:13px;box-shadow:0 5px 16px #172b400e}
.acvSecTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 2px 10px}.acvSecTitle h3{font-size:20px;margin:0}.acvSecTitle small{font-size:11px;color:#6f7d89}
.acvActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.acvAct{min-height:95px;border:1px solid #dfe6ec;border-radius:17px;background:#fff;padding:13px;text-align:left;font-weight:900;color:#152738;box-shadow:0 4px 12px #172b400b}
.acvAct .ic{width:40px;height:40px;border-radius:12px;background:#fff0f1;display:grid;place-items:center;font-size:21px;margin-bottom:8px}.acvAct.blue .ic{background:#e9f3ff}.acvAct.green .ic{background:#e8f8ef}.acvAct.orange .ic{background:#fff0df}
.acvCarouselShell{position:relative;min-width:0}.acvCarousel{display:flex;gap:10px;overflow-x:auto;padding:2px 1px 12px;scrollbar-width:none;scroll-snap-type:x proximity}.acvCarousel::-webkit-scrollbar{display:none}
.acvCat{flex:0 0 165px;height:232px;border:0;border-radius:20px;padding:0 13px 14px;color:#fff;text-align:left;position:relative;scroll-snap-align:start;box-shadow:0 7px 16px #172b4020;background:linear-gradient(160deg,#f52633,#9e0009)}
.acvCat:nth-child(6n+2){background:linear-gradient(160deg,#2563eb,#1e3a8a)}.acvCat:nth-child(6n+3){background:linear-gradient(160deg,#22a850,#075b29)}.acvCat:nth-child(6n+4){background:linear-gradient(160deg,#ff9a25,#e3420c)}.acvCat:nth-child(6n+5){background:linear-gradient(160deg,#8b43e6,#4d1498)}.acvCat:nth-child(6n){background:linear-gradient(160deg,#16a6e6,#0755b7)}
.acvProd{height:125px;margin:0 -13px 10px;border-radius:20px 20px 14px 14px;background:linear-gradient(180deg,#fff,#f5f7fa);display:grid;place-items:center;font-size:43px}.acvCat b{font-size:14px;line-height:1.08;display:block;min-height:31px}.acvCat small{display:block;margin-top:6px;color:#fff;font-size:10.5px}.acvProgress{height:6px;border-radius:999px;background:#ffffff38;overflow:hidden;margin-top:8px;margin-right:34px}.acvProgress i{display:block;height:100%;background:#fff;border-radius:inherit}.acvArrow{position:absolute;right:9px;bottom:9px;width:32px;height:32px;border-radius:50%;background:#fff;color:#e30613;display:grid;place-items:center;font-size:23px;font-weight:950}
.acvStats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.acvStat{background:#fff;border:1px solid #e1e7ed;border-radius:15px;padding:12px;box-shadow:0 4px 12px #172b4009}.acvStat span{font-size:9px;color:#607386;font-weight:950}.acvStat b{display:block;font-size:22px;margin-top:4px}
.acvResults{background:#fff;border:1px solid #e0e7ed;border-radius:18px;padding:13px;box-shadow:0 5px 15px #172b400d}.acvTableWrap{overflow:auto;border:1px solid #e2e8ed;border-radius:12px}.acvTable{width:100%;border-collapse:collapse;min-width:720px}.acvTable th,.acvTable td{padding:10px 8px;border-bottom:1px solid #edf0f2;text-align:center;font-size:12px}.acvTable th{background:#f5f7f9}.acvTable th:first-child,.acvTable td:first-child{text-align:left;font-weight:900}.good{color:#087249;font-weight:950}.bad{color:#b3141c;font-weight:950}
@media(max-width:900px){.acvTopIn{flex-wrap:wrap}.acvBrand{flex-basis:calc(100% - 125px)}.acvSupervisor{order:3}.acvMainGrid{grid-template-columns:1fr}.acvHello{align-items:flex-start;flex-wrap:wrap}.acvRouteBox{width:100%;min-width:0}.acvStats{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.acvWrap{width:calc(100% - 14px);margin-top:8px}.acvTop{padding:10px}.acvBrand b{font-size:16px}.acvBrand small{font-size:9px}.acvBack{font-size:11px;padding:8px 10px}.acvSupervisor{font-size:10px;padding:6px 9px}.acvSearchRow{grid-template-columns:1fr}.acvSearchRow button{padding:11px}.acvCat{flex-basis:148px;height:220px}.acvProd{height:118px}.acvSecTitle h3{font-size:18px}}
`;d.head.appendChild(s);
}

function getCardLabel(card){return norm(card.querySelector('b')?.textContent||card.textContent)}
function patchHome(){
 const home=d.getElementById('cokeHome');if(!home)return;
 home.querySelector('.topicIncentivos')?.remove();
 const vendas=home.querySelector('.topicVendas .menuGrid');if(!vendas)return;
 $$('.menuCard',vendas).forEach(card=>{if(!ALLOWED.has(getCardLabel(card)))card.remove()});
 let team=$$('.menuCard',vendas).find(c=>getCardLabel(c)==='visao da equipe');
 if(!team){
   team=d.createElement('button');team.type='button';team.className='menuCard';team.id='admTeamViewCard';
   team.innerHTML='<span class="mi" style="background:#e30613">👥</span><span><b>Visão da Equipe</b><small>Abrir a visão completa no padrão do consultor</small></span>';
   vendas.insertBefore(team,vendas.firstChild);
 }
 team.onclick=openView;
 const order=['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios'];
 const cards=$$('.menuCard',vendas),sorted=[...cards].sort((a,b)=>order.indexOf(getCardLabel(a))-order.indexOf(getCardLabel(b)));
 if(cards.some((x,i)=>x!==sorted[i]))sorted.forEach(x=>vendas.appendChild(x));
}
function patchSidebar(){
 const nav=d.getElementById('admSideNav');if(!nav)return;
 $$('.admTopic',nav).forEach(g=>{const t=norm(g.querySelector('.admTopicHead')?.dataset.topic||g.querySelector('.admTopicHead')?.textContent);if(t.includes('incentivos'))g.remove()});
}
function icon(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('FINI'))return '🍬';if(s.includes('PERFETTI'))return '🍭';if(s.includes('PÃO DE QUEIJO')||s.includes('PAO DE QUEIJO'))return '🧀';
 if(s.includes('CERVEJA')||s.includes('ESTRELLA'))return '🍺';if(s.includes('B2B'))return '🛒';if(s.includes('IMPERDO'))return '🎯';
 if(s.includes('CAMPARI')||s.includes('LABEL')||s.includes('PARR'))return '🥃';if(s.includes('FANTA'))return '🍊';return '🏆';
}
function options(){
 return '<option value="TEAM">👥 Toda a Equipe</option>'+getTeam().map(x=>'<option value="'+E(x.rota)+'">👤 '+E(x.rota)+' - '+E(x.nome||'Consultor')+'</option>').join('');
}
function rowsFor(route){
 if(route==='TEAM')return getCats().map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
 const p=getTeam().find(x=>String(x.rota)===route);
 return (p?.resultados||[]).map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
}
function ensureView(){
 let v=d.getElementById('admConsultorView');if(v)return v;
 css();v=d.createElement('section');v.id='admConsultorView';v.hidden=true;
 v.innerHTML='<header class="acvTop"><div class="acvTopIn"><div class="acvBrand"><b>COBERTURAS • EQUIPE ITURAMA</b><small>Painel do Supervisor • Visão da Equipe</small></div><span class="acvSupervisor">Leandro • Supervisor</span><button type="button" id="acvBack" class="acvBack">← Voltar ao DM</button></div></header><main class="acvWrap"><section class="acvHello"><div class="acvAvatar">👤</div><div class="acvHelloText"><strong>Olá, Leandro</strong><small>Bora conquistar mais hoje! 🚀</small></div><div class="acvRouteBox"><label>Visualizar</label><select id="acvRoute" class="acvRoute"></select></div></section><section class="acvMainGrid"><div class="acvSearch"><div class="acvSearchTitle"><div class="acvSearchIcon">🔎</div><div><b>Pesquisa de PV</b><small>Pesquise PV, cliente ou razão social</small></div></div><div class="acvSearchRow"><input id="acvPv" inputmode="numeric" placeholder="Digite o PV do cliente"><button type="button" id="acvSearchBtn">Pesquisar ›</button></div><div class="acvPvControls"><div class="acvPvLabel">📍 Escolha o dia da visita</div><div class="acvDays">'+['SEG','TER','QUA','QUI','SEX'].map(x=>'<button type="button" class="acvDay" data-day="'+x+'">'+x+'</button>').join('')+'</div><button type="button" id="acvListDay" class="acvList">Listar clientes do dia ▾</button></div></div><div class="acvQuickBox"><div class="acvSecTitle"><h3>Acesso rápido</h3><small>Ferramentas da equipe</small></div><div class="acvActions"><button type="button" class="acvAct" data-act="contratos"><span class="ic">📄</span>Contratos</button><button type="button" class="acvAct blue" data-act="visitas"><span class="ic">📅</span>Visita de Clientes</button><button type="button" class="acvAct green" data-act="subcanais"><span class="ic">🏪</span>Subcanais</button><button type="button" class="acvAct orange" data-act="contatos"><span class="ic">📞</span>Contato dos Clientes</button></div></div></section><section><div class="acvSecTitle"><h3>Coberturas dos Incentivos</h3><small>↔ arraste para o lado</small></div><div class="acvCarouselShell"><div id="acvCats" class="acvCarousel"></div></div></section><section id="acvStats" class="acvStats"></section><section class="acvResults"><div class="acvSecTitle"><div><h3 id="acvResultTitle">Resultado da Equipe por incentivo</h3><small id="acvResultHint">Selecione um incentivo para visualizar os resultados.</small></div></div><div id="acvResultBody"></div></section></main>';
 d.body.appendChild(v);
 $('#acvBack').onclick=closeView;
 $('#acvRoute').onchange=()=>renderView();
 $('#acvSearchBtn').onclick=searchPv;
 $('#acvPv').onkeydown=e=>{if(e.key==='Enter')searchPv()};
 $$('.acvDay',v).forEach(b=>b.onclick=()=>{$$('.acvDay',v).forEach(x=>x.classList.remove('on'));b.classList.add('on');try{sessionStorage.setItem('pv_dia_visita',b.dataset.day)}catch{}});
 $('#acvListDay').onclick=()=>openAdminFeature('Visita de Clientes');
 $$('.acvAct',v).forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='contratos')openAdminFeature('Contratos');if(a==='visitas')openAdminFeature('Visita de Clientes');if(a==='subcanais')openAdminFeature('Subcanais');if(a==='contatos')openAdminFeature('Contato dos Clientes')});
 return v;
}
function openAdminFeature(label){
 closeView();
 try{w.cokeNav?.(label)}catch{}
}
function searchPv(){
 const val=$('#acvPv')?.value.trim()||'';
 closeView();
 try{w.cokeNav?.('Pesquisar PV')}catch{}
 setTimeout(()=>{
   const input=d.getElementById('pvBusca')||d.querySelector('#pesquisa input');
   if(input){input.value=val;try{if(val&&typeof w.pesquisarPV==='function')w.pesquisarPV()}catch{}}
 },220);
}
function openView(){
 const v=ensureView();v.hidden=false;
 const sel=$('#acvRoute');sel.innerHTML=options();sel.value='TEAM';
 const saved=(sessionStorage.getItem('pv_dia_visita')||'SEG').toUpperCase();$$('.acvDay',v).forEach(x=>x.classList.toggle('on',x.dataset.day===saved));
 renderView();try{w.scrollTo(0,0)}catch{}
}
function closeView(){const v=d.getElementById('admConsultorView');if(v)v.hidden=true;try{w.show?.()}catch{}try{w.scrollTo(0,0)}catch{}}
function renderView(cat){
 const v=ensureView();if(v.hidden)return;
 const sel=$('#acvRoute');if(!sel.options.length)sel.innerHTML=options();
 const route=sel.value||'TEAM',rows=rowsFor(route),team=getTeam();
 const person=route==='TEAM'?null:team.find(x=>String(x.rota)===route);
 const totalMeta=rows.reduce((s,x)=>s+n(x.meta),0),real=rows.reduce((s,x)=>s+n(x.realizado),0),falta=Math.max(0,rows.reduce((s,x)=>s+n(x.falta),0)),pct=totalMeta?Math.round(real/totalMeta*100):0;
 $('#acvStats').innerHTML=[
  ['REALIZADO',real],['META',totalMeta],['ATINGIMENTO',pct+'%'],[route==='TEAM'?'CONSULTORES':'FALTA',route==='TEAM'?team.length:falta]
 ].map(x=>'<div class="acvStat"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join('');
 $('#acvCats').innerHTML=rows.map(x=>{const p=x.meta?Math.min(100,Math.round(x.realizado/x.meta*100)):0;return '<button class="acvCat" type="button" data-cat="'+E(x.nome)+'"><span class="acvProd">'+icon(x.nome)+'</span><b>'+E(x.nome)+'</b><small>'+x.realizado+' / '+x.meta+' realizados</small><span class="acvProgress"><i style="width:'+p+'%"></i></span><span class="acvArrow">›</span></button>'}).join('');
 $$('.acvCat',$('#acvCats')).forEach(b=>b.onclick=()=>renderResult(b.dataset.cat));
 $('#acvResultTitle').textContent=route==='TEAM'?'Resultado da Equipe por incentivo':'Resultado de '+(person?.nome||route)+' por incentivo';
 $('#acvResultHint').textContent=route==='TEAM'?'Selecione um incentivo para visualizar os resultados de toda a equipe.':'Visualizando '+route+' - '+(person?.nome||'Consultor')+'.';
 renderResult(cat||'');
}
function renderResult(cat){
 const route=$('#acvRoute')?.value||'TEAM',team=getTeam(),cats=getCats();
 const body=$('#acvResultBody');if(!body)return;
 if(route==='TEAM'){
  const use=cat?cats.filter(x=>x.nome===cat):cats;
  const heads=team.map(p=>'<th>'+E(p.rota)+'<br><small>'+E(String(p.nome||'').split(' ')[0])+'</small></th>').join('');
  body.innerHTML='<div class="acvTableWrap"><table class="acvTable"><thead><tr><th>INCENTIVO</th>'+heads+'<th>TOTAL</th></tr></thead><tbody>'+use.map(c=>{const cells=team.map(p=>{const r=(p.resultados||[]).find(x=>x.nome===c.nome)||{};const ok=n(r.meta)>0&&n(r.realizado)>=n(r.meta);return '<td class="'+(ok?'good':'bad')+'">'+n(r.realizado)+'/'+n(r.meta)+'<br><small>'+n(r.percentual)+'%</small></td>'}).join('');return '<tr><td>'+E(c.nome)+'</td>'+cells+'<td><b>'+n(c.realizado)+'/'+n(c.meta)+'</b><br><small>'+n(c.percentual)+'%</small></td></tr>'}).join('')+'</tbody></table></div>';
 }else{
  const p=team.find(x=>String(x.rota)===route),rows=(p?.resultados||[]).filter(x=>!cat||x.nome===cat);
  body.innerHTML='<div class="acvTableWrap"><table class="acvTable"><thead><tr><th>INCENTIVO</th><th>META</th><th>REALIZADO</th><th>FALTA</th><th>%</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+E(x.nome)+'</td><td>'+n(x.meta)+'</td><td class="'+(n(x.meta)>0&&n(x.realizado)>=n(x.meta)?'good':'bad')+'">'+n(x.realizado)+'</td><td>'+n(x.falta)+'</td><td>'+n(x.percentual)+'%</td></tr>').join('')+'</tbody></table></div>';
 }
}
function sweep(){
 css();d.getElementById('admQuickNav')?.remove();d.getElementById('admQuickOverlay')?.remove();patchHome();patchSidebar();
}
let tries=0;const timer=setInterval(()=>{sweep();if(++tries>90)clearInterval(timer)},500);
w.addEventListener('pageshow',()=>setTimeout(sweep,250));
})();