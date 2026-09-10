(()=>{
function clean(){
 const pane=document.getElementById('impDashPane'); if(!pane)return;
 const out=document.getElementById('impStatOut'); if(out?.parentElement)out.parentElement.style.display='none';
 const stats=pane.querySelector('.impStats'); if(stats)stats.style.gridTemplateColumns='repeat(3,1fr)';
 const list=document.getElementById('impClientList');
 const total=document.getElementById('impStatTotal');
 if(list&&total) total.textContent=String(list.querySelectorAll('.impClient').length);
}
function boot(){clean();new MutationObserver(clean).observe(document.body,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();