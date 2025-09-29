/**
 * RAVAN FASHION - PERFORMANCE OPTIMIZED JAVASCRIPT
 * Lazy Loading, Code Splitting & Event Delegation
 */

class RavanFashionPerformance {
  constructor() {
    this.loadedModules = new Map();
    this.intersectionObserver = null;
    this.performanceMetrics = new Map();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupEventDelegation();
    this.setupPerformanceMonitoring();
    this.preloadCriticalResources();
    this.setupLazyLoading();
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadModule(entry.target);
              this.intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1
        }
      );
    }
  }

  setupEventDelegation() {
    document.addEventListener('click', (e) => this.handleClick(e), true);
    document.addEventListener('input', (e) => this.handleInput(e), true);
    document.addEventListener('change', (e) => this.handleChange(e), true);
  }

  handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const module = target.dataset.module;

    switch (action) {
      case 'load-cultural-spotlight':
        e.preventDefault();
        this.loadCulturalSpotlight(target);
        break;
      case 'load-design-story':
        e.preventDefault();
        this.loadDesignStory(target);
        break;
      case 'load-drop-countdown':
        e.preventDefault();
        this.loadDropCountdown(target);
        break;
      case 'expand-cultural-element':
        e.preventDefault();
        this.expandCulturalElement(target);
        break;
    }
  }

  handleInput(e) {
    const target = e.target.closest('[data-validate]');
    if (!target) return;

    const type = target.dataset.validate;
    this.validateInput(target, type);
  }

  handleChange(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    if (target.dataset.action === 'variant-change') {
      this.handleVariantChange(target);
    }
  }

  async loadModule(element) {
    const moduleName = element.dataset.module;
    if (this.loadedModules.has(moduleName)) return;

    try {
      const startTime = performance.now();

      let module;
      switch (moduleName) {
        case 'cultural-spotlight':
          module = await this.loadCulturalSpotlightModule();
          break;
        case 'design-story':
          module = await this.loadDesignStoryModule();
          break;
        case 'drop-countdown':
          module = await this.loadDropCountdownModule();
          break;
        default:
          console.warn(`Unknown module: ${moduleName}`);
          return;
      }

      this.loadedModules.set(moduleName, module);
      const loadTime = performance.now() - startTime;
      this.performanceMetrics.set(`${moduleName}-load`, loadTime);

      element.dispatchEvent(new CustomEvent('moduleLoaded', { detail: { module, loadTime } }));
    } catch (error) {
      console.error(`Failed to load module ${moduleName}:`, error);
      this.handleModuleError(element, error);
    }
  }

  async loadCulturalSpotlightModule() {
    // Dynamic import for code splitting
    const { default: CulturalSpotlightManager } = await import(
      /* webpackChunkName: "cultural-spotlight" */
      /* webpackMode: "lazy" */
      './cultural-spotlight.js'
    );
    return new CulturalSpotlightManager();
  }

  async loadDesignStoryModule() {
    const { default: DesignStoryManager } = await import(
      /* webpackChunkName: "design-story" */
      /* webpackMode: "lazy" */
      './design-story.js'
    );
    return new DesignStoryManager();
  }

  async loadDropCountdownModule() {
    const { default: DropCountdownManager } = await import(
      /* webpackChunkName: "drop-countdown" */
      /* webpackMode: "lazy" */
      './drop-countdown.js'
    );
    return new DropCountdownManager();
  }

  setupPerformanceMonitoring() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
    }

    // Resource timing
    window.addEventListener('load', () => {
      this.analyzeResourceTiming();
    });
  }

  observeLCP() {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.set('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeFID() {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.performanceMetrics.set('FID', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  observeCLS() {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.performanceMetrics.set('CLS', clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  analyzeResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceData = {
      total: resources.length,
      css: 0,
      js: 0,
      images: 0,
      totalTime: 0
    };

    resources.forEach(resource => {
      resourceData.totalTime += resource.duration;

      if (resource.name.endsWith('.css')) resourceData.css++;
      else if (resource.name.endsWith('.js')) resourceData.js++;
      else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) resourceData.images++;
    });

    this.performanceMetrics.set('resources', resourceData);
    console.log('Resource Performance:', resourceData);
  }

  preloadCriticalResources() {
    // Preload critical fonts
    this.preloadFont('Tamil Sangam MN');
    this.preloadFont('Noto Sans Tamil');

    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-critical="true"]');
    criticalImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  preloadFont(fontName) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}&display=swap`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  setupLazyLoading() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]:not([data-critical="true"])');
    lazyImages.forEach(img => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(img);
      } else {
        // Fallback for browsers without IntersectionObserver
        this.lazyLoadFallback(img);
      }
    });

    // Lazy load sections
    const lazySections = document.querySelectorAll('[data-lazy="true"]');
    lazySections.forEach(section => {
      if (this.intersectionObserver) {
        this.intersectionObserver.observe(section);
      }
    });
  }

  lazyLoadFallback(element) {
    const loadOnScroll = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.loadLazyElement(element);
        window.removeEventListener('scroll', loadOnScroll);
      }
    };
    window.addEventListener('scroll', loadOnScroll);
    loadOnScroll(); // Check immediately
  }

  loadLazyElement(element) {
    if (element.tagName === 'IMG' && element.dataset.src) {
      element.src = element.dataset.src;
      element.addEventListener('load', () => {
        element.classList.add('loaded');
      });
    }
  }

  validateInput(input, type) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        errorMessage = 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்';
        break;
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = phoneRegex.test(value) && value.length >= 10;
        errorMessage = 'தயவுசெய்து சரியான தொலைபேசி எண்ணை உள்ளிடவும்';
        break;
    }

    this.showValidationFeedback(input, isValid, errorMessage);
  }

  showValidationFeedback(input, isValid, errorMessage) {
    const feedbackElement = input.nextElementSibling;

    if (isValid) {
      input.style.borderColor = 'var(--ravan-saffron)';
      if (feedbackElement && feedbackElement.classList.contains('error-message')) {
        feedbackElement.style.display = 'none';
      }
    } else {
      input.style.borderColor = 'var(--ravan-maroon)';
      if (feedbackElement && feedbackElement.classList.contains('error-message')) {
        feedbackElement.textContent = errorMessage;
        feedbackElement.style.display = 'block';
      }
    }
  }

  handleVariantChange(select) {
    const variantId = select.value;
    const price = select.dataset.price;
    const comparePrice = select.dataset.comparePrice;

    // Update price display
    const priceElement = document.querySelector('.product__price');
    if (priceElement && price) {
      priceElement.textContent = price;
    }

    // Update variant image if available
    const variantImage = document.querySelector(`[data-variant-id="${variantId}"]`);
    if (variantImage) {
      const mainImage = document.querySelector('.product__media img');
      if (mainImage) {
        mainImage.src = variantImage.dataset.src;
        mainImage.srcset = variantImage.dataset.srcset;
      }
    }

    // Dispatch custom event for other components
    document.dispatchEvent(new CustomEvent('variantChanged', {
      detail: { variantId, price, comparePrice }
    }));
  }

  expandCulturalElement(element) {
    const content = element.nextElementSibling;
    const isExpanded = content.style.display === 'block';

    if (isExpanded) {
      content.style.display = 'none';
      element.setAttribute('aria-expanded', 'false');
    } else {
      content.style.display = 'block';
      element.setAttribute('aria-expanded', 'true');
    }
  }

  handleModuleError(element, error) {
    console.error('Module loading error:', error);

    // Show user-friendly error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = 'எங்கள் சேவையில் ஏதோ தவறு நேர்ந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.';
    element.appendChild(errorElement);
  }

  getPerformanceMetrics() {
    return Object.fromEntries(this.performanceMetrics);
  }

  // Cleanup method for proper memory management
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Remove event listeners
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('input', this.handleInput);
    document.removeEventListener('change', this.handleChange);

    // Clear cached modules
    this.loadedModules.clear();
    this.performanceMetrics.clear();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.RavanFashionPerformance = new RavanFashionPerformance();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RavanFashionPerformance;
}