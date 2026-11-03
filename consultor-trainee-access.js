(()=>{
const d=document;
function data(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}
function isTrainee(){const x=data();return x?.perfil==='acompanhante'&&String(x?.acesso?.tipo_perfil||'').toLowerCase()==='trainee'}
function mode(){return String(data()?.acesso?.modo_acesso||'team')}
function route(){return String(data()?.acesso?.rota_permitida||'').trim()}
function label(){const x=data();return String(x?.acesso?.nome||'Carlos')}
function sync(){
 if(!isTrainee())return;
 const m=mode(),r=route();
 try{sessionStorage.setItem('iturama_context',m==='route'?r:'TEAM')}catch{}
 const hello=d.querySelector('#consultorModernHome .cmHello strong');if(hello)hello.textContent='Olá, '+label();
 const name=d.getElementById('name');if(name)name.textContent=label();
 const routeEl=d.getElementById('route');if(routeEl)routeEl.textContent=m==='route'?r:'Visão da Equipe';
 d.querySelectorAll('.acessoHeaderSelect,.acessoOverlaySelect,.rogerioUiSelect,#acessoHeaderSelect').forEach(s=>{
   if(m==='team'){s.innerHTML='<option value="TEAM">👥 Toda a Equipe</option>';s.value='TEAM'}
   else if(m==='route'){const c=(data()?.consultores||[]).find(x=>String(x.rota)===r),nm=String(c?.nome||r);s.innerHTML='<option value="'+r+'">👤 '+r+' - '+nm+'</option>';s.value=r}
   s.disabled=true;
 });
 d.querySelectorAll('.acessoHeaderWrap,.rogerioUiHead').forEach(w=>{if(m==='team')w.style.display='none'});
}
window.addEventListener('iturama:dashboard-ready',()=>setTimeout(sync,0));
window.addEventListener('iturama:routechange',()=>setTimeout(sync,0));
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',sync);else sync();
new MutationObserver(sync).observe(d.documentElement,{childList:true,subtree:true});
setInterval(sync,800);
})();