(()=>{
function clearForSelection(msg='Selecione os filtros e clique em GERAR RELATÓRIO.'){
  const result=document.getElementById('impReportResult');
  const summary=document.getElementById('impReportSummary');
  const status=document.getElementById('impReportStatus');
  const pdf=document.getElementById('impReportPdf');
  if(result)result.innerHTML='';
  if(summary)summary.innerHTML='';
  if(status)status.textContent=msg;
  if(pdf)pdf.disabled=true;
}
function bind(){
  const tab=document.getElementById('impTabReport');
  const btn=document.getElementById('impReportGenerate');
  if(!tab||!btn||tab.dataset.manualBound==='1')return false;
  tab.dataset.manualBound='1';
  tab.addEventListener('click',()=>setTimeout(()=>clearForSelection(),0));
  ['impReportRoute','impReportCat','impReportR1','impReportR2','impReportR3'].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.dataset.manualBound!=='1'){
      el.dataset.manualBound='1';
      el.addEventListener('change',()=>setTimeout(()=>clearForSelection('Filtros alterados. Clique em GERAR RELATÓRIO para consultar somente esta seleção.'),0));
    }
  });
  return true;
}
let n=0;const t=setInterval(()=>{if(bind()||++n>150)clearInterval(t)},200);
})();