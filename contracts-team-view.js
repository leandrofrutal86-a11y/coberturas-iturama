(()=>{
'use strict';
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/contratos-api';
const $=id=>document.getElementById(id);
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const monthNow=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
function token(){try{return String(sessionStorage.getItem('admToken')||((typeof TOKEN!=='undefined'&&TOKEN)||'')||sessionStorage.getItem('iturama_token')||'')}catch{return''}}
async function call(body){const r=await fetch(API+'?v='+Date.now(),{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token(),...body})});const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j}
let state={routes:[],documents:[]};
function css(){if($('ctTeamCss'))return;const s=document.createElement('style');s.id='ctTeamCss';s.textContent=`
.ctTeamOverlay{display:none;position:fixed;inset:0;z-index:32000;background:#f2f5f8;overflow:auto}.ctTeamOverlay.show{display:block}
.ctTeamTop{position:sticky;top:0;z-index:5;background:linear-gradient(135deg,#090909,#8d0000);color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}.ctTeamTop h2{margin:0;font-size:21px}.ctTeamTop small{display:block;margin-top:3px;color:#ffe7e7}.ctTeamTop button{border:0;border-radius:10px;background:#fff;padding:10px 14px;font-weight:950}
.ctTeamBody{width:min(1080px,calc(100% - 16px));margin:14px auto 90px}.ctTeamRouteSection{background:#fff;border:1px solid #dce4ea;border-radius:16px;padding:13px;margin-top:12px}.ctTeamRouteHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.ctTeamRouteHead h3{margin:0;font-size:19px;color:#172534}.ctTeamRouteHead small{color:#66798a}.ctTeamDocs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.ctTeamDoc{border:1px solid #dce3e9;border-radius:12px;padding:10px}.ctTeamDoc img{width:100%;max-height:240px;object-fit:contain;background:#f4f6f8;border-radius:8px}.ctTeamDoc h4{margin:8px 0 4px}.ctTeamDoc small{color:#66798a}.ctTeamDoc a{display:inline-block;margin-top:8px;text-decoration:none;background:#1677d2;color:#fff;border-radius:8px;padding:8px 10px;font-weight:900}.ctTeamEmpty{text-align:center;padding:22px;color:#66798a;font-weight:800}
@media(max-width:760px){.ctTeamDocs{grid-template-columns:1fr}.ctTeamTop h2{font-size:18px}.ctTeamRouteHead{align-items:flex-start;flex-direction:column}}
`;document.head.appendChild(s)}
function build(){if($('ctTeamOverlay'))return;document.body.insertAdjacentHTML('beforeend',`<div id="ctTeamOverlay" class="ctTeamOverlay"><div class="ctTeamTop"><div><h2>📄 Contratos da Equipe</h2><small>Contratos publicados separados por rota.</small></div><button id="ctTeamClose">FECHAR</button></div><div class="ctTeamBody"><div id="ctTeamPublished"></div></div></div>`);$('ctTeamClose').onclick=()=>$('ctTeamOverlay').classList.remove('show')}
function renderPublished(){
 const host=$('ctTeamPublished');if(!host)return;
 const routes=state.routes||[],docs=state.documents||[];
 host.innerHTML=routes.map(r=>{
   const rd=docs.filter(d=>(d.rotas||[]).includes(String(r.rota)));
   return '<section class="ctTeamRouteSection"><div class="ctTeamRouteHead"><div><h3>'+E(r.rota)+' - '+E(r.nome||'')+'</h3><small>'+rd.length+' contrato(s) publicado(s)</small></div></div>'+(rd.length?'<div class="ctTeamDocs">'+rd.map(d=>'<article class="ctTeamDoc">'+(d.tipo==='imagem'&&d.signed_url?'<img src="'+E(d.signed_url)+'" alt="">':'<div style="font-size:42px">📄</div>')+'<h4>'+E(d.titulo)+'</h4><small>Publicado para: '+E((d.rotas||[]).join(', '))+'</small>'+(d.signed_url?'<a href="'+E(d.signed_url)+'" target="_blank" rel="noopener">ABRIR</a>':'')+'</article>').join('')+'</div>':'<div class="ctTeamEmpty">Nenhum contrato publicado para esta rota.</div>')+'</section>';
 }).join('');
}
async function load(){
 const host=$('ctTeamPublished');if(host)host.innerHTML='<div class="ctTeamEmpty">Carregando contratos publicados...</div>';
 try{
   const j=await call({action:'team_init'});
   state={routes:j.routes||[],documents:j.documents||[]};
   renderPublished();
 }catch(e){
   if(host)host.innerHTML='<div class="ctTeamEmpty">'+E(e.message)+'</div>';
 }
}
async function open(){css();build();$('ctTeamOverlay').classList.add('show');await load()}
window.openTeamContracts=open;
})();