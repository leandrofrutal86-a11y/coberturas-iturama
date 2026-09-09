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
  }`;
  document.head.appendChild(st);
})();
