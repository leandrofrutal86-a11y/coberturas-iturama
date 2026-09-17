(()=>{
const PROJECT='harlrfhukjvhpufwhtep';
const APIS=[`https://${PROJECT}.supabase.co/functions/v1/material-admin-api`,`https://${PROJECT}.functions.supabase.co/material-admin-api`];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const token=()=>sessionStorage.getItem('admToken')||'';

async function call(body){
  let last;
  for(const url of APIS){
    try{
      const ctrl=new AbortController();const to=setTimeout(()=>ctrl.abort(),12000);
      const r=await fetch(url+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify({...body,token:token()}),signal:ctrl.signal});
      clearTimeout(to);
      const j=await r.json().catch(()=>({}));
      if(r.ok&&!j.error)return j;
      last=new Error(j.error||('Erro '+r.status));
    }catch(e){last=e}
  }
  throw last||new Error('Falha ao atualizar faixa');
}
function msg(t,ok=true){const e=$('#mm2Status');if(e){e.textContent=t;e.className='mm2Status '+(ok?'ok':'bad')}}
function idOf(item){return Number(item.querySelector('[data-save]')?.dataset.save||item.querySelector('[data-title]')?.dataset.title||0)}
function metaOf(item,target){const id=idOf(item);return {action:'save_material_meta',id,nome:item.querySelector(`[data-title="${id}"]`)?.value||'',descricao:item.querySelector(`[data-desc="${id}"]`)?.value||'',faixa_id:Number(target||item.querySelector(`[data-faixa="${id}"]`)?.value||0)}}
function options(){const s=$('[data-faixa]');return s?s.innerHTML:''}
function ensureStyle(){if($('#mmBulkStyle'))return;const st=document.createElement('style');st.id='mmBulkStyle';st.textContent=`
.mmBulkBar{display:grid;grid-template-columns:auto auto minmax(220px,1fr) auto;gap:8px;align-items:center;padding:12px;margin:10px 0 14px;background:#fff7f7;border:1px solid #f0caca;border-radius:12px}.mmBulkBar button{white-space:nowrap}.mmBulkCheck{width:22px;height:22px;accent-color:#df1017;cursor:pointer;flex:0 0 auto}.mm2Item.mmBulkReady{grid-template-columns:34px 100px 1fr 180px 150px!important}.mmBulkMoveOne{background:#263746!important;color:#fff!important}.mmBulkCount{font-weight:900;color:#b40000;white-space:nowrap}@media(max-width:900px){.mmBulkBar{grid-template-columns:1fr 1fr}.mmBulkBar select,.mmBulkBar .mmBulkMove{grid-column:1/-1}.mm2Item.mmBulkReady{grid-template-columns:34px 78px 1fr!important}.mm2Item.mmBulkReady>div:nth-of-type(3),.mm2Item.mmBulkReady>div:nth-of-type(4){grid-column:3}}
`;document.head.appendChild(st)}
function updateCount(){const n=$$('.mmBulkCheck:checked').length;const c=$('#mmBulkCount');if(c)c.textContent=`${n} marcado(s)`}
function addToolbar(){const groups=$('#mm2Groups');if(!groups||$('#mmBulkBar'))return;const bar=document.createElement('div');bar.id='mmBulkBar';bar.className='mmBulkBar';bar.innerHTML=`<button class="mm2Btn light" id="mmBulkAll">☑ Marcar todos</button><button class="mm2Btn light" id="mmBulkNone">☐ Desmarcar</button><select id="mmBulkTarget" aria-label="Escolher nova faixa">${options()}</select><button class="mm2Btn mmBulkMove" id="mmBulkMove">MOVER SELECIONADOS</button><span class="mmBulkCount" id="mmBulkCount">0 marcado(s)</span>`;groups.parentElement.insertBefore(bar,groups);$('#mmBulkAll').onclick=()=>{$$('.mmBulkCheck').forEach(x=>x.checked=true);updateCount()};$('#mmBulkNone').onclick=()=>{$$('.mmBulkCheck').forEach(x=>x.checked=false);updateCount()};$('#mmBulkMove').onclick=moveSelected}
async function moveSelected(){const marked=$$('.mmBulkCheck:checked').map(x=>x.closest('.mm2Item')).filter(Boolean);if(!marked.length)return msg('Marque pelo menos um material.',false);const target=$('#mmBulkTarget')?.value;if(!target)return msg('Escolha a faixa de destino.',false);try{msg(`Movendo ${marked.length} material(is)...`);for(const item of marked)await call(metaOf(item,target));msg('Materiais movidos com sucesso.');$('#mm2Reload')?.click()}catch(e){msg(e?.message||'Falha ao mover materiais.',false)}}
async function moveOne(item){const id=idOf(item),target=item.querySelector(`[data-faixa="${id}"]`)?.value;if(!id||!target)return;try{msg('Atualizando faixa...');await call(metaOf(item,target));msg('Faixa alterada com sucesso.');$('#mm2Reload')?.click()}catch(e){msg(e?.message||'Falha ao alterar faixa.',false)}}
function enhanceItems(){$$('.mm2Item').forEach(item=>{if(item.classList.contains('mmBulkReady'))return;item.classList.add('mmBulkReady');const id=idOf(item);if(!id)return;const box=document.createElement('input');box.type='checkbox';box.className='mmBulkCheck';box.dataset.id=id;box.title='Marcar este material';box.onchange=updateCount;item.insertBefore(box,item.firstChild);const actions=item.querySelector('.mm2Actions');if(actions&&!actions.querySelector('.mmBulkMoveOne')){const b=document.createElement('button');b.className='mm2Btn mmBulkMoveOne';b.textContent='Trocar faixa';b.title='Mover este material para a faixa selecionada';b.onclick=()=>moveOne(item);actions.insertBefore(b,actions.firstChild)}});updateCount()}
function syncTarget(){const t=$('#mmBulkTarget'),o=options();if(t&&o&&t.innerHTML!==o){const v=t.value;t.innerHTML=o;if([...t.options].some(x=>x.value===v))t.value=v}}
function mount(){if(!$('#materiais')||!$('#mm2Groups'))return;ensureStyle();addToolbar();enhanceItems();syncTarget()}
new MutationObserver(()=>setTimeout(mount,40)).observe(document.documentElement,{childList:true,subtree:true});
setInterval(mount,700);mount();
})();