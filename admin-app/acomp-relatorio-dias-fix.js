(()=>{
const $=id=>document.getElementById(id);
function diasUteisSemUltimo(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const ultimo=new Date(now.getFullYear(),now.getMonth()+1,0);
  let n=0;
  for(;d<ultimo;d.setDate(d.getDate()+1)){
    const w=d.getDay();
    if(w!==0&&w!==6)n++;
  }
  return n;
}
function ceilDiv(a,b){a=Math.max(0,Number(a)||0);return a===0?0:(b>0?Math.ceil(a/b):a)}
function textoNumero(s){const m=String(s||'').match(/-?\d+(?:[.,]\d+)?/);return m?Number(m[0].replace(',','.')):0}
function ajustarTela(){
  const table=document.querySelector('#acompReportResult .acompReportTable');
  if(!table)return false;
  const dias=diasUteisSemUltimo();
  table.querySelectorAll('tbody tr').forEach(tr=>{
    const td=tr.querySelectorAll('td');
    if(td.length<6)return;
    const falta=textoNumero(td[3].textContent);
    td[4].textContent=String(dias);
    td[5].textContent=String(ceilDiv(falta,dias));
  });
  const chips=[...document.querySelectorAll('#acompReportSummary .acompReportChip')];
  let faltaTotal=0;
  chips.forEach(c=>{if(c.textContent.trim().startsWith('FALTA:'))faltaTotal=textoNumero(c.textContent)});
  chips.forEach(c=>{
    const t=c.textContent.trim();
    if(t.startsWith('DIAS ÚTEIS RESTANTES:'))c.textContent=`DIAS ÚTEIS RESTANTES: ${dias}`;
    if(t.startsWith('MÉDIA TOTAL/DIA:'))c.textContent=`MÉDIA TOTAL/DIA: ${ceilDiv(faltaTotal,dias)}`;
  });
  const status=$('acompReportStatus');
  if(status&&status.textContent.includes('Relatório atualizado'))status.textContent=status.textContent.replace(/Contagem de dias úteis.*$/,'Dias úteis: segunda a sexta, sem considerar o último dia do mês.');
  return true;
}
function rowsFromTable(){
  const rows=[];
  document.querySelectorAll('#acompReportResult .acompReportTable tbody tr').forEach(tr=>{
    const td=[...tr.querySelectorAll('td')].map(x=>x.textContent.trim());
    if(td.length>=6)rows.push(td.slice(0,6));
  });
  return rows;
}
function chip(prefix){
  const c=[...document.querySelectorAll('#acompReportSummary .acompReportChip')].find(x=>x.textContent.trim().startsWith(prefix));
  return c?c.textContent.trim().slice(prefix.length).trim():'';
}
function loadScript(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function pdfCorrigido(){
  ajustarTela();
  const rows=rowsFromTable();
  if(!rows.length)return;
  const btn=$('acompReportPdf');
  if(btn)btn.disabled=true;
  const status=$('acompReportStatus');
  if(status)status.textContent='Gerando PDF...';
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',()=>!!window.jspdf);
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',()=>!!window.jspdf?.jsPDF?.API?.autoTable);
    const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const rota=chip('ROTA:')||'TODAS AS ROTAS',mes=chip('MÊS:'),dias=diasUteisSemUltimo(),meta=chip('META:'),real=chip('REALIZADO:'),falta=chip('FALTA:'),media=chip('MÉDIA TOTAL/DIA:');
    const data=new Date().toLocaleDateString('pt-BR');
    doc.setFillColor(198,0,10);doc.rect(0,0,297,22,'F');doc.setTextColor(255,255,255);doc.setFontSize(16);doc.setFont(undefined,'bold');doc.text('RELATÓRIO DE COBERTURAS - EQUIPE ITURAMA',14,10);doc.setFontSize(9);doc.text(`ROTA: ${rota}   MÊS: ${mes}   EMISSÃO: ${data}`,14,17);
    doc.setTextColor(25,25,25);doc.setFontSize(9);doc.text(`DIAS ÚTEIS RESTANTES: ${dias}   |   META: ${meta}   |   REALIZADO: ${real}   |   FALTA: ${falta}   |   MÉDIA TOTAL/DIA: ${media}`,14,29);
    doc.setFontSize(7);doc.text('Regra de dias úteis: segunda a sexta, sem considerar o último dia do mês.',14,33);
    doc.autoTable({startY:37,head:[['CATEGORIA','META','REALIZADO','FALTA','DIAS ÚTEIS RESTANTES','META DIÁRIA NECESSÁRIA']],body:rows,styles:{fontSize:8,cellPadding:2.4,overflow:'linebreak'},headStyles:{fillColor:[198,0,10],textColor:255,fontStyle:'bold'},columnStyles:{0:{cellWidth:105},1:{halign:'center',cellWidth:27},2:{halign:'center',cellWidth:30},3:{halign:'center',cellWidth:25},4:{halign:'center',cellWidth:42},5:{halign:'center',cellWidth:45}},margin:{left:10,right:10}});
    const safe=rota.replace(/[^a-z0-9_-]+/gi,'_');doc.save(`relatorio_coberturas_${safe}_${new Date().toISOString().slice(0,10)}.pdf`);
    if(status)status.textContent='PDF gerado com sucesso.';
  }catch(e){if(status)status.textContent='Erro ao gerar PDF: '+e.message}
  finally{if(btn)btn.disabled=false}
}
function bind(){
  const gen=$('acompReportGenerate'),pdf=$('acompReportPdf');
  if(!gen||!pdf)return false;
  if(gen.dataset.diasFix!=='1'){
    gen.dataset.diasFix='1';
    gen.addEventListener('click',()=>{
      let n=0;const t=setInterval(()=>{if(ajustarTela()||++n>80)clearInterval(t)},100);
    });
  }
  if(pdf.dataset.diasFix!=='1'){
    pdf.dataset.diasFix='1';
    pdf.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();pdfCorrigido()},true);
  }
  return true;
}
let n=0;const t=setInterval(()=>{if(bind()||++n>180)clearInterval(t)},250);
})();