/* Trio Pão de Queijo — renderização direta e leve, sem MutationObserver. */
(() => {
  const norm=v=>String(v??'').replace(/\s+/g,' ').trim().toUpperCase();
  const codeHead={1:'(1918 ou 1919)',2:'(1916 ou 1917)',3:'(1827)'};

  function sold(c,n){
    const g=(c?.grupos||[]).find(x=>String(x?.grupo)===String(n));
    return !!g?.vendido;
  }
  function cell(c,n){
    const ok=sold(c,n);
    return `<td><span class="${ok?'gok':'gno'}">${ok?'✓ Vendeu':'✕ Falta'}</span></td>`;
  }
  function head(){
    return '<thead><tr><th>#</th><th>Código PV</th><th>Razão Social</th>'+
      `<th>Grupo 1<br><small>${codeHead[1]}</small></th>`+
      `<th>Grupo 2<br><small>${codeHead[2]}</small></th>`+
      `<th>Grupo 3<br><small>${codeHead[3]}</small></th>`+
      '</tr></thead>';
  }
  function rows(list){
    if(!list.length)return '<tr><td colspan="6" class="empty">Nenhum cliente nesta situação.</td></tr>';
    return list.map((c,i)=>`<tr><td>${i+1}</td><td><b>${esc(c.cliente)}</b></td><td>${esc(c.razao)}</td>${cell(c,1)}${cell(c,2)}${cell(c,3)}</tr>`).join('');
  }

  function install(){
    if(typeof window.renderClients!=='function' || window.renderClients.__trioFastFix)return;
    const original=window.renderClients;
    const fast=function(cat){
      if(TAB!=='meu' || norm(cat)!=='TRIO PÃO DE QUEIJO') return original(cat);
      const row=(DATA?.own||[]).find(x=>norm(x.nome)==='TRIO PÃO DE QUEIJO');
      const all=row?.clientes||[];
      const complete=all.filter(x=>x.completo);
      const partial=all.filter(x=>!x.completo);
      $('clients').innerHTML=
        `<h3 class="clientsTitle">👥 Clientes cobertos (${complete.length})</h3>`+
        `<div class="tableWrap"><table>${head()}<tbody>${rows(complete)}</tbody></table></div>`+
        `<h3 class="clientsTitle">🟡 Clientes em andamento (${partial.length})</h3>`+
        `<div class="tableWrap"><table>${head()}<tbody>${rows(partial)}</tbody></table></div>`;
    };
    fast.__trioFastFix=true;
    window.renderClients=fast;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
