(()=>{
  if(document.getElementById('shortcutAdminStyle'))return;
  const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest?v=20260909';document.head.appendChild(manifest);
  const apple=document.createElement('link');apple.rel='apple-touch-icon';apple.href='icons/admin-192.png?v=20260909';document.head.appendChild(apple);
  const theme=document.createElement('meta');theme.name='theme-color';theme.content='#111111';document.head.appendChild(theme);
  const st=document.createElement('style');st.id='shortcutAdminStyle';st.textContent=`.shortcutInstallAdmin{width:100%;margin-top:12px;border:1px solid #dfe4e9;background:#fff;color:#172230;border-radius:12px;padding:12px 14px;font-weight:900}.shortcutHelpAdmin{display:none;margin-top:10px;padding:11px;border-radius:10px;background:#f5f7f9;color:#596672;font-size:13px;line-height:1.4}.shortcutHelpAdmin.show{display:block}`;document.head.appendChild(st);
  let deferred=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
  window.addShortcutAdmin=function(){
    if(deferred){deferred.prompt();deferred.userChoice.finally(()=>deferred=null);return}
    const frame=document.getElementById('adm');const d=frame?.contentDocument;const h=d?.getElementById('shortcutHelpAdmin');if(!h)return;
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
    h.innerHTML=ios?'No iPhone: toque em <b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.':'No Android/Chrome: toque no menu <b>⋮</b> e escolha <b>Adicionar à tela inicial</b>.';h.classList.add('show');
  };
  function inject(){const frame=document.getElementById('adm');if(!frame)return;frame.addEventListener('load',()=>{const d=frame.contentDocument;const login=d?.getElementById('login');if(!login||d.getElementById('shortcutBtnAdmin'))return;const b=d.createElement('button');b.id='shortcutBtnAdmin';b.type='button';b.className='shortcutInstallAdmin';b.textContent='📲 Criar atalho na tela inicial';b.onclick=()=>window.addShortcutAdmin();const h=d.createElement('div');h.id='shortcutHelpAdmin';h.className='shortcutHelpAdmin';login.appendChild(b);login.appendChild(h);const style=d.createElement('style');style.textContent=st.textContent;d.head.appendChild(style)});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();
