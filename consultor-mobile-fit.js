(()=>{
  if(document.getElementById('consultorMobileFit'))return;
  const s=document.createElement('style');
  s.id='consultorMobileFit';
  s.textContent=`
  html,body{max-width:100%;overflow-x:hidden}
  body{width:100%;}
  .wrap,.topbar,.brand{max-width:100%;}
  .overlay,.sheet,.sheetBody,.clientHead,.tableWrap{max-width:100%;}
  @media(max-width:760px){
    .hero{min-height:190px;padding:20px 14px}
    .brand{gap:10px}.logo{width:95px}.vline{height:46px}
    .hero h1{font-size:24px;margin:0 0 5px}.hero p{margin:0}
    .loginCard{width:calc(100% - 20px);margin:-38px auto 18px;padding:20px;border-radius:20px}
    .field{margin-top:12px}.field input{padding:13px}.enter{padding:13px;margin-top:14px}
    .top{padding:9px 8px}.topbar{gap:7px}.topbar .logo{width:72px}.topbar .vline{height:34px;width:2px}.user{font-size:12px}.logout{padding:7px 9px;font-size:12px}
    .wrap{width:100%;margin:8px 0 54px;padding:0 8px}
    .quick{grid-template-columns:1fr 1fr!important;gap:7px}.quick .q{padding:11px;font-size:13px;min-width:0}.quick .pv{grid-column:1/-1}
    .summary{grid-template-columns:1fr 1fr!important;gap:7px;margin:8px 0}.sum{padding:10px;font-size:11px}.sum strong{font-size:19px}.sum small{display:block;clear:both}
    .tools{grid-template-columns:1fr!important;gap:8px;padding:10px}.group+.group{padding-top:8px}.gt{font-size:12px;margin-bottom:7px}.tiles{grid-template-columns:1fr 1fr!important;gap:6px}.tile{padding:9px;font-size:12px;min-width:0;overflow-wrap:anywhere}
    .mot{margin-top:8px;padding:12px;font-size:15px}.tabs{margin-top:8px}.tab{padding:9px;font-size:12px}.panel{padding:8px;margin-top:8px}.panel h2{font-size:16px;margin:4px 0}.head{gap:6px}.head select{padding:8px;font-size:13px}
    #results .tableWrap{margin-top:8px!important;border-radius:10px!important}
    #results table{font-size:10px!important;line-height:1.15!important}
    #results th,#results td{padding:6px 4px!important}
    #results th{font-size:10px!important;line-height:1.05!important}
    #results td{font-size:10px!important;font-weight:700!important}
    #results td b{font-size:10px!important;line-height:1.12!important}
    #results th:nth-child(1),#results td:nth-child(1){width:36%!important}
    #results th:nth-child(2),#results td:nth-child(2){width:14%!important;text-align:center!important}
    #results th:nth-child(3),#results td:nth-child(3){width:20%!important;text-align:center!important}
    #results th:nth-child(4),#results td:nth-child(4){width:14%!important;text-align:center!important}
    #results th:nth-child(5),#results td:nth-child(5){width:16%!important;text-align:center!important}
    #results tbody tr{min-height:0!important}
    .overlay{padding:0!important;align-items:stretch!important;background:#f2f5f8!important}
    .sheet{width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;border-radius:0!important;overflow-y:auto!important;overflow-x:hidden!important}
    .sheetTop{padding:10px 12px;align-items:center}.sheetTop h2{font-size:22px;margin:0}.sheetTop button{padding:8px 12px}
    .sheetBody{padding:8px!important;width:100%!important;overflow-x:hidden!important}
    .search{grid-template-columns:1fr!important;gap:6px}.search input,.search button{width:100%!important;min-width:0!important;padding:11px}
    .clientHead{padding:10px;margin:8px 0}.clientHead h2,.clientHead h3{font-size:18px;overflow-wrap:anywhere}
    .tableWrap{width:100%!important;overflow-x:hidden!important;border-radius:10px}
    .tableWrap table,.sheet table{width:100%!important;min-width:0!important;table-layout:fixed!important;font-size:11px}
    .tableWrap th,.tableWrap td,.sheet th,.sheet td{padding:8px 6px!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;vertical-align:middle}
    #pvout table thead th{background:#e30613!important;color:#fff!important;font-weight:900!important;text-align:left!important;border-bottom:0!important}
    #pvout table tbody tr:nth-child(odd){background:#eef6ff!important}
    #pvout table tbody tr:nth-child(even){background:#fff!important}
    #pvout table th:nth-child(1),#pvout table td:nth-child(1){width:58%!important}
    #pvout table th:nth-child(2),#pvout table td:nth-child(2){width:16%!important;text-align:center!important;white-space:nowrap!important;overflow-wrap:normal!important}
    #pvout table th:nth-child(3),#pvout table td:nth-child(3){width:26%!important;text-align:center!important}
    #pvout table th:nth-child(2){font-size:0!important}
    #pvout table th:nth-child(2)::after{content:'-';font-size:12px!important;color:#fff!important}
    .pill{font-size:9px;padding:4px 5px;white-space:nowrap}
    .footer{padding:12px;font-size:11px}
  }
  `;
  document.head.appendChild(s);

  function restoreSituacaoCompacta(){
    const out=document.getElementById('pvout');
    if(!out)return;
    out.querySelectorAll('table').forEach(t=>{
      const hs=[...t.querySelectorAll('thead th')];
      const h=hs.find(x=>x.textContent.trim().toLowerCase().startsWith('situa'));
      if(h) h.textContent='-';
    });
  }
  const obs=new MutationObserver(restoreSituacaoCompacta);
  const boot=()=>{const out=document.getElementById('pvout');if(out){obs.observe(out,{childList:true,subtree:true});restoreSituacaoCompacta();}else setTimeout(boot,300)};
  boot();
})();