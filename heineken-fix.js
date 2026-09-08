/* Correção da COBERTURA HEINEKEN: qualquer venda de EISENBAHN, SOL, KAISER ou BAVARIA vale 1 cliente */
(() => {
  const wanted=['EISENBAHN','SOL','KAISER','BAVARIA'];
  const norm=v=>String(v??'').trim().toUpperCase();
  const isWanted=r=>{
    const b=norm(r?.marca??r?.Marca);
    return wanted.some(x=>b===x||b.startsWith(x+' '));
  };
  const route=r=>norm(r?.rota??r?.Rota);
  const client=r=>String(r?.cliente??r?.Cliente??'').trim();

  function patch(){
    if(typeof window.categoryRows!=='function'||typeof DATA==='undefined'||!Array.isArray(DATA.vendas))return false;
    if(window.categoryRows.__heinekenFix)return true;
    const old=window.categoryRows;
    const fixed=function(rota,cat){
      if(cat!=='COBERTURA HEINEKEN')return old.apply(this,arguments);
      const map=new Map();
      (DATA.vendas||[]).filter(r=>route(r)===norm(rota)&&isWanted(r)).forEach(r=>{
        const pv=client(r);if(pv&&!map.has(pv))map.set(pv,r);
      });
      return [...map.values()];
    };
    fixed.__heinekenFix=true;
    window.categoryRows=fixed;
    return true;
  }

  function render(){
    if(!patch())return;
    try{
      if(typeof window.refreshMainData==='function')window.refreshMainData();
      else if(typeof window.render==='function')window.render();
    }catch(e){console.warn('[Heineken Fix]',e)}
  }

  function boot(){
    render();
    setTimeout(render,300);
    setTimeout(render,1000);
    setTimeout(render,2500);
    setInterval(render,3000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
