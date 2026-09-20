(()=>{const $=id=>document.getElementById(id);function css(){const s=document.createElement('style');s.textContent=`
body{background:#eef2f5!important}
header{background:linear-gradient(135deg,#060606 0%,#171717 48%,#b40000 100%)!important;padding:20px 4%!important;border-bottom:4px solid #e30613}
header>b,header b{font-size:18px}
.cokeBrand{font-family:Georgia,serif;font-style:italic;font-weight:900;color:#e30613;font-size:30px;letter-spacing:-2px}
.tabs{display:none!important}.cokeHome{display:block}
.homeHero{background:linear-gradient(135deg,#090909,#191919 58%,#7b0000);border-radius:24px;padding:24px;color:#fff;box-shadow:0 14px 36px #0003;margin-bottom:18px}
.homeHeroTop{display:flex;justify-content:space-between;gap:16px;align-items:center}.homeHello{display:flex;gap:14px;align-items:center}
.homeAvatar{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#f11,#a80000);font-size:30px;box-shadow:0 8px 22px #0004}
.homeHero h1{margin:0;font-size:28px}.homeHero p{margin:5px 0 0;color:#ddd}.adminBadge{background:#fff;color:#c40000;border-radius:999px;padding:9px 14px;font-weight:900}
.homeStats{display:none!important}
.menuTopic{margin:18px 0 22px}.menuTopic:first-of-type{margin-top:4px}
.topicHead{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:0 2px}.topicIcon{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;color:#fff;font-size:19px;box-shadow:0 3px 9px #0002}.topicHead h2{font-size:19px;margin:0;color:#172534}.topicHead small{display:block;color:#73808b;font-size:11px;margin-top:2px}
.menuGrid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.menuCard{background:#fff;border:1px solid #e1e7ec;border-radius:17px;padding:15px;min-height:88px;display:flex;align-items:center;gap:13px;box-shadow:0 4px 14px #0000000d;cursor:pointer;text-align:left;width:100%}
.menuCard:hover{transform:translateY(-1px)}.mi{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;color:#fff;font-size:24px;flex:0 0 auto}
.menuCard b{display:block;font-size:16px;color:#172534}.menuCard small{display:block;color:#607080;margin-top:4px;font-size:11px;line-height:1.25}
.topicVendas .topicIcon{background:#0b63ce}.topicMetas .topicIcon{background:#16a35b}.topicIncentivos .topicIcon{background:#d97706}.topicConsultores .topicIcon{background:#6b3fc4}.topicInfo .topicIcon{background:#56616d}
.topicVendas{border-left:4px solid #0b63ce;padding-left:10px}.topicMetas{border-left:4px solid #16a35b;padding-left:10px}.topicIncentivos{border-left:4px solid #d97706;padding-left:10px}.topicConsultores{border-left:4px solid #6b3fc4;padding-left:10px}.topicInfo{border-left:4px solid #56616d;padding-left:10px}
.backHome{margin:0 0 14px;background:#fff;border:1px solid #d7dde4;color:#17212b;box-shadow:0 3px 10px #0001}
.secureNote{margin-top:16px;background:#eaf3ff;border-radius:16px;padding:15px;color:#1756a3;font-weight:700}
@media(max-width:780px){.menuGrid{grid-template-columns:1fr}.homeHeroTop{align-items:flex-start}.adminBadge{font-size:11px}.homeHero h1{font-size:23px}.menuTopic{margin:15px 0 20px}.topicHead h2{font-size:17px}.menuCard{min-height:76px;padding:12px}.mi{width:46px;height:46px;font-size:22px}.menuCard b{font-size:15px}.menuCard small{font-size:10.5px}}
`;document.head.appendChild(s)}function openContent(type,tries=0){if(typeof window.openConteudoAdmin==='function'){window.openConteudoAdmin(type);return}if(tries<30)setTimeout(()=>openContent(type,tries+1),120)}
function openMeta(target){const tryNav=()=>{const b=[...document.querySelectorAll('.tabs button')].find(x=>x.textContent.includes('Metas'));if(!b)return false;b.click();setTimeout(()=>{const sec=$('metas');if(!sec)return;if(target==='meta'){const h=[...sec.querySelectorAll('h2')].find(x=>x.textContent.includes('Alterar Meta'));(h?.closest('.box')||h)?.scrollIntoView({behavior:'smooth',block:'start'})}else sec.scrollIntoView({behavior:'smooth',block:'start'})},80);return true};if(!tryNav())setTimeout(tryNav,250)}
function nav(label){
 if(String(label)==='Histórico de Acesso'){const url=new URL('historico.html?v=20260920-who-accessed-02',window.location.href).href;try{window.top.location.assign(url)}catch{window.location.assign(url)}return}
 if(String(label)==='Ações Vigentes'){openContent('acoes_vigentes');return}
 if(String(label)==='Premiações de Incentivos'){openContent('premiacoes_incentivos');return}
 if(String(label)==='Atualizar Metas'){openMeta('meta');return}
 if(String(label)==='Metas e Categorias'){openMeta('categorias');return}
 const aliases={'Visão Consultor':'Visão do Consultor'};
 const wanted=aliases[String(label)]||String(label);
 const tryNav=()=>{const b=[...document.querySelectorAll('.tabs button')].find(x=>x.textContent.includes(wanted));if(b){b.click();setTimeout(addBack,0);return true}return false};if(!tryNav())setTimeout(tryNav,250)
}function addBack(){if($('cokeHome')&&!$('cokeHome').classList.contains('hide'))return;const wrap=document.querySelector('.wrap');if(!wrap||$('backHome'))return;const b=document.createElement('button');b.id='backHome';b.className='backHome';b.innerHTML='← Voltar ao menu administrativo';b.onclick=show;wrap.insertBefore(b,wrap.firstChild)}function removeBack(){$('backHome')?.remove()}function show(){['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasSubcanais','subcanaisPainel','contatosClientes','trioPaoQueijo','imperdoaveisAdmin','adminConteudos'].forEach(id=>{const e=$(id);if(e)e.classList.add('hide')});$('cokeHome')?.classList.remove('hide');removeBack()}function build(){if($('cokeHome'))return;const tabs=document.querySelector('.tabs');if(!tabs)return;const wrap=document.querySelector('.wrap');const sec=document.createElement('section');sec.id='cokeHome';sec.innerHTML=`<div class="homeHero"><div class="homeHeroTop"><div class="homeHello"><div class="homeAvatar">👤</div><div><div class="cokeBrand">Coca-Cola</div><h1>Bem-vindo, Leandro</h1><p>Supervisor • Equipe Iturama</p></div></div><span class="adminBadge">Administrador</span></div></div>

<div class="menuTopic topicVendas">
 <div class="topicHead"><span class="topicIcon">🛒</span><div><h2>Vendas</h2><small>Consulta, clientes e ações comerciais</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Pesquisar PV')"><span class="mi" style="background:#7b22d3">🔎</span><span><b>Pesquisar PV</b><small>Consulte clientes e coberturas</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Visão Consultor')"><span class="mi" style="background:#e30613">👤</span><span><b>Visão Consultor</b><small>Resultados e clientes por consultor</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Visita de Clientes')"><span class="mi" style="background:#0b63ce">📍</span><span><b>Visita de Clientes</b><small>Dias, sequência e frequência da rota</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Subcanais')"><span class="mi" style="background:#0d8f6a">🏪</span><span><b>Subcanais</b><small>Clientes e quantidades por perfil</small></span></button>
  <button class="menuCard" data-cmgr="acoes" onclick="window.cokeNav('Ações Vigentes')"><span class="mi" style="background:#e85d04">⚡</span><span><b>Ações Vigentes</b><small>Cadastrar e atualizar ações comerciais</small></span></button>
 </div>
</div>

<div class="menuTopic topicMetas">
 <div class="topicHead"><span class="topicIcon">🎯</span><div><h2>Metas</h2><small>Metas, acompanhamento e categorias</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Atualizar Metas')"><span class="mi" style="background:#16a35b">🎯</span><span><b>Atualizar Metas</b><small>Alterar meta por consultor e categoria</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Acompanhamento')"><span class="mi" style="background:#ff8a00">📈</span><span><b>Acompanhamento</b><small>Matriz de metas e realizados</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Metas e Categorias')"><span class="mi" style="background:#1687d9">🏷️</span><span><b>Metas e Categorias</b><small>Configurar categorias, marcas, códigos e regras</small></span></button>
 </div>
</div>

<div class="menuTopic topicIncentivos">
 <div class="topicHead"><span class="topicIcon">🏆</span><div><h2>Incentivos</h2><small>Acompanhamento e premiações</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Trio Pão de Queijo')"><span class="mi" style="background:#d97706">🥖</span><span><b>Trio Pão de Queijo</b><small>Vendidos e oportunidades por rota e dia</small></span></button>
  <button id="impAdminCard" class="menuCard"><span class="mi" style="background:#c90b13">🎯</span><span><b>Imperdoáveis</b><small>Visão geral, clientes e parâmetros</small></span></button>
  <button class="menuCard" data-cmgr="premios" onclick="window.cokeNav('Premiações de Incentivos')"><span class="mi" style="background:#c99700">🏆</span><span><b>Premiações de Incentivos</b><small>Cadastrar textos, imagens e premiações</small></span></button>
 </div>
</div>

<div class="menuTopic topicConsultores">
 <div class="topicHead"><span class="topicIcon">👥</span><div><h2>Atualização Consultores</h2><small>Cadastro e acesso da equipe</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Consultores')"><span class="mi" style="background:#6b3fc4">👥</span><span><b>Consultores</b><small>Gerenciar consultores, matrícula e acesso</small></span></button>
 </div>
</div>

<div class="menuTopic topicInfo">
 <div class="topicHead"><span class="topicIcon">ℹ️</span><div><h2>Informações</h2><small>Contatos, materiais e histórico</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Contato dos Clientes')"><span class="mi" style="background:#1687d9">📞</span><span><b>Contato dos Clientes</b><small>Telefones por rota e dia de visita</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Materiais')"><span class="mi" style="background:#7d1bd1">📚</span><span><b>Materiais de Apoio</b><small>Gerenciar imagens, PDFs e links</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Telefones')"><span class="mi" style="background:#14a85f">☎️</span><span><b>Telefones Úteis</b><small>Gerenciar contatos úteis</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Histórico de Acesso')"><span class="mi" style="background:#59636f">🕘</span><span><b>Histórico de Acesso</b><small>Início, fim e tempo de sessão</small></span></button>
 </div>
</div>

<div class="secureNote">🛡️ Acesso restrito • Alterações sincronizadas com a base online.</div>`;wrap.insertBefore(sec,tabs.nextSibling);window.cokeNav=nav;const oldAba=window.aba;if(oldAba)window.aba=function(id,b){$('cokeHome')?.classList.add('hide');const r=oldAba(id,b);setTimeout(addBack,0);return r};show()}css();setTimeout(build,120)})();