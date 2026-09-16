(()=>{
  const $=s=>document.querySelector(s);
  let timer=null,working=false;

  function css(){
    if(document.getElementById('recFormatGroupStyle'))return;
    const st=document.createElement('style');
    st.id='recFormatGroupStyle';
    st.textContent=`
      .recFormatGroups{display:grid;gap:12px}
      .recFormatGroup{background:#fff;border:1px solid #dce4ea;border-radius:14px;overflow:hidden;box-shadow:0 3px 12px #0000000b}
      .recFormatHead{width:100%;border:0;background:#fff;color:#17344f;padding:14px 15px;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;font-weight:900}
      .recFormatHead:hover{background:#f7f9fb}
      .recFormatIcon{font-size:20px;line-height:1}
      .recFormatTitle{flex:1;font-size:15px}
      .recFormatCount{font-size:11px;background:#edf2f6;color:#526574;padding:5px 8px;border-radius:999px;white-space:nowrap}
      .recFormatArrow{font-size:22px;line-height:1;width:24px;text-align:center;transition:transform .18s ease}
      .recFormatBody{padding:0 12px 12px}
      .recFormatGroup.closed .recFormatBody{display:none}
      .recFormatGroup.closed .recFormatArrow{transform:rotate(-90deg)}
      .recFormatBody>.recRow{margin:0 0 10px;box-shadow:none;border:1px solid #e6ebef}
      .recFormatBody>.recRow:last-child{margin-bottom:0}
      @media(max-width:600px){.recFormatHead{padding:13px 12px}.recFormatTitle{font-size:14px}.recFormatCount{font-size:10px}.recFormatBody{padding:0 8px 8px}}
    `;
    document.head.appendChild(st);
  }

  function typeOf(row){
    if(row.querySelector('img.recImage'))return 'imagem';
    const text=String(row.textContent||'').toLowerCase();
    if(row.querySelector('[onclick*="recPdfOpen"], [onclick*="recPdfDownload"]')||text.includes('visualizar pdf')||text.includes('baixar pdf'))return 'pdf';
    return 'link';
  }

  function makeGroup(key,rows){
    const info={
      imagem:{icon:'🖼️',title:'Imagens'},
      pdf:{icon:'📄',title:'PDFs'},
      link:{icon:'🔗',title:'Links úteis'}
    }[key];
    const sec=document.createElement('section');
    sec.className='recFormatGroup';
    sec.dataset.format=key;
    const head=document.createElement('button');
    head.type='button';
    head.className='recFormatHead';
    head.setAttribute('aria-expanded','true');
    head.innerHTML=`<span class="recFormatIcon">${info.icon}</span><span class="recFormatTitle">${info.title}</span><span class="recFormatCount">${rows.length} ${rows.length===1?'arquivo':'arquivos'}</span><span class="recFormatArrow" aria-hidden="true">▾</span>`;
    const content=document.createElement('div');
    content.className='recFormatBody';
    rows.forEach(r=>content.appendChild(r));
    head.addEventListener('click',()=>{
      const closed=sec.classList.toggle('closed');
      head.setAttribute('aria-expanded',String(!closed));
    });
    sec.append(head,content);
    return sec;
  }

  function groupMaterials(){
    if(working)return;
    const title=$('#recTitle'),body=$('#recBody');
    if(!title||!body||!String(title.textContent||'').includes('Materiais de Apoio'))return;
    if(body.querySelector(':scope > .recFormatGroups'))return;
    const rows=[...body.children].filter(el=>el.classList?.contains('recRow'));
    if(!rows.length)return;
    working=true;
    try{
      const groups={imagem:[],pdf:[],link:[]};
      rows.forEach(r=>groups[typeOf(r)].push(r));
      const wrap=document.createElement('div');
      wrap.className='recFormatGroups';
      ['imagem','pdf','link'].forEach(k=>{if(groups[k].length)wrap.appendChild(makeGroup(k,groups[k]))});
      body.replaceChildren(wrap);
    }finally{working=false}
  }

  function schedule(){clearTimeout(timer);timer=setTimeout(groupMaterials,80)}
  function boot(){
    css();
    const body=$('#recBody');
    if(!body){setTimeout(boot,250);return}
    if(body.dataset.formatObserver==='1'){schedule();return}
    body.dataset.formatObserver='1';
    new MutationObserver(schedule).observe(body,{childList:true,subtree:false});
    schedule();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  setTimeout(boot,700);
})();