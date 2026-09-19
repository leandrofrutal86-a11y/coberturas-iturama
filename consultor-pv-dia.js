(()=>{
const DAYS=[
  {code:'SEG',label:'Segunda-feira'},
  {code:'TER',label:'Terça-feira'},
  {code:'QUA',label:'Quarta-feira'},
  {code:'QUI',label:'Quinta-feira'},
  {code:'SEX',label:'Sexta-feira'}
];
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selectedDay=currentDay(),clients=[],loading=false,lastKey='',reportData=null;

function currentDay(){const d=['DOM','SEG','TER','QUA','QUI','SEX','SAB'][new Date().getDay()];return DAYS.some(x=>x.code===d)?d:'SEG'}
function route(){return String(window.getIturamaContext?.()||window.__ituramaContext||document.querySelector('#route')?.textContent||'').trim()}
function dayLabel(code){return DAYS.find(x=>x.code===code)?.label||code}
function searchBox(){
  const root=document.getElementById('ov');
  if(!root)return null;
  const input=document.getElementById('pv'),btn=[...root.querySelectorAll('button')].find(b=>/Pesquisar/i.test(b.textContent||''));
  return input&&btn?{root,input,btn,body:root.querySelector('.sheetBody')}:null
}
function css(){
 if(document.getElementById('pvDiaStyleV2'))return;
 const s=document.createElement('style');s.id='pvDiaStyleV2';s.textContent=`
.pvDiaBox{margin:0 0 12px;background:#fff;border:1px solid #d7e0e7;border-radius:14px;padding:12px}
.pvDiaHead{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}.pvDiaHead b{font-size:15px}.pvDiaCount{font-size:11px;font-weight:900;color:#b40000;background:#fff0f0;padding:5px 8px;border-radius:999px}
.pvDiaFilters{display:grid;grid-template-columns:170px 1fr;gap:8px}.pvDiaFilters label{display:block;font-size:11px;font-weight:900;color:#596a78;margin-bottom:5px}.pvDiaSelect{width:100%;padding:12px;border:1px solid #cbd5df;border-radius:10px;background:#fff;font-size:14px}
.pvDiaHint{font-size:11px;color:#5f6d79;margin:8px 0}.pvDiaReportBtn{width:100%;border:0;border-radius:10px;padding:12px;background:#172534;color:#fff;font-weight:950}.pvDiaReportBtn:disabled{opacity:.6}.pvDiaLoading{padding:10px;text-align:center;color:#647482;font-weight:800}
.pvFallbackNotice{background:#fff3cd;color:#745300;border:1px solid #f1d476;border-radius:12px;padding:12px;margin:10px 0;font-weight:900}.pvFallbackTable td:first-child{font-weight:900}
.pvDayReportOverlay{display:none;position:fixed;inset:0;background:#0009;z-index:12050;padding:12px}.pvDayReportOverlay.show{display:flex;align-items:center;justify-content:center}.pvDayReportSheet{background:#f4f6f8;width:min(1120px,100%);max-height:96dvh;overflow:auto;border-radius:20px}.pvDayReportTop{position:sticky;top:0;z-index:3;background:linear-gradient(135deg,#090909,#9f0000);color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}.pvDayReportTop h2{margin:0;font-size:20px}.pvDayReportTopBtns{display:flex;gap:7px}.pvDayReportTop button{border:0;border-radius:9px;padding:9px 11px;font-weight:900}.pvDayReportBody{padding:14px 14px 120px}.pvDaySummary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.pvDaySum{background:#fff;border:1px solid #dde4e9;border-radius:12px;padding:11px}.pvDaySum b{display:block;font-size:11px;color:#647482}.pvDaySum strong{font-size:24px}.pvDayReportTable table{min-width:900px!important;font-size:11px}.pvDayReportTable th,.pvDayReportTable td{padding:8px!important;vertical-align:top}.pvDayMiss{display:flex;flex-wrap:wrap;gap:5px}.pvDayTag{display:inline-block;background:#ffe2e2;color:#a51414;padding:4px 7px;border-radius:999px;font-size:10px;font-weight:900}.pvDayOk{display:inline-block;background:#d9f3e6;color:#087249;padding:4px 7px;border-radius:999px;font-size:10px;font-weight:900}.pvDayPvBtn{border:0;background:#e30613;color:#fff;border-radius:8px;padding:7px 9px;font-weight:900}.pvDayProgress{text-align:center;padding:24px;color:#5e6f7e;font-weight:900}
@media(max-width:650px){.pvDiaFilters{grid-template-columns:1fr}.pvDayReportOverlay{padding:0}.pvDayReportSheet{width:100%;height:100dvh;max-height:100dvh;border-radius:0}.pvDaySummary{grid-template-columns:1fr}.pvDayReportTop h2{font-size:17px}.pvDayReportTopBtns{flex-direction:column}.pvDayReportTop button{font-size:10px;padding:7px}}
`;document.head.appendChild(s)
}
function ensureReportOverlay(){
 if(document.getElementById('pvDayReport'))return;
 document.body.insertAdjacentHTML('beforeend',`<div id="pvDayReport" class="pvDayReportOverlay"><div class="pvDayReportSheet"><div class="pvDayReportTop"><h2 id="pvDayReportTitle">Relatório da rota</h2><div class="pvDayReportTopBtns"><button id="pvDayPrint">IMPRIMIR / PDF</button><button id="pvDayReportClose">FECHAR</button></div></div><div id="pvDayReportBody" class="pvDayReportBody"></div></div></div>`);
 document.getElementById('pvDayReportClose').onclick=()=>document.getElementById('pvDayReport').classList.remove('show');
 document.getElementById('pvDayPrint').onclick=printReport;
}
async function getDayClients(force=false){
 const rt=route(),key=rt+'|'+selectedDay;
 if(!force&&key===lastKey&&clients.length)return clients;
 loading=true;renderPanel();
 try{
  const j=await api('day_clients',{day:selectedDay,rota:rt});
  clients=j.clients||[];lastKey=key;window.__pvDiaSelectedDay=selectedDay;window.__pvDiaClients=clients;
  renderPanel();return clients;
 }finally{loading=false;renderPanel()}
}
function renderPanel(){
 const b=searchBox();if(!b?.body)return;
 let box=b.body.querySelector('.pvDiaBox');
 if(!box){box=document.createElement('div');box.className='pvDiaBox';b.body.insertBefore(box,b.body.firstChild)}
 const dayOpts=DAYS.map(d=>`<option value="${d.code}" ${d.code===selectedDay?'selected':''}>${d.label}</option>`).join('');
 const cliOpts=clients.map(c=>`<option value="${esc(c.pv)}">${esc(c.ordem)} • ${esc(c.pv)} • ${esc(c.razao)}</option>`).join('');
 box.innerHTML=`<div class="pvDiaHead"><b>📍 Clientes por dia de visita</b><span class="pvDiaCount">${esc(route())} • ${clients.length} cliente(s)</span></div>
 <div class="pvDiaFilters"><div><label>DIA DA VISITA</label><select id="pvDiaDay" class="pvDiaSelect">${dayOpts}</select></div><div><label>CLIENTE DA ROTA</label><select id="pvDiaClient" class="pvDiaSelect" ${loading?'disabled':''}><option value="">${loading?'Carregando clientes...':'Selecione um cliente...'}</option>${cliOpts}</select></div></div>
 <div class="pvDiaHint">Ao escolher um cliente, o PV será pesquisado automaticamente. Você também pode digitar o PV normalmente no campo abaixo.</div>
 <button id="pvDiaReportBtn" class="pvDiaReportBtn" ${loading||!clients.length?'disabled':''}>📋 GERAR RELATÓRIO DE ${esc(dayLabel(selectedDay).toUpperCase())}</button>`;
 box.querySelector('#pvDiaDay').onchange=async e=>{selectedDay=e.target.value;clients=[];lastKey='';window.__pvDiaSelectedDay=selectedDay;await getDayClients(true)};
 const cs=box.querySelector('#pvDiaClient');if(cs)cs.onchange=async()=>{const pv=String(cs.value||'').trim();if(!pv)return;b.input.value=pv;b.input.dispatchEvent(new Event('input',{bubbles:true}));cs.disabled=true;try{if(typeof window.searchPv==='function')await window.searchPv();else b.btn.click()}finally{cs.disabled=false}};
 box.querySelector('#pvDiaReportBtn').onclick=openReport;
}
function fallbackClient(pv){return clients.find(x=>String(x.pv)===String(pv))}
function renderFallback(c){
 const out=document.getElementById('pvout');if(!out)return;
 let cats=[];try{cats=Array.isArray(DATA?.own)?DATA.own:[]}catch{}
 const rows=cats.map(x=>`<tr><td><b>${esc(x.nome)}</b></td><td><span class="pill no">✕ FALTA</span></td></tr>`).join('');
 out.innerHTML=`<div class="clientHead"><h3>${esc(c.razao||'Cliente')}</h3><b>PV ${esc(c.pv)}</b><br><small>${esc(c.subcanal||'')}</small></div><div class="pvFallbackNotice">Cliente programado na rota, ainda sem venda localizada na base atual.</div><div class="tableWrap pvFallbackTable"><table><thead><tr><th>Incentivo</th><th>Situação</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function ensureFallback(pv){
 const out=document.getElementById('pvout');if(!out||!/Cliente não encontrado/i.test(out.textContent||''))return false;
 const c=fallbackClient(pv);if(!c)return false;renderFallback(c);return true;
}
function wrapSearch(){
 const current=window.searchPv;
 if(typeof current!=='function'||current.__pvDiaV2)return;
 const wrapped=async function(){const pv=document.getElementById('pv')?.value?.trim();await current.apply(this,arguments);if(pv)ensureFallback(pv)};
 wrapped.__pvDiaV2=true;wrapped.__pvDiaOriginal=current;window.searchPv=wrapped;try{searchPv=wrapped}catch{}
}
function trioGroupName(g){const n=Number(g);return n===1?'Coca RefPet':n===2?'Coca LS':n===3?'Fanta RefPet':String(g)}
function missingText(x){
 const n=norm(x?.nome),parts=[];
 const miss=(x?.grupos||[]).filter(g=>!g.vendido);
 if(miss.length){
  const names=miss.map(g=>n.includes('TRIO PAO DE QUEIJO')?trioGroupName(g.grupo):String(g.grupo||'Item'));
  return `${x.nome}: ${names.join(' / ')}`;
 }
 if(Number(x?.falta_quantidade||0)>0)return `${x.nome}: faltam ${x.falta_quantidade} caixa(s)`;
 if(Number(x?.falta_compras||0)>0)return `${x.nome}: falta(m) ${x.falta_compras} compra(s)`;
 return String(x?.nome||'');
}
function buildReportRows(data){
 return (data.clients||[]).map(c=>{const faltas=(c.faltas||[]).map(missingText).filter(Boolean);return{...c,_faltas:faltas}})
}
async function openReport(){
 ensureReportOverlay();const ov=document.getElementById('pvDayReport'),body=document.getElementById('pvDayReportBody'),title=document.getElementById('pvDayReportTitle');
 ov.classList.add('show');title.textContent=`Relatório • ${route()} • ${dayLabel(selectedDay)}`;body.innerHTML='<div class="pvDayProgress">Gerando relatório e conferindo as vendas atuais...</div>';
 try{
  const j=await api('day_report',{day:selectedDay,rota:route()});reportData={...j,clients:buildReportRows(j)};
  renderReport(reportData);
 }catch(e){body.innerHTML=`<div class="pvDayProgress">${esc(e.message||'Não foi possível gerar o relatório.')}</div>`}
}
function renderReport(data){
 const body=document.getElementById('pvDayReportBody'),rows=data.clients||[],opp=rows.filter(x=>x._faltas.length),ok=rows.length-opp.length;
 body.innerHTML=`<div class="pvDaySummary"><div class="pvDaySum"><b>CLIENTES DO DIA</b><strong>${rows.length}</strong></div><div class="pvDaySum"><b>COM OPORTUNIDADE</b><strong>${opp.length}</strong></div><div class="pvDaySum"><b>COBERTOS</b><strong>${ok}</strong></div></div>
 <div class="tableWrap pvDayReportTable"><table><thead><tr><th>ORDEM</th><th>PV</th><th>CLIENTE</th><th>SUBCANAL</th><th>O QUE FALTA</th><th></th></tr></thead><tbody>${rows.length?rows.map(c=>`<tr><td><b>${esc(c.ordem)}</b></td><td><b>${esc(c.pv)}</b></td><td>${esc(c.razao)}</td><td>${esc(c.subcanal)}</td><td>${c._faltas.length?`<div class="pvDayMiss">${c._faltas.map(x=>`<span class="pvDayTag">${esc(x)}</span>`).join('')}</div>`:'<span class="pvDayOk">✓ COBERTO</span>'}</td><td><button class="pvDayPvBtn" data-pv="${esc(c.pv)}">Pesquisar</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">Nenhum cliente programado neste dia.</td></tr>'}</tbody></table></div>`;
 body.querySelectorAll('[data-pv]').forEach(b=>b.onclick=()=>openPvFromReport(b.dataset.pv));
}
function openPvFromReport(pv){
 document.getElementById('pvDayReport')?.classList.remove('show');if(typeof window.openPv==='function')window.openPv();else if(typeof openPv==='function')openPv();
 setTimeout(()=>{const i=document.getElementById('pv');if(i)i.value=pv;if(typeof window.searchPv==='function')window.searchPv();else if(typeof searchPv==='function')searchPv()},100);
}
function printReport(){
 if(!reportData)return;
 const rows=reportData.clients||[],opp=rows.filter(x=>x._faltas.length).length,w=window.open('','_blank');if(!w)return alert('O navegador bloqueou a janela de impressão.');
 const trs=rows.map(c=>`<tr><td>${esc(c.ordem)}</td><td>${esc(c.pv)}</td><td>${esc(c.razao)}</td><td>${esc(c.subcanal)}</td><td>${c._faltas.length?c._faltas.map(esc).join('<br>'):'COBERTO'}</td></tr>`).join('');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Relatório ${esc(reportData.route)} ${esc(reportData.day)}</title><style>@page{size:A4 landscape;margin:8mm}body{font-family:Arial,sans-serif;color:#111}h1{font-size:20px;margin:0 0 4px}p{margin:0 0 12px}table{border-collapse:collapse;width:100%;font-size:9px}th,td{border:1px solid #aaa;padding:5px;vertical-align:top}th{background:#eee;text-align:left}</style></head><body><h1>Relatório de visitas • ${esc(reportData.route)} • ${esc(dayLabel(reportData.day))}</h1><p>${rows.length} clientes • ${opp} com oportunidade • ${rows.length-opp} cobertos</p><table><thead><tr><th>Ordem</th><th>PV</th><th>Cliente</th><th>Subcanal</th><th>O que falta</th></tr></thead><tbody>${trs}</tbody></table><script>window.onload=()=>setTimeout(()=>window.print(),200)<\/script></body></html>`);w.document.close();
}
async function inject(force=false){
 css();ensureReportOverlay();wrapSearch();const b=searchBox();if(!b)return;
 renderPanel();
 const key=route()+'|'+selectedDay;if(force||key!==lastKey||!clients.length)await getDayClients(force);
}
function watch(){
 inject().catch(()=>{});
 setInterval(()=>{wrapSearch();const ov=document.getElementById('ov');if(ov?.classList.contains('show'))inject(false).catch(()=>{})},700);
}
window.addEventListener('iturama:routechange',()=>{clients=[];lastKey='';inject(true).catch(()=>{})});
window.__openPvDayReport=()=>openReport();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();