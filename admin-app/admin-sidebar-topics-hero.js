(()=>{
const d=document,w=window;
const s=d.createElement('style');s.id='admSidebarTopicsHero';s.textContent=`
/* Cabeçalho de boas-vindas responsivo */
#app .homeHero{padding:22px 24px!important}
#app .homeHeroTop{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:start!important;gap:12px!important}
#app .homeHello{display:grid!important;grid-template-columns:74px minmax(0,1fr);align-items:center!important;gap:14px!important;min-width:0!important}
#app .homeHello>div:last-child{min-width:0!important}
#app .homeHello .cokeBrand{font-size:clamp(24px,4vw,32px)!important;line-height:1.1!important;white-space:nowrap!important;letter-spacing:-1px!important}
#app .homeHello h1{font-size:clamp(22px,4.6vw,33px)!important;line-height:1.17!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important;margin-top:7px!important}
#app .homeHello p{font-size:clamp(13px,2.5vw,18px)!important;line-height:1.35!important}
#app .homeHero .adminBadge{font-size:12px!important;padding:8px 12px!important;white-space:nowrap!important}
#admSideNav .admTopic{border-bottom:1px solid #edf0f4;margin:4px 0;padding-bottom:4px}
#admSideNav .admTopicHead{display:flex!important;justify-content:space-between;align-items:center;font-weight:800!important;color:#253448!important;background:#f4f6fa!important}
#admSideNav .admTopicHead[aria-expanded="true"]{background:#e8eef8!important;color:#b60011!important}
#admSideNav .admTopicItems{padding:3px 0 5px 11px}
#admSideNav .admTopicItems[hidden]{display:none!important}
#admSideNav .admTopicItems button{font-size:13px!important;padding:10px 8px!important;margin:2px 0!important}
#admSideNav .admTopicItems button.on{background:#df1017!important;color:white!important}
@media(max-width:600px){
 #app .homeHero{padding:17px 14px!important;border-radius:22px!important}
 #app .homeHeroTop{grid-template-columns:minmax(0,1fr)!important;gap:10px!important}
 #app .homeHello{grid-template-columns:66px minmax(0,1fr)!important;gap:11px!important}
 #app .homeAvatar{width:66px!important;height:66px!important}
 #app .homeHello .cokeBrand{font-size:27px!important}
 #app .homeHello h1{font-size:clamp(22px,6vw,30px)!important}
 #app .homeHello p{font-size:14px!important}
 #app .homeHero .adminBadge{justify-self:start!important;margin-left:77px!important;font-size:11px!important;padding:6px 11px!important}
}
@media(max-width:365px){#app .homeHello{grid-template-columns:54px minmax(0,1fr)!important;gap:9px!important}#app .homeAvatar{width:54px!important;height:54px!important}#app .homeHello h1{font-size:21px!important}#app .homeHero .adminBadge{margin-left:63px!important}}
`;d.head.appendChild(s);
const brand=d.querySelector('#app .homeHello .cokeBrand');if(brand)brand.remove();
const nav=d.getElementById('admSideNav'),app=d.getElementById('app');
if(!nav||!app)return;
let rendering=false;
function closeMenu(){app.classList.remove('admSideOpen');d.getElementById('admMenuToggle')?.setAttribute('aria-expanded','false')}
function item(label,original){const b=d.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{original.click();closeMenu();setTimeout(()=>{const home=d.getElementById('cokeHome');if(home&&!home.classList.contains('hide'))w.scrollTo(0,0)},30)};return b}
function build(){
 const home=d.getElementById('cokeHome');if(!home||!home.querySelector('.menuTopic')||rendering)return;
 rendering=true;
 const expanded=new Set([...nav.querySelectorAll('.admTopicHead[aria-expanded="true"]')].map(x=>x.dataset.topic));
 nav.innerHTML='';
 const heading=d.createElement('div');heading.className='admNavTitle';heading.textContent='Navegação';nav.appendChild(heading);
 const homeButton=d.createElement('button');homeButton.type='button';homeButton.textContent='🏠  Início';homeButton.onclick=()=>{if(typeof w.show==='function')w.show();else home.classList.remove('hide');closeMenu();w.scrollTo(0,0)};nav.appendChild(homeButton);
 [...home.querySelectorAll('.menuTopic')].forEach((topic,index)=>{
  const title=topic.querySelector('.topicHead h2')?.textContent.trim()||'Outros';
  const emoji=topic.querySelector('.topicIcon')?.textContent.trim()||'▣';
  const group=d.createElement('div');group.className='admTopic';
  const head=d.createElement('button');head.type='button';head.className='admTopicHead';head.dataset.topic=title;
  const opened=expanded.size?expanded.has(title):index===0;
  head.setAttribute('aria-expanded',String(opened));head.textContent=emoji+'  '+title+'  '+(opened?'⌄':'›');
  const children=d.createElement('div');children.className='admTopicItems';children.hidden=!opened;
  head.onclick=()=>{const open=head.getAttribute('aria-expanded')!=='true';head.setAttribute('aria-expanded',String(open));head.textContent=emoji+'  '+title+'  '+(open?'⌄':'›');children.hidden=!open};
  group.appendChild(head);
  topic.querySelectorAll('.menuCard').forEach(card=>{const label=card.querySelector('b')?.textContent.trim()||card.textContent.trim();children.appendChild(item(label,card))});
  group.appendChild(children);nav.appendChild(group);
 });
 rendering=false;
}
build();
let tries=0;const timer=setInterval(()=>{if(d.getElementById('cokeHome')?.querySelector('.menuTopic')){build();clearInterval(timer)}else if(++tries>35)clearInterval(timer)},250);
})();

/* Atalhos inferiores: consulta no ADM sem alterar telas de cadastro. */
(()=>{
const d=document;
if(d.getElementById('admQuickNav'))return;
const css=d.createElement('style');css.textContent=`
#app:not(.hide){padding-bottom:calc(98px + env(safe-area-inset-bottom))!important}
#app.admSideReady>.wrap{padding-bottom:calc(125px + env(safe-area-inset-bottom))!important}
#admQuickNav{position:fixed;bottom:0;left:0;right:0;z-index:120;background:#fff;border-top:1px solid #dce3e9;box-shadow:0 -5px 18px #0002;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;padding:7px 7px calc(7px + env(safe-area-inset-bottom))}
#admQuickNav[hidden]{display:none!important}
#admQuickNav button{min-width:0;min-height:62px;padding:4px 2px;background:transparent;color:#41566b;border:0;border-radius:10px;font-size:10px;font-weight:800;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;line-height:1.2;white-space:normal}
#admQuickNav button:active{background:#f3f6f8}#admQuickNav .ico{font-size:22px;line-height:1}
#admQuickOverlay{position:fixed;inset:0;z-index:210;background:#0009;display:none;align-items:center;justify-content:center;padding:12px}
#admQuickOverlay.open{display:flex}#admQuickSheet{width:min(760px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:#f4f6f8;border-radius:17px}
#admQuickTop{position:sticky;top:0;z-index:1;background:linear-gradient(135deg,#111,#990000);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:13px}
#admQuickTop h2{margin:0;font-size:18px}#admQuickClose{background:#fff;color:#222}
#admQuickBody{padding:12px 12px calc(22px + env(safe-area-inset-bottom));overflow-wrap:anywhere}
.admQuickCard{background:#fff;padding:14px;margin-bottom:10px;border-radius:13px;box-shadow:0 2px 10px #0001}
.admQuickCard h3{margin:0 0 9px;font-size:16px}.admQuickCard p{white-space:pre-wrap;line-height:1.45}
.admQuickCard img{max-width:100%;height:auto;border-radius:9px}.admQuickCard a{display:inline-block;margin-top:8px;color:#0756aa;font-weight:800}
@media(min-width:900px){#admQuickNav{left:50%;right:auto;transform:translateX(-50%);width:min(760px,100%);border-radius:15px 15px 0 0}}
@media(max-width:390px){#admQuickNav button{font-size:9px}#admQuickNav .ico{font-size:20px}}
`;d.head.appendChild(css);
const nav=d.createElement('nav');nav.id='admQuickNav';nav.setAttribute('aria-label','Atalhos de consulta do administrador');
nav.innerHTML=[['acoes','⚡','Ações Vigentes'],['premios','🏆','Premiações de Incentivos'],['materiais','📚','Materiais de Apoio'],['telefones','☎️','Telefones Úteis']].map(([id,ico,label])=>`<button type="button" data-quick="${id}"><span class="ico">${ico}</span><span>${label}</span></button>`).join('');
d.body.appendChild(nav);
const ov=d.createElement('div');ov.id='admQuickOverlay';ov.innerHTML='<div id="admQuickSheet" role="dialog" aria-modal="true" aria-labelledby="admQuickTitle"><div id="admQuickTop"><h2 id="admQuickTitle"></h2><button type="button" id="admQuickClose">Fechar</button></div><div id="admQuickBody"></div></div>';d.body.appendChild(ov);
const E=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeUrl=v=>{try{const u=new URL(String(v),location.href);return ['https:','http:'].includes(u.protocol)?E(u.href):''}catch{return''}};
const body=d.getElementById('admQuickBody'),title=d.getElementById('admQuickTitle');
const close=()=>ov.classList.remove('open');d.getElementById('admQuickClose').onclick=close;ov.onclick=e=>{if(e.target===ov)close()};
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/conteudos-consultor-api';
async function publicItems(tipo){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'list_public',tipo})});const j=await r.json();if(!r.ok)throw Error(j.error||'Falha ao consultar');return j.items||[]}
function card(x){const img=safeUrl(x.imagem_url),link=safeUrl(x.url||x.arquivo_url||x.link);return `<article class="admQuickCard">${x.titulo||x.nome?`<h3>${E(x.titulo||x.nome)}</h3>`:''}${x.texto||x.descricao?`<p>${E(x.texto||x.descricao)}</p>`:''}${img?`<img src="${img}" alt="${E(x.titulo||x.nome||'Material')}">`:''}${link?`<a href="${link}" target="_blank" rel="noopener noreferrer">Abrir material ↗</a>`:''}</article>`}
async function open(id){const labels={acoes:'⚡ Ações Vigentes',premios:'🏆 Premiações de Incentivos',materiais:'📚 Materiais de Apoio',telefones:'☎️ Telefones Úteis'};title.textContent=labels[id];ov.classList.add('open');body.textContent='Carregando...';
try{
if(id==='acoes'||id==='premios'){const a=await publicItems(id==='acoes'?'acoes_vigentes':'premiacoes_incentivos');body.innerHTML=a.length?a.map(card).join(''):'<div class="admQuickCard">Nenhuma informação cadastrada.</div>';return}
const cfg=typeof config!=='undefined'?config:null;
if(!cfg){body.textContent='Aguarde o carregamento dos dados do administrador e tente novamente.';return}
if(id==='materiais'){const a=[...(cfg.materiais||[])].sort((x,y)=>(x.ordem||999)-(y.ordem||999));body.innerHTML=a.length?a.map(card).join(''):'<div class="admQuickCard">Nenhum material cadastrado.</div>';return}
const a=[...(cfg.telefones||[])].sort((x,y)=>(x.ordem||999)-(y.ordem||999));body.innerHTML=a.length?a.map(x=>`<article class="admQuickCard"><h3>${E(x.nome)}</h3>${x.telefone?`<a href="tel:${E(String(x.telefone).replace(/[^+0-9]/g,''))}">${E(x.telefone)}</a>`:''}${x.observacao?`<p>${E(x.observacao)}</p>`:''}</article>`).join(''):'<div class="admQuickCard">Nenhum telefone cadastrado.</div>';
}catch(e){body.textContent='Não foi possível carregar: '+e.message}}
nav.querySelectorAll('button').forEach(b=>b.onclick=()=>open(b.dataset.quick));
function sync(){nav.hidden=d.getElementById('app')?.classList.contains('hide')!==false;if(nav.hidden)close()}
new MutationObserver(sync).observe(d.getElementById('app'),{attributes:true,attributeFilter:['class']});sync();
})();
