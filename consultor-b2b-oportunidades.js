(()=>{
'use strict';
const d=document,$=id=>d.getElementById(id),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),N=v=>String(v??'').trim().toUpperCase(),pv=x=>String(x?.pv??x?.cliente??x?.codigo??x?.Cliente??'').trim();
let base=null,baseRoute='',loading=false,ready=false,rows=[],allRows=[],reportMode='compra',metrics=null;
function cat(n){return (DATA?.own||[]).find(x=>N(x.nome)===n)}
function done(x){return !!x&&(x.completo===true||x.status==='RECOMPRA'||Number(x.compras||0)>=2)}
function route(){return String(DATA?.consultor?.rota||'').trim()}
function reset(){base=null;baseRoute='';rows=[];allRows=[];ready=false}
const css=d.createElement('style');css.textContent=`
#cvB2BOverlay{position:fixed;inset:0;z-index:24000;background:#000a;display:none;align-items:center;justify-content:center;padding:10px}#cvB2BOverlay.open{display:flex}
#cvB2BSheet{width:min(850px,100%);max-height:96dvh;overflow:auto;background:#f3f6fa;border-radius:18px;overscroll-behavior:contain}
#cvB2BTop{position:sticky;top:0;z-index:2;background:linear-gradient(110deg,#171717,#b6000d);color:white;display:flex;justify-content:space-between;gap:8px;align-items:center;padding:16px}
#cvB2BTop h2{margin:0;font-size:20px}#cvB2BTop button{border:0;border-radius:10px;padding:11px;background:white;color:#222;font-weight:800}
#cvB2BBody{padding:13px 13px 90px}#cvB2BBody .panelBox{background:white;border:1px solid #e1e7ee;border-radius:15px;padding:13px;margin-bottom:12px}
#cvB2BBody select,#cvB2BBody input{width:100%;min-width:0;padding:12px;border:1px solid #cbd5df;border-radius:10px;background:white;font-size:15px;box-sizing:border-box}
#cvB2BBody label{display:block;font-weight:800;margin:0 0 7px}#cvB2BStats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%}
#cvB2BStats .cvB2BMetric{background:#f7f9fc;border:1px solid #e5eaf1;border-radius:12px;padding:10px;min-width:0}#cvB2BStats .cvB2BMetric h4{margin:0 0 9px;font-size:15px}#cvB2BStats .cvB2BMetricCells{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}#cvB2BStats .cvB2BMetricCells>div{background:#f0f5fb;padding:10px 5px;text-align:center;border-radius:9px;min-width:0}#cvB2BStats .cvB2BMetricCells small{display:block;font-size:11px;line-height:1.3}#cvB2BStats .cvB2BMetricCells strong{display:block;font-size:20px;margin-top:5px}
@media(max-width:550px){#cvB2BStats{grid-template-columns:1fr}}
#cvB2BTable{width:100%;min-width:0;table-layout:fixed;border-collapse:collapse;font-size:12px}
#cvB2BTable th,#cvB2BTable td{padding:10px 5px;text-align:left;border-bottom:1px solid #e4e9ef;overflow-wrap:break-word}
#cvB2BTable th:first-child,#cvB2BTable td:first-child{width:23%;white-space:nowrap;font-weight:800}
#cvB2BTable th:nth-child(2),#cvB2BTable td:nth-child(2){width:47%}
#cvB2BTable th:last-child,#cvB2BTable td:last-child{width:30%}
#cvB2BImage{width:100%;border:0;background:#087b43;color:#fff;border-radius:12px;padding:14px;font-weight:900}
#cvB2BMsg{font-size:13px;color:#536273;line-height:1.4}
.quick #cvB2BOpen{background:#fff9ef!important}
.quick #cvB2BOpen:before{content:'🛒';background:#087d49}
@media(max-width:550px){#cvB2BOverlay{padding:0}#cvB2BSheet{width:100%;height:100dvh;max-height:100dvh;border-radius:0}#cvB2BTop h2{font-size:17px}#cvB2BTable{font-size:11px}#cvB2BTable th,#cvB2BTable td{padding:9px 4px}}
`;d.head.appendChild(css);
function build(){if($('cvB2BOverlay'))return;const quick=d.querySelector('.quick');if(!quick){setTimeout(build,250);return}
const btn=d.createElement('button');btn.id='cvB2BOpen';btn.type='button';btn.className='q cvBottomBtn';btn.innerHTML='B2B – Oportunidades de Compra<small>Compras, recompras e clientes da sua rota</small>';btn.onclick=open;quick.appendChild(btn);
const root=d.createElement('div');root.id='cvB2BOverlay';root.innerHTML='<div id="cvB2BSheet"><div id="cvB2BTop"><h2>🛒 B2B • Oportunidades de Compra</h2><button id="cvB2BClose" type="button">Fechar</button></div><div id="cvB2BBody"><div class="panelBox"><b id="cvB2BRoute"></b><p style="font-size:13px">Consulta exclusiva dos clientes da sua rota.</p><label for="cvB2BMode">Selecione a consulta</label><select id="cvB2BMode"><option value="compra">Clientes que compraram</option><option value="recompra">Clientes com recompra</option><option value="pendente">Oportunidades de recompra</option><option value="oportunidades">Clientes que ainda não compraram</option></select><div style="margin-top:12px"><input id="cvB2BSearch" placeholder="Buscar PV ou razão social"></div><p id="cvB2BMsg" role="status"></p></div><div class="panelBox"><div id="cvB2BStats"></div></div><div class="panelBox"><h3 id="cvB2BTitle"></h3><table id="cvB2BTable"><thead><tr><th>PV</th><th>Razão social</th><th>Situação</th></tr></thead><tbody id="cvB2BRows"></tbody></table></div><div class="panelBox"><button id="cvB2BImage" type="button">📷 BAIXAR IMAGEM DO RELATÓRIO</button></div></div></div>';
d.body.appendChild(root);$('cvB2BClose').onclick=()=>root.classList.remove('open');$('cvB2BMode').onchange=()=>{$('cvB2BSearch').value='';render()};$('cvB2BSearch').oninput=render;$('cvB2BImage').onclick=download;
}
async function open(){if(!DATA?.consultor?.rota){alert('Entre com sua rota para consultar o B2B.');return}build();$('cvB2BSearch').value='';$('cvB2BOverlay').classList.add('open');$('cvB2BRoute').textContent=route()+' • '+(DATA.consultor.nome||'');$('cvB2BMsg').textContent='Carregando clientes da rota...';$('cvB2BImage').disabled=true;await load()}
async function load(){if(loading)return;loading=true;const rt=route();try{
const cr=cat('COMPRA B2B'),rr=cat('RECOMPRA B2B');if(!cr||!rr)throw Error('Dados de compra e recompra indisponíveis. Atualize a página.');
const bought=(cr.clientes||[]).filter(x=>x.completo!==false),reps=rr.clientes||[],repMap=new Map(reps.map(x=>[pv(x),x]));
metrics={compra:[Number(cr.meta||0),Number(cr.realizado||0)],recompra:[Number(rr.meta||0),Number(rr.realizado||0)]};
let clients=null;
if(baseRoute===rt&&Array.isArray(base))clients=base;
else{const result=await api('client_base',{rota:rt});if(!Array.isArray(result.clients))throw Error('Base geral de clientes indisponível.');clients=result.clients.filter(x=>String(x.rota||rt).trim()===rt&&pv(x));base=[...new Map(clients.map(x=>[pv(x),x])).values()];baseRoute=rt;clients=base}if(!clients.length)throw Error('A base da rota '+rt+' veio vazia. Atualize a base de clientes no ADM.');
if(route()!==rt)throw Error('A rota foi alterada. Consulte novamente.');
const purchased=new Set(bought.map(pv));
allRows={compra:bought,recompra:bought.filter(x=>done(repMap.get(pv(x)))),pendente:bought.filter(x=>!done(repMap.get(pv(x)))),oportunidades:clients.filter(x=>!purchased.has(pv(x)))};
window.__cvB2BRepMap=repMap;ready=true;$('cvB2BMsg').textContent='Base da rota carregada. Selecione a modalidade e consulte os clientes.';render();
}catch(e){ready=false;$('cvB2BMsg').textContent=e.message;$('cvB2BRows').innerHTML='';$('cvB2BTitle').textContent='Consulta indisponível';$('cvB2BImage').disabled=true}finally{loading=false}}
function status(x,mode){return mode==='oportunidades'?'Sem compra B2B':mode==='pendente'?'Falta recompra':mode==='recompra'?'🔁 Recompra realizada':done(window.__cvB2BRepMap?.get(pv(x)))?'🔁 Recompra realizada':'✕ Falta recompra'}
function render(){if(!ready)return;const mode=$('cvB2BMode').value,term=N($('cvB2BSearch').value),titles={compra:'🛒 Clientes com Compra B2B',recompra:'🔁 Clientes com Recompra B2B',pendente:'⏳ Compraram e faltam recomprar',oportunidades:'🎯 Oportunidades sem Compra B2B'};
rows=(allRows[mode]||[]).filter(x=>N(pv(x)+' '+(x.razao||x.razao_social||x.nome||'')).includes(term));$('cvB2BMsg').textContent='Base da rota: '+base.length+' clientes • '+(allRows[mode]||[]).length+' nesta modalidade'+(term?' • '+rows.length+' encontrados na busca':'')+'.';
$('cvB2BTitle').textContent=titles[mode]+' ('+rows.length+')';
$('cvB2BStats').innerHTML=[['🛒 Compra B2B',metrics.compra],['🔁 Recompra B2B',metrics.recompra]].map(([title,[meta,real]])=>'<div class="cvB2BMetric"><h4>'+title+'</h4><div class="cvB2BMetricCells"><div><small>Meta</small><strong>'+meta+'</strong></div><div><small>Realizado</small><strong>'+real+'</strong></div><div><small>Falta</small><strong>'+Math.max(meta-real,0)+'</strong></div></div></div>').join('');
$('cvB2BRows').innerHTML=rows.map(x=>'<tr><td>'+E(pv(x))+'</td><td>'+E(x.razao||x.razao_social||x.nome||'')+'</td><td>'+E(status(x,mode))+'</td></tr>').join('')||'<tr><td colspan="3">Nenhum cliente nesta consulta.</td></tr>';
$('cvB2BImage').disabled=false;
}
async function download(){if(!ready)return;const btn=$('cvB2BImage');btn.disabled=true;$('cvB2BMsg').textContent='Gerando imagem com todos os clientes da lista...';let stage;try{
if(!window.html2canvas){await new Promise((ok,no)=>{const s=d.createElement('script');s.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';s.onload=ok;s.onerror=()=>no(Error('Não foi possível carregar o gerador de imagem.'));d.head.appendChild(s)})}
stage=d.createElement('div');stage.style.cssText='position:fixed;left:-12000px;top:0;width:1050px;background:white;padding:25px;font-family:Arial,sans-serif;color:#142236;z-index:-1';
const h=d.createElement('h2');h.textContent='RELATÓRIO B2B • '+$('cvB2BTitle').textContent;stage.appendChild(h);const sub=d.createElement('p');sub.textContent=$('cvB2BRoute').textContent;stage.appendChild(sub);
const table=$('cvB2BTable').cloneNode(true);table.style.cssText='width:100%;table-layout:fixed;border-collapse:collapse;font-size:17px';table.querySelectorAll('th,td').forEach(x=>x.style.cssText='padding:12px;border:1px solid #d9e1e9;text-align:left;overflow-wrap:break-word');stage.appendChild(table);d.body.appendChild(stage);
const canvas=await window.html2canvas(stage,{scale:1.5,backgroundColor:'#fff',width:1050,windowWidth:1050,useCORS:true,logging:false});
const blob=await new Promise((ok,no)=>canvas.toBlob(x=>x?ok(x):no(Error('Falha ao criar PNG.')),'image/png'));const url=URL.createObjectURL(blob),a=d.createElement('a');a.href=url;a.download='relatorio_b2b_'+route()+'_'+$('cvB2BMode').value+'.png';d.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('cvB2BMsg').textContent='Download solicitado. Se a imagem abrir, mantenha o dedo sobre ela e escolha Salvar imagem.';
}catch(e){$('cvB2BMsg').textContent=e.message}finally{stage?.remove();btn.disabled=false}}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',build);else build();
})();