(()=>{const d=document,API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/conteudos-consultor-api';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function list(tipo){const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'list_public',tipo})}),j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Não foi possível carregar.');return j.items||[]}
function sync(){const nav=d.getElementById('cvBottomNav'),dash=d.getElementById('dash');if(nav&&dash)nav.style.display=dash.classList.contains('hidden')?'none':'grid'}
function css(){if(d.getElementById('cvBottomStyle'))return;const s=d.createElement('style');s.id='cvBottomStyle';s.textContent=`
#dash .tools{display:none!important}#dash .wrap{padding-bottom:125px!important}
.cvBottomNav{position:fixed;left:0;right:0;bottom:0;z-index:12000;background:#fff;border-top:1px solid #dce3e9;box-shadow:0 -5px 18px #0002;display:none;grid-template-columns:repeat(4,1fr);padding:7px 8px calc(7px + env(safe-area-inset-bottom));gap:4px;pointer-events:auto!important}
.cvBottomNav button{appearance:none;-webkit-appearance:none;border:0;background:#fff;color:#41566b;padding:6px 3px;min-height:58px;border-radius:10px;font-size:10px;font-weight:850;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;touch-action:manipulation;pointer-events:auto!important}.cvBottomNav button:active{background:#e9eef2}.cvBottomNav .ico{font-size:22px;line-height:1}
.cvContentOverlay{display:none;position:fixed;inset:0;background:#0009;z-index:30000;padding:10px}.cvContentOverlay.show{display:flex;align-items:center;justify-content:center}.cvContentSheet{width:min(720px,100%);max-height:94dvh;overflow:auto;background:#f4f6f8;border-radius:18px}.cvContentTop{position:sticky;top:0;z-index:2;background:linear-gradient(135deg,#090909,#9f0000);color:#fff;display:flex;justify-content:space-between;align-items:center;padding:14px}.cvContentTop h2{margin:0;font-size:19px}.cvContentTop button{background:#fff;border:0;border-radius:9px;padding:9px 12px;font-weight:900}.cvContentBody{padding:12px 12px 90px}.cvContentCard{background:#fff;border-radius:14px;padding:13px;margin-bottom:10px}.cvContentCard h3{margin:0 0 7px}.cvContentCard p{white-space:pre-wrap;line-height:1.4;margin:0;color:#33485b}.cvContentCard img{width:100%;height:auto;border-radius:10px;margin-top:9px}
body.cvMenuOpen #cvBottomNav{visibility:hidden!important;pointer-events:none!important}
@media(min-width:760px){.cvBottomNav{left:50%;transform:translateX(-50%);width:min(760px,100%);border-radius:16px 16px 0 0}}@media(max-width:520px){.cvBottomNav button{font-size:9px}.cvBottomNav .ico{font-size:20px}}
`;d.head.appendChild(s)}
function build(){if(d.getElementById('cvBottomNav'))return;css();d.body.insertAdjacentHTML('beforeend','<nav id="cvBottomNav" class="cvBottomNav"><button type="button" data-a="acoes"><span class="ico">⚡</span><span>Ações Vigentes</span></button><button type="button" data-a="premios"><span class="ico">🏆</span><span>Premiações de Incentivos</span></button><button type="button" data-a="materiais"><span class="ico">📚</span><span>Materiais de Apoio</span></button><button type="button" data-a="telefones"><span class="ico">☎️</span><span>Telefones Úteis</span></button></nav><div id="cvContentOverlay" class="cvContentOverlay"><div class="cvContentSheet"><div class="cvContentTop"><h2 id="cvContentTitle"></h2><button type="button" id="cvContentClose">Fechar</button></div><div id="cvContentBody" class="cvContentBody"></div></div></div>');
 const nav=d.getElementById('cvBottomNav'),ov=d.getElementById('cvContentOverlay');
 d.getElementById('cvContentClose').addEventListener('click',()=>{ov.classList.remove('show');d.body.classList.remove('cvMenuOpen')});
 ov.addEventListener('click',e=>{if(e.target===ov){ov.classList.remove('show');d.body.classList.remove('cvMenuOpen')}});
 nav.querySelectorAll('button[data-a]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open(btn.dataset.a)}));
 sync();
}
async function open(a){
 if(a==='materiais'){
   d.body.classList.add('cvMenuOpen');
   try{if(typeof window.openMateriaisV2==='function'){window.openMateriaisV2();return}if(typeof window.openConsultorRecurso==='function'){window.openConsultorRecurso('materiais');return}}finally{setTimeout(()=>d.body.classList.remove('cvMenuOpen'),500)}
 }
 if(a==='telefones'){
   d.body.classList.add('cvMenuOpen');
   try{if(typeof window.openConsultorRecurso==='function'){window.openConsultorRecurso('telefones');return}}finally{setTimeout(()=>d.body.classList.remove('cvMenuOpen'),500)}
 }
 const tipo=a==='acoes'?'acoes_vigentes':'premiacoes_incentivos',title=a==='acoes'?'⚡ Ações Vigentes':'🏆 Premiações de Incentivos',ov=d.getElementById('cvContentOverlay'),body=d.getElementById('cvContentBody');
 d.getElementById('cvContentTitle').textContent=title;d.body.classList.add('cvMenuOpen');ov.classList.add('show');body.innerHTML='<div class="empty">Carregando...</div>';
 try{const items=await list(tipo);body.innerHTML=items.length?items.map(x=>'<article class="cvContentCard">'+(x.titulo?'<h3>'+E(x.titulo)+'</h3>':'')+(x.texto?'<p>'+E(x.texto)+'</p>':'')+(x.imagem_url?'<img src="'+E(x.imagem_url)+'" alt="'+E(x.titulo||title)+'">':'')+'</article>').join(''):'<div class="empty">Nenhuma informação cadastrada.</div>'}catch(e){body.innerHTML='<div class="empty">'+E(e.message)+'</div>'}
}
function boot(){build();sync()}if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot);else boot();setTimeout(build,300);setInterval(sync,700);
})();