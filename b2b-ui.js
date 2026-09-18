(()=>{
const PLUS='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/consultor-api-plus';
const norm=v=>String(v??'').trim().toUpperCase();
function installApi(){if(typeof api!=='function'){setTimeout(installApi,150);return}if(api.__b2b)return;const f=async function(action,body={}){let r=await fetch(PLUS,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token:TOKEN,...body})});let j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j};f.__b2b=true;api=f}
function enhance(){if(typeof renderClients!=='function'){setTimeout(enhance,200);return}if(renderClients.__b2b)return;const old=renderClients;
const fmtDate=d=>{const s=String(d||'').slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(s)?s.split('-').reverse().join('/'):s};
const rowsWithDates=a=>a.length?a.map(c=>`<tr><td><b>${esc(c.cliente)}</b></td><td>${esc(c.razao)}</td><td>${(c.datas||[]).map(d=>esc(fmtDate(d))).join(' • ')||'—'}</td></tr>`).join(''):'<tr><td colspan="3" class="empty">Nenhum cliente.</td></tr>';
const rowsBasic=a=>a.length?a.map(c=>`<tr><td><b>${esc(c.cliente)}</b></td><td>${esc(c.razao)}</td></tr>`).join(''):'<tr><td colspan="2" class="empty">Nenhum cliente.</td></tr>';
const f=function(cat){
  const n=norm(cat);
  if(TAB!=='meu')return old(cat);

  if(n==='COMPRA B2B'){
    const row=(DATA?.own||[]).find(x=>norm(x.nome)==='COMPRA B2B'),all=(row?.clientes||[]).filter(x=>x.completo!==false);
    $('clients').innerHTML=`<h3>🛒 Clientes com Compra B2B (${all.length})</h3><div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th></tr></thead><tbody>${rowsBasic(all)}</tbody></table></div>`;
    return;
  }

  if(n==='RECOMPRA B2B'){
    const row=(DATA?.own||[]).find(x=>norm(x.nome)==='RECOMPRA B2B'),all=row?.clientes||[];
    const feitos=all.filter(x=>x.completo===true&&Number(x.compras||0)>=2);
    const aguardando=all.filter(x=>x.completo!==true&&Number(x.compras||0)===1);
    $('clients').innerHTML=`
      <h3>🔁 Clientes com Recompra B2B (${feitos.length})</h3>
      <div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th><th>Datas B2B</th></tr></thead><tbody>${rowsWithDates(feitos)}</tbody></table></div>
      <h3 style="margin-top:18px">⏳ Aguardando Recompra (${aguardando.length})</h3>
      <div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th><th>Única compra B2B</th></tr></thead><tbody>${rowsWithDates(aguardando)}</tbody></table></div>`;
    return;
  }

  if(n!=='OPORTUNIDADE B2B')return old(cat);
  const row=(DATA?.own||[]).find(x=>norm(x.nome)==='OPORTUNIDADE B2B');const all=row?.clientes||[],re=all.filter(x=>x.status==='RECOMPRA'),co=all.filter(x=>x.status!=='RECOMPRA');
  $('clients').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0"><div class="sum"><b>🛒 COMPRA</b><strong>${row?.compra||0}</strong><small>Clientes com B2B em 1 ou mais datas</small></div><div class="sum"><b>🔁 RECOMPRA</b><strong>${row?.recompra||0}</strong><small>Clientes com B2B em 2 ou mais datas diferentes</small></div></div><h3>🔁 Recompra (${re.length})</h3><div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th><th>Datas B2B</th></tr></thead><tbody>${rowsWithDates(re)}</tbody></table></div><h3>🛒 Compra (${co.length})</h3><div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th><th>Data B2B</th></tr></thead><tbody>${rowsWithDates(co)}</tbody></table></div>`;
};f.__b2b=true;renderClients=f;
const oldRender=render;render=function(){oldRender();document.querySelectorAll('#results tbody tr').forEach(tr=>{const td=tr.cells?.[0];if(!td||!norm(td.textContent).includes('OPORTUNIDADE B2B'))return;const row=(TAB==='meu'?(DATA?.own||[]):(DATA?.team||[])).find(x=>norm(x.nome)==='OPORTUNIDADE B2B');if(row&&!td.querySelector('.b2bextra'))td.insertAdjacentHTML('beforeend',`<div class="b2bextra" style="margin-top:5px;font-size:11px;color:#5b6773"><b>Compra:</b> ${row.compra||0} &nbsp; • &nbsp; <b>Recompra:</b> ${row.recompra||0}</div>`)})}
}
function patchSearch(){const old=window.searchPv||searchPv;if(!old||old.__b2bsearch)return;const f=async function(){let pv=$('pv').value.trim();if(!pv)return;$('pvout').innerHTML='<div class="empty">Pesquisando...</div>';try{let j=await api('search_pv',{pv});if(!j.found){$('pvout').innerHTML='<div class="empty">Cliente não encontrado na sua rota.</div>';return}let c=j.cliente,rows=j.categorias||[],aviso=j.sem_compra?'<div class="noBuy">Cliente sem compra no mês!</div>':'';$('pvout').innerHTML=`<div class="clientHead"><h3>${esc(c.razao||'Cliente')}</h3><b>PV ${esc(c.pv)}</b><br><small>${esc(c.subcanal||'')}</small></div>${aviso}<div class="tableWrap"><table><thead><tr><th>Incentivo</th><th>Situação</th><th>Detalhe</th></tr></thead><tbody>${rows.map(x=>{if(norm(x.nome)==='OPORTUNIDADE B2B'){const st=x.status||'SEM COMPRA';return `<tr><td><b>${esc(x.nome)}</b></td><td><span class="pill ${st==='SEM COMPRA'?'no':'ok'}">${st==='RECOMPRA'?'🔁 RECOMPRA':st==='COMPRA'?'🛒 COMPRA':'✕ SEM COMPRA'}</span></td><td>${(x.datas||[]).map(d=>esc(String(d).split('-').reverse().join('/'))).join(' • ')}</td></tr>`}return `<tr><td><b>${esc(x.nome)}</b></td><td><span class="pill ${x.realizado?'ok':'no'}">${x.realizado?'✓ VENDIDO':'✕ FALTA'}</span></td><td>${(x.grupos||[]).length?`<div class="groupStatus">${x.grupos.map(g=>`<span class="${g.vendido?'gok':'gno'}">Grupo ${esc(g.grupo)} ${g.vendido?'✓ Vendeu':'✕ Falta'}</span>`).join('')}</div>`:''}</td></tr>`}).join('')}</tbody></table></div>`}catch(e){$('pvout').innerHTML=`<div class="empty">${esc(e.message)}</div>`}};f.__b2bsearch=true;searchPv=f;window.searchPv=f}
function boot(){installApi();setTimeout(()=>{enhance();patchSearch()},200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();