(()=>{
function diasUteisRestantes(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const ultimo=new Date(now.getFullYear(),now.getMonth()+1,0);
  const limite=new Date(ultimo.getFullYear(),ultimo.getMonth(),ultimo.getDate()-1);
  let n=0;
  for(;d<=limite;d.setDate(d.getDate()+1)){
    const w=d.getDay();
    if(w!==0&&w!==6)n++;
  }
  return n;
}
function metaDiaria(falta,dias){
  const f=Math.max(0,Number(falta)||0);
  if(!f)return 0;
  if(!dias)return f;
  return Math.ceil(f/dias);
}
function isMeu(){try{return typeof TAB==='undefined'||TAB==='meu'}catch{return true}}
function style(){
  let st=document.getElementById('consultorResultsStyle');
  if(st)return;
  st=document.createElement('style');st.id='consultorResultsStyle';st.textContent=`
#results .tableWrap{border:1px solid #d6dee6;border-radius:16px;overflow:hidden;box-shadow:0 5px 18px #0000000d}
#results table{width:100%;min-width:0;border-collapse:separate!important;border-spacing:0!important;table-layout:fixed!important}
#results thead th{background:linear-gradient(180deg,#c5141d,#9f0710)!important;color:#fff!important;border-bottom:2px solid #7f060c!important;font-weight:900!important;padding:10px 7px!important}
#results thead th:first-child{border-radius:12px 0 0 0}#results thead th:last-child{border-radius:0 12px 0 0}
#results tbody tr:nth-child(odd) td{background:#eef7ff!important}#results tbody tr:nth-child(even) td{background:#fff!important}
#results tbody td{padding:9px 7px!important;border-bottom:1px solid #dfe7ee!important;vertical-align:middle}#results tbody tr:last-child td{border-bottom:0!important}
#results tbody td:first-child{font-weight:900;color:#10263a}#results tbody tr:hover td{filter:brightness(.985)}
#results .res-ok{color:#0b8a46!important;font-weight:900}#results .res-bad{color:#d71920!important;font-weight:900}
#results .meta-num{font-weight:800;color:#111}#results .falta-num{font-weight:800;color:#5d6975}
#results .pct-ok{color:#0b8a46;font-weight:900}#results .pct-bad{color:#d71920;font-weight:900}
#results .dias-uteis{font-weight:900;color:#475569;text-align:center!important}#results .meta-dia{font-weight:950;color:#075fae;text-align:center!important;font-size:13px}
#results .daily-note{margin-top:8px;padding:8px 10px;border-radius:10px;background:#eef5fb;color:#28465f;font-size:10px;font-weight:800;text-align:center}
@media(max-width:760px){
 #results .tableWrap{width:100%!important;overflow:hidden!important}#results table{width:100%!important;min-width:0!important;max-width:100%!important;table-layout:fixed!important;font-size:8px!important}
 #results thead th,#results tbody td{padding:6px 2px!important;font-size:8px!important;line-height:1.08!important;white-space:normal!important;word-break:normal!important;overflow-wrap:anywhere!important;text-align:center!important}
 #results th:nth-child(1),#results td:nth-child(1){width:31%!important;text-align:left!important;padding-left:5px!important}
 #results th:nth-child(2),#results td:nth-child(2){width:9%!important}#results th:nth-child(3),#results td:nth-child(3){width:13%!important}
 #results th:nth-child(4),#results td:nth-child(4){width:10%!important}#results th:nth-child(5),#results td:nth-child(5){width:9%!important}
 #results th:nth-child(6),#results td:nth-child(6){width:12%!important}#results th:nth-child(7),#results td:nth-child(7){width:16%!important}
 #results .res-ok,#results .res-bad{font-size:10px!important}#results .meta-dia{font-size:10px!important}
 #results .daily-note{font-size:9px;padding:7px}
}
`;document.head.appendChild(st)
}
function apply(){
  const results=document.getElementById('results');if(!results)return;style();
  const table=results.querySelector('table');if(!table)return;
  const meu=isMeu(),head=table.querySelector('thead tr');
  if(meu&&head&&head.cells.length===5){
    const d=document.createElement('th');d.textContent='Dias úteis';head.appendChild(d);
    const m=document.createElement('th');m.textContent='Meta/dia';head.appendChild(m);
  }
  const dias=diasUteisRestantes();
  results.querySelectorAll('tbody tr').forEach(tr=>{
    if(tr.cells.length<5)return;
    const meta=Number(String(tr.cells[1].textContent).replace(',','.'))||0;
    const real=Number(String(tr.cells[2].textContent).replace(',','.'))||0;
    const falta=Math.max(Number(String(tr.cells[3].textContent).replace(',','.'))||0,0);
    const ok=real>=meta;
    tr.cells[1].classList.add('meta-num');
    tr.cells[2].classList.remove('res-ok','res-bad');tr.cells[2].classList.add(ok?'res-ok':'res-bad');
    tr.cells[3].classList.add('falta-num');
    tr.cells[4].classList.remove('pct-ok','pct-bad');tr.cells[4].classList.add(ok?'pct-ok':'pct-bad');
    if(meu&&tr.cells.length===5){
      const cDias=tr.insertCell();cDias.className='dias-uteis';cDias.textContent=String(dias);
      const cMeta=tr.insertCell();cMeta.className='meta-dia';cMeta.textContent=String(metaDiaria(falta,dias));
    }
  });
  const old=results.querySelector('.daily-note');
  if(meu){
    if(!old){const n=document.createElement('div');n.className='daily-note';table.parentElement?.insertAdjacentElement('afterend',n)}
    const note=results.querySelector('.daily-note');if(note)note.textContent=`Meta diária calculada com ${dias} dia${dias===1?'':'s'} útil${dias===1?'':'eis'} restante${dias===1?'':'s'}, de segunda a sexta. O último dia do mês não é considerado.`;
  }else if(old)old.remove();
}
function boot(){
  apply();const target=document.getElementById('results');
  if(target&&!target.dataset.metaDiariaObserver){target.dataset.metaDiariaObserver='1';new MutationObserver(apply).observe(target,{childList:true,subtree:true})}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,250));else setTimeout(boot,250);
setTimeout(boot,1000);
})();