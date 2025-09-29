/**
 * RAVAN FASHION - SERVICE WORKER FOR PERFORMANCE OPTIMIZATION
 * Advanced Caching Strategies & Offline Support
 */

const RAVAN_FASHION_CACHE = 'ravan-fashion-cache-v1';
const CRITICAL_CACHE = 'ravan-fashion-critical-v1';
const IMAGE_CACHE = 'ravan-fashion-images-v1';
const FONT_CACHE = 'ravan-fashion-fonts-v1';

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/assets/ravan-fashion-critical.css',
  '/assets/ravan-fashion-optimized.js',
  '/assets/section-cultural-spotlight.css',
  '/assets/section-cultural-product-details.css',
  '/assets/section-design-story.css',
  'https://fonts.googleapis.com/css2?family=Tamil+Sangam+MN&family=Noto+Sans+Tamil&display=swap'
];

// Cache cultural pattern images
const CULTURAL_IMAGES = [
  '/files/kolam-pattern.svg',
  '/files/temple-arch.svg',
  '/files/silk-texture.jpg'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CRITICAL_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_ASSETS);
      }),

      // Cache cultural images
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.addAll(CULTURAL_IMAGES.map(img => new Request(img, { mode: 'no-cors' })));
      }),

      // Force the waiting service worker to become the active service worker
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('ravan-fashion-') && !cacheName.endsWith('-v1')) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Handle different request types with appropriate strategies
  if (event.request.url.includes('/assets/')) {
    event.respondWith(handleAssetRequest(event.request));
  } else if (event.request.url.includes('/files/') || url.hostname.includes('cdn.shopify.com')) {
    event.respondWith(handleImageRequest(event.request));
  } else if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(handleFontRequest(event.request));
  } else {
    event.respondWith(handleNetworkFirstRequest(event.request));
  }
});

// Handle CSS/JS assets with cache-first strategy
async function handleAssetRequest(request) {
  const cache = await caches.open(RAVAN_FASHION_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if asset is stale (older than 24 hours)
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();
    const age = (now - cachedDate) / (1000 * 60 * 60); // hours

    if (age < 24) {
      return cachedResponse;
    }

    // Revalidate in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    });

    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return cached critical CSS as fallback for CSS requests
    if (request.url.includes('.css')) {
      const criticalCache = await caches.open(CRITICAL_CACHE);
      return criticalCache.match('/assets/ravan-fashion-critical.css');
    }
    throw error;
  }
}

// Handle images with cache-first + expiration strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if image is stale (older than 7 days)
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();
    const age = (now - cachedDate) / (1000 * 60 * 60 * 24); // days

    if (age < 7) {
      return cachedResponse;
    }

    // Revalidate in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    });

    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return fallback image for cultural patterns
    if (request.url.includes('kolam') || request.url.includes('temple')) {
      return new Response(
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy="0.3em" font-size="12">🎨</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

// Handle fonts with cache-first strategy
async function handleFontRequest(request) {
  const cache = await caches.open(FONT_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return system font as fallback
    return new Response('', { status: 200 });
  }
}

// Handle other requests with network-first strategy
async function handleNetworkFirstRequest(request) {
  const cache = await caches.open(RAVAN_FASHION_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(
        `<!DOCTYPE html>
        <html lang="ta">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ராவண் ஃபேஷன் - ஆஃப்லைன்</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fff5f5; }
                h1 { color: #8B0000; }
                p { color: #666; max-width: 500px; margin: 0 auto; }
                .offline-icon { font-size: 4rem; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="offline-icon">📵</div>
            <h1>ராவண் ஃபேஷன்</h1>
            <p>நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். இணைப்பை மீண்டும் செய்து முயற்சிக்கவும்.</p>
            <p>You are currently offline. Please check your connection and try again.</p>
        </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    throw error;
  }
}

// Background sync for cultural content updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'cultural-content-sync') {
    event.waitUntil(syncCulturalContent());
  }
});

async function syncCulturalContent() {
  try {
    // Sync cultural stories, elements, and featured products
    const syncUrls = [
      '/api/cultural-stories',
      '/api/cultural-elements',
      '/api/featured-collections'
    ];

    await Promise.all(syncUrls.map(url =>
      fetch(url).then(response => {
        if (response.ok) {
          const cache = caches.open(RAVAN_FASHION_CACHE);
          cache.put(url, response.clone());
        }
      })
    ));
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications for drop alerts
self.addEventListener('push', (event) => {
  const options = {
    body: 'புதிய டிராப் வெளியிடப்பட்டது! இப்போது ஷாப்பிங் செய்யுங்கள்.',
    icon: '/files/ravan-logo.png',
    badge: '/files/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/collections/drops'
    }
  };

  event.waitUntil(
    self.registration.showNotification('ராவண் ஃபேஷன் - புதிய டிராப்', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Cache cleanup message for client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('ravan-fashion-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});