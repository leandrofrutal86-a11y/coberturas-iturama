(()=>{
'use strict';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ensureCss(){
 if($('incentivePriorityAdminCss'))return;
 const s=document.createElement('style');s.id='incentivePriorityAdminCss';s.textContent=`
#incentivePriorityAdmin{background:#fff;border-radius:18px;padding:18px;box-shadow:0 5px 20px #0001}
#incentivePriorityAdmin h2{margin:0 0 8px}.ipaNote{background:#fff4e5;border-radius:12px;padding:12px;margin-bottom:14px;color:#4d4030}
.ipaRows{display:grid;gap:10px}.ipaRow{display:grid;grid-template-columns:minmax(180px,2fr) 110px 110px 110px;gap:9px;align-items:center;border:1px solid #dde5eb;border-radius:13px;padding:11px;background:#f9fbfc}
.ipaRow select,.ipaRow input{width:100%;padding:10px;border:1px solid #cbd5dd;border-radius:9px;background:#fff}.ipaActions{display:flex;gap:6px;flex-wrap:wrap}.ipaBtn{border:0;border-radius:9px;padding:9px 11px;font-weight:900;cursor:pointer}.ipaSave{background:#087d49;color:#fff}.ipaDelete{background:#e30613;color:#fff}
.ipaAdd{margin-top:16px;border-top:1px solid #e2e7eb;padding-top:14px;display:grid;grid-template-columns:1fr auto;gap:8px}.ipaAdd select{padding:11px;border:1px solid #cbd5dd;border-radius:9px}
.ipaStatus{margin-top:10px;font-weight:800}.ipaOk{color:#078246}.ipaBad{color:#c10d17}
@media(max-width:760px){.ipaRow{grid-template-columns:1fr 1fr}.ipaRow .ipaMain{grid-column:1/-1}.ipaActions{grid-column:1/-1}.ipaAdd{grid-template-columns:1fr}}
`;document.head.appendChild(s)
}
function configData(){try{return (typeof config!=='undefined'&&config)?config:(window.config||null)}catch{return window.config||null}}
function homeCard(){
 const grid=document.querySelector('.topicIncentivos .menuGrid');if(!grid||$('incentivePriorityCard'))return;
 const b=document.createElement('button');b.id='incentivePriorityCard';b.className='menuCard';b.innerHTML='<span class="mi" style="background:#0b63ce">🎛️</span><span><b>Prioridade dos Incentivos</b><small>Escolher, ocultar e ordenar botões dos consultores</small></span>';
 b.onclick=()=>openPanel();grid.appendChild(b)
}
function ensurePanel(){
 const wrap=document.querySelector('.wrap');if(!wrap)return false;
 ensureCss();
 if($('incentivePriorityAdmin'))return true;
 const sec=document.createElement('section');sec.id='incentivePriorityAdmin';sec.className='hide';
 sec.innerHTML='<h2>🎛️ Botões de Incentivos dos Consultores</h2><div class="ipaNote">Escolha quais incentivos aparecem como botões no aplicativo dos consultores. Você pode deixar de 1 a 5 ativos e definir a prioridade de exibição.</div><div id="ipaRows" class="ipaRows"></div><div class="ipaAdd"><select id="ipaAddCategory"></select><button id="ipaAddBtn" class="ipaBtn ipaSave">+ ADICIONAR CATEGORIA</button></div><div id="ipaStatus" class="ipaStatus"></div>';
 wrap.appendChild(sec);$('ipaAddBtn').onclick=addCategory;return true
}
function hideOthers(){
 ['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasClientes','visitasSubcanais','subcanaisPainel','imperdoaveisAdmin','adminConteudos','contatosClientes','trioPaoQueijo'].forEach(id=>$(id)?.classList.add('hide'));
 $('cokeHome')?.classList.add('hide');$('backHome')?.remove()
}
function addBack(){
 const wrap=document.querySelector('.wrap');if(!wrap)return;
 const b=document.createElement('button');b.id='backHome';b.className='backHome';b.textContent='← Voltar ao menu administrativo';
 b.onclick=()=>{$('incentivePriorityAdmin')?.classList.add('hide');$('cokeHome')?.classList.remove('hide');b.remove();window.scrollTo({top:0,behavior:'smooth'})};
 wrap.insertBefore(b,wrap.firstChild)
}
async function openPanel(){
 if(!ensurePanel())return;hideOthers();$('incentivePriorityAdmin').classList.remove('hide');addBack();
 try{if(!configData()?.incentivo_botoes){setStatus('Carregando configuração...');await refresh()}}catch(e){setStatus(e.message||'Não foi possível carregar os incentivos.')}
 render();window.scrollTo({top:0,behavior:'smooth'})
}
function cats(){
 const c=configData()?.categorias||[];
 return c.filter(x=>x.ativo!==false).map(x=>({id:Number(x.id),nome:String(x.nome||'')}))
}
function options(selected){
 return cats().map(c=>'<option value="'+c.id+'" '+(Number(selected)===c.id?'selected':'')+'>'+E(c.nome)+'</option>').join('')
}
function rowHtml(x){
 const special=x.tipo==='especial';
 const name=special?(x.chave==='b2b'?'📱 B2B – Oportunidades de Compra':'🎯 Imperdoáveis'):'';
 return '<div class="ipaRow" data-id="'+x.id+'"><div class="ipaMain">'+(special?'<b>'+name+'</b><input type="hidden" class="ipaType" value="especial"><input type="hidden" class="ipaKey" value="'+E(x.chave)+'">':'<label>Categoria</label><select class="ipaCategory">'+options(x.categoria_id)+'</select><input type="hidden" class="ipaType" value="categoria">')+'</div><div><label>Prioridade</label><select class="ipaOrder">'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(Number(x.ordem)===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div><div><label>Exibir</label><select class="ipaActive"><option value="1" '+(x.ativo?'selected':'')+'>SIM</option><option value="0" '+(!x.ativo?'selected':'')+'>NÃO</option></select></div><div class="ipaActions"><button class="ipaBtn ipaSave" onclick="window.savePriorityIncentive('+x.id+')">SALVAR</button>'+(special?'':'<button class="ipaBtn ipaDelete" onclick="window.deletePriorityIncentive('+x.id+')">EXCLUIR</button>')+'</div></div>'
}
function render(){
 const cfg=configData();if(!cfg)return;
 const rows=(cfg.incentivo_botoes||[]).slice().sort((a,b)=>Number(a.ordem)-Number(b.ordem)||Number(a.id)-Number(b.id));
 $('ipaRows').innerHTML=rows.length?rows.map(rowHtml).join(''):'<div class="notice">Nenhum botão configurado.</div>';
 const used=new Set(rows.filter(x=>x.tipo==='categoria').map(x=>Number(x.categoria_id)));
 $('ipaAddCategory').innerHTML='<option value="">Escolha uma categoria...</option>'+cats().filter(c=>!used.has(c.id)).map(c=>'<option value="'+c.id+'">'+E(c.nome)+'</option>').join('')
}
function setStatus(t,ok=false){const el=$('ipaStatus');if(el){el.textContent=t;el.className='ipaStatus '+(ok?'ipaOk':'ipaBad')}}
async function refresh(){
 const j=await post({action:'admin_config',token});window.config=j;try{config=j}catch{}render()
}
window.savePriorityIncentive=async id=>{
 const row=document.querySelector('.ipaRow[data-id="'+id+'"]');if(!row)return;
 const tipo=row.querySelector('.ipaType').value,item={id,tipo,ordem:Number(row.querySelector('.ipaOrder').value),ativo:row.querySelector('.ipaActive').value==='1'};
 if(tipo==='especial')item.chave=row.querySelector('.ipaKey').value;else item.categoria_id=Number(row.querySelector('.ipaCategory').value);
 try{setStatus('Salvando...');await post({action:'save_incentive_button',token,item});await refresh();setStatus('✓ Botões atualizados. Os consultores verão a nova prioridade ao atualizar o aplicativo.',true)}catch(e){setStatus(e.message||'Erro ao salvar')}
};
window.deletePriorityIncentive=async id=>{
 if(!confirm('Excluir este botão de incentivo da prioridade?'))return;
 try{await post({action:'delete_incentive_button',token,id});await refresh();setStatus('✓ Botão removido da prioridade.',true)}catch(e){setStatus(e.message||'Erro ao excluir')}
};
async function addCategory(){
 const categoria_id=Number($('ipaAddCategory').value);if(!categoria_id)return setStatus('Escolha uma categoria para adicionar.');
 const rows=configData()?.incentivo_botoes||[],active=rows.filter(x=>x.ativo).length;
 try{setStatus('Adicionando...');await post({action:'save_incentive_button',token,item:{tipo:'categoria',categoria_id,ativo:active<5,ordem:Math.min(5,rows.length+1)}});await refresh();setStatus('✓ Categoria adicionada.',true)}catch(e){setStatus(e.message||'Erro ao adicionar')}
}
let n=0;const timer=setInterval(()=>{homeCard();ensurePanel();if(++n>100)clearInterval(timer)},250);
})();