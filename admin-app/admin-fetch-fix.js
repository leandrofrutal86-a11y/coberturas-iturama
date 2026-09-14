(()=>{
const project='harlrfhukjvhpufwhtep';
const adminUrls=[
  `https://${project}.supabase.co/functions/v1/admin-api`,
  `https://${project}.functions.supabase.co/admin-api`
];
const loginUrls=[
  `https://${project}.supabase.co/functions/v1/admin-login-api`,
  `https://${project}.functions.supabase.co/admin-login-api`,
  ...adminUrls
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function tryFetch(url,payload){
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),12000);
  try{
    const r=await fetch(url+'?v='+Date.now(),{
      method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
      headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},
      body:JSON.stringify(payload),signal:ctrl.signal
    });
    let j={};try{j=await r.json()}catch{}
    if(r.ok)return j;
    const e=new Error(j.error||('Erro '+r.status));
    if(r.status===400||r.status===401||r.status===403){e.noRetry=true;throw e}
    throw e;
  }finally{clearTimeout(to)}
}
async function robustPost(payload){
  const urls=payload?.action==='login'?loginUrls:adminUrls;
  let last=null;
  const waits=[0,350,900];
  for(let round=0;round<waits.length;round++){
    if(waits[round])await sleep(waits[round]);
    for(const url of urls){
      try{return await tryFetch(url,payload)}catch(e){
        last=e;
        if(e?.noRetry)throw e;
      }
    }
  }
  if(last?.name==='AbortError')throw Error('Servidor demorou para responder. Tente novamente.');
  throw Error('Falha de conexão com o servidor. Aguarde alguns segundos e tente novamente.');
}
window.__adminRobustPost=robustPost;
window.post=robustPost;
try{post=robustPost}catch{}
let n=0;const guard=setInterval(()=>{window.post=robustPost;try{post=robustPost}catch{};if(++n>20)clearInterval(guard)},250);
})();