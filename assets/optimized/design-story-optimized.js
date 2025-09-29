/**
 * RAVAN FASHION - OPTIMIZED DESIGN STORY JAVASCRIPT
 * Performance-optimized interactions and animations
 *
 * Optimizations:
 * - Event delegation for reduced listeners
 * - Intersection Observer for lazy loading
 * - RequestAnimationFrame for smooth animations
 * - Touch-optimized interactions
 * - Memory-efficient cleanup
 */

class OptimizedDesignStoryManager {
  constructor() {
    this.observerInstances = new Set();
    this.animationFrameId = null;
    this.eventListeners = new Map();
    this.intersectionThreshold = 0.1;
    this.rootMargin = '50px';

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupEventDelegation();
    this.setupScrollOptimizations();
    this.setupTouchOptimizations();
    this.prefetchCriticalResources();
  }

  /**
   * Setup Intersection Observer with performance optimizations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: [0, 0.1, 0.5, 1]
    };

    this.observer = new IntersectionObserver(
      this.handleIntersections.bind(this),
      observerOptions
    );

    // Observe all animated elements
    this.observeAnimatedElements();
  }

  /**
   * Handle intersection events with batched processing
   */
  handleIntersections(entries) {
    // Batch processing for better performance
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const target = entry.target;

        if (entry.isIntersecting) {
          this.triggerAnimation(target, entry.intersectionRatio);
        } else {
          this.pauseAnimation(target);
        }
      });
    });
  }

  /**
   * Observe all animated elements efficiently
   */
  observeAnimatedElements() {
    const animatedElements = document.querySelectorAll(
      '.journey-step, .design-story__section, .heritage-image, .scroll-animate'
    );

    animatedElements.forEach(element => {
      // Add performance data attributes
      element.dataset.performanceMonitored = 'true';
      element.dataset.animationState = 'pending';

      this.observer.observe(element);
      this.observerInstances.add(element);
    });
  }

  /**
   * Trigger animations with performance optimizations
   */
  triggerAnimation(element, intersectionRatio) {
    if (element.dataset.animationState === 'complete') return;

    element.dataset.animationState = 'animating';

    // Add visible class for CSS transitions
    element.classList.add('visible');

    // Calculate animation delay based on intersection ratio
    const delay = Math.max(0, (1 - intersectionRatio) * 200);

    setTimeout(() => {
      this.executeAnimation(element);
      element.dataset.animationState = 'complete';
    }, delay);
  }

  /**
   * Execute specific animations with GPU optimization
   */
  executeAnimation(element) {
    // Force GPU acceleration for better performance
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';

    // Remove will-change after animation to free memory
    const animationDuration = this.getAnimationDuration(element);

    setTimeout(() => {
      element.style.willChange = 'auto';
    }, animationDuration + 100);
  }

  /**
   * Setup event delegation for better performance
   */
  setupEventDelegation() {
    // Single event listener for all interactions
    document.addEventListener('click', this.handleDelegatedClicks.bind(this), true);
    document.addEventListener('touchstart', this.handleDelegatedTouches.bind(this), { passive: true });

    // Setup resize observer for responsive optimizations
    this.setupResizeObserver();
  }

  /**
   * Handle delegated click events efficiently
   */
  handleDelegatedClicks(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const context = target.closest('.design-story__section');

    switch (action) {
      case 'toggle-accordion':
        this.toggleAccordion(target);
        break;
      case 'change-tab':
        this.changeTab(target);
        break;
      case 'play-story':
        this.playStoryAnimation(context);
        break;
    }
  }

  /**
   * Handle touch events with optimization
   */
  handleDelegatedTouches(event) {
    const target = event.target.closest('.touch-interactive');
    if (!target) return;

    // Add touch feedback class
    target.classList.add('touch-active');

    // Remove touch feedback after delay
    setTimeout(() => {
      target.classList.remove('touch-active');
    }, 200);
  }

  /**
   * Setup scroll optimizations
   */
  setupScrollOptimizations() {
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollDelay = 100; // ms

    window.addEventListener('scroll', () => {
      const currentTime = Date.now();

      // Throttle scroll events
      if (currentTime - lastScrollTime > scrollDelay) {
        this.handleScroll();
        lastScrollTime = currentTime;
      }

      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // Set new timeout for scroll-end detection
      scrollTimeout = setTimeout(() => {
        this.handleScrollEnd();
      }, scrollDelay);
    }, { passive: true });
  }

  /**
   * Handle scroll events efficiently
   */
  handleScroll() {
    // Update parallax elements
    this.updateParallaxElements();

    // Lazy load images
    this.lazyLoadImages();
  }

  /**
   * Handle scroll end for performance optimization
   */
  handleScrollEnd() {
    // Clean up unused elements
    this.cleanupInvisibleElements();

    // Preload nearby content
    this.preloadNearbyContent();
  }

  /**
   * Setup touch optimizations
   */
  setupTouchOptimizations() {
    // Add touch-specific classes
    if ('ontouchstart' in window) {
      document.documentElement.classList.add('touch-device');

      // Optimize touch targets
      this.optimizeTouchTargets();
    }
  }

  /**
   * Optimize touch targets for mobile
   */
  optimizeTouchTargets() {
    const touchTargets = document.querySelectorAll(
      '.cultural-button, .journey-step, .cultural-tab'
    );

    touchTargets.forEach(target => {
      // Ensure minimum touch target size
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
      }

      // Add touch feedback
      target.classList.add('touch-interactive');
    });
  }

  /**
   * Setup resize observer for responsive optimizations
   */
  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(
      this.debounce((entries) => {
        entries.forEach(entry => {
          this.handleResize(entry.target);
        });
      }, 250)
    );

    // Observe container elements
    const containers = document.querySelectorAll('.design-story__journey');
    containers.forEach(container => {
      this.resizeObserver.observe(container);
    });
  }

  /**
   * Handle resize events efficiently
   */
  handleResize(element) {
    // Recalculate layouts
    this.recalculateLayouts(element);

    // Update viewport-based animations
    this.updateViewportAnimations();
  }

  /**
   * Update parallax elements with performance optimization
   */
  updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);

      // Use transform for better performance
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  /**
   * Lazy load images efficiently
   */
  lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]:not([src])');

    lazyImages.forEach(img => {
      if (this.isElementInViewport(img)) {
        this.loadImage(img);
      }
    });
  }

  /**
   * Load individual image with error handling
   */
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    // Create new image to test loading
    const tempImg = new Image();

    tempImg.onload = () => {
      img.src = src;
      if (srcset) img.srcset = srcset;
      img.classList.add('loaded');
      delete img.dataset.src;
      delete img.dataset.srcset;
    };

    tempImg.onerror = () => {
      img.classList.add('error');
      // Use placeholder or fallback
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
    };

    tempImg.src = src;
  }

  /**
   * Check if element is in viewport
   */
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight &&
      rect.bottom >= 0 &&
      rect.left <= window.innerWidth &&
      rect.right >= 0
    );
  }

  /**
   * Prefetch critical resources
   */
  prefetchCriticalResources() {
    // Prefetch above-the-fold images
    const criticalImages = document.querySelectorAll('img[data-priority="high"]');
    criticalImages.forEach(img => this.loadImage(img));

    // Preload fonts
    this.preloadFonts();
  }

  /**
   * Preload fonts efficiently
   */
  preloadFonts() {
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.href = 'https://fonts.gstatic.com/s/notosanstamil/v15/nEKhbZ7WJw0q8sY7zBm2m3q0uA.woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  /**
   * Toggle accordion with animation optimization
   */
  toggleAccordion(element) {
    const content = element.nextElementSibling;
    const isActive = element.classList.contains('active');

    // Close all accordions in the same group
    const group = element.closest('.cultural-accordion-group');
    if (group) {
      const allAccordions = group.querySelectorAll('.cultural-accordion');
      allAccordions.forEach(accordion => {
        accordion.classList.remove('active');
      });
    }

    // Toggle current accordion
    if (!isActive) {
      element.classList.add('active');

      // Use CSS transitions instead of JS animations
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }

  /**
   * Change tab with performance optimization
   */
  changeTab(tabElement) {
    const container = tabElement.closest('.cultural-tabs');
    const tabId = tabElement.dataset.tabId;

    // Update active states
    container.querySelectorAll('.cultural-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    tabElement.classList.add('active');

    // Show/hide content
    const allContents = document.querySelectorAll('[data-tab-content]');
    allContents.forEach(content => {
      if (content.dataset.tabContent === tabId) {
        content.style.display = 'block';
        // Trigger reflow for smooth transitions
        content.offsetHeight;
        content.style.opacity = '1';
      } else {
        content.style.opacity = '0';
        setTimeout(() => {
          content.style.display = 'none';
        }, 300);
      }
    });
  }

  /**
   * Play story animation with performance optimization
   */
  playStoryAnimation(context) {
    const elements = context.querySelectorAll('.animate-on-play');

    elements.forEach((element, index) => {
      // Stagger animations for better performance
      setTimeout(() => {
        element.classList.add('animate-cultural-fade');
      }, index * 100);
    });
  }

  /**
   * Cleanup invisible elements for memory optimization
   */
  cleanupInvisibleElements() {
    const viewportHeight = window.innerHeight;
    const viewportBuffer = viewportHeight * 2; // 2 viewport heights buffer

    this.observerInstances.forEach(element => {
      const rect = element.getBoundingClientRect();

      if (rect.top > viewportBuffer || rect.bottom < -viewportHeight) {
        // Pause animations for off-screen elements
        element.style.animationPlayState = 'paused';
      } else {
        // Resume animations for visible elements
        element.style.animationPlayState = 'running';
      }
    });
  }

  /**
   * Preload nearby content for smooth experience
   */
  preloadNearbyContent() {
    const currentScroll = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const preloadDistance = viewportHeight * 1.5;

    // Find elements near viewport
    const nearbyElements = document.querySelectorAll(
      `[data-preload]:not([data-preloaded])`
    );

    nearbyElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top - viewportHeight / 2);

      if (distance < preloadDistance) {
        this.preloadElement(element);
        element.dataset.preloaded = 'true';
      }
    });
  }

  /**
   * Preload individual element
   */
  preloadElement(element) {
    const type = element.dataset.preload;

    switch (type) {
      case 'image':
        if (element.dataset.src) {
          this.loadImage(element);
        }
        break;
      case 'content':
        // Implement content preloading logic
        break;
    }
  }

  /**
   * Recalculate layouts for responsive design
   */
  recalculateLayouts(container) {
    // Recalculate grid layouts
    const grids = container.querySelectorAll('.cultural-grid');
    grids.forEach(grid => {
      this.updateGridLayout(grid);
    });

    // Recalculate timeline layouts
    const timelines = container.querySelectorAll('.journey-step');
    timelines.forEach(timeline => {
      this.updateTimelineLayout(timeline);
    });
  }

  /**
   * Update grid layout based on container width
   */
  updateGridLayout(grid) {
    const containerWidth = grid.offsetWidth;
    let columns = 1;

    if (containerWidth >= 1200) columns = 4;
    else if (containerWidth >= 768) columns = 3;
    else if (containerWidth >= 480) columns = 2;

    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  /**
   * Update timeline layout for mobile responsiveness
   */
  updateTimelineLayout(timeline) {
    const containerWidth = timeline.offsetWidth;
    const isMobile = containerWidth < 768;

    if (isMobile) {
      timeline.classList.add('mobile-timeline');
    } else {
      timeline.classList.remove('mobile-timeline');
    }
  }

  /**
   * Update viewport-based animations
   */
  updateViewportAnimations() {
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 768;

    // Update animation speeds based on viewport
    const animatedElements = document.querySelectorAll('[data-viewport-speed]');
    animatedElements.forEach(element => {
      const baseSpeed = parseFloat(element.dataset.viewportSpeed || 1);
      const speed = isMobile ? baseSpeed * 0.7 : baseSpeed;
      element.style.animationDuration = `${speed}s`;
    });
  }

  /**
   * Get animation duration from element
   */
  getAnimationDuration(element) {
    const computedStyle = window.getComputedStyle(element);
    const duration = computedStyle.animationDuration || computedStyle.transitionDuration;

    // Convert to milliseconds
    if (duration.includes('ms')) {
      return parseFloat(duration);
    } else if (duration.includes('s')) {
      return parseFloat(duration) * 1000;
    }

    return 300; // Default duration
  }

  /**
   * Debounce function for performance optimization
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function for performance optimization
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Cleanup and destroy for memory management
   */
  destroy() {
    // Disconnect observers
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Clear animation frames
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Remove event listeners
    document.removeEventListener('click', this.handleDelegatedClicks);
    document.removeEventListener('touchstart', this.handleDelegatedTouches);

    // Clear sets and maps
    this.observerInstances.clear();
    this.eventListeners.clear();

    // Cleanup DOM modifications
    const monitoredElements = document.querySelectorAll('[data-performance-monitored]');
    monitoredElements.forEach(element => {
      delete element.dataset.performanceMonitored;
      delete element.dataset.animationState;
    });
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.designStoryManager = new OptimizedDesignStoryManager();
  });
} else {
  window.designStoryManager = new OptimizedDesignStoryManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedDesignStoryManager;
}