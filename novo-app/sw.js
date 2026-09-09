const CACHE='iturama-live-v3';
const CAMPAIGN='https://www.coca-cola.com/content/dam/onexp/br/pt/refillables/campaign_card_desktop_1280x1024.jpg';
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(Promise.resolve());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const req=event.request;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{try{const res=await fetch(req,{cache:'no-store'});const ct=res.headers.get('content-type')||'';if(!ct.includes('text/html'))return res;let html=await res.text();const old='<img class="bottle" alt="" src="https://resources.coca-colaentuhogar.com/media/catalog/product/c/o/coca-cola-original-vidrio-355ml_1.png">';const neu='<img class="campaignHero" alt="Coca-Cola e Fanta retornáveis" src="'+CAMPAIGN+'">';html=html.split(old).join(neu);html=html.replace('</style>','.campaignHero{position:absolute;right:0;top:0;height:100%;width:250px;object-fit:cover;object-position:center;z-index:1;opacity:.96}.loginHero .campaignHero{width:285px}.top .campaignHero{width:220px}@media(max-width:760px){.campaignHero{width:155px!important;opacity:.88}.brandRow{padding-right:150px}.topbar{padding-right:135px}}@media(max-width:520px){.campaignHero{width:125px!important}.brandRow{padding-right:115px}.topbar{padding-right:105px}}</style>');return new Response(html,{status:res.status,statusText:res.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}})}catch(e){return caches.match(req)}})());return;
 }
 event.respondWith(fetch(req,{cache:'no-store'}).then(async res=>{if(res.ok){const c=await caches.open(CACHE);c.put(req,res.clone())}return res}).catch(()=>caches.match(req)));
});