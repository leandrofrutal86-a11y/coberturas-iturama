from pathlib import Path
import re
from datetime import datetime
from zoneinfo import ZoneInfo

INDEX=Path('index.html')
s=INDEX.read_text(encoding='utf-8')

if 'const DATA =' not in s:
    raise SystemExit('DATA nao encontrada')

now=datetime.now(ZoneInfo('America/Sao_Paulo'))
iso=now.isoformat(timespec='minutes')
s,n_date=re.subn(r'(updatedAt"\s*:\s*")[^"]*(")',r'\g<1>'+iso+r'\2',s,count=1)
if n_date!=1:
    raise SystemExit('updatedAt nao encontrado')

# Corrige somente a funcao de calculo das categorias, preservando os parametros definidos.
new_fn=r'''function categoryRows(rota, cat){
  const R=String(rota);
  const rows=(DATA.vendas||[]).filter(r=>String(r.Rota??r.rota??'')===R);
  const mat=r=>String(r.Material??r.material??'').trim().replace(/^0+/, '');
  const brand=r=>String(r.Marca??r.marca??'').trim().toUpperCase();
  const desc=r=>String(r.Descrição??r.descricao??r['descrição']??'').trim().toUpperCase();
  const client=r=>String(r.Cliente??r.cliente??'').trim();
  if(cat==='FINI') return rows.filter(r=>brand(r)==='FINI');
  if(cat==='PERFETTI') return rows.filter(r=>brand(r)==='PERFETTI');
  if(cat==='MONSTER ULTRA') return rows.filter(r=>brand(r).includes('MONSTER ULTRA') || desc(r).includes('MONSTER ULTRA'));
  if(cat==='MARCA CAMPARI') return rows.filter(r=>brand(r)==='CAMPARI');
  if(cat==='APEROL') return rows.filter(r=>brand(r)==='APEROL' || desc(r).includes('APEROL'));
  if(cat==='OLD PARR') return rows.filter(r=>['8280','1965'].includes(mat(r)));
  if(cat==='RED LABEL') return rows.filter(r=>['1973','1964','8014'].includes(mat(r)));
  if(cat==='SMIRNOFF VODKA') return rows.filter(r=>desc(r).includes('SMIRNOFF') && !desc(r).includes('ICE'));
  if(cat==='ESTRELLA GERAL') return rows.filter(r=>brand(r).includes('ESTRELLA') || desc(r).includes('ESTRELLA'));
  if(cat==='ESTRELLA ORIGINAL') return rows.filter(r=>['1960','1885','1891'].includes(mat(r)));
  if(cat==='ESTRELLA RGB') return rows.filter(r=>mat(r)==='1891');
  if(cat==='TRIO PÃO DE QUEIJO'){
    const byClient=new Map();
    rows.forEach(r=>{const pv=client(r);if(!pv)return;if(!byClient.has(pv))byClient.set(pv,[]);byClient.get(pv).push(r);});
    const complete=[];
    byClient.forEach(rs=>{if(client(rs[0])==='1440002')return;const g1=rs.some(r=>['1918','1919'].includes(mat(r)));const g2=rs.some(r=>mat(r)==='1916');const g3=rs.some(r=>mat(r)==='1827');if(g1&&g2&&g3)complete.push(rs[0]);});
    return complete;
  }
  if(cat==='COBERTURA HEINEKEN') return rows.filter(r=>{const b=brand(r);return b==='BAVARIA'||b.includes('BAVARIA')||b==='EISENBAHN'||b.includes('EISENBAHN')||b==='KAISER'||b.includes('KAISER')||b==='SOL'||b.startsWith('SOL ');});
  const info=(typeof getCatInfo==='function'?getCatInfo()[cat]:{})||{};
  const tipo=String(info.tipo||'').toUpperCase();
  if(tipo==='CÓDIGO'||tipo==='CODIGO'){const codes=(info.valores||[]).map(v=>String(v).trim().replace(/^0+/,'')).filter(Boolean);return rows.filter(r=>codes.includes(mat(r)));}
  if(tipo==='MARCA'&&(info.valores||[]).length){const brands=(info.valores||[]).map(v=>String(v).toUpperCase().trim()).filter(Boolean);return rows.filter(r=>brands.some(b=>brand(r).includes(b)));}
  return [];
}'''
s,n=re.subn(r'function categoryRows\(rota, cat\)\{.*?\n\}\nfunction uniqueClientsForCategory',new_fn+'\nfunction uniqueClientsForCategory',s,count=1,flags=re.S)
if n!=1: raise SystemExit('categoryRows nao encontrada')

# Forca todas as metas a zero e impede scripts legados de recolocarem valores.
zero='''<script id="v31-static-final-zero">\n(function(){\n  var Z={};\n  function aplicar(){try{\n    if(typeof DATA!=="undefined") {\n      Object.keys(DATA.metas||{}).forEach(function(k){Z[k]=0;});\n      try{Object.defineProperty(DATA,"metas",{configurable:false,enumerable:true,get:function(){return Z;},set:function(v){try{Object.keys(v||{}).forEach(function(k){Z[k]=0;});}catch(e){}}});}catch(e){}\n      Object.keys(Z).forEach(function(k){Z[k]=0;});\n    }\n    try{localStorage.removeItem("iturama_metas");}catch(e){}\n    try{\n      var K="iturama_admin_completo_v2",c=JSON.parse(localStorage.getItem(K)||"null");\n      if(c){c.metas=c.metas||{};Object.keys(c.metas).forEach(function(k){c.metas[k]=0;});localStorage.setItem(K,JSON.stringify(c));}\n    }catch(e){}\n    if(typeof render==='function'){try{render('metas');}catch(e){try{render();}catch(x){}}}\n    if(typeof window.render==='function'){try{window.render('metas');}catch(e){}}\n  }catch(e){}}\n  aplicar();\n  window.addEventListener("load",aplicar);\n  setTimeout(aplicar,100);setTimeout(aplicar,500);setTimeout(aplicar,1500);setTimeout(aplicar,3000);\n})();\n</script>'''
s=re.sub(r'<script id="v31-static-final-zero">.*?</script>',zero,s,count=1,flags=re.S)
if 'id="v31-static-final-zero"' not in s:s=s.replace('</body>',zero+'\n</body>',1)

# Correcao visual definitiva: zera as colunas de META de Estrella Geral, Original e RGB em qualquer tabela, inclusive individual, apos cada renderizacao.
dom_fix='''<script id="v32-zero-estrella-dom">\n(function(){\n  var NAMES=["ESTRELLA GERAL","ESTRELLA ORIGINAL","ESTRELLA RGB"];\n  function txt(el){return String(el&&el.textContent||"").replace(/\\s+/g," ").trim().toUpperCase();}\n  function fix(){try{\n    document.querySelectorAll("table").forEach(function(table){\n      var rows=Array.from(table.rows||[]); if(!rows.length)return;\n      var heads=rows.filter(function(r){return Array.from(r.cells||[]).some(function(c){return NAMES.indexOf(txt(c))>=0;});});\n      if(!heads.length)return;\n      var header=heads[0], cells=Array.from(header.cells||[]), starts=[], pos=0;\n      cells.forEach(function(c){var span=parseInt(c.colSpan||1,10)||1; if(NAMES.indexOf(txt(c))>=0)starts.push({name:txt(c),start:pos}); pos+=span;});\n      starts.forEach(function(item){\n        var metaCol=item.start;\n        rows.slice(2).forEach(function(r){var cs=Array.from(r.cells||[]);if(cs[metaCol]){var t=txt(cs[metaCol]);if(t==="META"||t==="0"||/^\\d+(?:[.,]\\d+)?$/.test(t)||t==="—")cs[metaCol].textContent="0";}});\n      });\n      var last=rows[rows.length-1];\n      if(last){Array.from(last.cells||[]).forEach(function(c){if(/^\\d+(?:[.,]\\d+)?$/.test(txt(c))){} });}\n    });\n  }catch(e){}}\n  fix();\n  window.addEventListener("load",fix);\n  setTimeout(fix,100);setTimeout(fix,500);setTimeout(fix,1500);setTimeout(fix,3000);\n  try{new MutationObserver(function(){fix();}).observe(document.body,{childList:true,subtree:true});}catch(e){}\n})();\n</script>'''
if 'id="v32-zero-estrella-dom"' in s:
    s=re.sub(r'<script id="v32-zero-estrella-dom">.*?</script>',dom_fix,s,count=1,flags=re.S)
else:
    s=s.replace('</body>',dom_fix+'\n</body>',1)

# Atualiza o texto fixo visivel do cabecalho.
vis=f'Atualizada em {now.strftime("%d/%m/%Y às %H:%M")}'
s=re.sub(r'(Base atualizada em|Atualizada em)[^<]{0,100}',vis,s)

INDEX.write_text(s,encoding='utf-8')
print('OK - metas zeradas de forma definitiva, inclusive Estrella no geral/individual, e data/hora atualizada:',vis)
