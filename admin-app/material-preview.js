(()=>{
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
 function install(){
  const sec=document.getElementById('materiais'),tb=document.getElementById('tbMat');if(!sec||!tb){setTimeout(install,250);return}
  if(sec.dataset.previewInstalled==='2')return;sec.dataset.previewInstalled='2';
  const table=tb.closest('table'),head=table?.querySelector('thead tr');
  if(head&&!head.querySelector('.matPreviewHead')){const th=document.createElement('th');th.className='matPreviewHead';th.textContent='Prévia';head.insertBefore(th,head.children[1]||null)}
  const st=document.createElement('style');st.textContent=`
   .matPreviewCell{width:108px;min-width:108px}.matThumb{width:92px;height:68px;object-fit:cover;border-radius:9px;border:1px solid #d7dde3;background:#fff;display:block;box-shadow:0 2px 7px #0002}.matThumb:hover{transform:scale(1.05)}.matNoPreview{width:92px;height:68px;border-radius:9px;background:#f2f3f5;display:grid;place-items:center;font-size:11px;font-weight:800;color:#7b8794;text-align:center;padding:5px}`;document.head.appendChild(st);
  function imageUrlFromRow(tr){
   const links=[...tr.querySelectorAll('a[href]')];
   if(!links.length)return '';
   const imgLike=links.find(a=>/\.(png|jpe?g|webp|gif)(\?|#|$)/i.test(a.href))||links[0];
   return imgLike?.href||'';
  }
  function rowType(tr){
   const cells=[...tr.children].filter(x=>x.tagName==='TD');
   const txt=cells.map(x=>x.textContent||'').join(' ').toLowerCase();
   return txt.includes('imagem')||txt.includes('image')?'imagem':txt.includes('pdf')?'pdf':'';
  }
  function render(){
   [...tb.rows].forEach(tr=>{
    const existing=tr.querySelector('.matPreviewCell');if(existing)existing.remove();
    const u=imageUrlFromRow(tr),type=rowType(tr);const td=document.createElement('td');td.className='matPreviewCell';
    if(type==='imagem'&&u){
      td.innerHTML=`<a href="${E(u)}" target="_blank" title="Abrir imagem em tamanho maior"><img class="matThumb" src="${E(u)}" alt="Prévia da imagem" loading="lazy"></a>`;
      const img=td.querySelector('img');img.onerror=()=>{td.innerHTML='<span class="matNoPreview">Imagem não carregou</span>'};
    } else if(type==='imagem') td.innerHTML='<span class="matNoPreview">Imagem sem link</span>';
    else td.innerHTML='<span class="matNoPreview">PDF / Link</span>';
    tr.insertBefore(td,tr.children[1]||null);
   })
  }
  const mo=new MutationObserver(()=>{clearTimeout(window.__matPrevTimer);window.__matPrevTimer=setTimeout(render,50)});mo.observe(tb,{childList:true,subtree:false});
  render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();