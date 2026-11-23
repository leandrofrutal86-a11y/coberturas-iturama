(()=>{
'use strict';
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+'/'+m[2]+'/'+m[1]:String(v||'')};
let periodCfg=null,quickCfg=null,selectedPeriodCats=[],quickDates=[];
async function post(action,body={}){
 const token=sessionStorage.getItem('admToken')||'';
 const r=await fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token,...body})});
 const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro');return j
}
function css(){
 if($('salesPeriodReportStyle'))return;
 const s=document.createElement('style');s.id='salesPeriodReportStyle';s.textContent=`
.salesReportSec{background:#fff;border-radius:18px;padding:16px;margin-top:12px}.srSearchCard{background:linear-gradient(145deg,#e30613,#b4000a);border-radius:24px;padding:20px;color:#fff;box-shadow:0 8px 22px #8d001633}.srSearchTitle{display:flex;align-items:center;gap:14px;margin-bottom:16px}.srSearchIcon{width:62px;height:62px;border-radius:18px;background:#ffffff18;display:grid;place-items:center;font-size:32px}.srSearchTitle h2{margin:0;font-size:28px}.srSearchTitle small{display:block;margin-top:4px;color:#fff}.srWhiteBox{background:#fff;color:#182637;border-radius:18px;padding:16px;margin-top:12px}.srWhiteBox label{font-weight:900;display:block;margin-bottom:6px}.srWhiteBox input,.srWhiteBox select{width:100%;min-height:48px;border:1px solid #cbd5df;border-radius:14px;padding:10px 12px;font-size:15px}.srPeriodGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.srCategoryAdd{display:grid;grid-template-columns:1fr auto;gap:8px}.srPrimary{width:100%;margin-top:12px;background:#fff!important;color:#b4000a!important;font-weight:950;font-size:17px;border-radius:14px!important;padding:13px!important}.srSelected{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.srSelectedTag{display:inline-flex;align-items:center;gap:7px;background:#eef6ff;color:#174f8a;border:1px solid #bdd2e8;border-radius:999px;padding:7px 10px;font-weight:900;font-size:12px}.srSelectedTag button{border:0;background:transparent;color:#b40000;padding:0;font-size:15px}.srAllTag{background:#fff3f3;color:#b40000;border-color:#f0b4b8}.srTop{display:flex;justify-content:space-between;gap:10px;align-items:center}.srTop h2{margin:0}.srBack{background:#0f1d2d!important;color:#fff!important}.srControls{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px}.srControls input,.srControls select{width:100%}.srChips{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}.srChip{display:inline-flex;align-items:center;gap:7px;border:1px solid #bdd2e8;background:#eef6ff;border-radius:999px;padding:6px 9px;font-weight:800;font-size:12px}.srChip button{border:0;background:transparent;color:#b40000;padding:0}.srCats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.srCat{display:flex;gap:7px;align-items:center;border:1px solid #dce4eb;border-radius:10px;padding:8px;background:#fafcfe}.srCat input{width:auto}.srTableWrap{overflow:auto;border:1px solid #dce4eb;border-radius:12px;margin-top:14px}.srTable{width:100%;border-collapse:collapse;min-width:760px}.srTable th,.srTable td{padding:9px;border-bottom:1px solid #e6ebef;text-align:center}.srTable th:first-child,.srTable td:first-child,.srTable th:nth-child(2),.srTable td:nth-child(2){text-align:left}.srTable th{background:#f1f5f9;position:sticky;top:0;z-index:1}.srDayTotal{background:#fff3f3;font-weight:900}.srStatus{margin-top:10px}.srQuickHead{background:linear-gradient(135deg,#e30613,#8c0007);color:#fff;border-radius:12px;padding:12px;margin-top:12px}.srQuickHead b{font-size:17px}.srQuickHead small{display:block;margin-top:4px}.srBtns{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
@media(max-width:800px){.srCats{grid-template-columns:1fr}.srControls{grid-template-columns:1fr}.srTop{align-items:flex-start}.salesReportSec{padding:12px}.srTable{min-width:680px}}
`;document.head.appendChild(s)
}
function hideSections(){
 document.querySelectorAll('#app .wrap>section').forEach(x=>x.classList.add('hide'));
 document.getElementById('cokeHome')?.classList.add('hide')
}
function home(){
 document.querySelectorAll('#app .wrap>section').forEach(x=>x.classList.add('hide'));
 document.getElementById('cokeHome')?.classList.remove('hide');
 window.scrollTo({top:0,behavior:'smooth'})
}

function rangeDates(start,end){
 const out=[];if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||end<start)return out;
 let d=new Date(start+'T12:00:00Z'),last=new Date(end+'T12:00:00Z');
 while(d<=last&&out.length<31){out.push(d.toISOString().slice(0,10));d.setUTCDate(d.getUTCDate()+1)}
 return out
}
function renderSelectedPeriodCats(){
 const h=$('srPeriodSelected');if(!h||!periodCfg)return;
 const all=selectedPeriodCats.length===0;
 h.innerHTML=all?'<span class="srSelectedTag srAllTag">TODAS AS CATEGORIAS</span>':selectedPeriodCats.map(id=>{const c=(periodCfg.categorias||[]).find(x=>Number(x.id)===Number(id));return '<span class="srSelectedTag">'+E(c?.nome||id)+'<button type="button" data-rmcat="'+id+'">×</button></span>'}).join('');
 h.querySelectorAll('[data-rmcat]').forEach(b=>b.onclick=()=>{selectedPeriodCats=selectedPeriodCats.filter(x=>Number(x)!==Number(b.dataset.rmcat));renderSelectedPeriodCats();syncPeriodCategoryOptions()})
}
function syncPeriodCategoryOptions(){
 const sel=$('srPeriodCategory');if(!sel||!periodCfg)return;
 sel.innerHTML='<option value="">Escolha uma categoria para incluir</option><option value="ALL">Todas as categorias</option>'+
  (periodCfg.categorias||[]).filter(c=>!selectedPeriodCats.includes(Number(c.id))).map(c=>'<option value="'+c.id+'">'+E(c.nome)+'</option>').join('')
}
function addPeriodCategory(){
 const v=$('srPeriodCategory')?.value;if(!v)return;
 if(v==='ALL')selectedPeriodCats=[];
 else if(!selectedPeriodCats.includes(Number(v)))selectedPeriodCats.push(Number(v));
 renderSelectedPeriodCats();syncPeriodCategoryOptions()
}
function addDate(kind){
 const inp=$(kind==='period'?'srPeriodDate':'srQuickDate'),v=String(inp?.value||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return;
 const arr=kind==='period'?periodDates:quickDates;if(!arr.includes(v))arr.push(v);arr.sort();renderDateChips(kind);if(inp)inp.value=''
}
function renderDateChips(kind){
 const arr=kind==='period'?periodDates:quickDates,host=$(kind==='period'?'srPeriodDates':'srQuickDates');if(!host)return;
 host.innerHTML=arr.map(d=>'<span class="srChip">'+fmt(d)+'<button type="button" data-date="'+E(d)+'">×</button></span>').join('');
 host.querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=arr.indexOf(b.dataset.date);if(i>=0)arr.splice(i,1);renderDateChips(kind)})
}
function renderCats(){
 if(!periodCfg)return;syncPeriodCategoryOptions();renderSelectedPeriodCats()
}
async function loadPeriodCfg(){
 if(periodCfg)return periodCfg;periodCfg=await post('period_sales_report_config');renderCats();
 const p=$('srPeriodBase');if(p)p.textContent=periodCfg.period?.inicio&&periodCfg.period?.fim?'Base disponível: '+fmt(periodCfg.period.inicio)+' a '+fmt(periodCfg.period.fim):'Base sem período identificado';
 return periodCfg
}
async function runPeriod(){
 const st=$('srPeriodStatus'),out=$('srPeriodResult');st.className='srStatus';st.textContent='Gerando relatório...';out.innerHTML='';
 try{
  const start=$('srPeriodStart')?.value||'',end=$('srPeriodEnd')?.value||'',dates=rangeDates(start,end);
  if(!dates.length)throw Error('Informe uma data inicial e final válidas.');
  if(dates.length>31)throw Error('O período pode ter no máximo 31 dias.');
  const ids=selectedPeriodCats.length?selectedPeriodCats:(periodCfg?.categorias||[]).map(x=>Number(x.id));
  if(!ids.length)throw Error('Não há categorias disponíveis.');
  const j=await post('period_sales_report',{dates,category_ids:ids});
  const cats=j.categorias||[],rows=j.rows||[],totals=j.daily_totals||[];
  out.innerHTML='<div style="margin-top:14px"><h3 style="margin:0 0 4px">Resultado diário por consultor</h3><div class="small">Período: '+fmt(start)+' a '+fmt(end)+' • '+cats.length+' categoria(s)</div></div><div class="srTableWrap"><table class="srTable"><thead><tr><th>Data</th><th>Consultor / Rota</th>'+cats.map(c=>'<th>'+E(c.nome)+'</th>').join('')+'<th>Total</th></tr></thead><tbody>'+
  j.dates.map(date=>{
    const dayRows=rows.filter(r=>r.date===date);
    const body=dayRows.map(r=>'<tr><td>'+fmt(date)+'</td><td><b>'+E(r.nome)+'</b><br><small>'+E(r.rota)+'</small></td>'+cats.map(c=>'<td>'+Number(r.values?.[c.id]||0)+'</td>').join('')+'<td><b>'+Number(r.total||0)+'</b></td></tr>').join('');
    const t=totals.find(x=>x.date===date)||{};
    return body+'<tr class="srDayTotal"><td>'+fmt(date)+'</td><td>TOTAL DO DIA</td>'+cats.map(c=>'<td>'+Number(t.values?.[c.id]||0)+'</td>').join('')+'<td>'+Number(t.total||0)+'</td></tr>'
  }).join('')+'</tbody></table></div>';
  st.className='srStatus ok';st.textContent='Relatório gerado com sucesso.'
 }catch(e){st.className='srStatus bad';st.textContent=e.message}
}
async function loadQuickCfg(){
 if(quickCfg)return quickCfg;quickCfg=await post('quick_daily_report_config');
 const sel=$('srQuickIncentive');if(sel){sel.innerHTML='<option value="">Escolha o incentivo rápido</option>'+(quickCfg.items||[]).map(x=>'<option value="'+x.id+'">'+E(x.nome)+' • '+fmt(x.data_inicio)+' a '+fmt(x.data_fim)+'</option>').join('');sel.onchange=syncQuickInfo}
 return quickCfg
}
function syncQuickInfo(){
 const id=Number($('srQuickIncentive')?.value||0),inc=(quickCfg?.items||[]).find(x=>Number(x.id)===id),h=$('srQuickInfo');
 if(!h)return;h.innerHTML=inc?'<b>'+E(inc.nome)+'</b><small>Validade: '+fmt(inc.data_inicio)+' a '+fmt(inc.data_fim)+' • '+(inc.categorias||[]).length+' categoria(s)</small>':'Selecione um incentivo rápido.';
 if(inc&&$('srQuickDate')){$('srQuickDate').min=inc.data_inicio;$('srQuickDate').max=inc.data_fim}
}
async function runQuick(){
 const st=$('srQuickStatus'),out=$('srQuickResult');st.className='srStatus';st.textContent='Gerando relatório...';out.innerHTML='';
 try{
  const iid=Number($('srQuickIncentive')?.value||0);if(!iid)throw Error('Escolha um incentivo rápido.');if(!quickDates.length)throw Error('Adicione pelo menos uma data.');
  const j=await post('quick_daily_report',{incentive_id:iid,dates:quickDates}),cats=j.categorias||[],rows=j.rows||[],totals=j.daily_totals||[];
  out.innerHTML='<div class="srQuickHead"><b>'+E(j.incentivo?.nome||'Incentivo Rápido')+'</b><small>Validade: '+fmt(j.incentivo?.data_inicio)+' a '+fmt(j.incentivo?.data_fim)+'</small></div><div class="srTableWrap"><table class="srTable"><thead><tr><th>Data</th><th>Consultor / Rota</th>'+cats.map(c=>'<th>'+E(c.nome)+'</th>').join('')+'<th>Total</th></tr></thead><tbody>'+
  j.dates.map(date=>{
    const dayRows=rows.filter(r=>r.date===date);
    const body=dayRows.map(r=>'<tr><td>'+fmt(date)+'</td><td><b>'+E(r.nome)+'</b><br><small>'+E(r.rota)+'</small></td>'+cats.map(c=>'<td>'+Number(r.values?.[c.id]||0)+'</td>').join('')+'<td><b>'+Number(r.total||0)+'</b></td></tr>').join('');
    const t=totals.find(x=>x.date===date)||{};
    return body+'<tr class="srDayTotal"><td>'+fmt(date)+'</td><td>TOTAL DO DIA</td>'+cats.map(c=>'<td>'+Number(t.values?.[c.id]||0)+'</td>').join('')+'<td>'+Number(t.total||0)+'</td></tr>'
  }).join('')+'</tbody></table></div>';
  st.className='srStatus ok';st.textContent='Relatório do incentivo rápido gerado.'
 }catch(e){st.className='srStatus bad';st.textContent=e.message}
}
function openPeriod(){
 hideSections();const s=$('salesPeriodReport');s.classList.remove('hide');window.scrollTo({top:0});loadPeriodCfg().catch(e=>{$('srPeriodStatus').className='bad';$('srPeriodStatus').textContent=e.message})
}
function openQuick(){
 hideSections();const s=$('quickDailySalesReport');s.classList.remove('hide');window.scrollTo({top:0});loadQuickCfg().catch(e=>{$('srQuickStatus').className='bad';$('srQuickStatus').textContent=e.message})
}
window.openSalesPeriodReport=openPeriod;window.openQuickDailySalesReport=openQuick;
function ensure(){
 css();const wrap=document.querySelector('#app>.wrap'),grid=document.querySelector('#cokeHome .topicVendas .menuGrid');if(!wrap||!grid)return false;
 if(!$('salesPeriodReport')){
  const sec=document.createElement('section');sec.id='salesPeriodReport';sec.className='hide salesReportSec';sec.innerHTML=`
  <div class="srTop" style="margin-bottom:12px"><div></div><button type="button" class="srBack" id="srPeriodBack">← Voltar</button></div>
  <div class="srSearchCard">
   <div class="srSearchTitle"><span class="srSearchIcon">📅</span><div><h2>Relatório com Período</h2><small>Pesquise o realizado diário de cada consultor</small></div></div>
   <div class="srWhiteBox">
    <div id="srPeriodBase" class="small" style="margin-bottom:10px"></div>
    <div class="srPeriodGrid"><div><label>Data inicial</label><input id="srPeriodStart" type="date"></div><div><label>Data final</label><input id="srPeriodEnd" type="date"></div></div>
    <div style="margin-top:12px"><label>Categorias que vão aparecer</label><div class="srCategoryAdd"><select id="srPeriodCategory"></select><button type="button" id="srPeriodAddCat">INCLUIR</button></div><div id="srPeriodSelected" class="srSelected"></div></div>
    <button id="srPeriodRun" type="button" class="srPrimary">Pesquisar relatório ›</button>
    <div id="srPeriodStatus" class="srStatus small"></div>
   </div>
  </div>
  <div id="srPeriodResult"></div>`;wrap.appendChild(sec);
  $('srPeriodBack').onclick=home;$('srPeriodRun').onclick=runPeriod;$('srPeriodAddCat').onclick=addPeriodCategory
 }
 if(!$('quickDailySalesReport')){
  const sec=document.createElement('section');sec.id='quickDailySalesReport';sec.className='hide salesReportSec';sec.innerHTML=`
  <div class="srTop"><div><h2>⚡ Vendas Diárias — Incentivo Rápido</h2><div class="small">Realizado diário de cada consultor nas categorias do incentivo</div></div><button type="button" class="srBack" id="srQuickBack">← Voltar</button></div>
  <h3>1. Escolha o incentivo rápido</h3><select id="srQuickIncentive"></select><div id="srQuickInfo" class="srQuickHead">Selecione um incentivo rápido.</div>
  <h3>2. Escolha os dias</h3><div class="srControls"><input id="srQuickDate" type="date"><button id="srQuickAdd" type="button">+ ADICIONAR DIA</button></div><div id="srQuickDates" class="srChips"></div>
  <div class="srBtns"><button id="srQuickRun" type="button" class="red">GERAR RELATÓRIO</button><button id="srQuickClear" type="button">LIMPAR DATAS</button></div><div id="srQuickStatus" class="srStatus small"></div><div id="srQuickResult"></div>`;wrap.appendChild(sec);
  $('srQuickBack').onclick=home;$('srQuickAdd').onclick=()=>addDate('quick');$('srQuickRun').onclick=runQuick;$('srQuickClear').onclick=()=>{quickDates=[];renderDateChips('quick')};$('srQuickDate').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addDate('quick')}}
 }
 if(!$('salesPeriodReportCard')){
  const b=document.createElement('button');b.id='salesPeriodReportCard';b.className='menuCard';b.type='button';b.innerHTML='<span class="mi" style="background:#1d4ed8">📅</span><span><b>Relatório com Período</b><small>Escolha o período e as categorias para ver o realizado diário</small></span>';b.onclick=openPeriod;grid.appendChild(b)
 }
 if(!$('quickDailySalesReportCard')){
  const b=document.createElement('button');b.id='quickDailySalesReportCard';b.className='menuCard';b.type='button';b.innerHTML='<span class="mi" style="background:#f97316">⚡</span><span><b>Vendas Diárias — Incentivo Rápido</b><small>Veja o realizado por dia e consultor no incentivo escolhido</small></span>';b.onclick=openQuick;grid.appendChild(b)
 }
 return true
}
let n=0;const t=setInterval(()=>{if(ensure()||++n>80)clearInterval(t)},200);
window.addEventListener('pageshow',()=>setTimeout(ensure,250));
})();