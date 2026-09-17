(()=>{
const CAT_TABLES={1:[1,2,12,16,17,21,13,18,19,20],2:[4,6,7,15,14,8,9,10,11]};
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function data(){try{return typeof dash!=='undefined'?dash:null}catch{return null}}
function visible(){const s=document.getElementById('acomp');return !!s&&!s.classList.contains('hide')}
function entries(d,tableId){const cats=d?.categorias||[];return (CAT_TABLES[tableId]||[]).map(id=>{const idx=cats.findIndex(c=>Number(c.id)===Number(id));return idx>=0?{cat:cats[idx],idx}:null}).filter(Boolean)}
function result(ind,e){const arr=ind?.resultados||[];return arr.find(r=>norm(r?.nome)===norm(e.cat?.nome))||arr[e.idx]||null}
function head(inds){return '<tr><th class="catHead" rowspan="2">CATEGORIA</th>'+inds.map(i=>`<th class="sepL" colspan="2">${esc(i.rota)} ${esc(i.nome)}</th>`).join('')+'<th class="teamHead sepL" colspan="2">TOTAL EQUIPE</th></tr><tr>'+inds.map(()=>'<th class="sepL">META</th><th>REALIZADO</th>').join('')+'<th class="teamHead sepL">META</th><th class="teamHead">REALIZADO</th></tr>'}
function row(e,inds){let tm=0,tr=0,found=false;const cells=inds.map(i=>{const r=result(i,e);if(!r)return '<td class="metaCell sepL">—</td><td class="realCell">—</td>';found=true;const m=Number(r.meta||0),v=Number(r.realizado||0),ok=v>=m;tm+=m;tr+=v;return `<td class="metaCell sepL">${m}</td><td class="realCell ${ok?'ok':''}">${v}</td>`}).join('');const ok=found&&tr>=tm;return `<tr><td class="catCell">${esc(String(e.cat?.nome||'').toUpperCase())}</td>${cells}<td class="teamMeta sepL">${found?tm:'—'}</td><td class="teamReal ${ok?'ok':''}">${found?tr:'—'}</td></tr>`}
function renderNow(){const d=data();if(!d?.individual?.length||!d?.categorias?.length)return false;for(const id of [1,2]){const th=document.getElementById('thAcomp'+id),tb=document.getElementById('tbAcomp'+id);if(!th||!tb)continue;const inds=(d.individual||[]).slice();th.innerHTML=head(inds);tb.innerHTML=entries(d,id).map(e=>row(e,inds)).join('')}return true}
window.renderAcompSplitNow=renderNow;
function trigger(){if(visible())requestAnimationFrame(()=>{renderNow();setTimeout(renderNow,120);setTimeout(renderNow,500)})}
const obs=new MutationObserver(m=>{if(m.some(x=>x.type==='attributes'||x.addedNodes?.length))trigger()});
function boot(){const a=document.getElementById('acomp');if(a)obs.observe(a,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});trigger();setInterval(()=>{if(visible())renderNow()},1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();