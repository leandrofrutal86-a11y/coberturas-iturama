(()=>{
  const CREDIT='Desenvolvido por Leandro de Oliveira';
  function apply(){
    document.querySelectorAll('.footer').forEach(f=>{
      if(f.querySelector('.devCredit'))return;
      const d=document.createElement('div');d.className='devCredit';d.textContent=CREDIT;d.style.marginTop='5px';d.style.fontSize='11px';d.style.fontWeight='700';d.style.color='#6c7887';f.appendChild(d);
    });
    document.querySelectorAll('footer').forEach(f=>{
      if(f.querySelector('.devCredit'))return;
      const d=document.createElement('div');d.className='devCredit';d.textContent=CREDIT;d.style.marginTop='5px';d.style.fontSize='11px';d.style.fontWeight='700';d.style.color='#6c7887';f.appendChild(d);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();