(()=>{
const d=document,w=window;
if(d.getElementById('admSideNav'))return;
const style=d.createElement('style');style.textContent=`
#app.admSideReady{min-height:100vh;background:#f3f6fa}
#app.admSideReady>header{background:#dc0614!important;position:sticky;top:0;z-index:110;padding:12px 18px!important;min-height:65px}
#admMenuToggle{background:#ffffff20;color:white;font-size:24px;padding:7px 13px;margin-right:10px}
#admSideNav{position:fixed;top:65px;bottom:0;left:0;width:228px;background:#fff;border-right:1px solid #e2e8f0;z-index:105;overflow-y:auto;padding:13px 9px;box-shadow:2px 0 12px #14223509}
#admSideNav button{display:flex;align-items:center;gap:10px;width:100%;margin:3px 0;padding:12px 11px;background:transparent;color:#34445a;text-align:left;font-size:14px;border-radius:10px;white-space:normal}
#admSideNav button.on{background:#df1017!important;color:#fff!important}
#admSideNav button:hover:not(.on){background:#f0f3f8}
#admSideNav .admNavTitle{font-size:11px;color:#7b8798;padding:12px 12px 4px;text-transform:uppercase;font-weight:800}
#app.admSideReady>.wrap{margin:0 0 0 228px;max-width:none;padding:20px;min-width:0}
#app.admSideReady>.wrap>.tabs{display:none!important}
#app.admSideReady .box{max-width:100%}
#admSideBackdrop{display:none}
#app.admSideCollapsed #admSideNav{transform:translateX(-105%)}
#app.admSideCollapsed>.wrap{margin-left:0}
@media(max-width:900px){
 #app.admSideReady>.wrap{margin-left:0;padding:10px!important}
 #admSideNav{top:65px;width:min(290px,85vw);transform:translateX(-105%);transition:transform .2s;box-shadow:5px 0 25px #0002}
 #app.admSideOpen #admSideNav{transform:translateX(0)}
 #app.admSideOpen #admSideBackdrop{display:block;position:fixed;inset:65px 0 0;background:#0007;z-index:104}
 #app.admSideReady>header{padding:10px!important}
 #app.admSideReady>header b{font-size:13px}
 #app.admSideReady .form2,#app.admSideReady .form3{grid-template-columns:minmax(0,1fr)}
}
`;d.head.appendChild(style);
const app=d.getElementById('app'),header=app?.querySelector(':scope > header'),wrap=app?.querySelector(':scope > .wrap'),tabs=wrap?.querySelector(':scope > .tabs');
if(!app||!header||!wrap||!tabs)return;
const toggle=d.createElement('button');toggle.id='admMenuToggle';toggle.type='button';toggle.textContent='☰';toggle.setAttribute('aria-label','Abrir ou fechar menu');header.insertBefore(toggle,header.firstChild);
const nav=d.createElement('nav');nav.id='admSideNav';nav.setAttribute('aria-label','Menu administrativo');app.insertBefore(nav,wrap);
const backdrop=d.createElement('div');backdrop.id='admSideBackdrop';app.insertBefore(backdrop,wrap);
function close(){app.classList.remove('admSideOpen');toggle.setAttribute('aria-expanded','false')}
toggle.onclick=()=>{if(w.innerWidth<=900){app.classList.toggle('admSideOpen');toggle.setAttribute('aria-expanded',String(app.classList.contains('admSideOpen')))}else app.classList.toggle('admSideCollapsed')};
backdrop.onclick=close;
const icons={visao:'🏠',acomp:'📊',pesquisa:'🔎',metas:'🎯',consultores:'👥',telefones:'☎️',materiais:'📚',vendas:'⬆️',equipe:'📈'};
function sectionOf(btn){return (btn.getAttribute('onclick')||'').match(/aba\(['"]([^'"]+)/)?.[1]||''}
function showMetaOnly(only){const sec=d.getElementById('metas');if(!sec)return;const boxes=[...sec.querySelectorAll(':scope > .box')];if(boxes.length<2)return;boxes.forEach((b,i)=>b.style.display=only?(i===boxes.length-1?'':'none'):'');}
function sync(){const active=tabs.querySelector('button.on');const section=active?sectionOf(active):'';nav.querySelectorAll('button[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===(section==='metas'?(app.dataset.metaOnly==='1'?'metaOnly':'metas'):section)))}
function makeBtn(label,icon,section,metaOnly=false){const b=d.createElement('button');b.type='button';b.dataset.nav=metaOnly?'metaOnly':section;b.textContent=icon+'  '+label;b.onclick=()=>{const target=[...tabs.querySelectorAll('button')].find(x=>sectionOf(x)===section);if(!target)return;app.dataset.metaOnly=metaOnly?'1':'0';target.click();showMetaOnly(metaOnly);sync();close();w.scrollTo(0,0)};return b}
function rebuild(){nav.innerHTML='';const title=d.createElement('div');title.className='admNavTitle';title.textContent='Painel administrativo';nav.appendChild(title);const items=[...tabs.querySelectorAll('button')];for(const original of items){const section=sectionOf(original);if(!section)continue;let label=original.textContent.replace(/^[^\p{L}\p{N}]+/u,'').trim();if(section==='metas')label='Categorias';nav.appendChild(makeBtn(label,icons[section]||'▣',section));if(section==='metas')nav.appendChild(makeBtn('Metas','🎯',section,true))}sync()}
const observer=new MutationObserver(()=>{if(!d.getElementById('admSideNav'))return;rebuild()});observer.observe(tabs,{childList:true,subtree:false});
tabs.addEventListener('click',()=>{setTimeout(()=>{if(app.dataset.metaOnly!=='1')showMetaOnly(false);sync()},0)});
app.classList.add('admSideReady');rebuild();
w.addEventListener('resize',()=>{if(w.innerWidth>900)close()});
})();