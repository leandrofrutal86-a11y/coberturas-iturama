(()=>{
function bind(){
  const tab=document.getElementById('impTabReport');
  const btn=document.getElementById('impReportGenerate');
  if(!tab||!btn||tab.dataset.freshBound==='1')return false;
  tab.dataset.freshBound='1';
  tab.addEventListener('click',()=>{
    const result=document.getElementById('impReportResult');
    const summary=document.getElementById('impReportSummary');
    const status=document.getElementById('impReportStatus');
    if(result)result.innerHTML='';
    if(summary)summary.innerHTML='';
    if(status)status.textContent='Atualizando vendas e Imperdoáveis...';
    setTimeout(()=>{if(!btn.disabled)btn.click()},120);
  });
  const route=document.getElementById('impReportRoute');
  if(route&&!route.dataset.freshBound){
    route.dataset.freshBound='1';
    route.addEventListener('change',()=>setTimeout(()=>{if(!btn.disabled)btn.click()},50));
  }
  return true;
}
let n=0;const t=setInterval(()=>{if(bind()||++n>150)clearInterval(t)},200);
})();