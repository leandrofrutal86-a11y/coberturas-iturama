(()=>{
'use strict';
const Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)],E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function data(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}
function n(v){return Number(v||0)}
function icon(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('FINI'))return '🍬';if(s.includes('PERFETTI'))return '🍭';if(s.includes('PÃO DE QUEIJO'))return '🧀';
 if(s.includes('CERVEJA')||s.includes('ESTRELLA'))return '🍺';if(s.includes('B2B'))return '🛒';if(s.includes('IMPERDO'))return '🎯';
 if(s.includes('CAMPARI')||s.includes('LABEL')||s.includes('PARR'))return '🥃';if(s.includes('SMIRNOFF'))return '🥤';if(s.includes('FANTA'))return '🍊';return '🏆'
}
function ensureCss(){
 if(document.getElementById('consultorModern20261016'))return;
 const s=document.createElement('style');s.id='consultorModern20261016';s.textContent=`
#dash{background:#f4f7fa!important;min-height:100vh}
#dash .top{background:linear-gradient(135deg,#ed0713,#c9000b 70%,#9e0007)!important;border:0!important;padding:17px 18px!important;box-shadow:none!important}
#dash .topbar{max-width:1180px!important;min-height:76px!important}
#dash .top .brand .logo,#dash .top .brand .vline{display:none!important}
#dash .top .brand>div:last-child:before{content:'COBERTURAS • EQUIPE ITURAMA';display:block;font-size:24px;font-weight:950;color:#fff;letter-spacing:-.4px}
#dash .top .brand>div:last-child b{font-size:14px!important;font-weight:600!important;color:#ffe7e9!important}
#dash .top .brand>div:last-child b:before{content:'Painel do Consultor • '}
#dash .top .user{background:#ffffff18;border:1px solid #ffffff33;border-radius:14px;padding:8px 11px}
#dash .top .user b,#dash .top .user small{color:#fff!important}.logout{background:#1d1d1d!important;border:0!important;border-radius:13px!important}
#dash .wrap{width:min(720px,calc(100% - 16px))!important;margin:12px auto 92px!important;overflow:visible!important}
#dash .quick,#dash .summary,#dash .tools,#dash .mot{display:none!important}
.cmHome{display:grid;gap:14px;margin-bottom:18px}
.cmHello{background:#fff;border:1px solid #e4e9ee;border-radius:22px;padding:16px 18px;box-shadow:0 8px 22px #172b4010;display:flex;align-items:center;justify-content:space-between;gap:12px}
.cmHello strong{font-size:23px;color:#172534}.cmHello small{display:block;margin-top:4px;color:#6b7785;font-weight:650}.cmAvatar{width:54px;height:54px;border-radius:50%;background:#e30613;color:white;display:grid;place-items:center;font-size:27px;flex:0 0 auto}
.cmHelloMain{display:flex;align-items:center;gap:12px}.cmDate{background:#f3f6f8;border-radius:999px;padding:10px 13px;color:#5a6b7d;font-size:12px;font-weight:800}
.cmKpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.cmKpi{background:#fff;border:1px solid #e2e8ee;border-radius:18px;padding:13px;box-shadow:0 5px 16px #16283b0d}.cmKpi span{display:block;font-size:11px;font-weight:900;color:#53697e}.cmKpi b{display:block;font-size:27px;margin:5px 0 3px;color:#0e1d2d}.cmKpi small{color:#748292;font-size:10px}.cmBar{height:6px;background:#edf1f4;border-radius:999px;overflow:hidden;margin-top:9px}.cmBar i{display:block;height:100%;background:#e30613;border-radius:inherit}
.cmSearchHero{background:linear-gradient(135deg,#d9000b,#b80009 72%,#8e0007);border-radius:23px;padding:18px;color:#fff;box-shadow:0 10px 24px #d0001830}
.cmSearchTitle{display:flex;align-items:center;gap:13px;margin-bottom:13px}.cmSearchIcon{width:55px;height:55px;border-radius:16px;background:#ffffff18;display:grid;place-items:center;font-size:30px}.cmSearchTitle b{font-size:27px}.cmSearchTitle small{display:block;font-size:13px;color:#ffe9eb;margin-top:3px}
.cmSearchRow{display:grid;grid-template-columns:1fr auto;gap:8px}.cmSearchRow input{background:#fff;border:0;border-radius:15px;padding:14px 16px;font-size:15px;color:#1e2935;outline:0}.cmSearchRow button{background:#fff;color:#d4000e;border:0;border-radius:15px;padding:0 20px;font-weight:950}
.cmSectionTitle{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:2px 3px 7px}.cmSectionTitle h3{margin:0;font-size:20px;color:#152536}.cmSectionTitle small{color:#7a8795;font-weight:700}
.cmActions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.cmAct{background:#fff;border:1px solid #e0e7ed;border-radius:18px;min-height:105px;padding:13px;text-align:left;box-shadow:0 5px 14px #172b400d;position:relative;font-weight:900;color:#14263a}.cmAct .ic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:#fff0f1;margin-bottom:8px}.cmAct:after{content:'›';position:absolute;right:12px;bottom:8px;font-size:25px;color:#d70b15}.cmAct.blue .ic{background:#eaf3ff}.cmAct.green .ic{background:#e9f8ef}.cmAct.orange .ic{background:#fff1df}.cmAct.purple .ic{background:#f2eafe}
.cmCarousel{display:flex!important;flex-wrap:nowrap!important;gap:10px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding:2px 2px 12px!important;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch!important;touch-action:pan-x!important;overscroll-behavior-x:contain;scrollbar-width:none}.cmCarousel::-webkit-scrollbar{display:none}
.cmCat{flex:0 0 142px!important;min-width:142px!important;max-width:142px!important;min-height:145px;border:0;border-radius:18px;padding:13px;color:white;text-align:left;scroll-snap-align:start;position:relative;box-shadow:0 7px 16px #172b4020;overflow:hidden}.cmCat:after{content:'›';position:absolute;right:10px;bottom:9px;width:28px;height:28px;border-radius:50%;background:#fff;color:#d20a14;display:grid;place-items:center;font-size:23px}.cmCat .emoji{font-size:29px;display:block;margin-bottom:14px}.cmCat b{font-size:14px;line-height:1.1;display:block}.cmCat small{display:block;margin-top:6px;color:#fffde0;font-size:10px}.cmCat:nth-child(6n+1){background:linear-gradient(145deg,#ee2a61,#cf0050)}.cmCat:nth-child(6n+2){background:linear-gradient(145deg,#ff8b00,#e65c00)}.cmCat:nth-child(6n+3){background:linear-gradient(145deg,#0f7c3e,#075f2d)}.cmCat:nth-child(6n+4){background:linear-gradient(145deg,#1559c8,#0b3c9e)}.cmCat:nth-child(6n+5){background:linear-gradient(145deg,#d70b15,#a40008)}.cmCat:nth-child(6n+6){background:linear-gradient(145deg,#7f2cc7,#562091)}
#dash .tabs{margin-top:14px!important}.cmPvHomeSlot{display:block}.cvPrioritySection,.cvPriorityWrap,.cvHomePriorities,#cvPriorityBlock{display:none!important}
@media(max-width:760px){
 #dash .top{padding:13px 12px!important}.topbar{gap:8px!important}.top .brand{min-width:0}.top .user{display:none!important}
 #dash .top .brand>div:last-child:before{font-size:18px!important}.top .brand>div:last-child b{font-size:11px!important}
 .cmHello{padding:13px}.cmHello strong{font-size:18px}.cmDate{display:none}.cmKpis{grid-template-columns:1fr 1fr}.cmActions{grid-template-columns:1fr 1fr}.cmSearchTitle b{font-size:22px}.cmSearchRow{grid-template-columns:1fr}.cmSearchRow button{padding:12px}.cmCat{flex-basis:126px;min-height:134px}
}
`;document.head.appendChild(s)
}
function clickExisting(id,text){
 const el=id?document.getElementById(id):null;if(el){el.click();return}
 const all=QA('#dash button,#dash .tile,#dash a');const x=all.find(v=>String(v.textContent||'').toLowerCase().includes(String(text||'').toLowerCase()));if(x)x.click()
}
function setTab(which){
 const b=Q('.tabs .tab[data-t="'+which+'"]');if(b)b.click();Q('.panel')?.scrollIntoView({behavior:'smooth',block:'start'})
}
function search(){
 const inp=document.getElementById('cmPvInput');if(!inp)return;
 const v=inp.value.trim();try{openPv()}catch{}
 setTimeout(()=>{const p=document.getElementById('pv');if(p){p.value=v;if(v)try{searchPv()}catch{}}},60)
}
function build(){
 const wrap=Q('#dash .wrap');if(!wrap)return false;
 ensureCss();
 let home=document.getElementById('consultorModernHome');
 if(!home){home=document.createElement('section');home.id='consultorModernHome';home.className='cmHome';const tabs=Q('#dash .tabs');wrap.insertBefore(home,tabs||wrap.firstChild)}
 return true
}
function hideLegacyHomeBlocks(){
 QA('#dash .wrap > section,#dash .wrap > div').forEach(el=>{
  if(el.id==='consultorModernHome'||el.classList.contains('tabs')||el.classList.contains('panel')||el.classList.contains('footer'))return;
  const t=String(el.textContent||'').trim().toUpperCase();
  if(t==='INCENTIVOS PRIORITÁRIOS'||(t.includes('INCENTIVOS PRIORITÁRIOS')&&t.length<120))el.style.display='none';
 });
}
function render(){
 if(!build())return;const d=data();if(!d?.own)return;
 const own=d.own||[],meta=own.reduce((s,x)=>s+n(x.meta),0),real=own.reduce((s,x)=>s+n(x.realizado),0),pct=meta?Math.round(real/meta*100):0;
 const b2b=own.find(x=>/COMPRA\s*B2B/i.test(x.nome||''))||{},imp=own.filter(x=>/IMPERDO/i.test(x.nome||'')),impOpen=imp.reduce((s,x)=>s+n(x.falta),0);
 const focused=Array.isArray(d.incentivo_botoes)&&d.incentivo_botoes.length?d.incentivo_botoes:[];
 const name=d.consultor?.nome||document.getElementById('name')?.textContent||'Consultor';
 const now=new Date(),date=now.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'});
 const cards=own.map(x=>'<button class="cmCat" data-cat="'+E(x.nome)+'"><span class="emoji">'+icon(x.nome)+'</span><b>'+E(x.nome)+'</b><small>'+n(x.realizado)+' / '+n(x.meta)+' realizados</small></button>').join('');
 const home=document.getElementById('consultorModernHome');
 home.innerHTML='<div class="cmHello"><div class="cmHelloMain"><div class="cmAvatar">👤</div><div><strong>Olá, '+E(name.split(' ')[0])+'</strong><small>Bora conquistar mais hoje! 🚀</small></div></div><div class="cmDate">📅 '+E(date)+'</div></div>'+
 '<div class="cmSearchHero"><div class="cmSearchTitle"><div class="cmSearchIcon">🔎</div><div><b>Pesquisa de PV</b><small>Pesquise PV, cliente ou razão social</small></div></div><div class="cmSearchRow"><input id="cmPvInput" inputmode="numeric" placeholder="Digite o PV do cliente"><button id="cmPvBtn">Pesquisar ›</button></div></div>'+
 '<div id="cmPvHomeSlot" class="cmPvHomeSlot"></div>'+
 '<div><div class="cmSectionTitle"><h3>Acesso rápido</h3><small>Ferramentas do dia</small></div><div class="cmActions">'+
 '<button class="cmAct" data-act="meu"><span class="ic">📊</span>Meu Resultado</button><button class="cmAct" data-act="equipe"><span class="ic">👥</span>Resultado da Equipe</button><button class="cmAct orange" data-act="prior"><span class="ic">🏆</span>Incentivos Prioritários</button><button class="cmAct blue" data-act="b2b"><span class="ic">🛒</span>B2B Oportunidades</button>'+
 '<button class="cmAct orange" data-act="imp"><span class="ic">⚠️</span>Imperdoáveis</button><button class="cmAct" data-act="contratos"><span class="ic">📄</span>Contratos</button><button class="cmAct blue" data-act="visitas"><span class="ic">📅</span>Visita de Clientes</button><button class="cmAct green" data-act="subcanais"><span class="ic">🏪</span>Subcanais</button><button class="cmAct purple" data-act="materiais"><span class="ic">📚</span>Materiais de Apoio</button><button class="cmAct blue" data-act="contatos"><span class="ic">📞</span>Contato dos Clientes</button></div></div>'+
 '<div><div class="cmSectionTitle"><h3>Coberturas dos incentivos</h3><small>↔ deslize para ver todos</small></div><div class="cmCarousel">'+cards+'</div></div>';
 document.getElementById('cmPvBtn').onclick=search;document.getElementById('cmPvInput').onkeydown=e=>{if(e.key==='Enter')search()};
 QA('.cmCat').forEach(b=>b.onclick=()=>{try{choose(b.dataset.cat)}catch{}});
 hideLegacyHomeBlocks();
 QA('.cmAct').forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='meu')setTab('meu');else if(a==='equipe')setTab('equipe');else if(a==='prior')Q('.cmCarousel')?.scrollIntoView({behavior:'smooth'});else if(a==='b2b')clickExisting('cvB2BOpen','B2B');else if(a==='imp')clickExisting('impInternalBtn','Imperdoáveis');else if(a==='contratos')clickExisting('cvContractsBtn','Contratos');else if(a==='visitas')clickExisting('cvVisitBtn','Visita de Clientes');else if(a==='subcanais')clickExisting('cvSubBtn','Subcanais');else if(a==='materiais')clickExisting(null,'Materiais de Apoio');else if(a==='contatos')clickExisting('contClientesBtn','Contato dos Clientes')})
}
let sig='';
setInterval(()=>{const d=data();const s=d?JSON.stringify([(d.own||[]).map(x=>[x.nome,x.realizado,x.meta]),d.consultor?.nome]):'';if(s&&s!==sig){sig=s;render()}},900);
window.addEventListener('pageshow',()=>setTimeout(render,500));
})();