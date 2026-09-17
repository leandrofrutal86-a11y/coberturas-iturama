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
async function refreshAdminData(force=false){
  const now=Date.now();
  if(refreshPromise)return refreshPromise;
  if(!force&&now-lastRefresh<15000&&typeof dash!=='undefined'&&dash&&typeof config!=='undefined'&&config)return {dash,config};
  refreshPromise=(async()=>{
    let c=null,d=null;
    try{c=await robustPost({action:'admin_config',token});if(c)config=c}catch(e){console.warn('admin_config indisponível temporariamente',e)}
    await new Promise(r=>setTimeout(r,180));
    try{d=await robustPost({action:'dashboard',token});if(d)dash=d}catch(e){console.warn('dashboard indisponível temporariamente',e)}
    if((d||typeof dash!=='undefined'&&dash)&&(c||typeof config!=='undefined'&&config)){
      try{renderBase()}catch(e){console.warn(e)}
      try{renderVisaoResumo()}catch(e){console.warn(e)}
      try{detectarLegado()}catch(e){console.warn(e)}
      lastRefresh=Date.now();
    }
    return {dash:typeof dash!=='undefined'?dash:null,config:typeof config!=='undefined'?config:null};
  })().finally(()=>{refreshPromise=null});
  return refreshPromise;
}

function fastCarregarTudo(){
  try{document.getElementById('login')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide')}catch{}
  // O menu abre imediatamente. Dados pesados são atualizados em segundo plano e nunca bloqueiam o acesso.
  setTimeout(()=>refreshAdminData(false),120);
  return Promise.resolve();
}

window.__adminRobustPost=robustPost;
window.__refreshAdminData=refreshAdminData;
window.ensureAdminData=()=>refreshAdminData(false);
window.post=robustPost;
window.__fastAdminLoad=fastCarregarTudo;
try{post=robustPost;carregarTudo=fastCarregarTudo}catch{}
window.carregarTudo=fastCarregarTudo;

// Acorda somente o endpoint leve de login, sem carregar o dashboard pesado.
fetch(LOGIN+'?warm='+Date.now(),{method:'GET',mode:'cors',cache:'no-store',credentials:'omit'}).catch(()=>{});

let n=0;const guard=setInterval(()=>{
  window.post=robustPost;window.carregarTudo=fastCarregarTudo;
  try{post=robustPost;carregarTudo=fastCarregarTudo}catch{}
  if(++n>8)clearInterval(guard)
},250);
})();