(()=>{
'use strict';
const Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)],E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getDash(){try{return typeof dash!=='undefined'?dash:null}catch{return null}}
function getConfig(){try{return typeof config!=='undefined'?config:null}catch{return null}}
function n(v){return Number(v||0)}
function ensureCss(){
 if(document.getElementById('adminModern20261016'))return;
 const s=document.createElement('style');s.id='adminModern20261016';s.textContent=`
body{background:#f3f6f8!important}
header{background:linear-gradient(135deg,#ed0713,#c9000b 70%,#9b0007)!important;border:0!important;padding:16px 4%!important;box-shadow:0 5px 18px #9a001b22}
header>div>b{font-size:22px!important}header .small{color:#ffe8ea!important;font-size:13px!important}header .dark{background:#202020!important;border-radius:14px!important}
#cokeHome>.homeHero{display:none!important}
#cokeHome>.menuTopic,#cokeHome>.secureNote{display:none}
#cokeHome.showLegacyTopics>.menuTopic,#cokeHome.showLegacyTopics>.secureNote{display:block}
.admModern{display:grid;gap:15px;margin-bottom:22px}
.admKpis{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
.admKpi{background:#fff;border:1px solid #e0e7ed;border-radius:19px;padding:14px;box-shadow:0 6px 17px #172b400e}.admKpi span{font-size:11px;font-weight:900;color:#546b80;display:block}.admKpi b{font-size:27px;display:block;margin:5px 0 3px}.admKpi small{font-size:10px;color:#778696}.admKpi .bar{height:6px;background:#edf1f4;border-radius:999px;margin-top:9px;overflow:hidden}.admKpi .bar i{display:block;height:100%;background:#e30613;border-radius:inherit}
.admSearchHero{background:linear-gradient(135deg,#d9000b,#b80009 72%,#8e0007);border-radius:24px;padding:18px;color:white;box-shadow:0 11px 25px #c9001630}.admSearchTop{display:flex;align-items:center;justify-content:space-between;gap:12px}.admSearchTitle{display:flex;gap:13px;align-items:center}.admSearchIcon{width:58px;height:58px;border-radius:17px;background:#ffffff18;display:grid;place-items:center;font-size:31px}.admSearchTitle b{font-size:29px}.admSearchTitle small{display:block;margin-top:4px;color:#ffe8ea}.admHistory{border:1px solid #ffffff66;background:#ffffff12;color:white;border-radius:13px;padding:10px 13px;font-weight:850}.admSearchRow{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:13px}.admSearchRow input{border:0;border-radius:15px;padding:14px 16px;background:white}.admSearchRow button{border:0;border-radius:15px;background:white;color:#d0000d;font-weight:950;padding:0 22px}
.admTitle{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:1px 2px 7px}.admTitle h3{font-size:21px;margin:0}.admTitle button,.admTitle small{border:0;background:transparent;color:#6e7e8c;font-weight:750}
.admActions{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.admAction{position:relative;min-height:105px;border:1px solid #e0e6ec;border-radius:18px;background:#fff;padding:13px;text-align:left;font-weight:900;color:#152738;box-shadow:0 5px 14px #172b400d}.admAction .ic{width:41px;height:41px;border-radius:12px;background:#fff0f1;display:grid;place-items:center;font-size:22px;margin-bottom:8px}.admAction:after{content:'›';position:absolute;right:11px;bottom:8px;font-size:25px;color:#d70a14}.admAction.blue .ic{background:#e9f3ff}.admAction.green .ic{background:#e8f8ef}.admAction.orange .ic{background:#fff0df}.admAction.purple .ic{background:#f2eaff}
.admCarousel{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 9px;scrollbar-width:none;scroll-snap-type:x mandatory}.admCarousel::-webkit-scrollbar{display:none}.admCat{flex:0 0 135px;min-height:132px;border:0;border-radius:18px;padding:13px;color:white;text-align:left;scroll-snap-align:start;position:relative;box-shadow:0 6px 16px #172b4020}.admCat b{font-size:13px;line-height:1.1;display:block}.admCat small{display:block;font-size:10px;margin-top:7px;color:#fffce9}.admCat:after{content:'›';position:absolute;right:9px;bottom:8px;width:27px;height:27px;border-radius:50%;background:#fff;color:#d30a14;display:grid;place-items:center;font-size:22px}.admCat:nth-child(6n+1){background:linear-gradient(145deg,#ee2a61,#cb0050)}.admCat:nth-child(6n+2){background:linear-gradient(145deg,#ff8b00,#e65c00)}.admCat:nth-child(6n+3){background:linear-gradient(145deg,#0f7c3e,#075f2d)}.admCat:nth-child(6n+4){background:linear-gradient(145deg,#1559c8,#0b3c9e)}.admCat:nth-child(6n+5){background:linear-gradient(145deg,#d70b15,#a40008)}.admCat:nth-child(6n+6){background:linear-gradient(145deg,#7f2cc7,#562091)}
.admPreview{background:#fff;border:1px solid #e0e6ec;border-radius:20px;padding:14px;box-shadow:0 6px 17px #172b400c;overflow:hidden}.admPreviewWrap{overflow-x:auto}.admPreview table{min-width:760px!important;margin:0}.admPreview th{position:static!important;background:#f3f7fa!important;color:#23394d!important}.admPreview td,.admPreview th{padding:9px 7px!important;text-align:center!important;font-size:11px!important}.admPreview td:first-child,.admPreview th:first-child{text-align:left!important;font-weight:900}.admPreview .good{color:#087c45;font-weight:900}.admPreview .badx{color:#c5151d;font-weight:900}
.admMore{width:100%;background:#fff;border:1px solid #dfe6ec;border-radius:14px;padding:13px;font-weight:900;color:#42586b}
@media(max-width:900px){.admKpis{grid-template-columns:1fr 1fr}.admActions{grid-template-columns:1fr 1fr 1fr}}
@media(max-width:650px){header>div>b{font-size:17px!important}.admSearchTitle b{font-size:23px}.admSearchTop{align-items:flex-start}.admHistory{font-size:11px}.admSearchRow{grid-template-columns:1fr}.admSearchRow button{padding:12px}.admActions{grid-template-columns:1fr 1fr}.admCat{flex-basis:122px}.admKpi b{font-size:23px}}
`;document.head.appendChild(s)
}
function nav(label){try{window.cokeNav(label)}catch{}}
function openPriority(){const b=document.getElementById('incentivePriorityCard');if(b)b.click()}
function searchPv(){
 const inp=document.getElementById('admModernPv'),v=inp?.value.trim()||'';
 nav('Pesquisar PV');
 setTimeout(()=>{const p=document.getElementById('pvBusca');if(p){p.value=v;if(v&&typeof pesquisarPV==='function')pesquisarPV()}},180)
}
function build(){const home=document.getElementById('cokeHome');if(!home)return false;ensureCss();let sec=document.getElementById('adminModernHome');if(!sec){sec=document.createElement('div');sec.id='adminModernHome';sec.className='admModern';home.insertBefore(sec,home.firstChild)}return true}
function render(){
 if(!build())return;
 const d=getDash(),cfg=getConfig();if(!d?.team||!d?.individual)return;
 const totalMeta=d.team.reduce((s,x)=>s+n(x.meta),0),totalReal=d.team.reduce((s,x)=>s+n(x.realizado),0),pct=totalMeta?Math.round(totalReal/totalMeta*100):0;
  const pending=d.team.reduce((s,x)=>s+n(x.falta),0);
 const previewCats=(d.team||[]).slice(0,4),people=(d.individual||[]).slice(0,5);
 const th=people.map(p=>'<th>'+E(p.rota)+'<br><small>'+E(String(p.nome||'').split(' ')[0])+'</small></th>').join('');
 const body=previewCats.map(cat=>{const cells=people.map(p=>{const r=(p.resultados||[]).find(x=>x.nome===cat.nome)||{};const ok=n(r.realizado)>=n(r.meta)&&n(r.meta)>0;return '<td class="'+(ok?'good':'badx')+'">'+n(r.realizado)+'/'+n(r.meta)+'<br><small>'+n(r.percentual)+'%</small></td>'}).join('');return '<tr><td>'+E(cat.nome)+'</td>'+cells+'<td><b>'+n(cat.realizado)+'/'+n(cat.meta)+'</b><br><small>'+n(cat.percentual)+'%</small></td></tr>'}).join('');
 const sec=document.getElementById('adminModernHome');
 sec.innerHTML='<div class="admKpis"><div class="admKpi"><span>COBERTURAS DA EQUIPE</span><b>'+totalReal+'</b><small>de '+totalMeta+' meta</small><div class="bar"><i style="width:'+Math.min(100,pct)+'%"></i></div></div><div class="admKpi"><span>CONSULTORES ATIVOS</span><b>'+n(d.consultores?.length)+'</b><small>equipe cadastrada</small><div class="bar"><i style="width:100%;background:#0a9b52"></i></div></div><div class="admKpi"><span>PENDÊNCIAS</span><b>'+pending+'</b><small>coberturas em aberto</small><div class="bar"><i style="width:'+Math.min(100,pending/3)+'%;background:#f17622"></i></div></div></div>'+
 '<div class="admSearchHero"><div class="admSearchTop"><div class="admSearchTitle"><div class="admSearchIcon">🔎</div><div><b>Pesquisa de PV</b><small>Pesquise PV, cliente ou razão social</small></div></div><button class="admHistory" data-action="history">↶ Histórico</button></div><div class="admSearchRow"><input id="admModernPv" inputmode="numeric" placeholder="Digite o PV do cliente"><button id="admModernSearch">Pesquisar ›</button></div></div>'+
 '<div><div class="admTitle"><h3>Acesso rápido do ADM</h3><button id="admShowAll">Ver todos ›</button></div><div class="admActions">'+
 '<button class="admAction" data-nav="Acompanhamento"><span class="ic">📊</span>Acompanhamento da Equipe</button><button class="admAction" data-nav="Visão Consultor"><span class="ic">👥</span>Consulta por Consultor</button><button class="admAction" data-nav="Pesquisar PV"><span class="ic">🔎</span>Pesquisa de PV</button><button class="admAction blue" data-action="contracts"><span class="ic">📄</span>Contratos</button>'+
 '<button class="admAction green" data-nav="Atualizar Vendas"><span class="ic">📈</span>Atualizar Vendas</button><button class="admAction purple" data-nav="Materiais"><span class="ic">📚</span>Materiais de Apoio</button><button class="admAction green" data-nav="Telefones"><span class="ic">☎️</span>Telefones Úteis</button><button class="admAction orange" data-action="priority"><span class="ic">⚙️</span>Prioridade dos Incentivos</button></div></div>'+
 '<div><div class="admTitle"><h3>Incentivos e categorias</h3><small>↔ deslize para ver todos</small></div><div class="admCarousel">'+cats+'</div></div>'+
 '<div class="admPreview"><div class="admTitle"><h3>Acompanhamento da Equipe</h3><button data-nav="Acompanhamento">Ver relatório completo ›</button></div><div class="admPreviewWrap"><table><thead><tr><th>CATEGORIA</th>'+th+'<th>TOTAL</th></tr></thead><tbody>'+body+'</tbody></table></div></div>'+
 '<button class="admMore" id="admMoreTopics">☰ Abrir menu completo do administrador</button>';
 document.getElementById('admModernSearch').onclick=searchPv;document.getElementById('admModernPv').onkeydown=e=>{if(e.key==='Enter')searchPv()};
 QA('#adminModernHome [data-nav]').forEach(b=>b.onclick=()=>nav(b.dataset.nav));
 QA('#adminModernHome [data-action="contracts"]').forEach(b=>b.onclick=()=>{const x=document.getElementById('adminContractsCard');if(x)x.click()});
 QA('#adminModernHome [data-action="priority"]').forEach(b=>b.onclick=openPriority);
 QA('#adminModernHome [data-action="history"]').forEach(b=>b.onclick=()=>nav('Histórico de Acesso'));
 const toggle=()=>{document.getElementById('cokeHome')?.classList.toggle('showLegacyTopics');const on=document.getElementById('cokeHome')?.classList.contains('showLegacyTopics');document.getElementById('admMoreTopics').textContent=on?'▲ Ocultar menu completo':'☰ Abrir menu completo do administrador'};
 document.getElementById('admShowAll').onclick=toggle;document.getElementById('admMoreTopics').onclick=toggle;
}
let sig='';
setInterval(()=>{const d=getDash(),c=getConfig();const s=d?JSON.stringify([(d.team||[]).map(x=>[x.nome,x.realizado,x.meta]),(c?.incentivo_botoes||[]).map(x=>[x.id,x.ativo,x.ordem])]):'';if(s&&s!==sig){sig=s;render()}},900);
window.addEventListener('pageshow',()=>setTimeout(render,700));
})();