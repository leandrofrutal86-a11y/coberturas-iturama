/* Ajuste final da interface do Trio Pao de Queijo: usa somente o painel Clientes realizados. */
(() => {
  const wantedTitle = 'Clientes realizados — TRIO PÃO DE QUEIJO — clientes com venda parcial ou completa';

  function norm(v){ return String(v ?? '').replace(/\s+/g,' ').trim().toUpperCase(); }

  function hideDuplicateTrioPanel(){
    document.querySelectorAll('.panel').forEach(panel => {
      const heading = panel.querySelector('h1,h2,h3,h4,h5,h6,.panel-title,.title');
      const t = norm(heading?.textContent || '');
      if(t === 'TRIO PÃO DE QUEIJO — ACOMPANHAMENTO'){
        panel.style.setProperty('display','none','important');
      }
    });
  }

  function fixClientsPanel(){
    hideDuplicateTrioPanel();
    const cat = document.querySelector('#categoria')?.value;
    if(cat !== 'TRIO PÃO DE QUEIJO') return;

    const title = document.querySelector('#clientsCategory');
    if(title) title.textContent = wantedTitle;

    const body = document.querySelector('#tbody');
    const table = body?.closest('table');
    const thead = table?.querySelector('thead');
    if(thead){
      thead.innerHTML = '<tr>'+
        '<th>Nº</th><th>PV</th><th>Razão Social</th>'+
        '<th>Grupo 1<br><b>(1918 ou 1919)</b></th>'+
        '<th>Grupo 2<br><b>(1916 ou 1917)</b></th>'+
        '<th>Grupo 3<br><b>(1827)</b></th>'+
        '<th>Realizado</th><th>Falta</th>'+
        '</tr>';
    }
  }

  function install(){
    const c=document.querySelector('#categoria');
    if(c && !c.__trioUiFix){
      c.__trioUiFix=true;
      c.addEventListener('change',()=>setTimeout(fixClientsPanel,60));
    }
    if(typeof window.render==='function' && !window.render.__trioUiFix){
      const old=window.render;
      const wrapped=function(){
        const r=old.apply(this,arguments);
        setTimeout(fixClientsPanel,40);
        setTimeout(fixClientsPanel,180);
        return r;
      };
      wrapped.__trioUiFix=true;
      window.render=wrapped;
    }
    if(typeof window.refreshMainData==='function' && !window.refreshMainData.__trioUiFix){
      const old=window.refreshMainData;
      const wrapped=function(){
        const r=old.apply(this,arguments);
        setTimeout(fixClientsPanel,60);
        setTimeout(fixClientsPanel,220);
        return r;
      };
      wrapped.__trioUiFix=true;
      window.refreshMainData=wrapped;
    }
    fixClientsPanel();
  }

  function boot(){
    install();
    let n=0;
    const timer=setInterval(()=>{
      install();
      if(++n>=35) clearInterval(timer);
    },200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
