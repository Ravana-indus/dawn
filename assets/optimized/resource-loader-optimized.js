/**
 * RAVAN FASHION - OPTIMIZED RESOURCE LOADING STRATEGIES
 * Comprehensive resource loading optimization for Shopify themes
 *
 * Features:
 * - Critical resource preloading
 * - Smart prefetching strategies
 * - Async/defer script loading
 * - Resource priority management
 * - Performance budget monitoring
 * - Dynamic import optimization
 */

class OptimizedResourceLoader {
  constructor() {
    this.loadedResources = new Set();
    this.preloadedResources = new Set();
    this.loadingPromises = new Map();
    this.performanceBudget = {
      javascript: 500000, // 500KB
      css: 100000,      // 100KB
      images: 1000000,  // 1MB
      fonts: 50000      // 50KB
    };

    this.init();
  }

  init() {
    this.setupResourceHints();
    this.setupCriticalResourceLoading();
    this.setupPerformanceMonitoring();
    this.setupSmartPrefetching();
    this.setupDynamicImportOptimization();
    this.setupResourcePrioritization();
  }

  /**
   * Setup resource hints for better performance
   */
  setupResourceHints() {
    // Preconnect to external domains
    this.preconnectDomains();

    // DNS prefetch for third-party resources
    this.dnsPrefetchDomains();

    // Preload critical resources
    this.preloadCriticalResources();
  }

  /**
   * Preconnect to external domains
   */
  preconnectDomains() {
    const domains = [
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://images.unsplash.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * DNS prefetch for third-party resources
   */
  dnsPrefetchDomains() {
    const domains = [
      'https://www.google-analytics.com',
      'https://connect.facebook.net',
      'https://platform.twitter.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    // Critical CSS
    const criticalCss = document.querySelector('link[href*="critical"]');
    if (criticalCss) {
      criticalCss.rel = 'preload';
      criticalCss.as = 'style';
      criticalCss.onload = function() {
        this.rel = 'stylesheet';
      };
    }

    // Critical fonts
    const fonts = document.querySelectorAll('link[href*="woff2"]');
    fonts.forEach(font => {
      font.rel = 'preload';
      font.as = 'font';
      font.crossOrigin = 'anonymous';
    });

    // Critical JavaScript
    const criticalJs = document.querySelectorAll('script[data-critical="true"]');
    criticalJs.forEach(script => {
      this.preloadScript(script.src, 'high');
    });
  }

  /**
   * Setup critical resource loading
   */
  setupCriticalResourceLoading() {
    // Load critical CSS inline
    this.loadCriticalCss();

    // Load critical JavaScript with high priority
    this.loadCriticalJavaScript();

    // Load critical fonts
    this.loadCriticalFonts();
  }

  /**
   * Load critical CSS inline
   */
  loadCriticalCss() {
    const criticalStyles = document.getElementById('critical-css');
    if (criticalStyles) {
      // Already inline, no action needed
      return;
    }

    // Move critical CSS to head
    const criticalCssLinks = document.querySelectorAll('link[data-critical="true"]');
    criticalCssLinks.forEach(link => {
      this.fetchAndInlineCss(link.href);
    });
  }

  /**
   * Fetch and inline CSS
   */
  async fetchAndInlineCss(url) {
    try {
      const response = await fetch(url);
      const css = await response.text();

      const style = document.createElement('style');
      style.textContent = css;
      style.id = 'critical-css';
      document.head.appendChild(style);

      // Remove original link
      const originalLink = document.querySelector(`link[href="${url}"]`);
      if (originalLink) {
        originalLink.remove();
      }
    } catch (error) {
      console.warn('Failed to inline critical CSS:', error);
    }
  }

  /**
   * Load critical JavaScript
   */
  loadCriticalJavaScript() {
    const criticalScripts = document.querySelectorAll('script[data-critical="true"]');

    criticalScripts.forEach(script => {
      if (script.src) {
        this.loadScript(script.src, {
          priority: 'high',
          async: false,
          defer: false
        });
      }
    });
  }

  /**
   * Load critical fonts
   */
  loadCriticalFonts() {
    const fontLinks = document.querySelectorAll('link[data-critical="true"][href*="font"]');

    fontLinks.forEach(link => {
      const font = new FontFace(
        link.dataset.fontFamily || 'Custom Font',
        `url(${link.href})`,
        { weight: link.dataset.fontWeight || '400' }
      );

      font.load().then(loadedFont => {
        document.fonts.add(loadedFont);
        document.body.classList.add('fonts-loaded');
      }).catch(error => {
        console.warn('Failed to load font:', error);
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor resource timing
    this.monitorResourceTiming();

    // Monitor performance budget
    this.monitorPerformanceBudget();

    // Track loading metrics
    this.trackLoadingMetrics();
  }

  /**
   * Monitor resource timing
   */
  monitorResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Monitor page load
      window.addEventListener('load', () => {
        const resources = performance.getEntriesByType('resource');
        this.analyzeResourceTiming(resources);
      });
    }
  }

  /**
   * Analyze resource timing
   */
  analyzeResourceTiming(resources) {
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      totalTime: 0,
      byType: {}
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      const duration = resource.duration || 0;
      const type = resource.initiatorType;

      analysis.totalSize += size;
      analysis.totalTime += duration;

      if (!analysis.byType[type]) {
        analysis.byType[type] = {
          count: 0,
          size: 0,
          time: 0
        };
      }

      analysis.byType[type].count++;
      analysis.byType[type].size += size;
      analysis.byType[type].time += duration;
    });

    this.storePerformanceMetrics(analysis);
  }

  /**
   * Monitor performance budget
   */
  monitorPerformanceBudget() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.initiatorType === 'script') {
          this.checkJavaScriptBudget(entry);
        } else if (entry.initiatorType === 'css') {
          this.checkCssBudget(entry);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Performance Observer not supported');
    }
  }

  /**
   * Check JavaScript budget
   */
  checkJavaScriptBudget(entry) {
    const size = entry.transferSize || 0;
    this.performanceBudget.javascript -= size;

    if (this.performanceBudget.javascript < 0) {
      console.warn('JavaScript budget exceeded');
      this.triggerBudgetAlert('javascript');
    }
  }

  /**
   * Check CSS budget
   */
  checkCssBudget(entry) {
    const size = entry.transferSize || 0;
    this.performanceBudget.css -= size;

    if (this.performanceBudget.css < 0) {
      console.warn('CSS budget exceeded');
      this.triggerBudgetAlert('css');
    }
  }

  /**
   * Setup smart prefetching
   */
  setupSmartPrefetching() {
    // Prefetch resources on hover
    this.setupHoverPrefetching();

    // Prefetch resources on visibility
    this.setupVisibilityPrefetching();

    // Prefetch resources based on user behavior
    this.setupBehavioralPrefetching();
  }

  /**
   * Setup hover prefetching
   */
  setupHoverPrefetching() {
    const prefetchLinks = document.querySelectorAll('a[data-prefetch="hover"]');

    prefetchLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.prefetchLink(link.href);
      }, { once: true });
    });
  }

  /**
   * Setup visibility prefetching
   */
  setupVisibilityPrefetching() {
    const prefetchElements = document.querySelectorAll('[data-prefetch="visible"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const resourceUrl = element.dataset.prefetchUrl;

          if (resourceUrl) {
            this.prefetchResource(resourceUrl);
            observer.unobserve(element);
          }
        }
      });

      this.observePrefetchElements(prefetchElements, observer);
    });
  }

  /**
   * Setup behavioral prefetching
   */
  setupBehavioralPrefetching() {
    // Prefetch based on scroll position
    this.setupScrollPrefetching();

    // Prefetch based on time on page
    this.setupTimeBasedPrefetching();
  }

  /**
   * Setup scroll prefetching
   */
  setupScrollPrefetching() {
    let scrollTimeout;
    const prefetchThreshold = 0.8; // 80% scroll

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

        if (scrollPercentage > prefetchThreshold) {
          this.prefetchNextPageResources();
        }
      }, 1000);
    }, { passive: true });
  }

  /**
   * Setup time-based prefetching
   */
  setupTimeBasedPrefetching() {
    const prefetchDelay = 5000; // 5 seconds

    setTimeout(() => {
      this.prefetchSecondaryResources();
    }, prefetchDelay);
  }

  /**
   * Setup dynamic import optimization
   */
  setupDynamicImportOptimization() {
    // Optimize dynamic imports
    this.optimizeDynamicImports();

    // Cache dynamic imports
    this.cacheDynamicImports();
  }

  /**
   * Optimize dynamic imports
   */
  optimizeDynamicImports() {
    // Override dynamic import for optimization
    const originalImport = window.import;

    window.import = async (url) => {
      const cacheKey = `dynamic_${url}`;

      if (this.loadingPromises.has(cacheKey)) {
        return this.loadingPromises.get(cacheKey);
      }

      const promise = originalImport(url).then(module => {
        this.loadingPromises.delete(cacheKey);
        return module;
      }).catch(error => {
        this.loadingPromises.delete(cacheKey);
        throw error;
      });

      this.loadingPromises.set(cacheKey, promise);
      return promise;
    };
  }

  /**
   * Cache dynamic imports
   */
  cacheDynamicImports() {
    // Cache frequently used modules
    const frequentModules = [
      '/assets/optimized/cultural-spotlight-optimized.js',
      '/assets/optimized/design-story-optimized.js'
    ];

    frequentModules.forEach(module => {
      this.preloadResource(module);
    });
  }

  /**
   * Setup resource prioritization
   */
  setupResourcePrioritization() {
    // Set fetch priorities
    this.setFetchPriorities();

    // Manage loading order
    this.manageLoadingOrder();
  }

  /**
   * Set fetch priorities
   */
  setFetchPriorities() {
    // High priority resources
    const highPriorityResources = document.querySelectorAll('[data-priority="high"]');
    highPriorityResources.forEach(resource => {
      resource.fetchPriority = 'high';
    });

    // Low priority resources
    const lowPriorityResources = document.querySelectorAll('[data-priority="low"]');
    lowPriorityResources.forEach(resource => {
      resource.fetchPriority = 'low';
    });
  }

  /**
   * Manage loading order
   */
  manageLoadingOrder() {
    // Load scripts in order of importance
    this.loadScriptsInOrder();

    // Load CSS with appropriate media
    this.loadCssWithMedia();
  }

  /**
   * Load scripts in order
   */
  loadScriptsInOrder() {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const prioritizedScripts = this.prioritizeScripts(scripts);

    prioritizedScripts.forEach((script, index) => {
      if (script.dataset.priority === 'high') {
        // Load immediately
        this.loadScript(script.src, { priority: 'high' });
      } else if (script.dataset.priority === 'low') {
        // Load with low priority
        this.loadScript(script.src, { priority: 'low', async: true });
      } else {
        // Load with normal priority
        this.loadScript(script.src, { priority: 'normal', async: true, defer: true });
      }
    });
  }

  /**
   * Prioritize scripts
   */
  prioritizeScripts(scripts) {
    return scripts.sort((a, b) => {
      const priorities = { high: 3, normal: 2, low: 1 };
      const aPriority = priorities[a.dataset.priority] || 2;
      const bPriority = priorities[b.dataset.priority] || 2;

      return bPriority - aPriority;
    });
  }

  /**
   * Load CSS with media
   */
  loadCssWithMedia() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');

    cssLinks.forEach(link => {
      if (link.dataset.media) {
        link.media = link.dataset.media;
      }
    });
  }

  /**
   * Load script with options
   */
  loadScript(url, options = {}) {
    if (this.loadedResources.has(url)) {
      return Promise.resolve();
    }

    const script = document.createElement('script');
    script.src = url;

    if (options.async) script.async = true;
    if (options.defer) script.defer = true;
    if (options.priority) script.dataset.priority = options.priority;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        this.loadedResources.add(url);
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Preload script
   */
  preloadScript(url, priority = 'auto') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    link.fetchPriority = priority;

    document.head.appendChild(link);
  }

  /**
   * Prefetch resource
   */
  prefetchResource(url) {
    if (this.preloadedResources.has(url)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;

    document.head.appendChild(link);
    this.preloadedResources.add(url);
  }

  /**
   * Prefetch link
   */
  prefetchLink(url) {
    this.prefetchResource(url);
  }

  /**
   * Preload resource
   */
  preloadResource(url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    // Determine resource type
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'css':
        link.as = 'style';
        break;
      case 'js':
        link.as = 'script';
        break;
      case 'woff':
      case 'woff2':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        link.as = 'image';
        break;
      default:
        link.as = 'fetch';
    }

    document.head.appendChild(link);
  }

  /**
   * Prefetch next page resources
   */
  prefetchNextPageResources() {
    // Implementation depends on your routing setup
    const nextPageUrl = this.getNextPageUrl();
    if (nextPageUrl) {
      this.prefetchLink(nextPageUrl);
    }
  }

  /**
   * Prefetch secondary resources
   */
  prefetchSecondaryResources() {
    const secondaryResources = [
      '/assets/optimized/non-critical-resources.js',
      '/assets/optimized/additional-styles.css'
    ];

    secondaryResources.forEach(resource => {
      this.prefetchResource(resource);
    });
  }

  /**
   * Get next page URL
   */
  getNextPageUrl() {
    // Implement based on your navigation structure
    const nextLink = document.querySelector('a[rel="next"]');
    return nextLink ? nextLink.href : null;
  }

  /**
   * Store performance metrics
   */
  storePerformanceMetrics(metrics) {
    // Store in sessionStorage for analytics
    try {
      sessionStorage.setItem('performanceMetrics', JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to store performance metrics:', error);
    }
  }

  /**
   * Trigger budget alert
   */
  triggerBudgetAlert(type) {
    // Implement budget alert logic
    console.warn(`Performance budget exceeded for ${type}`);

    // Send analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'budget_exceeded', {
        event_category: 'performance',
        event_label: type
      });
    }
  }

  /**
   * Observe prefetch elements
   */
  observePrefetchElements(elements, observer) {
    elements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    try {
      const metrics = sessionStorage.getItem('performanceMetrics');
      return metrics ? JSON.parse(metrics) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear resource cache
   */
  clearCache() {
    this.loadedResources.clear();
    this.preloadedResources.clear();
    this.loadingPromises.clear();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.optimizedResourceLoader = new OptimizedResourceLoader();
  });
} else {
  window.optimizedResourceLoader = new OptimizedResourceLoader();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedResourceLoader;
}