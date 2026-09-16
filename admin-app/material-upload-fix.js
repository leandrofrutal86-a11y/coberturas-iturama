(()=>{
 const PROJECT='harlrfhukjvhpufwhtep';
 const APIS=[
  `https://${PROJECT}.supabase.co/functions/v1/material-admin-api`,
  `https://${PROJECT}.functions.supabase.co/material-admin-api`
 ];
 const $=id=>document.getElementById(id);
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 function token(){return sessionStorage.getItem('admToken')||''}
 async function fetchTry(url,opts,timeout=20000){
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),timeout);
  try{return await fetch(url+'?v='+Date.now(),{...opts,mode:'cors',cache:'no-store',credentials:'omit',signal:ctrl.signal})}
  finally{clearTimeout(to)}
 }
 async function request(buildOpts){
  let last=null;
  for(const wait of [0,350]){
   if(wait)await sleep(wait);
   for(const url of APIS){
    try{
     const r=await fetchTry(url,buildOpts());
     const j=await r.json().catch(()=>({error:'Resposta inválida do servidor'}));
     if(r.ok&&!j.error)return j;
     const e=new Error(j.error||('Erro '+r.status));
     if(r.status===400||r.status===401||r.status===403||r.status===413)e.noRetry=true;
     throw e;
    }catch(e){last=e;if(e?.noRetry)throw e}
   }
  }
  if(last?.name==='AbortError')throw new Error('Servidor demorou para responder. Tente novamente.');
  throw new Error('Falha de conexão ao anexar o material. Tente novamente.');
 }
 async function jsonPost(body){
  return request(()=>({method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify(body)}));
 }
 async function refresh(){
  try{if(typeof window.carregarTudo==='function'){await window.carregarTudo();return}}catch{}
  try{if(typeof carregarTudo==='function'){await carregarTudo();return}}catch{}
  location.reload();
 }
 window.salvarMaterialLink=async function(){
  const st=$('matStatus');if(st){st.className='';st.textContent='Salvando link...'}
  try{
   const nome=$('matNome')?.value.trim()||'', url=$('matUrl')?.value.trim()||'', descricao=$('matDesc')?.value.trim()||'', ordem=Number($('matOrdem')?.value||0), id=Number($('matId')?.value||0);
   if(!nome)throw new Error('Informe o nome do material.'); if(!url)throw new Error('Informe o link do material.');
   await jsonPost({action:'save_link',token:token(),id,nome,url,descricao,ordem});
   if(st){st.className='ok';st.textContent='Link salvo com sucesso.'}
   setTimeout(refresh,250);
  }catch(e){if(st){st.className='bad';st.textContent=e.message}else alert(e.message)}
 };
 window.enviarMaterial=async function(){
  const st=$('matStatus'),file=$('matFile')?.files?.[0];if(st){st.className='';st.textContent='Enviando material...'}
  try{
   if(!file)throw new Error('Escolha um arquivo para anexar.');
   if(file.size<=0)throw new Error('O arquivo está vazio.');
   if(file.size>10*1024*1024)throw new Error('Arquivo acima de 10 MB.');
   const allowed=['application/pdf','image/jpeg','image/png','image/webp'];
   if(file.type&&!allowed.includes(file.type))throw new Error('Formato permitido: PDF, JPG, PNG ou WEBP.');
   const build=()=>{
    const fd=new FormData();
    fd.append('token',token());
    fd.append('file',file,file.name);
    fd.append('nome',$('matNome')?.value.trim()||file.name);
    fd.append('descricao',$('matDesc')?.value.trim()||'');
    fd.append('ordem',String(Number($('matOrdem')?.value||0)));
    fd.append('id',String(Number($('matId')?.value||0)));
    return {method:'POST',headers:{'Accept':'application/json'},body:fd};
   };
   await request(build);
   if(st){st.className='ok';st.textContent='Material anexado com sucesso.'}
   if($('matFile'))$('matFile').value='';
   setTimeout(refresh,250);
  }catch(e){if(st){st.className='bad';st.textContent=e.message}else alert(e.message)}
 };
})();