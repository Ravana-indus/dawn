/**
 * RAVAN FASHION - MOBILE PERFORMANCE OPTIMIZATIONS
 * Specialized optimizations for mobile devices and low-end devices
 *
 * Features:
 * - Device detection and capabilities assessment
 * - Touch optimization and gesture handling
 * - Mobile-specific lazy loading
 * - Network-aware resource loading
 * - Battery-conscious optimizations
 * - Memory management for mobile devices
 * - Viewport-based optimizations
 */

class MobileOptimizationManager {
  constructor() {
    this.deviceInfo = this.detectDevice();
    this.networkInfo = this.getNetworkInfo();
    this.memoryInfo = this.getMemoryInfo();
    this.batteryInfo = null;
    this.isLowEndDevice = this.isLowEndDevice();
    this.isSlowNetwork = this.isSlowNetwork();
    this.optimizationLevel = this.calculateOptimizationLevel();

    this.init();
  }

  init() {
    this.setupDeviceSpecificOptimizations();
    this.setupTouchOptimizations();
    this.setupNetworkAwareLoading();
    this.setupMemoryOptimizations();
    this.setupViewportOptimizations();
    this.setupPerformanceMonitoring();
    this.setupBatteryOptimizations();
  }

  /**
   * Detect device capabilities
   */
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
    const isTablet = /ipad|tablet/i.test(userAgent) || (isMobile && window.innerWidth > 768);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);

    // Device memory and cores
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // Screen capabilities
    const screenResolution = {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1
    };

    // Touch capabilities
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const isTouchDevice = maxTouchPoints > 0;

    return {
      isMobile,
      isTablet,
      isIOS,
      isAndroid,
      isSafari,
      deviceMemory,
      hardwareConcurrency,
      screenResolution,
      maxTouchPoints,
      isTouchDevice,
      userAgent
    };
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false,
        type: connection.type
      };
    }

    return {
      effectiveType: '4g',
      downlink: 10,
      rtt: 100,
      saveData: false,
      type: 'unknown'
    };
  }

  /**
   * Get memory information
   */
  getMemoryInfo() {
    if ('deviceMemory' in navigator) {
      return {
        deviceMemory: navigator.deviceMemory,
        isLowMemory: navigator.deviceMemory < 4
      };
    }

    return {
      deviceMemory: 4,
      isLowMemory: false
    };
  }

  /**
   * Check if low-end device
   */
  isLowEndDevice() {
    const { deviceMemory, hardwareConcurrency, screenResolution } = this.deviceInfo;
    const { effectiveType } = this.networkInfo;

    return (
      deviceMemory < 4 ||
      hardwareConcurrency < 4 ||
      (screenResolution.width * screenResolution.pixelRatio < 1000) ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g'
    );
  }

  /**
   * Check if slow network
   */
  isSlowNetwork() {
    const { effectiveType, saveData } = this.networkInfo;
    return effectiveType === 'slow-2g' || effectiveType === '2g' || saveData;
  }

  /**
   * Calculate optimization level
   */
  calculateOptimizationLevel() {
    if (this.isLowEndDevice && this.isSlowNetwork) {
      return 'minimal'; // Minimal features, essential only
    } else if (this.isLowEndDevice || this.isSlowNetwork) {
      return 'balanced'; // Balanced performance and features
    } else {
      return 'full'; // Full feature set
    }
  }

  /**
   * Setup device-specific optimizations
   */
  setupDeviceSpecificOptimizations() {
    // Apply device-specific classes
    this.applyDeviceClasses();

    // Optimize based on device capabilities
    this.optimizeForDeviceCapabilities();

    // Setup device-specific features
    this.setupDeviceSpecificFeatures();
  }

  /**
   * Apply device-specific CSS classes
   */
  applyDeviceClasses() {
    const html = document.documentElement;

    // Device type classes
    if (this.deviceInfo.isMobile) {
      html.classList.add('mobile-device');
    }
    if (this.deviceInfo.isTablet) {
      html.classList.add('tablet-device');
    }
    if (this.deviceInfo.isIOS) {
      html.classList.add('ios-device');
    }
    if (this.deviceInfo.isAndroid) {
      html.classList.add('android-device');
    }
    if (this.deviceInfo.isSafari) {
      html.classList.add('safari-browser');
    }

    // Device capability classes
    if (this.isLowEndDevice) {
      html.classList.add('low-end-device');
    }
    if (this.isSlowNetwork) {
      html.classList.add('slow-network');
    }
    if (this.deviceInfo.isTouchDevice) {
      html.classList.add('touch-device');
    }

    // Optimization level class
    html.classList.add(`optimization-${this.optimizationLevel}`);
  }

  /**
   * Optimize based on device capabilities
   */
  optimizeForDeviceCapabilities() {
    // Adjust animations based on device capabilities
    this.adjustAnimations();

    // Optimize image quality based on device
    this.optimizeImageQuality();

    // Adjust font loading strategy
    this.adjustFontLoading();

    // Optimize video playback
    this.optimizeVideoPlayback();
  }

  /**
   * Adjust animations for device
   */
  adjustAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .mobile-device .animate-on-scroll,
      .low-end-device .animate-on-scroll,
      .slow-network .animate-on-scroll {
        animation: none !important;
        transition: none !important;
      }

      .mobile-device .fade-in,
      .low-end-device .fade-in,
      .slow-network .fade-in {
        opacity: 1 !important;
        transform: none !important;
      }

      .optimization-minimal * {
        animation-duration: 0ms !important;
        transition-duration: 0ms !important;
      }

      .optimization-balanced * {
        animation-duration: 0.3s !important;
        transition-duration: 0.2s !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Optimize image quality for device
   */
  optimizeImageQuality() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Set lower quality for slow networks
      if (this.isSlowNetwork) {
        img.dataset.quality = '60';
      }

      // Enable lazy loading for mobile
      if (this.deviceInfo.isMobile) {
        img.loading = 'lazy';
      }

      // Use mobile-specific image formats
      if (this.deviceInfo.isMobile && this.supportsWebP()) {
        img.dataset.format = 'webp';
      }
    });
  }

  /**
   * Adjust font loading strategy
   */
  adjustFontLoading() {
    if (this.isSlowNetwork) {
      // Use system fonts for slow networks
      const style = document.createElement('style');
      style.textContent = `
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Optimize video playback
   */
  optimizeVideoPlayback() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
      if (this.deviceInfo.isMobile) {
        // Enable mobile-specific video optimizations
        video.playsInline = true;
        video.disablePictureInPicture = true;
        video.preload = 'none';
      }
    });
  }

  /**
   * Setup device-specific features
   */
  setupDeviceSpecificFeatures() {
    // iOS-specific optimizations
    if (this.deviceInfo.isIOS) {
      this.setupIOSOptimizations();
    }

    // Android-specific optimizations
    if (this.deviceInfo.isAndroid) {
      this.setupAndroidOptimizations();
    }

    // Safari-specific optimizations
    if (this.deviceInfo.isSafari) {
      this.setupSafariOptimizations();
    }
  }

  /**
   * Setup iOS optimizations
   */
  setupIOSOptimizations() {
    // Fix iOS specific issues
    const style = document.createElement('style');
    style.textContent = `
      .ios-device {
        -webkit-overflow-scrolling: auto;
      }

      .ios-device .scroll-container {
        -webkit-overflow-scrolling: touch;
      }

      /* Fix iOS viewport height issue */
      .ios-device .viewport-height {
        height: -webkit-fill-available;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup Android optimizations
   */
  setupAndroidOptimizations() {
    // Fix Android specific issues
    const style = document.createElement('style');
    style.textContent = `
      .android-device {
        -webkit-tap-highlight-color: transparent;
      }

      .android-device .touch-target {
        min-height: 48px;
        min-width: 48px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup Safari optimizations
   */
  setupSafariOptimizations() {
    // Fix Safari specific issues
    const style = document.createElement('style');
    style.textContent = `
      .safari-browser {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .safari-browser .backdrop-filter {
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup touch optimizations
   */
  setupTouchOptimizations() {
    if (!this.deviceInfo.isTouchDevice) return;

    // Optimize touch targets
    this.optimizeTouchTargets();

    // Setup touch gestures
    this.setupTouchGestures();

    // Handle touch feedback
    this.setupTouchFeedback();
  }

  /**
   * Optimize touch targets
   */
  optimizeTouchTargets() {
    const touchTargets = document.querySelectorAll('button, .button, .clickable, a');

    touchTargets.forEach(target => {
      // Ensure minimum touch target size
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
      }

      // Add touch-specific classes
      target.classList.add('touch-optimized');
    });
  }

  /**
   * Setup touch gestures
   */
  setupTouchGestures() {
    // Setup swipe gestures for navigation
    this.setupSwipeNavigation();

    // Setup pinch-to-zoom for images
    this.setupPinchToZoom();
  }

  /**
   * Setup swipe navigation
   */
  setupSwipeNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  /**
   * Handle swipe gestures
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        this.navigateNext();
      } else {
        // Swipe right - previous
        this.navigatePrevious();
      }
    }
  }

  /**
   * Setup pinch-to-zoom
   */
  setupPinchToZoom() {
    const images = document.querySelectorAll('img[data-zoomable]');

    images.forEach(img => {
      let scale = 1;
      let lastScale = 1;
      let startX = 0;
      let startY = 0;

      img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
          startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
          lastScale = scale;
        }
      }, { passive: false });

      img.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const currentScale = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          ) / Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          );

          scale = Math.min(Math.max(lastScale * currentScale, 1), 3);
          img.style.transform = `scale(${scale})`;
        }
      }, { passive: false });
    });
  }

  /**
   * Setup touch feedback
   */
  setupTouchFeedback() {
    const touchElements = document.querySelectorAll('.touch-optimized');

    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      }, { passive: true });

      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
    });
  }

  /**
   * Setup network-aware loading
   */
  setupNetworkAwareLoading() {
    // Monitor network changes
    this.monitorNetworkChanges();

    // Adjust resource loading based on network
    this.adjustResourceLoading();

    // Setup offline handling
    this.setupOfflineHandling();
  }

  /**
   * Monitor network changes
   */
  monitorNetworkChanges() {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      connection.addEventListener('change', () => {
        this.networkInfo = this.getNetworkInfo();
        this.optimizationLevel = this.calculateOptimizationLevel();
        this.adjustOptimizations();
      });
    }
  }

  /**
   * Adjust resource loading based on network
   */
  adjustResourceLoading() {
    if (this.isSlowNetwork) {
      // Reduce image quality
      this.reduceImageQuality();

      // Disable non-essential scripts
      this.disableNonEssentialScripts();

      // Use system fonts
      this.useSystemFonts();
    }
  }

  /**
   * Reduce image quality
   */
  reduceImageQuality() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (img.src) {
        const url = new URL(img.src, window.location.origin);
        url.searchParams.set('quality', '60');
        url.searchParams.set('width', Math.min(img.naturalWidth || 800, 800));
        img.src = url.toString();
      }
    });
  }

  /**
   * Disable non-essential scripts
   */
  disableNonEssentialScripts() {
    const scripts = document.querySelectorAll('script[data-priority="low"]');
    scripts.forEach(script => {
      script.remove();
    });
  }

  /**
   * Use system fonts
   */
  useSystemFonts() {
    const style = document.createElement('style');
    style.textContent = `
      body, h1, h2, h3, h4, h5, h6, p, span, div {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup offline handling
   */
  setupOfflineHandling() {
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });
  }

  /**
   * Handle offline state
   */
  handleOffline() {
    document.body.classList.add('offline');
    this.showOfflineIndicator();
  }

  /**
   * Handle online state
   */
  handleOnline() {
    document.body.classList.remove('offline');
    this.hideOfflineIndicator();
    this.syncOfflineData();
  }

  /**
   * Show offline indicator
   */
  showOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.innerHTML = `
      <div class="offline-indicator__content">
        <span class="offline-indicator__text">You're offline</span>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .offline-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        padding: 8px;
        text-align: center;
        z-index: 9999;
        font-size: 14px;
        font-weight: 600;
      }

      .offline-indicator__content {
        max-width: 1200px;
        margin: 0 auto;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(indicator);
  }

  /**
   * Hide offline indicator
   */
  hideOfflineIndicator() {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  /**
   * Sync offline data
   */
  syncOfflineData() {
    // Implementation depends on your offline storage strategy
    console.log('Syncing offline data...');
  }

  /**
   * Setup memory optimizations
   */
  setupMemoryOptimizations() {
    if (this.memoryInfo.isLowMemory) {
      // Enable memory conservation
      this.enableMemoryConservation();

      // Setup garbage collection hints
      this.setupGarbageCollectionHints();
    }
  }

  /**
   * Enable memory conservation
   */
  enableMemoryConservation() {
    // Reduce image cache size
    this.reduceImageCache();

    // Limit JavaScript heap
    this.limitJavaScriptHeap();

    // Optimize DOM operations
    this.optimizeDOMOperations();
  }

  /**
   * Reduce image cache
   */
  reduceImageCache() {
    // Remove off-screen images from DOM
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const img = entry.target;
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
        img.dataset.originalSrc = img.src;
        observer.unobserve(img);
        img.dataset.removed = 'true';
        this.removedImages.add(img);
      }
      });
    });

    document.querySelectorAll('img').forEach(img => {
      observer.observe(img);
    });
  }

  /**
   * Limit JavaScript heap
   */
  limitJavaScriptHeap() {
    // Clear intervals and timeouts when not needed
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function(callback, delay) {
      if (delay < 100) {
        console.warn('Short interval detected, consider using requestAnimationFrame');
      }
      return originalSetInterval.call(this, callback, delay);
    };

    window.setTimeout = function(callback, delay) {
      if (delay < 16) {
        console.warn('Short timeout detected, consider using requestAnimationFrame');
      }
      return originalSetTimeout.call(this, callback, delay);
    };
  }

  /**
   * Optimize DOM operations
   */
  optimizeDOMOperations() {
    // Use DocumentFragment for batch operations
    const originalAppendChild = Element.prototype.appendChild;
    const originalRemoveChild = Element.prototype.removeChild;

    Element.prototype.appendChild = function(child) {
      if (child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        return originalAppendChild.call(this, child);
      }
      return originalAppendChild.call(this, child);
    };
  }

  /**
   * Setup garbage collection hints
   */
  setupGarbageCollectionHints() {
    // Periodically suggest garbage collection
    setInterval(() => {
      if (window.gc) {
        window.gc();
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Setup viewport optimizations
   */
  setupViewportOptimizations() {
    // Optimize for mobile viewport
    this.optimizeMobileViewport();

    // Handle orientation changes
    this.handleOrientationChanges();

    // Optimize for different screen sizes
    this.optimizeForScreenSizes();
  }

  /**
   * Optimize mobile viewport
   */
  optimizeMobileViewport() {
    if (this.deviceInfo.isMobile) {
      // Set proper viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
      }

      // Handle iOS viewport height issue
      if (this.deviceInfo.isIOS) {
        this.fixIOSViewportHeight();
      }
    }
  }

  /**
   * Fix iOS viewport height issue
   */
  fixIOSViewportHeight() {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }

  /**
   * Handle orientation changes
   */
  handleOrientationChanges() {
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustLayoutForOrientation();
      }, 100);
    });
  }

  /**
   * Adjust layout for orientation
   */
  adjustLayoutForOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;

    document.body.classList.toggle('landscape', isLandscape);
    document.body.classList.toggle('portrait', !isLandscape);

    // Adjust grid layouts
    this.adjustGridLayout();
  }

  /**
   * Adjust grid layout for orientation
   */
  adjustGridLayout() {
    const grids = document.querySelectorAll('.cultural-spotlight__grid');

    grids.forEach(grid => {
      const containerWidth = grid.offsetWidth;
      let columns = 1;

      if (containerWidth >= 1200) columns = 4;
      else if (containerWidth >= 768) columns = 3;
      else if (containerWidth >= 480) columns = 2;

      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    });
  }

  /**
   * Optimize for different screen sizes
   */
  optimizeForScreenSizes() {
    // Setup responsive images
    this.setupResponsiveImages();

    // Optimize touch targets for screen size
    this.optimizeTouchTargetsForScreen();
  }

  /**
   * Setup responsive images
   */
  setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-responsive]');

    images.forEach(img => {
      const screenWidth = window.innerWidth;
      const imageWidth = this.getOptimalImageWidth(screenWidth);

      if (img.dataset.srcset) {
        // Use appropriate source from srcset
        this.selectOptimalImageSource(img, imageWidth);
      }
    });
  }

  /**
   * Get optimal image width
   */
  getOptimalImageWidth(screenWidth) {
    if (screenWidth < 480) return 400;
    if (screenWidth < 768) return 600;
    if (screenWidth < 1024) return 800;
    return 1000;
  }

  /**
   * Select optimal image source
   */
  selectOptimalImageSource(img, targetWidth) {
    const srcset = img.dataset.srcset;
    if (!srcset) return;

    const sources = srcset.split(',').map(source => {
      const [url, width] = source.trim().split(' ');
      return { url, width: parseInt(width) };
    });

    const optimalSource = sources.reduce((best, current) => {
      const bestDiff = Math.abs(best.width - targetWidth);
      const currentDiff = Math.abs(current.width - targetWidth);
      return currentDiff < bestDiff ? current : best;
    });

    img.src = optimalSource.url;
  }

  /**
   * Optimize touch targets for screen size
   */
  optimizeTouchTargetsForScreen() {
    const touchTargets = document.querySelectorAll('.touch-target');
    const screenWidth = window.innerWidth;

    touchTargets.forEach(target => {
      if (screenWidth < 375) {
        target.style.minHeight = '44px';
        target.style.minWidth = '44px';
      } else if (screenWidth < 768) {
        target.style.minHeight = '48px';
        target.style.minWidth = '48px';
      } else {
        target.style.minHeight = '56px';
        target.style.minWidth = '56px';
      }
    });
  }

  /**
   * Setup battery optimizations
   */
  setupBatteryOptimizations() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.batteryInfo = battery;
        this.setupBatteryMonitoring(battery);
        this.optimizeForBatteryLevel(battery);
      });
    }
  }

  /**
   * Setup battery monitoring
   */
  setupBatteryMonitoring(battery) {
    battery.addEventListener('levelchange', () => {
      this.optimizeForBatteryLevel(battery);
    });

    battery.addEventListener('chargingchange', () => {
      this.optimizeForChargingState(battery);
    });
  }

  /**
   * Optimize for battery level
   */
  optimizeForBatteryLevel(battery) {
    if (battery.level < 0.2 && !battery.charging) {
      // Low battery mode
      this.enableLowBatteryMode();
    } else {
      this.disableLowBatteryMode();
    }
  }

  /**
   * Optimize for charging state
   */
  optimizeForChargingState(battery) {
    if (battery.charging) {
      // More aggressive when charging
      this.enableChargingMode();
    } else {
      this.disableChargingMode();
    }
  }

  /**
   * Enable low battery mode
   */
  enableLowBatteryMode() {
    document.body.classList.add('low-battery-mode');

    // Reduce animations
    this.reduceAnimations();

    // Lower image quality
    this.reduceImageQuality();

    // Disable background tasks
    this.disableBackgroundTasks();
  }

  /**
   * Disable low battery mode
   */
  disableLowBatteryMode() {
    document.body.classList.remove('low-battery-mode');
  }

  /**
   * Enable charging mode
   */
  enableChargingMode() {
    document.body.classList.add('charging-mode');
    // Enable more features when charging
  }

  /**
   * Disable charging mode
   */
  disableChargingMode() {
    document.body.classList.remove('charging-mode');
  }

  /**
   * Reduce animations
   */
  reduceAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .low-battery-mode * {
        animation-duration: 0ms !important;
        transition-duration: 0ms !important;
      }

      .low-battery-mode .animate-on-scroll {
        opacity: 1 !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Disable background tasks
   */
  disableBackgroundTasks() {
    // Clear intervals and timeouts
    const intervals = window.setInterval;
    const timeouts = window.setTimeout;

    // Override to prevent background tasks
    window.setInterval = function(callback, delay) {
      if (delay < 5000) {
        console.warn('Interval blocked in low battery mode');
        return null;
      }
      return intervals.call(this, callback, delay);
    };
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor device performance
    this.monitorDevicePerformance();

    // Track mobile-specific metrics
    this.trackMobileMetrics();

    // Monitor memory usage
    this.monitorMemoryUsage();
  }

  /**
   * Monitor device performance
   */
  monitorDevicePerformance() {
    // Monitor frame rate
    this.monitorFrameRate();

    // Monitor input latency
    this.monitorInputLatency();

    // Monitor page load time
    this.monitorPageLoadTime();
  }

  /**
   * Monitor frame rate
   */
  monitorFrameRate() {
    let lastTime = performance.now();
    let frameCount = 0;

    const checkFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / deltaTime);
        this.logPerformanceMetric('fps', fps);

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkFrameRate);
    };

    requestAnimationFrame(checkFrameRate);
  }

  /**
   * Monitor input latency
   */
  monitorInputLatency() {
    let touchStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      const latency = performance.now() - touchStartTime;
      this.logPerformanceMetric('touch_latency', latency);
    }, { passive: true });
  }

  /**
   * Monitor page load time
   */
  monitorPageLoadTime() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.logPerformanceMetric('page_load_time', loadTime);
    });
  }

  /**
   * Track mobile-specific metrics
   */
  trackMobileMetrics() {
    // Track screen resolution
    this.logPerformanceMetric('screen_width', window.screen.width);
    this.logPerformanceMetric('screen_height', window.screen.height);

    // Track device memory
    if (navigator.deviceMemory) {
      this.logPerformanceMetric('device_memory', navigator.deviceMemory);
    }

    // Track network information
    this.logPerformanceMetric('network_type', this.networkInfo.effectiveType);
    this.logPerformanceMetric('network_downlink', this.networkInfo.downlink);
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      setInterval(() => {
        this.logPerformanceMetric('memory_used', memory.usedJSHeapSize);
        this.logPerformanceMetric('memory_total', memory.totalJSHeapSize);
        this.logPerformanceMetric('memory_limit', memory.jsHeapSizeLimit);
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Log performance metric
   */
  logPerformanceMetric(name, value) {
    // Store in localStorage for later analysis
    try {
      const metrics = JSON.parse(localStorage.getItem('mobile_performance_metrics') || '{}');
      metrics[name] = value;
      localStorage.setItem('mobile_performance_metrics', JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to log performance metric:', error);
    }
  }

  /**
   * Adjust optimizations based on current conditions
   */
  adjustOptimizations() {
    // Update optimization level
    document.documentElement.className = document.documentElement.className.replace(/optimization-\w+/, `optimization-${this.optimizationLevel}`);

    // Re-apply device-specific optimizations
    this.applyDeviceClasses();

    // Adjust resource loading
    this.adjustResourceLoading();
  }

  /**
   * Navigate next (for swipe gestures)
   */
  navigateNext() {
    // Implementation depends on your navigation structure
    const nextLink = document.querySelector('a[rel="next"]');
    if (nextLink) {
      nextLink.click();
    }
  }

  /**
   * Navigate previous (for swipe gestures)
   */
  navigatePrevious() {
    // Implementation depends on your navigation structure
    const prevLink = document.querySelector('a[rel="prev"]');
    if (prevLink) {
      prevLink.click();
    }
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
   * Get optimization level
   */
  getOptimizationLevel() {
    return this.optimizationLevel;
  }

  /**
   * Get device info
   */
  getDeviceInfo() {
    return this.deviceInfo;
  }

  /**
   * Get network info
   */
  getNetworkInfo() {
    return this.networkInfo;
  }

  /**
   * Check if online
   */
  isOnline() {
    return navigator.onLine;
  }

  /**
   * Cleanup
   */
  destroy() {
    // Remove event listeners
    // Clear timeouts and intervals
    // Clean up DOM modifications
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizationManager = new MobileOptimizationManager();
  });
} else {
  window.mobileOptimizationManager = new MobileOptimizationManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileOptimizationManager;
}