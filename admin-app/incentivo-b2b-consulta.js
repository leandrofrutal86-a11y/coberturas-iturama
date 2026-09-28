(()=>{
const d=document,E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),N=v=>String(v??'').trim().toUpperCase(),q=id=>d.getElementById(id);
function init(){const home=q('cokeHome');if(!home||typeof post!=='function'||typeof dash==='undefined'||!dash){setTimeout(init,250);return}if(q('admB2B'))return;
const style=d.createElement('style');style.textContent='#admB2B{padding:15px 12px 135px;max-width:1050px;margin:auto}#admB2B .box{background:#fff;border-radius:14px;padding:15px;margin:12px 0}#admB2B .b2bFilters{display:flex;gap:10px;flex-wrap:wrap}#admB2B .b2bFilters>div{flex:1;min-width:145px}#admB2B select,#admB2B input{width:100%;max-width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccd4de;border-radius:10px}#admB2B table{width:100%;border-collapse:collapse}#admB2B th,#admB2B td{padding:10px;border-bottom:1px solid #e4e9ef;text-align:left}#admB2B .b2bScroll{overflow-x:auto}'+'#admB2B .b2bMetrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}#admB2B .b2bMetrics div{background:#f0f5fb;padding:10px 5px;text-align:center;border-radius:9px}#admB2B .b2bMetrics b{display:block;font-size:20px}#admB2B .b2bMetrics small{font-size:11px}#admB2B table{min-width:0;table-layout:auto}#admB2B td,#admB2B th{font-size:12px;padding:9px 5px}';d.head.appendChild(style);
const section=d.createElement('section');section.id='admB2B';section.className='hide';section.innerHTML='<div class="box"><h2>🛒 Incentivo B2B</h2><p>Compra e recompra por rota. Recompra considera compras B2B em datas diferentes.</p><div class="b2bFilters"><div><label>Rota</label><select id="admB2BRoute"></select></div><div><label>Consulta</label><select id="admB2BType"><option value="compra">Compra B2B</option><option value="recompra">Recompra B2B</option><option value="pendente">Pendente de recompra</option><option value="oportunidades">Oportunidades (sem compra B2B)</option></select></div></div><div style="margin-top:10px"><input id="admB2BSearch" placeholder="Buscar PV ou razão social"></div><button class="red" type="button" id="admB2BRefresh" style="margin-top:12px">CONSULTAR B2B</button><button type="button" id="admB2BExport" style="margin:12px 0 0 8px;background:#087d37;color:white;padding:12px;border-radius:10px">⬇️ BAIXAR RELATÓRIO CSV</button><p id="admB2BMsg"></p></div><div class="box" id="admB2BSummary"></div><div class="box" id="admB2BResult"></div><div class="box" id="admB2BImageBar"><button type="button" id="admB2BImage" style="background:#1466a8;color:white;width:100%;padding:14px">📷 BAIXAR IMAGEM DA LISTA</button><p class="small">Salva a lista completa da consulta selecionada em PNG, incluindo os clientes que estão abaixo da tela.</p></div>';
q('app').querySelector(':scope > .wrap')?.appendChild(section);
let current=null;let exportRows=[];let currentRoute='';let routeBase=null;let baseError='';
function findCat(items,name){return (items||[]).find(x=>N(x.nome)===name)}
function pv(x){return String(x?.cliente??x?.pv??x?.codigo??'').trim()}
function done(x){return !!x&&(x.completo===true||x.status==='RECOMPRA'||Number(x.compras||0)>=2)}
function rows(){
if(!current)return;
const mode=q('admB2BType').value,term=N(q('admB2BSearch').value);
const results=current.resultados||[],cr=findCat(results,'COMPRA B2B'),rr=findCat(results,'RECOMPRA B2B'),op=findCat(results,'OPORTUNIDADE B2B');
const summary=(dash.individual||[]).find(x=>String(x.rota)===currentRoute);
const sm=findCat(summary?.resultados,mode==='recompra'?'RECOMPRA B2B':'COMPRA B2B');
const bought=(cr?.clientes||[]).filter(x=>x.completo!==false),rep=(rr?.clientes||[]),repMap=new Map(rep.map(x=>[pv(x),x]));
const repList=rep.filter(done),pending=bought.filter(x=>!done(repMap.get(pv(x))));
let opportunities=null;
if(Array.isArray(op?.clientes)&&op.clientes.length){opportunities=op.clientes.filter(x=>x.status==='OPORTUNIDADE'||x.status==='SEM_COMPRA'||x.completo===false)}
if(!opportunities&&Array.isArray(routeBase)){const purchased=new Set(bought.map(pv));opportunities=routeBase.filter(x=>!purchased.has(pv(x)))}
const all=mode==='compra'?bought:mode==='recompra'?repList:mode==='pendente'?pending:opportunities;
const list=all?.filter(x=>N(pv(x)+' '+(x.razao||x.razao_social||x.nome||'')).includes(term))||[];
const title={compra:'🛒 Clientes com Compra B2B',recompra:'🔁 Clientes com Recompra B2B',pendente:'⏳ Compraram e faltam recomprar',oportunidades:'🎯 Oportunidades sem Compra B2B'}[mode];
const meta=Number(sm?.meta||0),real=mode==='recompra'?Number(sm?.realizado??repList.length):Number(findCat(summary?.resultados,'COMPRA B2B')?.realizado??bought.length);
q('admB2BSummary').innerHTML='<h3>'+E(currentRoute)+' • '+E(summary?.nome||'')+'</h3><div class="b2bMetrics"><div><small>Meta</small><b>'+meta+'</b></div><div><small>Realizado</small><b>'+real+'</b></div><div><small>Falta</small><b>'+Math.max(meta-real,0)+'</b></div><div><small>Recompra</small><b>'+repList.length+'</b></div></div>';
exportRows=list.map(x=>[pv(x),x.razao||x.razao_social||x.nome||'',mode==='oportunidades'?'Sem compra B2B':done(repMap.get(pv(x)))?'Recompra realizada':'Falta recompra']);
q('admB2BResult').innerHTML='<h3>'+title+' ('+(all?list.length:'—')+')</h3>'+(all===null?'<p class="notice">Não foi possível consultar a base geral desta rota. '+E(baseError||'Tente consultar novamente.')+' Nenhum relatório incompleto será gerado.</p>':'<div class="b2bScroll"><table><thead><tr><th>PV</th><th>Razão social</th><th>Situação</th></tr></thead><tbody>'+ (list.map(x=>{const status=mode==='oportunidades'?'Sem compra B2B':done(repMap.get(pv(x)))?'🔁 Recompra realizada':'✕ Falta recompra';return '<tr><td style="white-space:nowrap">'+E(pv(x))+'</td><td>'+E(x.razao||x.razao_social||x.nome||'')+'</td><td>'+E(status)+'</td></tr>'}).join('')||'<tr><td colspan="3">Nenhum cliente encontrado.</td></tr>')+'</tbody></table></div>');
q('admB2BExport').disabled=all===null;q('admB2BImage').disabled=all===null;
}
async function load(){
const rota=q('admB2BRoute').value;if(!rota)return;
current=null;routeBase=null;baseError='';currentRoute=rota;q('admB2BExport').disabled=true;q('admB2BImage').disabled=true;q('admB2BMsg').textContent='Carregando rota '+rota+'...';
q('admB2BSummary').innerHTML='';q('admB2BResult').innerHTML='';
try{const result=await post({action:'consultor_view',token,rota});if(q('admB2BRoute').value!==rota)return;current=result;try{const b=await post({action:'search_clients',token,rota});if(!Array.isArray(b.clients))throw Error('Resposta da base de clientes inválida.');routeBase=[...new Map(b.clients.filter(x=>String(x.rota||rota).trim()===rota&&pv(x)).map(x=>[pv(x),x])).values()]}catch(e){baseError=e.message}if(q('admB2BRoute').value!==rota)return;q('admB2BMsg').textContent='';rows()}catch(e){q('admB2BMsg').textContent='Falha ao consultar rota: '+e.message}
}
function imageReport(){
if(!current||q('admB2BImage').disabled)return;
const mode=q('admB2BType').value,route=q('admB2BRoute').value,summary=q('admB2BSummary'),title=q('admB2BResult h3')?.textContent||'Relatório B2B';
const cols=['PV','RAZÃO SOCIAL','SITUAÇÃO'],data=exportRows,scale=2,w=1080,pad=36,col=[170,570,270],line=28;
const cv=d.createElement('canvas'),ctx=cv.getContext('2d');
ctx.font='25px Arial';const wrap=(str,max)=>{const words=String(str??'').split(/\\s+/),out=[];let s='';for(const word of words){const test=s?s+' '+word:word;if(ctx.measureText(test).width>max&&s){out.push(s);s=word}else s=test}out.push(s);return out};
const prepared=data.map(row=>{const cells=row.map((v,i)=>wrap(v,col[i]-22));return{cells,h:Math.max(68,Math.max(...cells.map(x=>x.length))*line+24)}});
const height=250+prepared.reduce((a,x)=>a+x.h,0)+60;cv.width=w*scale;cv.height=height*scale;ctx.scale(scale,scale);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,height);
ctx.fillStyle='#c80818';ctx.fillRect(0,0,w,112);ctx.fillStyle='#fff';ctx.font='bold 35px Arial';ctx.fillText('INCENTIVO B2B • '+route,pad,49);ctx.font='24px Arial';ctx.fillText(title,pad,88);
ctx.fillStyle='#1d2939';ctx.font='bold 24px Arial';const metrics=[...summary.querySelectorAll('.b2bMetrics div')].map(x=>x.textContent.trim().replace(/\\s+/g,' '));ctx.fillText(metrics.join('     •     '),pad,156);
ctx.fillStyle='#edf2f7';ctx.fillRect(pad,184,w-2*pad,48);ctx.fillStyle='#263548';ctx.font='bold 23px Arial';let x=pad;cols.forEach((t,i)=>{ctx.fillText(t,x+9,215);x+=col[i]});let y=232;
prepared.forEach((row,index)=>{if(index%2===0){ctx.fillStyle='#f6f9fc';ctx.fillRect(pad,y,w-2*pad,row.h)}ctx.fillStyle='#263548';ctx.font='22px Arial';let left=pad;row.cells.forEach((lines,i)=>{lines.forEach((txt,j)=>ctx.fillText(txt,left+9,y+32+j*line));left+=col[i]});ctx.strokeStyle='#e1e7ee';ctx.beginPath();ctx.moveTo(pad,y+row.h);ctx.lineTo(w-pad,y+row.h);ctx.stroke();y+=row.h});
ctx.fillStyle='#667085';ctx.font='18px Arial';ctx.fillText('Total exibido: '+data.length+' cliente(s) • Equipe Iturama',pad,y+40);
cv.toBlob(blob=>{if(!blob){q('admB2BMsg').textContent='Não foi possível gerar a imagem.';return}const url=URL.createObjectURL(blob),a=d.createElement('a');a.href=url;a.download='b2b_'+mode+'_'+route+'.png';d.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)},'image/png')
}
q('admB2BImage').onclick=imageReport;
q('admB2BExport').onclick=()=>{if(!current||q('admB2BExport').disabled){q('admB2BMsg').textContent='Consulte uma rota com dados disponíveis antes de baixar.';return}const lines=[['PV','Razão social','Situação'],...exportRows];const csv='\uFEFF'+lines.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=d.createElement('a');a.href=url;a.download='b2b_'+q('admB2BType').value+'_'+q('admB2BRoute').value+'.csv';d.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)};q('admB2BRefresh').onclick=load;q('admB2BRoute').onchange=load;q('admB2BType').onchange=rows;q('admB2BSearch').oninput=rows;
function open(){const routes=(dash?.consultores||dash?.individual||[]).map(x=>({rota:x.rota,nome:x.nome}));q('admB2BRoute').innerHTML=routes.map(x=>'<option value="'+E(x.rota)+'">'+E(x.rota+' • '+x.nome)+'</option>').join('');q('app').querySelectorAll(':scope > .wrap > section').forEach(x=>x.classList.add('hide'));home.classList.add('hide');section.classList.remove('hide');q('admB2BMsg').textContent='';current=null;q('admB2BResult').innerHTML='';q('admB2BSummary').innerHTML='';if(routes.length)load();else q('admB2BMsg').textContent='Não há rotas disponíveis no painel. Atualize o dashboard.';window.scrollTo(0,0)}
const topic=[...home.querySelectorAll('.menuTopic')].find(x=>/INCENTIVOS/i.test(x.querySelector('.topicHead')?.textContent||x.textContent));const card=d.createElement('button');card.type='button';card.className='menuCard';card.innerHTML='<span style="font-size:27px">🛒</span><span><b>Incentivo B2B</b><small>Compra e recompra por rota</small></span><span>❯</span>';card.onclick=open;(topic?.querySelector('.topicItems')||topic||home).appendChild(card);

}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})();