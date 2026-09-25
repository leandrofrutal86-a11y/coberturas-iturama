(()=>{
  const $=id=>document.getElementById(id);
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toUpperCase();
  const pageIds=['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasClientes','visitasSubcanais','subcanaisPainel','imperdoaveisAdmin','adminConteudos','contatosClientes'];

  function hideAll(except){
    pageIds.forEach(id=>{const el=$(id);if(el&&id!==except)el.classList.add('hide')});
    $('cokeHome')?.classList.add('hide');
    document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('on'));
  }

  function addBack(){
    const wrap=document.querySelector('.wrap');
    if(!wrap)return;
    $('backHome')?.remove();
    const b=document.createElement('button');
    b.id='backHome';b.className='backHome';b.textContent='← Voltar ao menu administrativo';
    b.onclick=()=>{
      pageIds.forEach(id=>$(id)?.classList.add('hide'));
      $('cokeHome')?.classList.remove('hide');
      b.remove();window.scrollTo({top:0,behavior:'smooth'});
    };
    wrap.insertBefore(b,wrap.firstChild);
  }

  function openOnly(id){
    const target=$(id);if(!target)return false;
    hideAll(id);target.classList.remove('hide');addBack();window.scrollTo({top:0,behavior:'smooth'});return true;
  }

  function openVisit(){
    if(typeof window.abrirVisitaClientesAdm==='function'){
      try{window.abrirVisitaClientesAdm()}catch(e){}
    }
    let tries=0;
    const ensure=()=>{
      const sec=$('visitasSubcanais');
      if(sec){openOnly('visitasSubcanais');return}
      if(++tries<50)setTimeout(ensure,120);
    };
    ensure();
  }

  function bindCards(){
    [...document.querySelectorAll('.menuCard')].forEach(card=>{
      const title=norm(card.querySelector('b')?.textContent||'');
      if(title==='ACOMPANHAMENTO'){
        card.onclick=e=>{e.preventDefault();openOnly('acomp')};
      }
      if(title==='VISITA DE CLIENTES'){
        card.onclick=e=>{e.preventDefault();openVisit()};
      }
    });
  }

  const prevAba=window.aba;
  if(typeof prevAba==='function'){
    window.aba=function(id,b){
      const r=prevAba.apply(this,arguments);
      setTimeout(()=>openOnly(id),0);
      return r;
    };
  }

  // No Acompanhamento, Sair volta ao menu anterior sem encerrar o acesso.
  // A captura impede que o onclick legado sair() descarte a sessão.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('header button[onclick]');
    if(!btn||String(btn.getAttribute('onclick')||'').replace(/\\s+/g,'').toLowerCase()!=='sair()')return;
    const acomp=$('acomp');
    if(!acomp||acomp.classList.contains('hide'))return;
    e.preventDefault();e.stopImmediatePropagation();
    const back=$('backHome');
    if(back){back.click();return}
    pageIds.forEach(id=>$(id)?.classList.add('hide'));
    $('cokeHome')?.classList.remove('hide');
    window.scrollTo({top:0,behavior:'smooth'});
  },true);

  let n=0;const timer=setInterval(()=>{bindCards();if(++n>100)clearInterval(timer)},150);
  document.addEventListener('click',e=>{if(e.target.closest('.menuCard'))setTimeout(bindCards,0)});
})();