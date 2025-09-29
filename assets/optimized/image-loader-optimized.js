/**
 * RAVAN FASHION - OPTIMIZED IMAGE LOADING STRATEGIES
 * Comprehensive image optimization with modern web standards
 *
 * Features:
 * - Responsive images with srcset and sizes
 * - WebP format support with fallbacks
 * - Lazy loading with Intersection Observer
 * - Adaptive quality based on network conditions
 * - Progressive image loading
 * - Critical image prioritization
 */

class OptimizedImageLoader {
  constructor() {
    this.observer = null;
    this.loadedImages = new WeakSet();
    this.networkInfo = null;
    this.imageCache = new Map();
    this.preloadQueue = new Set();

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupNetworkMonitoring();
    this.setupPreloadStrategy();
    this.setupImageOptimizations();
  }

  /**
   * Setup Intersection Observer for lazy loading
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px 0px',
      threshold: [0, 0.01, 0.1, 0.5, 1]
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );

    // Observe all lazy images
    this.observeLazyImages();
  }

  /**
   * Handle intersection events with performance optimizations
   */
  handleIntersection(entries) {
    requestAnimationFrame(() => {
      entries.forEach(entry => {
        const img = entry.target;

        if (entry.isIntersecting) {
          this.loadImage(img);
        } else if (entry.intersectionRatio === 0) {
          // Optionally unload distant images
          this.unloadDistantImage(img);
        }
      });
    });
  }

  /**
   * Load image with progressive enhancement
   */
  loadImage(img) {
    if (this.loadedImages.has(img)) return;

    const dataset = img.dataset;
    const src = dataset.src || img.src;
    const srcset = dataset.srcset || img.srcset;
    const sizes = dataset.sizes || img.sizes;
    const priority = dataset.priority || 'normal';

    // Mark as loading
    img.classList.add('loading');
    img.dataset.loadingState = 'loading';

    // Create temporary image for preloading
    const tempImg = new Image();

    tempImg.onload = () => {
      this.applyImage(img, tempImg, src, srcset, sizes);
      this.loadedImages.add(img);
      img.classList.remove('loading');
      img.classList.add('loaded');
      img.dataset.loadingState = 'loaded';

      // Trigger custom event
      this.dispatchImageEvent(img, 'load');
    };

    tempImg.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      img.dataset.loadingState = 'error';

      // Use fallback or placeholder
      this.handleImageError(img);
      this.dispatchImageEvent(img, 'error');
    };

    // Set adaptive quality based on network
    const optimizedSrc = this.getOptimizedImageUrl(src, priority);

    if (srcset) {
      tempImg.srcset = this.getOptimizedSrcset(srcset);
    } else {
      tempImg.src = optimizedSrc;
    }

    if (sizes) {
      tempImg.sizes = sizes;
    }
  }

  /**
   * Apply loaded image to DOM element
   */
  applyImage(img, tempImg, src, srcset, sizes) {
    // Apply smooth fade-in transition
    img.style.opacity = '0';

    if (srcset) {
      img.srcset = srcset;
    } else {
      img.src = src;
    }

    if (sizes) {
      img.sizes = sizes;
    }

    // Force reflow and fade in
    img.offsetHeight;
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '1';

    // Cache natural dimensions
    if (tempImg.naturalWidth && tempImg.naturalHeight) {
      img.dataset.naturalWidth = tempImg.naturalWidth;
      img.dataset.naturalHeight = tempImg.naturalHeight;
      this.updateImageAspect(img);
    }
  }

  /**
   * Get optimized image URL based on conditions
   */
  getOptimizedImageUrl(url, priority = 'normal') {
    if (!url) return url;

    // Skip data URLs and external URLs
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }

    // Parse Shopify image URL
    const shopifyRegex = /(_\d+x\d+|_small|_medium|_large|_grande)?(\.(jpg|jpeg|png|gif|webp))$/i;
    const match = url.match(shopifyRegex);

    if (match) {
      const extension = match[2];
      const baseUrl = url.substring(0, match.index);

      // Determine appropriate size based on priority and device
      const size = this.getImageSize(priority);
      const quality = this.getImageQuality(priority);

      // Add WebP support if browser supports it
      if (this.supportsWebP()) {
        return `${baseUrl}_${size}.webp?width=${size.width}&height=${size.height}&crop=center&quality=${quality}`;
      }

      return `${baseUrl}_${size}${extension}?width=${size.width}&height=${size.height}&crop=center&quality=${quality}`;
    }

    return url;
  }

  /**
   * Get optimized srcset for responsive images
   */
  getOptimizedSrcset(srcset) {
    if (!srcset) return '';

    return srcset.split(',').map(descriptor => {
      const [url, width] = descriptor.trim().split(/\s+/);
      const optimizedUrl = this.getOptimizedImageUrl(url, 'responsive');
      return `${optimizedUrl} ${width}`;
    }).join(', ');
  }

  /**
   * Determine image size based on priority and device
   */
  getImageSize(priority) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const viewportWidth = window.innerWidth;

    const sizes = {
      critical: { width: Math.min(viewportWidth * devicePixelRatio, 2000), height: 2000 },
      high: { width: Math.min(viewportWidth * devicePixelRatio, 1500), height: 1500 },
      normal: { width: Math.min(viewportWidth * devicePixelRatio, 1000), height: 1000 },
      low: { width: Math.min(viewportWidth * devicePixelRatio, 500), height: 500 }
    };

    return sizes[priority] || sizes.normal;
  }

  /**
   * Get image quality based on network conditions
   */
  getImageQuality(priority) {
    if (!this.networkInfo) return 85;

    const { effectiveType, saveData } = this.networkInfo;

    if (saveData) return 60;

    const qualityMap = {
      'slow-2g': { critical: 70, high: 60, normal: 50, low: 40 },
      '2g': { critical: 80, high: 70, normal: 60, low: 50 },
      '3g': { critical: 85, high: 80, normal: 75, low: 70 },
      '4g': { critical: 90, high: 85, normal: 80, low: 75 }
    };

    const networkQuality = qualityMap[effectiveType] || qualityMap['4g'];
    return networkQuality[priority] || 80;
  }

  /**
   * Setup network monitoring for adaptive loading
   */
  setupNetworkMonitoring() {
    if ('connection' in navigator) {
      this.networkInfo = navigator.connection;

      // Listen for network changes
      this.networkInfo.addEventListener('change', () => {
        this.updateImageQuality();
      });
    }
  }

  /**
   * Setup preload strategy for critical images
   */
  setupPreloadStrategy() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-priority="critical"]');
    criticalImages.forEach(img => {
      this.preloadImage(img);
    });

    // Preload images in viewport
    this.preloadViewportImages();
  }

  /**
   * Preload individual image
   */
  preloadImage(img) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';

    if (img.dataset.srcset) {
      link.imageSrcset = img.dataset.srcset;
      link.imageSizes = img.dataset.sizes || '100vw';
    } else {
      link.href = img.dataset.src || img.src;
    }

    document.head.appendChild(link);
  }

  /**
   * Setup image optimizations
   */
  setupImageOptimizations() {
    // Add loading="lazy" to all images that don't have it
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading = 'lazy';
    });

    // Add decoding="async" for better performance
    document.querySelectorAll('img:not([decoding])').forEach(img => {
      img.decoding = 'async';
    });

    // Setup responsive image handling
    this.setupResponsiveImages();
  }

  /**
   * Setup responsive images with srcset
   */
  setupResponsiveImages() {
    const responsiveImages = document.querySelectorAll('img[data-responsive="true"]');

    responsiveImages.forEach(img => {
      this.generateSrcset(img);
      this.generateSizes(img);
    });
  }

  /**
   * Generate srcset for responsive images
   */
  generateSrcset(img) {
    const baseUrl = img.dataset.src || img.src;
    if (!baseUrl) return;

    const widths = [320, 480, 768, 1024, 1280, 1536, 1920];
    const srcset = widths.map(width => {
      const url = this.getOptimizedImageUrl(baseUrl, 'responsive');
      return `${url.replace(/(_\d+x\d+)?(\.\w+)/, `_${width}x$2`)} ${width}w`;
    }).join(', ');

    img.srcset = srcset;
  }

  /**
   * Generate sizes attribute for responsive images
   */
  generateSizes(img) {
    const container = img.closest('[data-container-width]');
    const defaultSizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

    if (container) {
      const containerWidth = container.dataset.containerWidth;
      img.sizes = containerWidth || defaultSizes;
    } else {
      img.sizes = defaultSizes;
    }
  }

  /**
   * Observe all lazy images
   */
  observeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset], img[loading="lazy"]');

    lazyImages.forEach(img => {
      this.observer.observe(img);
    });
  }

  /**
   * Unload distant images for memory optimization
   */
  unloadDistantImage(img) {
    if (img.dataset.priority === 'critical' || img.dataset.priority === 'high') {
      return; // Don't unload important images
    }

    const rect = img.getBoundingClientRect();
    const distance = Math.abs(rect.top - window.innerHeight / 2);

    if (distance > window.innerHeight * 3) {
      // Replace with placeholder
      if (img.src && !img.src.startsWith('data:')) {
        img.dataset.originalSrc = img.src;
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
      }
    }
  }

  /**
   * Handle image loading errors
   */
  handleImageError(img) {
    const fallbackSrc = img.dataset.fallback ||
                       'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz4KICA8dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';

    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    }
  }

  /**
   * Update image quality based on network conditions
   */
  updateImageQuality() {
    const images = document.querySelectorAll('img[data-loading-state="loaded"]');

    images.forEach(img => {
      if (img.dataset.priority === 'low') {
        const optimizedSrc = this.getOptimizedImageUrl(img.src, 'low');
        if (optimizedSrc !== img.src) {
          img.src = optimizedSrc;
        }
      }
    });
  }

  /**
   * Update image aspect ratio for better CLS
   */
  updateImageAspect(img) {
    const naturalWidth = parseInt(img.dataset.naturalWidth);
    const naturalHeight = parseInt(img.dataset.naturalHeight);

    if (naturalWidth && naturalHeight) {
      const aspectRatio = (naturalHeight / naturalWidth) * 100;
      img.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`;

      // Update parent container if needed
      const container = img.closest('.image-container');
      if (container) {
        container.style.paddingBottom = `${aspectRatio}%`;
      }
    }
  }

  /**
   * Preload images in viewport
   */
  preloadViewportImages() {
    const viewportImages = document.querySelectorAll('img[data-preload="viewport"]');

    viewportImages.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.loadImage(img);
      }
    });
  }

  /**
   * Check if browser supports WebP
   */
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
  }

  /**
   * Dispatch custom image event
   */
  dispatchImageEvent(img, type) {
    const event = new CustomEvent(`optimizedImage${type}`, {
      detail: { img, type },
      bubbles: true
    });

    img.dispatchEvent(event);
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.loadedImages.clear();
    this.imageCache.clear();
    this.preloadQueue.clear();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.optimizedImageLoader = new OptimizedImageLoader();
  });
} else {
  window.optimizedImageLoader = new OptimizedImageLoader();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedImageLoader;
}