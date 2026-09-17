(()=>{
const project='harlrfhukjvhpufwhtep';
const primary=`https://${project}.supabase.co/functions/v1`;
const fallback=`https://${project}.functions.supabase.co`;
const LOGIN=`${primary}/admin-login-api`;
const ADMIN=`${primary}/admin-api`;
const FALLBACK_ADMIN=`${fallback}/admin-api`;

const timeoutFor=p=>p?.action==='login'?6500:p?.action==='dashboard'?35000:p?.action==='admin_config'?18000:22000;
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
    try{return await call(LOGIN,payload,ms)}catch(e){if(e?.noRetry)throw e;return await call(ADMIN,payload,7000)}
  }
  try{return await call(ADMIN,payload,ms)}catch(e){
    if(e?.noRetry)throw e;
    try{return await call(FALLBACK_ADMIN,payload,Math.min(ms,18000))}catch(e2){
      if(e2?.name==='AbortError'||e?.name==='AbortError')throw Error('Servidor demorou para responder. O acesso foi mantido; tente atualizar os dados novamente.');
      throw Error(e2?.message||e?.message||'Falha de conexão com o servidor.');
    }
  }
}

function loadBadge(text,kind='wait'){
  let el=document.getElementById('adminFastLoad');
  if(!el){el=document.createElement('div');el.id='adminFastLoad';el.style.cssText='position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:99999;padding:11px 16px;border-radius:12px;font:800 13px Arial;box-shadow:0 5px 20px #0003;max-width:92%;text-align:center';document.body.appendChild(el)}
  el.style.background=kind==='err'?'#fff0f0':kind==='ok'?'#eaf8ef':'#fff';el.style.color=kind==='err'?'#b00000':kind==='ok'?'#166534':'#243443';el.textContent=text;
  if(kind==='ok')setTimeout(()=>el.remove(),1600);
}
function fastCarregarTudo(){
  try{document.getElementById('login')?.classList.add('hide');document.getElementById('app')?.classList.remove('hide')}catch{}
  loadBadge('Acesso liberado. Carregando painel...');
  (async()=>{
    try{
      const [d,c]=await Promise.all([robustPost({action:'dashboard',token}),robustPost({action:'admin_config',token})]);
      dash=d;config=c;
      try{renderBase()}catch(e){console.error(e)}
      try{renderVisaoResumo()}catch(e){console.error(e)}
      try{detectarLegado()}catch(e){console.error(e)}
      loadBadge('Painel atualizado.','ok');
    }catch(e){
      console.error(e);loadBadge(e?.message||'Não foi possível atualizar o painel agora.','err');
      if(String(e?.message||'').toLowerCase().includes('sessão')){try{sessionStorage.removeItem('admToken')}catch{}}
    }
  })();
  return Promise.resolve();
}

window.__adminRobustPost=robustPost;
window.post=robustPost;
window.__fastAdminLoad=fastCarregarTudo;
try{post=robustPost}catch{}
try{carregarTudo=fastCarregarTudo}catch{}
window.carregarTudo=fastCarregarTudo;

// Acorda o serviço de login antes do usuário tocar em ENTRAR, reduzindo o tempo de cold start.
fetch(LOGIN+'?warm='+Date.now(),{method:'GET',mode:'cors',cache:'no-store',credentials:'omit'}).catch(()=>{});

let n=0;const guard=setInterval(()=>{
  window.post=robustPost;window.carregarTudo=fastCarregarTudo;
  try{post=robustPost;carregarTudo=fastCarregarTudo}catch{}
  if(++n>24)clearInterval(guard)
},250);
})();