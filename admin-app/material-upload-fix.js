(()=>{
 const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/material-admin-api';
 const $=id=>document.getElementById(id);
 function token(){return sessionStorage.getItem('admToken')||''}
 async function jsonPost(body){
  const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({error:'Resposta inválida do servidor'}));
  if(!r.ok||j.error)throw new Error(j.error||'Falha ao salvar material');return j;
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
   setTimeout(refresh,350);
  }catch(e){if(st){st.className='bad';st.textContent=e.message}else alert(e.message)}
 };
 window.enviarMaterial=async function(){
  const st=$('matStatus'),file=$('matFile')?.files?.[0];if(st){st.className='';st.textContent='Enviando material...'}
  try{
   if(!file)throw new Error('Escolha um arquivo para anexar.'); if(file.size>10*1024*1024)throw new Error('Arquivo acima de 10 MB.');
   const fd=new FormData();fd.append('token',token());fd.append('file',file);fd.append('nome',$('matNome')?.value.trim()||file.name);fd.append('descricao',$('matDesc')?.value.trim()||'');fd.append('ordem',String(Number($('matOrdem')?.value||0)));fd.append('id',String(Number($('matId')?.value||0)));
   const r=await fetch(API,{method:'POST',body:fd});const j=await r.json().catch(()=>({error:'Resposta inválida do servidor'}));if(!r.ok||j.error)throw new Error(j.error||'Falha ao anexar material');
   if(st){st.className='ok';st.textContent='Material anexado com sucesso.'}
   if($('matFile'))$('matFile').value='';setTimeout(refresh,350);
  }catch(e){if(st){st.className='bad';st.textContent=e.message}else alert(e.message)}
 };
})();