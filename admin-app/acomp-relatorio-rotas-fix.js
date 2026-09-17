(()=>{
const ROUTES=['8A1','8B1','8C1','8D1','8F1'];
function getDash(){try{return window.__adminDash||(typeof dash!=='undefined'?dash:null)||window.dash||null}catch{return window.__adminDash||window.dash||null}}
function labelFor(route,d){const x=(d?.individual||[]).find(i=>String(i.rota||'').trim().toUpperCase()===route);return x?`${route} ${String(x.nome||'').trim()}`.trim():route}
function apply(d=getDash()){
  const sel=document.getElementById('acompReportRoute');if(!sel)return false;
  const cur=sel.value;
  const html=['<option value="">TODAS AS ROTAS</option>',...ROUTES.map(r=>`<option value="${r}">${labelFor(r,d)}</option>`)].join('');
  if(sel.innerHTML!==html)sel.innerHTML=html;
  if(cur===''||ROUTES.includes(cur))sel.value=cur;
  return true;
}
window.addEventListener('iturama:admindash',e=>setTimeout(()=>apply(e.detail),0));
let tries=0;const timer=setInterval(()=>{if(apply()||++tries>160)clearInterval(timer)},200);
const obs=new MutationObserver(()=>apply());
const watch=()=>{const s=document.getElementById('acompReportRoute');if(s){obs.observe(s,{childList:true});return true}return false};
let w=0;const wt=setInterval(()=>{if(watch()||++w>160)clearInterval(wt)},200);
})();