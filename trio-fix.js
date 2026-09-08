/* Correção definitiva do TRIO PÃO DE QUEIJO - 1917 no Grupo 2 */
(() => {
  const API='https://harlrfhukjvhpufwhtep.supabase.co/rest/v1/vendas';
  const KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const H={apikey:KEY,Authorization:`Bearer ${KEY}`};
  const norm=v=>String(v??'').trim().toUpperCase().replace(/[\s-]+/g,'').replace(/^0+(?=\d)/,'');
  const route=r=>String(r?.rota??'').trim();
  const client=r=>String(r?.cliente??'').trim();
  const razao=r=>String(r?.razao??'').trim();
  const sub=r=>String(r?.subcanal??'').trim().toUpperCase();
  const mat=r=>norm(r?.material);
  let rows=[];

  async function load(){
    let from=0,out=[],size=1000;
    while(true){
      const r=await fetch(`${API}?select=cliente,rota,razao,material,subcanal`,{headers:{...H,Range:`${from}-${from+size-1}`}});
      if(!r.ok)throw Error(`Supabase ${r.status}`);
      const p=await r.json(); if(!Array.isArray(p)||!p.length)break;
      out.push(...p); if(p.length<size)break; from+=size;
    }
    rows=out;
    render();
  }

  function calc(){
    const sel=document.getElementById('consultor');
    const rota=String(sel?.value||'').trim();
    const rr=rows.filter(r=>route(r)===rota);
    const depositClients=new Set(rr.filter(r=>sub(r)==='DEPOSITO DE BEBIDAS').map(client).filter(Boolean));
    const map=new Map();
    rr.forEach(r=>{
      const pv=client(r); if(!pv||depositClients.has(pv))return;
      if(!map.has(pv))map.set(pv,{pv,razao:razao(r),rows:[]});
      map.get(pv).rows.push(r);
    });
    const groups=[['1918','1919'],['1916','1917'],['1827']];
    const arr=[];
    map.forEach(c=>{
      const feitos=groups.map(g=>c.rows.some(r=>g.includes(mat(r))));
      const q=feitos.filter(Boolean).length;
      if(q)arr.push({...c,feitos,q,missing:3-q});
    });
    arr.sort((a,b)=>b.q-a.q||a.razao.localeCompare(b.razao,'pt-BR'));
    return {rota,arr,depositClients,complete:arr.filter(x=>x.q===3),two:arr.filter(x=>x.q===2),one:arr.filter(x=>x.q===1)};
  }

  function findCard(label,extra=''){
    const els=[...document.querySelectorAll('div,section,article')];
    for(const e of els){
      const t=(e.textContent||'').replace(/\s+/g,' ').trim();
      if(t.includes(label)&&(!extra||t.toLowerCase().includes(extra.toLowerCase()))&&e.querySelector('table')){
        const p=e.parentElement;
        if(p&&p.querySelector('table')&&((p.textContent||'').includes(label)))return p;
        return e;
      }
    }
    return null;
  }

  function updateRealizados(d){
    const card=findCard('Clientes realizados — TRIO PÃO DE QUEIJO');
    if(!card)return;
    const count=[...card.querySelectorAll('*')].find(e=>/^\d+ clientes?$/.test((e.textContent||'').trim()));
    if(count)count.textContent=`${d.complete.length} clientes`;
    const tbody=card.querySelector('table tbody');
    if(!tbody)return;
    tbody.innerHTML=d.complete.length?d.complete.map((c,i)=>`<tr><td>${i+1}</td><td><b>${esc(c.pv)}</b></td><td>${esc(c.razao)}</td></tr>`).join(''):`<tr><td colspan="3">Nenhum cliente realizado para esta combinação.</td></tr>`;
  }

  function updateAcompanhamento(d){
    let card=findCard('Trio Pão de Queijo — acompanhamento');
    if(!card)card=findCard('Trio Pão de Queijo','acompanhamento');
    if(!card)return;
    const rowsHtml=d.arr.map(c=>{
      const marks=c.feitos.map(x=>`<td style="font-size:18px;font-weight:800">${x?'✓':'✕'}</td>`).join('');
      const status=c.q===3?'✓ TRIO REALIZADO':'✕ NÃO FECHOU';
      const falta=c.missing?`Faltam ${c.missing} grupo${c.missing===1?'':'s'}`:'—';
      return `<tr><td><b>${esc(c.pv)}</b></td><td>${esc(c.razao)}</td>${marks}<td>${status}</td><td>${falta}</td></tr>`;
    }).join('');
    card.innerHTML=`<div style="padding:20px 24px;border-bottom:1px solid #eee"><h2 style="margin:0 0 6px">Trio Pão de Queijo — acompanhamento</h2><div style="font-size:13px;color:#69707a">${d.arr.length} clientes com venda · <b>${d.complete.length}</b> completos · <b>${d.two.length}</b> com 2 grupos · <b>${d.one.length}</b> com 1 grupo</div></div><div style="padding:0 16px 16px;overflow:auto"><table><thead><tr><th>CLIENTE</th><th>RAZÃO SOCIAL</th><th>GRUPO 1<br>1918 OU 1919</th><th>GRUPO 2<br>1916 OU 1917</th><th>GRUPO 3<br>1827</th><th>REALIZADO</th><th>FALTA</th></tr></thead><tbody>${rowsHtml||'<tr><td colspan="7">Nenhum cliente vendeu material do Trio nesta rota.</td></tr>'}</tbody></table><div style="font-size:12px;color:#69707a;margin-top:8px">✓ = grupo vendido · ✕ = grupo ainda não vendido · Depósito de Bebidas não participa do acompanhamento nem da cobertura.</div></div>`;
  }

  function updateKpi(d){
    const trs=[...document.querySelectorAll('tr')];
    const tr=trs.find(x=>(x.textContent||'').toUpperCase().includes('TRIO PÃO DE QUEIJO'));
    if(!tr)return;
    const cells=[...tr.children];
    if(cells.length>=4){
      // Mantém a meta zerada e atualiza o realizado com a quantidade de clientes completos.
      if(cells[2])cells[2].textContent=String(d.complete.length);
      if(cells[3])cells[3].textContent='0';
    }
    const pct=[...tr.querySelectorAll('*')].find(e=>(e.textContent||'').trim()==='0%'||/\d+%/.test((e.textContent||'').trim()));
    if(pct&&d.complete.length) pct.textContent='EM ANDAMENTO';
  }

  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  function render(){
    if(!rows.length)return;
    const d=calc();
    updateRealizados(d);updateAcompanhamento(d);updateKpi(d);
  }
  function boot(){
    load().catch(e=>console.warn('[Trio Fix]',e));
    const s=document.getElementById('consultor');
    if(s&&!s.__trioFix){s.__trioFix=true;s.addEventListener('change',()=>setTimeout(render,50));}
    setInterval(render,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
