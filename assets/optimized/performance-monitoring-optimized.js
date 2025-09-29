/**
 * RAVAN FASHION - PERFORMANCE MONITORING AND ANALYTICS
 * Comprehensive performance tracking and analytics implementation
 *
 * Features:
 * - Real-time performance monitoring
 * - Core Web Vitals tracking
 * - User experience metrics
 * - Network performance analysis
 * - Device and browser analytics
 * - Performance budget monitoring
 * - Automated performance reports
 * - Error tracking and debugging
 */

class PerformanceMonitoringManager {
  constructor() {
    this.metrics = new Map();
    this.vitals = new Map();
    this.userInteractions = [];
    this.networkRequests = [];
    this.errors = [];
    this.performanceBudget = {
      javascript: 500000, // 500KB
      css: 100000,      // 100KB
      images: 1000000,  // 1MB
      fonts: 50000,     // 50KB
      total: 2000000    // 2MB
    };
    this.thresholds = {
      lcp: 2500, // 2.5 seconds
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      fcp: 1800, // 1.8 seconds
      ttfb: 600, // 600ms
      firstPaint: 1200 // 1.2 seconds
    };

    this.init();
  }

  init() {
    this.setupPerformanceObservers();
    this.setupUserInteractionTracking();
    this.setupNetworkMonitoring();
    this.setupErrorTracking();
    this.setupPerformanceBudget();
    this.setupRealTimeMonitoring();
    this.setupAnalyticsIntegration();
    this.setupAutomatedReporting();
  }

  /**
   * Setup performance observers
   */
  setupPerformanceObservers() {
    // Core Web Vitals observers
    this.setupLcpObserver();
    this.setupFidObserver();
    this.setupClsObserver();
    this.setupFcpObserver();
    this.setupTtfbObserver();

    // Resource and navigation observers
    this.setupResourceObserver();
    this.setupNavigationObserver();
    this.setupPaintObserver();
    this.setupLayoutObserver();
  }

  /**
   * Setup LCP (Largest Contentful Paint) observer
   */
  setupLcpObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.recordMetric('lcp', entry.startTime);
            this.vitals.set('lcp', {
              value: entry.startTime,
              element: entry.element,
              url: entry.url,
              timestamp: Date.now()
            });
          }
        });
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (error) {
        console.warn('LCP Observer not supported:', error);
      }
    }
  }

  /**
   * Setup FID (First Input Delay) observer
   */
  setupFidObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'first-input') {
            const fid = entry.processingStart - entry.startTime;
            this.recordMetric('fid', fid);
            this.vitals.set('fid', {
              value: fid,
              type: entry.name,
              timestamp: Date.now()
            });
          }
        });
      });

      try {
        observer.observe({ type: 'first-input', buffered: true });
      } catch (error) {
        console.warn('FID Observer not supported:', error);
      }
    }
  }

  /**
   * Setup CLS (Cumulative Layout Shift) observer
   */
  setupClsObserver() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.hadRecentInput) return;

          sessionEntries.push(entry);
          clsValue += entry.value;

          this.recordMetric('cls', clsValue);
          this.vitals.set('cls', {
            value: clsValue,
            entries: sessionEntries,
            timestamp: Date.now()
          });
        });
      });

      try {
        observer.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('CLS Observer not supported:', error);
      }
    }
  }

  /**
   * Setup FCP (First Contentful Paint) observer
   */
  setupFcpObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('fcp', entry.startTime);
            this.vitals.set('fcp', {
              value: entry.startTime,
              timestamp: Date.now()
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP Observer not supported:', error);
      }
    }
  }

  /**
   * Setup TTFB (Time to First Byte) observer
   */
  setupTtfbObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart;
            this.recordMetric('ttfb', ttfb);
            this.vitals.set('ttfb', {
              value: ttfb,
              timestamp: Date.now()
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('TTFB Observer not supported:', error);
      }
    }
  }

  /**
   * Setup resource observer
   */
  setupResourceObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.networkRequests.push({
              url: entry.name,
              type: entry.initiatorType,
              duration: entry.duration,
              size: entry.transferSize || 0,
              timestamp: Date.now()
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Resource Observer not supported:', error);
      }
    }
  }

  /**
   * Setup navigation observer
   */
  setupNavigationObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navigationMetrics = {
              domComplete: entry.domComplete,
              domInteractive: entry.domInteractive,
              loadEventEnd: entry.loadEventEnd,
              loadEventStart: entry.loadEventStart,
              responseStart: entry.responseStart,
              requestStart: entry.requestStart,
              timestamp: Date.now()
            };

            Object.entries(navigationMetrics).forEach(([key, value]) => {
              this.recordMetric(`navigation_${key}`, value);
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('Navigation Observer not supported:', error);
      }
    }
  }

  /**
   * Setup paint observer
   */
  setupPaintObserver() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            this.recordMetric(`paint_${entry.name}`, entry.startTime);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Paint Observer not supported:', error);
      }
    }
  }

  /**
   * Setup layout observer
   */
  setupLayoutObserver() {
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
          this.recordMetric('layout_resize', {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
            target: entry.target.tagName,
            timestamp: Date.now()
          });
        });
      });

      // Observe key layout elements
      const layoutElements = document.querySelectorAll('.cultural-spotlight__grid, .header, main');
      layoutElements.forEach(element => {
        resizeObserver.observe(element);
      });
    }
  }

  /**
   * Setup user interaction tracking
   */
  setupUserInteractionTracking() {
    // Track clicks
    this.setupClickTracking();

    // Track scrolls
    this.setupScrollTracking();

    // Track form interactions
    this.setupFormTracking();

    // Track custom interactions
    this.setupCustomInteractionTracking();
  }

  /**
   * Setup click tracking
   */
  setupClickTracking() {
    document.addEventListener('click', (event) => {
      const interaction = {
        type: 'click',
        target: event.target.tagName,
        timestamp: Date.now(),
        x: event.clientX,
        y: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY
      };

      this.userInteractions.push(interaction);
      this.recordMetric('user_click', interaction);
    }, { passive: true });
  }

  /**
   * Setup scroll tracking
   */
  setupScrollTracking() {
    let lastScrollTop = 0;
    let scrollDepth = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (Math.abs(scrollTop - lastScrollTop) > 100) {
        this.recordMetric('user_scroll', {
          scrollTop,
          scrollPercentage,
          timestamp: Date.now()
        });

        // Track scroll depth milestones
        const milestones = [25, 50, 75, 90];
        milestones.forEach(milestone => {
          if (scrollPercentage >= milestone && scrollDepth < milestone) {
            this.recordMetric(`scroll_depth_${milestone}`, {
              timestamp: Date.now()
            });
            scrollDepth = milestone;
          }
        });

        lastScrollTop = scrollTop;
      }
    };

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    }, { passive: true });
  }

  /**
   * Setup form tracking
   */
  setupFormTracking() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (event) => {
        const formData = new FormData(form);
        const interaction = {
          type: 'form_submit',
          formId: form.id || form.action,
          timestamp: Date.now(),
          fields: Array.from(formData.keys())
        };

        this.userInteractions.push(interaction);
        this.recordMetric('form_submit', interaction);
      });

      // Track form field interactions
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
        field.addEventListener('focus', (event) => {
          this.recordMetric('form_field_focus', {
            fieldName: field.name || field.id,
            fieldType: field.type,
            timestamp: Date.now()
          });
        });

        field.addEventListener('blur', (event) => {
          this.recordMetric('form_field_blur', {
            fieldName: field.name || field.id,
            fieldType: field.type,
            timestamp: Date.now()
          });
        });
      });
    });
  }

  /**
   * Setup custom interaction tracking
   */
  setupCustomInteractionTracking() {
    // Track cultural spotlight interactions
    const culturalItems = document.querySelectorAll('.cultural-spotlight__item');
    culturalItems.forEach(item => {
      item.addEventListener('click', (event) => {
        this.recordMetric('cultural_item_click', {
          itemIndex: Array.from(culturalItems).indexOf(item),
          itemTitle: item.querySelector('.cultural-spotlight__tamil-term')?.textContent,
          timestamp: Date.now()
        });
      });
    });

    // Track button interactions
    const buttons = document.querySelectorAll('button, .button');
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        this.recordMetric('button_click', {
          buttonText: button.textContent,
          buttonType: button.type || button.dataset.type,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Setup network monitoring
   */
  setupNetworkMonitoring() {
    // Monitor network information
    this.setupNetworkInfo();

    // Monitor online/offline status
    this.setupConnectivityMonitoring();

    // Track network performance
    this.setupNetworkPerformance();
  }

  /**
   * Setup network information
   */
  setupNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
        type: connection.type
      };

      this.recordMetric('network_info', networkInfo);

      connection.addEventListener('change', () => {
        const newNetworkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          type: connection.type,
          timestamp: Date.now()
        };

        this.recordMetric('network_change', newNetworkInfo);
      });
    }
  }

  /**
   * Setup connectivity monitoring
   */
  setupConnectivityMonitoring() {
    window.addEventListener('online', () => {
      this.recordMetric('connectivity_online', {
        timestamp: Date.now()
      });
    });

    window.addEventListener('offline', () => {
      this.recordMetric('connectivity_offline', {
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup network performance
   */
  setupNetworkPerformance() {
    // Track network timing
    this.trackNetworkTiming();

    // Monitor resource loading performance
    this.monitorResourceLoading();
  }

  /**
   * Track network timing
   */
  trackNetworkTiming() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.recordMetric('fetch_request', {
          url: args[0],
          duration,
          status: response.status,
          timestamp: Date.now()
        });

        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.recordMetric('fetch_error', {
          url: args[0],
          duration,
          error: error.message,
          timestamp: Date.now()
        });

        throw error;
      }
    };
  }

  /**
   * Monitor resource loading
   */
  monitorResourceLoading() {
    // Monitor image loading
    this.monitorImageLoading();

    // Monitor script loading
    this.monitorScriptLoading();

    // Monitor CSS loading
    this.monitorCssLoading();
  }

  /**
   * Monitor image loading
   */
  monitorImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('load', () => {
        this.recordMetric('image_load', {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          timestamp: Date.now()
        });
      });

      img.addEventListener('error', () => {
        this.recordMetric('image_error', {
          src: img.src,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Monitor script loading
   */
  monitorScriptLoading() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      script.addEventListener('load', () => {
        this.recordMetric('script_load', {
          src: script.src,
          timestamp: Date.now()
        });
      });

      script.addEventListener('error', () => {
        this.recordMetric('script_error', {
          src: script.src,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Monitor CSS loading
   */
  monitorCssLoading() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      link.addEventListener('load', () => {
        this.recordMetric('css_load', {
          href: link.href,
          timestamp: Date.now()
        });
      });

      link.addEventListener('error', () => {
        this.recordMetric('css_error', {
          href: link.href,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    // Track JavaScript errors
    this.setupJavaScriptErrorTracking();

    // Track resource errors
    this.setupResourceErrorTracking();

    // Track API errors
    this.setupApiErrorTracking();
  }

  /**
   * Setup JavaScript error tracking
   */
  setupJavaScriptErrorTracking() {
    window.addEventListener('error', (event) => {
      const error = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      };

      this.errors.push(error);
      this.recordMetric('javascript_error', error);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      };

      this.errors.push(error);
      this.recordMetric('promise_rejection', error);
    });
  }

  /**
   * Setup resource error tracking
   */
  setupResourceErrorTracking() {
    window.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK') {
        const error = {
          type: 'resource_error',
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: Date.now()
        };

        this.errors.push(error);
        this.recordMetric('resource_error', error);
      }
    }, true);
  }

  /**
   * Setup API error tracking
   */
  setupApiErrorTracking() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          const error = {
            type: 'api_error',
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            timestamp: Date.now()
          };

          this.errors.push(error);
          this.recordMetric('api_error', error);
        }
        return response;
      } catch (error) {
        const apiError = {
          type: 'api_error',
          url: args[0],
          message: error.message,
          timestamp: Date.now()
        };

        this.errors.push(apiError);
        this.recordMetric('api_error', apiError);
        throw error;
      }
    };
  }

  /**
   * Setup performance budget
   */
  setupPerformanceBudget() {
    // Monitor resource sizes
    this.monitorResourceSizes();

    // Check budget compliance
    this.checkBudgetCompliance();

    // Track budget overages
    this.trackBudgetOverages();
  }

  /**
   * Monitor resource sizes
   */
  monitorResourceSizes() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.transferSize) {
            const type = this.getResourceType(entry.name);
            this.updateResourceBudget(type, entry.transferSize);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Resource size monitoring not supported:', error);
      }
    }
  }

  /**
   * Get resource type
   */
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'css';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.webp')) return 'images';
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf')) return 'fonts';
    return 'other';
  }

  /**
   * Update resource budget
   */
  updateResourceBudget(type, size) {
    if (this.performanceBudget[type] !== undefined) {
      this.performanceBudget[type] -= size;
      this.recordMetric(`budget_${type}`, {
        used: this.performanceBudget[type],
        size,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check budget compliance
   */
  checkBudgetCompliance() {
    setInterval(() => {
      const overages = [];

      Object.entries(this.performanceBudget).forEach(([type, budget]) => {
        if (budget < 0) {
          overages.push({
            type,
            overage: Math.abs(budget),
            budget: this.performanceBudget[type]
          });
        }
      });

      if (overages.length > 0) {
        this.recordMetric('budget_overage', {
          overages,
          timestamp: Date.now()
        });

        this.triggerBudgetAlert(overages);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Track budget overages
   */
  trackBudgetOverages() {
    // Store budget usage over time
    setInterval(() => {
      const budgetUsage = Object.entries(this.performanceBudget).map(([type, remaining]) => ({
        type,
        remaining,
        used: this.getOriginalBudget(type) - remaining
      }));

      this.recordMetric('budget_usage', {
        usage: budgetUsage,
        timestamp: Date.now()
      });
    }, 30000); // Every 30 seconds
  }

  /**
   * Get original budget
   */
  getOriginalBudget(type) {
    const originalBudgets = {
      javascript: 500000,
      css: 100000,
      images: 1000000,
      fonts: 50000,
      total: 2000000
    };

    return originalBudgets[type] || 0;
  }

  /**
   * Trigger budget alert
   */
  triggerBudgetAlert(overages) {
    console.warn('Performance budget exceeded:', overages);

    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'budget_exceeded', {
        event_category: 'performance',
        event_label: overages.map(o => o.type).join(','),
        value: overages.reduce((sum, o) => sum + o.overage, 0)
      });
    }
  }

  /**
   * Setup real-time monitoring
   */
  setupRealTimeMonitoring() {
    // Monitor performance in real-time
    this.setupRealTimeMetrics();

    // Setup performance alerts
    this.setupPerformanceAlerts();

    // Monitor user experience
    this.setupUserExperienceMonitoring();
  }

  /**
   * Setup real-time metrics
   */
  setupRealTimeMetrics() {
    // Monitor frame rate
    this.monitorFrameRate();

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Monitor CPU usage (if available)
    this.monitorCpuUsage();
  }

  /**
   * Monitor frame rate
   */
  monitorFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const checkFps = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        this.recordMetric('fps', fps);

        frameCount = 0;
        lastTime = currentTime;

        // Check for low frame rates
        if (fps < 30) {
          this.recordMetric('low_fps', {
            fps,
            timestamp: Date.now()
          });
        }
      }

      requestAnimationFrame(checkFps);
    };

    requestAnimationFrame(checkFps);
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const memoryInfo = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        };

        this.recordMetric('memory_usage', memoryInfo);

        // Check for high memory usage
        if (memoryInfo.percentage > 80) {
          this.recordMetric('high_memory_usage', {
            ...memoryInfo,
            timestamp: Date.now()
          });
        }
      }, 10000); // Every 10 seconds
    }
  }

  /**
   * Monitor CPU usage
   */
  monitorCpuUsage() {
    // Note: CPU usage monitoring is limited in browsers
    // This is a simplified implementation
    let lastTime = performance.now();
    let eventCount = 0;

    const monitorCpu = () => {
      eventCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        const eventsPerSecond = eventCount;
        this.recordMetric('cpu_load', {
          eventsPerSecond,
          timestamp: Date.now()
        });

        eventCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorCpu);
    };

    requestAnimationFrame(monitorCpu);
  }

  /**
   * Setup performance alerts
   */
  setupPerformanceAlerts() {
    // Check performance thresholds
    setInterval(() => {
      this.checkPerformanceThresholds();
    }, 10000); // Every 10 seconds

    // Setup custom alerts
    this.setupCustomAlerts();
  }

  /**
   * Check performance thresholds
   */
  checkPerformanceThresholds() {
    const alerts = [];

    // Check Core Web Vitals
    if (this.vitals.has('lcp') && this.vitals.get('lcp').value > this.thresholds.lcp) {
      alerts.push({
        type: 'lcp',
        message: `LCP too high: ${this.vitals.get('lcp').value}ms`,
        value: this.vitals.get('lcp').value,
        threshold: this.thresholds.lcp
      });
    }

    if (this.vitals.has('fid') && this.vitals.get('fid').value > this.thresholds.fid) {
      alerts.push({
        type: 'fid',
        message: `FID too high: ${this.vitals.get('fid').value}ms`,
        value: this.vitals.get('fid').value,
        threshold: this.thresholds.fid
      });
    }

    if (this.vitals.has('cls') && this.vitals.get('cls').value > this.thresholds.cls) {
      alerts.push({
        type: 'cls',
        message: `CLS too high: ${this.vitals.get('cls').value}`,
        value: this.vitals.get('cls').value,
        threshold: this.thresholds.cls
      });
    }

    if (alerts.length > 0) {
      this.handlePerformanceAlerts(alerts);
    }
  }

  /**
   * Setup custom alerts
   */
  setupCustomAlerts() {
    // High error rate alert
    this.setupErrorRateAlert();

    // Slow network alert
    this.setupSlowNetworkAlert();

    // High memory usage alert
    this.setupHighMemoryAlert();
  }

  /**
   * Setup error rate alert
   */
  setupErrorRateAlert() {
    setInterval(() => {
      const recentErrors = this.errors.filter(error =>
        Date.now() - error.timestamp < 60000 // Last minute
      );

      if (recentErrors.length > 5) {
        this.handlePerformanceAlerts([{
          type: 'error_rate',
          message: `High error rate: ${recentErrors.length} errors in the last minute`,
          value: recentErrors.length,
          threshold: 5
        }]);
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Setup slow network alert
   */
  setupSlowNetworkAlert() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.handlePerformanceAlerts([{
            type: 'slow_network',
            message: `Slow network detected: ${connection.effectiveType}`,
            value: connection.effectiveType,
            threshold: '3g'
          }]);
        }
      });
    }
  }

  /**
   * Setup high memory alert
   */
  setupHighMemoryAlert() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (percentage > 90) {
          this.handlePerformanceAlerts([{
            type: 'high_memory',
            message: `High memory usage: ${percentage.toFixed(1)}%`,
            value: percentage,
            threshold: 90
          }]);
        }
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Handle performance alerts
   */
  handlePerformanceAlerts(alerts) {
    console.warn('Performance alerts:', alerts);

    // Send to analytics
    this.sendAlertsToAnalytics(alerts);

    // Show user notification (optional)
    this.showPerformanceNotification(alerts);
  }

  /**
   * Send alerts to analytics
   */
  sendAlertsToAnalytics(alerts) {
    if (typeof gtag !== 'undefined') {
      alerts.forEach(alert => {
        gtag('event', 'performance_alert', {
          event_category: 'performance',
          event_label: alert.type,
          value: alert.value || 1
        });
      });
    }
  }

  /**
   * Show performance notification
   */
  showPerformanceNotification(alerts) {
    // Only show for critical alerts
    const criticalAlerts = alerts.filter(alert =>
      alert.type === 'lcp' || alert.type === 'fid' || alert.type === 'error_rate'
    );

    if (criticalAlerts.length > 0) {
      const notification = document.createElement('div');
      notification.className = 'performance-notification';
      notification.innerHTML = `
        <div class="performance-notification__content">
          <h4>Performance Issues Detected</h4>
          <ul>
            ${criticalAlerts.map(alert => `<li>${alert.message}</li>`).join('')}
          </ul>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .performance-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #ff6b6b;
          color: white;
          padding: 16px;
          border-radius: 8px;
          max-width: 400px;
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        }

        .performance-notification h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .performance-notification ul {
          margin: 0;
          padding-left: 16px;
          font-size: 12px;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;

      document.head.appendChild(style);
      document.body.appendChild(notification);

      // Auto-remove after 10 seconds
      setTimeout(() => {
        notification.remove();
      }, 10000);
    }
  }

  /**
   * Setup user experience monitoring
   */
  setupUserExperienceMonitoring() {
    // Monitor user engagement
    this.setupUserEngagementMonitoring();

    // Monitor page performance
    this.setupPagePerformanceMonitoring();

    // Monitor mobile experience
    this.setupMobileExperienceMonitoring();
  }

  /**
   * Setup user engagement monitoring
   */
  setupUserEngagementMonitoring() {
    // Track page visibility
    this.setupPageVisibilityTracking();

    // Track user activity
    this.setupUserActivityTracking();

    // Track engagement metrics
    this.setupEngagementMetrics();
  }

  /**
   * Setup page visibility tracking
   */
  setupPageVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      this.recordMetric('page_visibility', {
        visible: !document.hidden,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup user activity tracking
   */
  setupUserActivityTracking() {
    let lastActivity = Date.now();
    let isActive = true;

    const updateActivity = () => {
      lastActivity = Date.now();
      isActive = true;
    };

    // Track user activity
    document.addEventListener('click', updateActivity);
    document.addEventListener('scroll', updateActivity);
    document.addEventListener('keypress', updateActivity);

    // Check for inactivity
    setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30000) { // 30 seconds
        isActive = false;
      }

      this.recordMetric('user_activity', {
        isActive,
        inactiveTime,
        timestamp: Date.now()
      });
    }, 5000);
  }

  /**
   * Setup engagement metrics
   */
  setupEngagementMetrics() {
    // Track time on page
    let pageLoadTime = Date.now();

    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - pageLoadTime;
      this.recordMetric('time_on_page', {
        duration: timeOnPage,
        timestamp: Date.now()
      });
    });

    // Track page interactions
    let interactionCount = 0;
    const trackInteraction = () => {
      interactionCount++;
      this.recordMetric('page_interactions', {
        count: interactionCount,
        timestamp: Date.now()
      });
    };

    document.addEventListener('click', trackInteraction);
    document.addEventListener('scroll', trackInteraction);
  }

  /**
   * Setup page performance monitoring
   */
  setupPagePerformanceMonitoring() {
    // Monitor page load performance
    this.monitorPageLoadPerformance();

    // Monitor resource performance
    this.monitorResourcePerformance();

    // Monitor navigation performance
    this.monitorNavigationPerformance();
  }

  /**
   * Monitor page load performance
   */
  monitorPageLoadPerformance() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const pageLoadMetrics = {
        domComplete: navigation.domComplete,
        loadEventEnd: navigation.loadEventEnd,
        firstPaint: 0,
        firstContentfulPaint: 0
      };

      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          pageLoadMetrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          pageLoadMetrics.firstContentfulPaint = entry.startTime;
        }
      });

      this.recordMetric('page_load_performance', pageLoadMetrics);
    });
  }

  /**
   * Monitor resource performance
   */
  monitorResourcePerformance() {
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

    this.recordMetric('resource_performance', resourceMetrics);
  }

  /**
   * Monitor navigation performance
   */
  monitorNavigationPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      const navigationMetrics = {
        domainLookupEnd: navigation.domainLookupEnd - navigation.domainLookupStart,
        connectEnd: navigation.connectEnd - navigation.connectStart,
        requestStart: navigation.requestStart - navigation.fetchStart,
        responseStart: navigation.responseStart - navigation.requestStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        domComplete: navigation.domComplete - navigation.fetchStart
      };

      this.recordMetric('navigation_performance', navigationMetrics);
    }
  }

  /**
   * Setup mobile experience monitoring
   */
  setupMobileExperienceMonitoring() {
    // Check if mobile device
    const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(navigator.userAgent.toLowerCase());

    if (isMobile) {
      this.setupMobileSpecificMonitoring();
    }
  }

  /**
   * Setup mobile specific monitoring
   */
  setupMobileSpecificMonitoring() {
    // Monitor touch interactions
    this.setupTouchInteractionMonitoring();

    // Monitor device orientation
    this.setupOrientationMonitoring();

    // Monitor battery level (if available)
    this.setupBatteryMonitoring();
  }

  /**
   * Setup touch interaction monitoring
   */
  setupTouchInteractionMonitoring() {
    let touchStartTime = 0;

    document.addEventListener('touchstart', (event) => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', (event) => {
      const touchDuration = performance.now() - touchStartTime;
      this.recordMetric('touch_interaction', {
        duration: touchDuration,
        timestamp: Date.now()
      });
    }, { passive: true });
  }

  /**
   * Setup orientation monitoring
   */
  setupOrientationMonitoring() {
    window.addEventListener('orientationchange', () => {
      this.recordMetric('orientation_change', {
        orientation: window.orientation,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup battery monitoring
   */
  setupBatteryMonitoring() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.recordMetric('battery_level', {
          level: battery.level,
          charging: battery.charging,
          timestamp: Date.now()
        });

        battery.addEventListener('levelchange', () => {
          this.recordMetric('battery_level_change', {
            level: battery.level,
            charging: battery.charging,
            timestamp: Date.now()
          });
        });

        battery.addEventListener('chargingchange', () => {
          this.recordMetric('battery_charging_change', {
            level: battery.level,
            charging: battery.charging,
            timestamp: Date.now()
          });
        });
      });
    }
  }

  /**
   * Setup analytics integration
   */
  setupAnalyticsIntegration() {
    // Google Analytics integration
    this.setupGoogleAnalytics();

    // Custom analytics integration
    this.setupCustomAnalytics();

    // Performance data export
    this.setupDataExport();
  }

  /**
   * Setup Google Analytics
   */
  setupGoogleAnalytics() {
    // Send Core Web Vitals to Google Analytics
    if (typeof gtag !== 'undefined') {
      // Send LCP
      if (this.vitals.has('lcp')) {
        gtag('event', 'lcp', {
          event_category: 'web_vitals',
          event_label: 'LCP',
          value: Math.round(this.vitals.get('lcp').value)
        });
      }

      // Send FID
      if (this.vitals.has('fid')) {
        gtag('event', 'fid', {
          event_category: 'web_vitals',
          event_label: 'FID',
          value: Math.round(this.vitals.get('fid').value)
        });
      }

      // Send CLS
      if (this.vitals.has('cls')) {
        gtag('event', 'cls', {
          event_category: 'web_vitals',
          event_label: 'CLS',
          value: Math.round(this.vitals.get('cls').value * 1000)
        });
      }
    }
  }

  /**
   * Setup custom analytics
   */
  setupCustomAnalytics() {
    // Send custom performance events
    this.sendCustomPerformanceEvents();

    // Track user experience metrics
    this.trackUserExperienceMetrics();
  }

  /**
   * Send custom performance events
   */
  sendCustomPerformanceEvents() {
    // Send page load event
    window.addEventListener('load', () => {
      this.sendCustomEvent('page_load_complete', {
        load_time: performance.timing.loadEventEnd - performance.timing.navigationStart
      });
    });

    // Send interaction events
    let interactionCount = 0;
    document.addEventListener('click', () => {
      interactionCount++;
      this.sendCustomEvent('user_interaction', {
        interaction_count: interactionCount
      });
    });
  }

  /**
   * Track user experience metrics
   */
  trackUserExperienceMetrics() {
    // Track satisfaction metrics
    this.trackSatisfactionMetrics();

    // Track frustration metrics
    this.trackFrustrationMetrics();
  }

  /**
   * Track satisfaction metrics
   */
  trackSatisfactionMetrics() {
    // Track fast interactions (<100ms)
    let fastInteractions = 0;
    let totalInteractions = 0;

    document.addEventListener('click', () => {
      totalInteractions++;
      fastInteractions++;
    });

    setInterval(() => {
      if (totalInteractions > 0) {
        const satisfactionRate = (fastInteractions / totalInteractions) * 100;
        this.recordMetric('satisfaction_rate', {
          rate: satisfactionRate,
          fastInteractions,
          totalInteractions,
          timestamp: Date.now()
        });
      }
    }, 30000);
  }

  /**
   * Track frustration metrics
   */
  trackFrustrationMetrics() {
    // Track rage clicks (multiple rapid clicks)
    let lastClickTime = 0;
    let clickCount = 0;

    document.addEventListener('click', (event) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < 500) {
        clickCount++;
        if (clickCount > 3) {
          this.recordMetric('rage_click', {
            x: event.clientX,
            y: event.clientY,
            target: event.target.tagName,
            timestamp: Date.now()
          });
        }
      } else {
        clickCount = 1;
      }
      lastClickTime = currentTime;
    });
  }

  /**
   * Setup data export
   */
  setupDataExport() {
    // Export performance data
    this.setupPerformanceDataExport();

    // Export error data
    this.setupErrorDataExport();

    // Export user interaction data
    this.setupUserDataExport();
  }

  /**
   * Setup performance data export
   */
  setupPerformanceDataExport() {
    // Export performance metrics periodically
    setInterval(() => {
      const performanceData = {
        metrics: Object.fromEntries(this.metrics),
        vitals: Object.fromEntries(this.vitals),
        timestamp: Date.now()
      };

      this.exportData('performance', performanceData);
    }, 60000); // Every minute
  }

  /**
   * Setup error data export
   */
  setupErrorDataExport() {
    // Export error data when errors occur
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorData = {
        message,
        source,
        lineno,
        colno,
        stack: error?.stack,
        timestamp: Date.now()
      };

      this.exportData('error', errorData);

      // Call original error handler
      if (originalError) {
        originalError(message, source, lineno, colno, error);
      }
    };
  }

  /**
   * Setup user data export
   */
  setupUserDataExport() {
    // Export user interaction data periodically
    setInterval(() => {
      const userData = {
        interactions: this.userInteractions.slice(-100), // Last 100 interactions
        networkRequests: this.networkRequests.slice(-50), // Last 50 requests
        timestamp: Date.now()
      };

      this.exportData('user', userData);
    }, 300000); // Every 5 minutes
  }

  /**
   * Export data
   */
  exportData(type, data) {
    // Store in localStorage
    try {
      const exportData = JSON.parse(localStorage.getItem('performance_export_data') || '{}');
      if (!exportData[type]) {
        exportData[type] = [];
      }
      exportData[type].push(data);

      // Keep only last 100 entries
      if (exportData[type].length > 100) {
        exportData[type] = exportData[type].slice(-100);
      }

      localStorage.setItem('performance_export_data', JSON.stringify(exportData));
    } catch (error) {
      console.error('Failed to export data:', error);
    }

    // Send to server (optional)
    this.sendDataToServer(type, data);
  }

  /**
   * Send data to server
   */
  sendDataToServer(type, data) {
    // Implement server-side data collection
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/performance', JSON.stringify({
        type,
        data,
        timestamp: Date.now()
      }));
    } else {
      // Fallback to fetch
      fetch('/api/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: Date.now()
        }),
        keepalive: true
      }).catch(error => {
        console.warn('Failed to send performance data to server:', error);
      });
    }
  }

  /**
   * Setup automated reporting
   */
  setupAutomatedReporting() {
    // Setup daily reports
    this.setupDailyReports();

    // Setup weekly reports
    this.setupWeeklyReports();

    // Setup performance alerts
    this.setupAutomatedAlerts();
  }

  /**
   * Setup daily reports
   */
  setupDailyReports() {
    // Generate daily report
    setInterval(() => {
      const dailyReport = this.generateDailyReport();
      this.sendReport('daily', dailyReport);
    }, 86400000); // Every 24 hours
  }

  /**
   * Setup weekly reports
   */
  setupWeeklyReports() {
    // Generate weekly report
    setInterval(() => {
      const weeklyReport = this.generateWeeklyReport();
      this.sendReport('weekly', weeklyReport);
    }, 604800000); // Every 7 days
  }

  /**
   * Setup automated alerts
   */
  setupAutomatedAlerts() {
    // Send alerts for critical issues
    setInterval(() => {
      const alerts = this.generatePerformanceAlerts();
      if (alerts.length > 0) {
        this.sendAlerts(alerts);
      }
    }, 3600000); // Every hour
  }

  /**
   * Generate daily report
   */
  generateDailyReport() {
    return {
      type: 'daily',
      date: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      vitals: Object.fromEntries(this.vitals),
      errors: this.errors.slice(-24), // Last 24 hours
      userInteractions: this.userInteractions.slice(-100),
      networkRequests: this.networkRequests.slice(-50),
      performanceBudget: this.performanceBudget,
      thresholds: this.thresholds
    };
  }

  /**
   * Generate weekly report
   */
  generateWeeklyReport() {
    return {
      type: 'weekly',
      date: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      vitals: Object.fromEntries(this.vitals),
      errors: this.errors,
      userInteractions: this.userInteractions,
      networkRequests: this.networkRequests,
      performanceBudget: this.performanceBudget,
      thresholds: this.thresholds,
      trends: this.calculateTrends()
    };
  }

  /**
   * Calculate trends
   */
  calculateTrends() {
    // Calculate performance trends over time
    // This would require storing historical data
    return {
      lcp_trend: 'stable',
      fid_trend: 'improving',
      cls_trend: 'stable'
    };
  }

  /**
   * Generate performance alerts
   */
  generatePerformanceAlerts() {
    const alerts = [];

    // Check Core Web Vitals
    if (this.vitals.has('lcp') && this.vitals.get('lcp').value > this.thresholds.lcp * 1.5) {
      alerts.push({
        type: 'critical',
        message: 'LCP significantly above threshold',
        metric: 'lcp',
        value: this.vitals.get('lcp').value,
        threshold: this.thresholds.lcp
      });
    }

    // Check error rate
    const recentErrors = this.errors.filter(error => Date.now() - error.timestamp < 3600000);
    if (recentErrors.length > 10) {
      alerts.push({
        type: 'warning',
        message: 'High error rate detected',
        metric: 'error_rate',
        value: recentErrors.length,
        threshold: 10
      });
    }

    return alerts;
  }

  /**
   * Send report
   */
  sendReport(type, report) {
    // Send report to server
    this.sendDataToServer('report', {
      type,
      report,
      timestamp: Date.now()
    });
  }

  /**
   * Send alerts
   */
  sendAlerts(alerts) {
    // Send alerts to server
    this.sendDataToServer('alerts', {
      alerts,
      timestamp: Date.now()
    });
  }

  /**
   * Send custom event
   */
  sendCustomEvent(name, data) {
    this.recordMetric(`custom_event_${name}`, {
      ...data,
      timestamp: Date.now()
    });
  }

  /**
   * Record metric
   */
  recordMetric(name, value) {
    this.metrics.set(name, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals() {
    return Object.fromEntries(this.vitals);
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      metrics: this.getPerformanceMetrics(),
      vitals: this.getCoreWebVitals(),
      errors: this.errors.slice(-10), // Last 10 errors
      userInteractions: this.userInteractions.slice(-20), // Last 20 interactions
      networkRequests: this.networkRequests.slice(-10), // Last 10 requests
      performanceBudget: this.performanceBudget,
      thresholds: this.thresholds,
      timestamp: Date.now()
    };
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    const recommendations = [];

    // Core Web Vitals recommendations
    if (this.vitals.has('lcp') && this.vitals.get('lcp').value > this.thresholds.lcp) {
      recommendations.push({
        type: 'lcp',
        priority: 'high',
        title: 'Optimize Largest Contentful Paint',
        description: 'LCP is above threshold. Consider optimizing images, reducing server response time, or eliminating render-blocking resources.',
        suggestions: [
          'Optimize LCP candidate images',
          'Reduce server response time',
          'Eliminate render-blocking resources',
          'Preload key resources'
        ]
      });
    }

    if (this.vitals.has('fid') && this.vitals.get('fid').value > this.thresholds.fid) {
      recommendations.push({
        type: 'fid',
        priority: 'high',
        title: 'Reduce First Input Delay',
        description: 'FID is above threshold. Consider reducing JavaScript execution time or breaking up long tasks.',
        suggestions: [
          'Reduce JavaScript execution time',
          'Break up long tasks',
          'Optimize event listeners',
          'Use web workers for complex operations'
        ]
      });
    }

    if (this.vitals.has('cls') && this.vitals.get('cls').value > this.thresholds.cls) {
      recommendations.push({
        type: 'cls',
        priority: 'high',
        title: 'Improve Cumulative Layout Shift',
        description: 'CLS is above threshold. Consider reserving space for dynamic content or optimizing web fonts.',
        suggestions: [
          'Reserve space for dynamic content',
          'Optimize web fonts',
          'Prevent layout shifts',
          'Use CSS containment'
        ]
      });
    }

    // Performance budget recommendations
    const budgetOverages = [];
    Object.entries(this.performanceBudget).forEach(([type, remaining]) => {
      if (remaining < 0) {
        budgetOverages.push({
          type,
          overage: Math.abs(remaining)
        });
      }
    });

    if (budgetOverages.length > 0) {
      recommendations.push({
        type: 'budget',
        priority: 'medium',
        title: 'Performance Budget Exceeded',
        description: 'Performance budget has been exceeded for one or more resource types.',
        suggestions: budgetOverages.map(overage =>
          `Reduce ${overage.type} resources by ${Math.round(overage.overage / 1024)}KB`
        )
      });
    }

    return recommendations;
  }

  /**
   * Cleanup
   */
  destroy() {
    // Clear intervals and timeouts
    // Remove event listeners
    // Clear stored data
    this.metrics.clear();
    this.vitals.clear();
    this.userInteractions = [];
    this.networkRequests = [];
    this.errors = [];
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitoringManager = new PerformanceMonitoringManager();
  });
} else {
  window.performanceMonitoringManager = new PerformanceMonitoringManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitoringManager;
}