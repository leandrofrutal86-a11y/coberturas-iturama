(()=>{
'use strict';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let busy=false,last='';
function css(){if(document.getElementById('qicStyle'))return;const s=document.createElement('style');s.id='qicStyle';s.textContent=`
#quickIncentiveConsultor{width:min(1180px,calc(100% - 18px));margin:14px auto 20px;background:#fff;border-radius:18px;padding:15px;box-shadow:0 5px 16px #172b400e}
.qicHead{display:flex;justify-content:space-between;gap:10px;align-items:end}.qicHead h2{margin:0}.qicPeriod{font-size:11px;font-weight:800;color:#667585}
.qicBlock{margin-top:12px;border:1px solid #dce3e9;border-radius:14px;overflow:hidden}.qicTitle{background:linear-gradient(135deg,#e30613,#8c0007);color:#fff;padding:12px 14px}.qicTitle b{font-size:17px}.qicTitle small{display:block;margin-top:3px}
.qicWrap{overflow:auto}.qicTable{width:100%;border-collapse:collapse;min-width:560px}.qicTable th,.qicTable td{padding:10px;border-bottom:1px solid #e8edf1;text-align:center}.qicTable th:first-child,.qicTable td:first-child{text-align:left}.qicTable th{background:#f4f7f9}.qicGood{color:#087249;font-weight:900}.qicBad{color:#c8151d;font-weight:900}.qicListBtn{padding:6px 9px;border:0;border-radius:8px;background:#111827;color:#fff;font-size:11px;font-weight:900}.qicOverlay{position:fixed;inset:0;z-index:250;background:#0009;display:none;align-items:center;justify-content:center;padding:12px}.qicOverlay.open{display:flex}.qicSheet{width:min(760px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:#fff;border-radius:16px}.qicTop{position:sticky;top:0;background:#fff;display:flex;justify-content:space-between;gap:8px;align-items:center;padding:12px;border-bottom:1px solid #e5e7eb}.qicBody{padding:10px}.qicClient{border:1px solid #e2e8f0;border-radius:10px;padding:10px;margin-bottom:8px}.qicClient b{display:block}.qicClient small{display:block;color:#64748b;margin-top:3px}
@media(max-width:600px){#quickIncentiveConsultor{width:calc(100% - 10px);padding:10px}.qicHead{display:block}.qicTable{min-width:520px}.qicTable th,.qicTable td{font-size:11px;padding:8px 6px}}
`;document.head.appendChild(s)}
function host(){
 let h=document.getElementById('quickIncentiveConsultor'),home=document.getElementById('consultorModernHome');
 if(!home)return null;
 if(h&&h.parentElement!==home){h.remove();h=null}
 if(!h){
   h=document.createElement('section');h.id='quickIncentiveConsultor';h.hidden=true;
   const anchor=home.querySelector('.cmActions')?.parentElement||home.lastElementChild;
   if(anchor&&anchor.parentElement===home)home.insertBefore(h,anchor.nextSibling);else home.appendChild(h)
 }
 return h
}
function openClients(title,clientes){
 let ov=document.getElementById('qicClientsOverlay');
 if(!ov){ov=document.createElement('div');ov.id='qicClientsOverlay';ov.className='qicOverlay';ov.innerHTML='<div class="qicSheet"><div class="qicTop"><div><b id="qicClientTitle">Clientes realizados</b><small id="qicClientCount"></small></div><button type="button" id="qicClientClose">Fechar</button></div><div id="qicClientBody" class="qicBody"></div></div>';document.body.appendChild(ov);document.getElementById('qicClientClose').onclick=()=>ov.classList.remove('open');ov.onclick=e=>{if(e.target===ov)ov.classList.remove('open')}}
 document.getElementById('qicClientTitle').textContent=title||'Clientes realizados';
 document.getElementById('qicClientCount').textContent=(clientes||[]).length+' cliente(s)';
 const body=document.getElementById('qicClientBody');
 body.innerHTML=(clientes||[]).length?(clientes||[]).map(x=>{
   const marca=(x.marcas||[]).length?'<small>Marca: '+E((x.marcas||[]).join(', '))+'</small>':'';
   const codigo=(x.materiais||[]).length?'<small>Código: '+E((x.materiais||[]).join(', '))+'</small>':'';
   const desc=(x.descricoes||[]).length?'<small>Produto: '+E((x.descricoes||[]).join(', '))+'</small>':'';
   return '<div class="qicClient"><b>'+E(x.pv)+' - '+E(x.razao||'Cliente')+'</b><small>Data: '+E(x.data||'')+'</small>'+marca+codigo+desc+'</div>'
 }).join(''):'<div class="qicClient">Nenhum cliente realizado.</div>';
 ov.classList.add('open')
}
function render(j){css();const h=host();if(!h)return;const items=j?.items||[];if(!items.length){h.hidden=true;return}h.hidden=false;h.innerHTML='<div class="qicHead"><div><h2>⚡ Acompanhamento Rápido</h2><div class="qicPeriod">Seu acompanhamento • somente sua rota</div></div><b>Rota '+E(j.rota||'')+'</b></div>'+items.map(inc=>'<div class="qicBlock"><div class="qicTitle"><b>'+E(inc.nome)+'</b><small>Período considerado: '+E(inc.data_inicio)+' até '+E(inc.data_fim)+'</small></div><div class="qicWrap"><table class="qicTable"><thead><tr><th>Categoria</th><th>Meta</th><th>Real</th><th>Falta</th><th>%</th></tr></thead><tbody>'+(inc.categorias||[]).map(r=>{const ok=Number(r.meta)>0&&Number(r.realizado)>=Number(r.meta);return '<tr><td><b>'+E(r.nome)+'</b><div style="margin-top:6px"><button type="button" class="qicListBtn" data-inc="'+E(inc.id)+'" data-item="'+E(r.item_id)+'">Listar clientes</button></div></td><td>'+Number(r.meta||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.realizado||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.falta||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.percentual||0)+'%</td></tr>'}).join('')+'</tbody></table></div></div>').join('');h.querySelectorAll('.qicListBtn').forEach(b=>b.onclick=()=>{const inc=items.find(x=>String(x.id)===String(b.dataset.inc)),row=inc?.categorias?.find(x=>String(x.item_id)===String(b.dataset.item));openClients((inc?.nome||'Incentivo')+' • '+(row?.nome||''),row?.clientes||[])})}
async function load(force=false){
 if(busy||typeof api!=='function')return;busy=true;
 try{
   const j=await api('quick_incentives'),sig=JSON.stringify(j);
   if(force||sig!==last){last=sig;render(j)}
 }catch(e){
   const h=host();
   if(h){css();h.hidden=false;h.innerHTML='<div class="qicHead"><div><h2>⚡ Acompanhamento Rápido</h2><div class="qicPeriod">Não foi possível carregar agora.</div></div></div><div class="qicBlock" style="padding:12px">'+E(e?.message||'Erro ao carregar incentivo rápido')+'</div>'}
 }finally{busy=false}
}
window.addEventListener('iturama:dashboard-ready',()=>setTimeout(()=>load(true),150));
window.addEventListener('pageshow',()=>setTimeout(()=>load(true),500));
const mo=new MutationObserver(()=>{if(document.getElementById('consultorModernHome')&&TOKEN&&!busy)setTimeout(()=>load(true),120)});mo.observe(document.documentElement,{childList:true,subtree:true});
setInterval(()=>{try{if(typeof TOKEN!=='undefined'&&TOKEN)load(false)}catch{}},10000);
})();