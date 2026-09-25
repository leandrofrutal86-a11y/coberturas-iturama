(()=>{
const q=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toUpperCase();
const ORDER=[1,2,12,16,17,21,13,18,19,20,4,6,7,15,14,8,9,10,11];
let route='',name='',rows=[],signature='',revision=0,readyFile=null,pending=null;
function dashData(){try{return window.__adminDash?.individual?.length?window.__adminDash:(typeof dash!=='undefined'?dash:window.dash)}catch{return window.__adminDash||window.dash}}
function daysLeft(){const now=new Date(),last=new Date(now.getFullYear(),now.getMonth()+1,0);let n=0;for(let d=new Date(now.getFullYear(),now.getMonth(),now.getDate());d<last;d.setDate(d.getDate()+1))if(d.getDay()!==0&&d.getDay()!==6)n++;return n}
function css(){
 if(q('aciCss'))return;
 const s=document.createElement('style');s.id='aciCss';s.textContent=[
 '#acompIndividualPanel{background:#fff;border:1px solid #dce3ea;border-radius:17px;overflow:hidden;box-shadow:0 5px 20px #0002;min-width:0}',
 '#acompIndividualPanel .aciHead{background:linear-gradient(#df0915,#ae0008);color:#fff;padding:16px}',
 '#acompIndividualPanel .aciHead h3{margin:0;font-weight:950;font-size:19px}',
 '#acompIndividualPanel .aciHead small{display:block;margin-top:5px;font-size:11px}',
 '#acompIndividualPanel .aciControls{padding:13px 16px;background:#f4f8fb}',
 '#acompIndividualPanel label{display:block;font-size:11px;font-weight:950;color:#35495e;margin-bottom:6px}',
 '#acompIndividualPanel select{width:100%;padding:12px;border:1px solid #bcc8d2;border-radius:10px;background:white;font-weight:850;font-size:14px}',
 '#acompIndividualPanel .aciBody{padding:10px 14px 14px}',
 '#acompIndividualPanel .aciTitle{background:#c90813;color:#fff;padding:12px;text-align:center;font-size:17px;font-weight:950}',
 '#acompIndividualPanel .aciTitle small{display:block;margin-top:3px;font-size:11px}',
 '#acompIndividualPanel .aciInfo{background:#edf5fc;color:#274b68;text-align:center;padding:9px;font-size:11px;font-weight:850}',
 '#acompIndividualPanel .aciTableWrap{overflow-x:auto}',
 '#acompIndividualPanel table{width:100%;border-collapse:collapse;table-layout:fixed;min-width:0}',
 '#acompIndividualPanel th{position:static!important;background:#b90712!important;color:white!important;text-align:center;padding:9px 4px;font-size:10px;border:1px solid #a80009;font-weight:950}',
 '#acompIndividualPanel th:first-child{width:38%;text-align:left}',
 '#acompIndividualPanel td{padding:8px 4px;text-align:center;border:1px solid #dbe3ea;font-size:10px;font-weight:850;line-height:1.2}',
 '#acompIndividualPanel td:first-child{text-align:left;font-weight:950;overflow-wrap:anywhere}',
 '#acompIndividualPanel tbody tr:nth-child(odd) td{background:#f0f7ff}',
 '#acompIndividualPanel tbody tr:nth-child(even) td{background:#fff}',
 '#acompIndividualPanel .aciBlue{color:#045ead}#acompIndividualPanel .aciRed{color:#ca101b}#acompIndividualPanel .aciGreen{color:#068444}',
 '#acompIndividualPanel .aciFooter{background:linear-gradient(#c7000b,#a70007);padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}',
 '#acompIndividualPanel .aciFooter button{border:0;border-radius:9px;padding:12px 5px;color:#fff;font-size:11px;font-weight:950;cursor:pointer}',
 '#acompIndividualPanel #aciDownload{background:linear-gradient(#168af1,#0065bb)}#acompIndividualPanel #aciShare{background:linear-gradient(#20a858,#087840)}',
 '#acompIndividualPanel .aciFooter button:disabled{opacity:.65;cursor:wait}',
 '#acompIndividualPanel #aciStatus{grid-column:1/-1;color:#fff;text-align:center;font-size:11px;min-height:12px}',
 '#acompIndividualPanel .aciEmpty{padding:25px;text-align:center;color:#68788a;font-weight:800}',
 '@media(max-width:760px){#acompIndividualPanel .aciHead{padding:11px}#acompIndividualPanel .aciHead h3{font-size:15px}#acompIndividualPanel .aciBody{padding:6px}#acompIndividualPanel th{font-size:7px;padding:6px 1px}#acompIndividualPanel td{font-size:7.5px;padding:6px 1px}#acompIndividualPanel th:first-child{width:40%}#acompIndividualPanel .aciTitle{font-size:12px}#acompIndividualPanel .aciFooter{padding:6px;gap:5px}#acompIndividualPanel .aciFooter button{font-size:8px;padding:9px 3px}#acompIndividualPanel #aciStatus{font-size:9px}}'
 ].join('\n');document.head.appendChild(s)
}
function ensure(){
 const root=q('acompSplitRoot');if(!root)return false;
 css();q('acompReportBox')?.remove();
 if(q('acompIndividualPanel'))return true;
 const el=document.createElement('section');el.id='acompIndividualPanel';
 el.innerHTML='<div class="aciHead"><h3>👤 CONSULTA POR CONSULTOR</h3><small>Acompanhamento individual de coberturas • resultados do consultor</small></div><div class="aciControls"><label for="aciRoute">SELECIONE A ROTA</label><select id="aciRoute"><option value="">ESCOLHA UM CONSULTOR...</option></select></div><div class="aciBody" id="aciBody"><div class="aciEmpty">Selecione uma rota para visualizar o acompanhamento individual.</div></div>';
 root.appendChild(el);q('aciRoute').onchange=e=>{route=e.target.value;signature='';invalidate();render(true)};
 return true
}
function invalidate(){revision++;readyFile=null;const b=q('aciShare');if(b)b.textContent='📤 COMPARTILHAR IMAGEM';const s=q('aciStatus');if(s)s.textContent=''}
function extract(d,ind){
 const cats=d.categorias||[],days=daysLeft(),ids=[...ORDER,...cats.filter(c=>!ORDER.includes(Number(c.id))).map(c=>Number(c.id))];
 return ids.map(id=>{
  const idx=cats.findIndex(c=>Number(c.id)===id);if(idx<0)return null;
  const cat=cats[idx],arr=ind.resultados||[],r=arr.find(x=>Number(x.categoria_id)===id)||arr.find(x=>norm(x.nome)===norm(cat.nome))||arr[idx];
  if(!r)return null;
  const meta=Number(r.meta||0),real=Number(r.realizado||0),falta=Math.max(0,meta-real);
  return{cat:String(cat.nome||r.nome||'').toUpperCase(),meta,real,falta,pct:meta?Math.round(real/meta*100):0,day:falta?days?Math.ceil(falta/days):falta:0}
 }).filter(Boolean)
}
function htmlTable(list){
 return '<div class="aciTableWrap"><table><thead><tr><th>CATEGORIA</th><th>META</th><th>REALIZADO</th><th>FALTA</th><th>%</th><th>META/DIA</th></tr></thead><tbody>'+
 list.map(r=>'<tr><td>'+esc(r.cat)+'</td><td class="aciBlue">'+r.meta+'</td><td class="'+(r.real>=r.meta?'aciGreen':'aciRed')+'">'+r.real+'</td><td class="'+(r.falta?'aciRed':'aciGreen')+'">'+r.falta+'</td><td class="'+(r.real>=r.meta?'aciGreen':'aciRed')+'">'+r.pct+'%</td><td class="aciBlue">'+r.day+'</td></tr>').join('')+'</tbody></table></div>'
}
function render(force=false){
 if(!ensure())return;const d=dashData();if(!d?.individual?.length)return;
 const sel=q('aciRoute'),options=d.individual.map(i=>String(i.rota||'')+'|'+String(i.nome||'')).join(';');
 if(sel.dataset.options!==options){
  const previous=route||sel.value;
  sel.innerHTML='<option value="">ESCOLHA UM CONSULTOR...</option>'+d.individual.map(i=>'<option value="'+esc(i.rota)+'">'+esc(i.rota)+' • '+esc(i.nome)+'</option>').join('');
  sel.dataset.options=options;sel.value=d.individual.some(i=>String(i.rota)===previous)?previous:'';route=sel.value
 }
 if(!route){if(force)q('aciBody').innerHTML='<div class="aciEmpty">Selecione uma rota para visualizar o acompanhamento individual.</div>';return}
 const ind=d.individual.find(i=>String(i.rota)===route);if(!ind)return;
 const list=extract(d,ind),sig=route+'|'+ind.nome+'|'+daysLeft()+'|'+list.map(r=>[r.cat,r.meta,r.real].join(':')).join(';');
 if(!force&&sig===signature)return;
 rows=list;name=String(ind.nome||'');signature=sig;invalidate();
 q('aciBody').innerHTML='<div class="aciTitle">ACOMPANHAMENTO DE COBERTURAS<small>'+esc(route)+' • '+esc(name)+'</small></div><div class="aciInfo">Dias úteis restantes: '+daysLeft()+' • Segunda a sexta, sem contar o último dia do mês</div>'+htmlTable(list)+'<div class="aciFooter"><button id="aciDownload" type="button">⬇️ BAIXAR IMAGEM</button><button id="aciShare" type="button">📤 COMPARTILHAR IMAGEM</button><div id="aciStatus" aria-live="polite"></div></div>';
 q('aciDownload').onclick=download;q('aciShare').onclick=share
}
function status(t,bad=false){const x=q('aciStatus');if(x){x.textContent=t||'';x.style.color=bad?'#fff2a4':'#fff'}}
function busy(on){const a=q('aciDownload'),b=q('aciShare');if(a){a.disabled=on;a.textContent=on?'⏳ PREPARANDO...':'⬇️ BAIXAR IMAGEM'}if(b){b.disabled=on;b.textContent=on?'⏳ PREPARANDO...':readyFile?'📤 COMPARTILHAR (PRONTO)':'📤 COMPARTILHAR IMAGEM'}}
function canvasLib(){
 return new Promise((ok,no)=>{if(window.html2canvas)return ok();let s=q('aciCanvasLib');if(s){s.addEventListener('load',ok,{once:true});s.addEventListener('error',no,{once:true});return}
 s=document.createElement('script');s.id='aciCanvasLib';s.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';s.onload=ok;s.onerror=()=>{s.remove();no(Error('Não foi possível carregar o gerador de imagem.'))};document.head.appendChild(s)})
}
async function prepare(){
 if(readyFile)return readyFile;if(pending)return pending;
 if(!rows.length)throw Error('Selecione um consultor antes de baixar.');
 const snapshot=rows.map(r=>({...r})),rt=route,nm=name,days=daysLeft(),version=revision;
 busy(true);status('Gerando imagem em alta resolução...');
 const task=(async()=>{
  await canvasLib();
  const stage=document.createElement('div');stage.style.cssText='position:fixed;left:-11000px;top:0;width:1200px;background:#fff;color:#172534;font-family:Arial,sans-serif;z-index:-1';
  const head=['CATEGORIA','META','REALIZADO','FALTA','%','META/DIA'].map((v,i)=>'<th style="background:#b90712;color:#fff;text-align:'+(i?'center':'left')+';padding:11px 8px;border:1px solid #a80009;'+(i?'':'width:38%')+'">'+v+'</th>').join('');
  const body=snapshot.map((r,i)=>'<tr>'+[r.cat,r.meta,r.real,r.falta,r.pct+'%',r.day].map((v,j)=>'<td style="background:'+(i%2?'#fff':'#f0f7ff')+';text-align:'+(j?'center':'left')+';border:1px solid #dbe3ea;padding:10px 8px;font-weight:850;color:'+(j===1||j===5?'#045ead':j===2||j===3||j===4?r.real>=r.meta?'#058443':'#ca101b':'#172534')+'">'+esc(v)+'</td>').join('')+'</tr>').join('');
  stage.innerHTML='<div style="background:#c90813;color:#fff;padding:23px 26px"><div style="font-size:26px;font-weight:950">ACOMPANHAMENTO DE COBERTURAS</div><div style="font-size:16px;margin-top:8px">'+esc(rt)+' • '+esc(nm)+'</div><div style="font-size:13px;margin-top:8px">Dias úteis restantes: '+days+'</div></div><div style="padding:18px 20px"><table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px"><thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody></table></div>';
  document.body.appendChild(stage);
  try{
   const canvas=await window.html2canvas(stage,{scale:window.innerWidth<800?1.6:2,backgroundColor:'#fff',useCORS:true,logging:false,width:1200,windowWidth:1200});
   const png=await new Promise((ok,no)=>canvas.toBlob(v=>v?ok(v):no(Error('Não foi possível gerar a imagem.')),'image/png',1));
   const f=new File([png],'acompanhamento_'+rt+'_'+new Date().toISOString().slice(0,10)+'.png',{type:'image/png'});
   if(version===revision){readyFile=f;status('Imagem pronta! Você pode baixar ou compartilhar.')}return f
  }finally{stage.remove()}
 })();
 pending=task;
 try{return await task}catch(e){status(e?.message||'Erro ao gerar imagem.',true);throw e}finally{if(pending===task)pending=null;busy(false)}
}
function save(f){const u=URL.createObjectURL(f),a=document.createElement('a');a.href=u;a.download=f.name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000)}
async function download(){try{const f=await prepare();save(f);status('Imagem baixada. Também pode compartilhar.')}catch(e){status(e?.message||'Falha no download.',true)}}
function share(){
 if(!readyFile){prepare().then(()=>status('Imagem pronta! Toque novamente em COMPARTILHAR IMAGEM.')).catch(()=>{});return}
 const f=readyFile;let supported=!!navigator.share;try{if(supported&&navigator.canShare)supported=navigator.canShare({files:[f]})}catch{supported=false}
 if(!supported){save(f);status('Compartilhamento indisponível: imagem baixada para envio.');return}
 try{Promise.resolve(navigator.share({files:[f],title:'Acompanhamento '+route+' • '+name})).catch(e=>{if(e?.name!=='AbortError')status(e?.message||'Não foi possível compartilhar.',true)})}catch(e){status(e?.message||'Não foi possível compartilhar.',true)}
}
window.addEventListener('iturama:admindash',()=>render());
let tries=0;const timer=setInterval(()=>{if(ensure()){render();if(++tries>120)clearInterval(timer)}else if(++tries>120)clearInterval(timer)},500);
setInterval(()=>{if(q('acompIndividualPanel')&&route)render()},6000);
})();