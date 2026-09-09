/* Trio Pão de Queijo — grupos separados por colunas. */
(() => {
  const codes={1:'1918 ou 1919',2:'1916 ou 1917',3:'1827'};
  const norm=v=>String(v??'').replace(/\s+/g,' ').trim().toUpperCase();

  function splitTrioTables(){
    const cat=document.querySelector('#cat')?.value;
    if(norm(cat)!=='TRIO PÃO DE QUEIJO') return;
    const root=document.querySelector('#clients');
    if(!root) return;
    root.querySelectorAll('table').forEach(table=>{
      const head=table.querySelector('thead tr');
      if(!head) return;
      const hs=[...head.querySelectorAll('th')];
      const gi=hs.findIndex(th=>norm(th.textContent)==='GRUPOS');
      if(gi<0 && head.dataset.trioCols==='1'){
        const ths=head.querySelectorAll('th');
        if(ths.length>=6){
          ths[3].innerHTML='Grupo 1<br><small>(1918 ou 1919)</small>';
          ths[4].innerHTML='Grupo 2<br><small>(1916 ou 1917)</small>';
          ths[5].innerHTML='Grupo 3<br><small>(1827)</small>';
        }
        return;
      }
      if(gi<0) return;
      head.innerHTML='<th>#</th><th>Código PV</th><th>Razão Social</th>'+
        '<th>Grupo 1<br><small>(1918 ou 1919)</small></th>'+
        '<th>Grupo 2<br><small>(1916 ou 1917)</small></th>'+
        '<th>Grupo 3<br><small>(1827)</small></th>';
      head.dataset.trioCols='1';
      table.querySelectorAll('tbody tr').forEach(tr=>{
        const tds=[...tr.children];
        if(tds.length!==4) return;
        const status=tds[3].textContent;
        const cell=n=>{
          const m=status.match(new RegExp('Grupo\\s*'+n+'[^✓✕]*([✓✕])','i'));
          const ok=m?.[1]==='✓';
          return `<td><span class="${ok?'gok':'gno'}">${ok?'✓ Vendeu':'✕ Falta'}</span></td>`;
        };
        tds[3].outerHTML=cell(1)+cell(2)+cell(3);
      });
    });
  }

  function install(){
    const cat=document.querySelector('#cat');
    if(cat&&!cat.__trioColumns){cat.__trioColumns=true;cat.addEventListener('change',()=>setTimeout(splitTrioTables,30));}
    const root=document.querySelector('#clients');
    if(root&&!root.__trioColumns){
      root.__trioColumns=true;
      new MutationObserver(()=>splitTrioTables()).observe(root,{childList:true,subtree:true});
    }
    splitTrioTables();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
  setTimeout(install,500);setTimeout(install,1500);
})();
