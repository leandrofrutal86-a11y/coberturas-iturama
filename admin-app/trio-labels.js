(()=>{
  const MAP={
    'Grupo 1':'Coca Ref',
    'Grupo 2':'Coca LS',
    'Grupo 3':'Fanta Ref'
  };
  function apply(root=document){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; let n;
    while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(node=>{
      let t=node.nodeValue||'';
      let nt=t;
      for(const [from,to] of Object.entries(MAP)) nt=nt.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),to);
      if(nt!==t) node.nodeValue=nt;
    });
  }
  let running=false;
  const obs=new MutationObserver(()=>{if(running)return;running=true;requestAnimationFrame(()=>{apply();running=false;});});
  function boot(){apply();obs.observe(document.body,{childList:true,subtree:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();