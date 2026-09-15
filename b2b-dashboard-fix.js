(()=>{
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/b2b-stats-api';
let stats=null,loading=null;
const norm=v=>String(v??'').trim().toUpperCase();

async function getFresh(){
  if(loading)return loading;
  loading=(async()=>{
    const sep=API.includes('?')?'&':'?';
    const r=await fetch(API+sep+'_='+Date.now(),{method:'POST',cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||j.error)throw Error(j.error||'Erro ao atualizar B2B');
    stats=j;
    window.__b2bStats=j;
    return j;
  })().finally(()=>{loading=null});
  return loading;
}

function route(){
  const c=String(window.getIturamaContext?.()||window.__ituramaContext||'').trim();
  if(c)return c;
  return String(document.querySelector('#route')?.textContent||'').match(/8[A-Z0-9]1/i)?.[0]?.toUpperCase()||'';
}
function total(){
  const vals=Object.values(stats?.routes||{});
  return vals.reduce((a,s)=>({compra:a.compra+Number(s?.compra||0),recompra:a.recompra+Number(s?.recompra||0)}),{compra:0,recompra:0});
}
function valuesFor(rt){
  return rt==='TEAM'?total():(stats?.routes?.[rt]||{compra:0,recompra:0});
}
function applyRow(r,s){
  const nome=norm(r?.nome);
  let n=null;
  if(nome==='COMPRA B2B')n=Number(s.compra||0);
  if(nome==='RECOMPRA B2B')n=Number(s.recompra||0);
  if(n===null)return false;
  const meta=Number(r.meta||0);
  r.realizado=n;
  r.falta=Math.max(meta-n,0);
  r.percentual=meta>0?Math.round(n/meta*100):0;
  return true;
}
function patchData(){
  if(!stats?.routes)return;
  try{
    if(typeof DATA!=='undefined'&&DATA){
      const rt=route();
      const ownS=valuesFor(rt);
      (DATA.own||[]).forEach(r=>applyRow(r,ownS));
      const teamS=total();
      (DATA.team||[]).forEach(r=>applyRow(r,teamS));
    }
  }catch{}
  try{
    if(window.dash?.individual){
      for(const i of window.dash.individual||[]){
        const s=valuesFor(String(i.rota||'').trim());
        (i.resultados||[]).forEach(r=>applyRow(r,s));
      }
    }
  }catch{}
}
function patchDom(){
  if(!stats?.routes)return;
  const s=valuesFor(route());
  document.querySelectorAll('#results tbody tr').forEach(tr=>{
    const txt=norm(tr.cells?.[0]?.textContent||'');
    let n=null;
    if(txt==='COMPRA B2B')n=Number(s.compra||0);
    if(txt==='RECOMPRA B2B')n=Number(s.recompra||0);
    if(n===null)return;
    const cells=tr.querySelectorAll('td');
    if(cells.length<5)return;
    const meta=Number((cells[1].textContent||'').match(/-?\d+(?:[.,]\d+)?/)?.[0]?.replace(',','.')||0);
    const cor=meta>0&&n<meta?'#c81920':'#078a46';
    cells[2].innerHTML=`<b style="color:${cor}">${n}</b>`;
    cells[3].textContent=String(Math.max(meta-n,0));
    cells[4].innerHTML=`<b style="color:${cor}">${meta>0?Math.round(n/meta*100)+'%':'—'}</b>`;
  });
}
function applyAll(render=false){
  patchData();
  if(render){
    try{if(typeof window.renderAcomp==='function')window.renderAcomp();else if(typeof render==='function')render()}catch{}
  }
  patchDom();
}
async function refresh(render=false){
  try{
    await getFresh();
    applyAll(render);
    window.dispatchEvent(new CustomEvent('iturama:b2bupdated',{detail:stats}));
  }catch(e){console.warn('B2B dashboard',e)}
}

window.addEventListener('iturama:routechange',()=>{applyAll(true);refresh(true)});
window.addEventListener('focus',()=>refresh(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(false)});
setTimeout(()=>refresh(true),500);
setTimeout(()=>refresh(false),2500);
setInterval(()=>applyAll(false),1200);
setInterval(()=>refresh(false),20000);
})();