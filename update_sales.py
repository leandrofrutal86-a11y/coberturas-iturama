from pathlib import Path
import base64,bz2,json,re

INDEX=Path('index.html')
PARTS=sorted(Path('.').glob('data-update-part-*.txt'))
if not PARTS:
    raise SystemExit('Partes da nova planilha nao encontradas')

b=''.join(p.read_text().strip() for p in PARTS)
b += '='*((4-len(b)%4)%4)
vendas=json.loads(bz2.decompress(base64.b64decode(b)).decode('utf-8'))
if len(vendas)!=3962:
    raise SystemExit(f'Quantidade inesperada: {len(vendas)}')

s=INDEX.read_text(encoding='utf-8')

def matching(text,pos,op='{',cl='}'):
    depth=0; ins=False; esc=False
    for i in range(pos,len(text)):
        c=text[i]
        if ins:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c=='"': ins=False
        else:
            if c=='"': ins=True
            elif c==op: depth+=1
            elif c==cl:
                depth-=1
                if depth==0:return i
    return -1

m=re.search(r'const DATA = (\{)',s)
if not m: raise SystemExit('DATA nao encontrada')
start=m.start(1); end=matching(s,start)
vkey=s.find('"vendas":',start,end)
arr_start=s.find('[',vkey,end); arr_end=matching(s,arr_start,'[',']')
if vkey<0 or arr_start<0 or arr_end<0: raise SystemExit('array vendas nao encontrado')
vendas_json=json.dumps(vendas,ensure_ascii=False,separators=(',',':'))
s=s[:arr_start]+vendas_json+s[arr_end+1:]
s=re.sub(r"c\.baseVendasAtualizada='[^']*'","c.baseVendasAtualizada='EXPORT_20260904_004542(1).XLSX'",s)
s=re.sub(r"c\.source='[^']*'","c.source='EXPORT_20260904_004542(1).XLSX'",s)
s=re.sub(r"c\.updatedAt='[^']*'","c.updatedAt='2026-09-04'",s)

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
    byClient.forEach(rs=>{
      if(client(rs[0])==='1440002')return;
      const g1=rs.some(r=>['1918','1919'].includes(mat(r)));
      const g2=rs.some(r=>mat(r)==='1916');
      const g3=rs.some(r=>mat(r)==='1827');
      if(g1&&g2&&g3)complete.push(rs[0]);
    });
    return complete;
  }
  if(cat==='COBERTURA HEINEKEN') return rows.filter(r=>{
    const b=brand(r);
    return b==='BAVARIA'||b.includes('BAVARIA')||b==='EISENBAHN'||b.includes('EISENBAHN')||b==='KAISER'||b.includes('KAISER')||b==='SOL'||b.startsWith('SOL ');
  });
  const info=(typeof getCatInfo==='function'?getCatInfo()[cat]:{})||{};
  const tipo=String(info.tipo||'').toUpperCase();
  if(tipo==='CÓDIGO'||tipo==='CODIGO'){
    const codes=(info.valores||[]).map(v=>String(v).trim().replace(/^0+/,'')).filter(Boolean);
    return rows.filter(r=>codes.includes(mat(r)));
  }
  if(tipo==='MARCA'&&(info.valores||[]).length){
    const brands=(info.valores||[]).map(v=>String(v).toUpperCase().trim()).filter(Boolean);
    return rows.filter(r=>brands.some(b=>brand(r).includes(b)));
  }
  return [];
}'''
s,n=re.subn(r'function categoryRows\(rota, cat\)\{.*?\n\}\nfunction uniqueClientsForCategory',new_fn+'\nfunction uniqueClientsForCategory',s,count=1,flags=re.S)
if n!=1: raise SystemExit('categoryRows nao encontrada')

# Zera metas na versao somente link e limpa valores antigos do navegador.
zero='''<script id="v31-static-final-zero">\n(function(){try{\nif(typeof DATA!=="undefined"&&DATA.metas){Object.keys(DATA.metas).forEach(function(k){DATA.metas[k]=0;});}\ntry{localStorage.removeItem("iturama_metas");}catch(e){}\nvar K="iturama_admin_completo_v2";var c=null;try{c=JSON.parse(localStorage.getItem(K)||"null");}catch(e){}\nif(c){c.metas=c.metas||{};Object.keys(c.metas).forEach(function(k){c.metas[k]=0;});localStorage.setItem(K,JSON.stringify(c));}\n}catch(e){}})();\n</script>'''
if 'id="v31-static-final-zero"' not in s:
    s=s.replace('</body>',zero+'\n</body>',1)

# Garante que o menu de administrador permaneça invisivel.
s=s.replace('#adminPanel,#modal,#adminFull,.admMenu{display:none!important}', '#adminPanel,#modal,#adminFull,.admMenu{display:none!important}')
INDEX.write_text(s,encoding='utf-8')
print('OK -',len(vendas),'registros inseridos')

for p in PARTS:
    p.unlink()
print('Partes temporarias removidas')
