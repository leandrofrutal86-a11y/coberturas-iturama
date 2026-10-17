(()=>{
'use strict';
const Q=s=>document.querySelector(s),QA=s=>[...document.querySelectorAll(s)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number(v||0);
function D(){try{return typeof DATA!=='undefined'?DATA:null}catch{return null}}

function productMeta(item){
 const name=typeof item==='object'?(item?.nome||''):item;
 if(item&&typeof item==='object'&&(item.imagem_card_url||item.cor_card))return{img:String(item.imagem_card_url||''),theme:'custom',fit:'logo',color:String(item.cor_card||'#e30613')};
 const s=String(name||'').toUpperCase();
 if(s.includes('IMPERDO')&&(s.includes('SSRD')||s.includes('SSD')))return{img:'assets/incentivos/imperdoaveis-ssrd.webp?v=20261017-imp-v34',theme:'red',fit:'logo'};
 if(s.includes('IMPERDO')&&(s.includes('STILL')||s.includes('ESTILO')))return{img:'assets/incentivos/imperdoaveis-still.webp?v=20261017-imp-v35',theme:'blue',fit:'logo'};
 if(s.includes('IMPERDO')&&s.includes('ARTD'))return{img:'assets/incentivos/imperdoaveis-artd.webp?v=20261017-imp-v35',theme:'black',fit:'logo'};
 if(s.includes('PERFETTI'))return{img:'assets/incentivos/perfetti.svg?v=20261017-v28',theme:'blue',fit:'logo'};
 if(s.includes('FINI'))return{img:'assets/incentivos/fini.svg?v=20261017-v28',theme:'pink',fit:'logo'};
 /* Os arquivos v27 foram gravados com alguns nomes cruzados. Aqui o mapeamento aponta para a imagem visual correta. */
 if(s.includes('BLACK LABEL'))return{img:'assets/incentivos/v27/white-horse.webp?v=20261017-v28',theme:'black',fit:'logo'};
 if(s.includes('WHITE HORSE'))return{img:'assets/incentivos/v27/black-label.webp?v=20261017-v28',theme:'gold',fit:'logo'};
 if(s.includes('OLD PARR'))return{img:'assets/incentivos/v27/trio-pao-de-queijo.webp?v=20261017-v28',theme:'brown',fit:'logo'};
 if(s.includes('FRUT')||s.includes('DEL VALLE'))return{img:'assets/incentivos/del-valle-frut.svg?v=20261017-v28',theme:'green',fit:'logo'};
 if(s.includes('ESTRELLA'))return{img:'assets/incentivos/v27/estrella.webp?v=20261017-v28',theme:'red',fit:'photo'};
 if(s.includes('PÃO DE QUEIJO')||s.includes('PAO DE QUEIJO'))return{img:'assets/incentivos/v27/old-parr.webp?v=20261017-v28',theme:'red',fit:'photo'};
 if(s.includes('TANQUERAY'))return{img:'assets/incentivos/v27/aperol.webp?v=20261017-v28',theme:'green',fit:'logo'};
 if(s.includes('RECOMPRA')&&s.includes('B2B'))return{img:'assets/incentivos/b2b-recompra.svg?v=20261017-b2b-v33',theme:'purple',fit:'logo'};
 if(s.includes('RECOMPRA')&&s.includes('B2B'))return{img:'assets/incentivos/b2b-recompra.svg?v=20261017-b2b-v31',theme:'purple',fit:'logo'};
 if(s.includes('B2B'))return{img:'assets/incentivos/b2b.svg?v=20261017-b2b-v31',theme:'cyan',fit:'logo'};
 if(s.includes('CAMPARI'))return{img:'assets/incentivos/campari.svg?v=20261017-v28',theme:'navy',fit:'logo'};
 if(s.includes('APEROL'))return{img:'assets/incentivos/aperol.svg?v=20261017-aperol-v30',theme:'orange',fit:'logo'};
 return{img:'',theme:'red',fit:'logo'};
}

function incentiveClass(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('PERFETTI'))return 'prod-perfetti';
 if(s.includes('FINI'))return 'prod-fini';
 if(s.includes('BLACK LABEL'))return 'prod-black';
 if(s.includes('WHITE HORSE'))return 'prod-whitehorse';
 if(s.includes('OLD PARR'))return 'prod-oldparr';
 if(s.includes('FRUT')||s.includes('DEL VALLE'))return 'prod-frut';
 if(s.includes('ESTRELLA'))return 'prod-estrella';
 if(s.includes('PÃO DE QUEIJO'))return 'prod-trio';
 if(s.includes('TANQUERAY'))return 'prod-tanqueray';
 if(s.includes('B2B'))return s.includes('RECOMPRA')?'prod-recompra':'prod-compra';
 if(s.includes('CAMPARI'))return 'prod-campari';
 if(s.includes('APEROL'))return 'prod-aperol';
 return 'prod-default';
}
function icon(name){
 const s=String(name||'').toUpperCase();
 if(s.includes('FINI'))return '🍬'; if(s.includes('PERFETTI'))return '🍭'; if(s.includes('PÃO DE QUEIJO'))return '🧀';
 if(s.includes('CERVEJA')||s.includes('ESTRELLA'))return '🍺'; if(s.includes('B2B'))return '🛒'; if(s.includes('IMPERDO'))return '🎯';
 if(s.includes('CAMPARI')||s.includes('LABEL')||s.includes('PARR'))return '🥃'; if(s.includes('SMIRNOFF'))return '🥤'; if(s.includes('FANTA'))return '🍊'; return '🏆';
}
function css(){
 if(document.getElementById('consultorModernFinal20261016'))return;
 const s=document.createElement('style');s.id='consultorModernFinal20261016';s.textContent=`
html,body{max-width:100%!important;overflow-x:hidden!important}
#dash{background:#f3f6f8!important;min-height:100vh;max-width:100vw!important;overflow-x:hidden!important}
#dash .wrap{box-sizing:border-box!important;width:100%!important;max-width:100vw!important;margin:0 auto 92px!important;padding:12px 14px 0!important;overflow-x:hidden!important;overflow-y:visible!important}
#dash .quick,#dash .summary,#dash .tools,#dash .mot{display:none!important}
#dash .top{box-sizing:border-box!important;width:100%!important;max-width:100vw!important;background:radial-gradient(circle at 18% 28%,rgba(255,95,95,.34),transparent 30%),radial-gradient(circle at 72% 72%,rgba(255,0,0,.18),transparent 32%),linear-gradient(118deg,#ff1717 0%,#d0000b 34%,#5c0004 68%,#050505 100%)!important;border:0!important;padding:11px 12px!important;box-shadow:0 8px 24px rgba(80,0,0,.22)!important;overflow:hidden!important;position:relative!important}
#dash .top:before{content:'';position:absolute;inset:0;background:linear-gradient(155deg,rgba(255,255,255,.10),transparent 28%),radial-gradient(circle at 15% 82%,rgba(255,255,255,.08),transparent 24%),linear-gradient(170deg,transparent 0 52%,rgba(255,0,0,.12) 60%,transparent 70%);pointer-events:none;z-index:0}#dash .topbar{width:100%!important;max-width:620px!important;margin:auto!important;min-height:64px!important;gap:8px!important}#dash .topbar{position:relative!important;z-index:1!important}
#dash .top .brand{min-width:0!important;overflow:hidden!important}
#dash .top .brand .logo,#dash .top .brand .vline{display:none!important}
#dash .top .brand>div:last-child:before{content:'COBERTURAS • EQUIPE ITURAMA';display:block;color:#fff;font-size:17px;font-weight:950;line-height:1.1;white-space:normal}
#dash .top .brand>div:last-child b{font-size:10px!important;color:#ffe5e8!important;font-weight:650!important}
#dash .top .brand>div:last-child b:before{content:'Painel do Consultor • '}
#dash .top .user{display:none!important}.cmSalesPeriod{position:absolute!important;right:12px!important;bottom:4px!important;z-index:3!important;color:#fff!important;font-size:10px!important;font-weight:800!important;line-height:1.15!important;background:#00000038!important;border:1px solid #ffffff30!important;border-radius:999px!important;padding:4px 8px!important;white-space:nowrap!important}.logout{background:#202020!important;border:0!important;border-radius:12px!important;padding:9px 12px!important;font-size:12px!important;flex:0 0 auto}
.cmHome{box-sizing:border-box!important;display:grid!important;gap:11px!important;width:auto!important;max-width:100%!important;min-width:0!important;margin:0!important;padding:0!important}
.cmHello{box-sizing:border-box;width:100%;background:#fff;border:1px solid #e2e8ed;border-radius:18px;padding:12px 14px;box-shadow:0 5px 16px #172b400e;display:flex;align-items:center;gap:11px}
.cmAvatar{width:46px;height:46px;border-radius:50%;background:#e30613;display:grid;place-items:center;color:#fff;font-size:23px;flex:0 0 auto}.cmHello strong{font-size:19px;color:#172736}.cmHello small{display:block;margin-top:3px;color:#6d7985;font-weight:700;font-size:12px}
.cmSearchHero{box-sizing:border-box!important;width:auto!important;max-width:100%!important;margin:0!important;background:linear-gradient(135deg,#df0010,#bd000a 75%,#990006);border-radius:20px;padding:14px;color:#fff;box-shadow:0 9px 22px #c9001728;overflow:hidden}
.cmSearchTitle{display:flex;align-items:center;gap:10px;margin-bottom:10px}.cmSearchIcon{width:46px;height:46px;border-radius:13px;background:#ffffff18;display:grid;place-items:center;font-size:25px;flex:0 0 auto}.cmSearchTitle b{font-size:23px}.cmSearchTitle small{display:block;color:#ffe4e7;font-size:11px;margin-top:2px}
.cmSearchRow{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}.cmSearchRow input{box-sizing:border-box!important;display:block!important;min-width:0!important;width:100%!important;max-width:100%!important;background:#fff!important;border:0!important;border-radius:12px!important;padding:12px 13px!important;font-size:14px!important;color:#172736!important;outline:0!important}.cmSearchRow button{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;background:#fff!important;color:#d0000d!important;-webkit-text-fill-color:#d0000d!important;border:0!important;border-radius:12px!important;padding:11px 10px!important;font-size:12px!important;font-weight:950!important;white-space:nowrap!important}
.cmPvHomeSlot{display:none!important}
.cmPvControls{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;margin-top:9px!important;padding:9px!important;border:1px solid #ffffff35!important;border-radius:13px!important;background:#ffffff10!important;overflow:hidden!important}
.cmPvLabel{font-size:12px!important;font-weight:900!important;margin:0 0 7px!important;color:#fff!important}
.cmWeekDays{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:4px!important;width:100%!important;max-width:100%!important;min-width:0!important}
.cmWeekDay{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:34px!important;border:1px solid #ffffff66!important;border-radius:8px!important;background:#ffffff16!important;color:#fff!important;font-size:10px!important;font-weight:950!important;padding:0!important;white-space:nowrap!important}
.cmWeekDay.active{background:#fff!important;color:#c9000b!important;border-color:#fff!important}
.cmClientListBtn{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;margin-top:7px!important;border:0!important;border-radius:10px!important;background:#fff!important;color:#25384a!important;padding:10px 11px!important;font-size:11px!important;font-weight:900!important;text-align:left!important}
.cmSectionTitle{display:flex;align-items:center;justify-content:space-between;gap:7px;margin:4px 2px 6px;min-width:0}.cmSectionTitle h3{margin:0;color:#152638;font-size:18px}.cmSectionTitle small{font-size:10px;color:#748493;font-weight:750;white-space:nowrap}
.cmActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;width:100%}.cmAct{box-sizing:border-box;min-width:0;min-height:82px;background:#fff;border:1px solid #e0e7ed;border-radius:15px;padding:10px;text-align:left;box-shadow:0 4px 13px #172b400d;position:relative;font-size:13px;font-weight:900;color:#14263a}.cmAct .ic{width:35px;height:35px;border-radius:10px;display:grid;place-items:center;font-size:18px;background:#fff0f1;margin-bottom:6px}.cmAct:after{content:'›';position:absolute;right:10px;bottom:7px;font-size:22px;color:#d70b15}.cmAct.blue .ic{background:#eaf3ff}.cmAct.green .ic{background:#e9f8ef}.cmAct.purple .ic{background:#f2eafe}
.cmCarouselViewport{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:scroll!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:none!important;overscroll-behavior-x:contain!important;scrollbar-width:none!important}
.cmCarousel{box-sizing:border-box!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:9px!important;width:max-content!important;min-width:max-content!important;max-width:none!important;overflow:visible!important;padding:2px 24px 10px 1px!important;touch-action:none!important;cursor:grab}
.cmCarouselViewport::-webkit-scrollbar{display:none!important}.cmCarousel:active{cursor:grabbing}
.cmCat{box-sizing:border-box!important;flex:0 0 148px!important;width:148px!important;min-width:148px!important;max-width:148px!important;height:252px!important;border:0!important;border-radius:20px!important;padding:0 10px 12px!important;color:#fff!important;text-align:left!important;scroll-snap-align:start!important;position:relative!important;box-shadow:0 12px 24px rgba(18,31,45,.20)!important;overflow:hidden!important;touch-action:pan-x!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;background:linear-gradient(165deg,#d50a18,#7a0007)!important}
.cmCat .cmProd{position:absolute!important;left:0!important;right:0!important;top:0!important;height:142px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:10px!important;overflow:hidden!important;background:#fff!important}
.cmCat .cmProd:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(245,247,250,.96));z-index:0}
.cmCat .cmProd img{display:block!important;position:relative!important;z-index:1!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:122px!important;object-fit:contain!important;object-position:center!important;filter:none!important;image-rendering:auto!important}
.cmCat .cmProd img[data-fit="logo"]{display:block!important;max-width:80%!important;max-height:96px!important;width:auto!important;height:auto!important;object-fit:contain!important;object-position:center!important;filter:none!important;background:transparent!important;margin:auto!important}
.cmCat .cmProd img[data-fit="bottle"]{max-width:92%!important;max-height:134px!important;object-fit:contain!important;filter:drop-shadow(0 5px 6px rgba(0,0,0,.14))!important}
.cmCat .cmProd img[data-fit="wide"]{width:100%!important;height:100%!important;max-width:100%!important;max-height:122px!important;object-fit:contain!important;object-position:center!important;filter:none!important;background:transparent!important}
.cmCat .cmProd img[data-fit="photo"]{width:100%!important;height:100%!important;max-width:100%!important;max-height:122px!important;object-fit:contain!important;object-position:center!important;filter:none!important;background:transparent!important}
.cmCat .cmFallback{font-size:42px;position:relative;z-index:1}
.cmCat b{font-size:14px!important;line-height:1.05!important;display:block!important;text-transform:uppercase!important;margin-top:146px!important;min-height:31px!important;text-shadow:0 1px 2px rgba(0,0,0,.22)}
.cmCat small{display:block!important;margin-top:6px!important;color:#fff!important;font-size:10.5px!important;line-height:1.15!important}
.cmCat .cmProgress{height:6px!important;border-radius:999px!important;background:rgba(255,255,255,.22)!important;overflow:hidden!important;margin-top:8px!important;margin-right:40px!important}
.cmCat .cmProgress i{display:block!important;height:100%!important;border-radius:inherit!important;background:rgba(255,255,255,.88)!important}
.cmCat .cmArrow{position:absolute!important;right:9px!important;bottom:9px!important;width:34px!important;height:34px!important;border-radius:50%!important;background:#fff!important;color:#e30613!important;display:grid!important;place-items:center!important;font-size:25px!important;font-weight:900!important;box-shadow:0 4px 10px rgba(0,0,0,.18)!important}
.cmCat.cmTheme-blue{background:linear-gradient(160deg,#2563eb,#1e3a8a)!important}
.cmCat.cmTheme-pink{background:linear-gradient(160deg,#ff3b8d,#c9005f)!important}
.cmCat.cmTheme-black{background:linear-gradient(160deg,#30343a,#050505)!important}
.cmCat.cmTheme-gold{background:linear-gradient(160deg,#ffc928,#c77a00)!important}
.cmCat.cmTheme-brown{background:linear-gradient(160deg,#8d572e,#3d1f0d)!important}
.cmCat.cmTheme-green{background:linear-gradient(160deg,#22a850,#075b29)!important}
.cmCat.cmTheme-cyan{background:linear-gradient(160deg,#16a6e6,#0755b7)!important}
.cmCat.cmTheme-purple{background:linear-gradient(160deg,#8b43e6,#4d1498)!important}
.cmCat.cmTheme-navy{background:linear-gradient(160deg,#1f4f8f,#071b38)!important}
.cmCat.cmTheme-orange{background:linear-gradient(160deg,#ff9a25,#e3420c)!important}
.cmCat.cmTheme-red{background:linear-gradient(160deg,#f52633,#9e0009)!important}.cmTheme-custom{background:var(--cm-custom,#e30613)!important}

#dash .tabs{margin-top:13px!important}.cmGraph{background:#fff;border:1px solid #e0e7ed;border-radius:17px;padding:13px;margin:0 0 12px;box-shadow:0 5px 15px #172b400d}.cmGraphTop{display:flex;align-items:center;gap:12px}.cmDonut{--p:0;width:88px;height:88px;border-radius:50%;background:conic-gradient(#0b9b57 calc(var(--p)*1%),#edf1f4 0);display:grid;place-items:center;flex:0 0 auto}.cmDonut:after{content:attr(data-p);width:65px;height:65px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:18px;font-weight:950;color:#163046}.cmGraphText{min-width:0}.cmGraphText h3{font-size:16px;margin:0 0 7px;color:#172736;line-height:1.15}.cmGraphStats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:11px}.cmGraphStat{background:#f5f8fa;border-radius:10px;padding:8px;text-align:center}.cmGraphStat small{display:block;font-size:9px;color:#687987;font-weight:800}.cmGraphStat b{display:block;font-size:16px;margin-top:2px}
.cvPrioritySection,.cvPriorityWrap,.cvHomePriorities,#cvPriorityBlock{display:none!important}
@media(max-width:380px){#dash .wrap{padding-left:7px!important;padding-right:7px!important}.cmSearchRow{grid-template-columns:1fr!important}.cmSearchRow button{width:100%!important;font-size:11px!important}.cmCat{flex-basis:120px!important;width:120px!important;min-width:120px!important;max-width:120px!important}.cmAct{font-size:12px}}

/* FINAL PORTRAIT FIX */
@media (orientation:portrait){
  #consultorModernHome{
    box-sizing:border-box!important;
    display:block!important;
    width:calc(100vw - 20px)!important;
    min-width:0!important;
    max-width:calc(100vw - 20px)!important;
    margin:0 auto!important;
    padding:0!important;
    overflow:visible!important;
  }
  #consultorModernHome > *{
    box-sizing:border-box!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
  }
  #consultorModernHome .cmSearchHero{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    margin:0!important;
    padding:12px!important;
    overflow:hidden!important;
    contain:layout paint!important;
  }
  #consultorModernHome .cmSearchTitle{
    min-width:0!important;
    max-width:100%!important;
  }
  #consultorModernHome .cmSearchTitle>div:last-child{
    min-width:0!important;
    max-width:calc(100% - 58px)!important;
  }
  #consultorModernHome .cmSearchTitle b{
    font-size:20px!important;
    line-height:1.05!important;
    white-space:nowrap!important;
  }
  #consultorModernHome .cmSearchTitle small{
    font-size:10px!important;
    white-space:normal!important;
  }
  #consultorModernHome .cmSearchRow,
  #consultorModernHome .cmPvControls{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    overflow:hidden!important;
  }
  #consultorModernHome .cmSearchRow input{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    height:48px!important;
    padding:10px 12px!important;
    font-size:14px!important;
  }
  #consultorModernHome .cmWeekDays{
    box-sizing:border-box!important;
    display:grid!important;
    grid-template-columns:repeat(5,minmax(0,1fr))!important;
    gap:4px!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    overflow:hidden!important;
  }
  #consultorModernHome .cmWeekDay{
    box-sizing:border-box!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    height:32px!important;
    margin:0!important;
    padding:0!important;
    font-size:9px!important;
    line-height:1!important;
    border-radius:7px!important;
    overflow:hidden!important;
  }
  #consultorModernHome .cmClientListBtn{
    box-sizing:border-box!important;
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    margin-top:7px!important;
    padding:10px!important;
    white-space:normal!important;
  }
  #consultorModernHome .cmActions{
    width:100%!important;
    max-width:100%!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
  }
  #consultorModernHome .cmCarouselViewport{
    box-sizing:border-box!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    overflow:visible!important;
  }
  #consultorModernHome .cmCarousel{
    box-sizing:border-box!important;
    display:flex!important;
    flex-flow:row nowrap!important;
    gap:9px!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    overflow-x:auto!important;
    overflow-y:hidden!important;
    padding:2px 24px 12px 1px!important;
    -webkit-overflow-scrolling:touch!important;
    touch-action:pan-x!important;
    overscroll-behavior-x:contain!important;
    scroll-snap-type:x proximity!important;
    scrollbar-width:none!important;
  }
  #consultorModernHome .cmCarousel::-webkit-scrollbar{display:none!important}
  #consultorModernHome .cmCat{
    flex:0 0 148px!important;
    width:148px!important;
    min-width:148px!important;
    max-width:148px!important;
    height:252px!important;
    scroll-snap-align:start!important;
    touch-action:pan-x!important;
  }
}


.cmCarouselShell{position:relative!important;min-width:0!important}
.cmCarouselNav{display:none}
@media(min-width:901px){
  html,body{overflow-x:hidden!important}
  #dash .top{padding:16px 22px!important}
  #dash .topbar{max-width:1180px!important;min-height:78px!important;gap:14px!important;align-items:center!important}
  #dash .top .brand{flex:1 1 auto!important;min-width:420px!important;overflow:visible!important}
  #dash .top .brand>div:last-child:before{font-size:23px!important;line-height:1.08!important;white-space:nowrap!important}
  #dash .top .brand>div:last-child b{font-size:13px!important}
  #dash .wrap{max-width:1240px!important;padding:18px 28px 0!important;margin:0 auto 96px!important}
  .cmHome{max-width:1180px!important;margin:0 auto!important;grid-template-columns:minmax(0,1.22fr) minmax(340px,.78fr)!important;gap:18px!important}
  .cmHello{grid-column:1 / -1!important;padding:16px 20px!important}
  .cmAvatar{width:58px!important;height:58px!important;font-size:29px!important}
  .cmHello strong{font-size:25px!important}.cmHello small{font-size:14px!important}
  .cmSearchHero{grid-column:1!important;padding:20px!important;border-radius:24px!important}
  .cmSearchTitle b{font-size:30px!important}.cmSearchTitle small{font-size:13px!important}
  .cmSearchIcon{width:58px!important;height:58px!important;font-size:31px!important}
  .cmSearchRow input{padding:15px 16px!important;font-size:17px!important}
  .cmPvControls{padding:14px!important;margin-top:12px!important}
  .cmPvLabel{font-size:15px!important;margin-bottom:10px!important}
  .cmWeekDays{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important}
  .cmWeekDay{height:44px!important;font-size:13px!important}
  .cmClientListBtn{padding:13px 14px!important;font-size:14px!important;margin-top:10px!important}
  .cmHome>div:nth-of-type(3){grid-column:2!important;align-self:stretch!important}
  .cmHome>div:nth-of-type(3) .cmActions{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
  .cmAct{min-height:118px!important;padding:16px!important;font-size:16px!important;border-radius:19px!important}
  .cmAct .ic{width:46px!important;height:46px!important;font-size:23px!important}
  .cmHome>div:nth-of-type(4){grid-column:1 / -1!important;min-width:0!important}
  .cmSectionTitle{margin:3px 4px 10px!important}
  .cmSectionTitle h3{font-size:24px!important}.cmSectionTitle small{font-size:12px!important}
  .cmCarouselShell{padding:0 50px!important}
  .cmCarouselViewport{overflow-x:auto!important;overflow-y:hidden!important;touch-action:auto!important;scroll-behavior:smooth!important;overscroll-behavior-x:contain!important}
  .cmCarousel{gap:14px!important;padding:4px 8px 14px!important;touch-action:auto!important}
  .cmCat{flex:0 0 190px!important;width:190px!important;min-width:190px!important;max-width:190px!important;height:292px!important;padding:0 14px 15px!important;border-radius:22px!important}
  .cmCat .cmProd{height:160px!important;padding:14px!important}
  .cmCat .cmProd img{max-height:138px!important}
  .cmCat .cmProd img[data-fit="logo"]{max-width:86%!important;max-height:118px!important}
  .cmCat .cmProd img[data-fit="bottle"]{max-height:150px!important}
  .cmCat .cmProd img[data-fit="wide"],.cmCat .cmProd img[data-fit="photo"]{max-height:138px!important}
  .cmCat b{font-size:16px!important;margin-top:166px!important;min-height:36px!important}
  .cmCat small{font-size:12px!important}
  .cmCarouselNav{display:grid!important;place-items:center!important;position:absolute!important;top:50%!important;transform:translateY(-50%)!important;width:40px!important;height:58px!important;border:0!important;border-radius:14px!important;background:#fff!important;color:#d50712!important;font-size:32px!important;font-weight:900!important;box-shadow:0 7px 18px rgba(20,35,50,.18)!important;z-index:5!important;cursor:pointer!important}
  .cmCarouselPrev{left:2px!important}.cmCarouselNext{right:2px!important}
  .cmCarouselNav:hover{background:#d50712!important;color:#fff!important}
}

`;document.head.appendChild(s);
}
function clickExisting(id,text){const el=id?document.getElementById(id):null;if(el){el.click();return}const x=QA('#dash button,#dash .tile,#dash a').find(v=>String(v.textContent||'').toLowerCase().includes(String(text||'').toLowerCase()));if(x)x.click()}
function fmtSalesDate(v){const s=String(v||'');const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+'/'+m[2]+'/'+m[1]:s}
function renderSalesPeriodHeader(d){
 const top=Q('#dash .top');if(!top)return;
 let el=document.getElementById('cmSalesPeriod');if(!el){el=document.createElement('div');el.id='cmSalesPeriod';el.className='cmSalesPeriod';top.appendChild(el)}
 const p=d?.sales_period||{};el.textContent=p.inicio&&p.fim?'Vendas atualizadas: '+fmtSalesDate(p.inicio)+' a '+fmtSalesDate(p.fim):'Vendas atualizadas: sem período';
}
function searchPvHome(){const input=document.getElementById('cmPvInput');if(!input)return;const v=input.value.trim();try{openPv()}catch{}setTimeout(()=>{const p=document.getElementById('pv');if(p){p.value=v;if(v)try{searchPv()}catch{}}},80)}
function renderGraph(cat){
 const panel=Q('#dash .panel');if(!panel||!cat||cat==='ALL')return;
 let g=document.getElementById('cmCategoryGraph');if(!g){g=document.createElement('div');g.id='cmCategoryGraph';g.className='cmGraph';const res=document.getElementById('results');panel.insertBefore(g,res||panel.firstChild)}
 const row=(D()?.own||[]).find(x=>x.nome===cat);if(!row){g.remove();return}
 const meta=num(row.meta),real=num(row.realizado),falta=Math.max(0,num(row.falta)),pct=meta?Math.round(real/meta*100):num(row.percentual);
 g.innerHTML='<div class="cmGraphTop"><div class="cmDonut" style="--p:'+Math.min(100,pct)+'" data-p="'+pct+'%"></div><div class="cmGraphText"><h3>'+E(cat)+'</h3><small>Andamento da cobertura deste incentivo</small></div></div><div class="cmGraphStats"><div class="cmGraphStat"><small>META</small><b>'+meta+'</b></div><div class="cmGraphStat"><small>REALIZADO</small><b>'+real+'</b></div><div class="cmGraphStat"><small>FALTA</small><b>'+falta+'</b></div></div>';
}
function chooseWithGraph(cat){try{choose(cat)}catch{}setTimeout(()=>renderGraph(cat),30)}
function hideOldPriority(){QA('#dash .wrap > section,#dash .wrap > div').forEach(el=>{if(el.id==='consultorModernHome'||el.classList.contains('tabs')||el.classList.contains('panel')||el.classList.contains('footer'))return;const t=String(el.textContent||'').trim().toUpperCase();if(t.includes('INCENTIVOS PRIORITÁRIOS')&&t.length<160)el.style.setProperty('display','none','important')})}
function build(){const wrap=Q('#dash .wrap');if(!wrap)return false;css();let home=document.getElementById('consultorModernHome');if(!home){home=document.createElement('section');home.id='consultorModernHome';home.className='cmHome';const tabs=Q('#dash .tabs');wrap.insertBefore(home,tabs||wrap.firstChild)}return true}
function render(){
 if(!build())return;const d=D();if(!d?.own)return;
 const name=d.consultor?.nome||'Consultor';
 const cards=(d.own||[]).map(x=>{const pm=productMeta(x),meta=num(x.meta),real=num(x.realizado),pct=meta?Math.min(100,Math.round(real/meta*100)):0;return '<button class="cmCat cmTheme-'+pm.theme+'"'+(pm.theme==='custom'?' style="--cm-custom:'+E(pm.color)+'"':'')+' type="button" data-cat="'+E(x.nome)+'"><span class="cmProd">'+(pm.img?'<img loading="eager" decoding="async" referrerpolicy="no-referrer" data-fit="'+(pm.fit||'logo')+'" src="'+pm.img+'" alt="">':'<span class="cmFallback">'+icon(x.nome)+'</span>')+'</span><b>'+E(x.nome)+'</b><small>'+real+' / '+meta+' realizados</small><span class="cmProgress"><i style="width:'+pct+'%"></i></span><span class="cmArrow">›</span></button>'}).join('');
 const h=document.getElementById('consultorModernHome');
 h.innerHTML='<div class="cmHello"><div class="cmAvatar">👤</div><div><strong>Olá, '+E(String(name).split(' ')[0])+'</strong><small>Bora conquistar mais hoje! 🚀</small></div></div>'+
 '<div class="cmSearchHero"><div class="cmSearchTitle"><div class="cmSearchIcon">🔎</div><div><b>Pesquisa de PV</b><small>Pesquise PV, cliente ou razão social</small></div></div><div class="cmSearchRow"><input id="cmPvInput" inputmode="numeric" placeholder="Digite o PV do cliente"></div><div class="cmPvControls"><div class="cmPvLabel">📍 Escolha o dia da visita</div><div class="cmWeekDays">'+['SEG','TER','QUA','QUI','SEX'].map(d=>'<span role="button" tabindex="0" class="cmWeekDay" data-day="'+d+'">'+d+'</span>').join('')+'</div><button type="button" id="cmClientListBtn" class="cmClientListBtn">Listar clientes do dia ▾</button></div></div>'+
 '<div><div class="cmSectionTitle"><h3>Acesso rápido</h3><small>Ferramentas da rota</small></div><div class="cmActions">'+
 '<button class="cmAct" data-act="contratos"><span class="ic">📄</span>Contratos</button>'+
 '<button class="cmAct blue" data-act="visitas"><span class="ic">📅</span>Visita de Clientes</button>'+
 '<button class="cmAct green" data-act="subcanais"><span class="ic">🏪</span>Subcanais</button>'+
 ''+
 '<button class="cmAct blue" data-act="contatos"><span class="ic">📞</span>Contato dos Clientes</button>'+
 '</div></div>'+
 '<div><div class="cmSectionTitle"><h3>Coberturas dos Incentivos</h3><small>↔ arraste para o lado</small></div><div class="cmCarouselShell"><button type="button" class="cmCarouselNav cmCarouselPrev" aria-label="Voltar incentivos">‹</button><div class="cmCarouselViewport"><div class="cmCarousel">'+cards+'</div></div><button type="button" class="cmCarouselNav cmCarouselNext" aria-label="Avançar incentivos">›</button></div></div>'+
 '<div class="cmOppSection"><button type="button" id="cmOppHomeBtn" class="cmOppBtn"><span class="ico">💡</span><span><b>Oportunidades</b><small>Clientes do dia ou toda a carteira que ainda faltam por categoria</small></span></button></div>';
 document.getElementById('cmPvInput').onkeydown=e=>{if(e.key==='Enter')searchPvHome()};
 const savedDay=(sessionStorage.getItem('pv_dia_visita')||'SEG').toUpperCase();
 QA('#consultorModernHome .cmWeekDay').forEach(b=>{b.classList.toggle('active',b.dataset.day===savedDay);const pick=async()=>{QA('#consultorModernHome .cmWeekDay').forEach(x=>x.classList.remove('active'));b.classList.add('active');sessionStorage.setItem('pv_dia_visita',b.dataset.day);try{await window.__setPvHomeDay?.(b.dataset.day)}catch{}};b.onclick=pick;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}}});
 const listBtn=document.getElementById('cmClientListBtn');if(listBtn)listBtn.onclick=()=>{try{window.__openPvHomePicker?.()}catch{}};
 const oppBtn=document.getElementById('cmOppHomeBtn');if(oppBtn)oppBtn.onclick=()=>window.openIturamaOpportunities?.();
 const cv=Q('#consultorModernHome .cmCarouselViewport'),prev=Q('#consultorModernHome .cmCarouselPrev'),next=Q('#consultorModernHome .cmCarouselNext');
 const moveCarousel=dir=>{if(!cv)return;const amount=Math.max(420,Math.floor(cv.clientWidth*.72));cv.scrollBy({left:dir*amount,behavior:'smooth'})};
 if(prev)prev.onclick=()=>moveCarousel(-1);
 if(next)next.onclick=()=>moveCarousel(1);

 QA('#consultorModernHome .cmCat').forEach(b=>b.onclick=()=>chooseWithGraph(b.dataset.cat));
 QA('#consultorModernHome .cmAct').forEach(b=>b.onclick=()=>{const a=b.dataset.act;if(a==='contratos')clickExisting('cvContractsBtn','Contratos');else if(a==='visitas')clickExisting('cvVisitBtn','Visita de Clientes');else if(a==='subcanais')clickExisting('cvSubBtn','Subcanais');else if(a==='contatos')clickExisting('contClientesBtn','Contato dos Clientes')});
 hideOldPriority();
 renderSalesPeriodHeader(d);
 try{window.__renderPvHomePanel?.()}catch{}
}
let sig='';setInterval(()=>{const d=D();const s=d?JSON.stringify([(d.own||[]).map(x=>[x.nome,x.realizado,x.meta,x.imagem_card_url,x.cor_card]),d.consultor?.nome,d.sales_period]):'';if(s&&s!==sig){sig=s;render()}},700);
window.addEventListener('pageshow',()=>setTimeout(render,350));
})();