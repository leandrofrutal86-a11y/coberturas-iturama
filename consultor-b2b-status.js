(()=>{
const N=v=>String(v??'').trim().toUpperCase(),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let busy=false;
function update(){if(busy)return;const area=document.getElementById('clients'),sel=document.getElementById('cat');if(!area||!sel||N(sel.value)!=='COMPRA B2B'||typeof DATA==='undefined'||typeof TAB==='undefined'||TAB!=='meu')return;
const cr=(DATA.own||[]).find(x=>N(x.nome)==='COMPRA B2B'),rr=(DATA.own||[]).find(x=>N(x.nome)==='RECOMPRA B2B');if(!cr)return;
const bought=(cr.clientes||[]).filter(x=>x.completo!==false),map=new Map((rr?.clientes||[]).map(x=>[String(x.cliente||x.pv||'').trim(),x]));
const sig=bought.map(x=>{const y=map.get(String(x.cliente||x.pv||'').trim());return String(x.cliente)+':'+String(y?.completo)+':'+String(y?.compras)}).join('|');
if(area.dataset.b2bSig===sig&&area.querySelector('.b2bStatusList'))return;
busy=true;try{area.innerHTML='<div class="b2bStatusList"><h3>🛒 Clientes com Compra B2B ('+bought.length+')</h3><div style="width:100%;overflow-x:auto"><table style="width:100%;min-width:0;table-layout:auto"><thead><tr><th>PV</th><th>Cliente</th><th>Recompra</th></tr></thead><tbody>'+bought.map(x=>{const y=map.get(String(x.cliente||x.pv||'').trim()),done=!!y&&(y.completo===true||Number(y.compras||0)>=2);return '<tr><td style="white-space:normal;overflow-wrap:anywhere">'+E(x.cliente)+'</td><td style="white-space:normal;overflow-wrap:anywhere;min-width:120px">'+E(x.razao)+'</td><td style="white-space:normal;min-width:110px;font-weight:800;color:'+(done?'#087a49':'#b42323')+'">'+(done?'🔁 Recompra realizada':'✕ Falta recompra')+'</td></tr>'}).join('')+'</tbody></table></div></div>';area.dataset.b2bSig=sig}finally{busy=false}}
function boot(){const a=document.getElementById('clients');if(!a){setTimeout(boot,250);return}new MutationObserver(update).observe(a,{childList:true,subtree:false});document.getElementById('cat')?.addEventListener('change',()=>setTimeout(update,30));setInterval(update,1500);update()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();