(()=>{
'use strict';
const DAYS=['DOM','SEG','TER','QUA','QUI','SEX','SAB'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
let visits=[],visitsLoaded=false,scanId=0;

function parse(text){const ls=text.trim().split(/\r?\n/);if(!ls.length)return[];const h=ls.shift().split(';');return ls.filter(Boolean).map(l=>{const a=l.split(';'),o={};h.forEach((k,i)=>o[k]=a[i]||'');return o})}
async function loadVisits(){if(visitsLoaded)return;const fs=[0,1,2,3,4].map(i=>`admin-app/visitas_full_part${i}.csv?v=20261017-opp-v03`);const parts=await Promise.all(fs.map(f=>fetch(f,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Não foi possível carregar a base de clientes.');return r.text()})));visits=parts.flatMap(parse);visitsLoaded=true}
function route(){return String(window.getIturamaContext?.()||window.__ituramaContext||document.getElementById('route')?.textContent||'').trim()}
function chosenDay(){const s=String(sessionStorage.getItem('pv_dia_visita')||'').toUpperCase();if(['SEG','TER','QUA','QUI','SEX'].includes(s))return s;const d=DAYS[new Date().getDay()];return ['SEG','TER','QUA','QUI','SEX'].includes(d)?d:'SEG'}
function seedRows(){try{const a=route()==='TEAM'?(Array.isArray(DATA?.team)?DATA.team:[]):(Array.isArray(DATA?.own)?DATA.own:[]);return (a||[]).filter(x=>!norm(x?.nome).includes('IMPERDO'))}catch{return[]}}
function clientBase(scope){
 const rt=route(),day=scope==='ALL'?chosenDay():scope;
 const raw=visits.filter(x=>(rt==='TEAM'||String(x.Rota||'').trim()===rt)&&(scope==='ALL'||Number(x[day]||0)>0));
 const m=new Map();
 for(const x of raw){const key=String(x.Rota||'').trim()+'|'+String(x.Cliente||'').trim();const y={...x,_ord:Number(x[day]||9999)};if(!m.has(key)||y._ord<m.get(key)._ord)m.set(key,y)}
 return [...m.values()].sort((a,b)=>String(a.Rota||'').localeCompare(String(b.Rota||''))||(a._ord||9999)-(b._ord||9999)||String(a['Razão Social']||'').localeCompare(String(b['Razão Social']||''),'pt-BR'));
}
function opportunityFromResult(x){
 if(!x)return false;
 if(Object.prototype.hasOwnProperty.call(x,'realizado'))return !Boolean(x.realizado);
 const n=norm(x.nome),st=norm(x.status);
 if(n.includes('RECOMPRA B2B'))return st!=='RECOMPRA';
 if(n.includes('COMPRA B2B'))return st==='SEM COMPRA'||!st;
 if(n.includes('OPORTUNIDADE B2B'))return st!=='RECOMPRA';
 return false;
}
function detailFromResult(x){if(!x)return '';const missing=(x.grupos||[]).filter(g=>!g.vendido).map(g=>`Grupo ${g.grupo}`);if(missing.length)return 'Falta: '+missing.join(', ');const st=String(x.status||'').trim();return st}

function css(){if(document.getElementById('oppDayStyleV3'))return;const s=document.createElement('style');s.id='oppDayStyleV3';s.textContent=`
.oppOverlay{display:none;position:fixed;inset:0;background:#0009;z-index:25000;padding:12px}.oppOverlay.show{display:flex;align-items:center;justify-content:center}.oppSheet{background:#f4f6f8;width:min(980px,100%);max-height:96dvh;overflow:auto;border-radius:20px}.oppTop{position:sticky;top:0;z-index:4;background:linear-gradient(135deg,#090909,#9f0000);color:#fff;padding:15px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}.oppTop h2{margin:0;font-size:21px}.oppTopSub{display:block;margin-top:4px;font-size:11px;line-height:1.25;color:#ffe8e8;font-weight:700}.oppTop button{border:0;border-radius:10px;background:#fff;padding:10px 14px;font-weight:900}.oppBody{padding:14px 14px 120px}.oppControl{background:#fff;border:1px solid #dce4ea;border-radius:16px;padding:14px;display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end}.oppControl label{display:block;font-size:10px;font-weight:950;color:#627383;margin-bottom:5px}.oppControl select{width:100%;padding:12px;border:1px solid #cbd6df;border-radius:10px;background:#fff;font-weight:800}.oppGo{border:0;border-radius:10px;background:#e30613;color:#fff;padding:12px 16px;font-weight:950}.oppHint{margin-top:10px;padding:10px 12px;border-radius:12px;background:#eaf4ff;color:#264b69;font-size:11px}.oppProgress{height:7px;background:#e3e8ed;border-radius:999px;overflow:hidden;margin-top:10px}.oppProgress i{display:block;height:100%;background:#1378d4;width:0;transition:.2s}.oppList{margin-top:12px;background:#fff;border:1px solid #dce4ea;border-radius:14px;padding:12px}.oppList h3{margin:0 0 10px;color:#17344f}.oppTable{overflow:auto}.oppTable table{width:100%;min-width:760px;border-collapse:collapse;font-size:12px}.oppTable th{background:#d90000;color:#fff;padding:9px;text-align:left}.oppTable td{padding:9px;border-bottom:1px solid #dce4ea}.oppTable tbody tr:nth-child(odd){background:#edf5fb}.oppTable tbody tr:nth-child(even){background:#fff}.oppPvBtn{border:0;background:#e30613;color:#fff;border-radius:8px;padding:7px 9px;font-weight:900;white-space:nowrap}.oppTag{font-size:10px;font-weight:900;background:#fff0d8;color:#7c5200;padding:4px 7px;border-radius:999px;display:inline-block}.oppLoading{text-align:center;padding:28px;color:#5f6f7d;font-weight:800}.cmOppSection{margin-top:2px}.cmOppBtn{width:100%;border:1px solid #d6e1ea;background:linear-gradient(135deg,#ffffff,#eef7ff);border-radius:18px;padding:14px;display:flex;align-items:center;gap:12px;text-align:left;color:#17344f;box-shadow:0 5px 15px #172b400d}.cmOppBtn .ico{width:46px;height:46px;border-radius:13px;background:#e30613;color:#fff;display:grid;place-items:center;font-size:24px;flex:0 0 auto}.cmOppBtn b{display:block;font-size:17px}.cmOppBtn small{display:block;color:#657687;margin-top:3px;font-size:11px}.cmOppBtn:after{content:'›';margin-left:auto;font-size:28px;color:#e30613;font-weight:950}@media(max-width:650px){.oppOverlay{padding:0}.oppSheet{width:100%;height:100dvh;max-height:100dvh;border-radius:0}.oppBody{padding:12px 10px 120px}.oppControl{grid-template-columns:1fr}.oppGo{width:100%}.oppTop h2{font-size:18px}}`;document.head.appendChild(s)}
function overlay(){if(document.getElementById('oppDay'))return;document.body.insertAdjacentHTML('beforeend',`<div id="oppDay" class="oppOverlay cvOverlay"><div class="oppSheet cvSheet"><div class="oppTop cvTop"><div><h2>💡 Oportunidades</h2><small class="oppTopSub">Pesquise os clientes que ainda não compraram as coberturas.</small></div><button id="oppClose">Fechar</button></div><div id="oppBody" class="oppBody"></div></div></div>`);document.getElementById('oppClose').onclick=()=>document.getElementById('oppDay').classList.remove('show')}
function categoryOptions(){return seedRows().map(x=>`<option value="${esc(norm(x.nome))}">${esc(x.nome)}</option>`).join('')}
function renderControls(){const body=document.getElementById('oppBody');if(!body)return;body.innerHTML=`<div class="oppControl"><div><label>CLIENTES</label><select id="oppScope"><option value="SEG">Segunda-feira</option><option value="TER">Terça-feira</option><option value="QUA">Quarta-feira</option><option value="QUI">Quinta-feira</option><option value="SEX">Sexta-feira</option><option value="ALL">Todos os clientes</option></select></div><div><label>CATEGORIA</label><select id="oppCategory"><option value="">Selecione a categoria...</option>${categoryOptions()}</select></div><button id="oppGo" class="oppGo">Ver oportunidades</button></div><div class="oppHint">Pesquise os clientes que ainda não compraram as coberturas. O sistema considera os parâmetros atuais de cada cobertura e mostra somente clientes realmente elegíveis.</div><div id="oppStatus"></div><div id="oppResult"></div>`;const scope=document.getElementById('oppScope'),def=chosenDay();if(scope&&[...scope.options].some(o=>o.value===def))scope.value=def;document.getElementById('oppGo').onclick=scan}
function progress(done,total){const el=document.getElementById('oppStatus');if(!el)return;el.innerHTML=`<div class="oppHint">Analisando ${done} de ${total} cliente(s)...<div class="oppProgress"><i style="width:${total?Math.round(done/total*100):100}%"></i></div></div>`}
async function scan(){
 const myId=++scanId,scope=document.getElementById('oppScope')?.value||chosenDay(),catKey=document.getElementById('oppCategory')?.value||'';
 if(!catKey)return alert('Escolha uma categoria.');
 await loadVisits();
 const list=clientBase(scope),rt=route(),day=chosenDay(),out=[];
 const resultBox=document.getElementById('oppResult');if(resultBox)resultBox.innerHTML='<div class="oppLoading">Verificando clientes...</div>';
 let next=0,done=0;
 async function worker(){
   while(next<list.length&&myId===scanId){
     const c=list[next++],pv=String(c.Cliente||'').trim();let result=null;
     try{const req={pv};if(rt==='TEAM'&&c.Rota)req.rota=String(c.Rota).trim();result=await api('search_pv',req)}catch{}
     if(myId!==scanId)return;
     if(result?.found){
       const x=(result.categorias||[]).find(y=>norm(y.nome)===catKey);
       // A presença da categoria na Pesquisa de PV é a validação de elegibilidade/parâmetros.
       if(x&&opportunityFromResult(x))out.push({pv,razao:String(c['Razão Social']||result?.cliente?.razao||''),rota:String(c.Rota||rt),ord:scope==='DAY'?(c._ord||''):'',subcanal:String(c.SubCanal||result?.cliente?.subcanal||''),detalhe:detailFromResult(x)});
     }
     done++;progress(done,list.length);
   }
 }
 await Promise.all(Array.from({length:Math.min(6,list.length||1)},worker));
 if(myId!==scanId)return;
 renderList(out,scope,scope==='ALL'?day:scope,catKey,list.length);
}
function renderList(rows,scope,day,catKey,total){
 const box=document.getElementById('oppResult'),seed=seedRows().find(x=>norm(x.nome)===catKey),name=seed?.nome||catKey;
 if(!box)return;
 rows.sort((a,b)=>String(a.rota).localeCompare(String(b.rota))||Number(a.ord||9999)-Number(b.ord||9999)||a.razao.localeCompare(b.razao,'pt-BR'));
 box.innerHTML=`<div class="oppList"><h3>💡 ${esc(name)} • ${rows.length} oportunidade(s)</h3><div class="oppHint">${scope==='ALL'?'Todos os clientes da carteira':esc(({SEG:'Segunda-feira',TER:'Terça-feira',QUA:'Quarta-feira',QUI:'Quinta-feira',SEX:'Sexta-feira'}[scope]||scope))+' • clientes programados no dia'} • ${total} cliente(s) analisado(s)</div>${rows.length?`<div class="oppTable"><table><thead><tr><th>Ordem</th><th>PV</th><th>Cliente</th><th>Subcanal</th><th>Detalhe</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.ord)}</td><td><b>${esc(x.pv)}</b>${route()==='TEAM'?`<br><small>${esc(x.rota)}</small>`:''}</td><td>${esc(x.razao)}</td><td>${esc(x.subcanal)}</td><td>${x.detalhe?`<span class="oppTag">${esc(x.detalhe)}</span>`:''}</td><td><button type="button" class="oppPvBtn" data-pv="${esc(x.pv)}">Pesquisar PV</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="oppLoading">Nenhuma oportunidade para esta categoria neste filtro.</div>'}</div>`;
 box.querySelectorAll('.oppPvBtn').forEach(b=>b.onclick=()=>openPvFromOpp(b.dataset.pv));
}
function openPvFromOpp(pv){document.getElementById('oppDay')?.classList.remove('show');if(typeof window.openPv==='function')window.openPv();else if(typeof openPv==='function')openPv();setTimeout(()=>{const i=document.getElementById('pv');if(i)i.value=pv;if(typeof window.searchPv==='function')window.searchPv();else if(typeof searchPv==='function')searchPv()},120)}
async function open(){css();overlay();document.getElementById('oppDay').classList.add('show');renderControls()}
function installLegacy(){const old=document.getElementById('cvOppBtn');if(old)old.remove()}
window.openIturamaOpportunities=open;
window.addEventListener('iturama:routechange',()=>{if(document.getElementById('oppDay')?.classList.contains('show'))renderControls()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{css();overlay();installLegacy()});else{css();overlay();installLegacy()}
setTimeout(installLegacy,700);
})();