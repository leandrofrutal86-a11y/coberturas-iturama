(()=>{
const q=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function catName(v){const s=esc(v).trim(),p=s.split(/\s+/);if(p.length<2)return s;const cut=Math.ceil(p.length/2);return p.slice(0,cut).join(' ')+'<br>'+p.slice(cut).join(' ')}
function getDash(){try{return typeof dash!=='undefined'&&dash?dash:(window.dash||null)}catch{return window.dash||null}}

const TABLES=[
 {id:1,title:'TABELA 1',file:'acompanhamento-geral-tabela-1-iturama',cats:[
  {label:'PERFETTI',keys:['PERFETTI']},
  {label:'FINI',keys:['FINI']},
  {label:'TRIO PÃO DE QUEIJO',keys:['TRIO PÃO DE QUEIJO']},
  {label:'COMPRA B2B',keys:['COMPRA B2B']},
  {label:'RECOMPRA B2B',keys:['RECOMPRA B2B']},
  {label:'COBERTURA FRUT GERAL',keys:['COBERTURA FRUT GERAL']},
  {label:'COBERTURA CERVEJA GERAL',keys:['COBERTURA CERVEJA GERAL','COBERTURA CERVEJA GERAL HEINEKEN']},
  {label:'IMPERDOÁVEIS SSD',keys:['IMPERDOÁVEIS SSD','IMPERDOAVEIS SSD']},
  {label:'IMPERDOÁVEIS STILL',keys:['IMPERDOÁVEIS STILL','IMPERDOAVEIS STILL']},
  {label:'IMPERDOÁVEIS ARTD',keys:['IMPERDOÁVEIS ARTD','IMPERDOAVEIS ARTD']}
 ]},
 {id:2,title:'TABELA 2',file:'acompanhamento-geral-tabela-2-iturama',cats:[
  {label:'COBERTURA CAMPARI',keys:['COBERTURA CAMPARI']},
  {label:'BLACK LABEL',keys:['BLACK LABEL','BLACK LABEL TODAS']},
  {label:'OLD PARR',keys:['OLD PARR','OLD PARR TODAS']},
  {label:'COBERTURA GOLD LABEL',keys:['COBERTURA GOLD LABEL']},
  {label:'SMIRNOFF RED VODKA',keys:['SMIRNOFF RED VODKA']},
  {label:'COBERTURA SMIRNOFF ICE LATA',keys:['COBERTURA SMIRNOFF ICE LATA','SMIRNOFF ICE LATA']},
  {label:'ESTRELLA GERAL',keys:['ESTRELLA GERAL']},
  {label:'ESTRELLA TOSTADA',keys:['ESTRELLA TOSTADA','ESTRELLA 0 TOSTADA']},
  {label:'ESTRELLA RGB',keys:['ESTRELLA RGB']}
 ]}
];

function matches(name,def){const n=norm(name);return def.keys.some(k=>norm(k)===n)}
function findResult(ind,def){return (ind?.resultados||[]).find(r=>matches(r?.nome,def))||null}

function style(){
 let s=q('acompExportStyle');if(!s){s=document.createElement('style');s.id='acompExportStyle';document.head.appendChild(s)}
 s.textContent=`
#acomp .box{padding:10px!important;background:#f5f7f9}#acomp h2{margin:0 0 2px}.acompLegacyTable{display:none!important}.acompSplitRoot{display:grid;gap:16px;margin-top:10px}.acompCard{background:#fff;border:1px solid #d8dee5;border-radius:14px;padding:10px;box-shadow:0 4px 14px #0000000d}.acompCardHead{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px}.acompCardHead h3{margin:0;color:#142236}.acompCardHead small{display:block;color:#69737d;margin-top:2px}.acompToolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.acompBtn{border:0;border-radius:9px;padding:9px 13px;font-weight:800;cursor:pointer}.acompBtn.pdf{background:#df1017;color:#fff}.acompBtn.img{background:#20252b;color:#fff}.acompExportArea{background:#fff;padding:8px;border:1px solid #d8dee5;border-radius:12px;overflow:auto}.acompExportTitle{font-size:16px;font-weight:900;color:#142236;margin:0 0 2px}.acompExportNote{font-size:10px;color:#59636d;margin-bottom:6px}.acompExportArea table{border-collapse:collapse!important;width:max-content!important;min-width:0!important;background:#fff;border:1px solid #cfd6dd;table-layout:fixed!important}.acompExportArea th,.acompExportArea td{border:1px solid #cbd4dc!important;text-align:center!important;vertical-align:middle!important;box-sizing:border-box!important}.acompExportArea thead tr:first-child th{background:#e30613!important;color:#fff!important;font-size:10px!important;line-height:1.08!important;font-weight:900!important;padding:5px 2px!important;height:31px!important;border-color:#b9000b!important;border-bottom:1px solid #fff!important}.acompExportArea thead tr:nth-child(2) th{background:#e30613!important;color:#fff!important;font-size:8px!important;font-weight:900!important;padding:4px 1px!important;height:21px!important;border-color:#b9000b!important}.acompExportArea th.consHead{width:180px!important;min-width:180px!important;max-width:180px!important;white-space:nowrap!important;text-align:left!important;padding-left:8px!important}.acompExportArea th.catHead{width:138px!important;min-width:138px!important;max-width:138px!important;white-space:normal!important;border-left:2px solid #fff!important;border-right:2px solid #fff!important}.acompExportArea .subMeta,.acompExportArea .subReal,.acompExportArea .subFalta{color:#fff!important;width:46px!important;min-width:46px!important;max-width:46px!important}.acompExportArea tbody td{padding:4px 2px!important;height:34px!important;font-size:11px!important;font-weight:800;background:#fff}.acompExportArea tbody tr:nth-child(odd):not(.teamTotal) td{background:#eaf4fb!important}.acompExportArea tbody tr:nth-child(even):not(.teamTotal) td{background:#fff!important}.acompExportArea .namecell{width:180px!important;min-width:180px!important;max-width:180px!important;text-align:left!important;padding-left:8px!important;white-space:nowrap!important;font-size:12px!important;font-weight:900!important;border-right:2px solid #9aa9b5!important}.acompExportArea .metaCell{color:#111!important;width:46px!important;min-width:46px!important;max-width:46px!important}.acompExportArea .realCell{width:46px!important;min-width:46px!important;max-width:46px!important}.acompExportArea .realCell.ok{color:#16803a!important}.acompExportArea .realCell.bad{color:#0d47d9!important}.acompExportArea .faltaCell{color:#e30613!important;font-weight:900!important;width:46px!important;min-width:46px!important;max-width:46px!important}.acompExportArea .faltaCell.ok{color:#16803a!important}.acompExportArea .groupStart{border-left:2px solid #9aa9b5!important}.acompExportArea .groupEnd{border-right:2px solid #9aa9b5!important}.acompExportArea tbody tr.teamTotal td{background:#d3d3d3!important;font-weight:950!important;border-top:2px solid #9aa0a6!important}.acompExportArea tbody tr.teamTotal .namecell{color:#111!important;text-transform:uppercase!important}.acompExportArea tbody tr.teamTotal .realCell{color:#0d47d9!important}.acompExportArea tbody tr.teamTotal .faltaCell{color:#e30613!important}@media(max-width:700px){#acomp .box{padding:7px!important}.acompCard{padding:7px}.acompExportArea{padding:4px}.acompExportArea th.consHead,.acompExportArea .namecell{width:170px!important;min-width:170px!important;max-width:170px!important}.acompExportArea th.catHead{width:126px!important;min-width:126px!important;max-width:126px!important}.acompExportArea .subMeta,.acompExportArea .subReal,.acompExportArea .subFalta,.acompExportArea .metaCell,.acompExportArea .realCell,.acompExportArea .faltaCell{width:42px!important;min-width:42px!important;max-width:42px!important}}
`;
}

function ensureLayout(){
 const sec=q('acomp');if(!sec)return null;const box=sec.querySelector('.box');if(!box)return null;
 const legacy=box.querySelector('table.wide')||box.querySelector('table');if(legacy)legacy.classList.add('acompLegacyTable');
 let root=q('acompSplitRoot');
 if(!root){
  root=document.createElement('div');root.id='acompSplitRoot';root.className='acompSplitRoot';
  root.innerHTML=TABLES.map(t=>`<section class="acompCard"><div class="acompCardHead"><div><h3>${t.title}</h3><small>Categorias na ordem definida • Meta, Real e Falta</small></div><div class="acompToolbar"><button class="acompBtn img" onclick="exportarAcompImagem(${t.id})">🖼️ BAIXAR IMAGEM</button><button class="acompBtn pdf" onclick="exportarAcompPDF(${t.id})">📄 BAIXAR PDF</button></div></div><div id="acompExportArea${t.id}" class="acompExportArea"><div class="acompExportTitle">Acompanhamento Geral - Equipe Iturama • ${t.title}</div><div class="acompExportNote">Cada categoria separada em Meta, Real e Falta, com total da equipe.</div><table><thead id="thAcomp${t.id}"></thead><tbody id="tbAcomp${t.id}"></tbody></table></div></section>`).join('');
  if(legacy)legacy.insertAdjacentElement('afterend',root);else box.appendChild(root);
 }
 return root;
}

function cellHtml(r){
 if(!r)return '<td class="metaCell groupStart">—</td><td class="realCell">—</td><td class="faltaCell groupEnd">—</td>';
 const meta=Number(r.meta||0),real=Number(r.realizado||0),falta=Math.max(meta-real,0),ok=real>=meta;
 return `<td class="metaCell groupStart">${meta}</td><td class="realCell ${ok?'ok':'bad'}">${real}</td><td class="faltaCell groupEnd ${ok?'ok':''}">${ok?'✓':falta}</td>`;
}

function renderOne(t,d){
 const th=q('thAcomp'+t.id),tb=q('tbAcomp'+t.id);if(!th||!tb)return false;const inds=d.individual||[];
 th.innerHTML='<tr><th class="consHead" rowspan="2">CONSULTOR</th>'+t.cats.map(c=>`<th class="catHead" colspan="3">${catName(c.label)}</th>`).join('')+'</tr><tr>'+t.cats.map(()=>'<th class="subMeta groupStart">META</th><th class="subReal">REAL</th><th class="subFalta groupEnd">FALTA</th>').join('')+'</tr>';
 let rows=inds.map(i=>'<tr><td class="namecell">'+esc(i.rota+' - '+i.nome)+'</td>'+t.cats.map(c=>cellHtml(findResult(i,c))).join('')+'</tr>').join('');
 const totals=t.cats.map(c=>{let meta=0,real=0,found=false;inds.forEach(i=>{const r=findResult(i,c);if(r){found=true;meta+=Number(r.meta||0);real+=Number(r.realizado||0)}});if(!found)return '<td class="metaCell groupStart">—</td><td class="realCell">—</td><td class="faltaCell groupEnd">—</td>';const falta=Math.max(meta-real,0),ok=real>=meta;return `<td class="metaCell groupStart">${meta}</td><td class="realCell ${ok?'ok':'bad'}">${real}</td><td class="faltaCell groupEnd ${ok?'ok':''}">${ok?'✓':falta}</td>`}).join('');
 rows+=`<tr class="teamTotal"><td class="namecell">EQUIPE</td>${totals}</tr>`;tb.innerHTML=rows;return true;
}

function render(){const d=getDash();if(!d)return false;ensureLayout();let ok=true;TABLES.forEach(t=>{if(!renderOne(t,d))ok=false});return ok}

function load(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o recurso de exportação.'));document.head.appendChild(s)})}
async function capture(id){
 await load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
 const a=q('acompExportArea'+id);if(!a)throw Error('Tabela não encontrada.');
 const old={w:a.style.width,o:a.style.overflow};a.style.width=a.scrollWidth+'px';a.style.overflow='visible';
 const scale=Math.min(4,Math.max(2.8,5200/Math.max(a.scrollWidth,1)));
 try{return await html2canvas(a,{scale,backgroundColor:'#fff',useCORS:true,logging:false,windowWidth:a.scrollWidth+60})}finally{a.style.width=old.w;a.style.overflow=old.o}
}
window.exportarAcompImagem=async(id=1)=>{try{const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],c=await capture(t.id),a=document.createElement('a');a.download=t.file+'.png';a.href=c.toDataURL('image/png',1);document.body.appendChild(a);a.click();a.remove()}catch(e){alert(e.message)}};
function printPdf(id){
 const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],area=q('acompExportArea'+t.id);if(!area)throw Error('Tabela não encontrada.');
 const w=window.open('','_blank');if(!w)throw Error('O navegador bloqueou a janela do PDF. Libere pop-ups e tente novamente.');
 const table=area.querySelector('table')?.outerHTML||'';
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Acompanhamento Geral - ${t.title}</title><style>@page{size:A3 landscape;margin:5mm}body{font-family:Arial,sans-serif;color:#142236;margin:0}h1{font-size:18px;margin:0 0 3px}.note{font-size:10px;margin-bottom:7px;color:#59636d}table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:6.5px}th,td{border:1px solid #aeb9c3;padding:3px;text-align:center;vertical-align:middle}thead tr:first-child th,thead tr:nth-child(2) th{background:#e30613!important;color:#fff!important;font-weight:900}.consHead{width:12%;text-align:left}.catHead{font-size:7px}.namecell{text-align:left;font-weight:900;white-space:nowrap}.realCell{color:#0d47d9}.realCell.ok,.faltaCell.ok{color:#16803a}.faltaCell{color:#e30613;font-weight:900}.metaCell{color:#111}.groupStart{border-left:2px solid #8797a5}.groupEnd{border-right:2px solid #8797a5}.teamTotal td{background:#d3d3d3!important;font-weight:900!important;border-top:2px solid #9aa0a6!important}</style></head><body><h1>Acompanhamento Geral - Equipe Iturama • ${t.title}</h1><div class="note">Categorias na ordem definida • Meta, Real e Falta • Total da equipe.</div>${table}<script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script></body></html>`);w.document.close();
}
window.exportarAcompPDF=(id=1)=>{try{printPdf(id)}catch(e){alert(e.message)}};

function install(){style();ensureLayout();if(typeof window.renderAcomp==='function'&&!window.renderAcomp.__splitAcomp){const old=window.renderAcomp;window.renderAcomp=function(){old();setTimeout(render,0)};window.renderAcomp.__splitAcomp=true}render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,100));else setTimeout(install,100);
let n=0;const timer=setInterval(()=>{ensureLayout();if(render()||++n>50)clearInterval(timer)},250);
})();