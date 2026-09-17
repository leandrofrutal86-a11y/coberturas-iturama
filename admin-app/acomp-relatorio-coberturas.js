(()=>{
const CAT_IDS=[1,2,12,16,17,21,13,18,19,20,4,6,7,15,14,8,9,10,11];
const q=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastRows=[],lastInfo=null;

function getDash(){
  try{return window.__adminDash||(typeof dash!=='undefined'?dash:null)||window.dash||null}catch{return window.__adminDash||window.dash||null}
}
function catEntries(d){
  const cats=d?.categorias||[];
  return CAT_IDS.map(id=>{const idx=cats.findIndex(c=>Number(c.id)===Number(id));return idx>=0?{cat:cats[idx],idx}:null}).filter(Boolean);
}
function findResult(ind,entry){
  const arr=ind?.resultados||[];
  return arr.find(r=>norm(r?.nome)===norm(entry.cat?.nome))||arr[entry.idx]||null;
}
function weekdaysLeft(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const end=new Date(now.getFullYear(),now.getMonth()+1,0);
  let n=0;
  for(;d<=end;d.setDate(d.getDate()+1)){
    const w=d.getDay();
    if(w!==0&&w!==6)n++;
  }
  return n;
}
function monthLabel(now=new Date()){
  return now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase();
}
function dateLabel(now=new Date()){
  return now.toLocaleDateString('pt-BR');
}
function dailyNeed(falta,dias){
  const f=Math.max(0,Number(falta)||0);
  if(!f)return 0;
  if(!dias)return f;
  return Math.ceil(f/dias);
}
function routeLabel(d,route){
  if(!route)return 'TODAS AS ROTAS';
  const x=(d?.individual||[]).find(i=>String(i.rota||'')===route);
  return x?`${x.rota} ${x.nome||''}`.trim():route;
}
function buildRows(d,route){
  const entries=catEntries(d), inds=(d?.individual||[]).filter(i=>!route||String(i.rota||'')===route), dias=weekdaysLeft();
  return entries.map(entry=>{
    let meta=0,realizado=0,found=false;
    for(const ind of inds){
      const r=findResult(ind,entry);if(!r)continue;
      found=true;meta+=Number(r.meta||0);realizado+=Number(r.realizado||0);
    }
    if(!found)return null;
    const falta=Math.max(meta-realizado,0);
    return {categoria:String(entry.cat?.nome||'').toUpperCase(),meta,realizado,falta,dias,diaria:dailyNeed(falta,dias)};
  }).filter(Boolean);
}
function addStyle(){
  if(q('acompReportStyle'))return;
  const s=document.createElement('style');s.id='acompReportStyle';s.textContent=`
#acompReportBox{margin-top:16px;background:#fff;border:1px solid #d8e0e6;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px #0001}
.acompReportHead{background:linear-gradient(180deg,#d90914,#ae0008);color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.acompReportHead h3{margin:0;font-size:18px;font-weight:950;text-transform:uppercase}.acompReportHead span{font-size:11px;font-weight:800;opacity:.95}
.acompReportControls{padding:12px 14px;background:#f6f8fa;display:grid;grid-template-columns:minmax(220px,1fr) auto auto;gap:10px;align-items:end;border-bottom:1px solid #e0e6eb}
.acompReportControls label{font-size:11px;font-weight:950;color:#34495e;text-transform:uppercase}.acompReportControls select{width:100%;padding:10px;border:1px solid #c5d0d9;border-radius:9px;background:#fff;font-weight:800;margin-top:4px}
.acompReportControls button{border:0;border-radius:9px;padding:11px 16px;font-weight:950;cursor:pointer;color:#fff}.acompReportGenerate{background:#e30613}.acompReportPdf{background:#0a8e3d}.acompReportPdf:disabled{background:#b9c1c7;cursor:not-allowed}
#acompReportStatus{padding:8px 14px 0;font-size:11px;font-weight:800;color:#475569}
#acompReportSummary{padding:10px 14px;display:flex;gap:7px;flex-wrap:wrap}.acompReportChip{background:#eef3f6;border:1px solid #d6e0e6;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:950}
.acompReportTableWrap{overflow:auto;padding:0 14px 14px}.acompReportTable{width:100%;border-collapse:collapse;min-width:760px}.acompReportTable th{background:#c8000a;color:#fff;padding:8px 6px;font-size:10px;text-transform:uppercase;border:1px solid #a80007}.acompReportTable td{padding:8px 6px;font-size:10px;border:1px solid #d4dce2;text-align:center;font-weight:800}.acompReportTable td:first-child{text-align:left;font-weight:950}.acompReportTable tr:nth-child(even) td{background:#f5f8fa}.acompReportFalta{color:#d90410!important}.acompReportOk{color:#078a46!important}.acompReportDiaria{color:#005db5!important;font-size:12px!important}.acompReportEmpty{padding:22px;text-align:center;font-size:12px;font-weight:800;color:#64748b}
@media(max-width:800px){.acompReportHead{padding:10px}.acompReportHead h3{font-size:13px}.acompReportControls{grid-template-columns:1fr 1fr;padding:9px}.acompReportControls label{grid-column:1/-1}.acompReportControls button{padding:10px 5px;font-size:9px}.acompReportTableWrap{padding:0 8px 10px}.acompReportTable{min-width:650px}.acompReportTable th,.acompReportTable td{font-size:8px;padding:6px 4px}.acompReportDiaria{font-size:9px!important}}
`;document.head.appendChild(s);
}
function ensureUI(){
  const root=q('acompSplitRoot');if(!root)return false;
  addStyle();
  if(q('acompReportBox'))return true;
  const box=document.createElement('section');box.id='acompReportBox';box.innerHTML=`
    <div class="acompReportHead"><div><h3>RELATÓRIO DE COBERTURAS</h3><span>META • REALIZADO • FALTA • META DIÁRIA PARA FECHAMENTO</span></div><span>DIAS ÚTEIS: SEGUNDA A SEXTA</span></div>
    <div class="acompReportControls">
      <label>ROTA<select id="acompReportRoute"><option value="">TODAS AS ROTAS</option></select></label>
      <button id="acompReportGenerate" class="acompReportGenerate">GERAR RELATÓRIO</button>
      <button id="acompReportPdf" class="acompReportPdf" disabled>📄 BAIXAR PDF</button>
    </div>
    <div id="acompReportStatus">Escolha a rota e clique em GERAR RELATÓRIO.</div>
    <div id="acompReportSummary"></div>
    <div id="acompReportResult"></div>`;
  root.insertAdjacentElement('afterend',box);
  q('acompReportGenerate').onclick=generate;
  q('acompReportPdf').onclick=downloadPdf;
  q('acompReportRoute').addEventListener('change',clearReport);
  fillRoutes(getDash());
  return true;
}
function fillRoutes(d){
  const sel=q('acompReportRoute');if(!sel||!d?.individual)return;
  const current=sel.value;
  const opts=(d.individual||[]).map(i=>`<option value="${esc(i.rota)}">${esc(i.rota)} ${esc(i.nome||'')}</option>`).join('');
  sel.innerHTML='<option value="">TODAS AS ROTAS</option>'+opts;
  if([...sel.options].some(o=>o.value===current))sel.value=current;
}
function clearReport(){
  lastRows=[];lastInfo=null;
  if(q('acompReportStatus'))q('acompReportStatus').textContent='Filtros alterados. Clique em GERAR RELATÓRIO.';
  if(q('acompReportSummary'))q('acompReportSummary').innerHTML='';
  if(q('acompReportResult'))q('acompReportResult').innerHTML='';
  if(q('acompReportPdf'))q('acompReportPdf').disabled=true;
}
function render(rows,info){
  const total=rows.reduce((a,r)=>({meta:a.meta+r.meta,realizado:a.realizado+r.realizado,falta:a.falta+r.falta}),{meta:0,realizado:0,falta:0});
  const dailyTotal=dailyNeed(total.falta,info.dias);
  q('acompReportSummary').innerHTML=`<span class="acompReportChip">ROTA: ${esc(info.rotaLabel)}</span><span class="acompReportChip">MÊS: ${esc(info.mes)}</span><span class="acompReportChip">DIAS ÚTEIS RESTANTES: ${info.dias}</span><span class="acompReportChip">META: ${total.meta}</span><span class="acompReportChip">REALIZADO: ${total.realizado}</span><span class="acompReportChip">FALTA: ${total.falta}</span><span class="acompReportChip">MÉDIA TOTAL/DIA: ${dailyTotal}</span>`;
  const pend=rows.filter(r=>r.falta>0);
  if(!pend.length){q('acompReportResult').innerHTML='<div class="acompReportEmpty">Nenhuma cobertura pendente para este filtro. Meta concluída.</div>';q('acompReportPdf').disabled=false;return}
  q('acompReportResult').innerHTML=`<div class="acompReportTableWrap"><table class="acompReportTable"><thead><tr><th>CATEGORIA</th><th>META</th><th>REALIZADO</th><th>FALTA</th><th>DIAS ÚTEIS RESTANTES</th><th>META DIÁRIA NECESSÁRIA</th></tr></thead><tbody>${pend.map(r=>`<tr><td>${esc(r.categoria)}</td><td>${r.meta}</td><td class="${r.realizado>=r.meta?'acompReportOk':''}">${r.realizado}</td><td class="acompReportFalta">${r.falta}</td><td>${r.dias}</td><td class="acompReportDiaria">${r.diaria}</td></tr>`).join('')}</tbody></table></div>`;
  q('acompReportPdf').disabled=false;
}
async function generate(){
  const btn=q('acompReportGenerate');if(!btn)return;
  btn.disabled=true;q('acompReportPdf').disabled=true;q('acompReportStatus').textContent='Atualizando dados do acompanhamento...';
  try{
    let d=null;
    try{if(typeof window.__fetchAdminDashboard==='function')d=await window.__fetchAdminDashboard(true)}catch(e){console.warn('Relatório: atualização do dashboard falhou, usando dados carregados.',e)}
    d=d||getDash();if(!d?.individual?.length)throw Error('Dados do acompanhamento ainda não estão disponíveis.');
    fillRoutes(d);
    const route=q('acompReportRoute').value||'',now=new Date(),dias=weekdaysLeft(now),rows=buildRows(d,route);
    const info={route,rotaLabel:routeLabel(d,route),dias,mes:monthLabel(now),data:dateLabel(now)};
    lastRows=rows;lastInfo=info;render(rows,info);
    q('acompReportStatus').textContent=`Relatório atualizado em ${info.data}. Contagem de dias úteis inclui hoje quando for de segunda a sexta.`;
  }catch(e){q('acompReportStatus').textContent='Erro: '+e.message;q('acompReportResult').innerHTML='<div class="acompReportEmpty">Não foi possível gerar o relatório.</div>'}
  finally{btn.disabled=false}
}
function loadScript(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o gerador de PDF.'));document.head.appendChild(s)})}
async function downloadPdf(){
  if(!lastInfo||!lastRows.length)return;
  const btn=q('acompReportPdf');btn.disabled=true;q('acompReportStatus').textContent='Gerando PDF...';
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',()=>!!window.jspdf);
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js',()=>!!window.jspdf?.jsPDF?.API?.autoTable);
    const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'}),pend=lastRows.filter(r=>r.falta>0);
    const total=lastRows.reduce((a,r)=>({meta:a.meta+r.meta,realizado:a.realizado+r.realizado,falta:a.falta+r.falta}),{meta:0,realizado:0,falta:0});
    doc.setFillColor(198,0,10);doc.rect(0,0,297,22,'F');doc.setTextColor(255,255,255);doc.setFontSize(16);doc.setFont(undefined,'bold');doc.text('RELATÓRIO DE COBERTURAS - EQUIPE ITURAMA',14,10);doc.setFontSize(9);doc.text(`ROTA: ${lastInfo.rotaLabel}   MÊS: ${lastInfo.mes}   EMISSÃO: ${lastInfo.data}`,14,17);
    doc.setTextColor(25,25,25);doc.setFontSize(9);doc.text(`DIAS ÚTEIS RESTANTES: ${lastInfo.dias}   |   META: ${total.meta}   |   REALIZADO: ${total.realizado}   |   FALTA: ${total.falta}   |   MÉDIA TOTAL/DIA: ${dailyNeed(total.falta,lastInfo.dias)}`,14,29);
    doc.autoTable({startY:34,head:[['CATEGORIA','META','REALIZADO','FALTA','DIAS ÚTEIS RESTANTES','META DIÁRIA NECESSÁRIA']],body:pend.map(r=>[r.categoria,String(r.meta),String(r.realizado),String(r.falta),String(r.dias),String(r.diaria)]),styles:{fontSize:8,cellPadding:2.4,overflow:'linebreak'},headStyles:{fillColor:[198,0,10],textColor:255,fontStyle:'bold'},columnStyles:{0:{cellWidth:105},1:{halign:'center',cellWidth:27},2:{halign:'center',cellWidth:30},3:{halign:'center',cellWidth:25},4:{halign:'center',cellWidth:42},5:{halign:'center',cellWidth:45}},margin:{left:10,right:10}});
    const safe=(lastInfo.route||'equipe').replace(/[^a-z0-9_-]+/gi,'_');doc.save(`relatorio_coberturas_${safe}_${new Date().toISOString().slice(0,10)}.pdf`);
    q('acompReportStatus').textContent='PDF gerado com sucesso.';
  }catch(e){q('acompReportStatus').textContent='Erro ao gerar PDF: '+e.message}
  finally{btn.disabled=false}
}
window.addEventListener('iturama:admindash',e=>{fillRoutes(e.detail);if(ensureUI()){} });
let n=0;const t=setInterval(()=>{if(ensureUI()||++n>180)clearInterval(t)},250);
})();