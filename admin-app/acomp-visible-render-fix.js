(()=>{
const TABLE1_IDS=[1,2,12,16,17,21,13,18,19,20];
const TABLE2_BASE_IDS=[4,6,7,15,14,8,9,10,11];
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cached=null,loading=null,lastTry=0;
function visible(){const s=document.getElementById('acomp');return !!s&&!s.classList.contains('hide')}
function ready(){return !!(document.getElementById('thAcomp1')&&document.getElementById('tbAcomp1')&&document.getElementById('thAcomp2')&&document.getElementById('tbAcomp2'))}
function localData(){if(window.__adminDash?.individual?.length)return window.__adminDash;try{if(typeof dash!=='undefined'&&dash?.individual?.length)return dash}catch{}return cached}
function entries(d,id){
 const cats=d?.categorias||[];
 const used=new Set([...TABLE1_IDS,...TABLE2_BASE_IDS].map(Number));
 const ids=id===1?TABLE1_IDS:[...TABLE2_BASE_IDS,...cats.filter(c=>!used.has(Number(c.id))).map(c=>Number(c.id))];
 return ids.map(cid=>{const idx=cats.findIndex(c=>Number(c.id)===Number(cid));return idx>=0?{cat:cats[idx],idx}:null}).filter(Boolean)
}
function result(ind,e){const arr=ind?.resultados||[];return arr.find(r=>Number(r?.categoria_id)===Number(e.cat?.id))||arr.find(r=>norm(r?.nome)===norm(e.cat?.nome))||arr[e.idx]||null}
function head(inds){return '<tr><th class="catHead" rowspan="2">CATEGORIA</th>'+inds.map(i=>`<th class="sepL" colspan="2">${esc(i.rota)} ${esc(i.nome)}</th>`).join('')+'<th class="teamHead sepL" colspan="2">EQUIPE</th></tr><tr>'+inds.map(()=>'<th class="sepL">META</th><th><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th>').join('')+'<th class="teamHead sepL">META</th><th class="teamHead"><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th></tr>'}
function row(e,inds){let tm=0,tr=0,found=false;const cells=inds.map(i=>{const r=result(i,e);if(!r)return '<td class="metaCell sepL">—</td><td class="realCell">—</td>';found=true;const m=Number(r.meta||0),v=Number(r.realizado||0),ok=v>=m;tm+=m;tr+=v;return `<td class="metaCell sepL">${m}</td><td class="realCell ${ok?'ok':''}">${v}</td>`}).join('');const ok=found&&tr>=tm;return `<tr><td class="catCell">${esc(String(e.cat?.nome||'').toUpperCase())}</td>${cells}<td class="teamMeta sepL">${found?tm:'—'}</td><td class="teamReal ${ok?'ok':''}">${found?tr:'—'}</td></tr>`}
function message(txt){if(!ready())return;for(const id of [1,2]){const tb=document.getElementById('tbAcomp'+id);if(tb)tb.innerHTML=`<tr><td colspan="13" style="padding:14px 6px;text-align:center;font-weight:900;font-size:11px">${esc(txt)}</td></tr>`}}
function renderNow(d=localData()){if(!d?.individual?.length||!d?.categorias?.length||!ready())return false;cached=d;window.__adminDash=d;for(const id of [1,2]){const th=document.getElementById('thAcomp'+id),tb=document.getElementById('tbAcomp'+id),inds=(d.individual||[]).slice(),list=entries(d,id);th.innerHTML=head(inds);tb.innerHTML=list.map(e=>row(e,inds)).join('')||'<tr><td colspan="13" style="padding:14px;text-align:center">SEM CATEGORIAS PARA EXIBIR</td></tr>'}return true}
window.renderAcompSplitNow=d=>renderNow(d||localData());
async function obtain(force=false){if(renderNow())return localData();if(loading)return loading;const now=Date.now();if(!force&&now-lastTry<1500)return null;lastTry=now;loading=(async()=>{try{
  if(typeof window.__fetchAdminDashboard==='function'){const d=await window.__fetchAdminDashboard(force);if(renderNow(d))return d}
  if(typeof window.__refreshAdminData==='function'){const r=await window.__refreshAdminData(force);if(renderNow(r?.dash))return r?.dash}
  const token=sessionStorage.getItem('admToken')||'';if(!token)throw Error('Sessão do ADM não encontrada. Entre novamente.');
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),35000);try{const r=await fetch('https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api?v='+Date.now(),{method:'POST',mode:'cors',cache:'no-store',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify({action:'dashboard',token}),signal:ctrl.signal});const d=await r.json().catch(()=>({}));if(!r.ok||d?.error)throw Error(d?.error||'Falha ao carregar dados');if(renderNow(d))return d}finally{clearTimeout(to)}
 }catch(e){console.warn('Acompanhamento geral:',e);message('NÃO FOI POSSÍVEL CARREGAR. VOLTE AO MENU E ENTRE NOVAMENTE NO ACOMPANHAMENTO.')}return null})().finally(()=>loading=null);return loading}
async function trigger(force=false){if(!visible())return;let n=0;while(!ready()&&n++<30)await new Promise(r=>setTimeout(r,100));if(!ready())return;if(renderNow())return;message('CARREGANDO ACOMPANHAMENTO...');obtain(force)}
window.addEventListener('iturama:admindash',e=>{if(e.detail)renderNow(e.detail)});
function patch(){if(typeof window.aba==='function'&&!window.aba.__acomp2){const old=window.aba;window.aba=function(id,b){const out=old.apply(this,arguments);if(id==='acomp')setTimeout(()=>trigger(true),20);return out};window.aba.__acomp2=true}}
function boot(){patch();const a=document.getElementById('acomp');if(a)new MutationObserver(()=>{if(visible())trigger(true)}).observe(a,{attributes:true,attributeFilter:['class']});document.addEventListener('click',e=>{const card=e.target?.closest?.('.menuCard');if(card&&norm(card.textContent).includes('ACOMPANHAMENTO'))setTimeout(()=>trigger(true),50)},true);setInterval(()=>{patch();if(visible()&&!renderNow())trigger(false)},1200);setTimeout(()=>trigger(false),250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();