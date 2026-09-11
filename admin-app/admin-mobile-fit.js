(()=>{
  if(document.getElementById('adminMobileFit'))return;
  const s=document.createElement('style');
  s.id='adminMobileFit';
  s.textContent=`
  html,body{max-width:100%;overflow-x:hidden}
  .wrap{max-width:100%;overflow-x:hidden}
  @media(max-width:760px){
    body{width:100%;}
    header{padding:10px 12px!important;gap:8px;align-items:center}header b{font-size:15px}header .small{font-size:11px}.dark{padding:8px 10px;font-size:12px}
    .wrap{width:100%!important;padding:8px!important;margin:0!important}
    .login{width:calc(100% - 20px)!important;margin:5vh auto!important;padding:20px!important;border-radius:20px!important}
    .tabs{gap:5px;margin:8px 0!important;overflow-x:hidden!important;display:grid!important;grid-template-columns:1fr 1fr!important}.tabs button{white-space:normal!important;padding:8px 6px!important;font-size:11px!important;min-width:0!important}
    .box{padding:10px!important;border-radius:14px!important;overflow-x:hidden!important}.box h2{font-size:18px;margin:4px 0 10px}
    .cards{grid-template-columns:1fr 1fr!important;gap:6px!important}.mini{padding:9px!important}.mini strong{font-size:18px!important}.mini span{font-size:10px!important}
    .toolbar,.form2,.form3{grid-template-columns:1fr!important;gap:7px!important}.toolbar input,.toolbar select,.form2 input,.form2 select,.form3 input,.form3 select{min-width:0!important;width:100%!important}
    table{width:100%!important;min-width:0!important;table-layout:fixed!important;font-size:10px!important}th,td{padding:6px 3px!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important}.wide{min-width:0!important}
    .action{gap:5px}.action button,button{max-width:100%}
    #imperdoaveisAdmin{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
    .impAdmBox{padding:10px!important;border-radius:14px!important;overflow-x:hidden!important}.impAdmBox h2{font-size:22px;line-height:1.05;margin:4px 0 10px}
    .impAdmTopTabs{gap:6px!important;margin:8px 0 10px!important}.impAdmTopTabs button{padding:9px 6px!important;font-size:12px!important}
    .impDashFilters{grid-template-columns:1fr 1fr!important;gap:6px!important;margin:8px 0!important}.impDashFilters input,.impDashFilters select{padding:9px!important;font-size:12px!important;min-width:0!important}
    .impStats{grid-template-columns:repeat(3,1fr)!important;gap:5px!important;margin:8px 0!important}.impStat{padding:8px 4px!important;font-size:10px!important}.impStat b{font-size:20px!important}
    .impClient{width:100%!important;max-width:100%!important}.impClientHead{grid-template-columns:1fr auto!important;padding:9px!important;gap:5px!important}.impClientHead b{font-size:13px}.impClientHead small{font-size:10px}.impStatus{font-size:9px!important;padding:5px 6px!important;white-space:nowrap}
    .impCats{grid-template-columns:1fr!important;padding:0 9px 9px!important;gap:5px!important}.impCatCard{padding:7px!important}
    .impDetails{padding:0 9px 9px!important}.impDetails ul{margin-left:16px!important;font-size:11px!important}
    .impAdmForm,.impAdmFilters{grid-template-columns:1fr!important}.impAdmWide{grid-column:1!important}.impRule{grid-template-columns:1fr!important;gap:6px!important;padding:9px!important}
    #backHome{width:100%!important;margin:0 0 8px!important;padding:10px!important;font-size:12px!important}
  }
  `;
  document.head.appendChild(s);
})();