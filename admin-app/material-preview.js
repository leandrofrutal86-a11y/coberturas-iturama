(()=>{
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function isImg(m){const t=String(m?.tipo||'').toLowerCase(),u=String(m?.url||m?.arquivo_url||m?.link||'');return t.includes('imagem')||t.includes('image')||/\.(png|jpe?g|webp|gif)(\?|$)/i.test(u)}
 function url(m){return m?.url||m?.arquivo_url||m?.link||m?.public_url||''}
 function install(){
  const sec=document.getElementById('materiais'),tb=document.getElementById('tbMat');if(!sec||!tb){setTimeout(install,250);return}
  if(sec.dataset.previewInstalled)return;sec.dataset.previewInstalled='1';
  const head=tb.closest('table')?.querySelector('thead tr');if(head&&!head.querySelector('.matPreviewHead')){const th=document.createElement('th');th.className='matPreviewHead';th.textContent='Prévia';head.insertBefore(th,head.children[1]||null)}
  const st=document.createElement('style');st.textContent='.matThumb{width:78px;height:58px;object-fit:contain;border-radius:8px;border:1px solid #dfe4e8;background:#fff;display:block}.matPdf{width:78px;height:58px;border-radius:8px;background:#f1f3f5;display:grid;place-items:center;font-size:12px;font-weight:800;color:#b42318}.matPreviewCell{width:94px}';document.head.appendChild(st);
  function render(){
   const mats=(window.config?.materiais||window.config?.materials||window.legacyMaterials||[]);
   [...tb.rows].forEach((tr,i)=>{
    if(tr.querySelector('.matPreviewCell'))return;
    const m=mats[i]||{};let u=url(m);
    if(!u){const a=tr.querySelector('a[href]');u=a?.href||''}
    const td=document.createElement('td');td.className='matPreviewCell';
    if(u&&isImg({...m,url:u}))td.innerHTML=`<a href="${E(u)}" target="_blank" title="Abrir imagem"><img class="matThumb" src="${E(u)}" alt="Prévia" loading="lazy" onerror="this.parentElement.innerHTML='<span class=&quot;matPdf&quot;>IMAGEM</span>'"></a>`;
    else if(u)td.innerHTML=`<a href="${E(u)}" target="_blank" class="matPdf" title="Abrir material">PDF/LINK</a>`;
    else td.innerHTML='<span class="matPdf">SEM PRÉVIA</span>';
    tr.insertBefore(td,tr.children[1]||null);
   })
  }
  new MutationObserver(()=>setTimeout(render,0)).observe(tb,{childList:true});render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();