/* Sincronizacao automatica - Equipe Iturama */
(()=>{
  const VERSION_URL='data/last-update.json';
  let checking=false;

  async function syncData(){
    try{
      if(typeof window.__ituramaSyncNow==='function'){
        await window.__ituramaSyncNow();
      }
    }catch(e){ console.warn('[Sync online]',e); }
  }

  async function checkVersion(){
    if(checking)return;
    checking=true;
    try{
      const r=await fetch(VERSION_URL+'?t='+Date.now(),{cache:'no-store'});
      if(r.ok){
        const text=await r.text();
        const key='iturama_live_version';
        const old=sessionStorage.getItem(key);
        const current=text.trim();
        if(!old){ sessionStorage.setItem(key,current); }
        else if(current && old!==current){
          sessionStorage.setItem(key,current);
          location.reload();
          return;
        }
      }
    }catch(e){}
    finally{checking=false}
  }

  async function tick(){
    await syncData();
    await checkVersion();
  }

  // Atualiza os dados sem F5 e tambem quando o usuario volta para a pagina.
  setInterval(tick,30000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden)tick(); });
  window.addEventListener('focus',tick);
  setTimeout(tick,2500);
})();
