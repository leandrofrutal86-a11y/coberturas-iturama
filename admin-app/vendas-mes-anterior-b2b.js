(()=>{
'use strict';
const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-api';
const q=id=>document.getElementById(id);
let rows=[],running=false;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function tokenNow(){try{return String(typeof token!=='undefined'?token:sessionStorage.getItem('admToken')||'')}catch{return String(sessionStorage.getItem('admToken')||'')}}
function nh(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
function monthInfo(){
 const now=new Date(),p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit'}).formatToParts(now).reduce((a,x)=>(a[x.type]=x.value,a),{});
 let y=Number(p.year),m=Number(p.month)-1;if(m===0){m=12;y--}
 return{year:y,month:m,prefix:y+'-'+String(m).padStart(2,'0')+'-',label:new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}
}
function dateISO(v){
 if(!v)return '';
 if(v instanceof Date&&!isNaN(v))return v.toISOString().slice(0,10);
 if(typeof v==='number'&&window.XLSX?.SSF?.parse_date_code){const d=XLSX.SSF.parse_date_code(v);if(d)return String(d.y).padStart(4,'0')+'-'+String(d.m).padStart(2,'0')+'-'+String(d.d).padStart(2,'0')}
 const s=String(v).trim();let m=s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);if(m)return m[1]+'-'+m[2].padStart(2,'0')+'-'+m[3].padStart(2,'0');
 m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);if(m)return m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
 const d=new Date(s);return isNaN(d)?'':d.toISOString().slice(0,10)
}
function status(t,ok=false){const el=q('prevB2BStatus');if(el){el.textContent=t||'';el.className=ok?'ok':/^(Falha|Erro|Não|Nenhum)/i.test(t)?'bad':'notice'}}
async function call(action,body={},timeout=26000){
 const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),timeout);
 try{
  const r=await fetch(API+'?v='+Date.now(),{method:'POST',mode:'cors',cache:'no-store',credentials:'omit',headers:{'Content-Type':'text/plain;charset=UTF-8','Accept':'application/json'},body:JSON.stringify({action,token:tokenNow(),...body}),signal:ctrl.signal});
  const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro '+r.status);return j
 }finally{clearTimeout(to)}
}
async function retry(action,body,tries=4,timeout=26000){let last;for(let i=0;i<tries;i++){try{return await call(action,body,timeout)}catch(e){last=e;if(i<tries-1)await pause(650*(i+1))}}throw last}
function ensure(){
 const vendas=q('vendas');if(!vendas||q('prevB2BBox'))return !!q('prevB2BBox');
 const mi=monthInfo(),box=document.createElement('div');box.className='box';box.id='prevB2BBox';box.style.marginTop='18px';
 box.innerHTML='<h2>Vendas do mês anterior • somente Recompra B2B</h2>'+
 '<div class="notice"><b>Uso exclusivo:</b> esta planilha não altera as demais categorias e não altera a Compra B2B. Ela serve somente para completar a <b>RECOMPRA B2B</b>.<br><br>'+
 '<b>Regra:</b> se o PV tiver <b>2 ou mais datas B2B no mês atual</b>, já é recompra. Se tiver <b>1 data B2B no mês atual</b>, ele só será acrescentado como recompra quando tiver <b>exatamente 1 data B2B em '+mi.label+'</b>. O mesmo PV conta somente uma vez.</div>'+
 '<div class="upload"><input id="prevB2BFile" type="file" accept=".xlsx,.xls"></div>'+
 '<div id="prevB2BPreview" class="hide"><div class="success">✓ Planilha do mês anterior validada.</div><div class="cards">'+
 '<div class="mini"><span>Compras B2B únicas</span><strong id="prevB2BLinhas">0</strong></div>'+
 '<div class="mini"><span>Rotas</span><strong id="prevB2BRotas">0</strong></div>'+
 '<div class="mini"><span>Clientes</span><strong id="prevB2BClientes">0</strong></div>'+
 '<div class="mini"><span>Mês considerado</span><strong id="prevB2BMes" style="font-size:14px">'+mi.label+'</strong></div></div></div>'+
 '<button id="prevB2BUpdate" class="red" disabled>ATUALIZAR VENDAS DO MÊS ANTERIOR</button><p id="prevB2BStatus"></p>';
 vendas.appendChild(box);
 q('prevB2BFile').addEventListener('change',e=>validate(e.target.files?.[0]));
 q('prevB2BUpdate').addEventListener('click',upload);
 call('b2b_anterior_resumo',{},12000).then(j=>{if(j.registros)status('Histórico atual: '+Number(j.registros).toLocaleString('pt-BR')+' compras B2B únicas carregadas.',true)}).catch(()=>{});
 return true
}
async function validate(file){
 rows=[];q('prevB2BPreview').classList.add('hide');q('prevB2BUpdate').disabled=true;status('');
 if(!file)return;
 try{
  if(!window.XLSX)throw Error('Leitor de Excel ainda não carregou. Aguarde alguns segundos e tente novamente.');
  const ab=await file.arrayBuffer(),wb=XLSX.read(ab,{type:'array',cellDates:true}),ws=wb.Sheets[wb.SheetNames[0]],arr=XLSX.utils.sheet_to_json(ws,{defval:'',raw:true});
  if(!arr.length)throw Error('Planilha vazia.');
  const map={};Object.keys(arr[0]).forEach(k=>map[nh(k)]=k);
  const find=(...names)=>names.map(n=>map[nh(n)]).find(Boolean);
  const cPv=find('Cliente','PV','Código Cliente','Cod Cliente'),cRoute=find('Rota','Rota Consultor'),cDate=find('Data Nota Fiscal','Data da Nota Fiscal','Data','Data Faturamento','Data Emissão'),cOrigin=find('Origem','Origem Venda','Fonte');
  if(!cPv||!cRoute||!cDate||!cOrigin)throw Error('A planilha precisa ter Cliente/PV, Rota, Data da Nota Fiscal e Origem.');
  const mi=monthInfo(),uniq=new Map();
  let b2bLines=0,otherMonth=0;
  for(const r of arr){
   const origin=String(r[cOrigin]??'').trim().toUpperCase();if(origin!=='B2B')continue;
   b2bLines++;
   const date=dateISO(r[cDate]);if(!date.startsWith(mi.prefix)){otherMonth++;continue}
   const cliente=String(r[cPv]??'').trim().replace(/^0+(?=\d)/,''),rota=String(r[cRoute]??'').trim().toUpperCase();
   if(!cliente||!rota||!date)continue;
   uniq.set(cliente+'|'+rota+'|'+date,{cliente,rota,data_nota_fiscal:date})
  }
  rows=[...uniq.values()];
  if(!rows.length)throw Error('Nenhuma venda com Origem = B2B foi encontrada em '+mi.label+'.');
  q('prevB2BLinhas').textContent=rows.length.toLocaleString('pt-BR');
  q('prevB2BRotas').textContent=new Set(rows.map(x=>x.rota)).size;
  q('prevB2BClientes').textContent=new Set(rows.map(x=>x.cliente)).size;
  q('prevB2BPreview').classList.remove('hide');q('prevB2BUpdate').disabled=false;
  const extra=otherMonth?' '+otherMonth.toLocaleString('pt-BR')+' linha(s) B2B de outros meses foram ignoradas.':'';
  status('Planilha pronta: '+rows.length.toLocaleString('pt-BR')+' combinações únicas de PV + data B2B serão usadas somente na Recompra.'+extra,true)
 }catch(e){status(e?.message||'Não foi possível validar a planilha.')}
}
async function check(id){
 for(let i=0;i<4;i++){try{const j=await retry('b2b_anterior_status',{import_id:id},2,15000);if(j.finished)return j}catch{}if(i<3)await pause(1000)}
 return null
}
async function upload(){
 if(running||!rows.length)return;
 const mi=monthInfo();
 if(!confirm('Confirma substituir o histórico de '+mi.label+' usado somente na RECOMPRA B2B?\n\nA Compra B2B e as demais categorias continuarão usando apenas a planilha principal do mês atual.'))return;
 running=true;const btn=q('prevB2BUpdate');btn.disabled=true;let id='';
 try{
  const size=400,total=Math.ceil(rows.length/size);
  const start=await retry('b2b_anterior_inicio',{total:rows.length,lotes:total},3);id=start.import_id;
  for(let i=0;i<total;i++){status('Enviando mês anterior: parte '+(i+1)+' de '+total+'...');await retry('b2b_anterior_parte',{import_id:id,parte:i,rows:rows.slice(i*size,(i+1)*size)},4,30000)}
  status('Conferindo o histórico do mês anterior...');
  let done;try{done=await call('b2b_anterior_concluir',{import_id:id},90000)}catch(e){done=await check(id);if(!done?.finished)throw e}
  status('✓ Mês anterior atualizado: '+Number(done.registros||0).toLocaleString('pt-BR')+' compras B2B únicas. Recompra recalculada sem duplicar PV.',true);
  try{const fresh=window.__refreshAdminData?.(true);if(fresh?.catch)fresh.catch(()=>{})}catch{}
 }catch(e){status('Falha ao atualizar mês anterior: '+String(e?.message||e))}
 finally{running=false;btn.disabled=!rows.length}
}
let tries=0;const timer=setInterval(()=>{if(ensure()||++tries>100)clearInterval(timer)},250);
})();