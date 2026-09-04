/* Correcao final ADM + metas zeradas + sincronizacao online */
(() => {
  const SUPABASE_URL='https://harlrfhukjvhpufwhtep.supabase.co';
  const SUPABASE_KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const API=`${SUPABASE_URL}/rest/v1/vendas`;
  const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`};

  function zerarMetas(){
    try{
      if(typeof DATA!=='undefined'&&DATA.metas) Object.keys(DATA.metas).forEach(k=>DATA.metas[k]=0);
      if(typeof customMetas!=='undefined'){
        if(typeof DATA!=='undefined'&&DATA.metas) Object.keys(DATA.metas).forEach(k=>customMetas[k]=0);
        localStorage.setItem('iturama_metas',JSON.stringify(customMetas));
      }else localStorage.setItem('iturama_metas','{}');
      const k='iturama_admin_completo_v2';
      const c=JSON.parse(localStorage.getItem(k)||'null');
      if(c){c.metas=c.metas||{};Object.keys(c.metas).forEach(x=>c.metas[x]=0);localStorage.setItem(k,JSON.stringify(c));}
      document.querySelectorAll('#adminFull input[type="number"],#adminPanel input[type="number"],#adminGrid input[type="number"]').forEach(e=>e.value='0');
    }catch(e){console.warn('[Metas]',e)}
  }

  function abrirADM(){
    const p=document.getElementById('pass'),err=document.getElementById('err');
    if(!p||typeof DATA==='undefined'||p.value!==DATA.adminPassword){if(err)err.textContent='Senha incorreta.';return false;}
    try{if(typeof closeModal==='function')closeModal();}catch(e){}
    const f=document.getElementById('adminFull');
    if(f){f.classList.add('open');f.style.display='block';f.style.visibility='visible';f.style.opacity='1';document.body.classList.add('admin-open');f.scrollIntoView({behavior:'smooth',block:'start'});}
    zerarMetas();
    try{if(typeof window.openAdminFull==='function')window.openAdminFull();}catch(e){}
    try{if(typeof window.render==='function')window.render('metas');}catch(e){}
    setTimeout(zerarMetas,100);
    return true;
  }

  function corrigir(){
    window.__loginADM=abrirADM;
    document.addEventListener('click',e=>{const b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;const t=String(b.textContent||'').trim().toLowerCase(),o=String(b.getAttribute('onclick')||'').toLowerCase();if(t==='entrar'||o.includes('login')){e.preventDefault();e.stopImmediatePropagation();abrirADM();}},true);
    document.addEventListener('keydown',e=>{if(e.key==='Enter'){const p=document.getElementById('pass');if(p&&document.activeElement===p){e.preventDefault();e.stopImmediatePropagation();abrirADM();}}},true);
  }

  async function carregar(){
    try{
      let from=0,rows=[],size=1000;
      while(true){
        const r=await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal,data_nota_fiscal,origem&order=id.asc`,{headers:{...headers,Range:`${from}-${from+size-1}`}});
        if(!r.ok)throw Error(`Supabase HTTP ${r.status}`);
        const p=await r.json();if(!Array.isArray(p)||!p.length)break;rows.push(...p);if(p.length<size)break;from+=size;
      }
      if(rows.length&&typeof DATA!=='undefined'&&Array.isArray(DATA.vendas)){
        DATA.vendas=rows.map(r=>({cliente:String(r.cliente??'').trim(),rota:String(r.rota??'').trim(),razao:String(r.razao??'').trim(),material:String(r.material??'').trim(),marca:String(r.marca??'').trim(),descricao:String(r.descricao??'').trim(),subcanal:String(r.subcanal??'').trim(),dataNotaFiscal:r.data_nota_fiscal||'',origem:String(r.origem??'').trim()}));
        zerarMetas();
        if(typeof window.refreshMainData==='function')window.refreshMainData();else if(typeof window.render==='function')window.render();
        setTimeout(zerarMetas,100);window.__SUPABASE_ONLINE_READY__=true;
      }else{zerarMetas();if(typeof window.render==='function')window.render();}
    }catch(e){console.warn('[Supabase]',e);zerarMetas();if(typeof window.render==='function')window.render();}
  }

  function iniciar(){corrigir();zerarMetas();carregar();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();