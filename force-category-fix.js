/* Correcao definitiva: escreve os realizados no painel, resumo, visao geral e clientes */
(() => {
  const API='https://harlrfhukjvhpufwhtep.supabase.co/rest/v1/vendas';
  const KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const H={apikey:KEY,Authorization:`Bearer ${KEY}`};
  const norm=v=>String(v??'').trim().toUpperCase();
  const mat=v=>norm(v).replace(/[\s-]+/g,'').replace(/^0+(?=\d)/,'');
  const client=r=>String(r?.cliente??r?.Cliente??'').trim();
  const route=r=>String(r?.rota??r?.Rota??'').trim();
  const brand=r=>norm(r?.marca??r?.Marca);
  const sub=r=>norm(r?.subcanal??r?.Subcanal);
  const razao=r=>String(r?.razao??r?.['Razão Social']??r?.razao_social??'').trim();
  let rows=[];
  const SPECIAL=new Set(['TRIO PÃO DE QUEIJO','COBERTURA HEINEKEN']);

  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const fmt=n=>Number(n||0).toLocaleString('pt-BR',{maximumFractionDigits:0});

  function trioData(rota){
    const rr=rows.filter(r=>route(r)===String(rota).trim());
    const deposits=new Set(rr.filter(r=>sub(r)==='DEPOSITO DE BEBIDAS').map(client));
    const groups=[['1918','1919'],['1916','1917'],['1827']];
    const map=new Map();
    rr.forEach(r=>{
      const c=client(r); if(!c||deposits.has(c))return;
      if(!map.has(c))map.set(c,{pv:c,razao:razao(r),rows:[]});
      map.get(c).rows.push(r);
    });
    const list=[];
    map.forEach(c=>{
      const feitos=groups.map(g=>c.rows.some(r=>g.includes(mat(r.material))));
      const q=feitos.filter(Boolean).length;
      if(q)list.push({...c,feitos,q,missing:3-q});
    });
    list.sort((a,b)=>b.q-a.q||a.razao.localeCompare(b.razao,'pt-BR'));
    return {list,complete:list.filter(x=>x.q===3)};
  }

  function heinekenData(rota){
    const wanted=['HEINEKEN','EISENBAHN','SOL','KAISER','BAVARIA'];
    const map=new Map();
    rows.filter(r=>route(r)===String(rota).trim()).forEach(r=>{
      const b=brand(r);
      if(wanted.some(x=>b===x||b.startsWith(x+' '))){
        const c=client(r); if(c&&!map.has(c))map.set(c,r);
      }
    });
    return [...map.values()].sort((a,b)=>razao(a).localeCompare(razao(b),'pt-BR'));
  }

  function specialCount(rota,cat){
    if(cat==='TRIO PÃO DE QUEIJO')return trioData(rota).complete.length;
    if(cat==='COBERTURA HEINEKEN')return heinekenData(rota).length;
    return null;
  }

  function count(rota,cat){
    const s=specialCount(rota,cat); if(s!==null)return s;
    try{
      if(typeof window.categoryRows==='function'){
        const rs=window.categoryRows(rota,cat)||[];
        return new Set(rs.map(client).filter(Boolean)).size;
      }
    }catch(e){}
    return 0;
  }

  function meta(rota,cat){
    try{return Number((typeof customMetas!=='undefined'&&customMetas[rota+'|'+cat]) ?? (typeof DATA!=='undefined'&&DATA.metas?DATA.metas[rota+'|'+cat]:0) ?? 0)}catch(e){return 0}}

  function updateStamp(){
    fetch(`data/last-update.json?v=${Date.now()}`,{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{
      if(!d?.display)return;
      let el=document.querySelector('#onlineUpdateStamp');
      if(!el){
        el=[...document.querySelectorAll('body *')].find(e=>(e.textContent||'').trim().startsWith('Atualizada em ')&&e.children.length===0);
      }
      if(!el){el=document.createElement('div');el.id='onlineUpdateStamp';el.style.cssText='position:fixed;top:12px;left:14px;z-index:99999;background:#333;color:#fff;padding:9px 14px;border-radius:14px;font:700 14px Arial;box-shadow:0 3px 10px rgba(0,0,0,.2)';document.body.appendChild(el)}
      el.textContent='Atualizada em '+d.display;
    }).catch(()=>{});
  }

  function renderClients(rota,cat){
    const body=document.querySelector('#tbody'),countEl=document.querySelector('#count'),title=document.querySelector('#clientsCategory');
    if(!body)return;
    if(cat==='TRIO PÃO DE QUEIJO'){
      const d=trioData(rota), list=d.list;
      if(title)title.textContent='TRIO PÃO DE QUEIJO — clientes com venda parcial ou completa';
      if(countEl)countEl.textContent=list.length+' cliente'+(list.length===1?'':'s');
      const thead=document.querySelector('.panel table thethead');
      const th=document.querySelector('.panel table thead');
      if(th)th.innerHTML='<tr><th>Nº</th><th>PV</th><th>Razão Social</th><th>Grupo 1<br>1918/1919</th><th>Grupo 2<br>1916/1917</th><th>Grupo 3<br>1827</th><th>Situação</th><th>Falta</th></tr>';
      const badge=ok=>`<span style="display:inline-block;min-width:34px;padding:4px 8px;border-radius:7px;font-weight:900;text-align:center;background:${ok?'#dcfce7':'#fee2e2'};color:${ok?'#166534':'#991b1b'}">${ok?'✓':'✕'}</span>`;
      body.innerHTML=list.length?list.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.pv)}</b></td><td>${esc(x.razao)}</td>${x.feitos.map(b=>'<td>'+badge(b)+'</td>').join('')}<td>${x.q===3?'<b style="color:#15803d">✓ TRIO REALIZADO</b>':'<b style="color:#b91c1c">✕ NÃO FECHOU</b>'}</td><td>${x.missing?'Faltam '+x.missing+' grupo'+(x.missing===1?'':'s'):'—'}</td></tr>`).join(''):'<tr><td colspan="8" class="empty">Nenhum cliente vendeu material do Trio nesta rota.</td></tr>';
    } else if(cat==='COBERTURA HEINEKEN'){
      const list=heinekenData(rota);
      if(title)title.textContent='COBERTURA HEINEKEN — clientes realizados';
      if(countEl)countEl.textContent=list.length+' cliente'+(list.length===1?'':'s');
      const th=document.querySelector('.panel table thead');
      if(th)th.innerHTML='<tr><th>Nº</th><th>Cliente</th><th>Razão Social</th></tr>';
      body.innerHTML=list.length?list.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(client(r))}</td><td>${esc(razao(r))}</td></tr>`).join(''):'<tr><td colspan="3" class="empty">Nenhum cliente realizado para esta combinação.</td></tr>';
    }
  }

  function patchMain(){
    const rota=document.querySelector('#consultor')?.value||'';
    const cat=document.querySelector('#categoria')?.value||'';
    if(!rota||!cat)return;
    if(SPECIAL.has(cat)){
      const realizado=count(rota,cat), m=meta(rota,cat), falta=Math.max(m-realizado,0), pct=m?realizado/m:0;
      const set=(id,v)=>{const e=document.querySelector('#'+id);if(e)e.textContent=String(v)};
      set('meta',fmt(m));set('realizado',fmt(realizado));set('falta',fmt(falta));set('pct',Math.round(pct*100)+'%');
      const bar=document.querySelector('#bar');if(bar)bar.style.width=Math.min(pct*100,100)+'%';
      const status=document.querySelector('#status');if(status){status.textContent=realizado>=m&&m>0?'✓ META ATINGIDA':'✕ META NÃO ATINGIDA';status.className='status '+(realizado>=m&&m>0?'ok':'bad')}
      renderClients(rota,cat);
    }
    patchSummary(rota);
    updateStamp();
  }

  function patchSummary(rota){
    const sb=document.querySelector('#summaryBody');
    if(!sb||typeof DATA==='undefined'||!Array.isArray(DATA.categorias))return;
    const trs=[...sb.querySelectorAll('tr')];
    DATA.categorias.forEach((cat,i)=>{
      const tr=trs[i]; if(!tr)return;
      if(!SPECIAL.has(cat))return;
      const real=count(rota,cat),m=meta(rota,cat),f=Math.max(m-real,0),p=m?real/m:0;
      const cells=tr.querySelectorAll('td');
      if(cells[1])cells[1].textContent=fmt(m);
      if(cells[2]){cells[2].textContent=fmt(real);cells[2].className=real>=m?'summaryRealMet':'summaryRealBelow'}
      if(cells[3])cells[3].textContent=fmt(f);
      if(cells[4])cells[4].innerHTML=Math.round(p*100)+'%<small>'+(real>=m&&m>0?'META ATINGIDA':'EM ANDAMENTO')+'</small>';
    });
  }

  function rebuildOverview(){
    if(typeof DATA==='undefined'||!Array.isArray(DATA.consultores)||!Array.isArray(DATA.categorias))return;
    const body=document.querySelector('#overviewBody'); if(!body)return;
    const cats=DATA.categorias;
    const equipe={};cats.forEach(c=>equipe[c]={meta:0,realizado:0});
    const rowsHtml=DATA.consultores.map(c=>{
      let mt=0,rt=0;
      const cells=cats.map(cat=>{const m=meta(c.rota,cat),r=count(c.rota,cat);equipe[cat].meta+=m;equipe[cat].realizado+=r;mt+=m;rt+=r;return `<td class="metaCell">${fmt(m)}</td><td class="${r>=m?'realCell realMet':'realCell realBelow'}">${fmt(r)}</td>`}).join('');
      return `<tr><td class="consultorCell"><div><b>${esc(String(c.nome||'').split(' - ').pop())}</b><small>${esc(c.rota)}</small></div></td>${cells}<td class="metaTotalCell">${fmt(mt)}</td><td class="realTotalCell ${rt>=mt?'realMet':'realBelow'}">${fmt(rt)}</td><td class="percentCell"><b>${mt?Math.round(rt/mt*100):0}%</b><div class="miniProgress"><i style="width:${Math.min(mt?rt/mt*100:0,100)}%"></i></div></td></tr>`;
    }).join('');
    const em=cats.reduce((s,c)=>s+equipe[c].meta,0),er=cats.reduce((s,c)=>s+equipe[c].realizado,0);
    const equipeCells=cats.map(cat=>`<td class="metaCell equipeCell">${fmt(equipe[cat].meta)}</td><td class="${equipe[cat].realizado>=equipe[cat].meta?'realCell realMet':'realCell realBelow'} equipeCell">${fmt(equipe[cat].realizado)}</td>`).join('');
    const equipeRow=`<tr class="equipeRow"><td class="consultorCell"><div><b>EQUIPE</b><small>Somatório geral</small></div></td>${equipeCells}<td class="metaTotalCell equipeCell">${fmt(em)}</td><td class="realTotalCell equipeCell ${er>=em?'realMet':'realBelow'}">${fmt(er)}</td><td class="percentCell equipeCell"><b>${em?Math.round(er/em*100):0}%</b><div class="miniProgress"><i style="width:${Math.min(em?er/em*100:0,100)}%"></i></div></td></tr>`;
    const restCells=cats.map(cat=>{const n=Math.max(equipe[cat].meta-equipe[cat].realizado,0);return `<td colspan="2" class="restanteCell ${n===0?'restanteZero':'restantePositive'}">${fmt(n)}</td>`}).join('');
    const rest=`<tr class="restanteRow"><td class="consultorCell"><div><b>RESTANTE</b><small>Meta − Realizado</small></div></td>${restCells}<td colspan="2" class="restanteCell restanteTotalCell">${fmt(Math.max(em-er,0))}</td><td class="percentCell restantePercentCell">—</td></tr>`;
    body.innerHTML=rowsHtml+equipeRow+rest;
  }

  function install(){
    const s=document.querySelector('#consultor'),c=document.querySelector('#categoria');
    if(s&&!s.__fixFinal){s.__fixFinal=true;s.addEventListener('change',()=>setTimeout(patchMain,120))}
    if(c&&!c.__fixFinal){c.__fixFinal=true;c.addEventListener('change',()=>setTimeout(patchMain,120))}
    if(typeof window.render==='function'&&!window.render.__fixFinal){const old=window.render;const w=function(){const r=old.apply(this,arguments);setTimeout(patchMain,80);return r};w.__fixFinal=true;window.render=w}
    if(typeof window.refreshMainData==='function'&&!window.refreshMainData.__fixFinal){const old=window.refreshMainData;const w=function(){const r=old.apply(this,arguments);setTimeout(patchMain,80);return r};w.__fixFinal=true;window.refreshMainData=w}
    if(typeof window.showOverview==='function'&&!window.showOverview.__fixFinal){const old=window.showOverview;const w=function(){const r=old.apply(this,arguments);setTimeout(rebuildOverview,80);return r};w.__fixFinal=true;window.showOverview=w}
    patchMain();
  }

  async function load(){
    let from=0,out=[],size=1000;
    while(true){
      const r=await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal`,{headers:{...H,Range:`${from}-${from+size-1}`},cache:'no-store'});
      if(!r.ok)throw Error('Supabase '+r.status);
      const p=await r.json();if(!Array.isArray(p)||!p.length)break;out.push(...p);if(p.length<size)break;from+=size;
    }
    rows=out;
    if(typeof DATA!=='undefined'&&Array.isArray(DATA.vendas))DATA.vendas=out.map(r=>({cliente:client(r),rota:route(r),razao:razao(r),material:String(r.material??'').trim(),marca:String(r.marca??'').trim(),descricao:String(r.descricao??'').trim(),subcanal:String(r.subcanal??'').trim()}));
    install();patchMain();
  }

  function boot(){
    updateStamp();load().catch(e=>console.error('[Correcao coberturas]',e));
    let n=0;const timer=setInterval(()=>{n++;install();if(n>=40)clearInterval(timer)},200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
