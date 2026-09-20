(()=>{
  const FIXED=[
    {rota:'8A1',nome:'Lucas'},
    {rota:'8B1',nome:'Pedro Henrique'},
    {rota:'8C1',nome:'Pedro Afonso'},
    {rota:'8D1',nome:'Poliana'},
    {rota:'8F1',nome:'Heitor'}
  ];
  const TEAM='TEAM', TEAM_LABEL='Toda a Equipe';
  let started=false,busy=false,baseApi=null,apiWrapped=false;

  function isRogerio(){
    try{
      if(typeof DATA==='undefined'||!DATA||DATA.perfil!=='acompanhante')return false;
      const n=String(DATA.acesso?.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
      return n==='rogerio';
    }catch{return false}
  }
  function getCtx(){
    try{
      const v=String(sessionStorage.getItem('iturama_context')||TEAM);
      return v===TEAM||FIXED.some(x=>x.rota===v)?v:TEAM;
    }catch{return TEAM}
  }
  function setCtx(v){
    try{sessionStorage.setItem('iturama_context',v)}catch{}
    window.__ituramaContext=v;
  }
  function options(){
    return `<option value="TEAM">👥 ${TEAM_LABEL}</option>`+FIXED.map(x=>`<option value="${x.rota}">👤 ${x.rota} - ${x.nome}</option>`).join('');
  }
  function fillSelect(s){
    if(!s)return;
    if(s.dataset.rogerioUi!=='1'){s.innerHTML=options();s.dataset.rogerioUi='1'}
    s.value=getCtx();
  }
  function sync(){document.querySelectorAll('.rogerioUiSelect').forEach(fillSelect);try{applyTeamLabels(getCtx())}catch{}}

  function addStyle(){
    if(document.getElementById('rogerioUiStyle'))return;
    const s=document.createElement('style');
    s.id='rogerioUiStyle';
    s.textContent=`
#dash.rogerioMode .user{display:flex!important;flex-direction:column!important;margin-left:auto!important}
#dash.rogerioMode #name{font-weight:900!important}
#dash.rogerioMode #route{font-size:11px!important;opacity:.85!important}
.rogerioUiHead{margin-left:auto;min-width:245px;display:flex;flex-direction:column;gap:3px;color:#fff}
.rogerioUiHead label{font-size:9px;font-weight:900;text-transform:uppercase;opacity:.82}
.rogerioUiSelect{width:100%;height:42px;border-radius:11px;border:1px solid #d5dde4;background:#fff;color:#142236;padding:0 34px 0 11px;font-weight:900;cursor:pointer}
.rogerioUiBar{display:grid;grid-template-columns:auto minmax(230px,360px);align-items:center;gap:12px;background:#fff;border-bottom:1px solid #dce3e8;padding:10px 14px;position:relative;z-index:10002}
.rogerioUiBar b{font-size:12px;color:#142236}
#ov.overlay,.cvOverlay,.contOverlay,.impOverlay,.cvContentOverlay{z-index:10000!important}
#ov .sheet{position:relative;z-index:10001!important;max-height:calc(100dvh - 16px)!important;overflow:auto!important}
#ov .sheetBody{padding-bottom:140px!important}
@media(max-width:900px){.rogerioUiHead{order:4;flex:1 1 100%;min-width:0}.rogerioUiBar{grid-template-columns:1fr;gap:6px}}
`;
    document.head.appendChild(s);
  }

  function patchApiAfterLogin(){
    if(apiWrapped||typeof api!=='function')return;
    baseApi=api;
    const wrapped=async function(action,body={}){
      if(!isRogerio())return baseApi(action,body);
      const ctx=getCtx();
      if(action==='search_pv'&&!body.rota){
        const local=String(window.__pvSearchRoute||'').trim().toUpperCase();
        if(local&&local!=='TODOS'&&FIXED.some(x=>x.rota===local))return baseApi(action,{...body,rota:local});
        if(local==='TODOS'||ctx===TEAM)return baseApi(action,{...body,rota:'TEAM'});
        if(ctx!==TEAM)return baseApi(action,{...body,rota:ctx});
      }
      if(action==='dashboard'&&!body.rota)return baseApi(action,{...body,rota:ctx===TEAM?'TEAM':ctx});
      return baseApi(action,body);
    };
    try{api=wrapped;window.api=wrapped;apiWrapped=true}catch{}
  }

  async function changeRoute(v){
    if(!isRogerio()||busy)return;
    v=String(v||TEAM);
    if(v!==TEAM&&!FIXED.some(x=>x.rota===v))v=TEAM;
    busy=true;
    const selects=[...document.querySelectorAll('.rogerioUiSelect')];
    selects.forEach(s=>s.disabled=true);
    try{
      setCtx(v);
      const fn=baseApi||api;
      const j=await fn('dashboard',{rota:v===TEAM?'TEAM':v});
      DATA=j;
      window.__ituramaConsultores=Array.isArray(j?.consultores)?j.consultores:FIXED;
      if(typeof TAB!=='undefined')TAB=(v===TEAM?'equipe':'meu');
      const nm=document.getElementById('name'),rt=document.getElementById('route');
      if(v===TEAM){
        if(nm)nm.textContent=String(j?.acesso?.nome||'Rogério');
        if(rt)rt.textContent='Equipe Iturama • Todas as rotas';
      }else{
        if(nm)nm.textContent=String(j?.acesso?.nome||'Rogério');
        if(rt)rt.textContent='Visualizando '+v+' - '+String(j?.consultor?.nome||v);
      }
      if(typeof fill==='function')fill();
      if(typeof render==='function')render();
      if(typeof summary==='function')summary();
      applyTeamLabels(v);
      sync();
      window.dispatchEvent(new CustomEvent('iturama:routechange',{detail:{rota:v,equipe:v===TEAM,keepOpen:true}}));
      setTimeout(addOverlaySelectors,60);
    }catch(e){
      console.error(e);
      alert(e?.message||'Não foi possível trocar a rota.');
      sync();
    }finally{
      busy=false;
      document.querySelectorAll('.rogerioUiSelect').forEach(s=>s.disabled=false);
    }
  }

  function applyTeamLabels(v){
    const team=v===TEAM;
    const tabs=[...document.querySelectorAll('.tabs .tab')];
    const myTab=tabs.find(x=>x.dataset.t==='meu')||tabs[0];
    const teamTab=tabs.find(x=>x.dataset.t==='equipe')||tabs[1];
    if(team){
      if(typeof TAB!=='undefined')TAB='equipe';
      if(myTab){myTab.style.display='none';myTab.classList.remove('active')}
      if(teamTab){teamTab.style.display='';teamTab.textContent='Resultado da Equipe';teamTab.classList.add('active')}
    }else{
      if(myTab){myTab.style.display='';myTab.textContent='Meu Resultado';myTab.classList.toggle('active',typeof TAB!=='undefined'&&TAB==='meu')}
      if(teamTab){teamTab.style.display='';teamTab.textContent='Resultado da Equipe';teamTab.classList.toggle('active',typeof TAB!=='undefined'&&TAB==='equipe')}
    }
    const sums=[...document.querySelectorAll('.summary .sum')];
    if(sums[0])sums[0].style.display=team?'none':'';
    if(sums[1])sums[1].style.display='';
    const title=document.getElementById('title'),hint=document.getElementById('hint');
    if(team){
      if(title)title.textContent='Resultado da Equipe por incentivo';
      if(hint)hint.textContent='Selecione um incentivo para visualizar os resultados de toda a equipe.';
    }else{
      if(title)title.textContent='Meu resultado por incentivo';
      if(hint)hint.textContent='Selecione um incentivo para ver os clientes cobertos.';
    }
  }

  function addHeader(){
    const top=document.querySelector('#dash .topbar');
    if(!top||!isRogerio())return;
    document.getElementById('dash')?.classList.add('rogerioMode');
    let w=document.getElementById('rogerioUiHead');
    if(!w){
      w=document.createElement('div');
      w.id='rogerioUiHead';
      w.className='rogerioUiHead';
      w.innerHTML='<label>Visualizar</label><select class="rogerioUiSelect" aria-label="Selecionar equipe ou rota"></select>';
      const out=top.querySelector('.logout');
      out?top.insertBefore(w,out):top.appendChild(w);
      w.querySelector('select').addEventListener('change',e=>changeRoute(e.target.value));
    }
    fillSelect(w.querySelector('select'));
  }

  function addOverlaySelectors(){
    if(!isRogerio())return;
    document.querySelectorAll('#ov .sheetTop,.cvOverlay .cvTop,.contOverlay .contTop,.impOverlay .impTop,.cvContentOverlay .cvContentTop').forEach(top=>{
      const host=top.parentElement;
      if(!host||host.querySelector(':scope > .rogerioUiBar'))return;
      const bar=document.createElement('div');
      bar.className='rogerioUiBar';
      bar.innerHTML='<b>Selecionar equipe / rota</b><select class="rogerioUiSelect" aria-label="Selecionar equipe ou rota"></select>';
      top.insertAdjacentElement('afterend',bar);
      const s=bar.querySelector('select');
      s.addEventListener('change',e=>changeRoute(e.target.value));
      fillSelect(s);
    });
  }

  function activateOnce(){
    if(started||!isRogerio())return false;
    started=true;
    addStyle();
    setCtx(TEAM);
    window.getIturamaContext=()=>getCtx();
    window.__ituramaConsultores=Array.isArray(DATA?.consultores)&&DATA.consultores.length?DATA.consultores:FIXED;
    patchApiAfterLogin();
    addHeader();
    if(typeof TAB!=='undefined')TAB='equipe';
    applyTeamLabels(TEAM);
    if(typeof render==='function')render();
    addOverlaySelectors();
    document.addEventListener('click',()=>setTimeout(addOverlaySelectors,80),true);
    setTimeout(()=>changeRoute(TEAM),40);
    return true;
  }

  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(activateOnce()||tries>=80)clearInterval(timer);
  },250);
  if(document.readyState!=='loading')activateOnce();
  else document.addEventListener('DOMContentLoaded',activateOnce,{once:true});
  setInterval(()=>{if(isRogerio())sync()},1200);
})();