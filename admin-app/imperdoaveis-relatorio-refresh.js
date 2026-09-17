(()=>{
// Nunca gerar relatório automaticamente ao entrar ou trocar filtros.
// Também força toda chamada ao imperdoaveis-api a ignorar cache.
const originalFetch=window.fetch.bind(window);
window.fetch=(input,init)=>{
  try{
    if(typeof input==='string'&&input.includes('/functions/v1/imperdoaveis-api')){
      const sep=input.includes('?')?'&':'?';
      input=input+sep+'_v='+Date.now();
      init={...(init||{}),cache:'no-store'};
    }
  }catch{}
  return originalFetch(input,init);
};
function bind(){
  const tab=document.getElementById('impTabReport');
  if(!tab||tab.dataset.finalBound==='1')return false;
  tab.dataset.finalBound='1';
  tab.addEventListener('click',()=>{
    const result=document.getElementById('impReportResult');
    const summary=document.getElementById('impReportSummary');
    const status=document.getElementById('impReportStatus');
    if(result)result.innerHTML='';
    if(summary)summary.innerHTML='';
    if(status)status.textContent='Selecione os filtros e toque em GERAR RELATÓRIO.';
    const pdf=document.getElementById('impReportPdf');
    if(pdf)pdf.disabled=true;
  });
  return true;
}
let n=0;const t=setInterval(()=>{if(bind()||++n>150)clearInterval(t)},200);
})();