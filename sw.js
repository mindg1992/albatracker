// PWA 설치 차단을 위한 self-unregister SW.
// 과거 albatracker-v3 SW가 5분마다 reg.update()로 이 파일을 fetch함.
// 새 버전을 받으면 install→activate에서 모든 캐시 삭제 + 자기 자신 unregister.
// 다음 페이지 로드부터는 SW가 사라져 Chrome이 더 이상 PWA 설치 조건을 인식하지 못함.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        try { client.navigate(client.url); } catch (_) {}
      });
    } catch (_) {}
  })());
});

// fetch 핸들러를 의도적으로 등록하지 않음.
// → Chrome PWA 설치 가능 조건(SW + fetch handler) 미달.
