(()=>{
'use strict';
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={items:[],consultores:[]},editing=null,draftCats=[];

async function post(action,body={}){
 const token=sessionStorage.getItem('admToken')||'';
 const r=await fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token,...body})});
 const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro');return j
}
function css(){
 if($('qiaStyle'))return;
 const s=document.createElement('style');s.id='qiaStyle';s.textContent=`
#quickIncentiveAdmin{background:#fff;border-radius:18px;padding:16px;margin-top:12px}
.qiaGrid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px}.qiaGrid input{width:100%}
.qiaCatCard{border:1px solid #dce3e9;border-radius:14px;padding:12px;margin-top:10px;background:#fafcfd}
.qiaCatTop{display:grid;grid-template-columns:1.5fr .8fr 1.6fr auto;gap:8px;align-items:end}.qiaCatTop input,.qiaCatTop select{width:100%}
.qiaTableWrap{overflow:auto;border:1px solid #dce3e9;border-radius:12px;margin-top:10px}.qiaTable{width:100%;border-collapse:collapse;min-width:720px}.qiaTable th,.qiaTable td{padding:9px;border-bottom:1px solid #e9edf1;text-align:center}.qiaTable th:first-child,.qiaTable td:first-child{text-align:left}.qiaTable input{width:78px;text-align:center}
.qiaList{display:grid;gap:8px;margin-top:12px}.qiaItem{border:1px solid #dce3e9;border-radius:12px;padding:10px;display:flex;justify-content:space-between;gap:10px;align-items:center;background:#fafcfd}.qiaBadge{font-size:10px;font-weight:900;border-radius:999px;padding:4px 7px;background:#eaf4fb}
.qiaRemove{background:#fff0f0!important;color:#b40000!important}
@media(max-width:760px){.qiaGrid,.qiaCatTop{grid-template-columns:1fr}.qiaItem{display:block}.qiaItem .action{margin-top:8px}}
`;document.head.appendChild(s)
}
function newCat(src=null){
 return src?{
  nome:src.nome||'',tipo:src.tipo||'codigo',
  valores:Array.isArray(src.valores)?src.valores.join(', '):'',
  metas:Object.fromEntries((src.metas||[]).map(m=>[String(m.rota),Number(m.meta||0)]))
 }:{nome:'',tipo:'codigo',valores:'',metas:{}}
}
function renderCats(){
 const host=$('qiaCats');if(!host)return;
 if(!draftCats.length){host.innerHTML='<div class="small">Nenhuma categoria criada ainda.</div>';return}
 host.innerHTML=draftCats.map((c,i)=>`
 <div class="qiaCatCard" data-qcat="${i}">
  <div class="qiaCatTop">
   <div><label>Nome da categoria</label><input data-field="nome" value="${E(c.nome)}" placeholder="Ex.: RGB"></div>
   <div><label>Criar por</label><select data-field="tipo"><option value="codigo" ${c.tipo==='codigo'?'selected':''}>Código</option><option value="marca" ${c.tipo==='marca'?'selected':''}>Marca</option></select></div>
   <div><label>Código(s) ou marca(s)</label><input data-field="valores" value="${E(c.valores)}" placeholder="Separe vários por vírgula"></div>
   <button type="button" class="qiaRemove" data-remove="${i}">EXCLUIR CATEGORIA</button>
  </div>
  <div class="qiaTableWrap"><table class="qiaTable"><thead><tr><th>Consultor / Rota</th><th>Meta</th></tr></thead><tbody>
   ${state.consultores.map(x=>'<tr><td><b>'+E(x.rota)+'</b> - '+E(x.nome)+'</td><td><input type="number" min="0" step="1" data-meta-rota="'+E(x.rota)+'" value="'+Number(c.metas?.[x.rota]||0)+'"></td></tr>').join('')}
  </tbody></table></div>
 </div>`).join('');
 host.querySelectorAll('[data-qcat]').forEach(card=>{
  const i=Number(card.dataset.qcat);
  card.querySelectorAll('[data-field]').forEach(inp=>inp.oninput=()=>{draftCats[i][inp.dataset.field]=inp.value});
  card.querySelectorAll('[data-meta-rota]').forEach(inp=>inp.oninput=()=>{draftCats[i].metas[inp.dataset.metaRota]=Number(inp.value||0)});
 });
 host.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{draftCats.splice(Number(b.dataset.remove),1);renderCats()})
}
function clearForm(){
 editing=null;draftCats=[];$('qiaId').value='';$('qiaNome').value='';$('qiaIni').value='';$('qiaFim').value='';$('qiaAtivo').checked=true;renderCats();$('qiaStatus').textContent=''
}
function edit(id){
 editing=state.items.find(x=>Number(x.id)===Number(id))||null;if(!editing)return;
 draftCats=(editing.categorias||[]).map(newCat);
 $('qiaId').value=editing.id;$('qiaNome').value=editing.nome||'';$('qiaIni').value=String(editing.data_inicio||'').slice(0,10);$('qiaFim').value=String(editing.data_fim||'').slice(0,10);$('qiaAtivo').checked=editing.ativo!==false;renderCats();$('qiaStatus').textContent='Editando '+editing.nome;window.scrollTo({top:0,behavior:'smooth'})
}
function renderList(){
 const h=$('qiaList');if(!h)return;
 h.innerHTML=state.items.length?state.items.map(x=>'<div class="qiaItem"><div><b>'+E(x.nome)+'</b><div class="small">'+E(String(x.data_inicio).slice(0,10))+' até '+E(String(x.data_fim).slice(0,10))+' • '+(x.categorias||[]).length+' categoria(s) • <span class="qiaBadge">'+(x.ativo?'ATIVO':'INATIVO')+'</span></div></div><div class="action"><button type="button" data-edit="'+x.id+'">EDITAR</button><button type="button" data-del="'+x.id+'" class="qiaRemove">EXCLUIR INCENTIVO RÁPIDO</button></div></div>').join(''):'<div class="small">Nenhum incentivo rápido criado.</div>';
 h.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));h.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(b.dataset.del))
}
async function load(){
 state=await post('quick_incentives_admin_list');renderList();if(!editing)renderCats()
}
async function save(){
 const st=$('qiaStatus');st.className='small';st.textContent='Salvando...';
 try{
  const categorias=draftCats.map(c=>({
   nome:String(c.nome||'').trim(),
   tipo:c.tipo==='marca'?'marca':'codigo',
   valores:String(c.valores||'').split(',').map(x=>x.trim()).filter(Boolean),
   metas:state.consultores.map(x=>({rota:x.rota,meta:Number(c.metas?.[x.rota]||0)}))
  }));
  await post('quick_incentive_save',{item:{id:$('qiaId').value?Number($('qiaId').value):null,nome:$('qiaNome').value.trim(),data_inicio:$('qiaIni').value,data_fim:$('qiaFim').value,ativo:$('qiaAtivo').checked,categorias}});
  st.className='ok';st.textContent='Incentivo rápido salvo.';editing=null;await load();clearForm()
 }catch(e){st.className='bad';st.textContent=e.message}
}
async function del(id){
 if(!confirm('Excluir este incentivo rápido? Ele deixará de aparecer para todos os consultores e na visão da equipe.'))return;
 try{await post('quick_incentive_delete',{id:Number(id)});if(Number(editing?.id)===Number(id))editing=null;await load();clearForm()}catch(e){$('qiaStatus').className='bad';$('qiaStatus').textContent=e.message}
}
function open(btn){
 document.querySelectorAll('#app .wrap>section').forEach(x=>x.classList.add('hide'));
 const sec=$('quickIncentiveAdmin');sec.classList.remove('hide');
 document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('on'));btn?.classList.add('on');load().catch(e=>{$('qiaStatus').className='bad';$('qiaStatus').textContent=e.message})
}
window.openQuickIncentiveAdmin=open;
function ensure(){
 css();if($('quickIncentiveAdmin'))return true;const tabs=document.querySelector('.tabs'),wrap=document.querySelector('#app>.wrap');if(!tabs||!wrap)return false;
 const b=document.createElement('button');b.type='button';b.textContent='⚡ Incentivo Rápido';b.onclick=()=>open(b);tabs.appendChild(b);
 const metasGrid=document.querySelector('#cokeHome .topicMetas .menuGrid');
 if(metasGrid&&!document.getElementById('qiaHomeCard')){
   const card=document.createElement('button');card.id='qiaHomeCard';card.type='button';card.className='menuCard';card.innerHTML='<span class="mi" style="background:#ff8a00">⚡</span><span><b>Incentivo Rápido</b><small>Criar categorias por código ou marca e definir período/meta</small></span>';card.onclick=()=>open(b);metasGrid.appendChild(card)
 }
 const sec=document.createElement('section');sec.id='quickIncentiveAdmin';sec.className='hide';sec.innerHTML=`
 <div class="box">
  <h2>⚡ Acompanhamento Rápido de Incentivo</h2>
  <p class="small">Crie categorias próprias deste incentivo, por código ou marca. Não utiliza as categorias mensais prontas do ADM.</p>
  <input id="qiaId" type="hidden">
  <div class="qiaGrid"><div><label>Nome do incentivo</label><input id="qiaNome" placeholder="Ex.: Desafio Estrella"></div><div><label>Data inicial</label><input id="qiaIni" type="date"></div><div><label>Data final</label><input id="qiaFim" type="date"></div></div>
  <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-weight:800"><input id="qiaAtivo" type="checkbox" checked style="width:auto"> Exibir para os consultores e Visão da Equipe</label>
  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:15px"><h3 style="margin:0">Categorias do incentivo rápido</h3><button id="qiaAddCat" type="button">+ CRIAR CATEGORIA</button></div>
  <div id="qiaCats"></div>
  <div class="action" style="margin-top:12px"><button id="qiaSave" class="red" type="button">SALVAR INCENTIVO</button><button id="qiaNew" type="button">NOVO</button></div><div id="qiaStatus" class="small" style="margin-top:8px"></div>
  <hr style="margin:18px 0;border:0;border-top:1px solid #e1e7ec"><h3>Incentivos rápidos criados</h3><div id="qiaList" class="qiaList"></div>
 </div>`;wrap.appendChild(sec);$('qiaSave').onclick=save;$('qiaNew').onclick=clearForm;$('qiaAddCat').onclick=()=>{draftCats.push(newCat());renderCats()};
 const old=window.aba;if(typeof old==='function'&&!old.__quick){window.aba=function(){sec.classList.add('hide');return old.apply(this,arguments)};window.aba.__quick=true}
 const oldShow=window.show;if(typeof oldShow==='function'&&!oldShow.__quick){window.show=function(){sec.classList.add('hide');return oldShow.apply(this,arguments)};window.show.__quick=true}
 load().catch(()=>{});return true
}
let n=0;const t=setInterval(()=>{if(ensure()||++n>60)clearInterval(t)},200);
})();