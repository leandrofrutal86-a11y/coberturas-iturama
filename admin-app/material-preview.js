(()=>{
 const OLD='https://raw.githubusercontent.com/leandrofrutal86-a11y/coberturas-iturama/b5f7284e93dc08c67c4d037410b82cbc1410c3b0/index.html';
 const BASE='https://leandrofrutal86-a11y.github.io/coberturas-iturama/';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let oldDoc=null;
 async function legacy(){if(oldDoc)return oldDoc;const h=await fetch(OLD,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Falha ao recuperar imagens anteriores.');return r.text()});oldDoc=new DOMParser().parseFromString(h,'text/html');return oldDoc}
 async function resolve(raw){raw=String(raw||'');if(!raw.startsWith('legacy:'))return raw;const p=raw.split(':'),kind=p[1],idx=Number(p[2]),d=await legacy();let u='';if(kind==='img')u=d.querySelectorAll('#materiais .imgGroup img')[idx]?.getAttribute('src')||'';if(kind==='pdf')u=d.querySelectorAll('#materiais .pdfRow a')[idx]?.getAttribute('href')||'';if(!u)return'';try{return new URL(u,BASE).href}catch{return u}}
 function install(){
  const sec=document.getElementById('materiais'),tb=document.getElementById('tbMat');if(!sec||!tb){setTimeout(install,250);return}
  if(sec.dataset.previewInstalled==='3')return;sec.dataset.previewInstalled='3';
  const table=tb.closest('table'),head=table?.querySelector('thead tr');
  if(head&&!head.querySelector('.matPreviewHead')){const th=document.createElement('th');th.className='matPreviewHead';th.textContent='Prévia';head.insertBefore(th,head.children[1]||null)}
  const st=document.createElement('style');st.textContent=`.matPreviewCell{width:116px;min-width:116px}.matThumb{width:96px;height:72px;object-fit:cover;border-radius:10px;border:1px solid #d7dde3;background:#fff;display:block;box-shadow:0 2px 7px #0002}.matThumb:hover{transform:scale(1.06)}.matNoPreview{width:96px;height:72px;border-radius:10px;background:#f2f3f5;display:grid;place-items:center;font-size:11px;font-weight:800;color:#7b8794;text-align:center;padding:5px}`;document.head.appendChild(st);
  function mats(){return window.config?.materiais||window.config?.materials||window.legacyMaterials||[]}
  function rowName(tr){const a=tr.querySelector('a');return (a?.textContent||'').trim()}
  function getMat(tr,i){const name=rowName(tr);return mats().find(m=>String(m.nome||'').trim()===name)||mats()[i]||{}}
  async function render(){
   const rows=[...tb.rows];
   for(let i=0;i<rows.length;i++){
    const tr=rows[i],old=tr.querySelector('.matPreviewCell');if(old)old.remove();const m=getMat(tr,i),type=String(m.tipo||'').toLowerCase(),td=document.createElement('td');td.className='matPreviewCell';
    if(type.includes('imagem')||type.includes('image')){
      td.innerHTML='<span class="matNoPreview">Carregando...</span>';tr.insertBefore(td,tr.children[1]||null);
      let u='';try{u=await resolve(m.url||m.arquivo_url||m.link||'')}catch{}
      if(u){td.innerHTML=`<a href="${E(u)}" target="_blank" title="Abrir imagem em tamanho maior"><img class="matThumb" src="${E(u)}" alt="Prévia da imagem" loading="lazy"></a>`;const img=td.querySelector('img');img.onerror=()=>{td.innerHTML='<span class="matNoPreview">Imagem não carregou</span>'}}
      else td.innerHTML='<span class="matNoPreview">Imagem indisponível</span>';
    }else{td.innerHTML='<span class="matNoPreview">PDF / Link</span>';tr.insertBefore(td,tr.children[1]||null)}
   }
  }
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(render,80)}).observe(tb,{childList:true,subtree:false});render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();