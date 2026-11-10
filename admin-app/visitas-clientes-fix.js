(()=>{
  const API='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/base-clientes-admin';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v??'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const pageIds=['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasClientes','visitasSubcanais','subcanaisPainel','imperdoaveisAdmin','adminConteudos','contatosClientes','visitasClientesFix'];
  let rows=[],staticLoaded=false,onlineChecked=false,loading=null;

  function css(){
    if($('visitasClientesFixStyle'))return;
    const s=document.createElement('style');s.id='visitasClientesFixStyle';s.textContent=`
      #visitasClientesFix .vfTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
      #visitasClientesFix .vfFilters{display:grid;grid-template-columns:1fr 190px 1fr;gap:10px;margin:14px 0}
      #visitasClientesFix .vfInfo{background:#eef6ff;border-radius:12px;padding:11px 13px;font-weight:800;margin:10px 0}
      #visitasClientesFix .vfTableWrap{overflow:auto;border:1px solid #dce3e8;border-radius:12px;background:#fff}
      #visitasClientesFix table{border-collapse:collapse;width:100%;min-width:980px}
      #visitasClientesFix th{background:#e30613!important;color:#fff!important;font-weight:900;position:sticky;top:0;z-index:1}
      #visitasClientesFix td,#visitasClientesFix th{padding:9px 7px;border-bottom:1px solid #e1e7ec;vertical-align:middle}
      #visitasClientesFix tbody tr:nth-child(odd) td{background:#eaf4fb}
      #visitasClientesFix tbody tr:nth-child(even) td{background:#fff}
      #visitasClientesFix .vfPv{font-weight:900;white-space:nowrap}
      #visitasClientesFix .vfPhone{white-space:nowrap;color:#0b63ce;font-weight:800;text-decoration:none}
      #visitasClientesFix tbody tr.vfClientRow{cursor:pointer}
      #visitasClientesFix tbody tr.vfClientRow:hover td{background:#fff4f4!important}
      #visitasClientesFix .vfPv{color:#b40000}
      #vfClientOverlay{display:none;position:fixed;inset:0;z-index:70000;background:#0009;padding:10px;align-items:center;justify-content:center}
      #vfClientOverlay.show{display:flex}
      .vfClientSheet{width:min(820px,100%);max-height:94dvh;overflow:auto;background:#f4f6f8;border-radius:18px}
      .vfClientTop{position:sticky;top:0;z-index:3;background:linear-gradient(135deg,#090909,#9f0000);color:#fff;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
      .vfClientTop h2{margin:0;font-size:20px}.vfClientTop button{border:0;background:#fff;border-radius:9px;padding:9px 12px;font-weight:900}
      .vfClientBody{padding:12px}.vfClientHead{background:#fff;border-radius:14px;padding:13px;margin-bottom:10px}
      .vfClientHead b{font-size:18px}.vfClientHead small{display:block;color:#617182;margin-top:4px}
      .vfClientTable{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #dce3e8}
      .vfClientTable table{width:100%;min-width:0!important;border-collapse:collapse}
      .vfClientTable th{background:#e30613!important;color:#fff!important;position:static!important}.vfClientTable th,.vfClientTable td{padding:9px 8px!important}
      .vfOk{color:#087249;font-weight:900}.vfBad{color:#c8151d;font-weight:900}.vfDetail{display:block;font-size:11px;color:#5d6c7a;margin-top:3px;font-weight:700}
      .vfClientLoading{padding:30px;text-align:center;font-weight:900;color:#667788}
      #visitasClientesFix .vfUpload{border:2px dashed #ccd3da;border-radius:12px;padding:14px;background:#fafbfc;margin:12px 0}
      @media(max-width:760px){
        #visitasClientesFix .box{padding:10px!important}
        #visitasClientesFix .vfTop{display:block}
        #visitasClientesFix .vfTop .red{width:100%;margin-top:8px}
        #visitasClientesFix .vfFilters{grid-template-columns:1fr;gap:7px}
        #visitasClientesFix .vfTableWrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch}
        #visitasClientesFix table{min-width:760px!important;table-layout:auto!important;font-size:10px!important}
        #visitasClientesFix td,#visitasClientesFix th{padding:6px 5px!important;white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important}
        #visitasClientesFix th:nth-child(1),#visitasClientesFix td:nth-child(1){width:45px}
        #visitasClientesFix th:nth-child(2),#visitasClientesFix td:nth-child(2){width:45px}
        #visitasClientesFix th:nth-child(3),#visitasClientesFix td:nth-child(3){width:74px}
        #visitasClientesFix th:nth-child(4),#visitasClientesFix td:nth-child(4){width:48px}
        #visitasClientesFix th:nth-child(5),#visitasClientesFix td:nth-child(5){min-width:180px}
      }
    `;document.head.appendChild(s);
  }

  function hideAll(){
    pageIds.forEach(id=>$(id)?.classList.add('hide'));
    $('cokeHome')?.classList.add('hide');
    document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('on'));
    $('backHome')?.remove();
  }
  function addBack(){
    const wrap=document.querySelector('.wrap');if(!wrap)return;
    $('backHome')?.remove();
    const b=document.createElement('button');b.id='backHome';b.className='backHome';b.textContent='← Voltar ao menu administrativo';
    b.onclick=()=>{pageIds.forEach(id=>$(id)?.classList.add('hide'));$('cokeHome')?.classList.remove('hide');b.remove();window.scrollTo({top:0,behavior:'smooth'})};
    wrap.insertBefore(b,wrap.firstChild);
  }

  function build(){
    css();
    const wrap=document.querySelector('.wrap');if(!wrap)return false;
    let sec=$('visitasClientesFix');
    if(!sec){
      sec=document.createElement('section');sec.id='visitasClientesFix';sec.className='hide';
      sec.innerHTML=`<div class="box">
        <div class="vfTop"><div><h2 style="margin:0 0 5px">📍 Visita de Clientes</h2><p class="small" style="margin:0">Clientes por rota, dia, sequência e frequência de visita.</p></div><button id="vfOpenUpload" class="red">⬆️ Atualizar Base de Clientes</button></div>
        <div id="vfUpload" class="vfUpload hide"><b>Atualizar Base de Clientes</b><p class="small">Anexe a planilha Excel da base de clientes. Ao concluir, a nova base passa a ser usada nesta tela.</p><input id="vfExcel" type="file" accept=".xlsx,.xls"><div class="action" style="margin-top:10px"><button id="vfImport" class="red">IMPORTAR BASE</button><button id="vfCancel">CANCELAR</button></div><div id="vfImportStatus" class="small" style="margin-top:8px"></div></div>
        <div class="vfFilters"><div><label>Rota</label><select id="vfRota"><option value="ALL">Todas as rotas</option></select></div><div><label>Dia de visita</label><select id="vfDia"><option value="ALL">Todos os dias</option><option>SEG</option><option>TER</option><option>QUA</option><option>QUI</option><option>SEX</option></select></div><div><label>Pesquisar cliente</label><input id="vfBusca" placeholder="PV, razão, cidade ou endereço"></div></div>
        <div id="vfInfo" class="vfInfo">Carregando clientes...</div>
        <div class="vfTableWrap"><table><thead><tr><th>Ordem</th><th>Dia</th><th>PV</th><th>Rota</th><th>Razão Social</th><th>Frequência</th><th>Cidade</th><th>Endereço</th><th>Telefone</th></tr></thead><tbody id="vfTb"><tr><td colspan="9">Carregando...</td></tr></tbody></table></div>
      </div>`;
      wrap.appendChild(sec);
      $('vfRota').onchange=render;$('vfDia').onchange=render;$('vfBusca').oninput=render;
      $('vfOpenUpload').onclick=()=>{$('vfUpload').classList.toggle('hide');$('vfImportStatus').textContent=''};
      $('vfCancel').onclick=()=>$('vfUpload').classList.add('hide');
      $('vfImport').onclick=importExcel;
    }
    return true;
  }

  function parseCsv(text){
    const lines=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean);if(!lines.length)return[];
    const head=lines.shift().split(';');
    return lines.map(line=>{const a=line.split(';'),o={};head.forEach((h,i)=>o[h]=a[i]??'');return o});
  }
  async function loadStatic(){
    const files=[0,1,2,3,4].map(i=>new URL(`visitas_full_part${i}.csv?v=20260914-visitas-static-01`,location.href).href);
    const parts=await Promise.all(files.map(async u=>{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw Error('Falha ao carregar base de visitas');return parseCsv(await r.text())}));
    const map=new Map();parts.flat().forEach(x=>{const pv=String(x.Cliente||'').trim();if(pv)map.set(pv,x)});
    return [...map.values()];
  }
  async function api(action,extra={}){
    const token=sessionStorage.getItem('admToken')||'';
    const r=await fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,token,...extra})});
    const j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw Error(j.error||'Erro de conexão');return j;
  }
  function mapOnline(x){return{Cliente:x.cliente||'',Rota:x.rota||'','Razão Social':x.razao||'',SubCanal:x.subcanal||'','Freq visita':x.frequencia||'',SEG:x.seg||0,TER:x.ter||0,QUA:x.qua||0,QUI:x.qui||0,SEX:x.sex||0,Cidade:x.cidade||'','Endereço':x.endereco||'',Telefone:x.telefone||''}}
  function setRows(data){
    const map=new Map();data.forEach(x=>{const pv=String(x.Cliente||'').trim();if(pv)map.set(pv,x)});rows=[...map.values()];fillRoutes();render();
  }
  async function ensureRows(force=false){
    if(rows.length&&!force)return rows;
    if(loading&&!force)return loading;
    loading=(async()=>{
      try{
        const data=await loadStatic();setRows(data);staticLoaded=true;
      }catch(e){$('vfInfo').textContent='Tentando carregar a base online...'}
      loading=null;
      if(!onlineChecked||force){onlineChecked=true;api('list').then(j=>{const online=j.rows||[];if(online.length>=100)setRows(online.map(mapOnline))}).catch(()=>{});}
      if(!rows.length){try{const j=await api('list'),online=j.rows||[];if(online.length)setRows(online.map(mapOnline))}catch(e){$('vfInfo').textContent='Não foi possível carregar os clientes.'}}
      return rows;
    })();
    return loading;
  }
  function fillRoutes(){
    const sel=$('vfRota');if(!sel)return;const old=sel.value||'ALL';
    const rs=[...new Set(rows.map(x=>String(x.Rota||'').trim()).filter(Boolean))].sort();
    sel.innerHTML='<option value="ALL">Todas as rotas</option>'+rs.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
    sel.value=rs.includes(old)?old:'ALL';
  }
  function phone(v){const t=String(v||'').trim();if(!t)return '-';const d=t.replace(/\D/g,'');return d.length>=8?`<a class="vfPhone" href="tel:${esc(d)}">☎ ${esc(t)}</a>`:esc(t)}
  async function admPost(payload){
    const body={...(payload||{}),token:sessionStorage.getItem('admToken')||''};
    if(typeof window.__adminRobustPost==='function')return window.__adminRobustPost(body);
    if(typeof window.post==='function')return window.post(body);
    throw new Error('Conexão do ADM indisponível.');
  }
  function ensureClientOverlay(){
    let ov=$('vfClientOverlay');if(ov)return ov;
    ov=document.createElement('div');ov.id='vfClientOverlay';
    ov.innerHTML='<div class="vfClientSheet"><div class="vfClientTop"><h2>🔎 Pesquisa do Cliente</h2><button type="button" id="vfClientClose">Fechar</button></div><div id="vfClientBody" class="vfClientBody"><div class="vfClientLoading">Carregando...</div></div></div>';
    document.body.appendChild(ov);
    $('vfClientClose').onclick=()=>ov.classList.remove('show');
    ov.onclick=e=>{if(e.target===ov)ov.classList.remove('show')};
    return ov;
  }
  function catDetail(x){
    if(x?.excluido||x?.nao_aplicavel)return 'Não se aplica ao cliente';
    if(Array.isArray(x?.grupos)&&x.grupos.length){
      const faltam=x.grupos.filter(g=>!g.vendido).map(g=>'Grupo '+g.grupo);
      return faltam.length?'Falta: '+faltam.join(', '):'Todos os grupos realizados';
    }
    if(String(x?.tipo_regra||'')==='quantidade'){
      const q=Number(x.quantidade||0),m=Number(x.quantidade_minima||0);
      return x.realizado?'Quantidade atingida: '+q:'Falta '+Math.max(m-q,0)+' • atual '+q+'/'+m;
    }
    if(String(x?.tipo_regra||'')==='recompra'){
      const q=Number(x.compras||0),m=Number(x.compras_minimas||0);
      return x.realizado?'Recompra realizada':'Falta '+Math.max(m-q,0)+' compra(s) • atual '+q+'/'+m;
    }
    return x?.realizado?'Cobertura realizada':'Cobertura ainda não realizada';
  }
  async function openClient(pv,rota){
    const ov=ensureClientOverlay(),body=$('vfClientBody');ov.classList.add('show');
    body.innerHTML='<div class="vfClientLoading">Consultando coberturas do PV '+esc(pv)+'...</div>';
    try{
      const req={action:'search_pv',pv:String(pv||'').trim()};
      if(rota)req.rota=String(rota).trim();
      const r=await admPost(req);
      if(!r?.found){body.innerHTML='<div class="vfClientLoading">PV não encontrado na base atual.</div>';return}
      const cats=(r.categorias||[]).filter(x=>!x?.nao_aplicavel);
      body.innerHTML='<section class="vfClientHead"><b>PV '+esc(r.cliente?.pv||pv)+' - '+esc(r.cliente?.razao||'')+'</b><small>Rota: '+esc(r.cliente?.rota||rota||'')+' • Subcanal: '+esc(r.cliente?.subcanal||'-')+'</small></section><section class="vfClientTable"><table><thead><tr><th>Categoria</th><th>Situação</th></tr></thead><tbody>'+cats.map(x=>'<tr><td><b>'+esc(x.nome||'')+'</b></td><td class="'+(x.realizado?'vfOk':'vfBad')+'">'+(x.realizado?'✓ REALIZADO':'✕ NÃO REALIZADO')+'<span class="vfDetail">'+esc(catDetail(x))+'</span></td></tr>').join('')+'</tbody></table></section>';
    }catch(e){body.innerHTML='<div class="vfClientLoading">'+esc(e.message||'Não foi possível consultar o cliente.')+'</div>'}
  }
  function render(){
    if(!$('vfTb'))return;const rota=$('vfRota')?.value||'ALL',dia=$('vfDia')?.value||'ALL',busca=norm($('vfBusca')?.value);const days=['SEG','TER','QUA','QUI','SEX'];
    let base=rows.filter(x=>(rota==='ALL'||String(x.Rota)===rota)&&(dia==='ALL'||Number(x[dia]||0)>0)&&(!busca||norm([x.Cliente,x['Razão Social'],x.Cidade,x['Endereço'],x.SubCanal].join(' ')).includes(busca)));
    let out=[];base.forEach(x=>{let ds=days.filter(d=>Number(x[d]||0)>0);if(dia!=='ALL')ds=ds.filter(d=>d===dia);if(!ds.length)ds=['-'];ds.forEach(d=>out.push({...x,_dia:d,_ord:d==='-'?'':Number(x[d]||0)}))});
    out.sort((a,b)=>String(a.Rota).localeCompare(String(b.Rota),'pt-BR')||days.indexOf(a._dia)-days.indexOf(b._dia)||(a._ord||9999)-(b._ord||9999)||String(a['Razão Social']).localeCompare(String(b['Razão Social']),'pt-BR'));
    $('vfInfo').innerHTML=`<b>${base.length} cliente(s)</b>${rota==='ALL'?' • Todas as rotas':` • Rota ${esc(rota)}`}${dia==='ALL'?' • Todos os dias':` • ${esc(dia)}`}`;
    $('vfTb').innerHTML=out.length?out.map(x=>`<tr class="vfClientRow" data-pv="${esc(x.Cliente)}" data-rota="${esc(x.Rota)}" title="Clique para consultar as coberturas"><td>${esc(x._ord)}</td><td><b>${esc(x._dia)}</b></td><td class="vfPv">${esc(x.Cliente)}</td><td><b>${esc(x.Rota)}</b></td><td>${esc(x['Razão Social'])}</td><td>${esc(x['Freq visita'])}</td><td>${esc(x.Cidade)}</td><td>${esc(x['Endereço'])}</td><td>${phone(x.Telefone)}</td></tr>`).join(''):'<tr><td colspan="9" class="empty">Nenhum cliente encontrado.</td></tr>';
    $('vfTb').querySelectorAll('.vfClientRow').forEach(tr=>tr.onclick=e=>{if(e.target.closest('a'))return;openClient(tr.dataset.pv,tr.dataset.rota)});
  }
  async function importExcel(){
    const f=$('vfExcel')?.files?.[0];if(!f){$('vfImportStatus').textContent='Selecione uma planilha Excel.';return}if(!window.XLSX){$('vfImportStatus').textContent='Leitor de Excel ainda não carregou.';return}
    try{$('vfImportStatus').textContent='Atualizando a base...';const wb=XLSX.read(await f.arrayBuffer(),{type:'array'}),ws=wb.Sheets[wb.SheetNames[0]],data=XLSX.utils.sheet_to_json(ws,{defval:''});const j=await api('import',{rows:data});$('vfImportStatus').innerHTML=`<span class="ok">✓ ${j.registros} clientes atualizados.</span>`;const online=await api('list');if((online.rows||[]).length)setRows(online.rows.map(mapOnline));$('vfUpload').classList.add('hide')}catch(e){$('vfImportStatus').innerHTML=`<span class="bad">${esc(e.message)}</span>`}
  }
  async function open(){
    if(!build())return;hideAll();$('visitasClientesFix').classList.remove('hide');addBack();$('vfInfo').textContent=rows.length?'Atualizando lista...':'Carregando clientes...';window.scrollTo({top:0,behavior:'smooth'});await ensureRows();render();
  }
  window.abrirVisitaClientesAdm=open;
  window.abrirAtualizarBaseClientesAdm=async function(){
    if(!build())return;
    hideAll();
    $('visitasClientesFix').classList.remove('hide');
    addBack();
    $('vfUpload').classList.remove('hide');
    $('vfImportStatus').textContent='';
    $('vfInfo').textContent=rows.length?'Base atual carregada. Selecione a nova planilha para atualizar.':'Carregando base atual...';
    window.scrollTo({top:0,behavior:'smooth'});
    try{await ensureRows()}catch{}
    render();
    setTimeout(()=>{try{$('vfUpload').scrollIntoView({behavior:'smooth',block:'start'})}catch{}},120);
  };

  document.addEventListener('click',e=>{
    const card=e.target.closest?.('.menuCard');if(!card)return;
    if(norm(card.querySelector('b')?.textContent)==='VISITA DE CLIENTES'){
      e.preventDefault();e.stopPropagation();if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();open();
    }
  },true);

  function bindHiddenTab(){const tabs=document.querySelector('.tabs');if(!tabs)return;const b=[...tabs.querySelectorAll('button')].find(x=>norm(x.textContent).includes('VISITA DE CLIENTES'));if(b)b.onclick=e=>{e?.preventDefault?.();open()}}
  let n=0;const t=setInterval(()=>{build();bindHiddenTab();if(++n>80)clearInterval(t)},150);
})();