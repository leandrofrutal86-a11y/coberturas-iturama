(()=>{
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/contratos-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const token=()=>String((typeof TOKEN!=='undefined'&&TOKEN)||sessionStorage.getItem('iturama_token')||'');
const monthNow=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const dateNow=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let state={entries:[],documents:[]},editId=0;

async function call(body){const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token(),...body})});const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j}
function css(){if($('ctConsultCss'))return;const s=document.createElement('style');s.id='ctConsultCss';s.textContent=`
#cvContractsBtn:before{content:'📄';background:#6b3fc4!important}
.ctCOverlay{display:none;position:fixed;inset:0;z-index:12500;background:#f2f5f8;overflow:auto}.ctCOverlay.show{display:block}
.ctCTop{position:sticky;top:0;z-index:4;background:linear-gradient(135deg,#090909,#8d0000);color:#fff;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;gap:8px}.ctCTop h2{margin:0;font-size:20px}.ctCTop button{border:0;background:#fff;border-radius:9px;padding:9px 12px;font-weight:900}
.ctCBody{width:min(980px,calc(100% - 16px));margin:12px auto 100px}.ctCTabs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:10px}.ctCTab{border:1px solid #d4dde5;background:#fff;border-radius:10px;padding:10px 7px;font-size:11px;font-weight:900}.ctCTab.on{background:#172534;color:#fff}
.ctCPanel{display:none;background:#fff;border:1px solid #dce4ea;border-radius:15px;padding:13px}.ctCPanel.on{display:block}
.ctCForm{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ctCForm .full{grid-column:1/-1}.ctCForm label{display:block;font-size:10px;font-weight:900;color:#5a6c7d;margin-bottom:4px}.ctCForm input,.ctCForm textarea{width:100%;padding:10px;border:1px solid #cbd5df;border-radius:9px;background:#fff}.ctCForm textarea{min-height:86px;resize:vertical}.ctCTotal{background:#eff6ff!important;font-weight:950;color:#0b5ca8}
.ctCBtns{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.ctCBtn{border:0;border-radius:9px;padding:10px 13px;font-weight:900;background:#e30613;color:#fff}.ctCBtn.alt{background:#172534}.ctCBtn.light{background:#edf1f4;color:#172534}.ctCStatus{font-size:11px;font-weight:800;margin-top:8px}.ctCStatus.bad{color:#b00000}.ctCStatus.ok{color:#087249}
.ctCMonthTop{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin-bottom:10px}.ctCMonthTop input{padding:9px;border:1px solid #cbd5df;border-radius:9px}.ctCSummary{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.ctCChip{background:#eef3f6;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:900}
.ctCList{display:grid;gap:8px}.ctCCard{border:1px solid #dce3e9;border-radius:12px;padding:10px;background:#fff}.ctCCardTop{display:flex;justify-content:space-between;gap:8px}.ctCCard h4{margin:5px 0}.ctCCard small{color:#657685}.ctCNumbers{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:8px}.ctCNum{background:#f4f7f9;border-radius:8px;padding:7px;font-size:10px}.ctCNum b{display:block;font-size:12px;margin-top:2px}.ctCEdit{border:0;border-radius:8px;background:#fff2d8;color:#8a5300;padding:7px 9px;font-weight:900}.ctCDelete{border:0;border-radius:8px;background:#ffe3e3;color:#a31212;padding:7px 9px;font-weight:900}.ctCCardActions{display:flex;gap:6px;align-items:flex-start;flex-wrap:wrap}
.ctCDocs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.ctCDoc{border:1px solid #dce3e9;border-radius:12px;padding:10px}.ctCDoc img{width:100%;max-height:280px;object-fit:contain;background:#f4f6f8;border-radius:8px}.ctCDoc h4{margin:8px 0 5px}.ctCDoc a{display:inline-block;text-decoration:none;background:#1677d2;color:#fff;border-radius:8px;padding:8px 10px;font-weight:900}.ctCEmpty{text-align:center;padding:22px;color:#67798a;font-weight:800}
body:has(.ctCOverlay.show) #cvBottomNav{visibility:hidden!important;pointer-events:none!important}
@media(max-width:650px){.ctCTabs{grid-template-columns:1fr}.ctCForm{grid-template-columns:1fr}.ctCForm .full{grid-column:auto}.ctCDocs{grid-template-columns:1fr}.ctCNumbers{grid-template-columns:1fr 1fr 1fr}.ctCTop h2{font-size:18px}}
`;document.head.appendChild(s)}
function build(){
 if($('ctCOverlay'))return;
 document.body.insertAdjacentHTML('beforeend',`<div id="ctCOverlay" class="ctCOverlay">
  <div class="ctCTop"><h2>📄 Contratos</h2><button id="ctCClose">FECHAR</button></div>
  <div class="ctCBody">
   <div class="ctCTabs"><button class="ctCTab on" data-ctp="create">➕ Criar contrato</button><button class="ctCTab" data-ctp="month">📊 Contratos do mês</button><button class="ctCTab" data-ctp="docs">📁 Contratos vigentes</button></div>
   <section id="ctCPanelCreate" class="ctCPanel on">
    <h3 id="ctCFormTitle">Criar contrato</h3>
    <div class="ctCForm">
     <div><label>PV</label><input id="ctCPv" inputmode="numeric" placeholder="Digite o PV"></div>
     <div><label>DATA</label><input id="ctCDate" type="date" value="${dateNow()}"></div>
     <div class="full"><label>DESCRIÇÃO</label><textarea id="ctCDesc" placeholder="Descreva o contrato"></textarea></div>
     <div><label>VOLUME</label><input id="ctCVolume" type="number" min="0" step="0.01" placeholder="0"></div>
     <div><label>VALOR POR CAIXA</label><input id="ctCValue" type="number" min="0" step="0.01" placeholder="0,00"></div>
     <div class="full"><label>TOTAL</label><input id="ctCTotal" class="ctCTotal" readonly value="R$ 0,00"></div>
    </div>
    <div class="ctCBtns"><button id="ctCSave" class="ctCBtn">SALVAR CONTRATO</button><button id="ctCCancelEdit" class="ctCBtn light" style="display:none">CANCELAR EDIÇÃO</button></div><div id="ctCStatus" class="ctCStatus"></div>
   </section>
   <section id="ctCPanelMonth" class="ctCPanel">
    <div class="ctCMonthTop"><div><label style="display:block;font-size:10px;font-weight:900">MÊS</label><input id="ctCMonth" type="month" value="${monthNow()}"></div><button id="ctCReload" class="ctCBtn alt">ATUALIZAR</button></div>
    <div id="ctCSummary" class="ctCSummary"></div><div id="ctCEntries" class="ctCList"></div>
   </section>
   <section id="ctCPanelDocs" class="ctCPanel"><h3>Contratos vigentes da minha rota</h3><div id="ctCDocs" class="ctCDocs"><div class="ctCEmpty">Carregando...</div></div></section>
  </div>
 </div>`);
 $('ctCClose').onclick=()=>$('ctCOverlay').classList.remove('show');
 document.querySelectorAll('[data-ctp]').forEach(b=>b.onclick=()=>showPanel(b.dataset.ctp));
 $('ctCVolume').oninput=calcTotal;$('ctCValue').oninput=calcTotal;$('ctCSave').onclick=save;$('ctCCancelEdit').onclick=resetForm;$('ctCMonth').onchange=loadEntries;$('ctCReload').onclick=loadEntries
}
function ensureButton(){
 const q=document.querySelector('.quick');if(!q||$('cvContractsBtn'))return false;
 const b=document.createElement('button');b.id='cvContractsBtn';b.className='q cvTopBtn';b.innerHTML='Contratos<br><small>Criar, editar e acompanhar contratos</small>';b.onclick=open;q.appendChild(b);return true
}
function isConsultor(){try{return !DATA||String(DATA.perfil||'consultor')==='consultor'}catch{return true}}
function syncButton(){const b=$('cvContractsBtn');if(b)b.style.display=isConsultor()?'':'none'}
function status(t,ok=true){const e=$('ctCStatus');if(e){e.textContent=t;e.className='ctCStatus '+(ok?'ok':'bad')}}
function showPanel(name){
 const map={create:'ctCPanelCreate',month:'ctCPanelMonth',docs:'ctCPanelDocs'};
 document.querySelectorAll('.ctCTab').forEach(b=>b.classList.toggle('on',b.dataset.ctp===name));
 Object.values(map).forEach(id=>$(id)?.classList.remove('on'));$(map[name])?.classList.add('on');
 if(name==='month')loadEntries();if(name==='docs')loadDocs()
}
function calcTotal(){const v=Number($('ctCVolume').value||0),p=Number($('ctCValue').value||0);$('ctCTotal').value=money(v*p)}
function resetForm(){editId=0;$('ctCFormTitle').textContent='Criar contrato';$('ctCPv').value='';$('ctCDesc').value='';$('ctCDate').value=dateNow();$('ctCVolume').value='';$('ctCValue').value='';calcTotal();$('ctCSave').textContent='SALVAR CONTRATO';$('ctCCancelEdit').style.display='none';status('')}
async function save(){
 const body={action:'consultor_save',id:editId||undefined,pv:$('ctCPv').value.trim(),descricao:$('ctCDesc').value.trim(),data:$('ctCDate').value,volume:$('ctCVolume').value,valor_caixa:$('ctCValue').value};
 try{$('ctCSave').disabled=true;status(editId?'Salvando alteração...':'Salvando contrato...');const j=await call(body);status(j.edited?'Contrato atualizado com sucesso.':'Contrato criado com sucesso.');resetForm();$('ctCMonth').value=monthNow();await loadEntries();showPanel('month')}catch(e){status(e.message,false)}finally{$('ctCSave').disabled=false}
}
async function loadEntries(){
 const box=$('ctCEntries');if(!box)return;box.innerHTML='<div class="ctCEmpty">Carregando contratos...</div>';
 try{const j=await call({action:'consultor_list',month:$('ctCMonth').value||monthNow()});state.entries=j.entries||[];renderEntries()}catch(e){box.innerHTML='<div class="ctCEmpty">'+E(e.message)+'</div>'}
}
function renderEntries(){
 const rows=state.entries||[],vol=rows.reduce((s,x)=>s+Number(x.volume||0),0),tot=rows.reduce((s,x)=>s+Number(x.total||0),0);
 $('ctCSummary').innerHTML='<span class="ctCChip">'+rows.length+' contrato(s)</span><span class="ctCChip">Volume: '+vol.toLocaleString('pt-BR')+'</span><span class="ctCChip">Total: '+money(tot)+'</span>';
 $('ctCEntries').innerHTML=rows.length?rows.map(x=>'<article class="ctCCard"><div class="ctCCardTop"><div><b>PV '+E(x.pv)+'</b><h4>'+E(x.descricao)+'</h4><small>'+E(new Date(x.data+'T12:00:00').toLocaleDateString('pt-BR'))+'</small></div><div class="ctCCardActions"><button class="ctCEdit" data-ct-edit="'+x.id+'">EDITAR</button><button class="ctCDelete" data-ct-delete="'+x.id+'">EXCLUIR</button></div></div><div class="ctCNumbers"><div class="ctCNum">VOLUME<b>'+Number(x.volume||0).toLocaleString('pt-BR')+'</b></div><div class="ctCNum">VALOR/CX<b>'+money(x.valor_caixa)+'</b></div><div class="ctCNum">TOTAL<b>'+money(x.total)+'</b></div></div></article>').join(''):'<div class="ctCEmpty">Você ainda não criou contratos neste mês.</div>';
 document.querySelectorAll('[data-ct-edit]').forEach(b=>b.onclick=()=>edit(Number(b.dataset.ctEdit)));
 document.querySelectorAll('[data-ct-delete]').forEach(b=>b.onclick=()=>removeContract(Number(b.dataset.ctDelete)))
}
function edit(id){const x=(state.entries||[]).find(r=>Number(r.id)===Number(id));if(!x)return;editId=Number(x.id);$('ctCPv').value=x.pv||'';$('ctCDesc').value=x.descricao||'';$('ctCDate').value=x.data||dateNow();$('ctCVolume').value=x.volume??'';$('ctCValue').value=x.valor_caixa??'';calcTotal();$('ctCFormTitle').textContent='Editar contrato';$('ctCSave').textContent='SALVAR ALTERAÇÃO';$('ctCCancelEdit').style.display='inline-block';showPanel('create');window.scrollTo({top:0,behavior:'smooth'})}
async function removeContract(id){
 const x=(state.entries||[]).find(r=>Number(r.id)===Number(id));
 if(!x)return;
 if(!confirm('Excluir o contrato do PV '+String(x.pv||'')+'? Essa ação não pode ser desfeita.'))return;
 try{
  await call({action:'consultor_delete',id});
  if(editId===id)resetForm();
  await loadEntries();
 }catch(e){alert(e.message||'Não foi possível excluir o contrato.')}
}
async function loadDocs(){const box=$('ctCDocs');box.innerHTML='<div class="ctCEmpty">Carregando contratos vigentes...</div>';try{const j=await call({action:'consultor_documents'});state.documents=j.documents||[];renderDocs()}catch(e){box.innerHTML='<div class="ctCEmpty">'+E(e.message)+'</div>'}}
function renderDocs(){const docs=state.documents||[];$('ctCDocs').innerHTML=docs.length?docs.map(d=>'<article class="ctCDoc">'+(d.tipo==='imagem'&&d.signed_url?'<img src="'+E(d.signed_url)+'" alt="">':'<div style="font-size:46px">📄</div>')+'<h4>'+E(d.titulo)+'</h4>'+(d.signed_url?'<a href="'+E(d.signed_url)+'" target="_blank" rel="noopener">'+(d.tipo==='pdf'?'ABRIR PDF':'ABRIR IMAGEM')+'</a>':'')+'</article>').join(''):'<div class="ctCEmpty">Nenhum contrato vigente foi publicado para sua rota.</div>'}
async function open(){if(!isConsultor())return;css();build();$('ctCOverlay').classList.add('show');resetForm();$('ctCMonth').value=monthNow();showPanel('month');loadDocs()}
function boot(){css();build();ensureButton();syncButton();const mo=new MutationObserver(()=>{ensureButton();syncButton()});mo.observe(document.body,{childList:true,subtree:true});setInterval(()=>{ensureButton();syncButton()},1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();