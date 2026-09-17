(()=>{
const project='harlrfhukjvhpufwhtep';
const primary=`https://${project}.supabase.co/functions/v1`;
const fallback=`https://${project}.functions.supabase.co`;
const LOGIN=`${primary}/admin-login-api`;
const ADMIN=`${primary}/admin-api`;
const FALLBACK_ADMIN=`${fallback}/admin-api`;

const timeoutFor=p=>p?.action==='login'?5000:p?.action==='dashboard'?30000:p?.action==='admin_config'?18000:22000;
async function call(url,payload,ms){
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),ms);
  try{
    const r=await fetch(url+'?v='+Date.now(),{method:'POST',mode:'cors',cache:'no-store',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});
    let j={};try{j=await r.json()}catch{}
    if(r.ok)return j;
    const e=new Error(j.error||('Erro '+r.status));e.status=r.status;if([400,401,403].includes(r.status))e.noRetry=true;throw e;
  }finally{clearTimeout(to)}
}
async function robustPost(payload){
  const ms=timeoutFor(payload);
  if(payload?.action==='login'){
    try{return await call(LOGIN,payload,ms)}catch(e){if(e?.noRetry)throw e;return await call(ADMIN,payload,6500)}
  }
  try{return await call(ADMIN,payload,ms)}catch(e){
    if(e?.noRetry)throw e;
    return await call(FALLBACK_ADMIN,payload,Math.min(ms,15000));
  }
}

let refreshPromise=null,lastRefresh=0;
function publishDash(d){
  if(!d)return;
  window.__adminDash=d;
  try{if(typeof window.renderAcompSplitNow==='function')window.renderAcompSplitNow(d)}catch(e){console.warn('Acompanhamento render',e)}
  try{window.dispatchEvent(new CustomEvent('iturama:admindash',{detail:d}))}catch{}
}
async function refreshAdminData(force=false){
  const now=Date.now();
  if(refreshPromise)return refreshPromise;
  if(!force&&now-lastRefresh<15000&&typeof dash!=='undefined'&&dash&&typeof config!=='undefined'&&config){publishDash(dash);return {dash,config}}
  refreshPromise=(async()=>{
    let c=null,d=null;
    try{c=await robustPost({action:'admin_config',token});if(c)config=c}catch(e){console.warn('admin_config indisponível temporariamente',e)}
    await new Promise(r=>setTimeout(r,80));
    try{
      d=await robustPost({action:'dashboard',token});
      if(d){dash=d;publishDash(d)}
    }catch(e){console.warn('dashboard indisponível temporariamente',e)}
    if((d||typeof dash!=='undefined'&&dash)&&(c||typeof config!=='undefined'&&config)){
      try{renderBase()}catch(e){console.warn(e)}
      try{renderVisaoResumo()}catch(e){console.warn(e)}
      try{detectarLegado()}catch(e){console.warn(e)}
      try{publishDash(typeof dash!=='undefined'?dash:d)}catch{}
      lastRefresh=Date.now();
    }
    return {dash:typeof dash!=='undefined'?dash:null,config:typeof config!=='undefined'?config:null};
  })().finally(()=>{refreshPromise=null});
  return refreshPromise;
}

async function fetchDashboardOnly(force=false){
  try{
    if(!force&&window.__adminDash?.individual?.length)return window.__adminDash;
    const d=await robustPost({action:'dashboard',token});
    if(d){try{dash=d}catch{}publishDash(d);lastRefresh=Date.now()}
    return d;
  }catch(e){console.warn('dashboard acompanhamento',e);throw e}
}

function fastCarregarTudo(){
  try{document.getElementById('login')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide')}catch{}
  setTimeout(()=>refreshAdminData(false),120);
  return Promise.resolve();
}

window.__adminRobustPost=robustPost;
window.__refreshAdminData=refreshAdminData;
window.__fetchAdminDashboard=fetchDashboardOnly;
window.ensureAdminData=()=>refreshAdminData(false);
window.post=robustPost;
window.__fastAdminLoad=fastCarregarTudo;
try{post=robustPost;carregarTudo=fastCarregarTudo}catch{}
window.carregarTudo=fastCarregarTudo;
try{if(typeof dash!=='undefined'&&dash)publishDash(dash)}catch{}

fetch(LOGIN+'?warm='+Date.now(),{method:'GET',mode:'cors',cache:'no-store',credentials:'omit'}).catch(()=>{});

let n=0;const guard=setInterval(()=>{
  window.post=robustPost;window.carregarTudo=fastCarregarTudo;
  try{post=robustPost;carregarTudo=fastCarregarTudo}catch{}
  try{if(typeof dash!=='undefined'&&dash&&!window.__adminDash)publishDash(dash)}catch{}
  if(++n>12)clearInterval(guard)
},250);
})();