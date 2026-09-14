(()=>{
  const FIXED=[
    {rota:'8A1',nome:'Lucas'},
    {rota:'8B1',nome:'Pedro Henrique'},
    {rota:'8C1',nome:'Pedro Afonso'},
    {rota:'8D1',nome:'Poliana'},
    {rota:'8F1',nome:'Heitor'}
  ];
  const TEAM_LABEL='Equipe Iturama - Leandro';
  let firstSelectionDone=false,apiPatched=false;

  function context(){
    try{return String((window.getIturamaContext&&window.getIturamaContext())||sessionStorage.getItem('iturama_context')||'TEAM')}catch{return 'TEAM'}
  }
  function options(){
    return `<option value="TEAM">👥 ${TEAM_LABEL}</option>`+FIXED.map(c=>`<option value="${c.rota}">👤 ${c.rota} - ${c.nome}</option>`).join('');
  }
  function isObserverScreen(){
    return !!document.getElementById('acessoHeaderSelect') || document.getElementById('dash')?.classList.contains('acessoObserver');
  }
  function fillSelect(sel){
    if(!sel)return;
    const ctx=context();
    const wanted=ctx==='TEAM'||FIXED.some(c=>c.rota===ctx)?ctx:'TEAM';
    if(sel.dataset.rogerioFixed!=='1' || !FIXED.every(c=>[...sel.options].some(o=>o.value===c.rota)) || ![...sel.options].some(o=>o.value==='TEAM')){
      sel.innerHTML=options();
      sel.dataset.rogerioFixed='1';
    }
    if(sel.value!==wanted)sel.value=wanted;
  }
  function forceTeamOnEntry(){
    if(firstSelectionDone)return;
    const sel=document.getElementById('acessoHeaderSelect');
    if(!sel||!isObserverScreen())return;
    firstSelectionDone=true;
    fillSelect(sel);
    const ctx=context();
    if(ctx!=='TEAM'){
      sel.value='TEAM';
      try{sessionStorage.setItem('iturama_context','TEAM')}catch{}
      sel.dispatchEvent(new Event('change',{bubbles:true}));
    }else{
      sel.value='TEAM';
    }
  }
  function ensureSelectors(){
    if(!isObserverScreen())return;
    try{window.__ituramaConsultores=FIXED.map(x=>({...x}))}catch{}
    document.querySelectorAll('.acessoHeaderSelect,.acessoOverlaySelect').forEach(fillSelect);
    forceTeamOnEntry();
  }
  function patchApi(){
    if(apiPatched||typeof api!=='function')return;
    const old=api;
    const wrapped=async function(action,body={}){
      const ctx=context();
      if(action==='search_pv'&&ctx==='TEAM'&&!body.rota&&isObserverScreen()){
        let last={found:false};
        for(const c of FIXED){
          try{
            const j=await old(action,{...body,rota:c.rota});
            if(j?.found)return j;
            last=j||last;
          }catch(e){last={found:false,error:e?.message||String(e)}}
        }
        return last;
      }
      return old(action,body);
    };
    wrapped.__rogerioSelectorFix=true;
    api=wrapped;
    try{window.api=wrapped}catch{}
    apiPatched=true;
  }
  function boot(){
    patchApi();
    ensureSelectors();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  new MutationObserver(boot).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  setInterval(boot,300);
})();