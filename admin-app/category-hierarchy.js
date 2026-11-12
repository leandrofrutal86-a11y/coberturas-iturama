(()=>{
'use strict';
const CFGAPI='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-config-api';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const q=id=>document.getElementById(id);
async function post(x){
 const r=await fetch(CFGAPI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(x)});
 const j=await r.json();if(!r.ok||j.error)throw Error(j.error||'Erro');return j
}
function currentCat(){const id=Number(q('cmId')?.value||0);return config?.categorias?.find(x=>Number(x.id)===id)||null}
function selectedChildren(){return [...document.querySelectorAll('#cmHierarchyChildren input[type=checkbox]:checked')].map(x=>Number(x.value)).filter(Boolean)}
function renderChildren(){
 const box=q('cmHierarchyChildren');if(!box)return;
 const id=Number(q('cmId')?.value||0),cats=(config?.categorias||[]).filter(c=>Number(c.id)!==id&&!c.is_principal);
 const chosen=new Set((config?.categorias||[]).filter(c=>Number(c.categoria_principal_id)===id).map(c=>Number(c.id)));
 box.innerHTML=cats.length?cats.map(c=>'<label style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #e2e8f0;border-radius:10px;background:#fff"><input type="checkbox" value="'+c.id+'" '+(chosen.has(Number(c.id))?'checked':'')+'> <span>'+E(c.nome)+'</span></label>').join(''):'<p class="small">Nenhuma categoria normal disponível.</p>';
}
function sync(){
 const principal=q('cmKind')?.value==='principal';
 ['cmRuleArea','cmPlacementArea','cmExcludeArea','cmB2BPrevWrap'].forEach(id=>{const el=q(id);if(el)el.style.display=principal?'none':''});
 const h=q('cmHierarchyBox');if(h)h.style.display=principal?'block':'none';
 if(principal)renderChildren();
}
function installUi(){
 if(q('cmKind')||!q('cmName'))return false;
 const nameWrap=q('cmName').closest('.form2')||q('cmName').parentElement;
 const kind=document.createElement('div');
 kind.style.marginTop='12px';
 kind.innerHTML='<label>Tipo da categoria</label><select id="cmKind" onchange="cmHierarchySync()"><option value="categoria">Categoria normal</option><option value="principal">Categoria principal</option></select><p class="small">Principal: funciona como um grupo de incentivo e mostra dentro dela as categorias escolhidas.</p>';
 nameWrap.parentElement.insertBefore(kind,nameWrap.nextSibling);

 const mode=q('cmMode'); if(mode){
   const modeWrap=mode.parentElement; modeWrap.id='cmRuleArea';
   const builder=q('cmBuilder'); if(builder) modeWrap.appendChild(builder);
 }
 const pr=q('cmPriority'); if(pr){const wrap=pr.parentElement;wrap.id='cmPlacementArea'; const next=wrap.nextElementSibling;if(next&&next.classList.contains('action'))wrap.appendChild(next)}
 const ex=q('cmExclude');if(ex)ex.parentElement.id='cmExcludeArea';

 const visual=q('cmCardPreview')?.parentElement;
 const h=document.createElement('div');h.id='cmHierarchyBox';h.style.cssText='display:none;margin-top:12px;border:1px solid #bfd3e6;border-radius:14px;padding:12px;background:#f5f9fd';
 h.innerHTML='<h3 style="margin:0 0 8px">Categorias dentro da principal</h3><p class="small">Marque as categorias que fazem parte deste incentivo. Elas deixarão de aparecer soltas em Coberturas dos Incentivos e aparecerão somente dentro desta principal.</p><div id="cmHierarchyChildren" style="display:grid;gap:7px;max-height:320px;overflow:auto"></div>';
 if(visual)visual.parentElement.insertBefore(h,visual);
 else q('cmStatus')?.parentElement?.insertBefore(h,q('cmStatus'));

 window.cmHierarchySync=sync;
 return true;
}
function install(){
 if(!installUi())return;
 const oldNew=window.cmNewCategory,oldEdit=window.cmEditCategory,oldSave=window.cmSaveCategory;
 window.cmNewCategory=function(){oldNew?.();if(q('cmKind'))q('cmKind').value='categoria';sync()};
 window.cmEditCategory=async function(id){await oldEdit?.(id);const c=config?.categorias?.find(x=>Number(x.id)===Number(id));if(q('cmKind'))q('cmKind').value=c?.is_principal?'principal':'categoria';sync()};
 window.cmSaveCategory=async function(){
   if(q('cmKind')?.value!=='principal')return oldSave?.();
   const id=Number(q('cmId')?.value||0)||null,nome=String(q('cmName')?.value||'').trim();
   const st=q('cmStatus');if(!nome){st.className='bad';st.textContent='Informe o nome da categoria principal.';return}
   st.className='';st.textContent='Salvando categoria principal...';
   try{
     const r=await post({action:'save_category_full',token,id,nome,is_principal:true,subcategoria_ids:selectedChildren(),prioridade_acomp:Number(q('cmPriority')?.value||2),cor_card:window.cmGetVisualColor?.(id)||q('cmColor')?.value||'#e30613',tipo_regra:'simples',regras:[]});
     if(window.cmHasSelectedCardImage?.()){st.textContent='Principal salva. Enviando imagem...';await window.cmUploadSelectedCardImage(r.id)}
     st.className='ok';st.textContent='Categoria principal salva com as categorias escolhidas.';
     await carregarTudo();await window.cmEditCategory(r.id)
   }catch(e){st.className='bad';st.textContent=e.message}
 };
 const origRenderBase=window.renderBase;
 if(typeof origRenderBase==='function')window.renderBase=function(){origRenderBase();setTimeout(()=>{if(q('cmKind')){const c=currentCat();q('cmKind').value=c?.is_principal?'principal':'categoria';sync()}},30)};
 window.cmNewCategory();
}
let tries=0;const timer=setInterval(()=>{tries++;if(typeof window.cmEditCategory==='function'&&typeof window.cmSaveCategory==='function'&&q('cmName')){clearInterval(timer);install()}else if(tries>80)clearInterval(timer)},100);
})();