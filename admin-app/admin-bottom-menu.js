(()=>{
const d=document,$=id=>d.getElementById(id);
function css(){if($('admBottomStyle'))return;const s=d.createElement('style');s.id='admBottomStyle';s.textContent=`
#admBottomNav{position:fixed;left:0;right:0;bottom:0;z-index:52000;background:#fff;border-top:1px solid #dce3e9;box-shadow:0 -5px 18px #0002;display:grid;grid-template-columns:repeat(4,1fr);padding:7px 8px calc(7px + env(safe-area-inset-bottom));gap:4px}
#admBottomNav button{appearance:none;-webkit-appearance:none;border:0;background:#fff;color:#41566b;padding:6px 3px;min-height:58px;border-radius:10px;font-size:10px;font-weight:850;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;touch-action:manipulation;cursor:pointer}
#admBottomNav button:active{background:#e9eef2}#admBottomNav .ico{font-size:22px;line-height:1}
body{padding-bottom:82px!important}
@media(min-width:760px){#admBottomNav{left:50%;transform:translateX(-50%);width:min(760px,100%);border-radius:16px 16px 0 0}}
@media(max-width:520px){#admBottomNav button{font-size:9px}.admBottomNav .ico{font-size:20px}}
`;d.head.appendChild(s)}
function clickText(text){
 const all=[...d.querySelectorAll('button,.menuCard,.tile,a')];
 const el=all.find(x=>String(x.textContent||'').toLowerCase().includes(text.toLowerCase()));
 if(el){el.click();return true}return false;
}
function openItem(a){
 if(a==='acoes'){
   if(typeof window.cokeNav==='function'){try{window.cokeNav('Ações Vigentes');return}catch{}}
   if(clickText('Ações Vigentes'))return;
 }
 if(a==='premios'){
   if(typeof window.cokeNav==='function'){try{window.cokeNav('Premiações de Incentivos');return}catch{}}
   if(clickText('Premiações de Incentivos'))return;
 }
 if(a==='materiais'){
   if(typeof window.openMaterialManagerV2==='function'){window.openMaterialManagerV2();return}
   if(clickText('Materiais de Apoio'))return;
 }
 if(a==='telefones'){
   if(clickText('Telefones Úteis'))return;
   alert('Telefones Úteis ainda não possui uma tela específica no ADM.');
 }
}
function build(){
 css();if($('admBottomNav'))return;
 const nav=d.createElement('nav');nav.id='admBottomNav';
 nav.innerHTML='<button type="button" data-a="acoes"><span class="ico">⚡</span><span>Ações Vigentes</span></button><button type="button" data-a="premios"><span class="ico">🏆</span><span>Premiações de Incentivos</span></button><button type="button" data-a="materiais"><span class="ico">📚</span><span>Materiais de Apoio</span></button><button type="button" data-a="telefones"><span class="ico">☎️</span><span>Telefones Úteis</span></button>';
 nav.querySelectorAll('button').forEach(b=>b.onclick=()=>openItem(b.dataset.a));
 d.body.appendChild(nav);
}
function sync(){const login=$('login');const nav=$('admBottomNav');if(!nav)return;const logged=!!sessionStorage.getItem('admToken');nav.style.display=logged?'grid':'none'}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',()=>{build();sync()});else{build();sync()}
setInterval(sync,700);
window.openAdmBottomItem=openItem;
})();