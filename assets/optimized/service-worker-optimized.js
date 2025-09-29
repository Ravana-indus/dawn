/**
 * RAVAN FASHION - OPTIMIZED SERVICE WORKER
 * Advanced caching strategies for Shopify themes
 *
 * Features:
 * - Cache-first strategy for assets
 * - Network-first strategy for dynamic content
 * - Stale-while-revalidate for API calls
 * - Background sync for offline functionality
 * - Push notifications for updates
 * - Cache management and cleanup
 */

const RAVAN_FASHION_CACHE = {
  STATIC: 'ravan-fashion-static-v1',
  IMAGES: 'ravan-fashion-images-v1',
  PAGES: 'ravan-fashion-pages-v1',
  API: 'ravan-fashion-api-v1',
  RUNTIME: 'ravan-fashion-runtime-v1'
};

const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  CACHE_ONLY: 'cache-only',
  NETWORK_ONLY: 'network-only'
};

const CACHE_EXPIRY = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  PAGES: 24 * 60 * 60 * 1000, // 24 hours
  API: 60 * 60 * 1000, // 1 hour
  RUNTIME: 60 * 60 * 1000 // 1 hour
};

class OptimizedServiceWorker {
  constructor() {
    this.cacheVersion = '1.0.0';
    this.precacheUrls = this.getPrecacheUrls();
    this.dynamicCacheUrls = new Set();
    this.backgroundSyncQueue = [];
  }

  /**
   * Get URLs to precache
   */
  getPrecacheUrls() {
    return [
      // Critical CSS
      '/assets/optimized/ravan-fashion-critical.css',

      // Critical JavaScript
      '/assets/optimized/resource-loader-optimized.js',
      '/assets/optimized/image-loader-optimized.js',

      // Critical fonts
      'https://fonts.gstatic.com/s/notosanstamil/v15/nEKhbZ7WJw0q8sY7zBm2m3q0uA.woff2',

      // Critical images (placeholder)
      '/assets/placeholder.svg',

      // Offline page
      '/offline.html'
    ];
  }

  /**
   * Install event - precache critical resources
   */
  async install(event) {
    console.log('Service Worker installing...');

    event.waitUntil(
      this.precacheCriticalResources()
    );

    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
  }

  /**
   * Precache critical resources
   */
  async precacheCriticalResources() {
    const cache = await caches.open(RAVAN_FASHION_CACHE.STATIC);

    try {
      await cache.addAll(this.precacheUrls);
      console.log('Critical resources precached successfully');
    } catch (error) {
      console.warn('Failed to precache some resources:', error);

      // Fallback: cache resources individually
      for (const url of this.precacheUrls) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(`Failed to cache ${url}:`, err);
        }
      }
    }
  }

  /**
   * Activate event - clean up old caches
   */
  async activate(event) {
    console.log('Service Worker activating...');

    event.waitUntil(
      this.cleanupOldCaches()
    );

    // Take control of all open clients
    return self.clients.claim();
  }

  /**
   * Clean up old caches
   */
  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = Object.values(RAVAN_FASHION_CACHE);

    const deletePromises = cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(cacheName => caches.delete(cacheName));

    return Promise.all(deletePromises);
  }

  /**
   * Fetch event - handle all network requests
   */
  async fetch(event) {
    const { request } = event;
    const url = new URL(request.url);

    // Handle different request types
    if (this.isStaticAsset(request)) {
      return this.handleStaticAsset(request);
    } else if (this.isImageRequest(request)) {
      return this.handleImageRequest(request);
    } else if (this.isAPIRequest(request)) {
      return this.handleAPIRequest(request);
    } else if (this.isPageRequest(request)) {
      return this.handlePageRequest(request);
    } else {
      return this.handleGenericRequest(request);
    }
  }

  /**
   * Handle static assets with cache-first strategy
   */
  async handleStaticAsset(request) {
    return this.cacheFirst(request, RAVAN_FASHION_CACHE.STATIC);
  }

  /**
   * Handle image requests with cache-first strategy
   */
  async handleImageRequest(request) {
    return this.cacheFirst(request, RAVAN_FASHION_CACHE.IMAGES);
  }

  /**
   * Handle API requests with network-first strategy
   */
  async handleAPIRequest(request) {
    return this.networkFirst(request, RAVAN_FASHION_CACHE.API);
  }

  /**
   * Handle page requests with stale-while-revalidate strategy
   */
  async handlePageRequest(request) {
    return this.staleWhileRevalidate(request, RAVAN_FASHION_CACHE.PAGES);
  }

  /**
   * Handle generic requests
   */
  async handleGenericRequest(request) {
    return this.networkFirst(request, RAVAN_FASHION_CACHE.RUNTIME);
  }

  /**
   * Cache-first strategy
   */
  async cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      // Check if cache is expired
      if (this.isCacheExpired(cached)) {
        this.updateCache(request, cacheName);
      }
      return cached;
    }

    try {
      const network = await fetch(request);
      if (network.ok) {
        await cache.put(request, network.clone());
      }
      return network;
    } catch (error) {
      console.warn('Network request failed, returning cached or offline response:', error);
      return this.getOfflineResponse(request);
    }
  }

  /**
   * Network-first strategy
   */
  async networkFirst(request, cacheName) {
    try {
      const network = await fetch(request);
      if (network.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(request, network.clone());
      }
      return network;
    } catch (error) {
      console.warn('Network request failed, falling back to cache:', error);
      const cache = await caches.open(cacheName);
      const cached = await cache.match(request);
      return cached || this.getOfflineResponse(request);
    }
  }

  /**
   * Stale-while-revalidate strategy
   */
  async staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    // Always try to fetch from network in background
    const fetchPromise = fetch(request).then(async (network) => {
      if (network.ok) {
        await cache.put(request, network.clone());
      }
      return network;
    }).catch(() => {
      // Network failed, return cached response
      return cached;
    });

    // Return cached response immediately if available
    return cached || fetchPromise;
  }

  /**
   * Update cache in background
   */
  async updateCache(request, cacheName) {
    try {
      const network = await fetch(request);
      if (network.ok) {
        const cache = await caches.open(cacheName);
        await cache.put(request, network);
      }
    } catch (error) {
      console.warn('Background cache update failed:', error);
    }
  }

  /**
   * Check if cache entry is expired
   */
  isCacheExpired(response) {
    const dateHeader = response.headers.get('date');
    if (!dateHeader) return false;

    const cachedDate = new Date(dateHeader);
    const now = new Date();
    const age = now - cachedDate;

    // Check based on cache type
    if (response.url.includes('static')) {
      return age > CACHE_EXPIRY.STATIC;
    } else if (response.url.includes('images')) {
      return age > CACHE_EXPIRY.IMAGES;
    } else if (response.url.includes('pages')) {
      return age > CACHE_EXPIRY.PAGES;
    } else if (response.url.includes('api')) {
      return age > CACHE_EXPIRY.API;
    }

    return age > CACHE_EXPIRY.RUNTIME;
  }

  /**
   * Get offline response
   */
  async getOfflineResponse(request) {
    if (request.mode === 'navigate') {
      // Return offline page for navigation requests
      const cache = await caches.open(RAVAN_FASHION_CACHE.STATIC);
      return cache.match('/offline.html');
    }

    // Return a generic offline response for other requests
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  /**
   * Check if request is for static asset
   */
  isStaticAsset(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];
    const pathname = url.pathname.toLowerCase();

    return staticExtensions.some(ext => pathname.endsWith(ext)) ||
           pathname.includes('assets/optimized/');
  }

  /**
   * Check if request is for image
   */
  isImageRequest(request) {
    const url = new URL(request.url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = url.pathname.toLowerCase();

    return imageExtensions.some(ext => pathname.endsWith(ext)) ||
           url.searchParams.has('width') ||
           url.searchParams.has('height');
  }

  /**
   * Check if request is for API
   */
  isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.includes('/api/') ||
           url.pathname.includes('/cart/') ||
           url.pathname.includes('/search');
  }

  /**
   * Check if request is for page
   */
  isPageRequest(request) {
    return request.mode === 'navigate' ||
           request.headers.get('accept')?.includes('text/html');
  }

  /**
   * Handle message events from clients
   */
  async message(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;

      case 'CACHE_URL':
        await this.cacheUrl(data.url, data.cacheName);
        break;

      case 'CLEAR_CACHE':
        await this.clearCache(data.cacheName);
        break;

      case 'GET_CACHE_STATS':
        const stats = await this.getCacheStats();
        event.ports[0].postMessage({ type: 'CACHE_STATS', data: stats });
        break;

      case 'SYNC_NOW':
        await this.syncNow();
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  }

  /**
   * Cache specific URL
   */
  async cacheUrl(url, cacheName = RAVAN_FASHION_CACHE.STATIC) {
    try {
      const cache = await caches.open(cacheName);
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
        console.log('URL cached successfully:', url);
      }
    } catch (error) {
      console.warn('Failed to cache URL:', url, error);
    }
  }

  /**
   * Clear specific cache
   */
  async clearCache(cacheName) {
    try {
      await caches.delete(cacheName);
      console.log('Cache cleared:', cacheName);
    } catch (error) {
      console.warn('Failed to clear cache:', cacheName, error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const stats = {};

    for (const cacheName of Object.values(RAVAN_FASHION_CACHE)) {
      try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = {
          count: keys.length,
          size: await this.calculateCacheSize(keys)
        };
      } catch (error) {
        stats[cacheName] = { count: 0, size: 0 };
      }
    }

    return stats;
  }

  /**
   * Calculate cache size
   */
  async calculateCacheSize(keys) {
    let totalSize = 0;

    for (const key of keys) {
      try {
        const response = await caches.match(key);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      } catch (error) {
        console.warn('Failed to calculate size for:', key.url);
      }
    }

    return totalSize;
  }

  /**
   * Sync data now
   */
  async syncNow() {
    console.log('Starting background sync...');

    try {
      // Sync cart data
      await this.syncCart();

      // Sync user preferences
      await this.syncUserPreferences();

      // Sync analytics data
      await this.syncAnalytics();

      console.log('Background sync completed');
    } catch (error) {
      console.warn('Background sync failed:', error);
    }
  }

  /**
   * Sync cart data
   */
  async syncCart() {
    // Implementation depends on your cart structure
    const cartData = await this.getStoredCartData();
    if (cartData) {
      // Send to server
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      });
    }
  }

  /**
   * Sync user preferences
   */
  async syncUserPreferences() {
    // Implementation depends on your preference structure
    const preferences = await this.getStoredPreferences();
    if (preferences) {
      // Send to server
      await fetch('/api/preferences/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
    }
  }

  /**
   * Sync analytics data
   */
  async syncAnalytics() {
    // Implementation depends on your analytics setup
    const analyticsData = await this.getStoredAnalytics();
    if (analyticsData && analyticsData.length > 0) {
      // Send to analytics service
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analyticsData)
      });
    }
  }

  /**
   * Get stored cart data
   */
  async getStoredCartData() {
    // This would typically read from IndexedDB
    return null; // Placeholder
  }

  /**
   * Get stored preferences
   */
  async getStoredPreferences() {
    // This would typically read from IndexedDB
    return null; // Placeholder
  }

  /**
   * Get stored analytics
   */
  async getStoredAnalytics() {
    // This would typically read from IndexedDB
    return []; // Placeholder
  }

  /**
   * Handle push notifications
   */
  async handlePush(event) {
    const options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification('Ravan Fashion', options)
    );
  }

  /**
   * Handle notification clicks
   */
  async handleNotificationClick(event) {
    event.notification.close();

    const action = event.action;
    const data = event.notification.data;

    if (action === 'explore') {
      event.waitUntil(
        clients.openWindow('/collections/new-arrivals')
      );
    } else {
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  }

  /**
   * Handle background sync
   */
  async handleBackgroundSync(event) {
    if (event.tag === 'cart-sync') {
      event.waitUntil(this.syncCart());
    } else if (event.tag === 'analytics-sync') {
      event.waitUntil(this.syncAnalytics());
    }
  }
}

// Initialize service worker
const serviceWorker = new OptimizedServiceWorker();

// Event listeners
self.addEventListener('install', (event) => {
  event.waitUntil(serviceWorker.install(event));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(serviceWorker.activate(event));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(serviceWorker.fetch(event));
});

self.addEventListener('message', (event) => {
  event.waitUntil(serviceWorker.message(event));
});

self.addEventListener('push', (event) => {
  event.waitUntil(serviceWorker.handlePush(event));
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(serviceWorker.handleNotificationClick(event));
});

self.addEventListener('sync', (event) => {
  event.waitUntil(serviceWorker.handleBackgroundSync(event));
});