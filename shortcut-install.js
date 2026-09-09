(()=>{
  if(document.getElementById('shortcutInstallStyle')) return;
  const manifest=document.createElement('link');
  manifest.rel='manifest'; manifest.href='manifest-consultor.webmanifest?v=20260909'; document.head.appendChild(manifest);
  const apple=document.createElement('link');
  apple.rel='apple-touch-icon'; apple.href='icons/consultor-192.png?v=20260909'; document.head.appendChild(apple);
  const theme=document.createElement('meta'); theme.name='theme-color'; theme.content='#e30613'; document.head.appendChild(theme);
  const st=document.createElement('style'); st.id='shortcutInstallStyle'; st.textContent=`.shortcutInstall{width:100%;margin-top:12px;border:1px solid #e4e8ec;background:#fff;color:#172230;border-radius:14px;padding:13px 14px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:9px}.shortcutInstall small{font-weight:600;color:#65717c}.shortcutHelp{display:none;margin-top:10px;padding:12px;border-radius:12px;background:#f5f7f9;color:#52606d;font-size:13px;line-height:1.4}.shortcutHelp.show{display:block}`; document.head.appendChild(st);
  let deferred=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
  function install(){
    if(deferred){deferred.prompt();deferred.userChoice.finally(()=>deferred=null);return}
    const h=document.getElementById('shortcutHelpConsultor'); if(!h)return;
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
    h.innerHTML=ios?'No iPhone: toque em <b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.':'No Android/Chrome: toque no menu <b>⋮</b> e escolha <b>Adicionar à tela inicial</b>.';
    h.classList.add('show');
  }
  function add(){
    const card=document.querySelector('#login .loginCard'); if(!card){setTimeout(add,200);return}
    if(document.getElementById('shortcutBtnConsultor'))return;
    const b=document.createElement('button'); b.id='shortcutBtnConsultor'; b.type='button'; b.className='shortcutInstall'; b.innerHTML='📲 Criar atalho na tela inicial'; b.onclick=install;
    const h=document.createElement('div'); h.id='shortcutHelpConsultor'; h.className='shortcutHelp';
    card.appendChild(b); card.appendChild(h);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add); else add();
})();
