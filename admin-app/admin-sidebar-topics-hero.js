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