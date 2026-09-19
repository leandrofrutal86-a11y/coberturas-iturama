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
const savedDay=sessionStorage.getItem('pv_dia_visita')||'';let selectedDay=DAYS.some(x=>x.code===savedDay)?savedDay:currentDay(),clients=[],loading=false,lastKey='',reportData=null,preparedPdfDoc=null,preparedPdfName='',preparedPdfBlob=null,preparedPdfFile=null,preparedPdfUrl='',preparingPdf=false;

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
.pvDayChoices{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:8px 0 10px}.pvDayChoice{border:1px solid #cbd5df;background:#f5f7f9;color:#263746;border-radius:9px;padding:9px 4px;font-size:11px;font-weight:950}.pvDayChoice.active{background:#e30613;color:#fff;border-color:#e30613}.pvDiaFilters{display:grid;grid-template-columns:1fr;gap:8px}.pvDiaFilters label{display:block;font-size:11px;font-weight:900;color:#596a78;margin-bottom:5px}.pvDiaSelect{width:100%;padding:12px;border:1px solid #cbd5df;border-radius:10px;background:#fff;font-size:14px}
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
 const dayBtns=DAYS.map(d=>`<button type="button" class="pvDayChoice ${d.code===selectedDay?'active':''}" data-day="${d.code}">${d.code}</button>`).join('');
 const cliOpts=clients.map(c=>`<option value="${esc(c.pv)}">${esc(c.ordem)} • ${esc(c.pv)} • ${esc(c.razao)}</option>`).join('');
 box.innerHTML=`<div class="pvDiaHead"><b>📍 Clientes por dia de visita</b><span class="pvDiaCount">${esc(route())} • ${clients.length} cliente(s)</span></div>
 <div class="pvDayChoices">${dayBtns}</div>
 <div class="pvDiaFilters"><div><label>CLIENTE DA ROTA</label><select id="pvDiaClient" class="pvDiaSelect" ${loading?'disabled':''}><option value="">${loading?'Carregando clientes...':'Selecione um cliente...'}</option>${cliOpts}</select></div></div>
 <div class="pvDiaHint">Toque em SEG, TER, QUA, QUI ou SEX. A lista de clientes e o relatório acompanham o dia escolhido.</div>
 <button id="pvDiaReportBtn" class="pvDiaReportBtn" ${loading||!clients.length?'disabled':''}>📋 GERAR RELATÓRIO • ${esc(dayLabel(selectedDay).toUpperCase())}</button>`;
 box.querySelectorAll('[data-day]').forEach(btn=>btn.onclick=()=>setSelectedDay(btn.dataset.day));
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
 ensureReportOverlay();ensurePdfLibs().catch(()=>{});
 const ov=document.getElementById('pvDayReport'),body=document.getElementById('pvDayReportBody'),title=document.getElementById('pvDayReportTitle');
 ov.classList.add('show');title.textContent=`Relatório • ${route()} • ${dayLabel(selectedDay)}`;body.innerHTML='<div class="pvDayProgress">Gerando relatório e conferindo as vendas atuais...</div>';if(preparedPdfUrl){try{URL.revokeObjectURL(preparedPdfUrl)}catch{}}preparedPdfDoc=null;preparedPdfName='';preparedPdfBlob=null;preparedPdfFile=null;preparedPdfUrl='';const pdfBtn=document.getElementById('pvDayPrint');if(pdfBtn){pdfBtn.disabled=true;pdfBtn.textContent='PREPARANDO PDF...';}
 try{
  const j=await api('day_report',{day:selectedDay,rota:route()});reportData={...j,clients:buildReportRows(j)};
  renderReport(reportData);prepareReportPdf().catch(()=>{});
 }catch(e){body.innerHTML=`<div class="pvDayProgress">${esc(e.message||'Não foi possível gerar o relatório.')}</div>`}
}
function renderReport(data){
 const body=document.getElementById('pvDayReportBody'),rows=data.clients||[],opp=rows.filter(x=>x._faltas.length),ok=rows.length-opp.length;
 body.innerHTML=`<div class="pvDaySummary"><div class="pvDaySum"><b>CLIENTES DO DIA</b><strong>${rows.length}</strong></div><div class="pvDaySum"><b>COM OPORTUNIDADE</b><strong>${opp.length}</strong></div><div class="pvDaySum"><b>COBERTOS</b><strong>${ok}</strong></div></div>
 <div class="pvDayClientGrid">${rows.length?rows.map(c=>`<article class="pvDayClientCard">
   <div class="pvDayClientTop"><div><div class="pvDayClientId"><span class="pvDayOrder">${esc(c.ordem)}</span><b>PV ${esc(c.pv)}</b></div><h3>${esc(c.razao)}</h3><small>${esc(c.subcanal||'Sem subcanal')}</small></div>${c._faltas.length?`<span class="pvDayOppCount">${c._faltas.length} oportunidade(s)</span>`:'<span class="pvDayCovered">✓ COBERTO</span>'}</div>
   ${c._faltas.length?`<div class="pvDayMissingTitle">O QUE FALTA</div><div class="pvDayMissingList">${c._faltas.map(x=>x.simple?`<div class="pvDayMissingRow simple"><b>${esc(x.name)}</b><span class="pvDayX">✕</span></div>`:`<div class="pvDayMissingRow"><b>${esc(x.name)}</b><div class="pvDayProducts">${(x.products||[]).map(p=>`<div class="pvDayProduct"><span class="pvDayX">✕</span><span>${esc(p)}</span></div>`).join('')}</div></div>`).join('')}</div>`:''}
 </article>`).join(''):'<div class="empty">Nenhum cliente programado neste dia.</div>'}</div>`;
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
}
function pdfMissingText(c){
 if(!c._faltas?.length)return '✓ COBERTO';
 return c._faltas.map(x=>{
   if(x.simple)return `${x.name} ✕`;
   const ps=(x.products||[]).map(p=>`✕ ${p}`).join(' / ');
   return `${x.name}: ${ps}`;
 }).join('  |  ');
}
function safePdfName(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')}
function pdfTextLines(doc,text,maxWidth,size=7.6){
 doc.setFontSize(size);
 return doc.splitTextToSize(String(text||''),maxWidth);
}
function missingItemHeight(doc,item,colW){
 if(item.simple)return 4.8;
 let h=4.6;
 for(const p of (item.products||[])){
   const lines=pdfTextLines(doc,p,colW-8,6.6);
   h+=Math.max(1,lines.length)*3.25+.8;
 }
 return h+1;
}
function missingColumnHeight(doc,items,colW){
 return (items||[]).reduce((sum,item)=>sum+missingItemHeight(doc,item,colW),0);
}
function drawMissingColumn(doc,items,x,y,colW){
 let yy=y;
 for(const item of (items||[])){
   if(item.simple){
     doc.setFont('helvetica','bold');doc.setFontSize(7.8);doc.setTextColor(227,6,19);
     doc.text('X',x,yy+3.3);
     doc.setTextColor(116,24,29);
     const nameLines=pdfTextLines(doc,item.name,colW-7,7.8);
     doc.text(nameLines.slice(0,2),x+5,yy+3.3);
     yy+=Math.max(4.8,nameLines.length*3.35+1.1);
   }else{
     doc.setFont('helvetica','bold');doc.setFontSize(7.9);doc.setTextColor(116,24,29);
     const catLines=pdfTextLines(doc,item.name,colW-1,7.9);
     doc.text(catLines.slice(0,2),x,yy+3.2);
     yy+=Math.max(4.4,catLines.length*3.3+.8);
     doc.setFont('helvetica','normal');doc.setTextColor(58,69,78);
     for(const p of (item.products||[])){
       const lines=pdfTextLines(doc,p,colW-8,6.6);
       doc.setFont('helvetica','bold');doc.setFontSize(7.3);doc.setTextColor(227,6,19);
       doc.text('X',x+1,yy+3);
       doc.setFont('helvetica','normal');doc.setFontSize(6.6);doc.setTextColor(58,69,78);
       doc.text(lines,x+6,yy+3);
       yy+=Math.max(4.1,lines.length*3.25+.8);
     }
     yy+=1;
   }
   doc.setDrawColor(235,226,226);doc.setLineWidth(.12);doc.line(x,yy-.3,x+colW,yy-.3);
 }
 return yy;
}
function drawPdfHeader(doc,rows,opp,pageNo){
 const W=doc.internal.pageSize.getWidth();
 doc.setFont('helvetica','bold');doc.setFontSize(13.5);doc.setTextColor(23,37,52);
 doc.text(`Relatório de visitas • ${reportData.route}`,10,11);
 doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(92,104,114);
 doc.text(dayLabel(reportData.day),10,16);
 doc.setFontSize(7.8);doc.setTextColor(83,99,113);
 doc.text(`${rows.length} clientes • ${opp} com oportunidade • ${rows.length-opp} cobertos`,W-10,11,{align:'right'});
 doc.setDrawColor(23,37,52);doc.setLineWidth(.45);doc.line(10,19,W-10,19);
 return 21;
}
function buildPdfDocument(){
 const {jsPDF}=window.jspdf;
 const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
 const rows=reportData.clients||[],opp=rows.filter(x=>x._faltas.length).length;
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight();
 const L=10,R=10,usable=W-L-R,gap=3.2,colW=(usable-gap*2)/3;
 let page=1,y=drawPdfHeader(doc,rows,opp,page);

 rows.forEach((client,idx)=>{
   const faltas=client._faltas||[];
   const cols=[[],[],[]],heights=[0,0,0];
   for(const item of faltas){
     const h=missingItemHeight(doc,item,colW);
     const target=heights.indexOf(Math.min(...heights));
     cols[target].push(item);
     heights[target]+=h;
   }

   const infoH=12.5;
   const missTitleH=5.5;
   const contentH=faltas.length?Math.max(...heights):8;
   const blockH=infoH+missTitleH+contentH+3.8;

   if(y+blockH>H-13){
     doc.addPage('a4','portrait');page++;y=drawPdfHeader(doc,rows,opp,page);
   }

   // bloco do cliente
   doc.setDrawColor(205,214,221);doc.setLineWidth(.3);
   doc.roundedRect(L,y,usable,blockH,2.4,2.4);

   // cabeçalho do cliente
   doc.setFillColor(247,249,250);doc.roundedRect(L+.3,y+.3,usable-.6,infoH,2.1,2.1,'F');
   doc.setFillColor(23,37,52);doc.roundedRect(L+3,y+2.5,11,7,2.5,2.5,'F');
   doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(255,255,255);
   doc.text(String(client.ordem??''),L+8.5,y+7.5,{align:'center'});

   doc.setFont('helvetica','bold');doc.setFontSize(8.7);doc.setTextColor(23,37,52);
   doc.text(`PV ${String(client.pv??'')}`,L+16.5,y+5.5);
   doc.setFontSize(9.4);
   const nameLines=pdfTextLines(doc,String(client.razao??''),usable-68,9.4);
   doc.text(nameLines.slice(0,2),L+16.5,y+10);
   doc.setFont('helvetica','normal');doc.setFontSize(7.7);doc.setTextColor(92,104,114);
   doc.text(String(client.subcanal??''),W-R-3,y+5.5,{align:'right',maxWidth:45});
   if(faltas.length){
     doc.setFillColor(255,232,232);doc.roundedRect(W-R-33,y+7.1,30,4.4,2,2,'F');
     doc.setFont('helvetica','bold');doc.setFontSize(6.6);doc.setTextColor(163,20,20);
     doc.text(`${faltas.length} oportunidade(s)`,W-R-18,y+10.1,{align:'center'});
   }else{
     doc.setFillColor(222,243,231);doc.roundedRect(W-R-27,y+7.1,24,4.4,2,2,'F');
     doc.setFont('helvetica','bold');doc.setFontSize(6.6);doc.setTextColor(8,114,73);
     doc.text('COBERTO',W-R-15,y+10.1,{align:'center'});
   }

   const titleY=y+infoH+3.7;
   doc.setFont('helvetica','bold');doc.setFontSize(8.4);doc.setTextColor(faltas.length?166:8,faltas.length?22:114,faltas.length?22:73);
   doc.text('O QUE FALTA',L+3,titleY);
   doc.setDrawColor(232,236,239);doc.setLineWidth(.2);doc.line(L+3,titleY+2,W-R-3,titleY+2);

   const contentY=y+infoH+missTitleH+1;
   if(faltas.length){
     const sep1=L+colW+gap/2;
     const sep2=L+(colW*2)+(gap*1.5);
     doc.setDrawColor(238,241,243);
     doc.line(sep1,contentY-1,sep1,y+blockH-3);
     doc.line(sep2,contentY-1,sep2,y+blockH-3);
     drawMissingColumn(doc,cols[0],L+2.2,contentY,colW-3.2);
     drawMissingColumn(doc,cols[1],L+colW+gap+1.1,contentY,colW-3.2);
     drawMissingColumn(doc,cols[2],L+(colW*2)+(gap*2)+0.1,contentY,colW-3.2);
   }else{
     doc.setFont('helvetica','bold');doc.setFontSize(8.2);doc.setTextColor(8,114,73);
     doc.text('✓ Cliente coberto neste relatório.',L+3,contentY+4);
   }

   y+=blockH+2.8;
 });

 const pages=doc.internal.getNumberOfPages();
 for(let p=1;p<=pages;p++){
   doc.setPage(p);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(110,120,128);
   doc.text(`Página ${p}/${pages}`,W-10,H-6,{align:'right'});
 }
 return doc;
}
async function prepareReportPdf(){
 if(!reportData||preparingPdf)return;
 const btn=document.getElementById('pvDayPrint');preparingPdf=true;
 if(btn){btn.disabled=true;btn.textContent='PREPARANDO PDF...'}
 try{
   await ensurePdfLibs();
   preparedPdfDoc=buildPdfDocument();
   preparedPdfName=`relatorio-${safePdfName(reportData.route)}-${safePdfName(reportData.day)}.pdf`;
   preparedPdfBlob=preparedPdfDoc.output('blob');
   preparedPdfFile=new File([preparedPdfBlob],preparedPdfName,{type:'application/pdf'});
   preparedPdfUrl=URL.createObjectURL(preparedPdfBlob);
   if(btn){btn.disabled=false;btn.innerHTML='⬇ BAIXAR PDF'}
 }catch(e){
   preparedPdfDoc=null;
   if(btn){btn.disabled=false;btn.textContent='TENTAR PDF NOVAMENTE'}
 }finally{preparingPdf=false}
}
async function downloadReportPdf(){
 if(!preparedPdfDoc||!preparedPdfBlob){
   await prepareReportPdf().catch(()=>{});
   if(!preparedPdfDoc||!preparedPdfBlob)return;
 }
 const btn=document.getElementById('pvDayPrint');
 try{
   if(btn){btn.disabled=true;btn.textContent='ABRINDO PDF...'}
   if(preparedPdfFile&&navigator.share&&navigator.canShare&&navigator.canShare({files:[preparedPdfFile]})){
     try{
       await navigator.share({files:[preparedPdfFile],title:'Relatório de visitas',text:`Relatório ${reportData.route} • ${dayLabel(reportData.day)}`});
       return;
     }catch(err){
       if(err?.name==='AbortError')return;
     }
   }
   const a=document.createElement('a');
   a.href=preparedPdfUrl;
   a.download=preparedPdfName;
   a.rel='noopener';
   a.style.display='none';
   document.body.appendChild(a);
   a.click();
   a.remove();
   setTimeout(()=>{
     try{
       const w=window.open(preparedPdfUrl,'_blank');
       if(!w)window.location.href=preparedPdfUrl;
     }catch{
       try{window.location.href=preparedPdfUrl}catch{}
     }
   },700);
 }catch(e){
   try{
     const data=preparedPdfDoc.output('datauristring');
     const w=window.open(data,'_blank');
     if(!w)window.location.href=data;
   }catch{
     alert('Não foi possível abrir o PDF neste aparelho.');
   }
 }finally{
   if(btn){btn.disabled=false;btn.innerHTML='⬇ BAIXAR PDF'}
 }
}
async function inject(force=false){
 css();ensureReportOverlay();wrapSearch();const b=searchBox();if(!b)return;
 renderPanel();
 const key=route()+'|'+selectedDay;if(force||key!==lastKey||!clients.length)await getDayClients(force);
}
function watch(){
 inject().catch(()=>{});
 setInterval(()=>{
   wrapSearch();
   const ov=document.getElementById('ov');
   if(ov?.classList.contains('show')&&!ov.querySelector('.pvDiaBox'))inject(false).catch(()=>{});
 },700);
}
window.addEventListener('iturama:routechange',()=>{clients=[];lastKey='';inject(true).catch(()=>{})});
window.__openPvDayReport=()=>openReport();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
})();