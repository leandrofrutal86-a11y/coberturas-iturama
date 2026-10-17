(()=>{
'use strict';
const d=document,w=window;
const $=(s,r=d)=>r.querySelector(s), $$=(s,r=d)=>[...r.querySelectorAll(s)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const n=v=>Number(v||0);
const ALLOWED=new Set(['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios']);

function getDash(){try{return typeof dash!=='undefined'?dash:null}catch{return null}}
function getTeam(){
  const x=getDash();
  return Array.isArray(x?.individual)?x.individual:[];
}
function getTeamCats(){
  const x=getDash();
  return Array.isArray(x?.team)?x.team:[];
}

function css(){
 if(d.getElementById('admTeamRestructureStyle'))return;
 const s=d.createElement('style');s.id='admTeamRestructureStyle';s.textContent=`
.topicIncentivos{display:none!important}
#admQuickNav,#admQuickOverlay{display:none!important}
#app:not(.hide){padding-bottom:0!important}
#app.admSideReady>.wrap{padding-bottom:28px!important}
#admTeamView{position:fixed;inset:0;z-index:500;background:#f2f5f8;overflow:auto;color:#142236;font-family:Arial,sans-serif}
#admTeamView[hidden]{display:none!important}
.atvTop{position:sticky;top:0;z-index:5;background:linear-gradient(120deg,#060606,#161616 62%,#9b0000);color:#fff;border-bottom:4px solid #e30613;padding:15px 18px;box-shadow:0 5px 18px #0002}
.atvTopIn{width:min(1180px,100%);margin:auto;display:flex;align-items:center;gap:14px}
.atvBrand{min-width:0;flex:1}.atvBrand b{display:block;font-size:22px}.atvBrand small{display:block;margin-top:3px;color:#eee}
.atvAccess{background:#fff;color:#bd0010;border-radius:999px;padding:9px 13px;font-weight:950;white-space:nowrap}
.atvBack{border:1px solid #ffffff80;background:#ffffff12;color:#fff;border-radius:11px;padding:10px 14px;font-weight:900;white-space:nowrap}
.atvWrap{width:min(1180px,calc(100% - 22px));margin:18px auto 42px}
.atvHello{background:#fff;border:1px solid #e0e7ed;border-radius:21px;padding:17px 19px;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 7px 20px #172b400d}
.atvHello h1{font-size:27px;margin:0}.atvHello p{margin:5px 0 0;color:#66788a}
.atvSelect{min-width:280px;padding:12px;border:1px solid #cfd8e1;border-radius:12px;background:#fff;font-weight:900;color:#183047}
.atvStats{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;margin-top:13px}
.atvStat{background:#fff;border:1px solid #e1e7ed;border-radius:17px;padding:14px;box-shadow:0 5px 14px #172b400b}
.atvStat span{display:block;font-size:10px;font-weight:950;color:#607386}.atvStat b{display:block;font-size:26px;margin-top:5px}
.atvTitle{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:22px 2px 10px}.atvTitle h2{margin:0;font-size:21px}.atvTitle small{color:#718294}
.atvCats{display:flex;gap:10px;overflow-x:auto;padding:2px 1px 10px;scroll-snap-type:x proximity;scrollbar-width:none}.atvCats::-webkit-scrollbar{display:none}
.atvCat{flex:0 0 170px;min-height:145px;border:0;border-radius:20px;padding:15px;text-align:left;color:#fff;position:relative;scroll-snap-align:start;box-shadow:0 7px 16px #172b4020;background:linear-gradient(145deg,#ed1c24,#9e0008)}
.atvCat:nth-child(6n+2){background:linear-gradient(145deg,#1771dd,#0b3a8e)}.atvCat:nth-child(6n+3){background:linear-gradient(145deg,#14a05a,#075e34)}.atvCat:nth-child(6n+4){background:linear-gradient(145deg,#ff9b21,#cc5b00)}.atvCat:nth-child(6n+5){background:linear-gradient(145deg,#7b39c6,#4b1b89)}.atvCat:nth-child(6n){background:linear-gradient(145deg,#1f7f88,#0d4f56)}
.atvCat b{display:block;font-size:14px;line-height:1.15;padding-right:18px}.atvCat small{display:block;margin-top:12px;color:#fff}.atvCat i{display:block;height:6px;background:#ffffff38;border-radius:999px;margin-top:10px;overflow:hidden}.atvCat i:after{content:'';display:block;height:100%;width:var(--p);background:#fff;border-radius:inherit}.atvCat em{position:absolute;right:12px;bottom:9px;font-size:25px;font-style:normal}
.atvTableBox{background:#fff;border:1px solid #e1e7ed;border-radius:20px;padding:14px;box-shadow:0 6px 18px #172b400d;overflow:hidden}.atvScroll{overflow:auto}.atvTable{border-collapse:collapse;width:100%;min-width:760px}.atvTable th,.atvTable td{padding:10px 8px;border-bottom:1px solid #edf1f4;text-align:center;font-size:12px}.atvTable th{background:#f4f7f9;color:#30485d}.atvTable th:first-child,.atvTable td:first-child{text-align:left;font-weight:900}.atvGood{color:#08764a;font-weight:950}.atvBad{color:#c51620;font-weight:950}
.atvEmpty{padding:28px;text-align:center;color:#6c7b89}
@media(max-width:780px){.atvTopIn{flex-wrap:wrap}.atvBrand{flex-basis:calc(100% - 130px)}.atvAccess{order:3}.atvHello{align-items:flex-start;flex-direction:column}.atvHello h1{font-size:24px}.atvSelect{width:100%;min-width:0}.atvStats{grid-template-columns:1fr 1fr}.atvCat{flex-basis:145px}.atvBack{padding:9px 11px}}
`;d.head.appendChild(s);
}

function getCardLabel(card){return norm(card.querySelector('b')?.textContent||card.textContent)}
function patchHome(){
 const home=d.getElementById('cokeHome');if(!home)return;
 const inc=home.querySelector('.topicIncentivos');if(inc)inc.remove();
 const vendas=home.querySelector('.topicVendas .menuGrid');if(!vendas)return;
 $$('.menuCard',vendas).forEach(card=>{const label=getCardLabel(card);if(!ALLOWED.has(label))card.remove()});
 if(!$$('.menuCard',vendas).some(c=>getCardLabel(c)==='visao da equipe')){
   const b=d.createElement('button');b.type='button';b.className='menuCard';b.id='admTeamViewCard';
   b.innerHTML='<span class="mi" style="background:#e30613">👥</span><span><b>Visão da Equipe</b><small>Visão geral da equipe no padrão do supervisor</small></span>';
   b.onclick=openTeam;
   vendas.insertBefore(b,vendas.firstChild);
 }
 // Ordena exatamente como solicitado.
 const order=['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios'];
 const cards=$$('.menuCard',vendas);
 cards.sort((a,b)=>order.indexOf(getCardLabel(a))-order.indexOf(getCardLabel(b))).forEach(x=>vendas.appendChild(x));
}

function patchSidebar(){
 const nav=d.getElementById('admSideNav');if(!nav)return;
 // Remove o grupo Incentivos quando o menu lateral for reconstruído.
 $$('.admTopic',nav).forEach(g=>{const t=norm(g.querySelector('.admTopicHead')?.dataset.topic||g.querySelector('.admTopicHead')?.textContent);if(t.includes('incentivos'))g.remove()});
}

function ensureView(){
 if(d.getElementById('admTeamView'))return d.getElementById('admTeamView');
 css();
 const v=d.createElement('section');v.id='admTeamView';v.hidden=true;
 v.innerHTML='<div class="atvTop"><div class="atvTopIn"><div class="atvBrand"><b>Equipe Iturama • Visão da Equipe</b><small>Dashboard do supervisor</small></div><span class="atvAccess">Leão • Supervisor</span><button type="button" class="atvBack" id="atvBack">← Voltar ao DM</button></div></div><main class="atvWrap"><section class="atvHello"><div><h1>Olá, Leão</h1><p>Visão consolidada da equipe e resultados por consultor.</p></div><select id="atvRoute" class="atvSelect"></select></section><section id="atvStats" class="atvStats"></section><div class="atvTitle"><h2 id="atvCatTitle">Coberturas da Equipe</h2><small>↔ deslize para ver todas</small></div><section id="atvCats" class="atvCats"></section><div class="atvTitle"><h2>Visão detalhada</h2><small id="atvDetailHint"></small></div><section class="atvTableBox"><div id="atvDetail"></div></section></main>';
 d.body.appendChild(v);
 d.getElementById('atvBack').onclick=closeTeam;
 d.getElementById('atvRoute').onchange=renderTeam;
 return v;
}
function openTeam(){
 const v=ensureView();v.hidden=false;renderTeam();try{w.scrollTo(0,0)}catch{}
}
function closeTeam(){
 const v=d.getElementById('admTeamView');if(v)v.hidden=true;
 try{w.show?.()}catch{}
 try{w.scrollTo(0,0)}catch{}
}
function routeOptions(){
 const team=getTeam();
 return '<option value="TEAM">👥 Toda a Equipe</option>'+team.map(p=>'<option value="'+E(p.rota)+'">👤 '+E(p.rota)+' - '+E(p.nome||'Consultor')+'</option>').join('');
}
function currentRows(route){
 const team=getTeam(),cats=getTeamCats();
 if(route==='TEAM')return cats.map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
 const p=team.find(x=>String(x.rota)===route);
 return (p?.resultados||[]).map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
}
function renderTeam(){
 const v=ensureView(),sel=d.getElementById('atvRoute');if(v.hidden)return;
 const old=sel.value||'TEAM';sel.innerHTML=routeOptions();sel.value=[...sel.options].some(o=>o.value===old)?old:'TEAM';
 const route=sel.value,rows=currentRows(route),team=getTeam();
 const totalMeta=rows.reduce((s,x)=>s+n(x.meta),0),real=rows.reduce((s,x)=>s+n(x.realizado),0),falta=Math.max(0,rows.reduce((s,x)=>s+n(x.falta),0)),pct=totalMeta?Math.round(real/totalMeta*100):0;
 const selected=route==='TEAM'?null:team.find(x=>String(x.rota)===route);
 d.getElementById('atvStats').innerHTML=[
   ['REALIZADO',real,route==='TEAM'?'coberturas da equipe':'coberturas do consultor'],
   ['META',totalMeta,'meta total'],
   ['ATINGIMENTO',pct+'%','percentual atual'],
   [route==='TEAM'?'CONSULTORES':'FALTA',route==='TEAM'?team.length:falta,route==='TEAM'?'equipe cadastrada':'coberturas pendentes']
 ].map(x=>'<div class="atvStat"><span>'+x[0]+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></div>').join('');
 d.getElementById('atvCatTitle').textContent=route==='TEAM'?'Coberturas da Equipe':'Coberturas • '+(selected?.rota||route)+' - '+(selected?.nome||'');
 d.getElementById('atvCats').innerHTML=rows.map(x=>{const p=x.meta?Math.min(100,Math.round(x.realizado/x.meta*100)):0;return '<button class="atvCat" type="button" data-cat="'+E(x.nome)+'"><b>'+E(x.nome)+'</b><small>'+x.realizado+' / '+x.meta+' realizados</small><i style="--p:'+p+'%"></i><em>›</em></button>'}).join('');
 $$('.atvCat',d.getElementById('atvCats')).forEach(b=>b.onclick=()=>renderDetail(b.dataset.cat));
 renderDetail('');
}
function renderDetail(cat){
 const route=d.getElementById('atvRoute')?.value||'TEAM',team=getTeam(),cats=getTeamCats();
 const detail=d.getElementById('atvDetail'),hint=d.getElementById('atvDetailHint');if(!detail)return;
 hint.textContent=cat|| (route==='TEAM'?'Comparativo por consultor':'Resumo das categorias');
 if(route==='TEAM'){
   const use=cat?cats.filter(x=>x.nome===cat):cats;
   const heads=team.map(p=>'<th>'+E(p.rota)+'<br><small>'+E(String(p.nome||'').split(' ')[0])+'</small></th>').join('');
   const body=use.map(c=>{const cells=team.map(p=>{const r=(p.resultados||[]).find(x=>x.nome===c.nome)||{};const ok=n(r.meta)>0&&n(r.realizado)>=n(r.meta);return '<td class="'+(ok?'atvGood':'atvBad')+'">'+n(r.realizado)+'/'+n(r.meta)+'<br><small>'+n(r.percentual)+'%</small></td>'}).join('');return '<tr><td>'+E(c.nome)+'</td>'+cells+'<td><b>'+n(c.realizado)+'/'+n(c.meta)+'</b><br><small>'+n(c.percentual)+'%</small></td></tr>'}).join('');
   detail.innerHTML='<div class="atvScroll"><table class="atvTable"><thead><tr><th>CATEGORIA</th>'+heads+'<th>TOTAL</th></tr></thead><tbody>'+body+'</tbody></table></div>';
 }else{
   const p=team.find(x=>String(x.rota)===route),rows=(p?.resultados||[]).filter(x=>!cat||x.nome===cat);
   detail.innerHTML=rows.length?'<div class="atvScroll"><table class="atvTable"><thead><tr><th>CATEGORIA</th><th>META</th><th>REALIZADO</th><th>FALTA</th><th>%</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+E(x.nome)+'</td><td>'+n(x.meta)+'</td><td class="'+(n(x.meta)>0&&n(x.realizado)>=n(x.meta)?'atvGood':'atvBad')+'">'+n(x.realizado)+'</td><td>'+n(x.falta)+'</td><td>'+n(x.percentual)+'%</td></tr>').join('')+'</tbody></table></div>':'<div class="atvEmpty">Sem dados para exibir.</div>';
 }
}

function sweep(){
 css();
 d.getElementById('admQuickNav')?.remove();d.getElementById('admQuickOverlay')?.remove();
 patchHome();patchSidebar();
 if(!d.getElementById('admTeamView')?.hidden)renderTeam();
}
let tries=0;const timer=setInterval(()=>{sweep();if(++tries>120)clearInterval(timer)},500);
new MutationObserver(()=>setTimeout(sweep,0)).observe(d.body,{childList:true,subtree:true});
w.addEventListener('pageshow',()=>setTimeout(sweep,250));
})();