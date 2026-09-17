(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let relRows=[],relInfo=null,observer=null,scheduled=false;
function diasUteisRestantes(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const ultimo=new Date(now.getFullYear(),now.getMonth()+1,0);
  const limite=new Date(ultimo.getFullYear(),ultimo.getMonth(),ultimo.getDate()-1);
  let n=0;
  for(;d<=limite;d.setDate(d.getDate()+1)){const w=d.getDay();if(w!==0&&w!==6)n++}
  return n;
}
function metaDiaria(falta,dias){const f=Math.max(0,Number(falta)||0);if(!f)return 0;return dias?Math.ceil(f/dias):f}
function painelAberto(){const d=$('dash');return !!d&&!d.classList.contains('hidden')}
function isMeu(){try{return typeof TAB==='undefined'||TAB==='meu'}catch{return true}}
function ownRows(){try{return Array.isArray(DATA?.own)?DATA.own:[]}catch{return[]}}
function consultor(){try{return DATA?.consultor||{}}catch{return{}}}
function ensureStyle(){
  let st=$('consultorResultsStyle');if(st)st.remove();
  st=document.createElement('style');st.id='consultorResultsStyle';st.textContent=`
#results{width:100%;max-width:100%}#results .tableWrap{border:1px solid #d6dee6;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px #0000000d;margin-top:8px}
#results table{width:100%;min-width:0;border-collapse:collapse;table-layout:fixed}#results thead th{background:#b70712;color:#fff;font-weight:900;padding:8px 5px;text-align:center;font-size:10px}
#results thead th:first-child{text-align:left;width:34%}#results tbody tr:nth-child(odd) td{background:#f2f8fd}#results tbody tr:nth-child(even) td{background:#fff}
#results tbody td{padding:7px 5px;border-bottom:1px solid #dfe7ee;text-align:center;font-size:10px;vertical-align:middle}#results tbody td:first-child{text-align:left;font-weight:900;color:#10263a}
#results .res-ok{color:#0b8a46;font-weight:900}#results .res-bad{color:#d71920;font-weight:900}#results .meta-num{font-weight:900}#results .falta-num{font-weight:900;color:#c5161d}#results .pct-ok{color:#0b8a46;font-weight:900}#results .pct-bad{color:#d71920;font-weight:900}#results .meta-dia{font-weight:950;color:#075fae;font-size:12px}
#results .daily-note{margin:6px 0 4px;padding:7px 9px;border-radius:9px;background:#eef5fb;color:#28465f;font-size:9px;font-weight:900;text-align:center}
#consultorRelatorio{margin-top:10px;border:1px solid #d8e0e6;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 3px 12px #0001}#consultorRelatorio.hiddenRel{display:none!important}
.crHead{background:linear-gradient(180deg,#d90914,#ad0008);color:#fff;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.crHead b{font-size:14px}.crHead small{font-size:9px;font-weight:800;opacity:.95}
.crBtns{display:flex;gap:6px;padding:8px;background:#f5f7f9;flex-wrap:wrap}.crBtns button{border:0;border-radius:8px;padding:8px 10px;color:#fff;font-size:10px;font-weight:900;cursor:pointer}.crGen{background:#d50612}.crPdf{background:#087d37}.crPrint{background:#1c5fa8}.crBtns button:disabled{background:#b8c1c8;cursor:not-allowed}
#crStatus{font-size:9px;font-weight:800;color:#536273;padding:0 10px 7px}#crResumo{display:flex;gap:5px;flex-wrap:wrap;padding:7px 10px}.crChip{font-size:8px;font-weight:900;background:#eef3f6;border:1px solid #d4dde4;border-radius:999px;padding:5px 7px}
#crResultado{padding:0 10px 10px}.crTableWrap{overflow:hidden;border:1px solid #dce3e8;border-radius:9px}.crTable{width:100%;border-collapse:collapse;table-layout:fixed}.crTable th{background:#c3000b;color:#fff;padding:7px 4px;font-size:9px}.crTable td{padding:7px 4px;border-bottom:1px solid #e0e6eb;text-align:center;font-size:9px;font-weight:800}.crTable td:first-child{text-align:left;font-weight:900}.crTable tr:nth-child(even) td{background:#f5f8fa}.crEmpty{padding:14px;text-align:center;font-size:10px;font-weight:800;color:#64748b}
@media(max-width:760px){
 .panel{padding:6px!important}.head{gap:4px!important}.panel h2{font-size:14px!important;margin:2px 0!important}.head small{font-size:9px!important}.head select{padding:7px!important;font-size:11px!important}
 #results .tableWrap{width:100%!important;max-width:100%!important;overflow:hidden!important;margin-top:5px!important;border-radius:8px!important}
 #results table{display:table!important;width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:collapse!important}
 #results thead{display:table-header-group!important}#results tbody{display:table-row-group!important}
 #results tr{display:table-row!important}#results th,#results td{display:table-cell!important;box-sizing:border-box!important;min-width:0!important;white-space:normal!important;overflow-wrap:anywhere!important}
 #results thead th{padding:6px 1px!important;font-size:6.6px!important;line-height:1.02!important;text-align:center!important}
 #results thead th:first-child{width:42%!important;text-align:left!important;padding-left:4px!important}
 #results thead th:nth-child(2){width:10%!important}#results thead th:nth-child(3){width:13%!important}#results thead th:nth-child(4){width:10%!important}#results thead th:nth-child(5){width:9%!important}#results thead th:nth-child(6){width:16%!important}
 #results tbody td{padding:6px 1px!important;font-size:7.4px!important;line-height:1.06!important;text-align:center!important;border-right:1px solid #e1e7ec!important}
 #results tbody td:first-child{width:42%!important;text-align:left!important;padding-left:4px!important;font-size:7.2px!important;font-weight:900!important}
 #results tbody td:nth-child(2){width:10%!important}#results tbody td:nth-child(3){width:13%!important}#results tbody td:nth-child(4){width:10%!important}#results tbody td:nth-child(5){width:9%!important}#results tbody td:nth-child(6){width:16%!important;border-right:0!important}
 #results .meta-dia{font-size:8.2px!important}.daily-note{font-size:8px!important;margin:5px 0 4px!important}
 .crHead{padding:8px}.crHead b{font-size:12px}.crBtns{display:grid;grid-template-columns:1fr 1fr 1fr;padding:6px;gap:4px}.crBtns button{font-size:8px;padding:8px 2px}.crChip{font-size:7px;padding:4px 6px}#crStatus{font-size:8px;padding:0 7px 5px}#crResumo{padding:5px 7px}
 #crResultado{padding:0 6px 7px}.crTableWrap{width:100%;overflow:hidden}.crTable{display:table;width:100%;min-width:0;table-layout:fixed}.crTable thead{display:table-header-group}.crTable tbody{display:table-row-group}.crTable tr{display:table-row}.crTable th,.crTable td{display:table-cell;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere}
 .crTable th{font-size:6.8px;padding:6px 1px}.crTable td{font-size:7.5px;padding:6px 1px}.crTable th:first-child,.crTable td:first-child{width:48%;text-align:left;padding-left:4px}.crTable th:nth-child(2),.crTable td:nth-child(2){width:11%}.crTable th:nth-child(3),.crTable td:nth-child(3){width:14%}.crTable th:nth-child(4),.crTable td:nth-child(4){width:11%}.crTable th:nth-child(5),.crTable td:nth-child(5){width:16%}
}
`;
  document.head.appendChild(st)
}
function decorateResults(){
  if(!painelAberto())return;const results=$('results'),table=results?.querySelector('table');if(!table)return;
  const meu=isMeu(),head=table.querySelector('thead tr');
  if(meu&&head&&head.cells.length===5){const th=document.createElement('th');th.textContent='Meta/dia';head.appendChild(th)}
  const dias=diasUteisRestantes();
  table.querySelectorAll('tbody tr').forEach(tr=>{
    if(tr.cells.length<5)return;const meta=Number(String(tr.cells[1].textContent).replace(',','.'))||0,real=Number(String(tr.cells[2].textContent).replace(',','.'))||0,falta=Math.max(Number(String(tr.cells[3].textContent).replace(',','.'))||0,0),ok=real>=meta;
    tr.cells[1].classList.add('meta-num');tr.cells[2].classList.add(ok?'res-ok':'res-bad');tr.cells[3].classList.add('falta-num');tr.cells[4].classList.add(ok?'pct-ok':'pct-bad');
    if(meu&&tr.cells.length===5){const b=tr.insertCell();b.className='meta-dia';b.textContent=String(metaDiaria(falta,dias))}
    const labs=['','Meta','Real','Falta','%','Meta/dia'];[...tr.cells].forEach((c,i)=>{if(i>0)c.dataset.label=labs[i]||''})
  });
  let note=results.querySelector('.daily-note');if(meu){if(!note){note=document.createElement('div');note.className='daily-note';table.parentElement?.insertAdjacentElement('beforebegin',note)}note.textContent=`Dias úteis restantes: ${dias}. Meta/dia calculada de segunda a sexta, sem contar o último dia do mês.`}else note?.remove();
  ensureReport();toggleReport();
}
function reportRows(){const dias=diasUteisRestantes();return ownRows().map(x=>{const meta=Number(x.meta||0),real=Number(x.realizado||0),falta=Math.max(meta-real,0);return{nome:String(x.nome||''),meta,real,falta,dias,diaria:metaDiaria(falta,dias)}}).filter(x=>x.falta>0)}
function ensureReport(){
  if($('consultorRelatorio'))return;const results=$('results');if(!results)return;
  const box=document.createElement('section');box.id='consultorRelatorio';box.innerHTML=`<div class="crHead"><div><b>RELATÓRIO INDIVIDUAL</b><br><small>META • REALIZADO • FALTA • META/DIA</small></div><small>DIAS ÚTEIS NO TOPO • ÚLTIMO DIA FORA</small></div><div class="crBtns"><button id="crGerar" class="crGen">GERAR RELATÓRIO</button><button id="crPdf" class="crPdf" disabled>📄 BAIXAR PDF</button><button id="crPrint" class="crPrint" disabled>🖨️ IMPRIMIR</button></div><div id="crStatus">Clique em GERAR RELATÓRIO.</div><div id="crResumo"></div><div id="crResultado"></div>`;
  results.insertAdjacentElement('afterend',box);$('crGerar').onclick=gerarRelatorio;$('crPdf').onclick=baixarPdf;$('crPrint').onclick=imprimirRelatorio
}
function toggleReport(){const b=$('consultorRelatorio');if(b)b.classList.toggle('hiddenRel',!isMeu())}
function gerarRelatorio(){
  const rows=reportRows(),c=consultor(),dias=diasUteisRestantes(),agora=new Date(),mes=agora.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase();
  relRows=rows;relInfo={nome:c.nome||'',rota:c.rota||'',dias,mes,data:agora.toLocaleDateString('pt-BR')};
  const all=ownRows(),tot=all.reduce((a,x)=>{const m=Number(x.meta||0),r=Number(x.realizado||0);a.meta+=m;a.real+=r;a.falta+=Math.max(m-r,0);return a},{meta:0,real:0,falta:0});
  $('crResumo').innerHTML=`<span class="crChip">${esc(relInfo.rota)} ${esc(relInfo.nome)}</span><span class="crChip">META ${tot.meta}</span><span class="crChip">REAL ${tot.real}</span><span class="crChip">FALTA ${tot.falta}</span><span class="crChip">DIAS ${dias}</span>`;
  if(!rows.length)$('crResultado').innerHTML='<div class="crEmpty">Nenhuma cobertura pendente. Meta concluída.</div>';else $('crResultado').innerHTML=`<div class="crTableWrap"><table class="crTable"><thead><tr><th>Categoria</th><th>Meta</th><th>Realizado</th><th>Falta</th><th>Meta/dia</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.nome)}</td><td>${r.meta}</td><td>${r.real}</td><td>${r.falta}</td><td>${r.diaria}</td></tr>`).join('')}</tbody></table></div>`;
  $('crStatus').textContent=`Relatório gerado em ${relInfo.data}. Mostrando somente categorias que ainda faltam.`;$('crPdf').disabled=false;$('crPrint').disabled=false
}
function loadScript(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o gerador de PDF.'));document.head.appendChild(s)})}
async function baixarPdf(){
  if(!relInfo)gerarRelatorio();if(!relInfo)return;const b=$('crPdf');b.disabled=true;$('crStatus').textContent='Gerando PDF...';
  try{await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',()=>!!window.jspdf);await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',()=>!!window.jspdf?.jsPDF?.API?.autoTable);const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});doc.setFillColor(198,0,10);doc.rect(0,0,297,22,'F');doc.setTextColor(255,255,255);doc.setFontSize(15);doc.setFont(undefined,'bold');doc.text('RELATÓRIO DE COBERTURAS - EQUIPE ITURAMA',12,10);doc.setFontSize(9);doc.text(`${relInfo.rota} ${relInfo.nome}   |   ${relInfo.mes}   |   EMISSÃO: ${relInfo.data}`,12,17);doc.setTextColor(20,20,20);doc.setFontSize(8);doc.text(`Dias úteis restantes: ${relInfo.dias} - segunda a sexta, sem considerar o último dia do mês.`,12,29);doc.autoTable({startY:34,head:[['CATEGORIA','META','REALIZADO','FALTA','META/DIA']],body:relRows.map(r=>[r.nome,String(r.meta),String(r.real),String(r.falta),String(r.diaria)]),styles:{fontSize:8,cellPadding:2.5},headStyles:{fillColor:[198,0,10],textColor:255,fontStyle:'bold'},margin:{left:10,right:10}});doc.save(`relatorio_${String(relInfo.rota||'consultor').replace(/[^a-z0-9_-]/gi,'_')}_${new Date().toISOString().slice(0,10)}.pdf`);$('crStatus').textContent='PDF gerado com sucesso.'}catch(e){$('crStatus').textContent='Erro ao gerar PDF: '+e.message}finally{b.disabled=false}
}
function imprimirRelatorio(){
  if(!relInfo)gerarRelatorio();if(!relInfo)return;const w=window.open('','_blank');if(!w){alert('Libere pop-ups para imprimir.');return}const rows=relRows.map(r=>`<tr><td>${esc(r.nome)}</td><td>${r.meta}</td><td>${r.real}</td><td>${r.falta}</td><td>${r.diaria}</td></tr>`).join('');w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Relatório ${esc(relInfo.rota)}</title><style>@page{size:A4 landscape;margin:8mm}body{font-family:Arial;margin:0;color:#111}h1{font-size:18px;margin:0;color:#b40009}p{font-size:11px}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#c3000b;color:#fff}th,td{border:1px solid #bbb;padding:6px;text-align:center}td:first-child{text-align:left;font-weight:bold}</style></head><body><h1>RELATÓRIO DE COBERTURAS - EQUIPE ITURAMA</h1><p><b>${esc(relInfo.rota)} ${esc(relInfo.nome)}</b> • ${esc(relInfo.mes)} • Emissão ${esc(relInfo.data)}<br>Dias úteis restantes: ${relInfo.dias}. Segunda a sexta, sem considerar o último dia do mês.</p><table><thead><tr><th>Categoria</th><th>Meta</th><th>Realizado</th><th>Falta</th><th>Meta/dia</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Nenhuma cobertura pendente.</td></tr>'}</tbody></table><script>window.onload=()=>{window.print()}<\/script></body></html>`);w.document.close()
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorateResults()})}
function startWhenReady(){if(!painelAberto()){setTimeout(startWhenReady,500);return}ensureStyle();ensureReport();decorateResults();const r=$('results');if(r&&!observer){observer=new MutationObserver(schedule);observer.observe(r,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(startWhenReady,300),{once:true});else setTimeout(startWhenReady,300);
})();