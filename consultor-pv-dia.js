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
function fitPdfLine(doc,text,maxWidth,startSize=8.2,minSize=6.2){
 let size=startSize;
 doc.setFontSize(size);
 while(size>minSize&&doc.getTextWidth(text)>maxWidth){size-=.2;doc.setFontSize(size)}
 if(doc.getTextWidth(text)<=maxWidth)return{text,size,lines:[text]};
 doc.setFontSize(minSize);
 let lines=doc.splitTextToSize(text,maxWidth);
 if(lines.length>2){
   size=5.6;doc.setFontSize(size);lines=doc.splitTextToSize(text,maxWidth);
 }
 return{text,size,lines:lines.slice(0,2)};
}
function drawPdfHeader(doc,rows,opp,pageNo){
 const W=doc.internal.pageSize.getWidth();
 doc.setFont('helvetica','bold');doc.setFontSize(14);doc.setTextColor(23,37,52);
 doc.text(`Relatório de visitas • ${reportData.route} • ${dayLabel(reportData.day)}`,7,8.5);
 doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(83,99,113);
 doc.text(`${rows.length} clientes • ${opp} com oportunidade • ${rows.length-opp} cobertos`,W-7,8.5,{align:'right'});
 doc.setDrawColor(23,37,52);doc.setLineWidth(.35);doc.line(7,11,W-7,11);
 if(pageNo>1){doc.setFontSize(7);doc.text(`Página ${pageNo}`,W-7,14,{align:'right'})}
 return pageNo>1?16:14;
}
function buildPdfDocument(){
 const {jsPDF}=window.jspdf;
 const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
 const rows=reportData.clients||[],opp=rows.filter(x=>x._faltas.length).length;
 const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),L=7,R=7,usable=W-L-R;
 let page=1,y=drawPdfHeader(doc,rows,opp,page);
 rows.forEach((c,idx)=>{
   const missing=pdfMissingText(c),fit=fitPdfLine(doc,missing,usable-5,8.2,6.2);
   const missingLines=Math.max(1,fit.lines.length),infoH=6.7,missH=missingLines===1?6.4:9.4,blockH=infoH+missH;
   if(y+blockH>H-8){
     doc.addPage('a4','landscape');page++;y=drawPdfHeader(doc,rows,opp,page);
   }
   const alt=idx%2===1;
   if(alt){doc.setFillColor(247,249,250);doc.rect(L,y,usable,infoH,'F')}
   doc.setDrawColor(195,204,211);doc.setLineWidth(.18);doc.rect(L,y,usable,blockH);
   doc.line(L,y+infoH,W-R,y+infoH);

   // linha 1: dados do cliente
   const c1=15,c2=24,c3=110;
   doc.line(L+c1,y,L+c1,y+infoH);doc.line(L+c1+c2,y,L+c1+c2,y+infoH);doc.line(L+c1+c2+c3,y,L+c1+c2+c3,y+infoH);
   doc.setTextColor(23,37,52);doc.setFontSize(8.2);doc.setFont('helvetica','bold');
   doc.text(String(c.ordem??''),L+c1/2,y+4.35,{align:'center'});
   doc.text(String(c.pv??''),L+c1+2,y+4.35);
   doc.setFontSize(8);doc.text(String(c.razao??''),L+c1+c2+2,y+4.35,{maxWidth:c3-4});
   doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(74,88,99);
   doc.text(String(c.subcanal??''),L+c1+c2+c3+2,y+4.35,{maxWidth:usable-c1-c2-c3-4});

   // linha 2: o que falta, ocupando toda a largura
   const label='O QUE FALTA:';
   doc.setFont('helvetica','bold');doc.setFontSize(7.3);doc.setTextColor(c._faltas.length?150:8,c._faltas.length?20:114,c._faltas.length?20:73);
   doc.text(label,L+2,y+infoH+4.1);
   const labelW=doc.getTextWidth(label)+2;
   doc.setFont('helvetica','normal');doc.setFontSize(fit.size);
   doc.setTextColor(c._faltas.length?105:8,c._faltas.length?25:114,c._faltas.length?25:73);
   if(fit.lines.length===1){
     doc.text(fit.lines[0],L+2+labelW,y+infoH+4.1);
   }else{
     doc.text(fit.lines[0],L+2+labelW,y+infoH+3.6);
     doc.text(fit.lines[1],L+2+labelW,y+infoH+6.7);
   }
   y+=blockH+1.2;
 });
 const pages=doc.internal.getNumberOfPages();
 for(let p=1;p<=pages;p++){doc.setPage(p);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(110,120,128);doc.text(`Página ${p}/${pages}`,W-7,H-3.5,{align:'right'})}
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