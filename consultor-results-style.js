(()=>{
const $=id=>document.getElementById(id);
let observer=null,scheduled=false;
function diasUteisRestantes(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const ultimo=new Date(now.getFullYear(),now.getMonth()+1,0);
  const limite=new Date(ultimo.getFullYear(),ultimo.getMonth(),ultimo.getDate()-1);
  let n=0;
  for(;d<=limite;d.setDate(d.getDate()+1)){const w=d.getDay();if(w!==0&&w!==6)n++}
  return n;
}
function metaDiaria(falta,dias){
  const f=Math.max(0,Number(falta)||0);
  if(!f)return 0;
  return dias?Math.ceil(f/dias):f;
}
function painelAberto(){
  const d=$('dash');
  return !!d&&!d.classList.contains('hidden');
}
function isMeu(){
  try{return typeof TAB==='undefined'||TAB==='meu'}catch{return true}
}
function consultor(){
  try{return DATA?.consultor||{}}catch{return{}}
}
function ensureStyle(){
  let st=$('consultorResultsStyle');
  if(st)st.remove();
  st=document.createElement('style');
  st.id='consultorResultsStyle';
  st.textContent=`
#results{width:100%;max-width:100%}
#results .tableWrap{border:1px solid #d6dee6;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px #0000000d;margin-top:7px}
#results table{width:100%;min-width:0;border-collapse:collapse;table-layout:fixed}
#results thead th{background:#b70712;color:#fff;font-weight:900;padding:8px 5px;text-align:center;font-size:10px}
#results thead th:first-child{text-align:left;width:34%}
#results tbody tr:nth-child(odd) td{background:#f2f8fd}
#results tbody tr:nth-child(even) td{background:#fff}
#results tbody td{padding:7px 5px;border-bottom:1px solid #dfe7ee;text-align:center;font-size:10px;vertical-align:middle}
#results tbody td:first-child{text-align:left;font-weight:900;color:#10263a}
#results .res-ok{color:#0b8a46;font-weight:900}
#results .res-bad{color:#d71920;font-weight:900}
#results tbody td.meta-num{color:#075fae!important;font-weight:900!important}
#results tbody td.res-ok,#results tbody td.pct-ok{color:#087249!important;font-weight:900!important}
#results tbody td.res-bad,#results tbody td.pct-bad{color:#c5161d!important;font-weight:900!important}
#results .falta-num{font-weight:900;color:#c5161d}
#results .pct-ok{color:#0b8a46;font-weight:900}
#results .pct-bad{color:#d71920;font-weight:900}
#results .meta-dia{font-weight:950;color:#075fae;font-size:12px}
#consultorDailyInfo{margin:6px 0 5px;padding:7px 9px;border-radius:9px;background:#eef5fb;color:#28465f;font-size:9px;font-weight:900;text-align:center}
#consultorDownloadBar{margin:16px 0 8px;display:grid;grid-template-columns:1fr;gap:8px}
#consultorDownloadTable,#consultorShareTable{display:block;width:100%;border:0;border-radius:12px;padding:11px 12px;background:#087d37;color:#fff;font-size:11px;font-weight:950;cursor:pointer}#consultorShareTable{background:#1264b5}#consultorExportStatus{grid-column:1/-1;font-size:10px;font-weight:800;color:#354b5d;text-align:center;min-height:10px}
#consultorDownloadTable:disabled,#consultorShareTable:disabled{background:#aeb8bf}
@media(max-width:760px){
 .panel{padding:6px!important}
 .head{gap:4px!important}
 .panel h2{font-size:14px!important;margin:2px 0!important}
 .head small{font-size:9px!important}
 .head select{padding:7px!important;font-size:11px!important}
 #consultorDailyInfo{font-size:8px!important;margin:5px 0 4px!important;padding:6px!important}
 #consultorDownloadBar{margin:5px 0 4px!important}
 #consultorDownloadTable,#consultorShareTable{font-size:10px!important;padding:10px 8px!important;border-radius:10px!important}
 #results .tableWrap{width:100%!important;max-width:100%!important;overflow:hidden!important;margin-top:5px!important;border-radius:8px!important}
 #results table{display:table!important;width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:collapse!important}
 #results thead{display:table-header-group!important}
 #results tbody{display:table-row-group!important}
 #results tr{display:table-row!important}
 #results th,#results td{display:table-cell!important;box-sizing:border-box!important;min-width:0!important;white-space:normal!important;overflow-wrap:anywhere!important}
 #results thead th{padding:6px 1px!important;font-size:6.6px!important;line-height:1.02!important;text-align:center!important}
 #results thead th:first-child{width:42%!important;text-align:left!important;padding-left:4px!important}
 #results thead th:nth-child(2){width:10%!important}
 #results thead th:nth-child(3){width:13%!important}
 #results thead th:nth-child(4){width:10%!important}
 #results thead th:nth-child(5){width:9%!important}
 #results thead th:nth-child(6){width:16%!important}
 #results tbody td{padding:6px 1px!important;font-size:7.4px!important;line-height:1.06!important;text-align:center!important;border-right:1px solid #e1e7ec!important}
 #results tbody td:first-child{width:42%!important;text-align:left!important;padding-left:4px!important;font-size:7.2px!important;font-weight:900!important}
 #results tbody td:nth-child(2){width:10%!important}
 #results tbody td:nth-child(3){width:13%!important}
 #results tbody td:nth-child(4){width:10%!important}
 #results tbody td:nth-child(5){width:9%!important}
 #results tbody td:nth-child(6){width:16%!important;border-right:0!important}
 #results .meta-dia{font-size:8.2px!important}
}
`;
  document.head.appendChild(st);
}
function ensureControls(){
  const results=$('results');
  if(!results)return;
  let info=$('consultorDailyInfo');
  if(!info){
    info=document.createElement('div');
    info.id='consultorDailyInfo';
    results.insertAdjacentElement('beforebegin',info);
  }
  let bar=$('consultorDownloadBar');
  if(!bar){
    bar=document.createElement('div');
    bar.id='consultorDownloadBar';
    bar.innerHTML='<button id="consultorDownloadTable" type="button">📷 BAIXAR PRINT DO RELATÓRIO</button><div id="consultorExportStatus" aria-live="polite"></div>';
    $('clients').insertAdjacentElement('afterend',bar);
    $('consultorDownloadTable').onclick=baixarPrimeiraTabela;
    $('consultorShareTable').onclick=compartilharPrimeiraTabela;
  }
}
function decorateResults(){
  if(!painelAberto())return;
  ensureControls();
  const results=$('results');
  const table=results?.querySelector('table');
  const meu=isMeu();
  const info=$('consultorDailyInfo');
  const bar=$('consultorDownloadBar');
  if(info)info.style.display=meu?'block':'none';
  if(bar)bar.style.display=meu&&$('cat')?.value!=='ALL'&&!!$('clients')?.querySelector('table')?'block':'none';
  if(!table)return;
  if(exportFile&&exportSignature!==tableSignature()){exportFile=null;exportBlob=null;updateExportButtons(false);exportStatus('')}
  const head=table.querySelector('thead tr');
  if(meu&&head&&head.cells.length===5){
    const th=document.createElement('th');
    th.textContent='Meta/dia';
    head.appendChild(th);
  }
  const dias=diasUteisRestantes();
  table.querySelectorAll('tbody tr').forEach(tr=>{
    if(tr.cells.length<5)return;
    const meta=Number(String(tr.cells[1].textContent).replace(',','.'))||0;
    const real=Number(String(tr.cells[2].textContent).replace(',','.'))||0;
    const falta=Math.max(Number(String(tr.cells[3].textContent).replace(',','.'))||0,0);
    const ok=real>=meta;
    tr.cells[1].classList.add('meta-num');
    tr.cells[2].classList.remove('res-ok','res-bad');
    tr.cells[4].classList.remove('pct-ok','pct-bad');
    tr.cells[2].classList.add(ok?'res-ok':'res-bad');
    tr.cells[3].classList.add('falta-num');
    tr.cells[4].classList.add(ok?'pct-ok':'pct-bad');
    if(meu&&tr.cells.length===5){
      const b=tr.insertCell();
      b.className='meta-dia';
      b.textContent=String(metaDiaria(falta,dias));
    }
  });
  if(info&&meu)info.textContent=`Dias úteis restantes: ${dias}. Meta/dia calculada de segunda a sexta, sem contar o último dia do mês.`;
  const old=$('consultorRelatorio');
  if(old)old.remove();
}
function loadScript(src,test){
  return new Promise((ok,no)=>{
    if(test())return ok();
    const s=document.createElement('script');
    s.src=src;
    s.onload=ok;
    s.onerror=()=>no(Error('Não foi possível carregar o gerador de imagem.'));
    document.head.appendChild(s);
  });
}
function escHtml(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
let exportFile=null,exportBlob=null,exportSignature='',exportPreparing=null;
function tableSignature(){
 const table=$('results')?.querySelector('table');
 if(!table)return '';
 const c=consultor();
 return String(c.rota||'')+'|'+String(c.nome||'')+'|'+String(typeof TAB!=='undefined'?TAB:'')+'|'+String($('cat')?.value||'')+'|'+table.textContent+'|'+String($('clients')?.textContent||'');
}
function exportStatus(message,err=false){
 const el=$('consultorExportStatus');if(el){el.textContent=message||'';el.style.color=err?'#bd1720':'#354b5d'}
}
function updateExportButtons(busy=false){
 const d=$('consultorDownloadTable'),s=$('consultorShareTable');
 if(d){d.disabled=busy;d.textContent=busy?'⏳ PREPARANDO IMAGEM...':'⬇️ BAIXAR IMAGEM'}
 if(s){s.disabled=busy;s.textContent=busy?'⏳ PREPARANDO IMAGEM...':exportFile?'📤 COMPARTILHAR (PRONTO)':'📤 COMPARTILHAR IMAGEM'}
}
function saveExportBlob(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.rel='noopener';a.style.display='none';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000)
}
async function prepareConsultorImage(){
 const signature=tableSignature();
 const clients=$('clients'),clientTable=clients?.querySelector('table');
 if(!clientTable||!clientTable.querySelector('tbody tr'))throw Error('Selecione um incentivo para gerar o relatório de clientes.');
 if(exportFile&&exportSignature===signature)return exportFile;
 if(exportPreparing)return exportPreparing;
 exportFile=null;exportBlob=null;updateExportButtons(true);exportStatus('Preparando relatório completo dos clientes...');
 const task=(async()=>{
  await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
  let stage=null;
  try{
   const consultant=consultor(),category=$('cat')?.selectedOptions?.[0]?.textContent?.trim()||'Incentivo';
   stage=document.createElement('div');
   stage.style.cssText='position:fixed;left:-10000px;top:0;width:1100px;max-width:none;background:#fff;color:#142236;font-family:Arial,sans-serif;padding:0;z-index:-1';
   const header=document.createElement('div');
   header.style.cssText='background:#b70712;color:white;padding:24px 28px';
   const heading=document.createElement('div');heading.style.cssText='font-size:29px;font-weight:900';heading.textContent='RELATÓRIO DE CLIENTES • '+category;
   const sub=document.createElement('div');sub.style.cssText='font-size:18px;margin-top:8px';sub.textContent=[consultant.rota,consultant.nome].filter(Boolean).join(' • ');
   header.append(heading,sub);stage.appendChild(header);
   const block=document.createElement('div');block.style.cssText='padding:20px 25px 30px;background:#fff';
   const title=document.createElement('h2');title.style.cssText='font-size:25px;margin:0 0 18px';title.textContent=clients.querySelector('h3')?.textContent?.trim()||'Clientes do incentivo';block.appendChild(title);
   const clone=clientTable.cloneNode(true);
   clone.style.cssText='display:table!important;width:100%!important;max-width:none!important;min-width:0!important;table-layout:fixed!important;border-collapse:collapse!important;font-size:17px!important';
   clone.querySelectorAll('thead,tbody,tr').forEach(el=>{el.style.display='';el.style.width='auto'});
   clone.querySelectorAll('th,td').forEach(el=>{el.style.cssText='display:table-cell!important;box-sizing:border-box!important;padding:12px 10px!important;border:1px solid #d6dde4!important;text-align:left!important;white-space:normal!important;overflow-wrap:break-word!important;word-break:normal!important;font-size:17px!important;line-height:1.4!important;color:#142236!important'});
   clone.querySelectorAll('th').forEach(el=>{el.style.background='#edf2f7';el.style.fontWeight='900'});
   clone.querySelectorAll('td:first-child,th:first-child').forEach(el=>{el.style.width='16%';el.style.whiteSpace='nowrap'});
   block.appendChild(clone);stage.appendChild(block);document.body.appendChild(stage);
   const canvas=await window.html2canvas(stage,{scale:1.7,backgroundColor:'#ffffff',useCORS:true,logging:false,width:1100,windowWidth:1100});
   const blob=await new Promise((ok,no)=>canvas.toBlob(v=>v?ok(v):no(Error('Não foi possível gerar a imagem.')),'image/png'));
   if(signature!==tableSignature())throw Error('O relatório foi atualizado. Toque novamente para baixar a lista atual.');
   const name='relatorio_clientes_'+String(category).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]/gi,'_')+'_'+String(consultant.rota||'consultor').replace(/[^a-z0-9_-]/gi,'_')+'.png';
   exportBlob=blob;exportFile=new File([blob],name,{type:'image/png'});exportSignature=signature;
   exportStatus('Relatório completo pronto para salvar.');
   return exportFile;
  }finally{stage?.remove()}
 })();
 exportPreparing=task;
 try{return await task}catch(e){exportStatus(e?.message||'Não foi possível preparar o relatório.',true);throw e}
 finally{if(exportPreparing===task)exportPreparing=null;updateExportButtons(false)}
}
async function baixarPrimeiraTabela(){
 try{const file=await prepareConsultorImage();saveExportBlob(exportBlob||file,file.name);exportStatus('Imagem baixada. Também pode compartilhar.')}
 catch(e){alert(e?.message||'Não foi possível baixar a imagem.')}
}
function compartilharPrimeiraTabela(){
 // navigator.share precisa ser executado dentro do toque, nunca após await.
 if(!exportFile||exportSignature!==tableSignature()){
  prepareConsultorImage().then(()=>exportStatus('Imagem pronta! Toque novamente em COMPARTILHAR IMAGEM.')).catch(()=>{});
  return
 }
 const file=exportFile;
 let supported=!!navigator.share;
 try{if(supported&&navigator.canShare)supported=navigator.canShare({files:[file]})}catch{supported=false}
 if(!supported){
  saveExportBlob(exportBlob||file,file.name);
  exportStatus('Compartilhamento indisponível neste navegador. A imagem foi baixada para você enviar.');
  return
 }
 try{
  const promise=navigator.share({files:[file],title:'Tabela de Coberturas',text:'Acompanhamento de coberturas'});
  Promise.resolve(promise).catch(e=>{if(e?.name!=='AbortError')exportStatus(e?.message||'Não foi possível compartilhar. Use Baixar Imagem.',true)})
 }catch(e){exportStatus(e?.message||'Não foi possível compartilhar. Use Baixar Imagem.',true)}
}

function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;decorateResults()});
}
function startWhenReady(){
  if(!painelAberto()){setTimeout(startWhenReady,500);return}
  ensureStyle();
  ensureControls();
  const old=$('consultorRelatorio');
  if(old)old.remove();
  decorateResults();
  const r=$('results');
  if(r&&!observer){
    observer=new MutationObserver(schedule);
    observer.observe(r,{childList:true,subtree:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(startWhenReady,300),{once:true});
else setTimeout(startWhenReady,300);
})();