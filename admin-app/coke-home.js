(()=>{const $=id=>document.getElementById(id);function css(){const s=document.createElement('style');s.textContent=`
body{background:#eef2f5!important}
header{background:linear-gradient(135deg,#060606 0%,#171717 48%,#b40000 100%)!important;padding:20px 4%!important;border-bottom:4px solid #e30613}
header>b,header b{font-size:18px}
.cokeBrand{font-family:Georgia,serif;font-style:italic;font-weight:900;color:#e30613;font-size:30px;letter-spacing:-2px}
.tabs{display:none!important}.cokeHome{display:block}
.homeHero{background:linear-gradient(135deg,#090909,#191919 58%,#7b0000);border-radius:26px;padding:24px;color:#fff;box-shadow:0 14px 36px #0003;margin-bottom:26px}
.homeHeroTop{display:flex;justify-content:space-between;gap:16px;align-items:center}.homeHello{display:flex;gap:14px;align-items:center}
.homeAvatar{width:82px;height:82px;border-radius:50%;display:block;flex:0 0 auto;background-image:url("data:image/jpeg;base64,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");background-size:cover;background-position:center 38%;background-repeat:no-repeat;border:4px solid #e30613;box-shadow:0 8px 22px #0005}
.homeHero h1{margin:0;font-size:29px}.homeHero p{margin:5px 0 0;color:#ddd}.adminBadge{background:#fff;color:#c40000;border-radius:999px;padding:9px 14px;font-weight:900}
.homeStats{display:none!important}

.menuTopic{margin:24px 0 30px;padding:0!important;border:0!important}
.menuTopic:first-of-type{margin-top:6px}
.topicHead{display:flex;align-items:center;gap:15px;margin:0 0 15px;padding:16px 18px;border-radius:20px;box-shadow:0 7px 18px #00000017;border:1px solid #ffffff66;position:relative;overflow:hidden}
.topicHead:after{content:'';position:absolute;right:-28px;top:-32px;width:150px;height:150px;border-radius:50%;background:#ffffff1c}
.topicIcon{width:58px;height:58px;border-radius:16px;display:grid;place-items:center;color:#fff;font-size:29px;box-shadow:0 5px 13px #0003;flex:0 0 auto;position:relative;z-index:1}
.topicHead>div{position:relative;z-index:1}.topicHead h2{font-size:26px;line-height:1.04;margin:0;font-weight:950;color:#fff;text-shadow:0 1px 2px #0003}.topicHead small{display:block;color:#f7fbff;font-size:13px;font-weight:650;margin-top:5px;line-height:1.2}

.topicVendas .topicHead{background:linear-gradient(110deg,#1787ee,#0e67d5 68%,#0b57bd)}
.topicVendas .topicIcon{background:#075fc8}
.topicMetas .topicHead{background:linear-gradient(110deg,#22bd68,#0ea553 68%,#078740)}
.topicMetas .topicIcon{background:#078d47}
.topicIncentivos .topicHead{background:linear-gradient(110deg,#f3b400,#db9600 68%,#bd7900)}
.topicIncentivos .topicIcon{background:#a66b00}
.topicConsultores .topicHead{background:linear-gradient(110deg,#13b8c8,#079baa 68%,#087987)}
.topicConsultores .topicIcon{background:#087c89}
.topicInfo .topicHead{background:linear-gradient(110deg,#73879a,#596c7e 68%,#465766)}
.topicInfo .topicIcon{background:#415364}

.menuGrid{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.menuCard{position:relative;background:#fff;border:1px solid #dfe6ec;border-radius:21px;padding:16px 44px 16px 16px;min-height:94px;display:flex;align-items:center;gap:15px;box-shadow:0 6px 17px #00000012;cursor:pointer;text-align:left;width:100%;transition:transform .15s ease,box-shadow .15s ease}
.menuCard:after{content:'›';position:absolute;right:17px;top:50%;transform:translateY(-52%);font-size:31px;line-height:1;color:#637485;font-weight:300}
.menuCard:hover{transform:translateY(-2px);box-shadow:0 9px 22px #00000019}
.menuCard:active{transform:scale(.99)}
.mi{width:58px;height:58px;border-radius:17px;display:grid;place-items:center;color:#fff;font-size:29px;flex:0 0 auto;box-shadow:0 4px 10px #0002}
.menuCard b{display:block;font-size:17px;line-height:1.12;color:#172534;font-weight:900}
.menuCard small{display:block;color:#637280;margin-top:5px;font-size:12px;line-height:1.25;font-weight:600}

.backHome{margin:0 0 14px;background:#fff;border:1px solid #d7dde4;color:#17212b;box-shadow:0 3px 10px #0001}
.secureNote{margin-top:16px;background:#eaf3ff;border-radius:16px;padding:15px;color:#1756a3;font-weight:700}

@media(max-width:780px){
 .menuGrid{grid-template-columns:1fr}
 .homeHeroTop{align-items:flex-start}
 .homeAvatar{width:74px;height:74px;border-width:3px} .adminBadge{font-size:11px}
 .homeHero h1{font-size:25px}
 .menuTopic{margin:20px 0 27px}
 .topicHead{padding:15px 16px;margin-bottom:13px;border-radius:19px;gap:13px}
 .topicIcon{width:55px;height:55px;font-size:27px}
 .topicHead h2{font-size:24px}
 .topicHead small{font-size:12.5px;margin-top:4px}
 .menuGrid{gap:12px}
 .menuCard{min-height:88px;padding:14px 42px 14px 14px;border-radius:20px}
 .mi{width:56px;height:56px;font-size:27px}
 .menuCard b{font-size:17px}
 .menuCard small{font-size:11.5px}
 .menuCard:after{right:15px;font-size:29px}
}
`;document.head.appendChild(s)}function openContent(type,tries=0){if(typeof window.openConteudoAdmin==='function'){window.openConteudoAdmin(type);return}if(tries<30)setTimeout(()=>openContent(type,tries+1),120)}
function openMeta(target){const tryNav=()=>{const b=[...document.querySelectorAll('.tabs button')].find(x=>x.textContent.includes('Metas'));if(!b)return false;b.click();setTimeout(()=>{const sec=$('metas');if(!sec)return;if(target==='meta'){const h=[...sec.querySelectorAll('h2')].find(x=>x.textContent.includes('Alterar Meta'));(h?.closest('.box')||h)?.scrollIntoView({behavior:'smooth',block:'start'})}else sec.scrollIntoView({behavior:'smooth',block:'start'})},80);return true};if(!tryNav())setTimeout(tryNav,250)}
function nav(label){
 if(String(label)==='Pesquisar PV'){try{window.ensureAdminPvSearch?.()}catch{}setTimeout(()=>{try{window.ensureAdminPvSearch?.()}catch{}},120)}
 if(String(label)==='Histórico de Acesso'){const url=new URL('historico.html?v=20260920-who-accessed-02',window.location.href).href;try{window.top.location.assign(url)}catch{window.location.assign(url)}return}
 if(String(label)==='Ações Vigentes'){openContent('acoes_vigentes');return}
 if(String(label)==='Premiações de Incentivos'){openContent('premiacoes_incentivos');return}
 if(String(label)==='Atualizar Metas'){openMeta('meta');return}
 if(String(label)==='Metas e Categorias'){openMeta('categorias');return}
 const aliases={'Visão Consultor':'Visão do Consultor'};
 const wanted=aliases[String(label)]||String(label);
 const tryNav=()=>{const b=[...document.querySelectorAll('.tabs button')].find(x=>x.textContent.includes(wanted));if(b){b.click();setTimeout(addBack,0);return true}return false};if(!tryNav())setTimeout(tryNav,250)
}function addBack(){if($('cokeHome')&&!$('cokeHome').classList.contains('hide'))return;const wrap=document.querySelector('.wrap');if(!wrap||$('backHome'))return;const b=document.createElement('button');b.id='backHome';b.className='backHome';b.innerHTML='← Voltar ao menu administrativo';b.onclick=show;wrap.insertBefore(b,wrap.firstChild)}function removeBack(){$('backHome')?.remove()}function show(){['visao','equipe','acomp','pesquisa','metas','consultores','telefones','materiais','vendas','historico','visitasSubcanais','subcanaisPainel','contatosClientes','trioPaoQueijo','imperdoaveisAdmin','adminConteudos'].forEach(id=>{const e=$(id);if(e)e.classList.add('hide')});$('cokeHome')?.classList.remove('hide');removeBack();try{sessionStorage.removeItem('adm_force_home')}catch{}}function build(){if($('cokeHome'))return;const tabs=document.querySelector('.tabs');if(!tabs)return;const wrap=document.querySelector('.wrap');const sec=document.createElement('section');sec.id='cokeHome';sec.innerHTML=`<div class="homeHero"><div class="homeHeroTop"><div class="homeHello"><div class="homeAvatar" role="img" aria-label="Foto de Leandro"></div><div><div class="cokeBrand">Coca-Cola</div><h1>Bem-vindo, Leandro</h1><p>Supervisor • Equipe Iturama</p></div></div><span class="adminBadge">Administrador</span></div></div>

<div class="menuTopic topicVendas">
 <div class="topicHead"><span class="topicIcon">🛒</span><div><h2>Vendas</h2><small>Consulta, clientes e ações comerciais</small></div></div>
 <div class="menuGrid">
  <button class="menuCard" onclick="window.cokeNav('Pesquisar PV')"><span class="mi" style="background:#7b22d3">🔎</span><span><b>Pesquisar PV</b><small>Consulte clientes e coberturas</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Visão Consultor')"><span class="mi" style="background:#e30613">👤</span><span><b>Visão Consultor</b><small>Resultados e clientes por consultor</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Visita de Clientes')"><span class="mi" style="background:#0b63ce">📍</span><span><b>Visita de Clientes</b><small>Dias, sequência e frequência da rota</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Subcanais')"><span class="mi" style="background:#0d8f6a">🏪</span><span><b>Subcanais</b><small>Clientes e quantidades por perfil</small></span></button>
  <button class="menuCard" data-cmgr="acoes" onclick="window.cokeNav('Ações Vigentes')"><span class="mi" style="background:#e85d04">⚡</span><span><b>Ações Vigentes</b><small>Cadastrar e atualizar ações comerciais</small></span></button>
  <button class="menuCard" onclick="window.cokeNav('Atualizar Vendas')"><span class="mi" style="background:#2563eb">📊</span><span><b>Atualizar Vendas</b><small>Anexar planilha Excel e atualizar a base de vendas</small></span></button>
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

<div class="secureNote">🛡️ Acesso restrito • Alterações sincronizadas com a base online.</div>`;wrap.insertBefore(sec,tabs.nextSibling);window.cokeNav=nav;const oldAba=window.aba;if(oldAba)window.aba=function(id,b){$('cokeHome')?.classList.add('hide');const r=oldAba(id,b);setTimeout(addBack,0);return r};show()}css();setTimeout(build,120);window.addEventListener('pageshow',()=>{try{if(sessionStorage.getItem('adm_force_home')==='1')setTimeout(show,80)}catch{}})})();