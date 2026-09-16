(()=>{
const PROJECT='harlrfhukjvhpufwhtep';
const URLS=[
  `https://${PROJECT}.supabase.co/functions/v1/admin-config-api`,
  `https://${PROJECT}.functions.supabase.co/admin-config-api`
];
const q=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toUpperCase();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function once(url,payload){
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),15000);
  try{
    const r=await fetch(url+'?v='+Date.now(),{
      method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
      headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},
      body:JSON.stringify(payload),signal:ctrl.signal
    });
    let j={};try{j=await r.json()}catch{}
    if(r.ok)return j;
    const e=new Error(j.error||('Erro '+r.status));
    if([400,401,403].includes(r.status))e.noRetry=true;
    throw e;
  }finally{clearTimeout(to)}
}
async function cfg(payload){
  let last=null;
  for(const wait of [0,400,1000]){
    if(wait)await sleep(wait);
    for(const u of URLS){
      try{return await once(u,payload)}catch(e){last=e;if(e?.noRetry)throw e}
    }
  }
  if(last?.name==='AbortError')throw Error('Servidor demorou para responder. Tente novamente.');
  throw Error('Falha de conexão ao salvar a configuração. Tente novamente.');
}
window.__adminConfigRobustPost=cfg;

function catById(id){try{return (config?.categorias||[]).find(x=>Number(x.id)===Number(id))}catch{return null}}
function isB2B(c){const n=norm(c?.nome);return n==='COMPRA B2B'||n==='RECOMPRA B2B'}
function isRep(c){return norm(c?.nome)==='RECOMPRA B2B'}
function showB2B(c){
  if(!c)return;
  if(q('cmId'))q('cmId').value=c.id;
  if(q('cmName'))q('cmName').value=c.nome;
  if(q('cmField'))q('cmField').value='origem';
  if(q('cmMode'))q('cmMode').value='ou';
  if(q('cmExclude'))q('cmExclude').value='';
  if(q('cmDelete'))q('cmDelete').style.display='inline-block';
  document.querySelectorAll('[id^=cmCat_]').forEach(x=>x.style.background='#f6f7f8');
  const b=q('cmCat_'+c.id);if(b)b.style.background='#ffe5e5';
  const rep=isRep(c);
  if(q('cmUseQty'))q('cmUseQty').checked=false;
  if(q('cmQtyFields'))q('cmQtyFields').style.display='none';
  if(q('cmUseRepurchase'))q('cmUseRepurchase').checked=rep;
  if(q('cmRepFields'))q('cmRepFields').style.display=rep?'block':'none';
  if(q('cmRepMin'))q('cmRepMin').value=rep?Math.max(2,Number(c.compras_minimas||2)):2;
  if(q('cmBuilder'))q('cmBuilder').innerHTML=`<b>${rep?'🔁 RECOMPRA B2B':'🛒 COMPRA B2B'}</b><p class="small">Configuração automática da base de Vendas.</p><div class="notice"><b>Origem:</b> B2B<br>${rep?'<b>Regra:</b> cliente precisa comprar em pelo menos 2 datas diferentes. Várias linhas na mesma data contam como uma compra.':'<b>Regra:</b> cliente precisa ter pelo menos uma compra com Origem = B2B.'}</div>`;
  if(q('cmPreview'))q('cmPreview').innerHTML=`<b>Como será buscado nas vendas:</b><div>Origem = B2B${rep?' • mínimo 2 datas de Nota Fiscal diferentes':''}</div>`;
  if(q('cmStatus')){q('cmStatus').className='ok';q('cmStatus').textContent='Parâmetros B2B carregados automaticamente.'}
}

function install(){
  if(typeof window.cmEditCategory!=='function'||typeof window.cmSaveCategory!=='function'||typeof config==='undefined'){
    setTimeout(install,250);return;
  }
  if(window.cmSaveCategory.__b2bFixed)return;

  // Restaura o POST robusto do ADM caso algum módulo antigo tenha substituído.
  if(window.__adminRobustPost){window.post=window.__adminRobustPost;try{post=window.__adminRobustPost}catch{}}

  const oldEdit=window.cmEditCategory;
  window.cmEditCategory=async function(id){
    const c=catById(id);
    if(isB2B(c)){showB2B(c);return}
    return oldEdit(id);
  };

  const oldNew=window.cmNewCategory;
  if(typeof oldNew==='function')window.cmNewCategory=function(){return oldNew()};

  const oldSave=window.cmSaveCategory;
  const save=async function(){
    const id=Number(q('cmId')?.value||0),c=catById(id),name=String(q('cmName')?.value||'').trim();
    const b2bByName=norm(name)==='COMPRA B2B'||norm(name)==='RECOMPRA B2B';
    if(!isB2B(c)&&!b2bByName)return oldSave();
    if(!id){q('cmStatus').className='bad';q('cmStatus').textContent='Selecione a categoria B2B já existente.';return}
    const rep=norm(name)==='RECOMPRA B2B'||isRep(c);
    q('cmStatus').className='';q('cmStatus').textContent='Salvando parâmetros B2B...';
    try{
      await cfg({
        action:'save_category_full',token,id,
        nome:rep?'RECOMPRA B2B':'COMPRA B2B',
        tipo_regra:rep?'recompra':'simples',
        quantidade_minima:1,
        compras_minimas:rep?2:1,
        regras:[{grupo:1,campo:'origem',operador:'IN',valores:['B2B'],obrigatorio:true,excluir_subcanais:[]}]
      });
      q('cmStatus').className='ok';
      q('cmStatus').textContent=rep?'RECOMPRA B2B salva • Origem B2B • mínimo 2 compras em datas diferentes.':'COMPRA B2B salva • Origem B2B • mínimo 1 compra.';
      if(typeof carregarTudo==='function')await carregarTudo();
      const refreshed=catById(id)||c;showB2B(refreshed);
    }catch(e){q('cmStatus').className='bad';q('cmStatus').textContent=e?.message||'Falha ao salvar B2B.'}
  };
  save.__b2bFixed=true;
  window.cmSaveCategory=save;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,500));else setTimeout(install,500);
setTimeout(install,1500);
})();