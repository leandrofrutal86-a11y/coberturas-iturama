(()=>{
  const STYLE_ID='rogerioLayerFixStyle';
  function css(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #ov.overlay,
      .cvOverlay,
      .contOverlay,
      .impOverlay,
      .cvContentOverlay{z-index:10000!important}
      #ov.overlay.show{display:flex!important}
      #ov .sheet,
      .cvOverlay .cvSheet,
      .contOverlay .contSheet,
      .impOverlay .impBody,
      .cvContentOverlay .cvContentSheet{position:relative;z-index:10001!important}
      body.rogerioModalOpen .cvBottomNav{visibility:hidden!important;pointer-events:none!important;z-index:1!important}
      body.rogerioModalOpen #dash{pointer-events:none}
      body.rogerioModalOpen #ov,
      body.rogerioModalOpen .cvOverlay,
      body.rogerioModalOpen .contOverlay,
      body.rogerioModalOpen .impOverlay,
      body.rogerioModalOpen .cvContentOverlay{pointer-events:auto!important}
      #ov .sheet{max-height:calc(100dvh - 16px)!important;overflow:auto!important;scroll-padding-bottom:90px!important}
      #ov .sheetBody{padding-bottom:90px!important}
    `;
    document.head.appendChild(s);
  }
  function opened(){
    return !!document.querySelector('#ov.show,.cvOverlay.show,.contOverlay.show,.impOverlay.show,.cvContentOverlay.show');
  }
  function sync(){
    css();
    const on=opened();
    if(document.body.classList.contains('rogerioModalOpen')!==on){
      document.body.classList.toggle('rogerioModalOpen',on);
    }
  }
  function boot(){
    css();
    sync();
    new MutationObserver(sync).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    setInterval(sync,700);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
