(()=>{const $=id=>document.getElementById(id);function css(){const s=document.createElement('style');s.textContent=`
body{background:#eef2f5!important}
header{background:linear-gradient(135deg,#060606 0%,#171717 48%,#b40000 100%)!important;padding:20px 4%!important;border-bottom:4px solid #e30613}
header>b,header b{font-size:18px}
.cokeBrand{font-family:Georgia,serif;font-style:italic;font-weight:900;color:#e30613;font-size:30px;letter-spacing:-2px}
.tabs{display:none!important}.cokeHome{display:block}
.homeHero{background:linear-gradient(135deg,#090909,#191919 58%,#7b0000);border-radius:26px;padding:24px;color:#fff;box-shadow:0 14px 36px #0003;margin-bottom:26px}
.homeHeroTop{display:flex;justify-content:space-between;gap:16px;align-items:center}.homeHello{display:flex;gap:14px;align-items:center}
.homeAvatar{width:82px;height:82px;border-radius:50%;display:block;flex:0 0 auto;background-image:url("data:image/jpeg;base64,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");background-size:cover;background-position:center center;background-repeat:no-repeat;border:4px solid #e30613;box-shadow:0 8px 22px #0005}
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