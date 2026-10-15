(()=>{
'use strict';
const q=s=>document.querySelector(s);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
function iconFor(name){
 const n=norm(name);
 if(n.includes('TRIO P'))return '🧀';
 if(n.includes('CERVEJA')||n.includes('ESTRELLA'))return '★';
 if(n.includes('FINI')||n.includes('PERFETTI'))return '🍬';
 if(n.includes('CAMPARI'))return '🥃';
 if(n.includes('SMIRNOFF'))return '🥤';
 if(n.includes('MONSTER'))return '⚡';
 if(n.includes('FANTA'))return '🍊';
 if(n.includes('GOLD')||n.includes('BLACK')||n.includes('OLD PARR'))return '🥃';
 return '🎯';
}
function css(){
 if(document.getElementById('priorityIncentiveCss'))return;
 const s=document.createElement('style');s.id='priorityIncentiveCss';s.textContent=`
.quick .priorityIncentiveBtn{grid-column:span 2!important;order:3!important;background:#fff!important}
.quick .priorityIncentiveBtn:before{content:attr(data-icon)!important;background:#f0a800!important;color:#fff!important}
.quick .priorityIncentiveBtn[data-kind="beer"]:before{background:#099849!important}
@media(max-width:760px){.quick .priorityIncentiveBtn{grid-column:1!important}}
`;document.head.appendChild(s)
}
function config(){try{return Array.isArray(DATA?.incentivo_botoes)?DATA.incentivo_botoes:[]}catch{return[]}}
function clearDynamic(){document.querySelectorAll('.priorityIncentiveBtn').forEach(x=>x.remove())}
function baseFixed(){
 document.querySelectorAll('#dash .quick > .trio,#dash .quick > .hei').forEach(x=>x.style.setProperty('display','none','important'))
}
function categoryButton(row){
 const b=document.createElement('button');b.type='button';b.className='q cvBottomBtn priorityIncentiveBtn';
 b.dataset.id=String(row.id);b.dataset.icon=iconFor(row.titulo||row.categoria_nome);
 if(norm(row.titulo||row.categoria_nome).includes('CERVEJA'))b.dataset.kind='beer';
 const title=String(row.titulo||row.categoria_nome||'Incentivo');
 b.innerHTML=title;
 b.onclick=()=>{try{choose(row.categoria_nome||title)}catch(e){}};
 return b
}
function apply(){
 const quick=q('#dash .quick');if(!quick)return;
 const rows=config().slice().sort((a,b)=>Number(a.ordem)-Number(b.ordem)||Number(a.id)-Number(b.id));
 if(!rows.length)return;
 css();baseFixed();clearDynamic();
 const specials={b2b:document.getElementById('cvB2BOpen'),imperdoaveis:document.getElementById('impInternalBtn')};
 // Hide every special first; active config below turns it back on.
 Object.values(specials).forEach(el=>{if(el)el.style.setProperty('display','none','important')});
 const ordered=[];
 for(const row of rows){
  if(row.tipo==='categoria'){
   const b=categoryButton(row);ordered.push(b)
  }else if(row.tipo==='especial'){
   const el=specials[row.chave];if(el){el.style.removeProperty('display');ordered.push(el)}
  }
 }
 ordered.forEach(el=>quick.appendChild(el));
 // If a special module was created after this pass, the observer will re-apply.
}
let last='';
function signature(){
 try{return JSON.stringify((DATA?.incentivo_botoes||[]).map(x=>[x.id,x.tipo,x.chave,x.categoria_id,x.titulo,x.ordem]))}catch{return''}
}
function tick(){
 const sig=signature();if(sig&&sig!==last){last=sig;apply();return}
 if(sig)apply()
}
const observer=new MutationObserver(()=>{if(config().length)apply()});
observer.observe(document.documentElement,{childList:true,subtree:true});
setInterval(tick,2500);
let n=0;const t=setInterval(()=>{tick();if(++n>80)clearInterval(t)},250);
})();