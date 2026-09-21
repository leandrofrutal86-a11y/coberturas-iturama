(()=>{
const q=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getDash(){try{return typeof dash!=='undefined'&&dash?dash:(window.dash||null)}catch{return window.dash||null}}

// Mantém a ordem histórica das categorias já existentes.
// Toda categoria nova cadastrada é acrescentada automaticamente à TABELA 2.
const TABLE1_IDS=[1,2,12,16,17,21,13,18,19,20];
const TABLE2_BASE_IDS=[4,6,7,15,14,8,9,10,11];
const TABLES=[
 {id:1,title:'TABELA 1',file:'acompanhamento-geral-tabela-1-iturama'},
 {id:2,title:'TABELA 2',file:'acompanhamento-geral-tabela-2-iturama'}
];

function catEntries(d,t){
 const cats=d?.categorias||[];
 const fixed=t.id===1?TABLE1_IDS:TABLE2_BASE_IDS;
 const fixedSet=new Set(fixed.map(Number));
 const usedSet=new Set([...TABLE1_IDS,...TABLE2_BASE_IDS].map(Number));
 const ids=t.id===1
   ? fixed
   : [...fixed,...cats.filter(cat=>!usedSet.has(Number(cat.id))).map(cat=>Number(cat.id))];
 return ids.map(id=>{
  const idx=cats.findIndex(cat=>Number(cat.id)===Number(id));
  return idx>=0?{cat:cats[idx],idx}:null;
 }).filter(Boolean);
}
function findResult(ind,entry){
 const arr=ind?.resultados||[];
 const byName=arr.find(r=>norm(r?.nome)===norm(entry.cat?.nome));
 return byName||arr[entry.idx]||null;
}

function addStyle(){
 let s=q('acompExportStyle');if(!s){s=document.createElement('style');s.id='acompExportStyle';document.head.appendChild(s)}
 s.textContent=`
#acomp .box{padding:10px!important;background:#f3f5f7!important;overflow:visible!important}
#acomp .box>h2,#acomp .box>p{display:none!important}
#acomp .acompLegacyTable{display:none!important}
#acompSplitRoot{display:grid;gap:16px;width:100%;min-width:0}
.acompPanel{border-radius:18px;overflow:hidden;background:#be0009;box-shadow:0 8px 24px #0002;border:1px solid #a80008;width:100%;min-width:0}
.acompPoster{background:#fff;width:100%;min-width:0}
.acompHero{min-height:64px;background:linear-gradient(180deg,#df0915,#b50008);color:#fff;display:grid;grid-template-columns:1fr 150px;align-items:center;padding:8px 16px;gap:12px}
.acompTitle{font-size:24px;font-weight:950;text-align:center;line-height:1.02;letter-spacing:.2px;text-transform:uppercase}
.acompBadge{background:#ffd31c;color:#080808;border-radius:9px;padding:8px 12px;text-align:center;font-size:22px;font-weight:950;box-shadow:inset 0 -2px 0 #d0a700;text-transform:uppercase}
.acompGrid{overflow:auto;background:#fff;width:100%;min-width:0}
.acompGrid table{border-collapse:collapse!important;width:100%!important;min-width:0!important;table-layout:fixed!important;background:#fff!important;text-transform:uppercase!important}
.acompGrid th,.acompGrid td{border:1px solid #aeb8c1!important;padding:5px 4px!important;text-align:center!important;vertical-align:middle!important;box-sizing:border-box!important;text-transform:uppercase!important;line-height:1.08!important}
.acompGrid thead th{background:linear-gradient(#f7fafc,#e6edf2)!important;color:#151515!important;font-weight:950!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
.acompGrid thead tr:first-child th{font-size:12px!important;height:32px!important}
.acompGrid thead tr:nth-child(2) th{font-size:10px!important;height:25px!important}
.acompGrid .catHead{width:22%!important;min-width:210px!important;text-align:center!important}
.acompGrid .catCell{text-align:left!important;padding-left:12px!important;font-size:12px!important;font-weight:950!important;color:#171717!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
.acompGrid tbody td{background:#fff!important}
.acompGrid tbody td:nth-child(2),.acompGrid tbody td:nth-child(3),
.acompGrid tbody td:nth-child(6),.acompGrid tbody td:nth-child(7),
.acompGrid tbody td:nth-child(10),.acompGrid tbody td:nth-child(11){background:#e8f5ff!important}
.acompGrid tbody td:nth-child(4),.acompGrid tbody td:nth-child(5),
.acompGrid tbody td:nth-child(8),.acompGrid tbody td:nth-child(9){background:#fff!important}
.acompGrid thead tr:first-child th:nth-child(2),
.acompGrid thead tr:first-child th:nth-child(4),
.acompGrid thead tr:first-child th:nth-child(6){background:#e8f5ff!important}
.acompGrid thead tr:first-child th:nth-child(3),
.acompGrid thead tr:first-child th:nth-child(5){background:#fff!important}
.acompGrid thead tr:nth-child(2) th:nth-child(1),.acompGrid thead tr:nth-child(2) th:nth-child(2),
.acompGrid thead tr:nth-child(2) th:nth-child(5),.acompGrid thead tr:nth-child(2) th:nth-child(6),
.acompGrid thead tr:nth-child(2) th:nth-child(9),.acompGrid thead tr:nth-child(2) th:nth-child(10){background:#e8f5ff!important}
.acompGrid thead tr:nth-child(2) th:nth-child(3),.acompGrid thead tr:nth-child(2) th:nth-child(4),
.acompGrid thead tr:nth-child(2) th:nth-child(7),.acompGrid thead tr:nth-child(2) th:nth-child(8){background:#fff!important}
.acompGrid .metaCell{color:#0562b8!important;font-weight:950!important;font-size:14px!important}
.acompGrid .realCell{font-weight:950!important;font-size:14px!important;color:#e30613!important}
.acompGrid .realCell.ok{color:#0c9148!important}
.acompGrid .teamHead{background:linear-gradient(#fff9db,#f9edb4)!important}
.acompGrid .teamMeta{background:#dff1fb!important;color:#141c75!important;font-weight:950!important;font-size:15px!important}
.acompGrid .teamReal{background:#fff6cf!important;color:#e30613!important;font-weight:950!important;font-size:15px!important}
.acompGrid .teamReal.ok{color:#0c9148!important}
.acompGrid .sepL{border-left:2px solid #7f8c96!important}
.acompFooter{background:linear-gradient(180deg,#c7000b,#a70007);padding:10px 14px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap}
.acompBtn{border:0!important;border-radius:9px!important;padding:10px 18px!important;font-size:12px!important;font-weight:950!important;color:#fff!important;cursor:pointer!important;box-shadow:0 3px 7px #0003!important}
.acompBtn.img{background:linear-gradient(#168af1,#0065bb)!important}.acompBtn.pdf{background:linear-gradient(#21b84c,#098832)!important}
.acompBtn small{font-size:9px!important;font-weight:800!important}
.mobileLabel{display:none}

/* Durante a exportação, volta ao tamanho amplo para gerar imagem em alta resolução. */
.acompPoster.acompExporting{width:1280px!important}
.acompPoster.acompExporting .acompGrid{overflow:visible!important}
.acompPoster.acompExporting .acompGrid table{min-width:1280px!important;width:1280px!important}
.acompPoster.acompExporting .desktopLabel{display:inline!important}
.acompPoster.acompExporting .mobileLabel{display:none!important}

@media(max-width:800px){
 #acomp .box{padding:2px!important}
 #acompSplitRoot{gap:10px}
 .acompPanel{border-radius:11px;box-shadow:0 3px 10px #0002}
 .acompHero{grid-template-columns:1fr 58px;min-height:43px;padding:5px 5px;gap:3px}
 .acompTitle{font-size:9px;line-height:1.03;letter-spacing:0}
 .acompBadge{font-size:9px;padding:5px 2px;border-radius:6px}
 .acompGrid{overflow:hidden!important;width:100%!important}
 .acompGrid table{width:100%!important;min-width:0!important;max-width:100%!important;table-layout:fixed!important}
 .acompGrid th,.acompGrid td{padding:3px 1px!important;line-height:1.02!important;white-space:normal!important;overflow:hidden!important;overflow-wrap:anywhere!important;word-break:normal!important}
 .acompGrid thead tr:first-child th{font-size:6.2px!important;height:auto!important;min-height:30px!important}
 .acompGrid thead tr:nth-child(2) th{font-size:5.6px!important;height:21px!important;padding:2px 0!important}
 .acompGrid .catHead{width:27%!important;min-width:0!important;max-width:27%!important;font-size:7px!important}
 .acompGrid .catCell{width:27%!important;min-width:0!important;max-width:27%!important;font-size:6.8px!important;padding:4px 3px!important;line-height:1.08!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
 .acompGrid .metaCell,.acompGrid .realCell,.acompGrid .teamMeta,.acompGrid .teamReal{font-size:7.2px!important;padding:4px 0!important}
 .acompGrid .sepL{border-left-width:1px!important}
 .acompGrid .teamHead{font-size:5.8px!important}
 .desktopLabel{display:none!important}.mobileLabel{display:inline!important}
 .acompFooter{padding:7px 5px;gap:5px;display:grid;grid-template-columns:1fr 1fr}
 .acompBtn{padding:8px 3px!important;font-size:7.5px!important;line-height:1.1!important;width:100%}
 .acompBtn small{font-size:6px!important}
}

@media(max-width:390px){
 .acompHero{grid-template-columns:1fr 48px;padding:4px 3px}
 .acompTitle{font-size:7.8px}.acompBadge{font-size:7.8px;padding:4px 1px}
 .acompGrid .catHead,.acompGrid .catCell{width:29%!important;max-width:29%!important}
 .acompGrid thead tr:first-child th{font-size:5.4px!important}
 .acompGrid thead tr:nth-child(2) th{font-size:5px!important}
 .acompGrid .catCell{font-size:6.1px!important;padding:3px 2px!important}
 .acompGrid .metaCell,.acompGrid .realCell,.acompGrid .teamMeta,.acompGrid .teamReal{font-size:6.4px!important}
}
`;
}

function ensureLayout(){
 const sec=q('acomp');if(!sec)return null;const box=sec.querySelector('.box');if(!box)return null;
 const legacy=box.querySelector('table.wide')||box.querySelector('table');if(legacy)legacy.classList.add('acompLegacyTable');
 let root=q('acompSplitRoot');if(root)return root;
 root=document.createElement('div');root.id='acompSplitRoot';
 root.innerHTML=TABLES.map(t=>`<section class="acompPanel"><div id="acompPoster${t.id}" class="acompPoster"><div class="acompHero"><div class="acompTitle">ACOMPANHAMENTO GERAL DA EQUIPE</div><div class="acompBadge">${t.title}</div></div><div class="acompGrid"><table><thead id="thAcomp${t.id}"></thead><tbody id="tbAcomp${t.id}"></tbody></table></div></div><div class="acompFooter"><button class="acompBtn img" onclick="exportarAcompImagem(${t.id})">🖼️ BAIXAR IMAGEM <small>(ALTA RESOLUÇÃO)</small></button><button class="acompBtn pdf" onclick="exportarAcompPDF(${t.id})">📄 BAIXAR PDF <small>(ALTA RESOLUÇÃO)</small></button></div></section>`).join('');
 if(legacy)legacy.insertAdjacentElement('afterend',root);else box.appendChild(root);return root;
}

function headerHtml(inds){
 return '<tr><th class="catHead" rowspan="2">CATEGORIA</th>'+inds.map(i=>`<th class="sepL" colspan="2">${esc(i.rota)} ${esc(i.nome)}</th>`).join('')+'<th class="teamHead sepL" colspan="2">EQUIPE</th></tr><tr>'+inds.map(()=>'<th class="sepL">META</th><th><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th>').join('')+'<th class="teamHead sepL">META</th><th class="teamHead"><span class="desktopLabel">REALIZADO</span><span class="mobileLabel">REAL</span></th></tr>';
}
function categoryRow(entry,inds){
 let teamMeta=0,teamReal=0,found=false;
 const cells=inds.map(i=>{const r=findResult(i,entry);if(!r)return '<td class="metaCell sepL">—</td><td class="realCell">—</td>';found=true;const m=Number(r.meta||0),v=Number(r.realizado||0),ok=v>=m;teamMeta+=m;teamReal+=v;return `<td class="metaCell sepL">${m}</td><td class="realCell ${ok?'ok':''}">${v}</td>`}).join('');
 const teamOk=found&&teamReal>=teamMeta;
 const nome=String(entry.cat?.nome||'').toUpperCase();
 return `<tr><td class="catCell">${esc(nome)}</td>${cells}<td class="teamMeta sepL">${found?teamMeta:'—'}</td><td class="teamReal ${teamOk?'ok':''}">${found?teamReal:'—'}</td></tr>`;
}
function renderOne(t,d){
 const inds=(d.individual||[]).slice(),entries=catEntries(d,t),th=q('thAcomp'+t.id),tb=q('tbAcomp'+t.id);if(!th||!tb)return false;
 th.innerHTML=headerHtml(inds);tb.innerHTML=entries.map(e=>categoryRow(e,inds)).join('');return true;
}
function render(){const d=getDash();if(!d)return false;addStyle();ensureLayout();let ok=true;TABLES.forEach(t=>{if(!renderOne(t,d))ok=false});return ok}

function load(src,test){return new Promise((ok,no)=>{if(test())return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o recurso de exportação.'));document.head.appendChild(s)})}
async function capture(id){
 await load('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',()=>!!window.html2canvas);
 const a=q('acompPoster'+id);if(!a)throw Error('Tabela não encontrada.');
 const grid=a.querySelector('.acompGrid');
 a.classList.add('acompExporting');
 const target=1280;
 try{return await html2canvas(a,{scale:4.5,backgroundColor:'#fff',useCORS:true,logging:false,windowWidth:target+40})}finally{a.classList.remove('acompExporting');grid.style.removeProperty('overflow')}
}
window.exportarAcompImagem=async(id=1)=>{try{const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],c=await capture(t.id),a=document.createElement('a');a.download=t.file+'.png';a.href=c.toDataURL('image/png',1);document.body.appendChild(a);a.click();a.remove()}catch(e){alert(e.message)}};
function printPdf(id){
 const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],poster=q('acompPoster'+t.id);if(!poster)throw Error('Tabela não encontrada.');
 const w=window.open('','_blank');if(!w)throw Error('O navegador bloqueou a janela do PDF. Libere pop-ups e tente novamente.');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Acompanhamento Geral - ${t.title}</title><style>@page{size:A3 landscape;margin:4mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#151515}.hero{background:#c7000b;color:#fff;height:52px;display:grid;grid-template-columns:1fr 125px;align-items:center;padding:6px 12px}.ttl{text-align:center;font-size:20px;font-weight:900;text-transform:uppercase}.badge{background:#ffd31c;color:#111;border-radius:7px;padding:7px;text-align:center;font-size:18px;font-weight:900;text-transform:uppercase}table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:7px;text-transform:uppercase}th,td{border:1px solid #9aa6b0;padding:3px 2px;text-align:center;text-transform:uppercase;white-space:normal;overflow-wrap:anywhere}thead th{background:#edf2f5;font-weight:900}
tbody td{background:#fff}
tbody td:nth-child(2),tbody td:nth-child(3),tbody td:nth-child(6),tbody td:nth-child(7),tbody td:nth-child(10),tbody td:nth-child(11){background:#e8f5ff}
tbody td:nth-child(4),tbody td:nth-child(5),tbody td:nth-child(8),tbody td:nth-child(9){background:#fff}
thead tr:first-child th:nth-child(2),thead tr:first-child th:nth-child(4),thead tr:first-child th:nth-child(6){background:#e8f5ff}
thead tr:first-child th:nth-child(3),thead tr:first-child th:nth-child(5){background:#fff}
thead tr:nth-child(2) th:nth-child(1),thead tr:nth-child(2) th:nth-child(2),thead tr:nth-child(2) th:nth-child(5),thead tr:nth-child(2) th:nth-child(6),thead tr:nth-child(2) th:nth-child(9),thead tr:nth-child(2) th:nth-child(10){background:#e8f5ff}
thead tr:nth-child(2) th:nth-child(3),thead tr:nth-child(2) th:nth-child(4),thead tr:nth-child(2) th:nth-child(7),thead tr:nth-child(2) th:nth-child(8){background:#fff}
.catHead{width:19%}.catCell{text-align:left;font-weight:900;white-space:normal}.metaCell{color:#0562b8;font-weight:900}.realCell{color:#e30613;font-weight:900}.realCell.ok{color:#0c9148}.teamHead{background:#fff3bd}.teamMeta{background:#dff1fb;color:#141c75;font-weight:900}.teamReal{background:#fff6cf;color:#e30613;font-weight:900}.teamReal.ok{color:#0c9148}.sepL{border-left:2px solid #7f8c96}.mobileLabel{display:none}</style></head><body><div class="hero"><div class="ttl">ACOMPANHAMENTO GERAL DA EQUIPE</div><div class="badge">${t.title}</div></div>${poster.querySelector('table').outerHTML}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);w.document.close();
}
window.exportarAcompPDF=id=>{try{printPdf(id)}catch(e){alert(e.message)}};

function install(){addStyle();ensureLayout();if(typeof window.renderAcomp==='function'&&!window.renderAcomp.__splitPoster){const old=window.renderAcomp;window.renderAcomp=function(){old();setTimeout(render,0)};window.renderAcomp.__splitPoster=true}render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
let tries=0;const timer=setInterval(()=>{if(render()||++tries>50)clearInterval(timer)},250);
})();