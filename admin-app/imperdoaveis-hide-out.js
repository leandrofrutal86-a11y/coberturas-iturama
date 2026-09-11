(()=>{
function clean(){
 const pane=document.getElementById('impDashPane'); if(!pane)return;
 const out=document.getElementById('impStatOut');
 if(out?.parentElement && out.parentElement.style.display!=='none') out.parentElement.style.display='none';
 const stats=pane.querySelector('.impStats');
 if(stats && stats.style.gridTemplateColumns!=='repeat(3, 1fr)') stats.style.gridTemplateColumns='repeat(3, 1fr)';
 const list=document.getElementById('impClientList');
 const total=document.getElementById('impStatTotal');
 if(list&&total){
   const n=String(list.querySelectorAll('.impClient').length);
   if(total.textContent!==n) total.textContent=n;
 }
}
function boot(){
 clean();
 let timer=0;
 const obs=new MutationObserver(()=>{
   clearTimeout(timer);
   timer=setTimeout(clean,40);
 });
 obs.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();