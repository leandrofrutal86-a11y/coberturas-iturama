(()=>{
'use strict';
const $=id=>document.getElementById(id);
let running=false;
const api='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const pause=ms=>new Promise(ok=>setTimeout(ok,ms));
function status(text,ok=false){
 const el=$('statusVendas');if(el){el.className=ok?'ok':/^(Falha|Erro|Não foi possível)/i.test(text)?'bad':'notice';el.textContent=text}
}
function sessionToken(){
 try{return String(typeof token!=='undefined'?token:sessionStorage.getItem('admToken')||'')}
 catch{return String(sessionStorage.getItem('admToken')||'')}
}
async function request(action,body={},timeout=23000){
 const ctrl=new AbortController(),abort=setTimeout(()=>ctrl.abort(),timeout);
 try{
  const resp=await fetch(api+'?v='+Date.now(),{
   method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
   headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},
   signal:ctrl.signal,body:JSON.stringify({action,token:sessionToken(),...body})
  });
  const j=await resp.json().catch(()=>({}));
  if(!resp.ok||j.error){
   const e=new Error(j.error||'Servidor respondeu com erro '+resp.status);
   e.permanent=[400,401,403].includes(resp.status);
   throw e
  }
  return j
 }finally{clearTimeout(abort)}
}
async function retry(action,body,attempts=3,timeout=23000){
 let last;
 for(let n=0;n<attempts;n++){
  try{return await request(action,body,timeout)}
  catch(e){
   if(e.permanent)throw e;last=e;
   if(n<attempts-1)await pause(650*(n+1))
  }
 }
 throw last
}
function summary(rows){
 const dates=rows.map(x=>String(x.data_nota_fiscal||'').slice(0,10)).filter(Boolean).sort();
 return{total:rows.length,latest:dates[dates.length-1]||''}
}
async function checkFinished(id,expected){
 for(let i=0;i<4;i++){
  try{
   const j=await retry('import_vendas_status',{import_id:id},2,15000);
   if(j.finished&&Number(j.registros)===expected)return true
  }catch(e){}
  if(i<3)await pause(1300)
 }
 return false
}
async function resilientImport(){
 if(running)return;
 const rows=typeof linhasImport!=='undefined'&&Array.isArray(linhasImport)?linhasImport:null;
 if(!rows?.length){status('Selecione uma planilha e aguarde a validação.');return}
 const btn=$('btnAtualizar'),sum=summary(rows),batchSize=400,totalBatches=Math.ceil(rows.length/batchSize);
 running=true;if(btn)btn.disabled=true;
 let id='',committed=false;
 try{
  status('Conferindo a base atual no servidor...');
  try{
   const old=await retry('vendas_resumo',{},2,15000);
   if(Number(old.registros)===sum.total&&String(old.ultima_data||'')===sum.latest){
    const update=confirm('O servidor já tem '+sum.total.toLocaleString('pt-BR')+' vendas e a mesma data final ('+sum.latest.split('-').reverse().join('/')+'). A atualização anterior pode ter sido concluída.\n\nOK = substituir novamente as vendas da planilha.\nCANCELAR = manter a base atual.');
    if(!update){
     status('✓ A base atual foi mantida. O servidor contém '+Number(old.registros).toLocaleString('pt-BR')+' vendas até '+sum.latest.split('-').reverse().join('/')+'.',true);
     return
    }
   }
  }catch(e){
   if(!confirm('Não foi possível verificar a base atual.\n\nDeseja continuar o envio da planilha mesmo assim?')){status('Envio cancelado. A base de vendas não foi alterada.');return}
  }
  if(!confirm('Confirma a substituição da base de vendas por '+rows.length.toLocaleString('pt-BR')+' linhas?\n\nA tabela atual só será substituída depois que todas as partes forem recebidas e conferidas.')){status('Envio cancelado. A base de vendas não foi alterada.');return}
  status('Iniciando envio seguro de '+totalBatches+' partes...');
  const start=await retry('import_vendas_inicio',{total:rows.length,lotes:totalBatches},3);
  id=start.import_id;
  let nextPart=0,partsSent=0,uploadError=null;
  const workers=Array.from({length:Math.min(5,totalBatches)},()=>async()=>{
   while(!uploadError){
    const partIndex=nextPart++;
    if(partIndex>=totalBatches)return;
    try{
     await retry('import_vendas_parte',{import_id:id,parte:partIndex,rows:rows.slice(partIndex*batchSize,(partIndex+1)*batchSize)},4,27000);
     partsSent++;
     status('Enviando vendas: '+partsSent+' de '+totalBatches+' partes concluídas ('+Math.min(partsSent*batchSize,rows.length).toLocaleString('pt-BR')+' / '+rows.length.toLocaleString('pt-BR')+' linhas)...');
    }catch(e){uploadError=e;return}
   }
  });
  await Promise.all(workers.map(worker=>worker()));
  if(uploadError)throw uploadError;
  if(partsSent!==totalBatches)throw Error('O envio não confirmou todos os lotes.');
  status('Todas as partes recebidas. Gravando e conferindo a base completa...');
  try{
   const done=await request('import_vendas_concluir',{import_id:id},125000);
   if(Number(done.registros)!==rows.length)throw Error('O total gravado não corresponde à planilha.');
   committed=true
  }catch(e){
   status('Conferindo se o servidor concluiu a atualização...');
   committed=await checkFinished(id,rows.length);
   if(!committed)throw e
  }
  status('✓ Atualização concluída e confirmada: '+rows.length.toLocaleString('pt-BR')+' vendas gravadas. Metas e demais cadastros preservados.',true);
  try{
   const fresh=window.__refreshAdminData?.(true);
   if(fresh&&typeof fresh.catch==='function')fresh.catch(e=>console.warn('Base gravada; painel ainda não recarregou.',e));
   else if(typeof renderBase==='function'&&typeof dash!=='undefined'&&dash)renderBase()
  }catch(e){console.warn('Base gravada; painel ainda não recarregou.',e)}
 }catch(e){
  if(id&&!committed){
   const confirmed=await checkFinished(id,rows.length);
   if(confirmed){status('✓ A atualização foi concluída no servidor: '+rows.length.toLocaleString('pt-BR')+' vendas gravadas.',true);return}
  }
  status('Falha no envio: '+String(e?.message||e)+'. A base anterior foi preservada se a confirmação não foi concluída. Tente novamente.');
 }finally{running=false;if(btn)btn.disabled=false}
}
window.__resilientImportVendas=resilientImport;
window.atualizarVendas=resilientImport;
try{atualizarVendas=resilientImport}catch(e){}
})();