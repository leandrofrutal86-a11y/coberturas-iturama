(()=>{
'use strict';
const $=id=>document.getElementById(id),E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let PACKS=null;
function css(){if($('calcCuHlStyle'))return;const s=document.createElement('style');s.id='calcCuHlStyle';s.textContent=`
#calcCuHl{position:fixed;inset:0;z-index:43000;background:#f2f5f8;display:none;overflow:auto;color:#172534;font-family:Arial,sans-serif}#calcCuHl.show{display:block}.cchWrap{width:min(900px,calc(100% - 16px));margin:12px auto 90px}.cchHead{background:linear-gradient(135deg,#0f172a,#0f766e);color:#fff;border-radius:18px;padding:15px;display:flex;justify-content:space-between;gap:10px;align-items:center}.cchHead h2{margin:0}.cchBox{background:#fff;border-radius:16px;padding:14px;margin-top:12px;box-shadow:0 4px 14px #172b400d}.cchGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.cchGrid label{font-size:11px;font-weight:900}.cchGrid input,.cchGrid select{display:block;width:100%;box-sizing:border-box;margin-top:5px;min-height:46px;border:1px solid #cfd8e3;border-radius:12px;padding:9px 11px;font-size:15px}.cchResult{margin-top:14px;border-radius:16px;padding:18px;background:#eef8ff;text-align:center}.cchResult small{display:block;color:#64748b;font-weight:900}.cchResult strong{display:block;font-size:38px;margin-top:4px;color:#0b6b9a}.cchFormula{font-size:12px;color:#64748b;margin-top:7px}.cchSteps{margin-top:14px;text-align:left;background:#fff;border:1px solid #dbe6ef;border-radius:12px;padding:12px}.cchSteps b{display:block;margin-bottom:8px;color:#172534}.cchStep{padding:6px 0;border-bottom:1px dashed #dbe2e8;font-size:13px;line-height:1.35}.cchStep:last-child{border-bottom:0}.cchStep strong{font-size:14px;color:#0b6b9a;display:inline}.cchActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.cchActions button{border:0;border-radius:11px;padding:12px 15px;font-weight:900}.cchPrimary{background:#0f766e;color:#fff}.cchDark{background:#111827;color:#fff}.cchNote{font-size:12px;color:#64748b;margin-top:10px}
@media(max-width:650px){.cchGrid{grid-template-columns:1fr}.cchActions button{flex:1 1 100%}.cchResult strong{font-size:32px}}
`;document.head.appendChild(s)}
function ensure(){css();let p=$('calcCuHl');if(p)return p;p=document.createElement('section');p.id='calcCuHl';p.innerHTML=`
<div class="cchWrap"><div class="cchHead"><div><h2>🧮 Calculadora CU / hL</h2><small>Converta caixas e pacotes por tamanho da embalagem</small></div><button id="cchClose">✕ Fechar</button></div>
<div class="cchBox"><div class="cchGrid">
<label>Tipo de cálculo<select id="cchType"><option value="CU">Caixa Unitária</option><option value="HL">Hectolitro</option></select></label>
<label>Embalagem<select id="cchPack"></select></label>
<label>Tamanho da embalagem (ml)<input id="cchMl" type="number" min="1" step="1" inputmode="numeric"></label>
<label>Quantidade por caixa/pacote<input id="cchUnits" type="number" min="1" step="1" inputmode="numeric"></label>
<label>Quantidade de caixas/pacotes<input id="cchQty" type="number" min="0" step="0.01" inputmode="decimal" value="1"></label>
<label>Referência<select id="cchRef"><option value="VENDEU">Quantidade vendida</option><option value="FALTA">Quantidade que falta</option></select></label>
</div><div class="cchActions"><button id="cchCalc" class="cchPrimary">CALCULAR</button><button id="cchClear" class="cchDark">LIMPAR</button></div><div id="cchStatus" class="cchNote"></div></div>
<div class="cchBox"><div id="cchResult" class="cchResult"><small>RESULTADO</small><strong>0</strong><div class="cchFormula">Escolha a embalagem e informe a quantidade.</div></div></div></div>`;document.body.appendChild(p);
$('cchClose').onclick=()=>p.classList.remove('show');$('cchType').onchange=renderPacks;$('cchPack').onchange=syncPack;$('cchCalc').onclick=calc;$('cchClear').onclick=()=>{$('cchQty').value='';$('cchResult').innerHTML='<small>RESULTADO</small><strong>0</strong><div class="cchFormula">Escolha a embalagem e informe a quantidade.</div>'};return p}
async function loadPacks(){if(PACKS)return PACKS;const j=await api('calculator_packages');PACKS=j.packages||[];return PACKS}
function fmtMl(ml){return ml>=1000&&ml%1000===0?(ml/1000)+' L':ml+' ml'}
function renderPacks(){const type=$('cchType').value,rows=(PACKS||[]).filter(x=>x.tipo===type),sel=$('cchPack');sel.innerHTML='<option value="">Escolha uma embalagem</option>'+rows.map((x,i)=>'<option value="'+x.ml+'|'+x.units+'">'+fmtMl(x.ml)+' × '+x.units+'</option>').join('')+'<option value="MANUAL">Digitar manualmente</option>';syncPack()}
function syncPack(){const v=$('cchPack').value;if(!v||v==='MANUAL'){if(v==='MANUAL'){$('cchMl').value='';$('cchUnits').value=''}return}const [ml,u]=v.split('|');$('cchMl').value=ml;$('cchUnits').value=u}
function calc(){
 const type=$('cchType').value,ml=Number($('cchMl').value||0),units=Number($('cchUnits').value||0),qty=Number(String($('cchQty').value||0).replace(',','.'));
 if(!(ml>0&&units>0&&qty>=0)){$('cchStatus').textContent='Informe tamanho, quantidade por caixa e quantidade de caixas/pacotes.';return}
 const volumeMl=ml*units,volumeL=volumeMl/1000,totalVolumeL=volumeL*qty;
 let unitValue,total,label,steps='';
 if(type==='CU'){
   unitValue=volumeL/5.69;
   total=unitValue*qty;
   label='CU';
   steps='<div class="cchSteps"><b>Como foi feita a conta:</b>'+
    '<div class="cchStep">1. Volume da caixa: <strong>'+ml.toLocaleString('pt-BR')+' ml × '+units+' = '+volumeMl.toLocaleString('pt-BR')+' ml</strong></div>'+
    '<div class="cchStep">2. Convertendo para litros: <strong>'+volumeMl.toLocaleString('pt-BR')+' ml ÷ 1.000 = '+volumeL.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:3})+' L</strong></div>'+
    '<div class="cchStep">3. Valor de 1 caixa/pacote em CU: <strong>'+volumeL.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:3})+' L ÷ 5,69 L = '+unitValue.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:4})+' CU</strong></div>'+
    '<div class="cchStep">4. Quantidade informada: <strong>'+unitValue.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:4})+' CU × '+qty.toLocaleString('pt-BR')+' = '+total.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3})+' CU</strong></div></div>';
 }else{
   unitValue=volumeL/100;
   total=unitValue*qty;
   label='hL';
   steps='<div class="cchSteps"><b>Como foi feita a conta:</b>'+
    '<div class="cchStep">1. Volume da caixa: <strong>'+ml.toLocaleString('pt-BR')+' ml × '+units+' = '+volumeMl.toLocaleString('pt-BR')+' ml</strong></div>'+
    '<div class="cchStep">2. Convertendo para litros: <strong>'+volumeMl.toLocaleString('pt-BR')+' ml ÷ 1.000 = '+volumeL.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:3})+' L</strong></div>'+
    '<div class="cchStep">3. Convertendo para hectolitro: <strong>'+volumeL.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:3})+' L ÷ 100 = '+unitValue.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:4})+' hL</strong></div>'+
    '<div class="cchStep">4. Quantidade informada: <strong>'+unitValue.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:4})+' hL × '+qty.toLocaleString('pt-BR')+' = '+total.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3})+' hL</strong></div></div>';
 }
 const ref=$('cchRef').value==='FALTA'?'Falta equivalente a':'Venda equivalente a';
 $('cchResult').innerHTML='<small>'+ref.toUpperCase()+'</small><strong>'+total.toLocaleString('pt-BR',{minimumFractionDigits:3,maximumFractionDigits:3})+' '+label+'</strong><div class="cchFormula">Volume total informado: '+totalVolumeL.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:3})+' litros</div>'+steps;
 $('cchStatus').textContent=''
}
async function open(){const p=ensure();p.classList.add('show');$('cchStatus').textContent='Carregando embalagens da base de vendas...';try{await loadPacks();renderPacks();$('cchStatus').textContent='As opções mostram somente tamanho e quantidade por caixa, sem marca ou produto.'}catch(e){$('cchStatus').textContent='Não foi possível carregar as embalagens: '+e.message}}
window.openCalculatorCuHl=open;
})();