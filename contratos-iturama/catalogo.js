const $=id=>document.getElementById(id);
let rotas=[];
const endpoint='https://harlrfhukjvhpufwhtep.supabase.co/functions/v1/';
async function post(api,data){const res=await fetch(endpoint+api,{method:'POST',headers:{'Content-Type':api==='consultor-api'?'text/plain;charset=UTF-8':'application/json'},body:JSON.stringify(data)});const j=await res.json();if(!res.ok||j.error)throw Error(j.error||'Erro ao entrar');return j}
$('entrar').onclick=async()=>{ $('aviso').textContent='Verificando acesso...';try{
const login=await post('consultor-api',{action:'login',matricula:$('mat').value.trim(),senha:$('senha').value});
if(!login.token)throw Error('Sessão não recebida');
if(login.perfil==='consultor')rotas=[String(login.consultor?.rota||'').toUpperCase()];
else {const team=await post('contratos-api',{action:'team_init',token:login.token});rotas=(team.routes||[]).map(x=>x.rota)}
if(!CONTRATOS.some(x=>rotas.includes(x[0])))throw Error('Nenhuma rota liberada para esta conta');
$('login').classList.add('hide');$('pastas').classList.remove('hide');$('aviso').textContent='';mostrarPastas()
}catch(e){$('aviso').textContent=e.message}};
function mostrarPastas(){const rr=[...new Set(CONTRATOS.map(x=>x[0]))].filter(r=>rotas.includes(r));$('pastas').innerHTML='<h2>Pastas por rota</h2>'+rr.map(r=>'<button class="folder" data-r="'+r+'">📁 '+r+' – '+CONTRATOS.find(x=>x[0]===r)[1]+' ('+CONTRATOS.filter(x=>x[0]===r).length+' contratos)</button>').join('')+'<div id="conteudo"></div><button onclick="location.reload()">Sair</button>';document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>mostrarRota(b.dataset.r))}
function mostrarRota(r){$('conteudo').innerHTML='<h2>📂 Rota '+r+'</h2><input id="busca" placeholder="Pesquisar cliente ou PV"><div id="lista"></div>';$('busca').oninput=()=>listar(r);listar(r)}
function listar(r){const q=$('busca').value.toLowerCase();const list=CONTRATOS.filter(x=>x[0]===r&&(x[2].includes(q)||x[3].toLowerCase().includes(q)));$('lista').innerHTML=list.map(x=>'<article class="card"><h3>'+x[3]+'</h3><p>PV '+x[2]+'</p><details><summary>Ver exigências para fotografar</summary><ol>'+x[4].split(';').map(p=>'<li>'+p+'</li>').join('')+'</ol></details><button class="copiar" data-pv="'+x[2]+'">📋 Copiar todas as exigências</button></article>').join('')||'<p>Nenhum contrato encontrado.</p>';document.querySelectorAll('.copiar').forEach(b=>b.onclick=()=>copiar(b))}
async function copiar(b){const x=CONTRATOS.find(c=>c[2]===b.dataset.pv);const texto='CONTRATOS ITURAMA\nRota '+x[0]+' – '+x[1]+'\nCliente: '+x[3]+'\nPV: '+x[2]+'\n\nEXIGÊNCIAS PARA FOTOGRAFAR:\n'+x[4].split(';').map((p,i)=>(i+1)+'. '+p).join('\n')+'\n\nEnviar fotos no grupo para validação.';try{await navigator.clipboard.writeText(texto);b.textContent='✓ Copiado! Cole no WhatsApp'}catch(e){prompt('Copie as exigências:',texto)}}
