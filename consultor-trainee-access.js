(()=>{
const d=document;
function data(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}
function isTrainee(){const x=data();return x?.perfil==='acompanhante'&&String(x?.acesso?.tipo_perfil||'').toLowerCase()==='trainee'}
function mode(){return String(data()?.acesso?.modo_acesso||'team')}
function route(){return String(data()?.acesso?.rota_permitida||'').trim()}
function label(){const x=data();return String(x?.acesso?.nome||'Carlos')}
function sync(){
 if(!isTrainee())return;
 const m=mode(),r=route(),x=data();
 try{sessionStorage.setItem('iturama_context',m==='route'?r:'TEAM')}catch{}
 const hello=d.querySelector('#consultorModernHome .cmHello strong');if(hello)hello.textContent='Olá, '+label();
 const name=d.getElementById('name');if(name)name.textContent=label();
 const routeEl=d.getElementById('route');if(routeEl)routeEl.textContent=m==='route'?r:'Visão da Equipe';

 if(m==='team'){
   try{
     TAB='equipe';
     const cat=d.getElementById('cat');
     if(cat){
       const v=cat.value||'ALL';
       cat.innerHTML='<option value="ALL">Todos os incentivos</option>';
       (x?.team||[]).forEach(row=>cat.insertAdjacentHTML('beforeend','<option value="'+String(row.nome||'').replace(/"/g,'&quot;')+'">'+String(row.nome||'')+'</option>'));
       cat.value=[...cat.options].some(o=>o.value===v)?v:'ALL';
     }
     d.querySelectorAll('#dash .tab,.tabs .tab').forEach(btn=>{btn.classList.toggle('active',btn.dataset.t==='equipe')});
     if(typeof render==='function')render();
     if(typeof summary==='function')summary();
   }catch{}
   const tabs=d.querySelector('#dash .tabs');if(tabs)tabs.style.display='none';
   const panelTitle=d.querySelector('#dash .panel h2,#dash .panel h1');if(panelTitle)panelTitle.textContent='Resultado da Equipe por incentivo';
   const panelHint=d.querySelector('#dash .panel p');if(panelHint)panelHint.textContent='Resultados completos de toda a equipe.';
 }else{
   const tabs=d.querySelector('#dash .tabs');if(tabs)tabs.style.display='none';
   try{TAB='meu';if(typeof render==='function')render();if(typeof summary==='function')summary()}catch{}
 }

 d.querySelectorAll('.acessoHeaderSelect,.acessoOverlaySelect,.rogerioUiSelect,#acessoHeaderSelect').forEach(s=>{
   if(m==='team'){s.innerHTML='<option value="TEAM">👥 Toda a Equipe</option>';s.value='TEAM'}
   else if(m==='route'){const c=(x?.consultores||[]).find(v=>String(v.rota)===r),nm=String(c?.nome||r);s.innerHTML='<option value="'+r+'">👤 '+r+' - '+nm+'</option>';s.value=r}
   s.disabled=true;
 });
 d.querySelectorAll('.acessoHeaderWrap,.rogerioUiHead').forEach(w=>{w.style.display='none'});
}
window.addEventListener('iturama:dashboard-ready',()=>setTimeout(sync,0));
window.addEventListener('iturama:routechange',()=>setTimeout(sync,0));
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',sync);else sync();
new MutationObserver(sync).observe(d.documentElement,{childList:true,subtree:true});
setInterval(sync,800);
})();