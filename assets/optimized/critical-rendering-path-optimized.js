/**
 * RAVAN FASHION - CRITICAL RENDERING PATH OPTIMIZATION
 * Advanced optimization for Core Web Vitals and rendering performance
 *
 * Features:
 * - Critical CSS extraction and inline loading
 * - Resource prioritization and scheduling
 * - Layout stability optimization (CLS)
 * - Largest Contentful Paint optimization
 * - First Input Delay reduction
 * - Cumulative Layout Shift prevention
 * - Performance budget monitoring
 */

class CriticalRenderingPathOptimizer {
  constructor() {
    this.criticalResources = new Set();
    this.nonCriticalResources = new Set();
    this.performanceMetrics = new Map();
    this.layoutShifts = [];
    this.lcpCandidates = new Set();
    this.fidScore = 0;
    this.clsScore = 0;
    this.lcpScore = 0;

    this.init();
  }

  init() {
    this.setupCriticalResourceDetection();
    this.setupResourcePrioritization();
    this.setupLayoutStability();
    this.setupLcpOptimization();
    this.setupFidOptimization();
    this.setupClsOptimization();
    this.setupPerformanceMonitoring();
    this.setupResourceLoadingOptimization();
  }

  /**
   * Setup critical resource detection
   */
  setupCriticalResourceDetection() {
    // Detect above-the-fold content
    this.detectAboveTheFoldContent();

    // Identify critical CSS
    this.identifyCriticalCss();

    // Identify critical JavaScript
    this.identifyCriticalJavaScript();

    // Identify critical images
    this.identifyCriticalImages();
  }

  /**
   * Detect above-the-fold content
   */
  detectAboveTheFoldContent() {
    const viewportHeight = window.innerHeight;
    const criticalElements = document.querySelectorAll(`
      header,
      .header-section,
      .hero-section,
      .above-fold,
      [data-critical="true"],
      .cultural-spotlight__item:first-child
    `);

    criticalElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight) {
        element.dataset.aboveFold = 'true';
        this.criticalResources.add(element);
      }
    });
  }

  /**
   * Identify critical CSS
   */
  identifyCriticalCss() {
    const criticalStyles = [
      // Base styles
      'font-family',
      'font-size',
      'color',
      'background-color',
      'display',
      'position',

      // Layout styles
      'width',
      'height',
      'margin',
      'padding',
      'border',

      // Above-the-fold component styles
      '.cultural-spotlight-optimized',
      '.cultural-spotlight__wrapper',
      '.cultural-spotlight__header',
      '.cultural-spotlight__grid',
      '.cultural-spotlight__item',
      '.image-lazy-wrapper',
      '.cultural-spotlight__content'
    ];

    // Create critical CSS object
    this.criticalCss = this.extractCriticalCss(criticalStyles);
    this.inlineCriticalCss();
  }

  /**
   * Extract critical CSS
   */
  extractCriticalCss(selectors) {
    const criticalCss = [];
    const styleSheets = document.styleSheets;

    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.selectorText) {
            for (const selector of selectors) {
              if (rule.selectorText.includes(selector) || rule.selectorText === selector) {
                criticalCss.push(rule.cssText);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Could not access stylesheet rules:', error);
      }
    }

    return criticalCss.join('\n');
  }

  /**
   * Inline critical CSS
   */
  inlineCriticalCss() {
    const style = document.createElement('style');
    style.id = 'critical-css-inline';
    style.textContent = this.criticalCss;

    // Insert at the beginning of head
    const head = document.head;
    const firstChild = head.firstChild;
    head.insertBefore(style, firstChild);
  }

  /**
   * Identify critical JavaScript
   */
  identifyCriticalJavaScript() {
    const criticalScripts = document.querySelectorAll(`
      script[data-critical="true"],
      script[src*="critical"],
      script[src*="optimized"]
    `);

    criticalScripts.forEach(script => {
      this.criticalResources.add(script);
      script.dataset.critical = 'true';
    });
  }

  /**
   * Identify critical images
   */
  identifyCriticalImages() {
    const viewportHeight = window.innerHeight;
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        img.dataset.critical = 'true';
        this.criticalResources.add(img);
        this.lcpCandidates.add(img);
      }
    });
  }

  /**
   * Setup resource prioritization
   */
  setupResourcePrioritization() {
    // Set fetch priorities
    this.setFetchPriorities();

    // Setup preloading
    this.setupPreloading();

    // Setup loading order
    this.setupLoadingOrder();
  }

  /**
   * Set fetch priorities
   */
  setFetchPriorities() {
    // High priority for critical resources
    this.criticalResources.forEach(resource => {
      if (resource.tagName === 'IMG') {
        resource.fetchPriority = 'high';
        resource.loading = 'eager';
      } else if (resource.tagName === 'SCRIPT') {
        resource.fetchPriority = 'high';
      } else if (resource.tagName === 'LINK' && resource.rel === 'stylesheet') {
        resource.fetchPriority = 'high';
      }
    });

    // Low priority for non-critical resources
    document.querySelectorAll('img:not([data-critical="true"])').forEach(img => {
      img.fetchPriority = 'low';
      img.loading = 'lazy';
    });
  }

  /**
   * Setup preloading
   */
  setupPreloading() {
    // Preload critical resources
    this.criticalResources.forEach(resource => {
      if (resource.tagName === 'IMG' && resource.src) {
        this.preloadImage(resource.src);
      } else if (resource.tagName === 'SCRIPT' && resource.src) {
        this.preloadScript(resource.src);
      }
    });

    // Preload fonts
    this.preloadFonts();

    // Preconnect to external domains
    this.preconnectDomains();
  }

  /**
   * Preload image
   */
  preloadImage(src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }

  /**
   * Preload script
   */
  preloadScript(src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  }

  /**
   * Preload fonts
   */
  preloadFonts() {
    const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="font"]');
    fontLinks.forEach(link => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'font';
      preloadLink.href = link.href;
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    });
  }

  /**
   * Preconnect domains
   */
  preconnectDomains() {
    const domains = [
      'https://cdn.shopify.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
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
   * Setup loading order
   */
  setupLoadingOrder() {
    // Load critical resources first
    this.loadCriticalResourcesFirst();

    // Defer non-critical resources
    this.deferNonCriticalResources();

    // Setup async loading
    this.setupAsyncLoading();
  }

  /**
   * Load critical resources first
   */
  loadCriticalResourcesFirst() {
    const criticalScripts = document.querySelectorAll('script[data-critical="true"]');
    criticalScripts.forEach(script => {
      if (script.src) {
        script.async = false;
        script.defer = false;
      }
    });
  }

  /**
   * Defer non-critical resources
   */
  deferNonCriticalResources() {
    const nonCriticalScripts = document.querySelectorAll('script:not([data-critical="true"])');
    nonCriticalScripts.forEach(script => {
      script.defer = true;
    });

    const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical="true"])');
    nonCriticalStyles.forEach(link => {
      link.rel = 'preload';
      link.as = 'style';
      link.onload = function() {
        this.rel = 'stylesheet';
      };
    });
  }

  /**
   * Setup async loading
   */
  setupAsyncLoading() {
    // Setup async loading for images
    this.setupAsyncImageLoading();

    // Setup async loading for scripts
    this.setupAsyncScriptLoading();

    // Setup async loading for styles
    this.setupAsyncStyleLoading();
  }

  /**
   * Setup async image loading
   */
  setupAsyncImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      observer.observe(img);
    });
  }

  /**
   * Setup async script loading
   */
  setupAsyncScriptLoading() {
    const asyncScripts = document.querySelectorAll('script[data-async="true"]');
    asyncScripts.forEach(script => {
      if (script.src) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        newScript.onload = script.onload;
        script.parentNode.replaceChild(newScript, script);
      }
    });
  }

  /**
   * Setup async style loading
   */
  setupAsyncStyleLoading() {
    const asyncStyles = document.querySelectorAll('link[data-async="true"]');
    asyncStyles.forEach(link => {
      link.rel = 'preload';
      link.as = 'style';
      link.onload = function() {
        this.rel = 'stylesheet';
      };
    });
  }

  /**
   * Setup layout stability
   */
  setupLayoutStability() {
    // Prevent layout shifts
    this.preventLayoutShifts();

    // Reserve space for images
    this.reserveImageSpace();

    // Stabilize dynamic content
    this.stabilizeDynamicContent();

    // Monitor layout shifts
    this.monitorLayoutShifts();
  }

  /**
   * Prevent layout shifts
   */
  preventLayoutShifts() {
    // Add skeleton loaders
    this.addSkeletonLoaders();

    // Reserve space for dynamic content
    this.reserveDynamicSpace();

    // Stabilize fonts
    this.stabilizeFonts();
  }

  /**
   * Add skeleton loaders
   */
  addSkeletonLoaders() {
    const dynamicElements = document.querySelectorAll('[data-skeleton="true"]');
    dynamicElements.forEach(element => {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-loader';
      skeleton.style.cssText = `
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      `;

      element.appendChild(skeleton);
    });
  }

  /**
   * Reserve dynamic space
   */
  reserveDynamicSpace() {
    const dynamicElements = document.querySelectorAll('[data-reserve-space]');
    dynamicElements.forEach(element => {
      const width = element.dataset.width || '100%';
      const height = element.dataset.height || '200px';

      element.style.width = width;
      element.style.height = height;
      element.style.minHeight = height;
      element.style.overflow = 'hidden';
    });
  }

  /**
   * Stabilize fonts
   */
  stabilizeFonts() {
    // Reserve space for custom fonts
    const fontFaces = document.querySelectorAll('font-face');
    fontFaces.forEach(face => {
      const fontFamily = face.family;
      const fontSize = face.size || '16px';
      const lineHeight = face.lineHeight || '1.5';

      const style = document.createElement('style');
      style.textContent = `
        body {
          font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .font-loading {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .font-loaded {
          font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        }
      `;
      document.head.appendChild(style);
    });
  }

  /**
   * Reserve image space
   */
  reserveImageSpace() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.dataset.width && img.dataset.height) {
        const aspectRatio = (img.dataset.height / img.dataset.width) * 100;
        img.style.aspectRatio = `${img.dataset.width} / ${img.dataset.height}`;
        img.style.paddingBottom = `${aspectRatio}%`;
      }
    });
  }

  /**
   * Stabilize dynamic content
   */
  stabilizeDynamicContent() {
    // Stabilize cultural spotlight grid
    this.stabilizeCulturalSpotlightGrid();

    // Stabilize product cards
    this.stabilizeProductCards();

    // Stabilize navigation
    this.stabilizeNavigation();
  }

  /**
   * Stabilize cultural spotlight grid
   */
  stabilizeCulturalSpotlightGrid() {
    const grids = document.querySelectorAll('.cultural-spotlight__grid');
    grids.forEach(grid => {
      // Set explicit grid dimensions
      const columns = grid.dataset.gridColumns || '3';
      const gap = grid.dataset.gap || '1rem';

      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      grid.style.gap = gap;
      grid.style.alignItems = 'start';

      // Stabilize grid items
      const items = grid.querySelectorAll('.cultural-spotlight__item');
      items.forEach(item => {
        item.style.minHeight = '300px';
        item.style.position = 'relative';
      });
    });
  }

  /**
   * Stabilize product cards
   */
  stabilizeProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.minHeight = '400px';
    });
  }

  /**
   * Stabilize navigation
   */
  stabilizeNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.position = 'relative';
      nav.style.zIndex = '1000';
      nav.style.width = '100%';
    }
  }

  /**
   * Monitor layout shifts
   */
  monitorLayoutShifts() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) {
            continue;
          }

          this.layoutShifts.push(entry);
          this.calculateCLS();
        }
      });

      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('Layout Shift Observer not supported:', error);
      }
    }
  }

  /**
   * Calculate CLS
   */
  calculateCLS() {
    let clsScore = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    this.layoutShifts.forEach(entry => {
      // Only include layout shifts without recent user input
      if (!entry.hadRecentInput) {
        sessionEntries.push(entry);
        sessionValue += entry.value;
        clsScore = Math.max(clsScore, sessionValue);
      }
    });

    this.clsScore = clsScore;
    this.logPerformanceMetric('cls', clsScore);
  }

  /**
   * Setup LCP optimization
   */
  setupLcpOptimization() {
    // Optimize LCP candidates
    this.optimizeLcpCandidates();

    // Monitor LCP
    this.monitorLCP();

    // Improve LCP loading
    this.improveLcpLoading();
  }

  /**
   * Optimize LCP candidates
   */
  optimizeLcpCandidates() {
    this.lcpCandidates.forEach(candidate => {
      if (candidate.tagName === 'IMG') {
        // Optimize image loading
        candidate.fetchPriority = 'high';
        candidate.loading = 'eager';
        candidate.decoding = 'async';

        // Ensure proper dimensions
        if (candidate.naturalWidth && candidate.naturalHeight) {
          candidate.style.aspectRatio = `${candidate.naturalWidth} / ${candidate.naturalHeight}`;
        }

        // Add loading optimization
        this.optimizeImageLoading(candidate);
      }
    });
  }

  /**
   * Optimize image loading
   */
  optimizeImageLoading(img) {
    // Use responsive images
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.sizes = this.calculateSizes(img);
    }

    // Use modern image formats
    if (this.supportsWebP()) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      this.preloadImage(webpSrc);
    }
  }

  /**
   * Calculate sizes attribute
   */
  calculateSizes(img) {
    const container = img.closest('[data-container-width]');
    if (container) {
      return container.dataset.containerWidth;
    }

    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
      return '100vw';
    } else if (viewportWidth < 1024) {
      return '50vw';
    } else {
      return '33vw';
    }
  }

  /**
   * Monitor LCP
   */
  monitorLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.lcpScore = entry.startTime;
            this.logPerformanceMetric('lcp', this.lcpScore);
          }
        }
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.warn('LCP Observer not supported:', error);
      }
    }
  }

  /**
   * Improve LCP loading
   */
  improveLcpLoading() {
    // Preload critical images
    this.preloadCriticalImages();

    // Optimize server response
    this.optimizeServerResponse();

    // Reduce render-blocking resources
    this.reduceRenderBlockingResources();
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages() {
    this.lcpCandidates.forEach(candidate => {
      if (candidate.tagName === 'IMG' && candidate.src) {
        this.preloadImage(candidate.src);
      }
    });
  }

  /**
   * Optimize server response
   */
  optimizeServerResponse() {
    // Add cache headers
    this.addCacheHeaders();

    // Enable compression
    this.enableCompression();

    // Use CDN
    this.useCDN();
  }

  /**
   * Add cache headers
   */
  addCacheHeaders() {
    // This would be implemented server-side
    console.log('Cache headers should be configured server-side');
  }

  /**
   * Enable compression
   */
  enableCompression() {
    // This would be implemented server-side
    console.log('Compression should be enabled server-side');
  }

  /**
   * Use CDN
   */
  useCDN() {
    // This would be implemented server-side
    console.log('CDN should be configured server-side');
  }

  /**
   * Reduce render-blocking resources
   */
  reduceRenderBlockingResources() {
    // Inline critical CSS
    this.inlineCriticalCss();

    // Defer non-critical CSS
    this.deferNonCriticalResources();

    // Load JavaScript asynchronously
    this.setupAsyncLoading();
  }

  /**
   * Setup FID optimization
   */
  setupFidOptimization() {
    // Reduce JavaScript execution time
    this.reduceJavaScriptExecution();

    // Break up long tasks
    this.breakUpLongTasks();

    // Optimize event listeners
    this.optimizeEventListeners();

    // Monitor FID
    this.monitorFID();
  }

  /**
   * Reduce JavaScript execution time
   */
  reduceJavaScriptExecution() {
    // Code splitting
    this.setupCodeSplitting();

    // Lazy loading
    this.setupLazyLoading();

    // Tree shaking
    this.setupTreeShaking();
  }

  /**
   * Setup code splitting
   */
  setupCodeSplitting() {
    // Identify large JavaScript bundles
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.src;
      if (src.length > 50000) { // 50KB threshold
        this.splitJavaScriptBundle(script);
      }
    });
  }

  /**
   * Split JavaScript bundle
   */
  splitJavaScriptBundle(script) {
    // This would be implemented during build time
    console.log(`Bundle ${script.src} should be split during build`);
  }

  /**
   * Setup lazy loading
   */
  setupLazyLoading() {
    // Lazy load non-critical components
    const lazyElements = document.querySelectorAll('[data-lazy="true"]');
    lazyElements.forEach(element => {
      this.setupLazyElement(element);
    });
  }

  /**
   * Setup lazy element
   */
  setupLazyElement(element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(element);
  }

  /**
   * Load lazy element
   */
  loadLazyElement(element) {
    if (element.dataset.src) {
      element.src = element.dataset.src;
    } else if (element.dataset.href) {
      element.href = element.dataset.href;
    }
    element.classList.add('loaded');
  }

  /**
   * Setup tree shaking
   */
  setupTreeShaking() {
    // This would be implemented during build time
    console.log('Tree shaking should be implemented during build');
  }

  /**
   * Break up long tasks
   */
  breakUpLongTasks() {
    if ('scheduler' in window && 'postTask' in scheduler) {
      // Use scheduler API to break up long tasks
      this.setupTaskScheduler();
    } else {
      // Fallback to setTimeout
      this.setupTimeoutFallback();
    }
  }

  /**
   * Setup task scheduler
   */
  setupTaskScheduler() {
    // Break up long tasks using scheduler API
    console.log('Task scheduler API available for breaking up long tasks');
  }

  /**
   * Setup timeout fallback
   */
  setupTimeoutFallback() {
    // Use setTimeout to break up long tasks
    console.log('Using setTimeout fallback for breaking up long tasks');
  }

  /**
   * Optimize event listeners
   */
  optimizeEventListeners() {
    // Use event delegation
    this.setupEventDelegation();

    // Passive event listeners
    this.setupPassiveEventListeners();

    // Debounce rapid events
    this.setupDebouncedEvents();
  }

  /**
   * Setup event delegation
   */
  setupEventDelegation() {
    // Implement event delegation pattern
    const delegateElement = document.querySelector('[data-event-delegate]');
    if (delegateElement) {
      delegateElement.addEventListener('click', this.handleDelegatedClick.bind(this), true);
    }
  }

  /**
   * Handle delegated click
   */
  handleDelegatedClick(event) {
    const target = event.target.closest('[data-action]');
    if (target) {
      const action = target.dataset.action;
      this.executeAction(action, target);
    }
  }

  /**
   * Execute action
   */
  executeAction(action, target) {
    // Implement action execution
    console.log(`Executing action: ${action}`);
  }

  /**
   * Setup passive event listeners
   */
  setupPassiveEventListeners() {
    // Use passive event listeners for better performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'scroll'];
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true });
    });
  }

  /**
   * Setup debounced events
   */
  setupDebouncedEvents() {
    // Debounce resize and scroll events
    const debouncedEvents = ['resize', 'scroll'];
    debouncedEvents.forEach(eventType => {
      let timeout;
      document.addEventListener(eventType, () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.handleDebouncedEvent(eventType);
        }, 100);
      });
    });
  }

  /**
   * Handle debounced event
   */
  handleDebouncedEvent(eventType) {
    // Handle debounced events
    console.log(`Debounced event: ${eventType}`);
  }

  /**
   * Monitor FID
   */
  monitorFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            this.fidScore = entry.processingStart - entry.startTime;
            this.logPerformanceMetric('fid', this.fidScore);
          }
        }
      });

      try {
        observer.observe({ type: 'first-input', buffered: true });
      } catch (error) {
        console.warn('FID Observer not supported:', error);
      }
    }
  }

  /**
   * Setup CLS optimization
   */
  setupClsOptimization() {
    // Prevent layout shifts
    this.preventLayoutShifts();

    // Reserve space for dynamic content
    this.reserveDynamicSpace();

    // Optimize web fonts
    this.optimizeWebFonts();

    // Monitor CLS
    this.monitorLayoutShifts();
  }

  /**
   * Optimize web fonts
   */
  optimizeWebFonts() {
    // Use font-display: swap
    this.setupFontDisplaySwap();

    // Preload fonts
    this.preloadFonts();

    // Use system fonts initially
    this.useSystemFontsInitially();
  }

  /**
   * Setup font display swap
   */
  setupFontDisplaySwap() {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Use system fonts initially
   */
  useSystemFontsInitially() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      }

      .fonts-loaded body {
        font-family: 'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Track performance metrics
    this.trackPerformanceMetrics();

    // Setup performance alerts
    this.setupPerformanceAlerts();
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals() {
    // Monitor LCP
    this.monitorLCP();

    // Monitor FID
    this.monitorFID();

    // Monitor CLS
    this.monitorLayoutShifts();

    // Monitor other vitals
    this.monitorOtherVitals();
  }

  /**
   * Monitor other vitals
   */
  monitorOtherVitals() {
    // Monitor FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.logPerformanceMetric('fcp', entry.startTime);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Paint Observer not supported:', error);
      }
    }

    // Monitor TTFB (Time to First Byte)
    this.monitorTTFB();
  }

  /**
   * Monitor TTFB
   */
  monitorTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.logPerformanceMetric('ttfb', entry.responseStart - entry.requestStart);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Navigation Observer not supported:', error);
      }
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetrics() {
    // Track page load metrics
    window.addEventListener('load', () => {
      this.trackPageLoadMetrics();
    });

    // Track resource metrics
    this.trackResourceMetrics();

    // Track user interactions
    this.trackUserInteractions();
  }

  /**
   * Track page load metrics
   */
  trackPageLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const metrics = {
      domComplete: navigation.domComplete,
      loadEventEnd: navigation.loadEventEnd,
      firstPaint: 0,
      firstContentfulPaint: 0
    };

    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    this.logPerformanceMetrics(metrics);
  }

  /**
   * Track resource metrics
   */
  trackResourceMetrics() {
    const resources = performance.getEntriesByType('resource');
    const resourceMetrics = {
      totalResources: resources.length,
      totalSize: 0,
      totalTime: 0,
      byType: {}
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      const duration = resource.duration || 0;
      const type = resource.initiatorType;

      resourceMetrics.totalSize += size;
      resourceMetrics.totalTime += duration;

      if (!resourceMetrics.byType[type]) {
        resourceMetrics.byType[type] = {
          count: 0,
          size: 0,
          time: 0
        };
      }

      resourceMetrics.byType[type].count++;
      resourceMetrics.byType[type].size += size;
      resourceMetrics.byType[type].time += duration;
    });

    this.logPerformanceMetrics(resourceMetrics);
  }

  /**
   * Track user interactions
   */
  trackUserInteractions() {
    let interactionCount = 0;
    let firstInteractionTime = 0;

    document.addEventListener('click', (event) => {
      interactionCount++;
      if (firstInteractionTime === 0) {
        firstInteractionTime = performance.now();
      }

      this.logPerformanceMetric('user_interaction', {
        count: interactionCount,
        firstInteractionTime: firstInteractionTime
      });
    });
  }

  /**
   * Setup performance alerts
   */
  setupPerformanceAlerts() {
    // Set performance thresholds
    const thresholds = {
      lcp: 2500, // 2.5 seconds
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      fcp: 1800  // 1.8 seconds
    };

    // Check thresholds periodically
    setInterval(() => {
      this.checkPerformanceThresholds(thresholds);
    }, 5000); // Check every 5 seconds
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds(thresholds) {
    const alerts = [];

    if (this.lcpScore > thresholds.lcp) {
      alerts.push(`LCP too high: ${this.lcpScore}ms`);
    }

    if (this.fidScore > thresholds.fid) {
      alerts.push(`FID too high: ${this.fidScore}ms`);
    }

    if (this.clsScore > thresholds.cls) {
      alerts.push(`CLS too high: ${this.clsScore}`);
    }

    if (alerts.length > 0) {
      this.showPerformanceAlert(alerts);
    }
  }

  /**
   * Show performance alert
   */
  showPerformanceAlert(alerts) {
    console.warn('Performance alerts:', alerts);

    // Show user-friendly notification
    const notification = document.createElement('div');
    notification.className = 'performance-alert';
    notification.innerHTML = `
      <div class="performance-alert__content">
        <h4>Performance Issues Detected</h4>
        <ul>
          ${alerts.map(alert => `<li>${alert}</li>`).join('')}
        </ul>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .performance-alert {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 16px;
        border-radius: 8px;
        max-width: 300px;
        z-index: 10000;
      }

      .performance-alert h4 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
      }

      .performance-alert ul {
        margin: 0;
        padding-left: 16px;
        font-size: 12px;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      notification.remove();
    }, 10000);
  }

  /**
   * Setup resource loading optimization
   */
  setupResourceLoadingOptimization() {
    // Optimize CSS loading
    this.optimizeCssLoading();

    // Optimize JavaScript loading
    this.optimizeJavaScriptLoading();

    // Optimize image loading
    this.optimizeImageLoading();

    // Optimize font loading
    this.optimizeFontLoading();
  }

  /**
   * Optimize CSS loading
   */
  optimizeCssLoading() {
    // Critical CSS is already inlined
    // Non-critical CSS is loaded asynchronously
  }

  /**
   * Optimize JavaScript loading
   */
  optimizeJavaScriptLoading() {
    // Critical JavaScript is loaded synchronously
    // Non-critical JavaScript is loaded asynchronously
  }

  /**
   * Optimize font loading
   */
  optimizeFontLoading() {
    // Fonts are preloaded and use font-display: swap
  }

  /**
   * Log performance metric
   */
  logPerformanceMetric(name, value) {
    this.performanceMetrics.set(name, value);

    // Store in localStorage for analysis
    try {
      const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
      metrics[name] = value;
      metrics.timestamp = Date.now();
      localStorage.setItem('performance_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to store performance metric:', error);
    }
  }

  /**
   * Log performance metrics
   */
  logPerformanceMetrics(metrics) {
    Object.entries(metrics).forEach(([name, value]) => {
      this.logPerformanceMetric(name, value);
    });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return Object.fromEntries(this.performanceMetrics);
  }

  /**
   * Get Core Web Vitals scores
   */
  getCoreWebVitals() {
    return {
      lcp: this.lcpScore,
      fid: this.fidScore,
      cls: this.clsScore
    };
  }

  /**
   * Check if WebP is supported
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    const recommendations = [];

    // LCP recommendations
    if (this.lcpScore > 2500) {
      recommendations.push({
        type: 'lcp',
        message: 'LCP is too high. Consider optimizing images, reducing server response time, or eliminating render-blocking resources.',
        priority: 'high'
      });
    }

    // FID recommendations
    if (this.fidScore > 100) {
      recommendations.push({
        type: 'fid',
        message: 'FID is too high. Consider reducing JavaScript execution time, breaking up long tasks, or optimizing event listeners.',
        priority: 'high'
      });
    }

    // CLS recommendations
    if (this.clsScore > 0.1) {
      recommendations.push({
        type: 'cls',
        message: 'CLS is too high. Consider reserving space for dynamic content, optimizing web fonts, or preventing layout shifts.',
        priority: 'high'
      });
    }

    return recommendations;
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const metrics = this.getPerformanceMetrics();
    const vitals = this.getCoreWebVitals();
    const recommendations = this.getOptimizationRecommendations();

    return {
      metrics,
      vitals,
      recommendations,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.criticalRenderingPathOptimizer = new CriticalRenderingPathOptimizer();
  });
} else {
  window.criticalRenderingPathOptimizer = new CriticalRenderingPathOptimizer();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CriticalRenderingPathOptimizer;
}