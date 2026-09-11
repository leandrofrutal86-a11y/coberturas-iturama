/* Trio Pão de Queijo — renderização direta e responsiva. */
(() => {
  const norm=v=>String(v??'').replace(/\s+/g,' ').trim().toUpperCase();
  const codeHead={1:'(1918 ou 1919)',2:'(1916 ou 1917)',3:'(1827)'};
  const labels={1:'Coca Ref',2:'Coca LS',3:'Fanta Ref'};

  function addStyle(){
    if(document.getElementById('trioMobileStyle'))return;
    const st=document.createElement('style');st.id='trioMobileStyle';
    st.textContent=`
#clients .trioTableWrap{width:100%;max-width:100%;overflow:hidden;border:1px solid #d9e1e7;border-radius:12px;margin-top:8px}
#clients .trioTable{width:100%;max-width:100%;min-width:0!important;table-layout:fixed;border-collapse:collapse;margin:0}
#clients .trioTable th,#clients .trioTable td{box-sizing:border-box;border-bottom:1px solid #e1e7ec;border-right:1px solid #e1e7ec;vertical-align:middle;overflow:hidden}
#clients .trioTable th:last-child,#clients .trioTable td:last-child{border-right:0}
#clients .trioTable th{background:#c90817;color:#fff;font-weight:900;text-align:center}
#clients .trioTable tbody tr:nth-child(odd) td{background:#fff}#clients .trioTable tbody tr:nth-child(even) td{background:#eaf4fb}
#clients .trioTable th:nth-child(1),#clients .trioTable td:nth-child(1){width:5%;text-align:center;border-right:1px solid #8997a3}
#clients .trioTable th:nth-child(2),#clients .trioTable td:nth-child(2){width:16%;text-align:left}
#clients .trioTable th:nth-child(3),#clients .trioTable td:nth-child(3){width:29%;text-align:left}
#clients .trioTable th:nth-child(4),#clients .trioTable td:nth-child(4){width:18%;text-align:center}
#clients .trioTable th:nth-child(5),#clients .trioTable td:nth-child(5){width:18%;text-align:center}
#clients .trioTable th:nth-child(6),#clients .trioTable td:nth-child(6){width:14%;text-align:center}
@media(max-width:760px){
#clients{width:100%;max-width:100%;overflow:hidden}.clientsTitle{font-size:16px!important;margin:12px 0 6px!important}
#clients .trioTableWrap{box-sizing:border-box;width:100%!important;max-width:100%!important;overflow:hidden!important}
#clients .trioTable{width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important}
#clients .trioTable th{font-size:7.4px!important;line-height:1.08!important;padding:6px 1px!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important}
#clients .trioTable th small{font-size:6.4px!important;line-height:1!important}
#clients .trioTable td{font-size:7.2px!important;line-height:1.1!important;padding:5px 2px!important;white-space:normal!important;overflow-wrap:break-word!important;word-break:normal!important}
#clients .trioTable td:nth-child(2){font-size:7px!important;font-weight:900!important;white-space:nowrap!important;padding-left:2px!important}
#clients .trioTable td:nth-child(3){font-size:6.8px!important;padding-left:2px!important}
#clients .trioTable .gok,#clients .trioTable .gno{display:inline-flex!important;align-items:center!important;justify-content:center!important;max-width:100%!important;padding:3px 2px!important;border-radius:999px!important;font-size:6.2px!important;line-height:1!important;font-weight:900!important;white-space:nowrap!important}
#clients .trioTable .empty{font-size:10px!important;padding:12px 2px!important;text-align:center!important}
}`;
    document.head.appendChild(st);
  }
  function sold(c,n){const g=(c?.grupos||[]).find(x=>String(x?.grupo)===String(n));return !!g?.vendido;}
  function cell(c,n){const ok=sold(c,n);return `<td><span class="${ok?'gok':'gno'}">${ok?'✓ Vendeu':'✕ Falta'}</span></td>`;}
  function head(){return '<thead><tr><th>#</th><th>Código PV</th><th>Razão Social</th>'+[1,2,3].map(n=>`<th>${labels[n]}<br><small>${codeHead[n]}</small></th>`).join('')+'</tr></thead>';}
  function rows(list){if(!list.length)return '<tr><td colspan="6" class="empty">Nenhum cliente nesta situação.</td></tr>';return list.map((c,i)=>`<tr><td>${i+1}</td><td><b>${esc(c.cliente)}</b></td><td>${esc(c.razao)}</td>${cell(c,1)}${cell(c,2)}${cell(c,3)}</tr>`).join('');}
  function block(title,list){return `${title}<div class="tableWrap trioTableWrap"><table class="trioTable">${head()}<tbody>${rows(list)}</tbody></table></div>`;}
  function install(){addStyle();if(typeof window.renderClients!=='function'||window.renderClients.__trioFastFix)return;const original=window.renderClients;const fast=function(cat){if(TAB!=='meu'||norm(cat)!=='TRIO PÃO DE QUEIJO')return original(cat);const row=(DATA?.own||[]).find(x=>norm(x.nome)==='TRIO PÃO DE QUEIJO');const all=row?.clientes||[];const complete=all.filter(x=>x.completo),partial=all.filter(x=>!x.completo);$('clients').innerHTML=block(`<h3 class="clientsTitle">👥 Clientes cobertos (${complete.length})</h3>`,complete)+block(`<h3 class="clientsTitle">🟡 Clientes em andamento (${partial.length})</h3>`,partial);};fast.__trioFastFix=true;window.renderClients=fast;}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
