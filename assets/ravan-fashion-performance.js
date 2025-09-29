/* Ravan Fashion - Performance Optimizations */
/* Lazy Loading and Performance Enhancements */

class RavanFashionPerformance {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeFonts();
    this.preloadCriticalAssets();
    this.setupIntersectionObserver();
    this.optimizeCountdownTimers();
  }

  // Lazy Load Images
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Optimize Font Loading
  optimizeFonts() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&family=Noto+Serif+Tamil:wght@400;500&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(fontLink);

    // Apply font-display: swap for better loading
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Noto Sans Tamil';
        font-display: swap;
      }
      @font-face {
        font-family: 'Noto Serif Tamil';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  // Preload Critical Assets
  preloadCriticalAssets() {
    // Preload critical CSS
    const criticalCss = document.createElement('link');
    criticalCss.rel = 'preload';
    criticalCss.href = '{{ "ravan-fashion-optimized.css" | asset_url }}';
    criticalCss.as = 'style';
    criticalCss.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(criticalCss);

    // Preload main CSS asynchronously
    const mainCss = document.createElement('link');
    mainCss.rel = 'stylesheet';
    mainCss.href = '{{ "ravan-fashion.css" | asset_url }}';
    mainCss.media = 'print';
    mainCss.onload = function() { this.media = 'all'; };
    document.head.appendChild(mainCss);
  }

  // Setup Intersection Observer for animations
  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.cultural-item, .journey-step, .countdown-item');

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // Optimize Countdown Timers
  optimizeCountdownTimers() {
    const countdownElements = document.querySelectorAll('[id^="countdown-timer-"]');

    countdownElements.forEach(countdown => {
      const targetDate = countdown.getAttribute('data-target-date');
      if (!targetDate) return;

      let animationFrameId;
      let lastUpdateTime = 0;
      const updateInterval = 1000; // Update every second

      function updateCountdown(timestamp) {
        if (!lastUpdateTime || timestamp - lastUpdateTime >= updateInterval) {
          const now = new Date().getTime();
          const target = new Date(targetDate).getTime();
          const difference = target - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const sectionId = countdown.id.replace('countdown-timer-', '');
            const daysElement = document.getElementById(`days-${sectionId}`);
            const hoursElement = document.getElementById(`hours-${sectionId}`);
            const minutesElement = document.getElementById(`minutes-${sectionId}`);
            const secondsElement = document.getElementById(`seconds-${sectionId}`);

            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
          }

          lastUpdateTime = timestamp;
        }

        if (difference > 0) {
          animationFrameId = requestAnimationFrame(updateCountdown);
        }
      }

      // Start the countdown
      animationFrameId = requestAnimationFrame(updateCountdown);

      // Cleanup on page unload
      window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      });
    });
  }

  // Debounce function for performance
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

  // Optimize scroll events
  optimizeScrollEvents() {
    const scrollHandler = this.debounce(() => {
      // Handle scroll events efficiently
      document.body.classList.toggle('scrolled', window.scrollY > 100);
    }, 10);

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // Optimize resize events
  optimizeResizeEvents() {
    const resizeHandler = this.debounce(() => {
      // Handle resize events efficiently
      this.updateLayoutForScreenSize();
    }, 100);

    window.addEventListener('resize', resizeHandler, { passive: true });
  }

  // Update layout based on screen size
  updateLayoutForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile-device', isMobile);

    // Adjust grid layouts for mobile
    const culturalGrids = document.querySelectorAll('.cultural-grid');
    culturalGrids.forEach(grid => {
      if (isMobile) {
        grid.style.gridTemplateColumns = '1fr';
      } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
      }
    });
  }

  // Cache DOM elements for better performance
  cacheElements() {
    this.elements = {
      culturalSpotlight: document.querySelector('.cultural-spotlight'),
      designStory: document.querySelector('.design-story'),
      dropCountdown: document.querySelector('.drop-countdown'),
      countdownTimers: document.querySelectorAll('[id^="countdown-timer-"]')
    };
  }

  // Initialize performance monitoring
  initPerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const pageLoad = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

        console.log(`Page Load Time: ${pageLoad}ms`);
        console.log(`DOM Ready Time: ${domReady}ms`);

        // Send analytics if available
        if (typeof gtag === 'function') {
          gtag('event', 'page_load_time', {
            event_category: 'performance',
            event_label: 'ravan_fashion_theme',
            value: pageLoad
          });
        }
      });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RavanFashionPerformance();
  });
} else {
  new RavanFashionPerformance();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RavanFashionPerformance;
}