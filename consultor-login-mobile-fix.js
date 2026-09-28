(()=>{
  if(document.getElementById('consultorLoginMobileFix')) return;
  const st=document.createElement('style');
  st.id='consultorLoginMobileFix';
  st.textContent=`
  @media(max-width:760px){
    #login .hero{min-height:245px!important;padding:22px 14px 58px!important;overflow:visible!important}
    #login .hero .brand{display:grid!important;grid-template-columns:118px 3px minmax(0,1fr)!important;gap:14px!important;align-items:center!important;width:100%!important;max-width:100%!important}
    #login .hero .logo{width:118px!important;max-width:118px!important}
    #login .hero .vline{height:90px!important;width:3px!important}
    #login .hero .brand h1{font-size:34px!important;line-height:1.02!important;margin:0 0 10px!important;letter-spacing:-.5px!important;white-space:normal!important}
    #login .hero .brand p{display:block!important;font-size:15px!important;line-height:1.25!important;margin:0!important;color:#fff!important;opacity:.96!important;max-width:210px!important}
    #login .loginCard{width:calc(100% - 24px)!important;max-width:520px!important;margin:-30px auto 26px!important;padding:22px 20px 20px!important;border-radius:24px!important}
    #login .loginCard img{max-width:108px!important;max-height:108px!important;object-fit:cover!important}
    #login .loginCard h2{font-size:30px!important;line-height:1.05!important;margin:10px 0 5px!important}
    #login .loginCard>p{font-size:17px!important;line-height:1.2!important;margin:0 0 14px!important}
    #login .field{margin-top:12px!important}
    #login .field label{font-size:16px!important;margin-bottom:6px!important}
    #login .field input{padding:13px 14px!important;min-height:52px!important;border-radius:14px!important;font-size:16px!important}
    #login #eye{font-size:21px!important}
    #login .enter{padding:14px!important;margin-top:16px!important;min-height:54px!important;font-size:17px!important;border-radius:14px!important}
    #login #shortcutBtnConsultor,.shortcutInstall{margin-top:12px!important;padding:12px 10px!important;min-height:52px!important;font-size:15px!important;border-radius:14px!important}
    #login .shortcutHelp{font-size:12px!important;padding:10px!important}
  }
  @media(max-width:390px){
    #login .hero{min-height:232px!important;padding-left:12px!important;padding-right:12px!important}
    #login .hero .brand{grid-template-columns:104px 3px minmax(0,1fr)!important;gap:11px!important}
    #login .hero .logo{width:104px!important;max-width:104px!important}
    #login .hero .vline{height:82px!important}
    #login .hero .brand h1{font-size:30px!important}
    #login .hero .brand p{font-size:13px!important}
    #login .loginCard{width:calc(100% - 18px)!important;padding:19px 16px 18px!important;margin-top:-27px!important}
    #login .loginCard img{max-width:96px!important;max-height:96px!important}
    #login .loginCard h2{font-size:27px!important}
    #login .loginCard>p{font-size:15px!important}
    #login .field input{min-height:49px!important;padding:11px 12px!important}
    #login .enter{min-height:50px!important}
  }
  /* Desktop: formulário inteiro dentro da altura disponível. */
  @media(min-width:761px){
    #login{min-height:100dvh!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;padding:12px 16px!important;background:linear-gradient(135deg,#500000,#a00000)!important}
    #login .hero{display:none!important}
    #login .loginCard{width:min(500px,100%)!important;max-width:500px!important;margin:0 auto!important;padding:clamp(14px,2.4vh,24px) 30px!important;border-radius:26px!important;box-shadow:0 15px 45px #0003!important}
    #login .loginCard img{width:clamp(68px,11vh,108px)!important;height:clamp(68px,11vh,108px)!important;max-height:11vh!important;object-fit:contain!important}
    #login .loginCard h2{font-size:clamp(23px,3.4vh,32px)!important;line-height:1.08!important;margin:clamp(5px,1vh,10px) 0 4px!important}
    #login .loginCard>p{margin:0 0 clamp(6px,1.2vh,12px)!important;font-size:clamp(14px,2.2vh,18px)!important}
    #login .field{margin-top:clamp(7px,1.4vh,13px)!important}
    #login .field label{margin-bottom:4px!important;font-size:clamp(14px,2.1vh,17px)!important}
    #login .field input{min-height:0!important;height:clamp(39px,6.5vh,54px)!important;padding:8px 14px!important;font-size:16px!important}
    #login #rememberLogin{height:17px!important;width:17px!important}
    #login label:has(#rememberLogin){margin-top:clamp(7px,1.4vh,12px)!important;font-size:clamp(13px,2vh,16px)!important}
    #login .enter{margin-top:clamp(9px,1.8vh,16px)!important;padding:9px!important;min-height:0!important;height:clamp(42px,6.7vh,54px)!important}
    #login .msg{margin-top:5px!important;font-size:13px!important;line-height:1.2!important}
    #login #shortcutBtnConsultor,#login .shortcutInstall{min-height:0!important;padding:8px 10px!important;margin-top:8px!important;font-size:13px!important}
    #login .shortcutHelp{font-size:11px!important;padding:6px!important}
  }
  @media(min-width:761px) and (max-height:650px){
    #login{justify-content:flex-start!important;overflow-y:auto!important}
    #login .loginCard{padding:12px 24px!important}
  }
  #consultorLoadingAccess{margin:18px 0;padding:18px;border-radius:16px;background:#fff;color:#142236;font-weight:900;text-align:center;box-shadow:0 4px 16px #0001}
  #consultorLoadingAccess small{display:block;margin-top:6px;color:#68778a;font-weight:700}
  `;
  document.head.appendChild(st);

  function byId(id){return document.getElementById(id)}
  function showLoading(){
    const results=byId('results');
    if(results)results.innerHTML='<div id="consultorLoadingAccess">Carregando seu acompanhamento...<small>Aguarde enquanto atualizamos metas e realizados.</small></div>';
    const clients=byId('clients');if(clients)clients.innerHTML='';
  }
  function patchLogin(){
    const btn=byId('enter');
    if(!btn||btn.dataset.fastLogin==='1'||typeof api!=='function'||typeof loginView!=='function'||typeof load!=='function')return false;
    btn.dataset.fastLogin='1';
    btn.onclick=async()=>{
      if(btn.disabled)return;
      const msg=byId('msg');
      const matricula=String(byId('mat')?.value||'').trim();
      const senha=String(byId('pass')?.value||'');
      if(!matricula||!senha){if(msg)msg.textContent='Informe matrícula e senha.';return}
      btn.disabled=true;const old=btn.textContent;btn.textContent='ENTRANDO...';if(msg)msg.textContent='Validando acesso...';
      try{
        const j=await api('login',{matricula,senha});
        TOKEN=j.token;sessionStorage.setItem('iturama_token',TOKEN);
        if(msg)msg.textContent='';
        loginView(false);
        if(byId('name'))byId('name').textContent=j.consultor?.nome||j.acesso?.nome||'';
        if(byId('route'))byId('route').textContent=j.consultor?.rota||'';
        showLoading();
        await new Promise(r=>setTimeout(r,50));
        await load();
      }catch(e){
        loginView(true);
        if(msg)msg.textContent=e?.message||'Não foi possível entrar. Tente novamente.';
      }finally{
        btn.disabled=false;btn.textContent=old;
      }
    };
    return true;
  }
  let n=0;const t=setInterval(()=>{if(patchLogin()||++n>80)clearInterval(t)},100);
})();
