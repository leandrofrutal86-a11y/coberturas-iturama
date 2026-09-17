(()=>{
const CAT_TABLES={1:[1,2,12,16,17,21,13,18,19,20],2:[4,6,7,15,14,8,9,10,11]};
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cached=null,loading=null,lastLoad=0;

function visible(){const s=document.getElementById('acomp');return !!s&&!s.classList.contains('hide')}
function targetsReady(){return !!(document.getElementById('thAcomp1')&&document.getElementById('tbAcomp1')&&document.getElementById('thAcomp2')&&document.getElementById('tbAcomp2'))}
function localData(){
 if(window.__adminDash?.individual?.length)return window.__adminDash;
 try{if(typeof dash!=='undefined'&&dash?.individual?.length)return dash}catch{}
 return cached;
}
function entries(d,tableId){const cats=d?.categorias||[];return (CAT_TABLES[tableId]||[]).map(id=>{const idx=cats.findIndex(c=>Number(c.id)===Number(id));return idx>=0?{cat:cats[idx],idx}:null}).filter(Boolean)}
function result(ind,e){const arr=ind?.resultados||[];return arr.find(r=>Number(r?.categoria_id)===Number(e.cat?.id))||arr.find(r=>norm(r?.nome)===norm(e.cat?.nome))||arr[e.idx]||null}
function head(inds){return '<tr><th class="catHead" rowspan="2">CATEGORIA</th>'+inds.map(i=>`<th class="sepL" colspan="2">${esc(i.rota)} ${esc(i.nome)}</th>`).join('')+'<th class="teamHead sepL" colspan="2">TOTAL EQUIPE</th></tr><tr>'+inds.map(()=>'<th class="sepL">META</th><th><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th>').join('')+'<th class="teamHead sepL">META</th><th class="teamHead"><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th></tr>'}
function row(e,inds){let tm=0,tr=0,found=false;const cells=inds.map(i=>{const r=result(i,e);if(!r)return '<td class="metaCell sepL">—</td><td class="realCell">—</td>';found=true;const m=Number(r.meta||0),v=Number(r.realizado||0),ok=v>=m;tm+=m;tr+=v;return `<td class="metaCell sepL">${m}</td><td class="realCell ${ok?'ok':''}">${v}</td>`}).join('');const ok=found&&tr>=tm;return `<tr><td class="catCell">${esc(String(e.cat?.nome||'').toUpperCase())}</td>${cells}<td class="teamMeta sepL">${found?tm:'—'}</td><td class="teamReal ${ok?'ok':''}">${found?tr:'—'}</td></tr>`}
function showLoading(){if(!targetsReady())return;for(const id of [1,2]){const tb=document.getElementById('tbAcomp'+id);if(tb&&!tb.children.length)tb.innerHTML='<tr><td colspan="13" style="padding:14px;text-align:center;font-weight:800">CARREGANDO ACOMPANHAMENTO...</td></tr>'}}
function renderNow(d=localData()){
 if(!d?.individual?.length||!d?.categorias?.length||!targetsReady())return false;
 cached=d;window.__adminDash=d;
 for(const id of [1,2]){const th=document.getElementById('thAcomp'+id),tb=document.getElementById('tbAcomp'+id),inds=(d.individual||[]).slice(),list=entries(d,id);th.innerHTML=head(inds);tb.innerHTML=list.map(e=>row(e,inds)).join('')||'<tr><td colspan="13" style="padding:14px;text-align:center">SEM CATEGORIAS PARA EXIBIR</td></tr>'}
 return true;
}
window.renderAcompSplitNow=()=>renderNow();
async function fetchDash(force=false){
 const now=Date.now();if(!force&&cached&&now-lastLoad<30000)return cached;if(loading)return loading;
 const token=sessionStorage.getItem('admToken')||'';if(!token)return null;
 loading=(async()=>{
  try{
   let d=null;
   if(typeof window.__adminRobustPost==='function')d=await window.__adminRobustPost({action:'dashboard',token});
   else if(typeof window.post==='function')d=await window.post({action:'dashboard',token});
   else{
    const r=await fetch('https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'dashboard',token})});
    d=await r.json();if(!r.ok||d?.error)throw Error(d?.error||'Erro ao carregar acompanhamento');
   }
   if(d?.individual?.length){cached=d;window.__adminDash=d;lastLoad=Date.now();return d}
  }catch(e){console.warn('Acompanhamento geral:',e)}
  return null;
 })().finally(()=>loading=null);
 return loading;
}
async function trigger(force=false){
 if(!visible())return;
 let tries=0;while(!targetsReady()&&tries++<20)await new Promise(r=>setTimeout(r,100));
 if(!targetsReady())return;
 const local=localData();if(renderNow(local))return;
 showLoading();const fresh=await fetchDash(force);if(fresh)renderNow(fresh);
}
function patchAba(){
 if(typeof window.aba==='function'&&!window.aba.__acompPatched){const old=window.aba;window.aba=function(id,b){const out=old.apply(this,arguments);if(id==='acomp')setTimeout(()=>trigger(true),20);return out};window.aba.__acompPatched=true}
}
function boot(){
 patchAba();
 const a=document.getElementById('acomp');if(a)new MutationObserver(()=>{if(visible())trigger(false)}).observe(a,{attributes:true,attributeFilter:['class']});
 document.addEventListener('click',e=>{const b=e.target?.closest?.('button');if(b&&String(b.getAttribute('onclick')||'').includes("aba('acomp'"))setTimeout(()=>trigger(true),30)},true);
 setInterval(()=>{patchAba();if(visible()){const empty=[1,2].some(id=>!(document.getElementById('tbAcomp'+id)?.children.length));if(empty)trigger(false)}},1000);
 setTimeout(()=>trigger(false),300);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();