(()=>{
const q=id=>document.getElementById(id);
const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getDash(){try{return typeof dash!=='undefined'&&dash?dash:(window.dash||null)}catch{return window.dash||null}}

// A posição nas duas tabelas é fixa pelo ID da categoria.
// O nome exibido SEMPRE vem do cadastro atual da categoria.
const TABLES=[
 {id:1,title:'TABELA 1',file:'acompanhamento-geral-tabela-1-iturama',catIds:[1,2,12,16,17,21,13,18,19,20]},
 {id:2,title:'TABELA 2',file:'acompanhamento-geral-tabela-2-iturama',catIds:[4,6,7,15,14,8,9,10,11]}
];

function catEntries(d,t){
 const cats=d?.categorias||[];
 return t.catIds.map(id=>{
  const idx=cats.findIndex(c=>Number(c.id)===Number(id));
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
#acompSplitRoot{display:grid;gap:16px}
.acompPanel{border-radius:18px;overflow:hidden;background:#be0009;box-shadow:0 8px 24px #0002;border:1px solid #a80008}
.acompPoster{background:#fff}
.acompHero{min-height:64px;background:linear-gradient(180deg,#df0915,#b50008);color:#fff;display:grid;grid-template-columns:210px 1fr 150px;align-items:center;padding:8px 16px;gap:12px}
.acompCoke{font-family:'Brush Script MT','Segoe Script',cursive;font-size:34px;font-weight:900;text-align:center;white-space:nowrap;font-style:italic}
.acompTitle{font-size:24px;font-weight:950;text-align:center;line-height:1.02;letter-spacing:.2px;text-transform:uppercase}
.acompBadge{background:#ffd31c;color:#080808;border-radius:9px;padding:8px 12px;text-align:center;font-size:22px;font-weight:950;box-shadow:inset 0 -2px 0 #d0a700;text-transform:uppercase}
.acompGrid{overflow:auto;background:#fff}
.acompGrid table{border-collapse:collapse!important;width:100%!important;min-width:1160px!important;table-layout:fixed!important;background:#fff!important;text-transform:uppercase!important}
.acompGrid th,.acompGrid td{border:1px solid #aeb8c1!important;padding:5px 4px!important;text-align:center!important;vertical-align:middle!important;box-sizing:border-box!important;text-transform:uppercase!important}
.acompGrid thead th{background:linear-gradient(#f7fafc,#e6edf2)!important;color:#151515!important;font-weight:950!important}
.acompGrid thead tr:first-child th{font-size:12px!important;height:32px!important}
.acompGrid thead tr:nth-child(2) th{font-size:10px!important;height:25px!important}
.acompGrid .catHead{width:280px!important;min-width:280px!important;text-align:center!important}
.acompGrid .catCell{text-align:left!important;padding-left:12px!important;font-size:12px!important;font-weight:950!important;color:#171717!important;white-space:nowrap!important}
.acompGrid tbody tr:nth-child(odd) td{background:#fbfbfb!important}
.acompGrid tbody tr:nth-child(even) td{background:#f3f6f8!important}
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
@media(max-width:800px){
 #acomp .box{padding:4px!important}.acompPanel{border-radius:12px}.acompHero{grid-template-columns:105px 1fr 82px;min-height:50px;padding:6px 8px;gap:5px}.acompCoke{font-size:20px}.acompTitle{font-size:13px}.acompBadge{font-size:12px;padding:6px 4px}.acompGrid table{min-width:1050px!important}.acompGrid .catHead{width:230px!important;min-width:230px!important}.acompGrid .catCell{font-size:10px!important}.acompFooter{padding:8px;gap:8px}.acompBtn{padding:9px 11px!important;font-size:10px!important}
}
`;
}

function ensureLayout(){
 const sec=q('acomp');if(!sec)return null;const box=sec.querySelector('.box');if(!box)return null;
 const legacy=box.querySelector('table.wide')||box.querySelector('table');if(legacy)legacy.classList.add('acompLegacyTable');
 let root=q('acompSplitRoot');if(root)return root;
 root=document.createElement('div');root.id='acompSplitRoot';
 root.innerHTML=TABLES.map(t=>`<section class="acompPanel"><div id="acompPoster${t.id}" class="acompPoster"><div class="acompHero"><div class="acompCoke">Coca-Cola</div><div class="acompTitle">ACOMPANHAMENTO GERAL DA EQUIPE</div><div class="acompBadge">${t.title}</div></div><div class="acompGrid"><table><thead id="thAcomp${t.id}"></thead><tbody id="tbAcomp${t.id}"></tbody></table></div></div><div class="acompFooter"><button class="acompBtn img" onclick="exportarAcompImagem(${t.id})">🖼️ BAIXAR IMAGEM <small>(ALTA RESOLUÇÃO)</small></button><button class="acompBtn pdf" onclick="exportarAcompPDF(${t.id})">📄 BAIXAR PDF <small>(ALTA RESOLUÇÃO)</small></button></div></section>`).join('');
 if(legacy)legacy.insertAdjacentElement('afterend',root);else box.appendChild(root);return root;
}

function headerHtml(inds){
 return '<tr><th class="catHead" rowspan="2">CATEGORIA</th>'+inds.map(i=>`<th class="sepL" colspan="2">${esc(i.rota)} ${esc(i.nome)}</th>`).join('')+'<th class="teamHead sepL" colspan="2">TOTAL EQUIPE</th></tr><tr>'+inds.map(()=>'<th class="sepL">META</th><th>REALIZADO</th>').join('')+'<th class="teamHead sepL">META</th><th class="teamHead">REALIZADO</th></tr>';
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
 const grid=a.querySelector('.acompGrid'),old={w:a.style.width,g:grid.style.overflow};
 const target=Math.max(grid.scrollWidth,1160);a.style.width=target+'px';grid.style.overflow='visible';
 const scale=Math.min(4.5,Math.max(3,5600/target));
 try{return await html2canvas(a,{scale,backgroundColor:'#fff',useCORS:true,logging:false,windowWidth:target+40})}finally{a.style.width=old.w;grid.style.overflow=old.g}
}
window.exportarAcompImagem=async(id=1)=>{try{const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],c=await capture(t.id),a=document.createElement('a');a.download=t.file+'.png';a.href=c.toDataURL('image/png',1);document.body.appendChild(a);a.click();a.remove()}catch(e){alert(e.message)}};
function printPdf(id){
 const t=TABLES.find(x=>x.id===Number(id))||TABLES[0],poster=q('acompPoster'+t.id);if(!poster)throw Error('Tabela não encontrada.');
 const w=window.open('','_blank');if(!w)throw Error('O navegador bloqueou a janela do PDF. Libere pop-ups e tente novamente.');
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Acompanhamento Geral - ${t.title}</title><style>@page{size:A3 landscape;margin:4mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#151515}.hero{background:#c7000b;color:#fff;height:52px;display:grid;grid-template-columns:180px 1fr 125px;align-items:center;padding:6px 12px}.logo{font-family:cursive;font-style:italic;font-size:27px;font-weight:900;text-align:center}.ttl{text-align:center;font-size:20px;font-weight:900;text-transform:uppercase}.badge{background:#ffd31c;color:#111;border-radius:7px;padding:7px;text-align:center;font-size:18px;font-weight:900;text-transform:uppercase}table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:7px;text-transform:uppercase}th,td{border:1px solid #9aa6b0;padding:3px 2px;text-align:center;text-transform:uppercase}thead th{background:#edf2f5;font-weight:900}.catHead{width:19%}.catCell{text-align:left;font-weight:900;white-space:nowrap}.metaCell{color:#0562b8;font-weight:900}.realCell{color:#e30613;font-weight:900}.realCell.ok{color:#0c9148}.teamHead{background:#fff3bd}.teamMeta{background:#dff1fb;color:#141c75;font-weight:900}.teamReal{background:#fff6cf;color:#e30613;font-weight:900}.teamReal.ok{color:#0c9148}.sepL{border-left:2px solid #7f8c96}</style></head><body><div class="hero"><div class="logo">Coca-Cola</div><div class="ttl">ACOMPANHAMENTO GERAL DA EQUIPE</div><div class="badge">${t.title}</div></div>${poster.querySelector('table').outerHTML}<script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`);w.document.close();
}
window.exportarAcompPDF=id=>{try{printPdf(id)}catch(e){alert(e.message)}};

function install(){addStyle();ensureLayout();if(typeof window.renderAcomp==='function'&&!window.renderAcomp.__splitPoster){const old=window.renderAcomp;window.renderAcomp=function(){old();setTimeout(render,0)};window.renderAcomp.__splitPoster=true}render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
let tries=0;const timer=setInterval(()=>{if(render()||++tries>50)clearInterval(timer)},250);
})();