(()=>{
const CFG='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/admin-config-api';
const q=id=>document.getElementById(id);
async function cfg(body){const r=await fetch(CFG,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),j=await r.json();if(!r.ok)throw Error(j.error||'Erro');return j}
function installCategory(){
  const mode=q('cmMode'),name=q('cmName');
  if(!mode||!name){setTimeout(installCategory,250);return}
  if(q('cmQtyWrap'))return;
  const wrap=document.createElement('div');
  wrap.id='cmQtyWrap';
  wrap.style='margin-top:12px;border:1px solid #dfe4e8;border-radius:12px;padding:12px;background:#fff8e8;display:grid;gap:12px';
  wrap.innerHTML=`
    <div>
      <label style="display:flex;gap:8px;align-items:center;font-weight:800"><input id="cmUseQty" type="checkbox" style="width:auto"> Usar quantidade mínima por cliente</label>
      <div id="cmQtyFields" style="display:none;margin-top:10px">
        <label>Quantidade mínima em caixas</label>
        <input id="cmQty" type="number" min="1" step="0.01" value="2">
        <p class="small">Soma a coluna Quantidade Caixa das vendas que atendem aos valores selecionados. Ex.: mínimo 2 = 2 caixas do mesmo produto ou a soma de produtos permitidos.</p>
      </div>
    </div>
    <div style="border-top:1px solid #ead9a9;padding-top:12px">
      <label style="display:flex;gap:8px;align-items:center;font-weight:800"><input id="cmUseRepurchase" type="checkbox" style="width:auto"> 🔁 Recompra — cliente comprou mais de uma vez</label>
      <div id="cmRepFields" style="display:none;margin-top:10px">
        <label>Mínimo de compras</label>
        <input id="cmRepMin" type="number" min="2" step="1" value="2">
        <p class="small">Considera compras em datas diferentes pela coluna Data Nota Fiscal. Ex.: mínimo 2 = o cliente precisa ter comprado esta categoria em pelo menos 2 datas diferentes.</p>
      </div>
    </div>`;
  const ex=q('cmExclude')?.parentElement||q('cmBuilder');
  ex.parentElement.insertBefore(wrap,ex);
  function syncSpecial(which){
    const useQty=q('cmUseQty').checked,useRep=q('cmUseRepurchase').checked;
    if(which==='qty'&&useQty)q('cmUseRepurchase').checked=false;
    if(which==='rep'&&useRep)q('cmUseQty').checked=false;
    q('cmQtyFields').style.display=q('cmUseQty').checked?'block':'none';
    q('cmRepFields').style.display=q('cmUseRepurchase').checked?'block':'none';
    if(q('cmUseQty').checked||q('cmUseRepurchase').checked){mode.value='ou';window.cmModeChanged?.()}
  }
  q('cmUseQty').onchange=()=>syncSpecial('qty');
  q('cmUseRepurchase').onchange=()=>syncSpecial('rep');
  const oldEdit=window.cmEditCategory;
  window.cmEditCategory=async function(id){
    await oldEdit(id);
    const c=(typeof config!=='undefined'?(config?.categorias||[]):[]).find(x=>Number(x.id)===Number(id));
    const tipo=String(c?.tipo_regra||'');
    const useQty=tipo==='quantidade',useRep=tipo==='recompra';
    q('cmUseQty').checked=useQty;
    q('cmUseRepurchase').checked=useRep;
    q('cmQty').value=Number(c?.quantidade_minima||2);
    q('cmRepMin').value=Math.max(2,Number(c?.compras_minimas||2));
    q('cmQtyFields').style.display=useQty?'block':'none';
    q('cmRepFields').style.display=useRep?'block':'none';
    if(useQty||useRep){mode.value='ou';window.cmModeChanged?.()}
  };
  const oldNew=window.cmNewCategory;
  window.cmNewCategory=function(){
    oldNew();
    q('cmUseQty').checked=false;
    q('cmUseRepurchase').checked=false;
    q('cmQty').value=2;
    q('cmRepMin').value=2;
    q('cmQtyFields').style.display='none';
    q('cmRepFields').style.display='none';
  };
  const oldSave=window.cmSaveCategory;
  window.cmSaveCategory=async function(){
    const useQty=q('cmUseQty').checked;
    const useRep=q('cmUseRepurchase').checked;
    const min=Math.max(1,Number(q('cmQty').value||2));
    const repMin=Math.max(2,Math.trunc(Number(q('cmRepMin').value||2)));
    if(useQty||useRep){mode.value='ou';window.cmModeChanged?.()}
    await oldSave();
    if(!useQty&&!useRep)return;
    const id=Number(q('cmId').value);
    if(!id)return;
    try{
      const rr=await cfg({action:'category_rules',token,id});
      await cfg({
        action:'save_category_full',token,id,
        nome:q('cmName').value.trim(),
        tipo_regra:useQty?'quantidade':'recompra',
        quantidade_minima:min,
        compras_minimas:repMin,
        regras:rr.regras||[]
      });
      q('cmStatus').className='ok';
      q('cmStatus').textContent=useQty?`Categoria salva com quantidade mínima de ${min} caixa(s).`:`Categoria salva como Recompra: mínimo de ${repMin} compras em datas diferentes.`;
      await carregarTudo();
      await window.cmEditCategory(id);
    }catch(e){q('cmStatus').className='bad';q('cmStatus').textContent=e.message}
  };
}
function normHeader(s){return String(s||'').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'')}
function toNum(v){if(typeof v==='number')return Number.isFinite(v)?v:0;const s=String(v??'').trim().replace(/\./g,'').replace(',','.');const n=Number(s);return Number.isFinite(n)?n:0}
function installImport(){if(typeof window.validarExcel!=='function'||!window.XLSX){setTimeout(installImport,250);return}if(window.validarExcel.__qty)return;const fn=async function(file){linhasImport=[];q('prev').classList.add('hide');q('btnAtualizar').disabled=true;q('statusVendas').textContent='';if(!file)return;try{const ab=await file.arrayBuffer(),wb=XLSX.read(ab,{type:'array',cellDates:true}),ws=wb.Sheets[wb.SheetNames[0]],arr=XLSX.utils.sheet_to_json(ws,{defval:'',raw:true});if(!arr.length)throw Error('Planilha vazia.');const keys=Object.keys(arr[0]),map={};keys.forEach(k=>map[normHeader(k)]=k);const req=['CLIENTE','ROTA','RAZAOSOCIAL','MATERIAL','MARCA','DESCRICAO','SUBCANAL','DATANOTAFISCAL','ORIGEM'],falt=req.filter(k=>!map[k]);if(falt.length)throw Error('Faltam colunas: '+falt.join(', '));const qtyKey=map.QUANTIDADECAIXA||map.QTDCAIXA||map.QTDECAIXA||map.QUANTIDADEEMCAIXA||keys[6];if(!qtyKey)throw Error('Não encontrei a coluna Quantidade Caixa.');linhasImport=arr.map(r=>({cliente:String(r[map.CLIENTE]??'').trim(),rota:String(r[map.ROTA]??'').trim(),razao:String(r[map.RAZAOSOCIAL]??'').trim(),material:String(r[map.MATERIAL]??'').trim(),marca:String(r[map.MARCA]??'').trim(),descricao:String(r[map.DESCRICAO]??'').trim(),subcanal:String(r[map.SUBCANAL]??'').trim(),quantidade_caixa:toNum(r[qtyKey]),data_nota_fiscal:dataISO(r[map.DATANOTAFISCAL]),origem:String(r[map.ORIGEM]??'').trim()}));const inval=linhasImport.findIndex(r=>!r.cliente||!r.rota||!r.material);if(inval>=0)throw Error('Linha '+(inval+2)+' inválida.');q('pLinhas').textContent=linhasImport.length;q('pRotas').textContent=new Set(linhasImport.map(r=>r.rota)).size;q('pClientes').textContent=new Set(linhasImport.map(r=>r.cliente)).size;const ds=linhasImport.map(r=>r.data_nota_fiscal).filter(Boolean).sort();q('pPeriodo').textContent=ds.length?`${ds[0].split('-').reverse().join('/')} a ${ds[ds.length-1].split('-').reverse().join('/')}`:'Sem data';q('prev').classList.remove('hide');q('btnAtualizar').disabled=false;q('statusVendas').className='ok';q('statusVendas').textContent='Planilha pronta • Quantidade Caixa, Origem e Data Nota Fiscal reconhecidas.'}catch(e){q('statusVendas').className='bad';q('statusVendas').textContent=e.message}};fn.__qty=true;window.validarExcel=fn}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{installCategory();installImport()});else{installCategory();installImport()}
})();