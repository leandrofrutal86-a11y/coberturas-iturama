(()=>{
  const STYLE_ID='acompMobileFitV2';
  function install(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
@media (max-width:800px){
  #acomp .box{padding:3px!important;overflow:hidden!important}
  #acompSplitRoot{gap:10px!important;width:100%!important;max-width:100%!important}
  #acomp .acompPanel{width:100%!important;max-width:100%!important;border-radius:10px!important;overflow:hidden!important}
  #acomp .acompPoster{width:100%!important;max-width:100%!important;overflow:hidden!important}
  #acomp .acompGrid{width:100%!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:visible!important}
  #acomp .acompGrid table{width:100%!important;min-width:0!important;max-width:100%!important;table-layout:fixed!important;border-collapse:collapse!important}
  #acomp .acompGrid th,#acomp .acompGrid td{min-width:0!important;max-width:none!important;white-space:normal!important;overflow:hidden!important;overflow-wrap:anywhere!important;word-break:normal!important;line-height:1.05!important;padding:2px 1px!important;text-overflow:clip!important}
  #acomp .acompGrid .catHead{width:27%!important;min-width:0!important;max-width:none!important;font-size:6.8px!important;padding:2px!important}
  #acomp .acompGrid .catCell{width:27%!important;min-width:0!important;max-width:none!important;font-size:6.6px!important;line-height:1.08!important;padding:3px 2px 3px 4px!important;white-space:normal!important;overflow-wrap:anywhere!important}
  #acomp .acompGrid thead tr:first-child th:not(.catHead){font-size:6.2px!important;line-height:1.04!important;height:auto!important;padding:3px 1px!important;white-space:normal!important;overflow-wrap:anywhere!important}
  #acomp .acompGrid thead tr:nth-child(2) th{font-size:5.6px!important;line-height:1!important;height:auto!important;padding:2px 0!important}
  #acomp .acompGrid .metaCell,#acomp .acompGrid .realCell,#acomp .acompGrid .teamMeta,#acomp .acompGrid .teamReal{font-size:7px!important;line-height:1!important;padding:3px 0!important}
  #acomp .acompGrid .sepL{border-left-width:1px!important}
  #acomp .acompHero{grid-template-columns:minmax(0,1fr) 78px!important;min-height:42px!important;padding:5px 7px!important;gap:6px!important}
  #acomp .acompCoke{font-size:15px!important;white-space:nowrap!important}
  #acomp .acompTitle{font-size:9px!important;line-height:1.02!important;white-space:normal!important;text-align:left!important;padding-left:2px!important}
  #acomp .acompBadge{font-size:8px!important;padding:5px 3px!important;border-radius:6px!important;white-space:nowrap!important}
  #acomp .acompFooter{padding:6px 4px!important;gap:5px!important}
  #acomp .acompBtn{font-size:8px!important;padding:7px 8px!important}
  #acomp .acompBtn small{font-size:6px!important}
}
`;
  s.textContent += `
#acomp .acompGrid .faltaHead{color:#c81020!important;background:#fff0f1!important}
#acomp .acompGrid .faltaCell,#acomp .acompGrid .teamFalta{color:#c81020!important;background:#ffe7e9!important;font-weight:950!important}
#acomp .acompGrid .faltaCell.ok,#acomp .acompGrid .teamFalta.ok{color:#087a3c!important;background:#e1f7e8!important}
#acomp .acompGrid tbody td.faltaCell,#acomp .acompGrid tbody td.teamFalta{background:#ffe7e9!important}
#acomp .acompGrid tbody td.faltaCell.ok,#acomp .acompGrid tbody td.teamFalta.ok{background:#e1f7e8!important}
@media(max-width:800px){
#acomp .acompGrid{overflow-x:auto!important;overflow-y:visible!important;-webkit-overflow-scrolling:touch!important}
#acomp .acompGrid table{width:1500px!important;min-width:1500px!important;max-width:none!important;table-layout:fixed!important}
#acomp .acompGrid .catHead,#acomp .acompGrid .catCell{position:sticky!important;left:0!important;width:160px!important;min-width:160px!important;max-width:160px!important;z-index:2!important;background:#fff!important;font-size:10px!important;padding:5px!important}
#acomp .acompGrid .catHead{z-index:3!important;background:#edf5fa!important}
#acomp .acompGrid thead tr:first-child th:not(.catHead){font-size:10px!important}
#acomp .acompGrid thead tr:nth-child(2) th{font-size:9px!important;white-space:nowrap!important}
#acomp .acompGrid .metaCell,#acomp .acompGrid .realCell,#acomp .acompGrid .faltaCell,#acomp .acompGrid .teamMeta,#acomp .acompGrid .teamReal,#acomp .acompGrid .teamFalta{font-size:11px!important;padding:5px 2px!important}
#acomp .acompPoster.acompExporting{width:1800px!important;min-width:1800px!important;max-width:none!important}
#acomp .acompPoster.acompExporting .acompGrid{width:1800px!important;overflow:visible!important}
#acomp .acompPoster.acompExporting .acompGrid table{width:1800px!important;min-width:1800px!important}
#acomp .acompPoster.acompExporting .acompGrid .catHead,#acomp .acompPoster.acompExporting .acompGrid .catCell{position:static!important;width:210px!important;min-width:210px!important}
}
`;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();