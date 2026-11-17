(()=>{
'use strict';
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={items:[],categorias:[],consultores:[]},editing=null;

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
.qiaCats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:8px}
.qiaCat{border:1px solid #dce3e9;border-radius:10px;padding:9px;background:#fff;display:flex;gap:8px;align-items:center}
.qiaTableWrap{overflow:auto;border:1px solid #dce3e9;border-radius:12px;margin-top:10px}.qiaTable{width:100%;border-collapse:collapse;min-width:720px}.qiaTable th,.qiaTable td{padding:9px;border-bottom:1px solid #e9edf1;text-align:center}.qiaTable th:first-child,.qiaTable td:first-child{text-align:left}.qiaTable input{width:78px;text-align:center}
.qiaList{display:grid;gap:8px;margin-top:12px}.qiaItem{border:1px solid #dce3e9;border-radius:12px;padding:10px;display:flex;justify-content:space-between;gap:10px;align-items:center;background:#fafcfd}.qiaBadge{font-size:10px;font-weight:900;border-radius:999px;padding:4px 7px;background:#eaf4fb}
@media(max-width:760px){.qiaGrid{grid-template-columns:1fr}.qiaCats{grid-template-columns:1fr}.qiaItem{display:block}.qiaItem .action{margin-top:8px}}
`;document.head.appendChild(s)
}
function selectedCats(){return [...document.querySelectorAll('#qiaCats input:checked')].map(x=>Number(x.value))}
function renderGoals(){
 const host=$('qiaGoals');if(!host)return;const cats=selectedCats();
 if(!cats.length){host.innerHTML='<div class="small">Selecione as categorias acima para informar as metas.</div>';return}
 const current=editing?.metas||[];
 host.innerHTML='<div class="qiaTableWrap"><table class="qiaTable"><thead><tr><th>Consultor / Rota</th>'+cats.map(id=>'<th>'+E(state.categorias.find(c=>Number(c.id)===id)?.nome||id)+'</th>').join('')+'</tr></thead><tbody>'+state.consultores.map(c=>'<tr><td><b>'+E(c.rota)+'</b> - '+E(c.nome)+'</td>'+cats.map(id=>{const m=current.find(x=>Number(x.categoria_id)===id&&String(x.rota)===String(c.rota));return '<td><input type="number" min="0" step="1" data-meta-cat="'+id+'" data-meta-rota="'+E(c.rota)+'" value="'+Number(m?.meta||0)+'"></td>'}).join('')+'</tr>').join('')+'</tbody></table></div>'
}
function renderCats(){
 const host=$('qiaCats');if(!host)return;const chosen=new Set((editing?.categorias||[]).map(x=>Number(x.categoria_id)));
 host.innerHTML=state.categorias.map(c=>'<label class="qiaCat"><input type="checkbox" value="'+c.id+'" '+(chosen.has(Number(c.id))?'checked':'')+'> <span>'+E(c.nome)+'</span></label>').join('');
 host.querySelectorAll('input').forEach(x=>x.onchange=renderGoals);renderGoals()
}
function clearForm(){
 editing=null;$('qiaId').value='';$('qiaNome').value='';$('qiaIni').value='';$('qiaFim').value='';$('qiaAtivo').checked=true;renderCats();$('qiaStatus').textContent=''
}
function edit(id){
 editing=state.items.find(x=>Number(x.id)===Number(id))||null;if(!editing)return;
 $('qiaId').value=editing.id;$('qiaNome').value=editing.nome||'';$('qiaIni').value=String(editing.data_inicio||'').slice(0,10);$('qiaFim').value=String(editing.data_fim||'').slice(0,10);$('qiaAtivo').checked=editing.ativo!==false;renderCats();$('qiaStatus').textContent='Editando '+editing.nome;window.scrollTo({top:0,behavior:'smooth'})
}
function renderList(){
 const h=$('qiaList');if(!h)return;
 h.innerHTML=state.items.length?state.items.map(x=>'<div class="qiaItem"><div><b>'+E(x.nome)+'</b><div class="small">'+E(String(x.data_inicio).slice(0,10))+' até '+E(String(x.data_fim).slice(0,10))+' • '+(x.categorias||[]).length+' categoria(s) • <span class="qiaBadge">'+(x.ativo?'ATIVO':'INATIVO')+'</span></div></div><div class="action"><button type="button" data-edit="'+x.id+'">EDITAR</button><button type="button" data-del="'+x.id+'" style="background:#fff0f0;color:#b40000">EXCLUIR</button></div></div>').join(''):'<div class="small">Nenhum incentivo rápido criado.</div>';
 h.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));h.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(b.dataset.del))
}
async function load(){
 const j=await post('quick_incentives_admin_list');state=j;renderList();if(!editing)renderCats()
}
async function save(){
 const st=$('qiaStatus');st.className='small';st.textContent='Salvando...';
 try{
  const cats=selectedCats(),metas=[];
  document.querySelectorAll('#qiaGoals [data-meta-cat]').forEach(i=>metas.push({categoria_id:Number(i.dataset.metaCat),rota:i.dataset.metaRota,meta:Number(i.value||0)}));
  await post('quick_incentive_save',{item:{id:$('qiaId').value?Number($('qiaId').value):null,nome:$('qiaNome').value.trim(),data_inicio:$('qiaIni').value,data_fim:$('qiaFim').value,ativo:$('qiaAtivo').checked,categorias:cats,metas}});
  st.className='ok';st.textContent='Incentivo rápido salvo.';editing=null;await load();clearForm()
 }catch(e){st.className='bad';st.textContent=e.message}
}
async function del(id){if(!confirm('Excluir este incentivo rápido?'))return;try{await post('quick_incentive_delete',{id:Number(id)});if(Number(editing?.id)===Number(id))editing=null;await load();clearForm()}catch(e){$('qiaStatus').className='bad';$('qiaStatus').textContent=e.message}}
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
   const card=document.createElement('button');card.id='qiaHomeCard';card.type='button';card.className='menuCard';card.innerHTML='<span class="mi" style="background:#ff8a00">⚡</span><span><b>Incentivo Rápido</b><small>Criar acompanhamento por período, categoria e meta</small></span>';card.onclick=()=>open(b);metasGrid.appendChild(card)
 }
 const sec=document.createElement('section');sec.id='quickIncentiveAdmin';sec.className='hide';sec.innerHTML=`
 <div class="box">
  <h2>⚡ Acompanhamento Rápido de Incentivo</h2>
  <p class="small">Crie um acompanhamento separado das metas mensais. O realizado considera somente as vendas do período informado.</p>
  <input id="qiaId" type="hidden">
  <div class="qiaGrid"><div><label>Nome do incentivo</label><input id="qiaNome" placeholder="Ex.: Desafio Estrella 16 a 19/11"></div><div><label>Data inicial</label><input id="qiaIni" type="date"></div><div><label>Data final</label><input id="qiaFim" type="date"></div></div>
  <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-weight:800"><input id="qiaAtivo" type="checkbox" checked style="width:auto"> Exibir para os consultores</label>
  <h3 style="margin-bottom:5px">Categorias do incentivo</h3><div id="qiaCats" class="qiaCats"></div>
  <h3 style="margin-bottom:5px">Metas por consultor</h3><div id="qiaGoals"></div>
  <div class="action" style="margin-top:12px"><button id="qiaSave" class="red" type="button">SALVAR INCENTIVO</button><button id="qiaNew" type="button">NOVO</button></div><div id="qiaStatus" class="small" style="margin-top:8px"></div>
  <hr style="margin:18px 0;border:0;border-top:1px solid #e1e7ec"><h3>Incentivos rápidos criados</h3><div id="qiaList" class="qiaList"></div>
 </div>`;wrap.appendChild(sec);$('qiaSave').onclick=save;$('qiaNew').onclick=clearForm;
 const old=window.aba;if(typeof old==='function'&&!old.__quick){window.aba=function(){sec.classList.add('hide');return old.apply(this,arguments)};window.aba.__quick=true}
 const oldShow=window.show;if(typeof oldShow==='function'&&!oldShow.__quick){window.show=function(){sec.classList.add('hide');return oldShow.apply(this,arguments)};window.show.__quick=true}
 load().catch(()=>{});return true
}
let n=0;const t=setInterval(()=>{if(ensure()||++n>60)clearInterval(t)},200);
})();