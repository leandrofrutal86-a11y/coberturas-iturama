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
    .cvContentOverlay,
    .recOverlay{
      z-index:10000!important;
    }

    #ov .sheet,
    .cvOverlay .cvSheet,
    .contOverlay .contSheet,
    .cvContentOverlay .cvContentSheet,
    .recOverlay .recSheet{
      position:relative!important;
      z-index:10001!important;
    }

    /* Mantém espaço de rolagem para que o último conteúdo nunca fique escondido */
    #ov .sheetBody,
    .cvOverlay .cvBody,
    .contOverlay .contBody,
    .cvContentOverlay .cvContentBody,
    .recOverlay .recBody{
      padding-bottom:calc(110px + env(safe-area-inset-bottom))!important;
    }

    .impOverlay .impBody{
      padding-bottom:calc(110px + env(safe-area-inset-bottom))!important;
    }

    /* O menu inferior deve continuar recebendo toque; telas abertas ficam acima dele */
    #cvBottomNav{
      z-index:50000!important;
      pointer-events:auto!important;
      visibility:visible!important;
    }
    .cvContentOverlay.show,
    .recOverlay.show,
    .matV2Overlay.show{
      z-index:60000!important;
    }

    @media(max-width:760px){
      #ov.overlay,
      .cvOverlay,
      .contOverlay,
      .impOverlay,
      .cvContentOverlay,
      .recOverlay{
        z-index:10000!important;
      }
      #ov .sheet,
      .cvOverlay .cvSheet,
      .contOverlay .contSheet,
      .cvContentOverlay .cvContentSheet,
      .recOverlay .recSheet{
        max-height:100dvh!important;
      }
    }
  `;
  document.head.appendChild(s);
})();