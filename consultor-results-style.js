(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let relRows=[],relInfo=null,observer=null,scheduled=false;
function diasUteisRestantes(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const ultimo=new Date(now.getFullYear(),now.getMonth()+1,0);
  const limite=new Date(ultimo.getFullYear(),ultimo.getMonth(),ultimo.getDate()-1);
  let n=0;
  for(;d<=limite;d.setDate(d.getDate()+1)){const w=d.getDay();if(w!==0&&w!==6)n++}
  return n;
}
function metaDiaria(falta,dias){const f=Math.max(0,Number(falta)||0);if(!f)return 0;return dias?Math.ceil(f/dias):f}
function painelAberto(){const d=$('dash');return !!d&&!d.classList.contains('hidden')}
function isMeu(){try{return typeof TAB==='undefined'||TAB==='meu'}catch{return true}}
function ownRows(){try{return Array.isArray(DATA?.own)?DATA.own:[]}catch{return[]}}
function consultor(){try{return DATA?.consultor||{}}catch{return{}}}
function ensureStyle(){
  let st=$('consultorResultsStyle');if(st)st.remove();
  st=document.createElement('style');st.id='consultorResultsStyle';st.textContent=`
#results{width:100%;max-width:100%}#results .tableWrap{border:1px solid #d6dee6;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px #0000000d;margin-top:8px}
#results table{width:100%;min-width:0;border-collapse:collapse;table-layout:fixed}#results thead th{background:#b70712;color:#fff;font-weight:900;padding:8px 5px;text-align:center;font-size:10px}
#results thead th:first-child{text-align:left;width:34%}#results tbody tr:nth-child(odd) td{background:#f2f8fd}#results tbody tr:nth-child(even) td{background:#fff}
#results tbody td{padding:7px 5px;border-bottom:1px solid #dfe7ee;text-align:center;font-size:10px;vertical-align:middle}#results tbody td:first-child{text-align:left;font-weight:900;color:#10263a}
#results .res-ok{color:#0b8a46;font-weight:900}#results .res-bad{color:#d71920;font-weight:900}#results .meta-num{font-weight:900}#results .falta-num{font-weight:900;color:#c5161d}#results .pct-ok{color:#0b8a46;font-weight:900}#results .pct-bad{color:#d71920;font-weight:900}#results .meta-dia{font-weight:950;color:#075fae;font-size:12px}
#results .daily-note{margin:6px 0 4px;padding:7px 9px;border-radius:9px;background:#eef5fb;color:#28465f;font-size:9px;font-weight:900;text-align:center}
#consultorRelatorio{margin-top:10px;border:1px solid #d8e0e6;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 3px 12px #0001}#consultorRelatorio.hiddenRel{display:none!important}
.crHead{background:linear-gradient(180deg,#d90914,#ad0008);color:#fff;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}.crHead b{font-size:14px}.crHead small{font-size:9px;font-weight:800;opacity:.95}
.crBtns{padding:8px;background:#f5f7f9}.crBtns button{display:block;width:100%;border:0;border-radius:9px;padding:11px 12px;color:#fff;font-size:11px;font-weight:950;cursor:pointer;background:#087d37}.crBtns button:disabled{background:#b8c1c8;cursor:not-allowed}
#crResumo{display:flex;gap:5px;flex-wrap:wrap;padding:7px 10px}.crChip{font-size:8px;font-weight:900;background:#eef3f6;border:1px solid #d4dde4;border-radius:999px;padding:5px 7px}
#crResultado{padding:0 10px 10px}.crTableWrap{overflow:hidden;border:1px solid #dce3e8;border-radius:9px}.crTable{width:100%;border-collapse:collapse;table-layout:fixed}.crTable th{background:#c3000b;color:#fff;padding:7px 4px;font-size:9px}.crTable td{padding:7px 4px;border-bottom:1px solid #e0e6eb;text-align:center;font-size:9px;font-weight:800}.crTable td:first-child{text-align:left;font-weight:900}.crTable tr:nth-child(even) td{background:#f5f8fa}.crEmpty{padding:14px;text-align:center;font-size:10px;font-weight:800;color:#64748b}
@media(max-width:760px){
 .panel{padding:6px!important}.head{gap:4px!important}.panel h2{font-size:14px!important;margin:2px 0!important}.head small{font-size:9px!important}.head select{padding:7px!important;font-size:11px!important}
 #results .tableWrap{width:100%!important;max-width:100%!important;overflow:hidden!important;margin-top:5px!important;border-radius:8px!important}
 #results table{display:table!important;width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:collapse!important}
 #results thead{display:table-header-group!important}#results tbody{display:table-row-group!important}
 #results tr{display:table-row!important}#results th,#results td{display:table-cell!important;box-sizing:border-box!important;min-width:0!important;white-space:normal!important;overflow-wrap:anywhere!important}
 #results thead th{padding:6px 1px!important;font-size:6.6px!important;line-height:1.02!important;text-align:center!important}
 #results thead th:first-child{width:42%!important;text-align:left!important;padding-left:4px!important}
 #results thead th:nth-child(2){width:10%!important}#results thead th:nth-child(3){width:13%!important}#results thead th:nth-child(4){width:10%!important}#results thead th:nth-child(5){width:9%!important}#results thead th:nth-child(6){width:16%!important}
 #results tbody td{padding:6px 1px!important;font-size:7.4px!important;line-height:1.06!important;text-align:center!important;border-right:1px solid #e1e7ec!important}
 #results tbody td:first-child{width:42%!important;text-align:left!important;padding-left:4px!important;font-size:7.2px!important;font-weight:900!important}
 #results tbody td:nth-child(2){width:10%!important}#results tbody td:nth-child(3){width:13%!important}#results tbody td:nth-child(4){width:10%!important}#results tbody td:nth-child(5){width:9%!important}#results tbody td:nth-child(6){width:16%!important;border-right:0!important}
 #results .meta-dia{font-size:8.2px!important}.daily-note{font-size:8px!important;margin:5px 0 4px!important}
 .crHead{padding:8px}.crHead b{font-size:12px}.crBtns{display:block;padding:6px}.crBtns button{width:100%;font-size:10px;padding:10px 8px}.crChip{font-size:7px;padding:4px 6px}#crResumo{padding:5px 7px}
 #crResultado{padding:0 6px 7px}.crTableWrap{width:100%;overflow:hidden}.crTable{display:table;width:100%;min-width:0;table-layout:fixed}.crTable thead{display:table-header-group}.crTable tbody{display:table-row-group}.crTable tr{display:table-row}.crTable th,.crTable td{display:table-cell;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere}
 .crTable th{font-size:6.8px;padding:6px 1px}.crTable td{font-size:7.5px;padding:6px 1px}.crTable th:first-child,.crTable td:first-child{width:48%;text-align:left;padding-left:4px}.crTable th:nth-child(2),.crTable td:nth-child(2){width:11%}.crTable th:nth-child(3),.crTable td:nth-child(3){width:14%}.crTable th:nth-child(4),.crTable td:nth-child(4){width:11%}.crTable th:nth-child(5),.crTable td:nth-child(5){width:16%}
}
`;
  document.head.appendChild(st)
}
function decorateResults(){
  if(!painelAberto())return;const results=$('results'),table=results?.querySelector('table');if(!table)return;
  const meu=isMeu(),head=table.querySelector('thead tr');
  if(meu&&head&&head.cells.length===5){const th=document.createElement('th');th.textContent='Meta/dia';head.appendChild(th)}
  const dias=diasUteisRestantes();
  table.querySelectorAll('tbody tr').forEach(tr=>{
    if(tr.cells.length<5)return;const meta=Number(String(tr.cells[1].textContent).replace(',','.'))||0,real=Number(String(tr.cells[2].textContent).replace(',','.'))||0,falta=Math.max(Number(String(tr.cells[3].textContent).replace(',','.'))||0,0),ok=real>=meta;
    tr.cells[1].classList.add('meta-num');tr.cells[2].classList.add(ok?'res-ok':'res-bad');tr.cells[3].classList.add('falta-num');tr.cells[4].classList.add(ok?'pct-ok':'pct-bad');
    if(meu&&tr.cells.length===5){const b=tr.insertCell();b.className='meta-dia';b.textContent=String(metaDiaria(falta,dias))}
    const labs=['','Meta','Real','Falta','%','Meta/dia'];[...tr.cells].forEach((c,i)=>{if(i>0)c.dataset.label=labs[i]||''})
  });
  let note=results.querySelector('.daily-note');if(meu){if(!note){note=document.createElement('div');note.className='daily-note';table.parentElement?.insertAdjacentElement('beforebegin',note)}note.textContent=`Dias úteis restantes: ${dias}. Meta/dia calculada de segunda a sexta, sem contar o último dia do mês.`}else note?.remove();
  ensureReport();toggleReport();if(meu)gerarRelatorio();
}
function reportRows(){const dias=diasUteisRestantes();return ownRows().map(x=>{const meta=Number(x.meta||0),real=Number(x.realizado||0),falta=Math.max(meta-real,0);return{nome:String(x.nome||''),meta,real,falta,dias,diaria:metaDiaria(falta,dias)}}).filter(x=>x.falta>0)}
function ensureReport(){
  if($('consultorRelatorio'))return;const results=$('results');if(!results)return;
  const box=document.createElement('section');box.id='consultorRelatorio';box.innerHTML=`<div class="crHead"><div><b>RELATÓRIO INDIVIDUAL</b><br><small>META • REALIZADO • FALTA • META/DIA</small></div><small>DIAS ÚTEIS NO TOPO • ÚLTIMO DIA FORA</small></div><div class="crBtns"><button id="crDownload">⬇️ BAIXAR TABELA</button></div><div id="crResumo"></div><div id="crResultado"></div>`;
  results.insertAdjacentElement('afterend',box);$('crDownload').onclick=baixarTabela
}
function toggleReport(){const b=$('consultorRelatorio');if(b)b.classList.toggle('hiddenRel',!isMeu())}
function gerarRelatorio(){
  const rows=reportRows(),c=consultor(),dias=diasUteisRestantes(),agora=new Date(),mes=agora.toLocaleDateString('pt-BR',{month:'long',year:'numeric'}).toUpperCase();
  relRows=rows;relInfo={nome:c.nome||'',rota:c.rota||'',dias,mes,data:agora.toLocaleDateString('pt-BR')};
  const all=ownRows(),tot=all.reduce((a,x)=>{const m=Number(x.meta||0),r=Number(x.realizado||0);a.meta+=m;a.real+=r;a.falta+=Math.max(m-r,0);return a},{meta:0,real:0,falta:0});
  $('crResumo').innerHTML=`<span class="crChip">${esc(relInfo.rota)} ${esc(relInfo.nome)}</span><span class="crChip">META ${tot.meta}</span><span class="crChip">REAL ${tot.real}</span><span class="crChip">FALTA ${tot.falta}</span><span class="crChip">DIAS ${dias}</span>`;
  if(!rows.length)$('crResultado').innerHTML='<div class="crEmpty">Nenhuma cobertura pendente. Meta concluída.</div>';else $('crResultado').innerHTML=`<div class="crTableWrap"><table class="crTable"><thead><tr><th>Categoria</th><th>Meta</th><th>Realizado</th><th>Falta</th><th>Meta/dia</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.nome)}</td><td>${r.meta}</td><td>${r.real}</td><td>${r.falta}</td><td>${r.diaria}</td></tr>`).join('')}</tbody></table></div>`;
}

function loadScript(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o gerador de imagem.'));document.head.appendChild(s)})}
async function baixarTabela(){
  gerarRelatorio();
  if(!relInfo)return;
  const btn=$('crDownload');if(btn){btn.disabled=true;btn.textContent='GERANDO IMAGEM...'}
  let stage=null;
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
    const all=ownRows(),tot=all.reduce((a,x)=>{const m=Number(x.meta||0),r=Number(x.realizado||0);a.meta+=m;a.real+=r;a.falta+=Math.max(m-r,0);return a},{meta:0,real:0,falta:0});
    const rows=relRows.map(r=>`<tr><td>${esc(r.nome)}</td><td>${r.meta}</td><td>${r.real}</td><td>${r.falta}</td><td>${r.diaria}</td></tr>`).join('')||'<tr><td colspan="5">Nenhuma cobertura pendente. Meta concluída.</td></tr>';
    stage=document.createElement('div');
    stage.style.cssText='position:fixed;left:-10000px;top:0;width:1400px;background:#fff;color:#142236;font-family:Arial,sans-serif;padding:0;z-index:-1';
    stage.innerHTML=`
      <div style="background:linear-gradient(180deg,#d90914,#ad0008);color:#fff;padding:26px 30px">
        <div style="font-size:30px;font-weight:900">RELATÓRIO INDIVIDUAL</div>
        <div style="font-size:17px;font-weight:800;margin-top:8px">META • REALIZADO • FALTA • META/DIA</div>
        <div style="font-size:15px;font-weight:700;margin-top:10px">${esc(relInfo.rota)} ${esc(relInfo.nome)} • ${esc(relInfo.mes)} • EMISSÃO ${esc(relInfo.data)}</div>
      </div>
      <div style="padding:18px 24px 8px;font-size:16px;font-weight:800">Dias úteis restantes: ${relInfo.dias}. Segunda a sexta, sem considerar o último dia do mês.</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:10px 24px 18px">
        <span style="background:#eef3f6;border:1px solid #d4dde4;border-radius:999px;padding:10px 16px;font-weight:900">META ${tot.meta}</span>
        <span style="background:#eef3f6;border:1px solid #d4dde4;border-radius:999px;padding:10px 16px;font-weight:900">REALIZADO ${tot.real}</span>
        <span style="background:#eef3f6;border:1px solid #d4dde4;border-radius:999px;padding:10px 16px;font-weight:900">FALTA ${tot.falta}</span>
      </div>
      <div style="padding:0 24px 28px">
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:18px">
          <thead><tr>
            <th style="width:52%;background:#c3000b;color:#fff;padding:14px 12px;text-align:left;border:1px solid #a90009">Categoria</th>
            <th style="width:12%;background:#c3000b;color:#fff;padding:14px 8px;border:1px solid #a90009">Meta</th>
            <th style="width:14%;background:#c3000b;color:#fff;padding:14px 8px;border:1px solid #a90009">Realizado</th>
            <th style="width:10%;background:#c3000b;color:#fff;padding:14px 8px;border:1px solid #a90009">Falta</th>
            <th style="width:12%;background:#c3000b;color:#fff;padding:14px 8px;border:1px solid #a90009">Meta/dia</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    document.body.appendChild(stage);
    stage.querySelectorAll('tbody tr').forEach((tr,i)=>{tr.querySelectorAll('td').forEach((td,j)=>{td.style.cssText=`padding:13px 12px;border:1px solid #d6dde4;text-align:${j===0?'left':'center'};font-weight:${j===0?'900':'800'};background:${i%2?'#f5f8fa':'#fff'}`})});
    const canvas=await window.html2canvas(stage,{scale:3,backgroundColor:'#ffffff',useCORS:true,logging:false,width:1400,windowWidth:1400});
    const blob=await new Promise(ok=>canvas.toBlob(ok,'image/png',1));
    if(!blob)throw Error('Não foi possível criar a imagem.');
    const a=document.createElement('a'),url=URL.createObjectURL(blob);
    a.href=url;a.download=`tabela_coberturas_${String(relInfo.rota||'consultor').replace(/[^a-z0-9_-]/gi,'_')}_${new Date().toISOString().slice(0,10)}.png`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }catch(e){alert('Erro ao baixar tabela: '+(e?.message||e))}
  finally{stage?.remove();if(btn){btn.disabled=false;btn.textContent='⬇️ BAIXAR TABELA'}}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorateResults()})}
function startWhenReady(){if(!painelAberto()){setTimeout(startWhenReady,500);return}ensureStyle();ensureReport();decorateResults();const r=$('results');if(r&&!observer){observer=new MutationObserver(schedule);observer.observe(r,{childList:true,subtree:true})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(startWhenReady,300),{once:true});else setTimeout(startWhenReady,300);
})();