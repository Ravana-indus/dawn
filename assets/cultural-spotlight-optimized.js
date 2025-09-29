/**
 * RAVAN FASHION - OPTIMIZED CULTURAL SPOTLIGHT JAVASCRIPT
 * Performance-optimized lazy loading and interactions
 *
 * Optimizations:
 * - Intersection Observer for lazy loading
 * - Event delegation for reduced listeners
 * - RequestAnimationFrame for smooth animations
 * - Memory-efficient state management
 * - Image optimization with progressive loading
 */

class OptimizedCulturalSpotlight {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
    this.observer = null;
    this.imageObserver = null;
    this.animationFrameId = null;
    this.isLoading = false;
    this.loadedImages = new Set();
    this.intersectedItems = new Set();

    this.init();
  }

  init() {
    if (!this.sectionElement) {
      console.warn('Cultural Spotlight section not found');
      return;
    }

    this.setupIntersectionObserver();
    this.setupImageLazyLoading();
    this.setupEventDelegation();
    this.setupScrollAnimations();
    this.setupPerformanceOptimizations();
    this.prefetchCriticalResources();
  }

  /**
   * Setup Intersection Observer for section visibility
   */
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.1, 0.5, 1]
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      observerOptions
    );

    // Observe the section itself
    this.observer.observe(this.sectionElement);

    // Observe individual items for staggered animations
    const items = this.sectionElement.querySelectorAll('.cultural-spotlight__item');
    items.forEach((item, index) => {
      item.dataset.animationDelay = index * 100; // Stagger animations
      this.observer.observe(item);
    });
  }

  /**
   * Handle intersection events
   */
  handleIntersection(entries) {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const target = entry.target;

        if (entry.isIntersecting) {
          this.handleElementVisible(target, entry.intersectionRatio);
        } else {
          this.handleElementHidden(target);
        }
      });
    });
  }

  /**
   * Handle element becoming visible
   */
  handleElementVisible(element, intersectionRatio) {
    // Handle section visibility
    if (element === this.sectionElement) {
      this.loadSectionContent();
      return;
    }

    // Handle item visibility
    if (element.classList.contains('cultural-spotlight__item')) {
      this.animateItem(element, intersectionRatio);
    }

    // Mark element as intersected
    this.intersectedItems.add(element);
  }

  /**
   * Handle element becoming hidden
   */
  handleElementHidden(element) {
    // Pause animations for hidden elements to save resources
    if (element.classList.contains('cultural-spotlight__item')) {
      const animations = element.querySelectorAll('.animate-cultural-fade');
      animations.forEach(anim => {
        anim.style.animationPlayState = 'paused';
      });
    }
  }

  /**
   * Load section content when visible
   */
  loadSectionContent() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.sectionElement.classList.add('section-loading');

    // Load images in this section
    this.loadVisibleImages();

    // Trigger entrance animation
    this.triggerEntranceAnimation();

    // Load section-specific assets
    this.loadSectionAssets();
  }

  /**
   * Animate individual item with staggered timing
   */
  animateItem(item, intersectionRatio) {
    if (item.classList.contains('animated')) return;

    const delay = parseInt(item.dataset.animationDelay || 0);
    const scaledDelay = delay * (1 - intersectionRatio); // Scale delay based on visibility

    setTimeout(() => {
      item.classList.add('animate-cultural-fade', 'visible', 'animated');

      // Resume any paused animations
      const animations = item.querySelectorAll('.animate-cultural-fade');
      animations.forEach(anim => {
        anim.style.animationPlayState = 'running';
      });

      // Load item-specific content
      this.loadItemContent(item);
    }, scaledDelay);
  }

  /**
   * Load item-specific content
   */
  loadItemContent(item) {
    // Load item image if not already loaded
    const imageWrapper = item.querySelector('.image-lazy-wrapper');
    if (imageWrapper && !item.dataset.contentLoaded) {
      this.loadItemImage(imageWrapper);
      item.dataset.contentLoaded = 'true';
    }
  }

  /**
   * Setup image lazy loading with progressive enhancement
   */
  setupImageLazyLoading() {
    const imageOptions = {
      root: null,
      rootMargin: '200px', // Load images before they enter viewport
      threshold: 0.01
    };

    this.imageObserver = new IntersectionObserver(
      this.handleImageIntersection.bind(this),
      imageOptions
    );

    // Observe all lazy images in the section
    const lazyImages = this.sectionElement.querySelectorAll('.lazy-image');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  /**
   * Handle image intersection for lazy loading
   */
  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.imageObserver.unobserve(entry.target);
      }
    });
  }

  /**
   * Load individual image with progressive enhancement
   */
  loadImage(img) {
    if (this.loadedImages.has(img)) return;

    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src) return;

    // Add loading state
    const wrapper = img.closest('.image-lazy-wrapper');
    if (wrapper) {
      wrapper.classList.add('loading');
    }

    // Create new image to test loading
    const tempImg = new Image();

    tempImg.onload = () => {
      // Set image sources
      img.src = src;
      if (srcset) img.srcset = srcset;

      // Add loaded class for fade-in effect
      setTimeout(() => {
        img.classList.add('loaded');
        if (wrapper) {
          wrapper.classList.remove('loading');
        }
      }, 50);

      // Track loaded image
      this.loadedImages.add(img);

      // Dispatch custom event
      this.dispatchEvent('image-loaded', {
        image: img,
        sectionId: this.sectionId
      });
    };

    tempImg.onerror = () => {
      console.warn('Failed to load image:', src);
      img.classList.add('error');
      if (wrapper) {
        wrapper.classList.remove('loading');
      }
    };

    // Start loading
    tempImg.src = src;
    if (srcset) {
      tempImg.srcset = srcset;
    }
  }

  /**
   * Load visible images immediately
   */
  loadVisibleImages() {
    const lazyImages = this.sectionElement.querySelectorAll('.lazy-image');
    lazyImages.forEach(img => {
      if (this.isElementInViewport(img)) {
        this.loadImage(img);
      }
    });
  }

  /**
   * Load item image specifically
   */
  loadItemImage(wrapper) {
    const img = wrapper.querySelector('.lazy-image');
    if (img && !this.loadedImages.has(img)) {
      this.loadImage(img);
    }
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
   * Setup event delegation for better performance
   */
  setupEventDelegation() {
    // Single event listener for all interactions
    this.sectionElement.addEventListener('click', this.handleClick.bind(this), true);
    this.sectionElement.addEventListener('touchstart', this.handleTouch.bind(this), { passive: true });

    // Handle keyboard navigation
    this.sectionElement.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Handle delegated click events
   */
  handleClick(event) {
    const target = event.target;

    // Handle link clicks
    if (target.matches('[data-action="navigate-link"]')) {
      this.handleLinkClick(target, event);
    }

    // Handle item clicks
    if (target.closest('.cultural-spotlight__item')) {
      this.handleItemClick(target.closest('.cultural-spotlight__item'), event);
    }
  }

  /**
   * Handle link clicks with optimization
   */
  handleLinkClick(link, event) {
    const url = link.dataset.linkUrl;
    if (!url) return;

    // Add active state
    link.classList.add('active');

    // Preload destination page
    this.preloadPage(url);

    // Add transition effect
    this.addPageTransition(() => {
      window.location.href = url;
    });
  }

  /**
   * Handle item clicks with analytics
   */
  handleItemClick(item, event) {
    // Track item interaction
    this.trackInteraction('item_click', {
      itemId: item.dataset.itemIndex,
      sectionId: this.sectionId
    });

    // Add visual feedback
    item.classList.add('clicked');
    setTimeout(() => {
      item.classList.remove('clicked');
    }, 300);
  }

  /**
   * Handle touch events for mobile optimization
   */
  handleTouch(event) {
    const target = event.target.closest('.touch-interactive');
    if (!target) return;

    // Add touch feedback
    target.classList.add('touch-active');
    setTimeout(() => {
      target.classList.remove('touch-active');
    }, 200);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(event) {
    const target = event.target;

    // Handle keyboard navigation for items
    if (target.matches('.cultural-spotlight__item') || target.closest('.cultural-spotlight__item')) {
      this.handleItemKeyboard(event);
    }

    // Handle keyboard navigation for links
    if (target.matches('[data-action="navigate-link"]')) {
      this.handleLinkKeyboard(event);
    }
  }

  /**
   * Handle item keyboard navigation
   */
  handleItemKeyboard(event) {
    const item = event.target.closest('.cultural-spotlight__item');
    const items = Array.from(this.sectionElement.querySelectorAll('.cultural-spotlight__item'));
    const currentIndex = items.indexOf(item);

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(items[(currentIndex + 1) % items.length]);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(items[(currentIndex - 1 + items.length) % items.length]);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleItemClick(item, event);
        break;
    }
  }

  /**
   * Handle link keyboard navigation
   */
  handleLinkKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.target.click();
    }
  }

  /**
   * Focus item with accessibility support
   */
  focusItem(item) {
    const focusableElement = item.querySelector('a, button, [tabindex]') || item;
    focusableElement.focus();
  }

  /**
   * Setup scroll animations with performance optimization
   */
  setupScrollAnimations() {
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollDelay = 100;

    const scrollHandler = () => {
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
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  /**
   * Handle scroll events efficiently
   */
  handleScroll() {
    // Update parallax effects if any
    this.updateParallaxEffects();

    // Load images that come into view
    this.loadVisibleImages();
  }

  /**
   * Handle scroll end for performance optimization
   */
  handleScrollEnd() {
    // Cleanup unused resources
    this.cleanupInvisibleElements();

    // Preload nearby content
    this.preloadNearbyContent();
  }

  /**
   * Update parallax effects for visual enhancement
   */
  updateParallaxEffects() {
    const parallaxElements = this.sectionElement.querySelectorAll('[data-parallax]');
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Optimize for device capabilities
    this.optimizeForDevice();

    // Setup resize observer for responsive updates
    this.setupResizeObserver();

    // Handle visibility changes
    this.setupVisibilityHandling();

    // Optimize animations for user preferences
    this.setupAnimationPreferences();
  }

  /**
   * Optimize based on device capabilities
   */
  optimizeForDevice() {
    const isLowEndDevice = this.isLowEndDevice();
    const isMobile = this.isMobile();

    if (isLowEndDevice) {
      // Reduce animation complexity
      this.sectionElement.classList.add('low-end-device');

      // Reduce image quality
      this.reduceImageQuality();
    }

    if (isMobile) {
      // Add mobile-specific optimizations
      this.sectionElement.classList.add('mobile-device');
      this.optimizeForMobile();
    }
  }

  /**
   * Check if device is low-end
   */
  isLowEndDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = navigator.deviceMemory < 4;
    const hasSlowConnection = navigator.connection?.effectiveType?.includes('2g');

    return isMobile && (hasLowMemory || hasSlowConnection);
  }

  /**
   * Check if device is mobile
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Reduce image quality for low-end devices
   */
  reduceImageQuality() {
    const images = this.sectionElement.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.dataset.src;
      if (src) {
        // Add quality parameter if supported
        if (src.includes('cdn.shopify.com')) {
          img.dataset.src = src + '&width=800&quality=70';
        }
      }
    });
  }

  /**
   * Optimize for mobile devices
   */
  optimizeForMobile() {
    // Reduce animations
    this.reduceMobileAnimations();

    // Optimize touch targets
    this.optimizeTouchTargets();

    // Lazy load non-critical content
    this.lazyLoadNonCritical();
  }

  /**
   * Reduce animations on mobile
   */
  reduceMobileAnimations() {
    const animatedElements = this.sectionElement.querySelectorAll('.animate-cultural-fade');
    animatedElements.forEach(element => {
      element.style.animationDuration = '0.3s';
    });
  }

  /**
   * Optimize touch targets for mobile
   */
  optimizeTouchTargets() {
    const touchTargets = this.sectionElement.querySelectorAll('.cultural-spotlight__link, .cultural-spotlight__button');
    touchTargets.forEach(target => {
      // Ensure minimum touch target size
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
      }
      target.classList.add('touch-interactive');
    });
  }

  /**
   * Lazy load non-critical content
   */
  lazyLoadNonCritical() {
    // Implement lazy loading for descriptions, etc.
    const descriptions = this.sectionElement.querySelectorAll('.cultural-spotlight__item-description');
    descriptions.forEach(desc => {
      if (!this.isElementInViewport(desc)) {
        desc.style.display = 'none';
        desc.dataset.lazyContent = 'true';
      }
    });
  }

  /**
   * Setup resize observer for responsive updates
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

    // Observe the section container
    this.resizeObserver.observe(this.sectionElement);

    // Observe grid container
    const grid = this.sectionElement.querySelector('.cultural-spotlight__grid');
    if (grid) {
      this.resizeObserver.observe(grid);
    }
  }

  /**
   * Handle resize events
   */
  handleResize(element) {
    if (element.classList.contains('cultural-spotlight__grid')) {
      this.updateGridLayout(element);
    }

    // Re-evaluate visible elements
    this.loadVisibleImages();
  }

  /**
   * Update grid layout based on container size
   */
  updateGridLayout(grid) {
    const containerWidth = grid.offsetWidth;
    const columns = parseInt(grid.dataset.gridColumns) || 3;
    const columnsMobile = parseInt(grid.dataset.gridColumnsMobile) || 1;

    let effectiveColumns = columnsMobile;
    if (containerWidth >= 750) {
      effectiveColumns = Math.min(columns, Math.floor(containerWidth / 300));
    }

    grid.style.gridTemplateColumns = `repeat(${effectiveColumns}, 1fr)`;
  }

  /**
   * Setup visibility handling for performance
   */
  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  /**
   * Pause animations when page is hidden
   */
  pauseAnimations() {
    const animations = this.sectionElement.querySelectorAll('.animate-cultural-fade');
    animations.forEach(anim => {
      anim.style.animationPlayState = 'paused';
    });
  }

  /**
   * Resume animations when page is visible
   */
  resumeAnimations() {
    const animations = this.sectionElement.querySelectorAll('.animate-cultural-fade.visible');
    animations.forEach(anim => {
      anim.style.animationPlayState = 'running';
    });
  }

  /**
   * Setup animation preferences based on user settings
   */
  setupAnimationPreferences() {
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.sectionElement.classList.add('reduced-motion');
      this.disableComplexAnimations();
    }

    // Handle high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.sectionElement.classList.add('high-contrast');
    }
  }

  /**
   * Disable complex animations for reduced motion
   */
  disableComplexAnimations() {
    const animatedElements = this.sectionElement.querySelectorAll('.animate-cultural-fade');
    animatedElements.forEach(element => {
      element.style.animation = 'none';
      element.style.transition = 'none';
    });
  }

  /**
   * Prefetch critical resources
   */
  prefetchCriticalResources() {
    // Prefetch fonts
    this.prefetchFonts();

    // Preload above-the-fold images
    this.preloadAboveFoldImages();

    // Prefetch critical assets
    this.prefetchAssets();
  }

  /**
   * Prefetch fonts
   */
  prefetchFonts() {
    const fontLink = document.createElement('link');
    fontLink.rel = 'prefetch';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.href = 'https://fonts.gstatic.com/s/notosanstamil/v15/nEKhbZ7WJw0q8sY7zBm2m3q0uA.woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  }

  /**
   * Preload above-the-fold images
   */
  preloadAboveFoldImages() {
    const firstItem = this.sectionElement.querySelector('.cultural-spotlight__item');
    if (firstItem) {
      const img = firstItem.querySelector('.lazy-image');
      if (img) {
        img.loading = 'eager';
        img.fetchpriority = 'high';
        if (!this.loadedImages.has(img)) {
          this.loadImage(img);
        }
      }
    }
  }

  /**
   * Prefetch critical assets
   */
  prefetchAssets() {
    // Prefetch CSS and JS files if needed
    const criticalAssets = [
      'section-cultural-spotlight-optimized.css',
      'cultural-spotlight-optimized.js'
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = asset;
      document.head.appendChild(link);
    });
  }

  /**
   * Trigger entrance animation
   */
  triggerEntranceAnimation() {
    const header = this.sectionElement.querySelector('.cultural-spotlight__header');
    const description = this.sectionElement.querySelector('.cultural-spotlight__description');
    const buttonWrapper = this.sectionElement.querySelector('.cultural-spotlight__button-wrapper');

    // Animate header first
    if (header) {
      setTimeout(() => {
        header.classList.add('visible');
      }, 100);
    }

    // Animate description
    if (description) {
      setTimeout(() => {
        description.classList.add('visible');
      }, 200);
    }

    // Animate button
    if (buttonWrapper) {
      setTimeout(() => {
        buttonWrapper.classList.add('visible');
      }, 300);
    }
  }

  /**
   * Load section-specific assets
   */
  loadSectionAssets() {
    // Load any additional assets required for this section
    // This can be extended based on specific needs
  }

  /**
   * Preload page for faster navigation
   */
  preloadPage(url) {
    if (this.preloadedPages && this.preloadedPages.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);

    if (!this.preloadedPages) {
      this.preloadedPages = new Set();
    }
    this.preloadedPages.add(url);
  }

  /**
   * Add page transition effect
   */
  addPageTransition(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--ravan-saffron);
      opacity: 0;
      pointer-events: none;
      z-index: 9999;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.8';
    });

    // Execute callback and fade out
    setTimeout(() => {
      callback();
      overlay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, 100);
  }

  /**
   * Cleanup invisible elements for memory optimization
   */
  cleanupInvisibleElements() {
    const viewportHeight = window.innerHeight;
    const viewportBuffer = viewportHeight * 3; // 3 viewport heights buffer

    this.intersectedItems.forEach(element => {
      const rect = element.getBoundingClientRect();

      if (rect.top > viewportBuffer || rect.bottom < -viewportBuffer) {
        // Element is far outside viewport
        if (element.classList.contains('cultural-spotlight__item')) {
          // Hide complex content
          const content = element.querySelector('.cultural-spotlight__content');
          if (content && !this.isElementInViewport(content)) {
            content.style.display = 'none';
            element.dataset.hiddenContent = 'true';
          }
        }
      } else {
        // Element is near viewport, show hidden content
        if (element.dataset.hiddenContent === 'true') {
          const content = element.querySelector('.cultural-spotlight__content');
          if (content) {
            content.style.display = 'block';
            delete element.dataset.hiddenContent;
          }
        }
      }
    });
  }

  /**
   * Preload nearby content for smooth experience
   */
  preloadNearbyContent() {
    // Implement preloading of nearby sections or content
    // This can be extended based on specific needs
  }

  /**
   * Track user interactions for analytics
   */
  trackInteraction(action, data) {
    // Implement analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'cultural_spotlight',
        event_label: this.sectionId,
        ...data
      });
    }

    // Dispatch custom event
    this.dispatchEvent('user-interaction', {
      action,
      sectionId: this.sectionId,
      ...data
    });
  }

  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Debounce function for performance
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
   * Throttle function for performance
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
   * Public methods for external control
   */
  pause() {
    this.pauseAnimations();
  }

  resume() {
    this.resumeAnimations();
  }

  refresh() {
    // Refresh section content
    this.loadVisibleImages();
    this.updateGridLayout(this.sectionElement.querySelector('.cultural-spotlight__grid'));
  }

  destroy() {
    // Cleanup observers
    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Cancel animation frames
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Remove event listeners
    this.sectionElement.removeEventListener('click', this.handleClick);
    this.sectionElement.removeEventListener('touchstart', this.handleTouch);
    this.sectionElement.removeEventListener('keydown', this.handleKeydown);

    // Clear sets
    this.loadedImages.clear();
    this.intersectedItems.clear();
  }
}

// Initialize all cultural spotlight sections on page load
document.addEventListener('DOMContentLoaded', () => {
  const culturalSpotlightInstances = new Map();

  // Initialize all cultural spotlight sections
  document.querySelectorAll('[data-section-type="cultural-spotlight"]').forEach(section => {
    const sectionId = section.dataset.sectionId;
    if (sectionId) {
      const instance = new OptimizedCulturalSpotlight(sectionId);
      culturalSpotlightInstances.set(sectionId, instance);
    }
  });

  // Store instances globally for external access
  window.culturalSpotlightInstances = culturalSpotlightInstances;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedCulturalSpotlight;
}