(()=>{
'use strict';
const d=document,w=window;
const $=(s,r=d)=>r.querySelector(s), $$=(s,r=d)=>[...r.querySelectorAll(s)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const n=v=>Number(v||0);
const ALLOWED=new Set(['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios','premiacoes de incentivos']);

function getDash(){try{return w.eval('dash')}catch{try{return typeof dash!=='undefined'?dash:null}catch{return null}}}
function getTeam(){const x=getDash();return Array.isArray(x?.individual)?x.individual:[]}
function getCats(){const x=getDash();return Array.isArray(x?.team)?x.team:[]}

function css(){
 if(d.getElementById('admTeamRestructureStyle'))return;
 const s=d.createElement('style');s.id='admTeamRestructureStyle';s.textContent=`
.topicIncentivos{display:none!important}
#admQuickNav,#admQuickOverlay{display:none!important}
#app:not(.hide){padding-bottom:0!important}
#app.admSideReady>.wrap{padding-bottom:28px!important}

/* Visão da Equipe = mesma linguagem visual do link do consultor/Rogério */
#admConsultorView{position:fixed;inset:0;z-index:600;background:#f3f6f8;overflow:auto;color:#142236;font-family:Arial,sans-serif}
#admConsultorView[hidden]{display:none!important}
.acvTop{background:radial-gradient(circle at 18% 28%,rgba(255,95,95,.34),transparent 30%),radial-gradient(circle at 72% 72%,rgba(255,0,0,.18),transparent 32%),linear-gradient(118deg,#ff1717 0%,#d0000b 34%,#5c0004 68%,#050505 100%);color:#fff;padding:14px 18px;box-shadow:0 8px 24px rgba(80,0,0,.22);position:sticky;top:0;z-index:20}
.acvTopIn{width:min(1180px,100%);margin:auto;display:flex;align-items:center;gap:12px}
.acvBrand{min-width:0;flex:1}.acvBrand b{display:block;font-size:20px;font-weight:950}.acvBrand small{display:block;font-size:11px;color:#ffe5e8;margin-top:3px}
.acvSupervisor{background:#fff;color:#b4000b;border-radius:999px;padding:8px 12px;font-weight:950;font-size:12px;white-space:nowrap}
.acvBack{border:0;background:#202020;color:#fff;border-radius:12px;padding:10px 13px;font-weight:900;white-space:nowrap}
.acvWrap{width:min(1180px,calc(100% - 22px));margin:16px auto 72px;display:grid;gap:13px}
.acvHello{background:#fff;border:1px solid #e2e8ed;border-radius:18px;padding:13px 15px;box-shadow:0 5px 16px #172b400e;display:flex;align-items:center;gap:11px}
.acvAvatar{width:48px;height:48px;border-radius:50%;background:#e30613;display:grid;place-items:center;color:#fff;font-size:24px;flex:0 0 auto}
.acvHelloText{min-width:0;flex:1}.acvHelloText strong{font-size:20px;color:#172736}.acvHelloText small{display:block;margin-top:3px;color:#6d7985;font-weight:700;font-size:12px}
.acvRouteBox{min-width:270px}.acvRouteBox label{display:block;font-size:9px;font-weight:950;color:#607386;margin-bottom:4px;text-transform:uppercase}
.acvRoute{width:100%;height:42px;border-radius:11px;border:1px solid #d5dde4;background:#fff;color:#142236;padding:0 34px 0 11px;font-weight:900}
.acvMainGrid{display:grid;grid-template-columns:minmax(0,1.22fr) minmax(330px,.78fr);gap:14px}
.acvSearch{background:linear-gradient(135deg,#df0010,#bd000a 75%,#990006);border-radius:20px;padding:15px;color:#fff;box-shadow:0 9px 22px #c9001728;overflow:hidden}
.acvSearchTitle{display:flex;align-items:center;gap:10px}.acvSearchIcon{width:48px;height:48px;border-radius:13px;background:#ffffff18;display:grid;place-items:center;font-size:26px;flex:0 0 auto}
.acvSearchTitle b{font-size:24px}.acvSearchTitle small{display:block;color:#ffe4e7;font-size:11px;margin-top:2px}
.acvSearchRow{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px}.acvSearchRow input{min-width:0;width:100%;box-sizing:border-box;background:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:15px;color:#172736}.acvSearchRow button{border:0;border-radius:12px;background:#fff;color:#d0000d;font-weight:950;padding:0 18px}
.acvPvControls{margin-top:11px;background:#ffffff13;border:1px solid #ffffff35;border-radius:14px;padding:10px}.acvPvLabel{font-size:12px;font-weight:900;margin-bottom:8px}.acvDays{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.acvDay{height:35px;border:1px solid #ffffff45;background:#ffffff12;color:#fff;border-radius:8px;font-size:10px;font-weight:900}.acvDay.on{background:#fff;color:#d0000d}
.acvList{width:100%;margin-top:8px;border:0;border-radius:10px;padding:10px;background:#202020;color:#fff;font-weight:900}
.acvQuickBox{background:#fff;border:1px solid #e0e7ed;border-radius:19px;padding:13px;box-shadow:0 5px 16px #172b400e}
.acvSecTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 2px 10px}.acvSecTitle h3{font-size:20px;margin:0}.acvSecTitle small{font-size:11px;color:#6f7d89}
.acvActions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.acvAct{min-height:95px;border:1px solid #dfe6ec;border-radius:17px;background:#fff;padding:13px;text-align:left;font-weight:900;color:#152738;box-shadow:0 4px 12px #172b400b}
.acvAct .ic{width:40px;height:40px;border-radius:12px;background:#fff0f1;display:grid;place-items:center;font-size:21px;margin-bottom:8px}.acvAct.blue .ic{background:#e9f3ff}.acvAct.green .ic{background:#e8f8ef}.acvAct.orange .ic{background:#fff0df}
.acvCarouselShell{position:relative!important;min-width:0!important;width:100%!important;max-width:100%!important;overflow:hidden!important}
.acvCarouselViewport{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x!important;overscroll-behavior-x:contain!important;scroll-behavior:smooth!important;scrollbar-width:none!important}
.acvCarouselViewport::-webkit-scrollbar{display:none!important}.acvCarousel:after{content:"";flex:0 0 28px;height:1px}
.acvCarousel{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;gap:9px!important;width:100%!important;min-width:100%!important;max-width:100%!important;overflow:visible!important;padding:2px 24px 12px 1px!important;scroll-snap-type:x proximity!important}
.acvCarouselNav{display:none}
.acvCat{box-sizing:border-box!important;flex:0 0 148px!important;width:148px!important;min-width:148px!important;max-width:148px!important;height:252px!important;border:0!important;border-radius:20px!important;padding:0 10px 12px!important;color:#fff!important;text-align:left!important;scroll-snap-align:start!important;position:relative!important;box-shadow:0 12px 24px rgba(18,31,45,.20)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;background:linear-gradient(165deg,#d50a18,#7a0007)!important}
.acvProd{position:absolute!important;left:0!important;right:0!important;top:0!important;height:142px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:10px!important;overflow:hidden!important;background:#fff!important}
.acvProd:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(245,247,250,.96));z-index:0}
.acvProd img{display:block!important;position:relative!important;z-index:1!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:122px!important;object-fit:contain!important;object-position:center!important}
.acvProd img[data-fit="logo"]{max-width:80%!important;max-height:96px!important;margin:auto!important}
.acvProd img[data-fit="bottle"]{max-width:92%!important;max-height:134px!important;filter:drop-shadow(0 5px 6px rgba(0,0,0,.14))!important}
.acvProd img[data-fit="wide"],.acvProd img[data-fit="photo"]{width:100%!important;height:100%!important;max-width:100%!important;max-height:122px!important;object-fit:contain!important}
.acvFallback{font-size:42px;position:relative;z-index:1}
.acvCat b{font-size:14px!important;line-height:1.05!important;display:block!important;text-transform:uppercase!important;margin-top:146px!important;min-height:31px!important;text-shadow:0 1px 2px rgba(0,0,0,.22)}
.acvCat small{display:block!important;margin-top:6px!important;color:#fff!important;font-size:10.5px!important;line-height:1.15!important}
.acvProgress{height:6px!important;border-radius:999px!important;background:rgba(255,255,255,.22)!important;overflow:hidden!important;margin-top:8px!important;margin-right:40px!important}.acvProgress i{display:block!important;height:100%!important;border-radius:inherit!important;background:rgba(255,255,255,.88)!important}
.acvArrow{position:absolute!important;right:9px!important;bottom:9px!important;width:34px!important;height:34px!important;border-radius:50%!important;background:#fff!important;color:#e30613!important;display:grid!important;place-items:center!important;font-size:25px!important;font-weight:900!important;box-shadow:0 4px 10px rgba(0,0,0,.18)!important}
.acvCat.acvTheme-blue{background:linear-gradient(160deg,#2563eb,#1e3a8a)!important}.acvCat.acvTheme-pink{background:linear-gradient(160deg,#ff3b8d,#c9005f)!important}.acvCat.acvTheme-black{background:linear-gradient(160deg,#30343a,#050505)!important}.acvCat.acvTheme-gold{background:linear-gradient(160deg,#ffc928,#c77a00)!important}.acvCat.acvTheme-brown{background:linear-gradient(160deg,#8d572e,#3d1f0d)!important}.acvCat.acvTheme-green{background:linear-gradient(160deg,#22a850,#075b29)!important}.acvCat.acvTheme-cyan{background:linear-gradient(160deg,#16a6e6,#0755b7)!important}.acvCat.acvTheme-purple{background:linear-gradient(160deg,#8b43e6,#4d1498)!important}.acvCat.acvTheme-navy{background:linear-gradient(160deg,#1f4f8f,#071b38)!important}.acvCat.acvTheme-orange{background:linear-gradient(160deg,#ff9a25,#e3420c)!important}.acvCat.acvTheme-red{background:linear-gradient(160deg,#f52633,#9e0009)!important}
.acvStats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.acvStat{background:#fff;border:1px solid #e1e7ed;border-radius:15px;padding:12px;box-shadow:0 4px 12px #172b4009}.acvStat span{font-size:9px;color:#607386;font-weight:950}.acvStat b{display:block;font-size:22px;margin-top:4px}
.acvResults{background:#fff;border:1px solid #e0e7ed;border-radius:18px;padding:13px;box-shadow:0 5px 15px #172b400d}.acvResultFilter{margin:0 0 12px;padding:12px;background:#fff;border:1px solid #dce3e8;border-radius:14px;display:grid;grid-template-columns:auto minmax(220px,360px);gap:12px;align-items:center}.acvResultFilter b{font-size:13px;color:#142236}.acvResultFilter small{display:block;font-size:10px;color:#6b7785;margin-top:2px}.acvResultFilter .acvRoute{width:100%}@media(max-width:700px){.acvResultFilter{grid-template-columns:1fr;gap:7px}}.acvTableWrap{overflow:auto;border:1px solid #dbe2e8;border-radius:12px}.acvTable{width:100%;border-collapse:collapse;min-width:720px}.acvTable th,.acvTable td{padding:11px 9px;border-bottom:1px solid #d9e1e7;text-align:center;font-size:12px}.acvTable thead th{background:#d90000!important;color:#fff!important;font-weight:950}.acvTable thead th:first-child{text-align:left}.acvTable tbody tr:nth-child(odd){background:#eaf3fa}.acvTable tbody tr:nth-child(even){background:#fff}.acvTable tbody td:first-child{text-align:left;font-weight:950;color:#14283a}.acvTable tbody td:nth-child(2){color:#0d5f95;font-weight:950}.acvTable tbody td:nth-child(3),.acvTable tbody td:nth-child(4),.acvTable tbody td:nth-child(5){color:#c8151d;font-weight:950}.good{color:#087249!important;font-weight:950}.bad{color:#c8151d!important;font-weight:950}
@media(max-width:900px){.acvActions{grid-template-columns:repeat(3,minmax(0,1fr))}.acvTopIn{flex-wrap:wrap}.acvBrand{flex-basis:calc(100% - 125px)}.acvSupervisor{order:3}.acvMainGrid{grid-template-columns:1fr}.acvHello{align-items:flex-start;flex-wrap:wrap}.acvRouteBox{width:100%;min-width:0}.acvStats{grid-template-columns:1fr 1fr}}
@media(max-width:520px){.acvActions{grid-template-columns:1fr}.acvWrap{width:calc(100% - 14px);margin-top:8px}.acvTop{padding:10px}.acvBrand b{font-size:16px}.acvBrand small{font-size:9px}.acvBack{font-size:11px;padding:8px 10px}.acvSupervisor{font-size:10px;padding:6px 9px}.acvSearchRow{grid-template-columns:1fr}.acvSearchRow button{padding:11px}.acvCat{flex-basis:148px;height:220px}.acvProd{height:118px}.acvSecTitle h3{font-size:18px}}

/* RESPONSIVO FINAL - celular retrato + desktop */
#admConsultorView,#admConsultorView *{box-sizing:border-box}
#admConsultorView{max-width:100vw;overflow-x:hidden}
.acvWrap{max-width:1180px;min-width:0}
.acvMainGrid,.acvSearch,.acvQuickBox,.acvResults,.acvHello,.acvCarouselShell,.acvCarousel{min-width:0;max-width:100%}
.acvSearch{width:100%;background:linear-gradient(135deg,#df0010,#bd000a 75%,#990006)!important}
.acvSearchRow{width:100%;max-width:100%;min-width:0}
.acvSearchRow input{min-width:0;max-width:100%;width:100%}
.acvPvControls{width:100%;max-width:100%;min-width:0;overflow:hidden}
.acvDays{width:100%;max-width:100%;min-width:0}
.acvDay{min-width:0;width:100%;padding:0}
.acvList{width:100%;max-width:100%}
.acvQuickBox{width:100%}
.acvActions{width:100%}
.acvAct{min-width:0;width:100%}
.acvCarousel{width:100%;max-width:100%;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch}
.acvResults{width:100%;overflow:hidden}
.acvTableWrap{max-width:100%;overflow-x:auto;overflow-y:hidden}
.acvTable{width:max-content;min-width:100%}
@media(min-width:901px){
  .acvWrap{width:min(1180px,calc(100% - 40px));margin:18px auto 72px}
  .acvMainGrid{grid-template-columns:minmax(0,1.25fr) minmax(320px,.75fr)}
  .acvSearch{align-self:stretch}
  .acvQuickBox{align-self:stretch}
  .acvActions{grid-template-columns:repeat(3,minmax(0,1fr))}
  .acvCarouselShell{padding:0 50px!important}
  .acvCarousel{gap:14px!important;padding:4px 8px 14px!important}
  .acvCat{flex:0 0 190px!important;width:190px!important;min-width:190px!important;max-width:190px!important;height:292px!important;padding:0 14px 15px!important;border-radius:22px!important}
  .acvProd{height:160px!important;padding:14px!important}
  .acvProd img{max-height:138px!important}.acvProd img[data-fit="logo"]{max-width:86%!important;max-height:118px!important}.acvProd img[data-fit="bottle"]{max-height:150px!important}.acvProd img[data-fit="wide"],.acvProd img[data-fit="photo"]{max-height:138px!important}
  .acvCat b{font-size:16px!important;margin-top:166px!important;min-height:36px!important}.acvCat small{font-size:12px!important}
  .acvCarouselNav{display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;transform:translateY(-50%)!important;width:40px!important;height:58px!important;border:0!important;border-radius:14px!important;background:#fff!important;color:#d50712!important;font-size:32px!important;font-weight:900!important;box-shadow:0 7px 18px rgba(20,35,50,.18)!important;z-index:5!important;cursor:pointer!important}
  .acvCarouselPrev{left:6px!important}.acvCarouselNext{right:6px!important}.acvCarouselNav:hover{background:#d50712!important;color:#fff!important}
}
@media(max-width:900px){
  .acvWrap{width:calc(100% - 16px);margin:10px auto 64px}
  .acvMainGrid{grid-template-columns:1fr}
  .acvHello{flex-direction:column;align-items:stretch}
  .acvHello>.acvAvatar{align-self:flex-start}
  .acvRouteBox{width:100%}
  .acvActions{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(orientation:portrait) and (max-width:700px){
  html,body{overflow-x:hidden!important}
  #admConsultorView{width:100vw;max-width:100vw}
  .acvTop{padding:9px 8px}
  .acvTopIn{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
  .acvBrand{min-width:0}
  .acvBrand b{font-size:15px;line-height:1.05;white-space:normal}
  .acvBrand small{font-size:9px;line-height:1.15}
  .acvSupervisor{grid-column:1/2;justify-self:start;font-size:9px;padding:6px 8px}
  .acvBack{grid-column:2/3;grid-row:1/3;align-self:center;font-size:10px;padding:8px 9px}
  .acvWrap{width:calc(100vw - 12px);max-width:calc(100vw - 12px);margin:7px auto 58px;gap:9px}
  .acvHello{width:100%;max-width:100%;padding:10px 11px;display:grid;grid-template-columns:44px minmax(0,1fr);gap:9px}
  .acvAvatar{width:44px;height:44px;font-size:21px}
  .acvHelloText{min-width:0}
  .acvHelloText strong{font-size:18px;white-space:nowrap}
  .acvHelloText small{font-size:11px}
  .acvRouteBox{grid-column:1/-1;width:100%;min-width:0}
  .acvRoute{width:100%;min-width:0;max-width:100%}
  .acvMainGrid{width:100%;max-width:100%;display:block}
  .acvSearch{width:100%;max-width:100%;padding:12px;border-radius:18px;overflow:hidden}
  .acvSearchTitle{min-width:0}
  .acvSearchTitle>div:last-child{min-width:0}
  .acvSearchTitle b{font-size:20px;white-space:nowrap}
  .acvSearchTitle small{font-size:10px;white-space:normal}
  .acvSearchRow{display:block;width:100%;max-width:100%;overflow:hidden}
  .acvSearchRow input{display:block;width:100%;max-width:100%;min-width:0;height:46px;padding:10px 12px;font-size:14px}
  .acvSearchRow button{display:block;width:100%;max-width:100%;margin-top:7px;padding:10px 12px}
  .acvPvControls{margin-top:9px;padding:9px}
  .acvDays{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px}
  .acvDay{height:34px;font-size:9px;border-radius:7px}
  .acvList{margin-top:7px;padding:10px;font-size:12px}
  .acvQuickBox{margin-top:9px;width:100%;max-width:100%;padding:11px}
  .acvActions{grid-template-columns:1fr!important;gap:8px}
  .acvAct{min-height:74px;padding:11px;font-size:13px}
  .acvAct .ic{width:36px;height:36px;font-size:19px;margin-bottom:6px}
  .acvSecTitle h3{font-size:18px}
  .acvSecTitle small{font-size:10px}
  .acvCarouselShell{width:100%!important;max-width:100%!important;overflow:visible!important;padding:0!important}
  .acvCarouselViewport{width:100%!important;max-width:100%!important;overflow-x:scroll!important;overflow-y:hidden!important;touch-action:pan-x!important}
  .acvCarousel{width:100%!important;min-width:100%!important;max-width:100%!important;padding:2px 24px 12px 1px!important;gap:9px!important}
  .acvCat{flex:0 0 148px!important;width:148px!important;min-width:148px!important;max-width:148px!important;height:252px!important}
  .acvProd{height:142px!important}
  .acvCat b{font-size:13px}
  .acvStats{grid-template-columns:1fr 1fr;gap:7px}
  .acvStat{padding:10px}
  .acvStat b{font-size:19px}
  .acvResults{padding:10px;border-radius:16px}
  .acvTableWrap{width:100%;max-width:100%;overflow-x:auto}
}

/* HARD RESET DE VIEWPORT - impede qualquer estouro horizontal */
#admConsultorView .acvWrap>*{min-width:0!important;max-width:100%!important;width:100%!important}
#admConsultorView .acvIncentivesSection{min-width:0!important;max-width:100%!important;width:100%!important;overflow:hidden!important}

html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#admConsultorView{inset:0!important;width:100vw!important;max-width:100vw!important;min-width:0!important;overflow-x:hidden!important}
#admConsultorView .acvTop{width:100%!important;max-width:100vw!important}
#admConsultorView .acvTopIn{width:min(1180px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;min-width:0!important}
#admConsultorView .acvWrap{width:min(1180px,calc(100vw - 24px))!important;max-width:calc(100vw - 24px)!important;min-width:0!important;margin-left:auto!important;margin-right:auto!important}
#admConsultorView .acvMainGrid{display:grid!important;width:100%!important;max-width:100%!important;min-width:0!important;grid-template-columns:minmax(0,1fr) minmax(300px,390px)!important}
#admConsultorView .acvSearch,#admConsultorView .acvQuickBox{width:100%!important;max-width:100%!important;min-width:0!important}
#admConsultorView .acvSearchRow{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;width:100%!important;max-width:100%!important;min-width:0!important}
#admConsultorView .acvSearchRow input{width:100%!important;max-width:100%!important;min-width:0!important}
#admConsultorView .acvPvControls,#admConsultorView .acvDays{width:100%!important;max-width:100%!important;min-width:0!important}
#admConsultorView .acvDays{grid-template-columns:repeat(5,minmax(0,1fr))!important}
#admConsultorView .acvDay{width:100%!important;min-width:0!important;max-width:100%!important}
#admConsultorView .acvList{width:100%!important;max-width:100%!important}
#admConsultorView .acvCarouselShell{width:100%!important;max-width:100%!important;min-width:0!important}
#admConsultorView .acvCarouselViewport{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scroll-behavior:smooth!important;touch-action:pan-x!important;overscroll-behavior-x:contain!important}
#admConsultorView .acvCarousel{display:flex!important;flex-flow:row nowrap!important;width:100%!important;min-width:100%!important;max-width:100%!important;overflow:visible!important}
@media(max-width:900px){
 #admConsultorView .acvWrap{width:calc(100vw - 12px)!important;max-width:calc(100vw - 12px)!important}
 #admConsultorView .acvTopIn{width:calc(100vw - 16px)!important;max-width:calc(100vw - 16px)!important}
 #admConsultorView .acvMainGrid{display:block!important;width:100%!important;max-width:100%!important}
 #admConsultorView .acvSearch{display:block!important;margin:0!important}
 #admConsultorView .acvQuickBox{display:block!important;margin-top:9px!important}
 #admConsultorView .acvSearchRow{display:block!important}
 #admConsultorView .acvSearchRow button{display:block!important;width:100%!important;margin-top:7px!important;padding:11px!important}
 #admConsultorView .acvDays{grid-template-columns:repeat(5,minmax(0,1fr))!important}
 #admConsultorView .acvCarouselShell{padding:0!important;overflow:visible!important}
 #admConsultorView .acvCarouselViewport{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:scroll!important;overflow-y:hidden!important;touch-action:pan-x!important;-webkit-overflow-scrolling:touch!important}
 #admConsultorView .acvCarouselNav{display:none!important}
}
`;d.head.appendChild(s);
}

function getCardLabel(card){return norm(card.querySelector('b')?.textContent||card.textContent)}
function patchHome(){
 const home=d.getElementById('cokeHome');if(!home)return;
 home.querySelector('.topicIncentivos')?.remove();
 const vendas=home.querySelector('.topicVendas .menuGrid');if(!vendas)return;
 $$('.menuCard',vendas).forEach(card=>{if(!ALLOWED.has(getCardLabel(card)))card.remove()});
 let team=$$('.menuCard',vendas).find(c=>getCardLabel(c)==='visao da equipe');
 if(!team){
   team=d.createElement('button');team.type='button';team.className='menuCard';team.id='admTeamViewCard';
   team.innerHTML='<span class="mi" style="background:#e30613">👥</span><span><b>Visão da Equipe</b><small>Abrir a visão completa no padrão do consultor</small></span>';
   vendas.insertBefore(team,vendas.firstChild);
 }
 team.onclick=openView;
 const order=['visao da equipe','atualizar vendas','acoes vigentes','contratos','relatorios','premiacoes de incentivos'];
 const cards=$$('.menuCard',vendas),sorted=[...cards].sort((a,b)=>order.indexOf(getCardLabel(a))-order.indexOf(getCardLabel(b)));
 if(cards.some((x,i)=>x!==sorted[i]))sorted.forEach(x=>vendas.appendChild(x));
}
function patchSidebar(){
 const nav=d.getElementById('admSideNav');if(!nav)return;
 $$('.admTopic',nav).forEach(g=>{const t=norm(g.querySelector('.admTopicHead')?.dataset.topic||g.querySelector('.admTopicHead')?.textContent);if(t.includes('incentivos'))g.remove()});
}
function productMeta(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('IMPERDO')&&(s.includes('SSRD')||s.includes('SSD')))return{img:'../assets/incentivos/imperdoaveis-ssrd.webp?v=20261017-imp-v34',theme:'red',fit:'logo'};
 if(s.includes('IMPERDO')&&(s.includes('STILL')||s.includes('ESTILO')))return{img:'../assets/incentivos/imperdoaveis-still.webp?v=20261017-imp-v35',theme:'blue',fit:'logo'};
 if(s.includes('IMPERDO')&&s.includes('ARTD'))return{img:'../assets/incentivos/imperdoaveis-artd.webp?v=20261017-imp-v35',theme:'black',fit:'logo'};
 if(s.includes('PERFETTI'))return{img:'../assets/incentivos/perfetti.svg?v=20261017-v28',theme:'blue',fit:'logo'};
 if(s.includes('FINI'))return{img:'../assets/incentivos/fini.svg?v=20261017-v28',theme:'pink',fit:'logo'};
 if(s.includes('BLACK LABEL'))return{img:'../assets/incentivos/v27/white-horse.webp?v=20261017-v28',theme:'black',fit:'logo'};
 if(s.includes('WHITE HORSE'))return{img:'../assets/incentivos/v27/black-label.webp?v=20261017-v28',theme:'gold',fit:'logo'};
 if(s.includes('OLD PARR'))return{img:'../assets/incentivos/v27/trio-pao-de-queijo.webp?v=20261017-v28',theme:'brown',fit:'logo'};
 if(s.includes('FRUT')||s.includes('DEL VALLE'))return{img:'../assets/incentivos/del-valle-frut.svg?v=20261017-v28',theme:'green',fit:'logo'};
 if(s.includes('ESTRELLA'))return{img:'../assets/incentivos/v27/estrella.webp?v=20261017-v28',theme:'red',fit:'photo'};
 if(s.includes('PÃO DE QUEIJO')||s.includes('PAO DE QUEIJO'))return{img:'../assets/incentivos/v27/old-parr.webp?v=20261017-v28',theme:'red',fit:'photo'};
 if(s.includes('TANQUERAY'))return{img:'../assets/incentivos/v27/aperol.webp?v=20261017-v28',theme:'green',fit:'logo'};
 if(s.includes('RECOMPRA')&&s.includes('B2B'))return{img:'../assets/incentivos/b2b-recompra.svg?v=20261017-b2b-v33',theme:'purple',fit:'logo'};
 if(s.includes('B2B'))return{img:'../assets/incentivos/b2b.svg?v=20261017-b2b-v31',theme:'cyan',fit:'logo'};
 if(s.includes('CAMPARI'))return{img:'../assets/incentivos/campari.svg?v=20261017-v28',theme:'navy',fit:'logo'};
 if(s.includes('APEROL'))return{img:'../assets/incentivos/aperol.svg?v=20261017-aperol-v30',theme:'orange',fit:'logo'};
 return{img:'',theme:'red',fit:'logo'};
}
function icon(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('FINI'))return '🍬';if(s.includes('PERFETTI'))return '🍭';if(s.includes('PÃO DE QUEIJO')||s.includes('PAO DE QUEIJO'))return '🧀';
 if(s.includes('CERVEJA')||s.includes('ESTRELLA'))return '🍺';if(s.includes('B2B'))return '🛒';if(s.includes('IMPERDO'))return '🎯';
 if(s.includes('CAMPARI')||s.includes('LABEL')||s.includes('PARR'))return '🥃';if(s.includes('FANTA'))return '🍊';return '🏆';
}
function options(){
 return '<option value="TEAM">👥 Toda a Equipe</option>'+getTeam().map(x=>'<option value="'+E(x.rota)+'">👤 '+E(x.rota)+' - '+E(x.nome||'Consultor')+'</option>').join('');
}
function rowsFor(route){
 const clean=a=>(a||[]).filter(x=>!norm(x?.nome).includes('imperdo')).map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
 if(route==='TEAM')return clean(getCats());
 const p=getTeam().find(x=>String(x.rota)===route);
 return clean(p?.resultados);
}
function ensureView(){
 let v=d.getElementById('admConsultorView');if(v)return v;
 css();v=d.createElement('section');v.id='admConsultorView';v.hidden=true;
 v.innerHTML='<header class="acvTop"><div class="acvTopIn"><div class="acvBrand"><b>COBERTURAS • EQUIPE ITURAMA</b><small>Painel do Supervisor • Visão da Equipe</small></div><span class="acvSupervisor">Leandro • Supervisor</span><button type="button" id="acvBack" class="acvBack">← Voltar ao DM</button></div></header><main class="acvWrap"><section class="acvHello"><div class="acvAvatar">👤</div><div class="acvHelloText"><strong>Olá, Leandro</strong><small>Bora conquistar mais hoje! 🚀</small></div><div class="acvRouteBox"><label>Visualizar</label><select id="acvRoute" class="acvRoute"></select></div></section><section class="acvMainGrid"><div class="acvSearch"><div class="acvSearchTitle"><div class="acvSearchIcon">🔎</div><div><b>Pesquisa de PV</b><small>Pesquise PV, cliente ou razão social</small></div></div><div class="acvSearchRow"><input id="acvPv" inputmode="numeric" placeholder="Digite o PV do cliente"><button type="button" id="acvSearchBtn">Pesquisar ›</button></div><div class="acvPvControls"><div class="acvPvLabel">📍 Escolha o dia da visita</div><div class="acvDays">'+['SEG','TER','QUA','QUI','SEX'].map(x=>'<button type="button" class="acvDay" data-day="'+x+'">'+x+'</button>').join('')+'</div><button type="button" id="acvListDay" class="acvList">Listar clientes do dia ▾</button></div></div><div class="acvQuickBox"><div class="acvSecTitle"><h3>Acesso rápido</h3><small>Ferramentas da equipe</small></div><div class="acvActions"><button type="button" class="acvAct blue" data-act="visitas"><span class="ic">📅</span>Visita de Clientes</button><button type="button" class="acvAct green" data-act="subcanais"><span class="ic">🏪</span>Subcanais</button><button type="button" class="acvAct orange" data-act="contatos"><span class="ic">📞</span>Contato dos Clientes</button></div></div></section><section class="acvIncentivesSection"><div class="acvSecTitle"><h3>Coberturas dos Incentivos</h3><small>↔ arraste para o lado</small></div><div class="acvCarouselShell"><button type="button" class="acvCarouselNav acvCarouselPrev" aria-label="Voltar incentivos">‹</button><div class="acvCarouselViewport"><div id="acvCats" class="acvCarousel"></div></div><button type="button" class="acvCarouselNav acvCarouselNext" aria-label="Avançar incentivos">›</button></div></section><section class="acvResultFilter"><div><b>Visualizar resultado</b><small>Escolha Toda a Equipe ou um consultor individual.</small></div><select id="acvResultRoute" class="acvRoute" aria-label="Selecionar resultado da equipe ou consultor"></select></section><section class="acvResults"><div class="acvSecTitle"><div><h3 id="acvResultTitle">Resultado da Equipe por incentivo</h3><small id="acvResultHint">Selecione um incentivo para visualizar os resultados.</small></div></div><div id="acvResultBody"></div></section></main>';
 d.body.appendChild(v);
 $('#acvBack').onclick=closeView;
 $('#acvRoute').onchange=()=>{const r=d.getElementById('acvResultRoute');if(r)r.value=$('#acvRoute').value;renderView()};
 $('#acvResultRoute').onchange=()=>{const top=d.getElementById('acvRoute');if(top)top.value=$('#acvResultRoute').value;renderView()};
 $('#acvSearchBtn').onclick=searchPv;
 $('#acvPv').onkeydown=e=>{if(e.key==='Enter')searchPv()};
 $$('.acvDay',v).forEach(b=>b.onclick=()=>{$$('.acvDay',v).forEach(x=>x.classList.remove('on'));b.classList.add('on');try{sessionStorage.setItem('pv_dia_visita',b.dataset.day)}catch{}});
 $('#acvListDay').onclick=()=>openAdminFeature('Visita de Clientes');
 const cv=$('.acvCarouselViewport',v),prev=$('.acvCarouselPrev',v),next=$('.acvCarouselNext',v);
 const moveCarousel=dir=>{
   if(!cv)return;
   const max=Math.max(0,cv.scrollWidth-cv.clientWidth);
   const card=cv.querySelector('.acvCat');
   const step=card?Math.max(170,card.getBoundingClientRect().width+14):Math.max(260,Math.floor(cv.clientWidth*.7));
   const target=Math.max(0,Math.min(max,cv.scrollLeft+(dir*step*2)));
   try{cv.scrollTo({left:target,behavior:'smooth'})}catch{cv.scrollLeft=target}
   requestAnimationFrame(()=>{if(Math.abs(cv.scrollLeft-target)>4)cv.scrollLeft=target});
 };
 if(prev)prev.onclick=e=>{e.preventDefault();e.stopPropagation();moveCarousel(-1)};
 if(next)next.onclick=e=>{e.preventDefault();e.stopPropagation();moveCarousel(1)};
 let dragging=false,startX=0,startLeft=0;
 cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;startX=e.clientX;startLeft=cv.scrollLeft;try{cv.setPointerCapture(e.pointerId)}catch{}}});
 cv.addEventListener('pointermove',e=>{if(!dragging)return;cv.scrollLeft=startLeft-(e.clientX-startX)});
 const stop=()=>{dragging=false};cv.addEventListener('pointerup',stop);cv.addEventListener('pointercancel',stop);cv.addEventListener('pointerleave',stop);
 $$('.acvAct',v).forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='visitas')openAdminFeature('Visita de Clientes');if(a==='subcanais')openAdminFeature('Subcanais');if(a==='contatos')openAdminFeature('Contato dos Clientes')});
 return v;
}
function openAdminFeature(label){
 closeView();
 try{w.cokeNav?.(label)}catch{}
}
function searchPv(){
 const val=$('#acvPv')?.value.trim()||'';
 closeView();
 try{w.cokeNav?.('Pesquisar PV')}catch{}
 setTimeout(()=>{
   const input=d.getElementById('pvBusca')||d.querySelector('#pesquisa input');
   if(input){input.value=val;try{if(val&&typeof w.pesquisarPV==='function')w.pesquisarPV()}catch{}}
 },220);
}
function openView(){
 const v=ensureView();v.hidden=false;
 const sel=$('#acvRoute'),rsel=$('#acvResultRoute');sel.innerHTML=options();sel.value='TEAM';if(rsel){rsel.innerHTML=options();rsel.value='TEAM'}
 const saved=(sessionStorage.getItem('pv_dia_visita')||'SEG').toUpperCase();$$('.acvDay',v).forEach(x=>x.classList.toggle('on',x.dataset.day===saved));
 renderView();try{w.scrollTo(0,0)}catch{}
}
function closeView(){const v=d.getElementById('admConsultorView');if(v)v.hidden=true;try{w.show?.()}catch{}try{w.scrollTo(0,0)}catch{}}
function renderView(cat){
 const v=ensureView();if(v.hidden)return;
 const sel=$('#acvRoute');if(!sel.options.length)sel.innerHTML=options();
 const route=sel.value||'TEAM',rows=rowsFor(route),team=getTeam();
 const rsel=d.getElementById('acvResultRoute');if(rsel){const current=rsel.value;rsel.innerHTML=options();rsel.value=[...rsel.options].some(o=>o.value===route)?route:(current||'TEAM')}
 const person=route==='TEAM'?null:team.find(x=>String(x.rota)===route);

 $('#acvCats').innerHTML=rows.map(x=>{const p=x.meta?Math.min(100,Math.round(x.realizado/x.meta*100)):0,pm=productMeta(x.nome);return '<button class="acvCat acvTheme-'+pm.theme+'" type="button" data-cat="'+E(x.nome)+'"><span class="acvProd">'+(pm.img?'<img loading="eager" decoding="async" referrerpolicy="no-referrer" data-fit="'+(pm.fit||'logo')+'" src="'+pm.img+'" alt="">':'<span class="acvFallback">'+icon(x.nome)+'</span>')+'</span><b>'+E(x.nome)+'</b><small>'+x.realizado+' / '+x.meta+' realizados</small><span class="acvProgress"><i style="width:'+p+'%"></i></span><span class="acvArrow">›</span></button>'}).join('');
 $$('.acvCat',$('#acvCats')).forEach(b=>b.onclick=()=>renderResult(b.dataset.cat));
 $('#acvResultTitle').textContent=route==='TEAM'?'Resultado da Equipe por incentivo':'Resultado de '+(person?.nome||route)+' por incentivo';
 $('#acvResultHint').textContent=route==='TEAM'?'Selecione um incentivo para visualizar os resultados de toda a equipe.':'Visualizando '+route+' - '+(person?.nome||'Consultor')+'.';
 renderResult(cat||'');
}
function renderResult(cat){
 const route=$('#acvRoute')?.value||'TEAM',team=getTeam(),cats=getCats().filter(x=>!norm(x?.nome).includes('imperdo'));
 const body=$('#acvResultBody');if(!body)return;
 let rows=[];
 if(route==='TEAM'){
   rows=cats.filter(x=>!cat||x.nome===cat).map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
 }else{
   const p=team.find(x=>String(x.rota)===route);
   rows=(p?.resultados||[]).filter(x=>!norm(x?.nome).includes('imperdo')).filter(x=>!cat||x.nome===cat).map(x=>({nome:x.nome,meta:n(x.meta),realizado:n(x.realizado),falta:n(x.falta),percentual:n(x.percentual)}));
 }
 body.innerHTML='<div class="acvTableWrap"><table class="acvTable"><thead><tr><th>Incentivo</th><th>Meta</th><th>Realizado</th><th>Falta</th><th>%</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+E(x.nome)+'</td><td>'+n(x.meta)+'</td><td>'+n(x.realizado)+'</td><td>'+n(x.falta)+'</td><td>'+n(x.percentual)+'%</td></tr>').join('')+'</tbody></table></div>';
}
function sweep(){
 css();d.getElementById('admQuickNav')?.remove();d.getElementById('admQuickOverlay')?.remove();patchHome();patchSidebar();
}
let tries=0;const timer=setInterval(()=>{sweep();if(++tries>90)clearInterval(timer)},500);
let liveSig='';
setInterval(()=>{
 const v=d.getElementById('admConsultorView');
 if(!v||v.hidden)return;
 const x=getDash();
 const sig=x?JSON.stringify([(x.consultores||[]).map(a=>[a.rota,a.nome]),(x.team||[]).filter(a=>!norm(a?.nome).includes('imperdo')).map(a=>[a.nome,a.meta,a.realizado]),(x.individual||[]).map(a=>[a.rota,(a.resultados||[]).filter(r=>!norm(r?.nome).includes('imperdo')).map(r=>[r.nome,r.meta,r.realizado])])]):'';
 if(sig&&sig!==liveSig){
   liveSig=sig;
   const sel=d.getElementById('acvRoute'),old=sel?.value||'TEAM';
   if(sel){sel.innerHTML=options();sel.value=[...sel.options].some(o=>o.value===old)?old:'TEAM'}
   const rsel=d.getElementById('acvResultRoute');if(rsel){rsel.innerHTML=options();rsel.value=sel?.value||'TEAM'}
   renderView();
 }
},700);
w.addEventListener('pageshow',()=>setTimeout(sweep,250));
})();