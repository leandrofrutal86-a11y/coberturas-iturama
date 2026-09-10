(()=>{
 const NAMES={'8A1':'Lucas','8B1':'Pedro Henrique','8C1':'Pedro Afonso','8D1':'Poliana','8F1':'Heitor'};
 function norm(v){return String(v||'').trim().toUpperCase()}
 function enhance(){
  const sec=document.getElementById('subcanaisPainel'),rota=document.getElementById('scRota'),old=document.getElementById('scBusca');
  if(!sec||!rota||!old){setTimeout(enhance,200);return}
  if(sec.dataset.admEnhanced)return;sec.dataset.admEnhanced='1';
  const label=rota.closest('div')?.querySelector('label');if(label)label.textContent='Consultor / Rota';
  [...rota.options].forEach(o=>{if(o.value==='ALL'){o.textContent='Todos os consultores';return}const n=NAMES[o.value||o.textContent];if(n)o.textContent=`${o.value||o.textContent} - ${n}`});
  const oldWrap=old.closest('div');if(oldWrap)oldWrap.style.display='none';
  const controls=rota.closest('.form3')||rota.parentElement?.parentElement;
  if(controls&&!document.getElementById('scClienteBusca')){
   const d=document.createElement('div');d.innerHTML='<label>Pesquisar cliente</label><input id="scClienteBusca" placeholder="PV, razão social ou subcanal...">';
   controls.insertBefore(d,controls.children[1]||null);
   const inp=d.querySelector('input');
   inp.addEventListener('input',filterClients);
  }
  const title=sec.querySelector('h2');if(title)title.textContent='🏪 Subcanais por Consultor';
  const p=sec.querySelector('h2 + p');if(p)p.textContent='Selecione todos ou um consultor, consulte a quantidade por subcanal e pesquise clientes por PV ou razão social.';
  rota.addEventListener('change',()=>setTimeout(()=>{decorateOptions();filterClients()},80));
  const cards=document.getElementById('scCards');if(cards)new MutationObserver(()=>setTimeout(filterClients,0)).observe(cards,{childList:true,subtree:true});
  const tb=document.getElementById('scTb');if(tb)new MutationObserver(()=>setTimeout(filterClients,0)).observe(tb,{childList:true});
  setTimeout(()=>{decorateOptions();filterClients()},100);
 }
 function decorateOptions(){const rota=document.getElementById('scRota');if(!rota)return;[...rota.options].forEach(o=>{const v=o.value||o.textContent;if(v==='ALL'){o.textContent='Todos os consultores';return}const n=NAMES[v];if(n)o.textContent=`${v} - ${n}`})}
 function filterClients(){
  const inp=document.getElementById('scClienteBusca'),tb=document.getElementById('scTb');if(!inp||!tb)return;
  const q=norm(inp.value);let visible=0;
  [...tb.querySelectorAll('tr')].forEach(tr=>{const ok=!q||norm(tr.textContent).includes(q);tr.style.display=ok?'':'none';if(ok)visible++});
  const title=document.getElementById('scTitle');if(title&&q)title.textContent=`Clientes encontrados (${visible})`;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();