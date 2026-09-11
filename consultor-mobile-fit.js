(()=>{
if(document.getElementById('consultorMobileFit'))return;
const s=document.createElement('style');s.id='consultorMobileFit';s.textContent=`html,body{max-width:100%;overflow-x:hidden}body{width:100%}.wrap,.tableWrap{max-width:100%}@media(max-width:760px){
.wrap{width:100%;margin:8px 0 54px;padding:0 8px}.panel{padding:8px!important}.panel h2{font-size:16px!important;margin:5px 0!important}.head select{padding:8px!important;font-size:13px!important}
#results .tableWrap{width:100%!important;margin-top:6px!important;border:1px solid #d8e1e8!important;border-radius:10px!important;overflow:hidden!important}
#results table{width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:separate!important;border-spacing:0!important}
#results table:has(th:nth-child(6)) th,#results table:has(th:nth-child(6)) td{font-size:8px!important;line-height:1.1!important;padding:5px 2px!important;vertical-align:middle!important;word-break:normal!important;hyphens:none!important}
#results table:has(th:nth-child(6)) thead th{background:#cf0715!important;color:#fff!important;font-weight:900!important;border-right:1px solid #fff!important;padding:7px 2px!important}
#results table:has(th:nth-child(6)) thead th:last-child{border-right:0!important}
#results table:has(th:nth-child(6)) th:nth-child(1),#results table:has(th:nth-child(6)) td:nth-child(1){width:6%!important;text-align:center!important;border-right:1px solid #9eabb6!important;padding:2px 0!important}
#results table:has(th:nth-child(6)) th:nth-child(2),#results table:has(th:nth-child(6)) td:nth-child(2){width:15%!important;text-align:left!important;padding-left:4px!important;white-space:nowrap!important}
#results table:has(th:nth-child(6)) th:nth-child(3),#results table:has(th:nth-child(6)) td:nth-child(3){width:29%!important;text-align:left!important;padding-left:4px!important;overflow-wrap:break-word!important}
#results table:has(th:nth-child(6)) th:nth-child(4),#results table:has(th:nth-child(6)) td:nth-child(4),#results table:has(th:nth-child(6)) th:nth-child(5),#results table:has(th:nth-child(6)) td:nth-child(5){width:18%!important;text-align:center!important}
#results table:has(th:nth-child(6)) th:nth-child(6),#results table:has(th:nth-child(6)) td:nth-child(6){width:14%!important;text-align:center!important}
#results table:has(th:nth-child(6)) tbody tr:nth-child(odd) td{background:#fff!important}#results table:has(th:nth-child(6)) tbody tr:nth-child(even) td{background:#eaf4fb!important}
#results table:has(th:nth-child(6)) tbody td{border-bottom:1px solid #dce4ea!important}#results table:has(th:nth-child(6)) tbody td+td{border-left:1px solid #e1e7ec!important}
#results table:has(th:nth-child(6)) td:nth-child(2){font-size:7.7px!important;font-weight:800!important}#results table:has(th:nth-child(6)) td:nth-child(3){font-size:7.5px!important;line-height:1.12!important;font-weight:600!important}
#results table:has(th:nth-child(6)) td:nth-child(n+4) span,#results table:has(th:nth-child(6)) td:nth-child(n+4) .pill{display:inline-flex!important;align-items:center!important;justify-content:center!important;max-width:100%!important;padding:4px 4px!important;border-radius:999px!important;font-size:7px!important;font-weight:900!important;line-height:1!important;white-space:nowrap!important}
#results table:has(th:nth-child(6)) tbody tr{height:auto!important}
.overlay{padding:0!important;align-items:stretch!important}.sheet{width:100vw!important;max-width:100vw!important;height:100dvh!important;max-height:100dvh!important;border-radius:0!important;overflow-y:auto!important;overflow-x:hidden!important}.sheetBody{padding:8px!important}.search{grid-template-columns:1fr!important}.search input,.search button{width:100%!important}.tableWrap{overflow-x:hidden!important}
#pvout table thead th{background:#e30613!important;color:#fff!important;font-weight:900!important}#pvout table tbody tr:nth-child(odd){background:#eef6ff!important}#pvout table tbody tr:nth-child(even){background:#fff!important}#pvout table th:nth-child(1),#pvout table td:nth-child(1){width:58%!important}#pvout table th:nth-child(2),#pvout table td:nth-child(2){width:16%!important;text-align:center!important}#pvout table th:nth-child(3),#pvout table td:nth-child(3){width:26%!important;text-align:center!important}#pvout table th:nth-child(2){font-size:0!important}#pvout table th:nth-child(2)::after{content:'-';font-size:12px!important;color:#fff!important}
}`;document.head.appendChild(s);
function compact(){const out=document.getElementById('pvout');if(out)out.querySelectorAll('thead th').forEach(h=>{if(h.textContent.trim().toLowerCase().startsWith('situa'))h.textContent='-';});}
new MutationObserver(compact).observe(document.documentElement,{childList:true,subtree:true});compact();
})();