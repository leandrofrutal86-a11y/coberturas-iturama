(()=>{
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/contratos-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const monthNow=()=>{const d=new Date(),m=String(d.getMonth()+1).padStart(2,'0');return d.getFullYear()+'-'+m};
let state={routes:[],entries:[],documents:[]},mounted=false;

function token(){return sessionStorage.getItem('admToken')||String(window.token||'')}
async function call(body){const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token(),...body})});const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j}
async function callForm(fd){fd.set('token',token());const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',body:fd});const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j}

function css(){
 if($('admContractsCss'))return;
 const s=document.createElement('style');s.id='admContractsCss';s.textContent=`
 #adminContracts .ctTop{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
 #adminContracts .ctBack{border:0;background:#172534;color:#fff;border-radius:10px;padding:10px 14px;font-weight:900}
 #adminContracts .ctGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
 #adminContracts .ctPanel{background:#fff;border:1px solid #dce4ea;border-radius:16px;padding:14px;box-shadow:0 4px 16px #0000000d}
 #adminContracts .ctPanel h3{margin:0 0 10px}.ctForm{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ctForm .full{grid-column:1/-1}
 #adminContracts label{display:block;font-size:11px;font-weight:900;color:#536577;margin-bottom:5px}
 #adminContracts input,#adminContracts select{width:100%;padding:10px;border:1px solid #cbd5df;border-radius:9px;background:#fff}
 #adminContracts .ctBtn{border:0;border-radius:9px;padding:10px 14px;font-weight:900;color:#fff;background:#e30613;cursor:pointer}
 #adminContracts .ctBtn.alt{background:#172534}.ctRoutes{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
 #adminContracts .ctRoute{border:1px solid #d7dfe6;border-radius:9px;padding:8px;background:#fafcfd;font-size:12px;font-weight:800}
 #adminContracts .ctRoute input{width:auto;margin-right:5px}.ctStatus{margin-top:8px;font-size:12px;font-weight:800}.ctStatus.bad{color:#b00000}.ctStatus.ok{color:#087249}
 #adminContracts .ctSummary{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.ctChip{background:#eef3f6;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900}
 #adminContracts .ctTableWrap{overflow:auto;border:1px solid #e0e6eb;border-radius:11px}.ctTable{width:100%;border-collapse:collapse;min-width:900px}.ctTable th{background:#172534;color:#fff}.ctTable th,.ctTable td{padding:8px 7px;border-bottom:1px solid #e5eaee;font-size:11px;text-align:left}.ctTable td.num{text-align:right;font-weight:800}
 #adminContracts .ctDocs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ctDoc{border:1px solid #dce3e9;border-radius:12px;padding:10px}.ctDoc img{width:100%;max-height:230px;object-fit:contain;border-radius:8px;background:#f4f6f8}.ctDoc h4{margin:8px 0 4px}.ctDoc small{color:#627485}.ctDocActions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.ctDocActions a,.ctDocActions button{border:0;border-radius:8px;padding:8px 10px;font-weight:800;text-decoration:none;cursor:pointer}.ctOpen{background:#1677d2;color:#fff}.ctDel{background:#ffe1e1;color:#a31212}
 @media(max-width:760px){#adminContracts .ctGrid{grid-template-columns:1fr}.ctForm{grid-template-columns:1fr}.ctForm .full{grid-column:auto}.ctRoutes{grid-template-columns:1fr 1fr}.ctDocs{grid-template-columns:1fr}}
 `;document.head.appendChild(s)
}
function shell(){
 if($('adminContracts'))return;
 const wrap=document.querySelector('.wrap');if(!wrap)return;
 const sec=document.createElement('section');sec.id='adminContracts';sec.className='hide';
 sec.innerHTML=`<div class="box">
 <div class="ctTop"><div><h2 style="margin:0">📄 Contratos</h2><p class="small">Acompanhamento mensal e documentos por rota.</p></div><button id="ctAdmBack" class="ctBack">← VOLTAR</button></div>
 <div class="ctGrid">
  <div class="ctPanel"><h3>Contratos feitos pela equipe</h3>
   <div class="ctForm"><div><label>MÊS</label><input id="ctAdmMonth" type="month" value="${monthNow()}"></div><div><label>ROTA</label><select id="ctAdmRoute"><option value="">TODAS AS ROTAS</option></select></div></div>
   <div id="ctAdmSummary" class="ctSummary"></div><div id="ctAdmEntries"></div>
  </div>
  <div class="ctPanel"><h3>Publicar contrato para consultor</h3>
   <div class="ctForm"><div class="full"><label>TÍTULO</label><input id="ctAdmTitle" placeholder="Ex.: Contrato Cliente X"></div><div class="full"><label>IMAGEM OU PDF</label><input id="ctAdmFile" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"></div><div class="full"><label>ROTAS QUE PODERÃO VISUALIZAR</label><div id="ctAdmRoutes" class="ctRoutes"></div></div></div>
   <button id="ctAdmUpload" class="ctBtn" style="margin-top:10px">ANEXAR CONTRATO</button><div id="ctAdmStatus" class="ctStatus"></div>
  </div>
 </div>
 <div class="ctPanel" style="margin-top:14px"><h3>Contratos publicados</h3><div id="ctAdmDocs" class="ctDocs"></div></div>
 </div>`;
 wrap.appendChild(sec);wire()
}
function showHome(){document.querySelectorAll('.wrap>section').forEach(s=>s.classList.add('hide'));$('cokeHome')?.classList.remove('hide');$('backHome')?.remove();window.scrollTo({top:0,behavior:'smooth'})}
async function open(){shell();document.querySelectorAll('.wrap>section').forEach(s=>s.classList.add('hide'));$('adminContracts').classList.remove('hide');$('backHome')?.remove();window.scrollTo({top:0,behavior:'smooth'});await load()}
function ensureCard(){
 const grid=document.querySelector('#cokeHome .topicVendas .menuGrid');if(!grid||$('adminContractsCard'))return false;
 const b=document.createElement('button');b.id='adminContractsCard';b.className='menuCard';b.innerHTML='<span class="mi" style="background:#6b3fc4">📄</span><span><b>Contratos</b><small>Acompanhamento mensal e documentos por rota</small></span>';b.onclick=open;grid.appendChild(b);return true
}
function setStatus(t,ok=true){const e=$('ctAdmStatus');if(e){e.textContent=t;e.className='ctStatus '+(ok?'ok':'bad')}}
function fillRoutes(){
 const sel=$('ctAdmRoute'),cur=sel.value;sel.innerHTML='<option value="">TODAS AS ROTAS</option>'+state.routes.map(r=>'<option value="'+E(r.rota)+'">'+E(r.rota)+' - '+E(r.nome)+'</option>').join('');if([...sel.options].some(o=>o.value===cur))sel.value=cur;
 $('ctAdmRoutes').innerHTML=state.routes.map(r=>'<label class="ctRoute"><input type="checkbox" value="'+E(r.rota)+'"> '+E(r.rota)+' - '+E(r.nome)+'</label>').join('')
}
function renderEntries(){
 const rows=state.entries||[],vol=rows.reduce((s,x)=>s+Number(x.volume||0),0),tot=rows.reduce((s,x)=>s+Number(x.total||0),0);
 $('ctAdmSummary').innerHTML='<span class="ctChip">'+rows.length+' contrato(s)</span><span class="ctChip">Volume: '+vol.toLocaleString('pt-BR')+'</span><span class="ctChip">Total: '+money(tot)+'</span>';
 $('ctAdmEntries').innerHTML=rows.length?'<div class="ctTableWrap"><table class="ctTable"><thead><tr><th>Data</th><th>Rota</th><th>Consultor</th><th>PV</th><th>Descrição</th><th>Volume</th><th>Valor/Cx</th><th>Total</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+E(new Date(x.data+'T12:00:00').toLocaleDateString('pt-BR'))+'</td><td><b>'+E(x.rota)+'</b></td><td>'+E(x.consultor_nome)+'</td><td>'+E(x.pv)+'</td><td>'+E(x.descricao)+'</td><td class="num">'+Number(x.volume||0).toLocaleString('pt-BR')+'</td><td class="num">'+money(x.valor_caixa)+'</td><td class="num">'+money(x.total)+'</td></tr>').join('')+'</tbody></table></div>':'<div class="empty">Nenhum contrato lançado neste mês.</div>'
}
function renderDocs(){
 const docs=state.documents||[];
 $('ctAdmDocs').innerHTML=docs.length?docs.map(d=>'<article class="ctDoc">'+(d.tipo==='imagem'&&d.signed_url?'<img src="'+E(d.signed_url)+'" alt="">':'<div style="font-size:42px">📄</div>')+'<h4>'+E(d.titulo)+'</h4><small>Rotas: '+E((d.rotas||[]).join(', '))+'</small><div class="ctDocActions">'+(d.signed_url?'<a class="ctOpen" href="'+E(d.signed_url)+'" target="_blank" rel="noopener">ABRIR</a>':'')+'<button class="ctDel" data-ct-del="'+d.id+'">EXCLUIR</button></div></article>').join(''):'<div class="empty">Nenhum contrato publicado.</div>';
 document.querySelectorAll('[data-ct-del]').forEach(b=>b.onclick=async()=>{if(!confirm('Excluir este contrato publicado?'))return;try{await call({action:'admin_delete_document',id:Number(b.dataset.ctDel)});await load();setStatus('Contrato publicado excluído.')}catch(e){setStatus(e.message,false)}})
}
async function load(){try{const j=await call({action:'admin_init',month:$('ctAdmMonth')?.value||monthNow(),route:$('ctAdmRoute')?.value||''});state=j;fillRoutes();renderEntries();renderDocs()}catch(e){setStatus(e.message,false)}}
async function upload(){
 const f=$('ctAdmFile').files?.[0],title=$('ctAdmTitle').value.trim(),routes=[...document.querySelectorAll('#ctAdmRoutes input:checked')].map(x=>x.value);
 if(!title)return setStatus('Informe o título.',false);if(!f)return setStatus('Escolha uma imagem ou PDF.',false);if(!routes.length)return setStatus('Escolha pelo menos uma rota.',false);
 const fd=new FormData();fd.set('action','admin_upload_document');fd.set('titulo',title);fd.set('rotas',JSON.stringify(routes));fd.set('file',f);
 try{$('ctAdmUpload').disabled=true;setStatus('Enviando contrato...');await callForm(fd);$('ctAdmTitle').value='';$('ctAdmFile').value='';document.querySelectorAll('#ctAdmRoutes input').forEach(x=>x.checked=false);await load();setStatus('Contrato publicado com sucesso.')}catch(e){setStatus(e.message,false)}finally{$('ctAdmUpload').disabled=false}
}
function wire(){$('ctAdmBack').onclick=showHome;$('ctAdmMonth').onchange=load;$('ctAdmRoute').onchange=load;$('ctAdmUpload').onclick=upload}
function boot(){css();shell();ensureCard();const mo=new MutationObserver(()=>ensureCard());mo.observe(document.body,{childList:true,subtree:true});setInterval(ensureCard,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();