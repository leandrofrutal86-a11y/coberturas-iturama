/* Base de vendas atualizada em 07/09/2026 + parametros de categorias */
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

  function instalarParametros(){
    if(typeof window.categoryRows!=='function' || typeof DATA==='undefined') return;
    const old=window.categoryRows;
    const cc=v=>String(v??'').trim().toUpperCase().replace(/[\s-]+/g,'').replace(/^0+(?=\d)/,'');
    const route=r=>String(r?.rota??r?.Rota??'').trim();
    const client=r=>String(r?.cliente??r?.Cliente??'').trim();
    const mat=r=>cc(r?.material??r?.Material??'');
    const brand=r=>String(r?.marca??r?.Marca??'').trim().toUpperCase();
    const desc=r=>String(r?.descricao??r?.Descrição??r?.['descrição']??'').trim().toUpperCase();
    const rowsFor=rota=>(DATA.vendas||[]).filter(r=>route(r)===String(rota));

    window.categoryRows=function(rota,cat){
      const rows=rowsFor(rota);
      if(cat==='FINI') return rows.filter(r=>brand(r)==='FINI');
      if(cat==='PERFETTI') return rows.filter(r=>brand(r)==='PERFETTI');
      if(cat==='MONSTER ULTRA') return rows.filter(r=>brand(r).includes('MONSTER ULTRA')||desc(r).includes('MONSTER ULTRA'));
      if(cat==='MARCA CAMPARI') return rows.filter(r=>brand(r)==='CAMPARI');
      if(cat==='APEROL') return rows.filter(r=>brand(r)==='APEROL'||desc(r).includes('APEROL'));
      if(cat==='OLD PARR') return rows.filter(r=>['8280','1965'].includes(mat(r)));
      if(cat==='RED LABEL') return rows.filter(r=>['1973','1964','8014'].includes(mat(r)));
      if(cat==='SMIRNOFF VODKA') return rows.filter(r=>desc(r).includes('SMIRNOFF')&&!desc(r).includes('ICE'));
      if(cat==='ESTRELLA GERAL') return rows.filter(r=>brand(r).includes('ESTRELLA')||desc(r).includes('ESTRELLA'));
      if(cat==='ESTRELLA ORIGINAL') return rows.filter(r=>['1960','1885','1891'].includes(mat(r)));
      if(cat==='ESTRELLA RGB') return rows.filter(r=>mat(r)==='1891');
      if(cat==='TRIO PÃO DE QUEIJO') {
        const by=new Map(); rows.forEach(r=>{const pv=client(r);if(!pv)return;if(!by.has(pv))by.set(pv,[]);by.get(pv).push(r)});
        const out=[]; by.forEach(rs=>{const g1=rs.some(r=>['1918','1919'].includes(mat(r))),g2=rs.some(r=>mat(r)==='1916'),g3=rs.some(r=>mat(r)==='1827');if(g1&&g2&&g3)out.push(rs[0])});
        return out;
      }
      if(cat==='COBERTURA HEINEKEN') return rows.filter(r=>{const b=brand(r);return b.includes('BAVARIA')||b.includes('EISENBAHN')||b.includes('KAISER')||b==='SOL'||b.startsWith('SOL ')});
      return old(rota,cat);
    };

    window.__renderTrioDetalhe=function(){
      const panel=document.getElementById('v10ComboDetail'),cat=document.getElementById('categoria'),cons=document.getElementById('consultor');
      if(!panel||!cat||cat.value!=='TRIO PÃO DE QUEIJO') {if(panel)panel.style.display='none';return;}
      const rota=cons?.value||'',groups=[['19-18','19-19'],['19-16'],['18-27']],map=new Map();
      (DATA.vendas||[]).filter(r=>route(r)===String(rota)).forEach(r=>{const pv=client(r);if(!pv)return;if(!map.has(pv))map.set(pv,{pv,razao:String(r.razao??r['Razão Social']??'').trim(),rows:[]});map.get(pv).rows.push(r)});
      const arr=[];map.forEach(c=>{const feitos=groups.map(g=>c.rows.some(r=>g.map(cc).includes(mat(r))));const q=feitos.filter(Boolean).length;if(q)arr.push({...c,feitos,q,missing:3-q})});
      arr.sort((a,b)=>a.razao.localeCompare(b.razao,'pt-BR'));
      const completos=arr.filter(x=>x.q===3).length,parciais=arr.length-completos;
      panel.style.display='block';
      panel.innerHTML='<h3>🔗 Acompanhamento — TRIO PÃO DE QUEIJO</h3><div style="font-size:12px;color:#69707a;margin-bottom:10px"><b>Grupo 1:</b> 19-18 ou 19-19 &nbsp;•&nbsp; <b>Grupo 2:</b> 19-16 &nbsp;•&nbsp; <b>Grupo 3:</b> 18-27. O Trio só fecha com os 3 grupos.</div><div style="font-size:12px;margin-bottom:10px"><b>'+completos+'</b> completos · <b>'+parciais+'</b> com venda parcial</div><div style="overflow:auto"><table><thead><tr><th>PV</th><th>Cliente</th><th>G1</th><th>G2</th><th>G3</th><th>Status</th><th>Falta</th></tr></thead><tbody>'+(arr.length?arr.map(c=>{const s=c.feitos.map(x=>x?'✓':'✕').map(x=>'<td style="font-size:18px;font-weight:800">'+x+'</td>').join('');return '<tr><td><b>'+String(c.pv)+'</b></td><td>'+String(c.razao)+'</td>'+s+'<td class="'+(c.q===3?'v10-combo-done':'v10-combo-missing')+'">'+(c.q===3?'✓ TRIO FECHADO':'✕ NÃO FECHOU')+'</td><td class="v10-combo-missing"><b>'+ (c.missing?('Faltam '+c.missing+' grupo'+(c.missing===1?'':'s')):'—') +'</b></td></tr>'}).join(''):'<tr><td colspan="7">Nenhum cliente vendeu material do Trio nesta rota.</td></tr>')+'</tbody></table></div><div style="font-size:12px;color:#69707a;margin-top:8px">✓ = grupo já vendido. ✕ = grupo ainda não vendido. Se fez 1 grupo, aparecerá ✕ NÃO FECHOU e Faltam 2 grupos.</div>';
    };

    const oldRender=window.render;
    if(typeof oldRender==='function'&&!oldRender.__v31){
      const wrapped=function(){const r=oldRender.apply(this,arguments);setTimeout(window.__renderTrioDetalhe,20);return r};
      wrapped.__v31=true;window.render=wrapped;
    }
    setTimeout(window.__renderTrioDetalhe,100);
  }

  async function carregar(){
    try{
      let from=0,rows=[],size=1000;
      while(true){
        const r=await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal,data_nota_fiscal,origem`,{headers:{...headers,Range:`${from}-${from+size-1}`}});
        if(!r.ok)throw Error(`Supabase HTTP ${r.status}`);
        const p=await r.json();if(!Array.isArray(p)||!p.length)break;rows.push(...p);if(p.length<size)break;from+=size;
      }
      if(rows.length&&typeof DATA!=='undefined'&&Array.isArray(DATA.vendas)){
        DATA.vendas=rows.map(r=>({cliente:String(r.cliente??'').trim(),rota:String(r.rota??'').trim(),razao:String(r.razao??'').trim(),material:String(r.material??'').trim(),marca:String(r.marca??'').trim(),descricao:String(r.descricao??'').trim(),subcanal:String(r.subcanal??'').trim(),dataNotaFiscal:r.data_nota_fiscal||'',origem:String(r.origem??'').trim()}));
        zerarMetas();
        instalarParametros();
        if(typeof window.refreshMainData==='function')window.refreshMainData();else if(typeof window.render==='function')window.render();
        setTimeout(()=>{zerarMetas();window.__renderTrioDetalhe?.()},100);window.__SUPABASE_ONLINE_READY__=true;
      }else{zerarMetas();instalarParametros();if(typeof window.render==='function')window.render();}
    }catch(e){console.warn('[Supabase]',e);zerarMetas();instalarParametros();if(typeof window.render==='function')window.render();}
  }

  function iniciar(){corrigir();zerarMetas();instalarParametros();carregar();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
