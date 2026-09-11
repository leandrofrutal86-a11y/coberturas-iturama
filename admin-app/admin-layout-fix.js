(()=>{function apply(){const s=document.createElement('style');s.id='adminLayout20260909';s.textContent=`
/* O menu antigo fica totalmente oculto. A navegação é feita pelos cards da tela inicial. */
.tabs{display:none!important;position:static!important;visibility:hidden!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important;box-shadow:none!important;overflow:hidden!important}
.homeStats{display:none!important}
.wrap{padding-top:10px!important}
/* Resultado da Equipe: cabeçalho vermelho e linhas alternadas */
#equipe .box table thead th{background:#c90816!important;color:#fff!important;font-weight:900!important;border-bottom:1px solid #a80611!important}
#equipe .box table tbody tr:nth-child(odd) td{background:#eaf4fb!important}
#equipe .box table tbody tr:nth-child(even) td{background:#fff!important}
#equipe .box table tbody td{border-bottom:1px solid #d9e1e8!important}
/* Visita de Clientes e Subcanais: tabela compacta, mantendo telefone e dados completos */
#visitasSubcanais table,#subcanaisPainel table{font-size:12px!important;min-width:1040px!important}
#visitasSubcanais th,#visitasSubcanais td,#subcanaisPainel th,#subcanaisPainel td{padding:7px 8px!important;line-height:1.15!important;vertical-align:middle!important}
#visitasSubcanais td:nth-child(5),#subcanaisPainel td:nth-child(3){max-width:220px!important;white-space:normal!important}
#visitasSubcanais td:nth-child(9){max-width:220px!important;white-space:normal!important}
#visitasSubcanais td:last-child{font-weight:800!important;color:#0b63ce!important;white-space:nowrap!important}
@media(max-width:520px){#visitasSubcanais table,#subcanaisPainel table{font-size:11px!important}#equipe .box table{font-size:11px!important}#equipe .box table th,#equipe .box table td{padding:8px 5px!important}}
`;document.head.appendChild(s)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply()})();