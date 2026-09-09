/* Trio Pão de Queijo — exibe os códigos dos materiais de cada grupo. */
(() => {
  const codes = {
    '1': '1918 ou 1919',
    '2': '1916 ou 1917',
    '3': '1827'
  };

  function norm(v){ return String(v ?? '').replace(/\s+/g,' ').trim().toUpperCase(); }

  function groupLabel(g){
    const n=String(g?.grupo ?? '');
    return `Grupo ${n}${codes[n] ? ` (${codes[n]})` : ''}`;
  }

  function enhanceCurrentDashboard(){
    /* Painel atual: sobrescreve a função que monta os badges dos grupos. */
    if(typeof window.groupBadges === 'function' && !window.groupBadges.__codesTrio){
      const wrapped=function(c){
        const gs=c?.grupos||[];
        return `<div class="groupStatus">${gs.map(g=>`<span class="${g.vendido?'gok':'gno'}">${groupLabel(g)} ${g.vendido?'✓':'✕'}</span>`).join('')}</div>${c?.completo?'':`<div class="faltando">Faltam ${Number(c?.faltam||0)} grupo(s)</div>`}`;
      };
      wrapped.__codesTrio=true;
      window.groupBadges=wrapped;
      try{ if(typeof window.render==='function') window.render(); }catch(e){}
    }
  }

  function enhanceLegacyDashboard(){
    /* Compatibilidade com a tela antiga, caso volte a ser usada. */
    const cat = document.querySelector('#categoria')?.value;
    if(norm(cat) !== 'TRIO PÃO DE QUEIJO') return;
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

  function boot(){
    enhanceCurrentDashboard();
    enhanceLegacyDashboard();
    let n=0;
    const t=setInterval(()=>{
      enhanceCurrentDashboard();
      enhanceLegacyDashboard();
      if(++n>=30) clearInterval(t);
    },200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
