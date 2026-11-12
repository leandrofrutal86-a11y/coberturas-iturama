(()=>{
'use strict';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function D(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}
function css(){
 if(document.getElementById('cmHierarchyStyle'))return;
 const s=document.createElement('style');s.id='cmHierarchyStyle';s.textContent=`
.cmGroupCard{position:relative}.cmGroupCard .cmGroupCount{font-size:12px;font-weight:800;opacity:.82}
#cmGroupOverlay{position:fixed;inset:0;z-index:12000;background:#f3f6f8;overflow:auto;padding:18px;box-sizing:border-box}
#cmGroupOverlay[hidden]{display:none!important}
.cmGroupTop{max-width:1050px;margin:0 auto 14px;display:flex;align-items:center;gap:12px}
.cmGroupBack{border:0;border-radius:12px;padding:11px 15px;font-weight:900;background:#111827;color:#fff}
.cmGroupTitle{font-size:22px;font-weight:950;color:#111827}
.cmGroupGrid{max-width:1050px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.cmGroupChild{border:1px solid #d9e1e8;border-radius:16px;background:#fff;padding:14px;text-align:left;box-shadow:0 4px 14px rgba(15,23,42,.07);display:grid;grid-template-columns:68px 1fr auto;align-items:center;gap:12px}
.cmGroupChild img{width:68px;height:58px;object-fit:contain;border-radius:10px;background:#fff}
.cmGroupChild .fallback{width:68px;height:58px;border-radius:10px;display:grid;place-items:center;background:#eef2f7;font-size:25px}
.cmGroupChild b{display:block;font-size:15px;color:#111827}.cmGroupChild small{color:#64748b}.cmGroupChild .arr{font-size:26px;color:#64748b}
`;document.head.appendChild(s)
}
function ensureOverlay(){
 let o=document.getElementById('cmGroupOverlay');if(o)return o;
 o=document.createElement('section');o.id='cmGroupOverlay';o.hidden=true;document.body.appendChild(o);return o
}
function openGroup(g){
 const d=D(),o=ensureOverlay(),rows=d?.own||[];
 const children=(g.subcategorias||[]).map(ch=>{
   const row=rows.find(x=>String(x.nome)===String(ch.nome));
   const original=[...document.querySelectorAll('#consultorModernHome .cmCat')].find(b=>b.dataset.cat===ch.nome&&!b.dataset.groupPrincipal);
   const img=original?.querySelector('img')?.getAttribute('src')||row?.imagem_card_url||'';
   const meta=Number(row?.meta||0),real=Number(row?.realizado||0);
   return '<button type="button" class="cmGroupChild" data-child="'+E(ch.nome)+'">'+(img?'<img src="'+E(img)+'" alt="">':'<span class="fallback">🏆</span>')+'<span><b>'+E(ch.nome)+'</b><small><strong>Meta:</strong> '+meta+' <span style="opacity:.7">|</span> <strong>Real:</strong> '+real+'</small></span><span class="arr">›</span></button>'
 }).join('');
 o.innerHTML='<div class="cmGroupTop"><button type="button" class="cmGroupBack">← Voltar</button><div><div class="cmGroupTitle">'+E(g.nome)+'</div><small>Escolha uma categoria do incentivo</small></div></div><div class="cmGroupGrid">'+(children||'<p>Nenhuma categoria vinculada.</p>')+'</div>';
 o.hidden=false;o.scrollTo(0,0);
 o.querySelector('.cmGroupBack').onclick=()=>{o.hidden=true};
 o.querySelectorAll('.cmGroupChild').forEach(b=>b.onclick=()=>{const original=[...document.querySelectorAll('#consultorModernHome .cmCat')].find(x=>x.dataset.cat===b.dataset.child&&!x.dataset.groupPrincipal);o.hidden=true;original?.click()})
}
function apply(){
 css();const d=D(),home=document.getElementById('consultorModernHome'),car=home?.querySelector('.cmCarousel');if(!d||!home||!car)return;
 const groups=Array.isArray(d.incentivo_grupos)?d.incentivo_grupos:[];
 const childNames=new Set(groups.flatMap(g=>(g.subcategorias||[]).map(x=>String(x.nome))));
 home.querySelectorAll('.cmCat:not([data-group-principal])').forEach(b=>{b.style.display=childNames.has(String(b.dataset.cat))?'none':''});
 groups.forEach(g=>{
   let b=[...car.querySelectorAll('.cmCat[data-group-principal="1"]')].find(x=>x.dataset.groupId===String(g.id));
   if(!b){
     b=document.createElement('button');b.type='button';b.className='cmCat cmTheme-custom cmGroupCard';b.dataset.groupPrincipal='1';b.dataset.groupId=String(g.id);car.appendChild(b)
   }
   const color=String(g.cor_card||'#e30613');b.style.setProperty('--cm-custom',color);
   b.innerHTML='<span class="cmProd">'+(g.imagem_card_url?'<img loading="eager" decoding="async" referrerpolicy="no-referrer" data-fit="logo" src="'+E(g.imagem_card_url)+'" alt="">':'<span class="cmFallback">🏆</span>')+'</span><b>'+E(g.nome)+'</b><small class="cmGroupCount">'+(g.subcategorias||[]).length+' categoria(s)</small><span class="cmArrow">›</span>';
   b.onclick=()=>openGroup(g)
 });
 car.querySelectorAll('.cmCat[data-group-principal="1"]').forEach(b=>{if(!groups.some(g=>String(g.id)===b.dataset.groupId))b.remove()})
}
let sig='';setInterval(()=>{const d=D();const s=d?JSON.stringify([d.incentivo_grupos,(d.own||[]).map(x=>[x.nome,x.realizado,x.meta,x.imagem_card_url])]):'';if(s&&s!==sig){sig=s;setTimeout(apply,60)}else if(d?.incentivo_grupos?.length)apply()},700);
window.addEventListener('pageshow',()=>setTimeout(apply,600));
})();