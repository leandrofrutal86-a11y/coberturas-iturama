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
#results .meta-num{font-weight:900}
#results .falta-num{font-weight:900;color:#c5161d}
#results .pct-ok{color:#0b8a46;font-weight:900}
#results .pct-bad{color:#d71920;font-weight:900}
#results .meta-dia{font-weight:950;color:#075fae;font-size:12px}
#consultorDailyInfo{margin:6px 0 5px;padding:7px 9px;border-radius:9px;background:#eef5fb;color:#28465f;font-size:9px;font-weight:900;text-align:center}
#consultorDownloadBar{margin:6px 0 4px}
#consultorDownloadTable{display:block;width:100%;border:0;border-radius:12px;padding:11px 12px;background:#087d37;color:#fff;font-size:11px;font-weight:950;cursor:pointer}
#consultorDownloadTable:disabled{background:#aeb8bf}
@media(max-width:760px){
 .panel{padding:6px!important}
 .head{gap:4px!important}
 .panel h2{font-size:14px!important;margin:2px 0!important}
 .head small{font-size:9px!important}
 .head select{padding:7px!important;font-size:11px!important}
 #consultorDailyInfo{font-size:8px!important;margin:5px 0 4px!important;padding:6px!important}
 #consultorDownloadBar{margin:5px 0 4px!important}
 #consultorDownloadTable{font-size:10px!important;padding:10px 8px!important;border-radius:10px!important}
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
    bar.innerHTML='<button id="consultorDownloadTable">⬇️ BAIXAR TABELA</button>';
    results.insertAdjacentElement('beforebegin',bar);
    $('consultorDownloadTable').onclick=baixarPrimeiraTabela;
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
  if(bar)bar.style.display=meu?'block':'none';
  if(!table)return;
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
async function baixarPrimeiraTabela(){
  const table=$('results')?.querySelector('table');
  if(!table)return;
  const btn=$('consultorDownloadTable');
  if(btn){btn.disabled=true;btn.textContent='GERANDO IMAGEM...'}
  let stage=null;
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
    const c=consultor();
    const dias=diasUteisRestantes();
    const headers=[...table.querySelectorAll('thead th')].map(x=>x.textContent.trim());
    const rows=[...table.querySelectorAll('tbody tr')].map(tr=>[...tr.cells].map(td=>td.textContent.trim()));
    stage=document.createElement('div');
    stage.style.cssText='position:fixed;left:-10000px;top:0;width:1400px;background:#fff;color:#142236;font-family:Arial,sans-serif;padding:0;z-index:-1';
    const headHtml=headers.map((h,i)=>`<th style="background:#c3000b;color:#fff;padding:14px 10px;border:1px solid #a90009;text-align:${i===0?'left':'center'}">${escHtml(h)}</th>`).join('');
    const bodyHtml=rows.map((r,ri)=>`<tr>${r.map((v,i)=>`<td style="padding:13px 10px;border:1px solid #d6dde4;text-align:${i===0?'left':'center'};font-weight:${i===0?'900':'800'};background:${ri%2?'#f4f7f9':'#fff'}">${escHtml(v)}</td>`).join('')}</tr>`).join('');
    stage.innerHTML=`
      <div style="background:linear-gradient(180deg,#d90914,#ad0008);color:#fff;padding:24px 28px">
        <div style="font-size:29px;font-weight:900">ACOMPANHAMENTO DE COBERTURAS</div>
        <div style="font-size:16px;font-weight:800;margin-top:8px">${escHtml(c.rota||'')} ${escHtml(c.nome||'')}</div>
        <div style="font-size:14px;font-weight:700;margin-top:7px">Dias úteis restantes: ${dias} • segunda a sexta • último dia do mês não considerado</div>
      </div>
      <div style="padding:22px 24px 28px">
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:18px">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>`;
    document.body.appendChild(stage);
    const canvas=await window.html2canvas(stage,{scale:3,backgroundColor:'#ffffff',useCORS:true,logging:false,width:1400,windowWidth:1400});
    const blob=await new Promise(ok=>canvas.toBlob(ok,'image/png',1));
    if(!blob)throw Error('Não foi possível criar a imagem.');
    const a=document.createElement('a');
    const url=URL.createObjectURL(blob);
    a.href=url;
    a.download=`tabela_coberturas_${String(c.rota||'consultor').replace(/[^a-z0-9_-]/gi,'_')}_${new Date().toISOString().slice(0,10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }catch(e){
    alert('Erro ao baixar tabela: '+(e?.message||e));
  }finally{
    stage?.remove();
    if(btn){btn.disabled=false;btn.textContent='⬇️ BAIXAR TABELA'}
  }
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