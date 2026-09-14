(()=>{
  const FIXED=[
    {rota:'8A1',nome:'Lucas'},
    {rota:'8B1',nome:'Pedro Henrique'},
    {rota:'8C1',nome:'Pedro Afonso'},
    {rota:'8D1',nome:'Poliana'},
    {rota:'8F1',nome:'Heitor'}
  ];
  const TEAM='TEAM', TEAM_LABEL='Equipe Iturama - Leandro';
  let active=false,busy=false,apiPatched=false,oldApi=null;

  const isRogerio=()=>{
    try{return typeof DATA!=='undefined'&&DATA?.perfil==='acompanhante'&&String(DATA?.acesso?.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()==='rogerio'}catch{return false}
  };
  const getCtx=()=>{
    try{const v=String(sessionStorage.getItem('iturama_context')||TEAM);return v===TEAM||FIXED.some(x=>x.rota===v)?v:TEAM}catch{return TEAM}
  };
  const setCtx=v=>{try{sessionStorage.setItem('iturama_context',v)}catch{};window.__ituramaContext=v};
  window.getIturamaContext=()=>getCtx();

  function options(){return `<option value="TEAM">👥 ${TEAM_LABEL}</option>`+FIXED.map(x=>`<option value="${x.rota}">👤 ${x.rota} - ${x.nome}</option>`).join('')}
  function fillSelect(s){if(!s)return;if(s.dataset.rogerioUi!=='1'){s.innerHTML=options();s.dataset.rogerioUi='1'}s.value=getCtx()}
  function sync(){document.querySelectorAll('.rogerioUiSelect').forEach(fillSelect)}

  function css(){
    if(document.getElementById('rogerioUiStyle'))return;
    const s=document.createElement('style');s.id='rogerioUiStyle';s.textContent=`
#dash.rogerioMode .user{display:none!important}.rogerioUiHead{margin-left:auto;min-width:245px;display:flex;flex-direction:column;gap:3px;color:#fff}.rogerioUiHead label{font-size:9px;font-weight:900;text-transform:uppercase;opacity:.82}.rogerioUiSelect{width:100%;height:42px;border-radius:11px;border:1px solid #d5dde4;background:#fff;color:#142236;padding:0 34px 0 11px;font-weight:900;cursor:pointer}.rogerioUiBar{display:grid;grid-template-columns:auto minmax(230px,360px);align-items:center;gap:12px;background:#fff;border-bottom:1px solid #dce3e8;padding:10px 14px;position:relative;z-index:10002}.rogerioUiBar b{font-size:12px;color:#142236}#ov.overlay,.cvOverlay,.contOverlay,.impOverlay,.cvContentOverlay{z-index:10000!important}#ov .sheet{position:relative;z-index:10001!important;max-height:calc(100dvh - 16px)!important;overflow:auto!important}#ov .sheetBody{padding-bottom:140px!important}body:has(#ov.show) .cvBottomNav,body:has(.cvOverlay.show) .cvBottomNav,body:has(.contOverlay.show) .cvBottomNav,body:has(.impOverlay.show) .cvBottomNav{visibility:hidden!important;pointer-events:none!important}@media(max-width:900px){.rogerioUiHead{order:4;flex:1 1 100%;min-width:0}.rogerioUiBar{grid-template-columns:1fr;gap:6px}}`;
    document.head.appendChild(s);
  }

  function patchApi(){
    if(apiPatched||typeof api!=='function')return;
    oldApi=api;
    const wrapped=async function(action,body={}){
      if(!isRogerio())return oldApi(action,body);
      const c=getCtx();
      if(action==='search_pv'&&c===TEAM&&!body.rota){
        let last={found:false};
        for(const x of FIXED){
          try{const j=await oldApi(action,{...body,rota:x.rota});if(j?.found)return j;last=j||last}catch(e){last={found:false,error:e?.message||String(e)}}
        }
        return last;
      }
      if((action==='dashboard'||action==='search_pv')&&c!==TEAM&&!body.rota)body={...body,rota:c};
      return oldApi(action,body);
    };
    wrapped.__rogerioUi=true;
    api=wrapped;try{window.api=wrapped}catch{}
    apiPatched=true;
  }

  async function changeRoute(v){
    if(!isRogerio()||busy)return;
    v=String(v||TEAM);if(v!==TEAM&&!FIXED.some(x=>x.rota===v))v=TEAM;
    busy=true;document.body.style.cursor='progress';
    try{
      setCtx(v);
      if(v===TEAM){
        if(typeof TAB!=='undefined')TAB='equipe';
        try{typeof render==='function'&&render();typeof summary==='function'&&summary()}catch{}
      }else{
        const fn=oldApi||api;
        const j=await fn('dashboard',{rota:v});
        DATA=j;
        if(typeof TAB!=='undefined')TAB='meu';
        try{typeof fill==='function'&&fill();typeof render==='function'&&render();typeof summary==='function'&&summary()}catch{}
      }
      sync();
      window.dispatchEvent(new CustomEvent('iturama:routechange',{detail:{rota:v,equipe:v===TEAM,keepOpen:true}}));
    }catch(e){console.error(e);alert(e?.message||'Não foi possível trocar a rota.')}finally{busy=false;document.body.style.cursor=''}
  }

  function header(){
    const top=document.querySelector('#dash .topbar');if(!top||!isRogerio())return;
    document.getElementById('dash')?.classList.add('rogerioMode');
    let w=document.getElementById('rogerioUiHead');
    if(!w){w=document.createElement('div');w.id='rogerioUiHead';w.className='rogerioUiHead';w.innerHTML='<label>Visualizar</label><select class="rogerioUiSelect" aria-label="Selecionar equipe ou rota"></select>';const out=top.querySelector('.logout');out?top.insertBefore(w,out):top.appendChild(w);w.querySelector('select').addEventListener('change',e=>changeRoute(e.target.value))}
    fillSelect(w.querySelector('select'));
  }

  function overlays(){
    if(!isRogerio())return;
    document.querySelectorAll('#ov .sheetTop,.cvOverlay .cvTop,.contOverlay .contTop,.impOverlay .impTop,.cvContentOverlay .cvContentTop').forEach(top=>{
      const host=top.parentElement;if(!host||host.querySelector(':scope > .rogerioUiBar'))return;
      const bar=document.createElement('div');bar.className='rogerioUiBar';bar.innerHTML='<b>Selecionar equipe / rota</b><select class="rogerioUiSelect" aria-label="Selecionar equipe ou rota"></select>';top.insertAdjacentElement('afterend',bar);const s=bar.querySelector('select');s.addEventListener('change',e=>changeRoute(e.target.value));fillSelect(s);
    });
  }

  function activate(){
    if(!isRogerio())return;
    if(!active){active=true;setCtx(TEAM);if(typeof TAB!=='undefined')TAB='equipe';try{typeof render==='function'&&render();typeof summary==='function'&&summary()}catch{}}
    css();patchApi();header();overlays();sync();
  }

  function installLoadHook(){
    if(typeof load!=='function'||load.__rogerioUiLoad)return;
    const old=load;
    const wrapped=async function(){const r=await old.apply(this,arguments);activate();return r};
    wrapped.__rogerioUiLoad=true;load=wrapped;try{window.load=wrapped}catch{}
  }

  function tick(){installLoadHook();if(isRogerio())activate()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
  new MutationObserver(()=>{if(isRogerio())activate()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  setInterval(tick,700);
})();