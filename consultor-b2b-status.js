(()=>{
const norm=v=>String(v??'').trim().toUpperCase();
function install(){if(typeof renderClients!=='function'||typeof DATA==='undefined'){setTimeout(install,200);return}if(renderClients.__b2bStatus)return;
const old=renderClients;
const f=function(cat){if(TAB!=='meu'||norm(cat)!=='COMPRA B2B')return old(cat);
const compra=(DATA?.own||[]).find(x=>norm(x.nome)==='COMPRA B2B');
const recompra=(DATA?.own||[]).find(x=>norm(x.nome)==='RECOMPRA B2B');
const all=(compra?.clientes||[]).filter(x=>x.completo!==false);
const byPv=new Map((recompra?.clientes||[]).map(x=>[String(x.cliente||x.pv||'').trim(),x]));
const rows=all.map(x=>{const y=byPv.get(String(x.cliente||x.pv||'').trim());const done=!!y&&(y.completo===true||Number(y.compras||0)>=2);return `<tr><td><b>${esc(x.cliente)}</b></td><td>${esc(x.razao)}</td><td style="font-weight:800;color:${done?'#087a49':'#b42323'}">${done?'🔁 Recompra realizada':'✕ Falta recompra'}</td></tr>`}).join('');
$('clients').innerHTML=`<h3>🛒 Clientes com Compra B2B (${all.length})</h3><div class="tableWrap"><table><thead><tr><th>PV</th><th>Cliente</th><th>Recompra</th></tr></thead><tbody>${rows||'<tr><td colspan="3">Nenhum cliente com compra B2B.</td></tr>'}</tbody></table></div>`;
};f.__b2bStatus=true;renderClients=f;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();