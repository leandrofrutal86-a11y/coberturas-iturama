(()=>{
const norm=v=>String(v??'').trim().toUpperCase();
function fixClient(c){
  if(!c)return c;
  const sold=new Set((c.soldMaterials||[]).map(v=>String(v??'').trim().replace(/^0+(?=\d)/,'')));
  for(const cat of (c.categorias||[])){
    for(const s of (cat.slots||[])){
      const vals=Array.isArray(s.valores)?s.valores.map(v=>String(v??'').trim().replace(/^0+(?=\d)/,'')):[];
      if(s.campo==='material'&&s.operador==='IN'&&vals.some(v=>sold.has(v)))s.vendido=true;
      if(Array.isArray(s.matchedCodes)&&s.matchedCodes.length)s.vendido=true;
      const n=norm(s.nome);
      if(String(cat.categoria||'').toUpperCase()==='SSD'&&c.ccoSmallSold&&n.includes('CCO KS 290ML')&&n.includes('LT 310ML'))s.vendido=true;
      if(String(cat.categoria||'').toUpperCase()==='STILL'&&n==='ÁGUA PT 500ML'&&['1219','1220'].some(v=>sold.has(v)))s.vendido=true;
      if(String(cat.categoria||'').toUpperCase()==='STILL'&&n.includes('NECTAR LT 290ML')&&n.includes('FRUT PT 450ML')&&['1434','1578','1584','1585','1613','1616','1697','1792','1793','1822','1830','1839','8228','8230','8232'].some(v=>sold.has(v)))s.vendido=true;
    }
    cat.vendidos=(cat.slots||[]).filter(s=>s.vendido).length;
    cat.faltam=(cat.slots||[]).filter(s=>!s.vendido).length;
  }
  c.faltam=(c.categorias||[]).reduce((a,x)=>a+Number(x.faltam||0),0);
  c.status=c.faltam===0?'coberto':c.faltam===1?'resta1':c.faltam===2?'resta2':'resta3';
  return c;
}
if(!window.__impReportFetchFixed){
  window.__impReportFetchFixed=true;
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    let isImp=false,url=input;
    try{
      if(typeof input==='string'&&input.includes('/functions/v1/imperdoaveis-api')){
        isImp=true;
        const sep=input.includes('?')?'&':'?';
        url=input+sep+'_v='+Date.now();
        init={...(init||{}),cache:'no-store'};
      }
    }catch{}
    const r=await nativeFetch(url,init);
    if(!isImp)return r;
    try{
      const clone=r.clone();
      const txt=await clone.text();
      const j=JSON.parse(txt);
      if(Array.isArray(j.clients))j.clients=j.clients.map(fixClient);
      return new Response(JSON.stringify(j),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
    }catch{return r}
  };
}
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