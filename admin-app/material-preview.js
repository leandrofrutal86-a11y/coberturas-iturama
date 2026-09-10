(()=>{
 const SUPA='https://harlrfhukjvhpufwhtep.supabase.co';
 const KEY='sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
 const OLD='https://raw.githubusercontent.com/leandrofrutal86-a11y/coberturas-iturama/b5f7284e93dc08c67c4d037410b82cbc1410c3b0/index.html';
 const BASE='https://leandrofrutal86-a11y.github.io/coberturas-iturama/';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let oldDoc=null,dbMats=null;
 async function legacy(){if(oldDoc)return oldDoc;const h=await fetch(OLD,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Falha ao recuperar materiais anteriores.');return r.text()});oldDoc=new DOMParser().parseFromString(h,'text/html');return oldDoc}
 async function db(){const r=await fetch(`${SUPA}/rest/v1/materiais_apoio?ativo=eq.true&order=ordem.asc`,{cache:'no-store',headers:{apikey:KEY,Authorization:'Bearer '+KEY}});if(!r.ok)throw Error('Falha ao carregar materiais.');dbMats=await r.json();return dbMats}
 async function resolve(raw){raw=String(raw||'');if(!raw.startsWith('legacy:'))return raw;const p=raw.split(':'),kind=p[1],idx=Number(p[2]),d=await legacy();let u='';if(kind==='img')u=d.querySelectorAll('#materiais .imgGroup img')[idx]?.getAttribute('src')||'';if(kind==='pdf')u=d.querySelectorAll('#materiais .pdfRow a')[idx]?.getAttribute('href')||'';if(!u)return'';try{return new URL(u,BASE).href}catch{return u}}
 async function download(u,name){try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error();const b=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}catch{const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.download=name;document.body.appendChild(a);a.click();a.remove()}}
 function install(){
  const sec=document.getElementById('materiais'),tb=document.getElementById('tbMat');if(!sec||!tb){setTimeout(install,250);return}
  if(sec.dataset.previewInstalled==='5')return;sec.dataset.previewInstalled='5';
  const table=tb.closest('table'),head=table?.querySelector('thead tr');
  if(head&&!head.querySelector('.matPreviewHead')){const th=document.createElement('th');th.className='matPreviewHead';th.textContent='Prévia / Arquivo';head.insertBefore(th,head.children[1]||null)}
  const st=document.createElement('style');st.textContent=`.matPreviewCell{width:180px;min-width:180px}.matThumb{width:96px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #d7dde3;background:#fff;display:block;box-shadow:0 2px 7px #0002}.matDoc{width:154px;border-radius:10px;background:#f2f3f5;padding:9px;text-align:center;font-size:11px;font-weight:800;color:#4b5968}.matDocBtns{display:flex;gap:6px;margin-top:7px}.matDocBtns button{flex:1;padding:7px 8px;border-radius:8px;font-size:11px}.matOpen{background:#e30613;color:#fff}.matDown{background:#263746;color:#fff}.matNoPreview{width:96px;height:72px;border-radius:10px;background:#f2f3f5;display:grid;place-items:center;font-size:11px;font-weight:800;color:#7b8794;text-align:center;padding:5px}`;document.head.appendChild(st);
  function rowName(tr){const links=[...tr.querySelectorAll('a')];return (links.find(a=>a.textContent.trim())?.textContent||'').trim()}
  async function render(){
   let mats=[];try{mats=await db()}catch{}
   const rows=[...tb.rows];
   for(let i=0;i<rows.length;i++){
    const tr=rows[i],old=tr.querySelector('.matPreviewCell');if(old)old.remove();
    const name=rowName(tr),m=mats.find(x=>String(x.nome||'').trim()===name)||mats[i]||{};
    const rowText=String(tr.textContent||'').toLowerCase();
    const type=String(m.tipo||'').toLowerCase()||(rowText.includes('imagem')?'imagem':rowText.includes('pdf')?'pdf':'');
    const td=document.createElement('td');td.className='matPreviewCell';tr.insertBefore(td,tr.children[1]||null);
    let u='';try{u=await resolve(m.url||m.arquivo_url||m.link||'')}catch{}
    if(type.includes('imagem')||type.includes('image')){
      if(u){td.innerHTML=`<a href="${E(u)}" target="_blank" title="Abrir imagem em tamanho maior"><img class="matThumb" src="${E(u)}" alt="Prévia da imagem"></a>`;const img=td.querySelector('img');img.onerror=()=>{td.innerHTML='<span class="matNoPreview">Imagem indisponível</span>'}}
      else td.innerHTML='<span class="matNoPreview">Imagem indisponível</span>';
    }else if(type.includes('pdf')){
      if(u){const safe=(String(m.nome||'material').replace(/[^a-zA-Z0-9À-ÿ _.-]/g,'_')+'.pdf');td.innerHTML=`<div class="matDoc">📄 PDF<div class="matDocBtns"><button class="matOpen">Visualizar</button><button class="matDown">Baixar</button></div></div>`;td.querySelector('.matOpen').onclick=()=>window.open(u,'_blank','noopener');td.querySelector('.matDown').onclick=()=>download(u,safe)}else td.innerHTML='<span class="matNoPreview">PDF indisponível</span>';
    }else td.innerHTML='<span class="matNoPreview">Link</span>';
   }
  }
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(render,120)}).observe(tb,{childList:true,subtree:false});render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();