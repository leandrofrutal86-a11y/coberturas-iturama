(()=>{
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  const hideIds=['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasClientes','visitasSubcanais','subcanaisPainel'];
  function hiddenTab(label){return [...document.querySelectorAll('.tabs button')].find(b=>norm(b.textContent).includes(norm(label)))}
  function card(label){return [...document.querySelectorAll('.menuCard')].find(b=>norm(b.textContent).includes(norm(label)))}
  function showSection(id){hideIds.forEach(x=>document.getElementById(x)?.classList.add('hide'));document.getElementById('cokeHome')?.classList.add('hide');document.getElementById(id)?.classList.remove('hide');document.getElementById('backHome')?.remove();const wrap=document.querySelector('.wrap');if(wrap){const b=document.createElement('button');b.id='backHome';b.className='backHome';b.innerHTML='← Voltar ao menu administrativo';b.onclick=()=>{hideIds.forEach(x=>document.getElementById(x)?.classList.add('hide'));document.getElementById('cokeHome')?.classList.remove('hide');b.remove()};wrap.insertBefore(b,wrap.firstChild)}}
  function bind(){
    const sub=card('Subcanais');
    if(sub&&!sub.dataset.navfix){sub.dataset.navfix='1';sub.onclick=()=>{const t=hiddenTab('Subcanais');if(t&&typeof t.onclick==='function')t.onclick();else showSection('subcanaisPainel')}}
    const hist=card('Histórico de Acesso');
    if(hist&&!hist.dataset.navfix){hist.dataset.navfix='1';hist.onclick=()=>{if(typeof window.abrirHistorico==='function')window.abrirHistorico(hiddenTab('Histórico de Acesso'));else{const t=hiddenTab('Histórico de Acesso');if(t&&typeof t.onclick==='function')t.onclick();else showSection('historico')}}}
    const vis=card('Visita de Clientes');
    if(vis&&!vis.dataset.navfix){vis.dataset.navfix='1';vis.onclick=()=>{const tabs=[...document.querySelectorAll('.tabs button')].filter(b=>norm(b.textContent).includes('VISITA DE CLIENTES'));const t=tabs[tabs.length-1];if(t&&typeof t.onclick==='function')t.onclick();else showSection('visitasSubcanais')}}
  }
  let n=0;const timer=setInterval(()=>{bind();if(++n>40)clearInterval(timer)},250);document.addEventListener('click',e=>{if(e.target.closest('.menuCard'))setTimeout(bind,0)});
})();