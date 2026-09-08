/* Correcao definitiva: parametros, acompanhamentos e horario da atualizacao */
(() => {
  const API='https://harlrfhukjvhpufwhtep.supabase.co/rest/v1/vendas';
  const KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const H={apikey:KEY,Authorization:`Bearer ${KEY}`};
  const norm=v=>String(v??'').trim().toUpperCase();
  const mat=v=>norm(v).replace(/[\s-]+/g,'').replace(/^0+(?=\d)/,'');
  const client=r=>String(r?.cliente??'').trim();
  const route=r=>String(r?.rota??'').trim();
  const brand=r=>norm(r?.marca);
  const sub=r=>norm(r?.subcanal);
  const desc=r=>norm(r?.descricao);
  let rows=[];

  function findTextNode(prefix){
    const els=[...document.querySelectorAll('body *')].filter(e=>{const t=(e.textContent||'').replace(/\s+/g,' ').trim();return t.startsWith(prefix)&&e.children.length===0});
    return els[0]||null;
  }

  async function updateStamp(){
    try{
      const r=await fetch(`data/last-update.json?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok)return;
      const d=await r.json();
      if(!d?.display)return;
      let el=findTextNode('Atualizada em ');
      if(!el){
        el=document.createElement('div');
        el.id='onlineUpdateStamp';
        el.style.cssText='position:fixed;top:12px;left:14px;z-index:99999;background:#333;color:#fff;padding:9px 14px;border-radius:14px;font:700 14px Arial;box-shadow:0 3px 10px rgba(0,0,0,.2)';
        document.body.appendChild(el);
      }
      el.textContent=`Atualizada em ${d.display}`;
    }catch(e){console.warn('[Atualizacao]',e)}
  }

  async function load(){
    let from=0,out=[],size=1000;
    while(true){
      const r=await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal`,{headers:{...H,Range:`${from}-${from+size-1}`},cache:'no-store'});
      if(!r.ok)throw Error('Supabase '+r.status);
      const p=await r.json();
      if(!Array.isArray(p)||!p.length)break;
      out.push(...p);
      if(p.length<size)break;
      from+=size;
    }
    rows=out;
    installEvents();
    apply();
  }

  function calc(rota,cat){
    const rr=rows.filter(r=>route(r)===rota);
    if(cat==='COBERTURA HEINEKEN'){
      const wanted=['HEINEKEN','EISENBAHN','SOL','KAISER','BAVARIA'],set=new Set();
      rr.forEach(r=>{const b=brand(r);if(wanted.some(x=>b===x||b.startsWith(x+' '))){const c=client(r);if(c)set.add(c)}});
      return {realizado:set.size,clients:[...set]};
    }
    if(cat==='TRIO PÃO DE QUEIJO'){
      const deposits=new Set(rr.filter(r=>sub(r)==='DEPOSITO DE BEBIDAS').map(client));
      const by=new Map();
      rr.forEach(r=>{const c=client(r);if(!c||deposits.has(c))return;if(!by.has(c))by.set(c,[]);by.get(c).push(r)});
      const complete=[];
      by.forEach((rs,c)=>{
        const g1=rs.some(r=>['1918','1919'].includes(mat(r.material)));
        const g2=rs.some(r=>['1916','1917'].includes(mat(r.material)));
        const g3=rs.some(r=>mat(r.material)==='1827');
        if(g1&&g2&&g3)complete.push(c);
      });
      return {realizado:complete.length,clients:complete};
    }
    return null;
  }

  function card(label){
    const labels=[...document.querySelectorAll('body *')].filter(e=>(e.textContent||'').trim()===label&&e.children.length===0);
    for(const l of labels){
      let p=l.parentElement;
      for(let i=0;i<6&&p;i++,p=p.parentElement){
        const nums=[...p.querySelectorAll('*')].filter(e=>/^\d+(?:[.,]\d+)?$/.test((e.textContent||'').trim())&&e.children.length===0);
        if(nums.length)return nums[0];
      }
    }
    return null;
  }

  function setCard(label,value){const el=card(label);if(el)el.textContent=String(value)}

  function renderTrio(){
    const cat=document.getElementById('categoria'),sel=document.getElementById('consultor'),panel=document.getElementById('v10ComboDetail');
    if(!cat||!sel||!panel)return;
    if(cat.value!=='TRIO PÃO DE QUEIJO'){panel.style.display='none';return}
    const rota=sel.value,rr=rows.filter(r=>route(r)===rota),deposits=new Set(rr.filter(r=>sub(r)==='DEPOSITO DE BEBIDAS').map(client));
    const groups=[['1918','1919'],['1916','1917'],['1827']],map=new Map();
    rr.forEach(r=>{const c=client(r);if(!c||deposits.has(c))return;if(!map.has(c))map.set(c,{pv:c,razao:String(r.razao??'').trim(),rows:[]});map.get(c).rows.push(r)});
    const list=[];
    map.forEach(c=>{const feitos=groups.map(g=>c.rows.some(r=>g.includes(mat(r.material)))),q=feitos.filter(Boolean).length;if(q)list.push({...c,feitos,q})});
    list.sort((a,b)=>b.q-a.q||a.razao.localeCompare(b.razao,'pt-BR'));
    const completos=list.filter(x=>x.q===3).length,dois=list.filter(x=>x.q===2).length,um=list.filter(x=>x.q===1).length;
    panel.style.display='block';
    panel.innerHTML=`<h3>🔗 Acompanhamento — TRIO PÃO DE QUEIJO</h3><div style="font-size:12px;color:#69707a;margin-bottom:10px"><b>Grupo 1:</b> 19-18 ou 19-19 &nbsp;•&nbsp; <b>Grupo 2:</b> 19-16 ou 19-17 &nbsp;•&nbsp; <b>Grupo 3:</b> 18-27</div><div style="font-size:12px;margin-bottom:10px"><b>${completos}</b> realizados · <b>${dois}</b> com 2 grupos · <b>${um}</b> com 1 grupo</div><div style="overflow:auto"><table><thead><tr><th>PV</th><th>Cliente</th><th>G1</th><th>G2</th><th>G3</th><th>Status</th><th>Falta</th></tr></thead><tbody>${list.length?list.map(c=>{const g=c.feitos.map(x=>`<td style="font-size:18px;font-weight:800">${x?'✓':'✕'}</td>`).join('');const falta=3-c.q;return `<tr><td><b>${c.pv}</b></td><td>${c.razao}</td>${g}<td>${c.q===3?'✓ TRIO REALIZADO':'✕ NÃO FECHOU'}</td><td>${falta?`Faltam ${falta} grupo${falta===1?'':'s'}`:'—'}</td></tr>`}).join(''):'<tr><td colspan="7">Nenhum cliente vendeu material do Trio nesta rota.</td></tr>'}</tbody></table></div><div style="font-size:12px;color:#69707a;margin-top:8px">✓ = grupo vendido. ✕ = grupo não vendido. Depósito de Bebidas não participa do Trio.</div>`;
  }

  function apply(){
    const rota=document.getElementById('consultor')?.value||'',cat=document.getElementById('categoria')?.value||'';
    const d=calc(String(rota).trim(),String(cat).trim());
    if(d){setCard('REALIZADO',d.realizado);setCard('FALTA',0)}
    renderTrio();
    updateStamp();
  }

  function installEvents(){
    const s=document.getElementById('consultor'),c=document.getElementById('categoria');
    if(s&&!s.__finalFix){s.__finalFix=true;s.addEventListener('change',()=>setTimeout(apply,150))}
    if(c&&!c.__finalFix){c.__finalFix=true;c.addEventListener('change',()=>setTimeout(apply,150))}
    if(typeof window.render==='function'&&!window.render.__finalFix){const old=window.render;const w=function(){const r=old.apply(this,arguments);setTimeout(apply,100);return r};w.__finalFix=true;window.render=w}
    if(typeof window.refreshMainData==='function'&&!window.refreshMainData.__finalFix){const old=window.refreshMainData;const w=function(){const r=old.apply(this,arguments);setTimeout(apply,100);return r};w.__finalFix=true;window.refreshMainData=w}
  }

  function boot(){
    updateStamp();
    load().catch(e=>console.error('[Correcao definitiva]',e));
    let tries=0;
    const timer=setInterval(()=>{tries++;installEvents();updateStamp();apply();if(tries>=30)clearInterval(timer)},200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
