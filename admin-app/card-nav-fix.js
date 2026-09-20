(()=>{
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  const hideIds=['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasClientes','visitasSubcanais','subcanaisPainel','imperdoaveisAdmin','adminConteudos','contatosClientes'];
  function hiddenTab(label){return [...document.querySelectorAll('.tabs button')].find(b=>norm(b.textContent).includes(norm(label)))}
  function card(label){return [...document.querySelectorAll('.menuCard')].find(b=>norm(b.querySelector('b')?.textContent||'')===norm(label))}
  function showSection(id){const target=document.getElementById(id);if(!target)return false;hideIds.forEach(x=>document.getElementById(x)?.classList.add('hide'));document.getElementById('cokeHome')?.classList.add('hide');target.classList.remove('hide');document.getElementById('backHome')?.remove();const wrap=document.querySelector('.wrap');if(wrap){const b=document.createElement('button');b.id='backHome';b.className='backHome';b.innerHTML='← Voltar ao menu administrativo';b.onclick=()=>{hideIds.forEach(x=>document.getElementById(x)?.classList.add('hide'));document.getElementById('cokeHome')?.classList.remove('hide');b.remove()};wrap.insertBefore(b,wrap.firstChild)}return true}
  function openWhenReady(label,id,tries=0){const t=hiddenTab(label);if(t&&typeof t.onclick==='function'){t.onclick();return}if(showSection(id))return;if(tries<40)setTimeout(()=>openWhenReady(label,id,tries+1),150)}
  function openVisit(tries=0){if(typeof window.abrirVisitaClientesAdm==='function'){window.abrirVisitaClientesAdm();return}if(showSection('visitasSubcanais'))return;if(tries<40)setTimeout(()=>openVisit(tries+1),150)}
  function bind(){
    const sub=card('Subcanais');
    if(sub){sub.dataset.navfix='1';sub.onclick=()=>openWhenReady('Subcanais','subcanaisPainel')}
    const hist=card('Histórico de Acesso');
    if(hist){hist.dataset.navfix='1';hist.onclick=()=>{const url=new URL('historico.html?v=20260920-who-accessed-02',window.location.href).href;try{window.top.location.assign(url)}catch{window.location.assign(url)}}}
    const vis=card('Visita de Clientes');
    if(vis){vis.dataset.navfix='1';vis.onclick=()=>openVisit()}
    const cont=card('Contato dos Clientes');
    if(cont){cont.dataset.navfix='1';cont.onclick=()=>{if(typeof window.abrirContatosClientesAdm==='function')window.abrirContatosClientesAdm();else openWhenReady('Contato dos Clientes','contatosClientes')}}
  }
  let n=0;const timer=setInterval(()=>{bind();if(++n>100)clearInterval(timer)},200);document.addEventListener('click',e=>{if(e.target.closest('.menuCard'))setTimeout(bind,0)});
})();