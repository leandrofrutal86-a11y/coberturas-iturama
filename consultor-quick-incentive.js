(()=>{
'use strict';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let busy=false,last='';
function css(){if(document.getElementById('qicStyle'))return;const s=document.createElement('style');s.id='qicStyle';s.textContent=`
#quickIncentiveConsultor{width:min(1180px,calc(100% - 18px));margin:14px auto 20px;background:#fff;border-radius:18px;padding:15px;box-shadow:0 5px 16px #172b400e}
.qicHead{display:flex;justify-content:space-between;gap:10px;align-items:end}.qicHead h2{margin:0}.qicPeriod{font-size:11px;font-weight:800;color:#667585}
.qicBlock{margin-top:12px;border:1px solid #dce3e9;border-radius:14px;overflow:hidden}.qicTitle{background:linear-gradient(135deg,#e30613,#8c0007);color:#fff;padding:12px 14px}.qicTitle b{font-size:17px}.qicTitle small{display:block;margin-top:3px}
.qicWrap{overflow:auto}.qicTable{width:100%;border-collapse:collapse;min-width:560px}.qicTable th,.qicTable td{padding:10px;border-bottom:1px solid #e8edf1;text-align:center}.qicTable th:first-child,.qicTable td:first-child{text-align:left}.qicTable th{background:#f4f7f9}.qicGood{color:#087249;font-weight:900}.qicBad{color:#c8151d;font-weight:900}
@media(max-width:600px){#quickIncentiveConsultor{width:calc(100% - 10px);padding:10px}.qicHead{display:block}.qicTable{min-width:520px}.qicTable th,.qicTable td{font-size:11px;padding:8px 6px}}
`;document.head.appendChild(s)}
function host(){let h=document.getElementById('quickIncentiveConsultor');if(h)return h;const home=document.getElementById('consultorModernHome')||document.querySelector('#dash main');if(!home)return null;h=document.createElement('section');h.id='quickIncentiveConsultor';h.hidden=true;home.parentNode.insertBefore(h,home.nextSibling);return h}
function render(j){css();const h=host();if(!h)return;const items=j?.items||[];if(!items.length){h.hidden=true;return}h.hidden=false;h.innerHTML='<div class="qicHead"><div><h2>⚡ Acompanhamento Rápido</h2><div class="qicPeriod">Seu acompanhamento • somente sua rota</div></div><b>Rota '+E(j.rota||'')+'</b></div>'+items.map(inc=>'<div class="qicBlock"><div class="qicTitle"><b>'+E(inc.nome)+'</b><small>'+E(inc.data_inicio)+' até '+E(inc.data_fim)+'</small></div><div class="qicWrap"><table class="qicTable"><thead><tr><th>Categoria</th><th>Meta</th><th>Real</th><th>Falta</th><th>%</th></tr></thead><tbody>'+(inc.categorias||[]).map(r=>{const ok=Number(r.meta)>0&&Number(r.realizado)>=Number(r.meta);return '<tr><td><b>'+E(r.nome)+'</b></td><td>'+Number(r.meta||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.realizado||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.falta||0)+'</td><td class="'+(ok?'qicGood':'qicBad')+'">'+Number(r.percentual||0)+'%</td></tr>'}).join('')+'</tbody></table></div></div>').join('')}
async function load(force=false){
 if(busy||typeof api!=='function')return;busy=true;try{const j=await api('quick_incentives');const sig=JSON.stringify(j);if(force||sig!==last){last=sig;render(j)}}catch(e){const h=host();if(h)h.hidden=true}finally{busy=false}
}
window.addEventListener('iturama:dashboard-ready',()=>setTimeout(()=>load(true),150));
window.addEventListener('pageshow',()=>setTimeout(()=>load(true),500));
setInterval(()=>{try{if(typeof TOKEN!=='undefined'&&TOKEN)load(false)}catch{}},10000);
})();