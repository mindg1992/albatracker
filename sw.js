const CACHE_NAME = 'albatracker-v3';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // 이전 캐시 모두 삭제 후 즉시 제어권 획득
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // 외부 CDN·Firebase API는 그냥 통과
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Firebase 예약 경로(/__/auth/*, /__/firebase/*)는 SW가 가로채지 않음
  // — 인증 핸들러는 항상 네트워크 직통으로 가야 정상 동작
  try {
    if (new URL(event.request.url).pathname.startsWith('/__/')) return;
  } catch(_) {}

  // 항상 네트워크 우선, 오프라인일 때만 캐시 사용
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
