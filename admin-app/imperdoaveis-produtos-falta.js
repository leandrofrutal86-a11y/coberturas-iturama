(()=>{
function aplicar(){
  const list=document.getElementById('impClientList');
  if(!list)return;
  list.querySelectorAll('details.impDetails').forEach(d=>{
    d.open=true;
    const s=d.querySelector('summary');
    if(s)s.textContent='Produtos que faltam para fechar';
  });
}
function boot(){
  aplicar();
  const obs=new MutationObserver(()=>aplicar());
  const tentar=()=>{
    const list=document.getElementById('impClientList');
    if(list){obs.observe(list,{childList:true,subtree:true});aplicar();return true}
    return false;
  };
  if(!tentar()){
    const t=setInterval(()=>{if(tentar())clearInterval(t)},500);
    setTimeout(()=>clearInterval(t),15000);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();