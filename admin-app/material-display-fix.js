(()=>{
  function installStyle(){
    if(document.getElementById('materialDisplayFixStyle')) return;
    const s=document.createElement('style');
    s.id='materialDisplayFixStyle';
    s.textContent='#materiais.hide,#materiais.mm2.hide{display:none!important}#materiais.mm2:not(.hide){display:block!important}';
    document.head.appendChild(s);
  }
  function syncHome(){
    const home=document.getElementById('cokeHome');
    const materiais=document.getElementById('materiais');
    if(!materiais) return;
    if(home && !home.classList.contains('hide')) materiais.classList.add('hide');
  }
  function boot(){
    installStyle();
    syncHome();
    const home=document.getElementById('cokeHome');
    if(home && !home.__materialDisplayWatch){
      home.__materialDisplayWatch=true;
      new MutationObserver(syncHome).observe(home,{attributes:true,attributeFilter:['class']});
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
  setTimeout(boot,250);
  setTimeout(boot,1000);
})();