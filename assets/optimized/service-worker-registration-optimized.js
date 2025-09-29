/**
 * RAVAN FASHION - OPTIMIZED SERVICE WORKER REGISTRATION
 * Service worker registration with advanced features
 *
 * Features:
 * - Automatic service worker registration
 * - Update notifications
 * - Offline support detection
 * - Cache management
 * - Performance monitoring
 */

class OptimizedServiceWorkerRegistration {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator;
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;

    this.init();
  }

  init() {
    if (!this.isSupported) {
      console.warn('Service Worker not supported');
      return;
    }

    this.registerServiceWorker();
    this.setupOnlineMonitoring();
    this.setupUpdateMonitoring();
    this.setupCacheManagement();
    this.setupPerformanceMonitoring();
  }

  /**
   * Register service worker
   */
  async registerServiceWorker() {
    try {
      // Unregister old service workers first
      await this.unregisterOldServiceWorkers();

      // Register new service worker
      this.registration = await navigator.serviceWorker.register(
        '/assets/optimized/service-worker-optimized.js',
        {
          scope: '/',
          updateViaCache: 'none'
        }
      );

      console.log('Service Worker registered successfully');

      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Initialize service worker communication
      this.setupServiceWorkerCommunication();

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  /**
   * Unregister old service workers
   */
  async unregisterOldServiceWorkers() {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        if (registration.active && registration.active.scriptURL.includes('service-worker-optimized.js')) {
          // Don't unregister the current version
          continue;
        }

        await registration.unregister();
        console.log('Unregistered old service worker:', registration.active?.scriptURL);
      }
    } catch (error) {
      console.warn('Failed to unregister old service workers:', error);
    }
  }

  /**
   * Handle service worker update found
   */
  handleUpdateFound() {
    const installingWorker = this.registration.installing;

    installingWorker.addEventListener('statechange', () => {
      if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version available
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  /**
   * Notify user about update
   */
  notifyUpdateAvailable() {
    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-notification__content">
        <span class="update-notification__text">New version available!</span>
        <button class="update-notification__button" onclick="this.updateServiceWorker()">
          Update Now
        </button>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--ravan-saffron);
        color: var(--ravan-white);
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      }

      .update-notification__content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .update-notification__text {
        font-weight: 600;
        font-size: 14px;
      }

      .update-notification__button {
        background: var(--ravan-white);
        color: var(--ravan-saffron);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .update-notification__button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(notification);

    // Update button click handler
    notification.querySelector('.update-notification__button').onclick = () => {
      this.updateServiceWorker();
      notification.remove();
    };

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 30000);
  }

  /**
   * Update service worker
   */
  updateServiceWorker() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  /**
   * Setup service worker communication
   */
  setupServiceWorkerCommunication() {
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'CACHE_STATS':
          this.handleCacheStats(data);
          break;

        case 'OFFLINE_READY':
          this.handleOfflineReady();
          break;

        case 'UPDATE_AVAILABLE':
          this.handleUpdateAvailable();
          break;

        default:
          console.log('Received message from service worker:', type, data);
      }
    });

    // Send initial message to service worker
    this.sendMessageToServiceWorker({ type: 'INITIALIZE' });
  }

  /**
   * Send message to service worker
   */
  sendMessageToServiceWorker(message) {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage(message);
    }
  }

  /**
   * Handle cache statistics
   */
  handleCacheStats(stats) {
    console.log('Cache Statistics:', stats);

    // Store for debugging
    if ('localStorage' in window) {
      localStorage.setItem('cacheStats', JSON.stringify(stats));
    }

    // Trigger cache cleanup if needed
    this.checkCacheHealth(stats);
  }

  /**
   * Check cache health
   */
  checkCacheHealth(stats) {
    const totalSize = Object.values(stats).reduce((sum, cache) => sum + cache.size, 0);
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (totalSize > maxSize) {
      console.warn('Cache size exceeds limit, triggering cleanup');
      this.cleanupCache();
    }
  }

  /**
   * Cleanup cache
   */
  cleanupCache() {
    this.sendMessageToServiceWorker({ type: 'CLEANUP_CACHE' });
  }

  /**
   * Handle offline ready
   */
  handleOfflineReady() {
    console.log('Offline functionality is ready');
    document.body.classList.add('offline-ready');

    // Store offline readiness
    if ('localStorage' in window) {
      localStorage.setItem('offlineReady', 'true');
    }
  }

  /**
   * Handle update available
   */
  handleUpdateAvailable() {
    this.updateAvailable = true;
    this.notifyUpdateAvailable();
  }

  /**
   * Setup online monitoring
   */
  setupOnlineMonitoring() {
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.handleOffline();
    });
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.isOnline = true;
    document.body.classList.remove('offline');
    document.body.classList.add('online');

    console.log('Connection restored');

    // Sync data when coming back online
    this.syncOfflineData();
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.isOnline = false;
    document.body.classList.remove('online');
    document.body.classList.add('offline');

    console.log('Connection lost, offline mode activated');

    // Show offline notification
    this.showOfflineNotification();
  }

  /**
   * Show offline notification
   */
  showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <div class="offline-notification__content">
        <span class="offline-notification__text">You're offline. Some features may be limited.</span>
        <button class="offline-notification__button" onclick="this.hideOfflineNotification()">
          Dismiss
        </button>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .offline-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--ravan-maroon);
        color: var(--ravan-white);
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
      }

      .offline-notification__content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .offline-notification__text {
        font-weight: 600;
        font-size: 14px;
      }

      .offline-notification__button {
        background: var(--ravan-white);
        color: var(--ravan-maroon);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .offline-notification__button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(notification);

    // Dismiss button click handler
    notification.querySelector('.offline-notification__button').onclick = () => {
      notification.remove();
    };

    // Auto-dismiss when coming back online
    window.addEventListener('online', () => {
      notification.remove();
    }, { once: true });
  }

  /**
   * Sync offline data
   */
  async syncOfflineData() {
    console.log('Syncing offline data...');

    try {
      // Sync cart
      await this.syncCart();

      // Sync analytics
      await this.syncAnalytics();

      // Sync user preferences
      await this.syncPreferences();

      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  /**
   * Sync cart
   */
  async syncCart() {
    const offlineCart = localStorage.getItem('offlineCart');
    if (offlineCart) {
      try {
        const cartData = JSON.parse(offlineCart);
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cartData)
        });
        localStorage.removeItem('offlineCart');
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  }

  /**
   * Sync analytics
   */
  async syncAnalytics() {
    const offlineEvents = localStorage.getItem('offlineEvents');
    if (offlineEvents) {
      try {
        const events = JSON.parse(offlineEvents);
        for (const event of events) {
          await this.sendAnalyticsEvent(event);
        }
        localStorage.removeItem('offlineEvents');
      } catch (error) {
        console.error('Failed to sync analytics:', error);
      }
    }
  }

  /**
   * Send analytics event
   */
  async sendAnalyticsEvent(event) {
    // Implementation depends on your analytics setup
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, event.parameters);
    }
  }

  /**
   * Sync preferences
   */
  async syncPreferences() {
    const offlinePreferences = localStorage.getItem('offlinePreferences');
    if (offlinePreferences) {
      try {
        const preferences = JSON.parse(offlinePreferences);
        await fetch('/api/preferences/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(preferences)
        });
        localStorage.removeItem('offlinePreferences');
      } catch (error) {
        console.error('Failed to sync preferences:', error);
      }
    }
  }

  /**
   * Setup update monitoring
   */
  setupUpdateMonitoring() {
    // Check for updates every hour
    setInterval(() => {
      this.checkForUpdates();
    }, 60 * 60 * 1000);

    // Check for updates on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  /**
   * Check for updates
   */
  checkForUpdates() {
    if (this.registration) {
      this.registration.update();
    }
  }

  /**
   * Setup cache management
   */
  setupCacheManagement() {
    // Setup periodic cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, 24 * 60 * 60 * 1000); // Daily

    // Setup cache size monitoring
    this.monitorCacheSize();
  }

  /**
   * Monitor cache size
   */
  async monitorCacheSize() {
    try {
      const stats = await this.getCacheStats();
      this.handleCacheStats(stats);
    } catch (error) {
      console.error('Failed to monitor cache size:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return new Promise((resolve) => {
      if (this.registration && this.registration.active) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.data);
        };

        this.registration.active.postMessage({
          type: 'GET_CACHE_STATS'
        }, [messageChannel.port2]);
      } else {
        resolve({});
      }
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor page load performance
    this.monitorPageLoad();

    // Monitor service worker performance
    this.monitorServiceWorkerPerformance();

    // Monitor cache performance
    this.monitorCachePerformance();
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoad() {
    window.addEventListener('load', () => {
      const performance = window.performance;

      if (performance && performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');

        this.analyzePerformance(navigation, resources);
      }
    });
  }

  /**
   * Analyze performance metrics
   */
  analyzePerformance(navigation, resources) {
    const metrics = {
      pageLoad: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domReady: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      resourceCount: resources.length,
      resourceSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      cacheHits: resources.filter(resource => resource.transferSize === 0).length
    };

    console.log('Performance Metrics:', metrics);

    // Store metrics for analysis
    this.storePerformanceMetrics(metrics);

    // Check performance thresholds
    this.checkPerformanceThresholds(metrics);
  }

  /**
   * Store performance metrics
   */
  storePerformanceMetrics(metrics) {
    try {
      const storedMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
      storedMetrics.push({
        ...metrics,
        timestamp: Date.now()
      });

      // Keep only last 100 entries
      if (storedMetrics.length > 100) {
        storedMetrics.splice(0, storedMetrics.length - 100);
      }

      localStorage.setItem('performanceMetrics', JSON.stringify(storedMetrics));
    } catch (error) {
      console.error('Failed to store performance metrics:', error);
    }
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds(metrics) {
    const thresholds = {
      pageLoad: 3000, // 3 seconds
      domReady: 1500, // 1.5 seconds
      resourceSize: 2 * 1024 * 1024 // 2MB
    };

    if (metrics.pageLoad > thresholds.pageLoad) {
      console.warn('Page load time exceeds threshold:', metrics.pageLoad);
    }

    if (metrics.domReady > thresholds.domReady) {
      console.warn('DOM ready time exceeds threshold:', metrics.domReady);
    }

    if (metrics.resourceSize > thresholds.resourceSize) {
      console.warn('Resource size exceeds threshold:', metrics.resourceSize);
    }
  }

  /**
   * Monitor service worker performance
   */
  monitorServiceWorkerPerformance() {
    // Monitor service worker message handling
    let messageCount = 0;
    let messageStartTime = Date.now();

    navigator.serviceWorker.addEventListener('message', () => {
      messageCount++;

      if (messageCount % 100 === 0) {
        const averageTime = (Date.now() - messageStartTime) / messageCount;
        console.log(`Average service worker message time: ${averageTime}ms`);
      }
    });
  }

  /**
   * Monitor cache performance
   */
  monitorCachePerformance() {
    // Monitor cache hit rate
    let cacheHits = 0;
    let cacheMisses = 0;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const result = await originalFetch(...args);

      // This is a simplified cache hit/miss detection
      // In a real implementation, you'd need to integrate with your service worker

      return result;
    };
  }

  /**
   * Get current registration status
   */
  getRegistrationStatus() {
    return {
      isSupported: this.isSupported,
      isRegistered: !!this.registration,
      isOnline: this.isOnline,
      updateAvailable: this.updateAvailable,
      controller: navigator.serviceWorker.controller ? true : false
    };
  }

  /**
   * Force service worker update
   */
  async forceUpdate() {
    if (this.registration) {
      await this.registration.update();
      this.updateServiceWorker();
    }
  }

  /**
   * Unregister service worker
   */
  async unregister() {
    if (this.registration) {
      await this.registration.unregister();
      this.registration = null;
      console.log('Service Worker unregistered');
    }
  }
}

// Initialize service worker registration
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.serviceWorkerRegistration = new OptimizedServiceWorkerRegistration();
  });
} else {
  window.serviceWorkerRegistration = new OptimizedServiceWorkerRegistration();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedServiceWorkerRegistration;
}