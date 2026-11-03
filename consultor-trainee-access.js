(()=>{
const d=document;
function data(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}
function isTrainee(){const x=data();return x?.perfil==='acompanhante'&&String(x?.acesso?.tipo_perfil||'').toLowerCase()==='trainee'}
function mode(){return String(data()?.acesso?.modo_acesso||'team')}
function route(){return String(data()?.acesso?.rota_permitida||'').trim()}
function label(){const x=data();return String(x?.acesso?.nome||'Carlos')}
function hideDefaultPvSearch(){
 const hero=d.querySelector('#consultorModernHome .cmSearchHero');
 if(!hero)return;
 if(isTrainee()&&mode()==='team')hero.style.display='none';
 else hero.style.display='';
}
function ensureTeamSearch(){
 if(!isTrainee()||mode()!=='team')return;
 let box=d.getElementById('traineeTeamSearch');
 const home=d.getElementById('consultorModernHome');
 const oldHero=home?.querySelector('.cmSearchHero');
 if(!home||!oldHero)return;
 if(!box){
   box=d.createElement('section');box.id='traineeTeamSearch';
   box.innerHTML='<div class="ttsHead"><div><b>🔎 Pesquisa de Clientes</b><small>Pesquise qualquer cliente da equipe ou liste os clientes pelo dia da visita.</small></div></div><div class="ttsRoute"><label>ROTA DA PESQUISA</label><select id="ttsRoute"><option value="TODOS">Todas as rotas</option>'+(data()?.consultores||[]).map(c=>'<option value="'+String(c.rota||'')+'">'+String(c.rota||'')+' - '+String(c.nome||'')+'</option>').join('')+'</select></div><div class="ttsPv"><input id="ttsPvInput" inputmode="numeric" placeholder="Digite o PV do cliente"><button type="button" id="ttsPvBtn">Pesquisar</button></div><div class="ttsDays"><b>Escolha o dia da visita</b><div>'+['SEG','TER','QUA','QUI','SEX'].map(x=>'<button type="button" data-tts-day="'+x+'">'+x+'</button>').join('')+'</div><button type="button" id="ttsListBtn" class="ttsList">Listar clientes do dia ▾</button></div>';
   oldHero.parentNode.insertBefore(box,oldHero);
   d.getElementById('ttsRoute').onchange=async()=>{const rt=d.getElementById('ttsRoute').value||'TODOS';window.__pvSearchRoute=rt;try{sessionStorage.setItem('pv_rota_pesquisa',rt)}catch{}try{await window.__setPvSearchRoute?.(rt)}catch{}};
   d.getElementById('ttsPvBtn').onclick=async()=>{const v=d.getElementById('ttsPvInput').value.trim();if(!v)return;const rt=d.getElementById('ttsRoute')?.value||'TODOS';window.__pvSearchRoute=rt;try{openPv()}catch{}await new Promise(r=>setTimeout(r,30));const p=d.getElementById('pv');if(p)p.value=v;try{if(typeof searchPv==='function')await searchPv();else if(typeof window.searchPv==='function')await window.searchPv()}catch{}};
   d.getElementById('ttsPvInput').onkeydown=e=>{if(e.key==='Enter')d.getElementById('ttsPvBtn').click()};
   box.querySelectorAll('[data-tts-day]').forEach(btn=>btn.onclick=async()=>{box.querySelectorAll('[data-tts-day]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');try{await window.__setPvHomeDay?.(btn.dataset.ttsDay)}catch{}});
   d.getElementById('ttsListBtn').onclick=async()=>{const rt=d.getElementById('ttsRoute')?.value||'TODOS';window.__pvSearchRoute=rt;try{sessionStorage.setItem('pv_rota_pesquisa',rt)}catch{}try{await window.__setPvSearchRoute?.(rt)}catch{}try{window.__openPvHomePicker?.()}catch{}};
 }
 oldHero.style.display='none';
 box.style.display='block';
 const rt=d.getElementById('ttsRoute');if(rt){const saved=sessionStorage.getItem('pv_rota_pesquisa')||'TODOS';rt.value=[...rt.options].some(o=>o.value===saved)?saved:'TODOS'}
 const cur=(sessionStorage.getItem('pv_dia_visita')||'SEG').toUpperCase();
 box.querySelectorAll('[data-tts-day]').forEach(x=>x.classList.toggle('active',x.dataset.ttsDay===cur));
}
function ensureTeamSearchCss(){
 if(d.getElementById('traineeTeamSearchStyle'))return;
 const s=d.createElement('style');s.id='traineeTeamSearchStyle';s.textContent=`
 #traineeTeamSearch{box-sizing:border-box;margin:0 0 18px;width:100%;background:#ef0000;border-radius:22px;padding:18px;color:#fff;box-shadow:0 8px 24px #0001}
 .ttsHead b{font-size:24px;display:block}.ttsHead small{font-size:13px;font-weight:700;opacity:.9}
 .ttsRoute{margin-top:14px}.ttsRoute label{display:block;font-size:11px;font-weight:900;margin-bottom:5px}.ttsRoute select{width:100%;border:0;border-radius:12px;padding:12px;font-size:14px}.ttsPv{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:10px}.ttsPv input{border:0;border-radius:13px;padding:14px;font-size:16px}.ttsPv button,.ttsList{border:0;border-radius:13px;padding:0 22px;font-weight:950;background:#fff;color:#d50000}
 .ttsDays{margin-top:13px;border:1px solid #ffffff55;border-radius:15px;padding:12px}.ttsDays>b{font-size:13px}.ttsDays>div{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:9px 0}.ttsDays [data-tts-day]{border:1px solid #ffffff88;background:#ffffff14;color:#fff;border-radius:9px;padding:10px 4px;font-weight:900}.ttsDays [data-tts-day].active{background:#fff;color:#d50000}.ttsList{width:100%;height:44px;background:#171717;color:#fff}
 @media(max-width:600px){#traineeTeamSearch{width:100%;padding:12px;border-radius:17px}.ttsHead b{font-size:19px}.ttsPv{grid-template-columns:1fr}.ttsPv button{height:42px}.ttsDays [data-tts-day]{font-size:10px;padding:9px 1px}}
 `;d.head.appendChild(s)
}
function sync(){
 if(!isTrainee())return;
 ensureTeamSearchCss();
 const m=mode(),r=route(),x=data();
 try{sessionStorage.setItem('iturama_context',m==='route'?r:'TEAM')}catch{}
 const hello=d.querySelector('#consultorModernHome .cmHello strong');if(hello)hello.textContent='Olá, '+label();
 const name=d.getElementById('name');if(name)name.textContent=label();
 const routeEl=d.getElementById('route');if(routeEl)routeEl.textContent=m==='route'?r:'Visão da Equipe';

 if(m==='team'){
   hideDefaultPvSearch();
   ensureTeamSearch();
   window.__pvSearchRoute='TODOS';
   try{
     TAB='equipe';
     const cat=d.getElementById('cat');
     if(cat&&cat.dataset.traineeTeam!=='1'){
       const v=cat.value||'ALL';
       cat.innerHTML='<option value="ALL">Todos os incentivos</option>';
       (x?.team||[]).forEach(row=>cat.insertAdjacentHTML('beforeend','<option value="'+String(row.nome||'').replace(/"/g,'&quot;')+'">'+String(row.nome||'')+'</option>'));
       cat.value=[...cat.options].some(o=>o.value===v)?v:'ALL';
       cat.dataset.traineeTeam='1';
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
let lastSig='';
function safeSync(force=false){
 const x=data();const sig=x?JSON.stringify([x?.acesso?.tipo_perfil,x?.acesso?.modo_acesso,x?.acesso?.rota_permitida,x?.consultor?.rota,(x?.team||[]).map(r=>[r.nome,r.meta,r.realizado])]):'';
 if(!force&&sig&&sig===lastSig)return;
 lastSig=sig;
 try{sync()}catch{}
}
window.addEventListener('iturama:dashboard-ready',()=>setTimeout(()=>safeSync(true),40));
window.addEventListener('iturama:routechange',()=>setTimeout(()=>safeSync(true),40));
window.addEventListener('pageshow',()=>setTimeout(()=>safeSync(true),120));
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',()=>setTimeout(()=>safeSync(true),80));else setTimeout(()=>safeSync(true),80);
setInterval(()=>safeSync(false),3000);
})();