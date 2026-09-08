const CACHE='iturama-live-v2';
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(Promise.resolve());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const req=event.request;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then(async res=>{if(res.ok){const c=await caches.open(CACHE);c.put(req,res.clone());}return res;}).catch(()=>caches.match(req)));
});