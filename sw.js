// PWA installable 조건을 충족시키기 위한 최소 Service Worker.
// fetch handler는 등록만 되어 있을 뿐 아무 것도 하지 않음 → 브라우저가 모든 요청을
// 평소대로 네트워크로 처리. 캐싱도 가로채기도 없으므로 OAuth 플로우와 페이지 갱신을
// 망칠 위험이 없음. 오프라인 지원은 의도적으로 포기 (Firebase 의존이라 의미 없음).

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // 과거 albatracker-v3 SW가 만든 캐시가 남아있으면 청소
  event.waitUntil((async function() {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k) { return caches.delete(k); }));
    } catch (_) {}
    try { await self.clients.claim(); } catch (_) {}
  })());
});

// 빈 fetch handler — Chrome PWA installability 검사 통과용.
// 핸들러 안에서 아무 것도 안 하면 브라우저가 기본 네트워크 처리로 fallback.
self.addEventListener('fetch', function() {});
