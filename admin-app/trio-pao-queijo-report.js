(()=>{
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastData=null,lastRows=[];

async function api(payload){
  const token=sessionStorage.getItem('admToken')||'';
  if(window.__adminRobustPost)return await window.__adminRobustPost({...payload,token});
  const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify({...payload,token})});
  const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Falha ao consultar Trio Pão de Queijo');return j;
}
function css(){
 if($('trioReportStyle'))return;
 const s=document.createElement('style');s.id='trioReportStyle';s.textContent=`
#trioPaoQueijo .box{overflow:visible}
.trioHead{background:linear-gradient(135deg,#c5000c,#e20a14);color:#fff;border-radius:16px 16px 0 0;padding:16px 18px}
.trioHead h2{margin:0;font-size:21px}.trioHead small{display:block;margin-top:5px;font-weight:800;opacity:.95}
.trioFilters{display:grid;grid-template-columns:1fr 1fr 1.2fr auto auto;gap:9px;align-items:end;background:#f5f7f9;padding:12px;border:1px solid #e0e5e9;border-top:0}
.trioFilters label{font-size:11px;font-weight:950;color:#3e5060}.trioFilters select{margin-top:5px;font-weight:800}
.trioBtn{padding:11px 14px!important;font-weight:950!important;border-radius:10px!important}.trioGen{background:#e30613!important;color:#fff!important}.trioPdf{background:#0c8a43!important;color:#fff!important}.trioPdf:disabled{background:#b8c1c8!important}
#trioStatus{padding:9px 3px;font-size:12px;font-weight:800;color:#52606d}
.trioSummary{display:flex;gap:7px;flex-wrap:wrap;margin:5px 0 11px}.trioChip{background:#eef3f6;border:1px solid #d5dee5;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:950}
.trioTableWrap{overflow:auto;border:1px solid #d8e0e6;border-radius:12px}.trioTable{width:100%;min-width:1120px;border-collapse:collapse}
.trioTable th{background:#c9000b!important;color:#fff!important;position:static!important;padding:8px 5px!important;font-size:9px!important;text-align:center!important}
.trioTable td{padding:7px 5px!important;border-bottom:1px solid #e0e6eb!important;font-size:9px!important;text-align:center!important;vertical-align:middle!important}
.trioTable td:nth-child(2){text-align:left!important;font-weight:900}.trioTable tr:nth-child(even) td{background:#f5f8fa}
.trioOk{color:#087b42;font-weight:950}.trioBad{color:#c20c15;font-weight:950}.trioMissing{text-align:left!important;color:#b20e17!important;font-weight:900!important}
.trioEmpty{padding:22px;text-align:center;color:#64748b;font-weight:800}
@media(max-width:800px){
 .trioHead{padding:11px}.trioHead h2{font-size:15px}
 .trioFilters{grid-template-columns:1fr 1fr;padding:8px;gap:7px}.trioFilters label:nth-child(3){grid-column:1/-1}.trioBtn{font-size:9px!important;padding:10px 5px!important}
 .trioChip{font-size:8px;padding:5px 7px}.trioTable{min-width:900px}.trioTable th,.trioTable td{font-size:7.5px!important;padding:6px 3px!important}
}
`;document.head.appendChild(s);
}
function ensure(){
 const wrap=document.querySelector('.wrap'),tabs=document.querySelector('.tabs');if(!wrap||!tabs)return false;
 css();
 [...tabs.querySelectorAll('button')].filter(b=>b.textContent.includes('Resultado da Equipe')).forEach(b=>b.remove());
 let nav=$('trioNavBtn');
 if(!nav){nav=document.createElement('button');nav.id='trioNavBtn';nav.textContent='🥖 Trio Pão de Queijo';nav.onclick=open;tabs.appendChild(nav)}
 if(!$('trioPaoQueijo')){
  const sec=document.createElement('section');sec.id='trioPaoQueijo';sec.className='hide';
  sec.innerHTML=`<div class="box" style="padding:0"><div class="trioHead"><h2>🥖 TRIO PÃO DE QUEIJO</h2><small>Clientes vendidos e oportunidades por rota e dia de visita</small></div>
  <div class="trioFilters">
    <label>ROTA<select id="trioRoute"><option value="">TODAS AS ROTAS</option><option value="8A1">8A1</option><option value="8B1">8B1</option><option value="8C1">8C1</option><option value="8D1">8D1</option><option value="8F1">8F1</option></select></label>
    <label>DIA DE VISITA<select id="trioDay"><option value="">TODOS OS DIAS</option><option value="SEG">SEGUNDA</option><option value="TER">TERÇA</option><option value="QUA">QUARTA</option><option value="QUI">QUINTA</option><option value="SEX">SEXTA</option></select></label>
    <label>SITUAÇÃO<select id="trioSituation"><option value="OPORTUNIDADES">OPORTUNIDADES - AINDA FALTA</option><option value="VENDIDOS">VENDIDOS - TRIO COMPLETO</option><option value="TODOS">TODOS OS CLIENTES</option><option value="F1">FALTA 1 GRUPO</option><option value="F2">FALTAM 2 GRUPOS</option><option value="F3">FALTAM 3 GRUPOS</option></select></label>
    <button id="trioGenerate" class="trioBtn trioGen">GERAR RELATÓRIO</button>
    <button id="trioPdf" class="trioBtn trioPdf" disabled>📄 BAIXAR RELATÓRIO</button>
  </div>
  <div style="padding:0 12px 14px"><div id="trioStatus">Escolha os filtros e clique em GERAR RELATÓRIO.</div><div id="trioSummary" class="trioSummary"></div><div id="trioResult"></div></div></div>`;
  const anchor=tabs.nextElementSibling; if(anchor) anchor.insertAdjacentElement('afterend',sec); else wrap.appendChild(sec);
  $('trioGenerate').onclick=generate;$('trioPdf').onclick=pdf;
  $('trioSituation').onchange=()=>{if(lastData)render()};
  ['trioRoute','trioDay'].forEach(id=>$(id).onchange=clear);
 }
 return true;
}
function open(){
 const ids=['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasSubcanais','subcanaisPainel','contatosClientes'];
 ids.forEach(id=>$(id)?.classList.add('hide'));$('cokeHome')?.classList.add('hide');$('trioPaoQueijo')?.classList.remove('hide');
 document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('on'));$('trioNavBtn')?.classList.add('on');
}
function clear(){
 lastData=null;lastRows=[];$('trioSummary').innerHTML='';$('trioResult').innerHTML='';$('trioPdf').disabled=true;$('trioStatus').textContent='Filtros alterados. Clique em GERAR RELATÓRIO.';
}
function situationMatch(c,s){
 if(s==='TODOS')return true;if(s==='VENDIDOS')return !!c.completo;if(s==='OPORTUNIDADES')return !c.completo;
 if(s==='F1')return Number(c.faltam)===1;if(s==='F2')return Number(c.faltam)===2;if(s==='F3')return Number(c.faltam)>=3;return true;
}
const GROUP_NAMES={1:'Coca RefPet',2:'Coca LS',3:'Fanta RefPet'};
function missing(c){
 return (c.grupos||[]).filter(g=>!g.vendido).map(g=>`${GROUP_NAMES[Number(g.grupo)]||('Grupo '+g.grupo)} (${(g.codigos||[]).join('/')})`).join(' • ')||'—';
}
function render(){
 if(!lastData)return;
 const sit=$('trioSituation').value||'OPORTUNIDADES';
 const rows=(lastData.clientes||[]).filter(c=>situationMatch(c,sit));lastRows=rows;
 const all=lastData.clientes||[],vend=all.filter(c=>c.completo).length,opp=all.length-vend;
 $('trioSummary').innerHTML=`<span class="trioChip">CLIENTES: ${all.length}</span><span class="trioChip">VENDIDOS: ${vend}</span><span class="trioChip">OPORTUNIDADES: ${opp}</span><span class="trioChip">EXIBIDOS: ${rows.length}</span><span class="trioChip">COCA REFPET: 1918/1919</span><span class="trioChip">COCA LS: 1916/1917</span><span class="trioChip">FANTA REFPET: 1827/1828</span>`;
 $('trioPdf').disabled=!rows.length;
 if(!rows.length){$('trioResult').innerHTML='<div class="trioEmpty">Nenhum cliente neste filtro.</div>';return}
 const html=rows.map(c=>`<tr><td>${esc(c.pv)}</td><td>${esc(c.razao||'Cliente')}</td><td>${esc(c.rota)}<br><small>${esc(c.consultor||'')}</small></td><td>${esc((c.dias||[]).join(', ')||'—')}</td><td>${esc(c.subcanal||'')}</td>${(c.grupos||[]).map(g=>`<td class="${g.vendido?'trioOk':'trioBad'}">${g.vendido?'✓':'✕'}<br><small>${esc((g.codigos||[]).join('/'))}</small></td>`).join('')}<td class="${c.completo?'trioOk':'trioBad'}">${esc(c.situacao)}</td><td class="trioMissing">${esc(missing(c))}</td></tr>`).join('');
 $('trioResult').innerHTML=`<div class="trioTableWrap"><table class="trioTable"><thead><tr><th>PV</th><th>CLIENTE</th><th>ROTA / CONSULTOR</th><th>DIA VISITA</th><th>SUBCANAL</th><th>COCA REFPET</th><th>COCA LS</th><th>FANTA REFPET</th><th>SITUAÇÃO</th><th>O QUE FALTA</th></tr></thead><tbody>${html}</tbody></table></div>`;
}
async function generate(){
 if(!ensure())return;const btn=$('trioGenerate');btn.disabled=true;$('trioPdf').disabled=true;$('trioStatus').textContent='Calculando Trio Pão de Queijo...';$('trioResult').innerHTML='';
 try{
  const rota=$('trioRoute').value||'',dia=$('trioDay').value||'';
  lastData=await api({action:'trio_report',rota,dia});
  if(Array.isArray(lastData.rotas)){
   const current=$('trioRoute').value,opts=lastData.rotas.map(x=>`<option value="${esc(x.rota)}">${esc(x.rota)} - ${esc(x.nome||'')}</option>`).join('');
   $('trioRoute').innerHTML='<option value="">TODAS AS ROTAS</option>'+opts;if([...$('trioRoute').options].some(o=>o.value===current))$('trioRoute').value=current;
  }
  $('trioStatus').textContent='Relatório atualizado.';render();
 }catch(e){lastData=null;lastRows=[];$('trioStatus').textContent='Erro: '+e.message;$('trioResult').innerHTML='<div class="trioEmpty">Não foi possível gerar o relatório.</div>'}
 finally{btn.disabled=false}
}
function load(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o gerador do relatório.'));document.head.appendChild(s)})}
async function pdf(){
 if(!lastRows.length)return;const btn=$('trioPdf');btn.disabled=true;$('trioStatus').textContent='Gerando relatório...';
 try{
  await load('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',()=>!!window.jspdf);
  await load('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',()=>!!window.jspdf?.jsPDF?.API?.autoTable);
  const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  const rt=$('trioRoute').selectedOptions[0]?.textContent||'TODAS AS ROTAS',dy=$('trioDay').selectedOptions[0]?.textContent||'TODOS OS DIAS',sit=$('trioSituation').selectedOptions[0]?.textContent||'';
  doc.setFillColor(198,0,10);doc.rect(0,0,297,23,'F');doc.setTextColor(255,255,255);doc.setFontSize(16);doc.setFont(undefined,'bold');doc.text('TRIO PÃO DE QUEIJO - EQUIPE ITURAMA',12,10);doc.setFontSize(8.5);doc.text(`ROTA: ${rt}   DIA: ${dy}   FILTRO: ${sit}`,12,17);
  doc.setTextColor(25,25,25);
  doc.autoTable({startY:28,head:[['PV','CLIENTE','ROTA','DIA','SUBCANAL','COCA REFPET','COCA LS','FANTA REFPET','SITUAÇÃO','O QUE FALTA']],body:lastRows.map(c=>[c.pv,c.razao||'Cliente',c.rota,(c.dias||[]).join(', '),c.subcanal||'',c.grupos?.[0]?.vendido?'OK':'FALTA',c.grupos?.[1]?.vendido?'OK':'FALTA',c.grupos?.[2]?.vendido?'OK':'FALTA',c.situacao,missing(c)]),styles:{fontSize:6.5,cellPadding:1.7,overflow:'linebreak'},headStyles:{fillColor:[198,0,10],textColor:255,fontStyle:'bold'},columnStyles:{0:{cellWidth:17},1:{cellWidth:55},2:{cellWidth:14},3:{cellWidth:25},4:{cellWidth:30},5:{cellWidth:13},6:{cellWidth:13},7:{cellWidth:13},8:{cellWidth:25},9:{cellWidth:55}},margin:{left:7,right:7}});
  const safe=($('trioRoute').value||'todas').replace(/[^a-z0-9_-]/gi,'_');doc.save(`trio_pao_de_queijo_${safe}_${new Date().toISOString().slice(0,10)}.pdf`);$('trioStatus').textContent='Relatório baixado.';
 }catch(e){$('trioStatus').textContent='Erro ao baixar relatório: '+e.message}
 finally{btn.disabled=false}
}
function boot(){let n=0;const t=setInterval(()=>{if(ensure()||++n>100)clearInterval(t)},150)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();