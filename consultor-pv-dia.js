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
const savedDay=sessionStorage.getItem('pv_dia_visita')||'';let selectedDay=DAYS.some(x=>x.code===savedDay)?savedDay:currentDay(),clients=[],loading=false,lastKey='',reportData=null;

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
.pvDayChoices{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0 10px}.pvDayChoice{border:1px solid #cbd5df;background:#f5f7f9;color:#263746;border-radius:9px;padding:9px 4px;font-size:11px;font-weight:950}.pvDayChoice.active{background:#e30613;color:#fff;border-color:#e30613}.pvDiaFilters{display:grid;grid-template-columns:170px 1fr;gap:8px}.pvDiaFilters label{display:block;font-size:11px;font-weight:900;color:#596a78;margin-bottom:5px}.pvDiaSelect{width:100%;padding:12px;border:1px solid #cbd5df;border-radius:10px;background:#fff;font-size:14px}
.pvDiaHint{font-size:11px;color:#5f6d79;margin:8px 0}.pvDiaReportBtn{width:100%;border:0;border-radius:10px;padding:12px;background:#172534;color:#fff;font-weight:950}.pvDiaReportBtn:disabled{opacity:.6}.pvDiaLoading{padding:10px;text-align:center;color:#647482;font-weight:800}
.pvFallbackNotice{background:#fff3cd;color:#745300;border:1px solid #f1d476;border-radius:12px;padding:12px;margin:10px 0;font-weight:900}.pvFallbackTable td:first-child{font-weight:900}
.pvDayReportOverlay{display:none;position:fixed;inset:0;background:#0009;z-index:12050;padding:12px}.pvDayReportOverlay.show{display:flex;align-items:center;justify-content:center}.pvDayReportSheet{background:#f4f6f8;width:min(1120px,100%);max-height:96dvh;overflow:auto;border-radius:20px}.pvDayReportTop{position:sticky;top:0;z-index:3;background:linear-gradient(135deg,#090909,#9f0000);color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}.pvDayReportTop h2{margin:0;font-size:20px}.pvDayReportTopBtns{display:flex;gap:7px}.pvDayReportTop button{border:0;border-radius:9px;padding:9px 11px;font-weight:900}.pvDayReportBody{padding:14px 14px 120px}.pvDaySummary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.pvDaySum{background:#fff;border:1px solid #dde4e9;border-radius:12px;padding:11px}.pvDaySum b{display:block;font-size:11px;color:#647482}.pvDaySum strong{font-size:24px}.pvDayClientGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:10px}.pvDayClientCard{background:#fff;border:1px solid #dce3e9;border-radius:15px;padding:12px;box-shadow:0 2px 8px #00000008}.pvDayClientTop{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.pvDayClientId{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.pvDayOrder{display:inline-grid;place-items:center;min-width:30px;height:28px;padding:0 8px;border-radius:999px;background:#172534;color:#fff;font-weight:950}.pvDayClientCard h3{margin:8px 0 3px;font-size:15px;line-height:1.2}.pvDayClientCard small{color:#657584}.pvDayOppCount{background:#ffe2e2;color:#a51414;border-radius:999px;padding:6px 8px;font-size:10px;font-weight:950;white-space:nowrap}.pvDayCovered{background:#d9f3e6;color:#087249;border-radius:999px;padding:6px 8px;font-size:10px;font-weight:950;white-space:nowrap}.pvDayMissingTitle{margin-top:10px;border-top:1px solid #edf0f2;padding-top:10px;font-size:12px;font-weight:950;color:#b01414}.pvDayMissingList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:7px}.pvDayMissingRow{background:#fff5f5;border:1px solid #f3d1d1;border-radius:9px;padding:6px 7px}.pvDayMissingRow b{display:block;font-size:10px;color:#981818;margin-bottom:2px;line-height:1.12}.pvDayMissingRow.simple{display:flex;align-items:center;justify-content:space-between;gap:5px;min-height:34px}.pvDayMissingRow.simple b{margin:0}.pvDayX{color:#e30613;font-weight:950;font-size:15px;line-height:1}.pvDayProducts{display:grid;gap:2px;margin-top:2px}.pvDayProduct{display:flex;align-items:flex-start;gap:4px;font-size:9.5px;color:#4d5964;line-height:1.15}.pvDayProduct .pvDayX{font-size:12px;flex:0 0 auto}.pvDayActions{display:flex;gap:7px;margin-top:10px}.pvDayPvBtn{width:100%;border:0;background:#e30613;color:#fff;border-radius:9px;padding:9px;font-weight:900}.pvDayProgress{text-align:center;padding:24px;color:#5e6f7e;font-weight:900}
@media(max-width:650px){.pvDayChoices{grid-template-columns:repeat(5,1fr);gap:4px}.pvDayChoice{padding:9px 2px;font-size:10px}.pvDiaFilters{grid-template-columns:1fr}.pvDayReportOverlay{padding:0}.pvDayReportSheet{width:100%;height:100dvh;max-height:100dvh;border-radius:0}.pvDaySummary{grid-template-columns:repeat(3,1fr);gap:5px}.pvDaySum{padding:8px}.pvDaySum strong{font-size:20px}.pvDayClientGrid{grid-template-columns:1fr}.pvDayClientCard{padding:10px}.pvDayMissingList{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.pvDayMissingRow{padding:6px}.pvDayMissingRow b{font-size:9.5px}.pvDayProduct{font-size:9px}.pvDayReportTop h2{font-size:17px}.pvDayReportTopBtns{flex-direction:column}.pvDayReportTop button{font-size:10px;padding:7px}}
`;document.head.appendChild(s)
}
function ensureReportOverlay(){
 if(document.getElementById('pvDayReport'))return;
 document.body.insertAdjacentHTML('beforeend',`<div id="pvDayReport" class="pvDayReportOverlay"><div class="pvDayReportSheet"><div class="pvDayReportTop"><h2 id="pvDayReportTitle">Relatório da rota</h2><div class="pvDayReportTopBtns"><button id="pvDayPrint">⬇ BAIXAR PDF</button><button id="pvDayReportClose">FECHAR</button></div></div><div id="pvDayReportBody" class="pvDayReportBody"></div></div></div>`);
 document.getElementById('pvDayReportClose').onclick=()=>document.getElementById('pvDayReport').classList.remove('show');
 document.getElementById('pvDayPrint').onclick=downloadReportPdf;
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
async function setSelectedDay(code){
 if(!DAYS.some(x=>x.code===code))return;
 selectedDay=code;sessionStorage.setItem('pv_dia_visita',selectedDay);window.__pvDiaSelectedDay=selectedDay;
 clients=[];lastKey='';renderPanel();await getDayClients(true);
}
function renderPanel(){
 const b=searchBox();if(!b?.body)return;
 let box=b.body.querySelector('.pvDiaBox');
 if(!box){box=document.createElement('div');box.className='pvDiaBox';b.body.insertBefore(box,b.body.firstChild)}
 const dayOpts=DAYS.map(d=>`<option value="${d.code}" ${d.code===selectedDay?'selected':''}>${d.label}</option>`).join('');
 const dayBtns=DAYS.map(d=>`<button type="button" class="pvDayChoice ${d.code===selectedDay?'active':''}" data-day="${d.code}">${d.code}</button>`).join('');
 const cliOpts=clients.map(c=>`<option value="${esc(c.pv)}">${esc(c.ordem)} • ${esc(c.pv)} • ${esc(c.razao)}</option>`).join('');
 box.innerHTML=`<div class="pvDiaHead"><b>📍 Clientes por dia de visita</b><span class="pvDiaCount">${esc(route())} • ${clients.length} cliente(s)</span></div>
 <div class="pvDayChoices">${dayBtns}</div>
 <div class="pvDiaFilters"><div><label>DIA DA VISITA</label><select id="pvDiaDay" class="pvDiaSelect">${dayOpts}</select></div><div><label>CLIENTE DA ROTA</label><select id="pvDiaClient" class="pvDiaSelect" ${loading?'disabled':''}><option value="">${loading?'Carregando clientes...':'Selecione um cliente...'}</option>${cliOpts}</select></div></div>
 <div class="pvDiaHint">Toque em SEG, TER, QUA, QUI ou SEX, ou use o campo Dia da visita. A lista de clientes e o relatório acompanham o dia escolhido.</div>
 <button id="pvDiaReportBtn" class="pvDiaReportBtn" ${loading||!clients.length?'disabled':''}>📋 GERAR RELATÓRIO • ${esc(dayLabel(selectedDay).toUpperCase())}</button>`;
 box.querySelectorAll('[data-day]').forEach(btn=>btn.onclick=()=>setSelectedDay(btn.dataset.day));
 box.querySelector('#pvDiaDay').onchange=e=>setSelectedDay(e.target.value);
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
function missingInfo(x){
 const n=norm(x?.nome),miss=(x?.grupos||[]).filter(g=>!g.vendido);
 if(miss.length){
  const products=miss.map(g=>n.includes('TRIO PAO DE QUEIJO')?trioGroupName(g.grupo):String(g.grupo||'Item')).filter(Boolean);
  return{name:String(x.nome||''),products,simple:false};
 }
 return{name:String(x?.nome||''),products:[],simple:true};
}
function buildReportRows(data){
 return (data.clients||[]).map(c=>{const faltas=(c.faltas||[]).map(missingInfo).filter(x=>x.name);return{...c,_faltas:faltas}})
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
 <div class="pvDayClientGrid">${rows.length?rows.map(c=>`<article class="pvDayClientCard">
   <div class="pvDayClientTop"><div><div class="pvDayClientId"><span class="pvDayOrder">${esc(c.ordem)}</span><b>PV ${esc(c.pv)}</b></div><h3>${esc(c.razao)}</h3><small>${esc(c.subcanal||'Sem subcanal')}</small></div>${c._faltas.length?`<span class="pvDayOppCount">${c._faltas.length} oportunidade(s)</span>`:'<span class="pvDayCovered">✓ COBERTO</span>'}</div>
   ${c._faltas.length?`<div class="pvDayMissingTitle">O QUE FALTA</div><div class="pvDayMissingList">${c._faltas.map(x=>x.simple?`<div class="pvDayMissingRow simple"><b>${esc(x.name)}</b><span class="pvDayX">✕</span></div>`:`<div class="pvDayMissingRow"><b>${esc(x.name)}</b><div class="pvDayProducts">${(x.products||[]).map(p=>`<div class="pvDayProduct"><span class="pvDayX">✕</span><span>${esc(p)}</span></div>`).join('')}</div></div>`).join('')}</div>`:''}
   <div class="pvDayActions"><button class="pvDayPvBtn" data-pv="${esc(c.pv)}">🔎 PESQUISAR ESTE PV</button></div>
 </article>`).join(''):'<div class="empty">Nenhum cliente programado neste dia.</div>'}</div>`;
 body.querySelectorAll('[data-pv]').forEach(b=>b.onclick=()=>openPvFromReport(b.dataset.pv));
}
function openPvFromReport(pv){
 document.getElementById('pvDayReport')?.classList.remove('show');if(typeof window.openPv==='function')window.openPv();else if(typeof openPv==='function')openPv();
 setTimeout(()=>{const i=document.getElementById('pv');if(i)i.value=pv;if(typeof window.searchPv==='function')window.searchPv();else if(typeof searchPv==='function')searchPv()},100);
}
function loadScriptOnce(id,src,test){
 return new Promise((resolve,reject)=>{
   if(test())return resolve();
   const old=document.getElementById(id);
   if(old){old.addEventListener('load',()=>resolve(),{once:true});old.addEventListener('error',()=>reject(new Error('Falha ao carregar gerador de PDF.')),{once:true});return}
   const s=document.createElement('script');s.id=id;s.src=src;s.async=true;
   s.onload=()=>test()?resolve():reject(new Error('Gerador de PDF indisponível.'));
   s.onerror=()=>reject(new Error('Falha ao carregar gerador de PDF.'));
   document.head.appendChild(s);
 });
}
async function ensurePdfLibs(){
 await loadScriptOnce('pvJsPdfLib','https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',()=>!!window.jspdf?.jsPDF);
 await loadScriptOnce('pvAutoTableLib','https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',()=>!!window.jspdf?.jsPDF?.API?.autoTable);
}
function pdfMissingText(c){
 if(!c._faltas?.length)return 'COBERTO';
 return c._faltas.map(x=>{
   if(x.simple)return `${x.name}  X`;
   const ps=(x.products||[]).map(p=>`X ${p}`).join(' / ');
   return `${x.name}: ${ps}`;
 }).join('  •  ');
}
function safePdfName(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')}
async function downloadReportPdf(){
 if(!reportData)return;
 const btn=document.getElementById('pvDayPrint'),old=btn?.innerHTML;
 if(btn){btn.disabled=true;btn.textContent='GERANDO PDF...'}
 try{
   await ensurePdfLibs();
   const {jsPDF}=window.jspdf;
   const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
   const rows=reportData.clients||[],opp=rows.filter(x=>x._faltas.length).length;
   doc.setFont('helvetica','bold');doc.setFontSize(15);doc.setTextColor(23,37,52);
   doc.text(`Relatório de visitas • ${reportData.route} • ${dayLabel(reportData.day)}`,8,10);
   doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(83,99,113);
   doc.text(`${rows.length} clientes • ${opp} com oportunidade • ${rows.length-opp} cobertos`,289,10,{align:'right'});
   const body=rows.map(c=>[
     String(c.ordem??''),
     String(c.pv??''),
     String(c.razao??''),
     String(c.subcanal??''),
     pdfMissingText(c)
   ]);
   doc.autoTable({
     startY:14,
     head:[['ORDEM','PV','CLIENTE','SUBCANAL','O QUE FALTA']],
     body,
     theme:'grid',
     styles:{font:'helvetica',fontSize:8.6,cellPadding:2.2,valign:'middle',lineColor:[207,214,220],lineWidth:.15,textColor:[23,37,52],overflow:'linebreak'},
     headStyles:{fillColor:[23,37,52],textColor:[255,255,255],fontStyle:'bold',fontSize:9.2,cellPadding:2.4},
     alternateRowStyles:{fillColor:[247,249,250]},
     columnStyles:{
       0:{cellWidth:16,halign:'center',fontStyle:'bold'},
       1:{cellWidth:25,fontStyle:'bold'},
       2:{cellWidth:58,fontStyle:'bold'},
       3:{cellWidth:38,textColor:[78,93,105]},
       4:{cellWidth:142,textColor:[120,20,20]}
     },
     margin:{left:8,right:8,bottom:8},
     rowPageBreak:'avoid',
     showHead:'everyPage',
     didDrawPage:()=>{
       const n=doc.internal.getNumberOfPages();
       doc.setFontSize(7.5);doc.setTextColor(110,120,128);
       doc.text(`Página ${n}`,289,202,{align:'right'});
     }
   });
   const filename=`relatorio-${safePdfName(reportData.route)}-${safePdfName(reportData.day)}.pdf`;
   const blob=doc.output('blob'),url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();
   setTimeout(()=>{URL.revokeObjectURL(url);a.remove()},1500);
 }catch(e){
   alert(e?.message||'Não foi possível gerar o PDF.');
 }finally{
   if(btn){btn.disabled=false;btn.innerHTML=old||'⬇ BAIXAR PDF'}
 }
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