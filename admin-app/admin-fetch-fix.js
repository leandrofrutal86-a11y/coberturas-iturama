(()=>{
const urls=['https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api','https://harlrfhukjvhpufwhtep.functions.supabase.co/admin-api'];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function tryFetch(url,payload){const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),12000);try{const r=await fetch(url+'?v='+Date.now(),{method:'POST',mode:'cors',cache:'no-store',credentials:'omit',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:ctrl.signal});let j={};try{j=await r.json()}catch{}if(!r.ok)throw Error(j.error||('Erro '+r.status));return j}finally{clearTimeout(to)}}
window.post=async function(payload){let last;for(let round=0;round<2;round++){for(const url of urls){try{return await tryFetch(url,payload)}catch(e){last=e}}if(round===0)await sleep(700)}throw Error(last?.name==='AbortError'?'Servidor demorou para responder. Tente novamente.':(last?.message||'Falha de conexão com o servidor.'))};
})();