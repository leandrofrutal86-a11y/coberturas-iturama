/* Correcao final: KPI de coberturas por categoria + horario da ultima atualizacao */
(() => {
  const API='https://harlrfhukjvhpufwhtep.supabase.co/rest/v1/vendas';
  const KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const H={apikey:KEY,Authorization:`Bearer ${KEY}`};
  const norm=v=>String(v??'').trim().toUpperCase();
  const mat=v=>norm(v).replace(/[\s-]+/g,'').replace(/^0+(?=\d)/,'');
  const route=r=>String(r?.rota??'').trim();
  const client=r=>String(r?.cliente??'').trim();
  const brand=r=>norm(r?.marca);
  const sub=r=>norm(r?.subcanal);
  let rows=[];
  let lastKey='';

  function atualizarHorario(texto){
    const nodes=[...document.querySelectorAll('*')].filter(e=>{
      const t=(e.textContent||'').replace(/\s+/g,' ').trim();
      return t.startsWith('Atualizada em ');
    });
    if(!nodes.length)return false;
    const el=nodes.sort((a,b)=>a.children.length-b.children.length)[0];
    el.textContent=`Atualizada em ${texto}`;
    return true;
  }

  async function carregarHorario(){
    try{
      const r=await fetch(`data/last-update.json?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok)throw Error('last-update '+r.status);
      const d=await r.json();
      if(d&&d.display)atualizarHorario(String(d.display));
    }catch(e){console.warn('[Ultima atualizacao]',e)}
  }

  async function load(){
    let from=0,out=[],size=1000;
    while(true){
      const r=await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal`,{headers:{...H,Range:`${from}-${from+size-1}`}});
      if(!r.ok)throw Error('Supabase '+r.status);
      const p=await r.json();
      if(!Array.isArray(p)||!p.length)break;
      out.push(...p); if(p.length<size)break; from+=size;
    }
    rows=out; sync();
  }

  function calc(rota,cat){
    const rr=rows.filter(r=>route(r)===rota);
    if(cat==='COBERTURA HEINEKEN'){
      const wanted=['HEINEKEN','EISENBAHN','SOL','KAISER','BAVARIA'],s=new Set();
      rr.forEach(r=>{const b=brand(r);if(wanted.some(x=>b===x||b.startsWith(x+' '))){const c=client(r);if(c)s.add(c)}});
      return {realizado:s.size,clients:[...s]};
    }
    if(cat==='TRIO PÃO DE QUEIJO'){
      const deposit=new Set(rr.filter(r=>sub(r)==='DEPOSITO DE BEBIDAS').map(client)),map=new Map();
      rr.forEach(r=>{const c=client(r);if(!c||deposit.has(c))return;if(!map.has(c))map.set(c,[]);map.get(c).push(r)});
      const completos=[];
      map.forEach((rs,c)=>{const g1=rs.some(r=>['1918','1919'].includes(mat(r.material))),g2=rs.some(r=>['1916','1917'].includes(mat(r.material))),g3=rs.some(r=>mat(r.material)==='1827');if(g1&&g2&&g3)completos.push(c)});
      return {realizado:completos.length,clients:completos};
    }
    return null;
  }

  function text(el){return (el?.textContent||'').replace(/\s+/g,' ').trim()}
  function findCard(label){
    const nodes=[...document.querySelectorAll('*')].filter(e=>text(e)===label);
    for(const n of nodes){let p=n;for(let i=0;i<7&&p;i++,p=p.parentElement){if(!p||p===document.body)break;const nums=[...p.querySelectorAll('*')].filter(e=>/^\d+(?:[.,]\d+)?%?$/.test(text(e))&&text(e)!==label);if(nums.length)return nums;}}
    return null;
  }
  function setCard(label,value){const nums=findCard(label);if(!nums)return false;const target=nums.find(e=>!text(e).includes('%'))||nums[0];if(target&&text(target)!==String(value))target.textContent=String(value);return !!target;}
  function sync(){
    const rota=String(document.getElementById('consultor')?.value||'').trim(),cat=String(document.getElementById('categoria')?.value||'').trim();
    if(!rota||!cat)return;const d=calc(rota,cat);if(!d)return;const key=rota+'|'+cat+'|'+d.realizado;if(key===lastKey)return;lastKey=key;
    setTimeout(()=>{setCard('REALIZADO',d.realizado);setCard('FALTA',0);},80);
  }
  function install(){const s=document.getElementById('consultor'),c=document.getElementById('categoria');if(s&&!s.__forceCat){s.__forceCat=true;s.addEventListener('change',()=>{lastKey='';setTimeout(sync,120)})}if(c&&!c.__forceCat){c.__forceCat=true;c.addEventListener('change',()=>{lastKey='';setTimeout(sync,120)})}sync()}
  function boot(){carregarHorario();load().catch(e=>console.warn('[Category Fix]',e));setTimeout(install,300);setTimeout(sync,1000);setTimeout(sync,2000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
