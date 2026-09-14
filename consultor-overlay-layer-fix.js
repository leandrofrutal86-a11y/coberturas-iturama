(()=>{
  if(document.getElementById('consultorOverlayLayerFix')) return;
  const s=document.createElement('style');
  s.id='consultorOverlayLayerFix';
  s.textContent=`
    /* Toda tela/modal interno deve ficar acima do menu inferior fixo */
    #ov.overlay,
    .cvOverlay,
    .contOverlay,
    .impOverlay,
    .cvContentOverlay{
      z-index:10000!important;
    }

    #ov .sheet,
    .cvOverlay .cvSheet,
    .contOverlay .contSheet,
    .cvContentOverlay .cvContentSheet{
      position:relative!important;
      z-index:10001!important;
    }

    /* Mantém espaço de rolagem para que o último conteúdo nunca fique escondido */
    #ov .sheetBody,
    .cvOverlay .cvBody,
    .contOverlay .contBody,
    .cvContentOverlay .cvContentBody{
      padding-bottom:calc(110px + env(safe-area-inset-bottom))!important;
    }

    .impOverlay .impBody{
      padding-bottom:calc(110px + env(safe-area-inset-bottom))!important;
    }

    /* Enquanto qualquer tela interna estiver aberta, o menu inferior fica atrás dela */
    body:has(#ov.show) #cvBottomNav,
    body:has(.cvOverlay.show) #cvBottomNav,
    body:has(.contOverlay.show) #cvBottomNav,
    body:has(.impOverlay.show) #cvBottomNav,
    body:has(.cvContentOverlay.show) #cvBottomNav{
      z-index:10!important;
      pointer-events:none!important;
    }

    @media(max-width:760px){
      #ov.overlay,
      .cvOverlay,
      .contOverlay,
      .impOverlay,
      .cvContentOverlay{
        z-index:10000!important;
      }
      #ov .sheet,
      .cvOverlay .cvSheet,
      .contOverlay .contSheet,
      .cvContentOverlay .cvContentSheet{
        max-height:100dvh!important;
      }
    }
  `;
  document.head.appendChild(s);
})();