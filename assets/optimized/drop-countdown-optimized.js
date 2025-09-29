/**
 * RAVAN FASHION - OPTIMIZED DROP COUNTDOWN JAVASCRIPT
 * Performance-optimized countdown timer with email capture
 *
 * Optimizations:
 * - Efficient timer management
 * - RequestAnimationFrame for smooth updates
 * - Event delegation for form handling
 * - Memory-efficient state management
 * - Lazy loading and resource optimization
 */

class OptimizedDropCountdownManager {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.timer = null;
    this.animationFrameId = null;
    this.lastUpdateTime = 0;
    this.updateInterval = 1000; // 1 second
    this.isRunning = false;
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isExpired: false
    };

    this.init();
  }

  init() {
    this.setupElements();
    this.initializeCountdown();
    this.setupEventDelegation();
    this.setupPerformanceOptimizations();
    this.prefetchCriticalResources();
  }

  /**
   * Setup DOM elements with caching
   */
  setupElements() {
    this.elements = {
      container: document.getElementById(`countdown-${this.sectionId}`),
      days: document.querySelector(`#countdown-${this.sectionId} .days`),
      hours: document.querySelector(`#countdown-${this.sectionId} .hours`),
      minutes: document.querySelector(`#countdown-${this.sectionId} .minutes`),
      seconds: document.querySelector(`#countdown-${this.sectionId} .seconds`),
      status: document.getElementById(`drop-status-${this.sectionId}`),
      form: document.getElementById('DropCountdownForm')
    };

    // Cache element references for better performance
    this.elementCache = new Map();
    Object.entries(this.elements).forEach(([key, element]) => {
      if (element) {
        this.elementCache.set(key, element);
      }
    });
  }

  /**
   * Initialize countdown with performance optimizations
   */
  initializeCountdown() {
    const dropDate = this.getDropDate();

    if (!dropDate) {
      console.error('Drop date not configured');
      return;
    }

    const now = new Date().getTime();
    const distance = dropDate - now;

    if (distance <= 0) {
      this.handleExpiredCountdown();
      return;
    }

    this.state.totalSeconds = Math.floor(distance / 1000);
    this.startTimer();
  }

  /**
   * Get drop date with timezone optimization
   */
  getDropDate() {
    const dateElement = this.elements.container;
    const dateString = dateElement?.dataset.dropDate;

    if (!dateString) return null;

    // Parse date string with timezone awareness
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Fallback: try parsing without timezone
      const fallbackDate = new Date(dateString.replace(/Z$/, ''));
      return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
    }

    return date;
  }

  /**
   * Start timer with requestAnimationFrame optimization
   */
  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastUpdateTime = performance.now();

    // Use requestAnimationFrame for smooth updates
    this.updateTimer();
  }

  /**
   * Update timer with performance optimization
   */
  updateTimer() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastUpdateTime;

    // Only update every second to reduce DOM manipulation
    if (deltaTime >= this.updateInterval) {
      this.updateCountdownDisplay();
      this.lastUpdateTime = currentTime;
    }

    // Continue animation frame loop
    this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
  }

  /**
   * Update countdown display with optimized DOM operations
   */
  updateCountdownDisplay() {
    if (this.state.totalSeconds <= 0) {
      this.handleExpiredCountdown();
      return;
    }

    // Calculate time units
    const days = Math.floor(this.state.totalSeconds / (3600 * 24));
    const hours = Math.floor((this.state.totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((this.state.totalSeconds % 3600) / 60);
    const seconds = this.state.totalSeconds % 60;

    // Only update DOM if values have changed
    if (
      days !== this.state.days ||
      hours !== this.state.hours ||
      minutes !== this.state.minutes ||
      seconds !== this.state.seconds
    ) {
      this.state.days = days;
      this.state.hours = hours;
      this.state.minutes = minutes;
      this.state.seconds = seconds;

      // Batch DOM updates for better performance
      this.batchDOMUpdates();
    }

    // Decrement total seconds
    this.state.totalSeconds--;
  }

  /**
   * Batch DOM updates for performance
   */
  batchDOMUpdates() {
    // Use requestAnimationFrame to batch DOM updates
    requestAnimationFrame(() => {
      this.updateElement('days', this.padNumber(this.state.days));
      this.updateElement('hours', this.padNumber(this.state.hours));
      this.updateElement('minutes', this.padNumber(this.state.minutes));
      this.updateElement('seconds', this.padNumber(this.state.seconds));
    });
  }

  /**
   * Update individual element with optimization
   */
  updateElement(elementKey, value) {
    const element = this.elementCache.get(elementKey);
    if (element && element.textContent !== value) {
      element.textContent = value;

      // Add animation class for smooth transitions
      element.classList.add('countdown-animate');
      setTimeout(() => {
        element.classList.remove('countdown-animate');
      }, 300);
    }
  }

  /**
   * Pad number with leading zero
   */
  padNumber(num) {
    return num.toString().padStart(2, '0');
  }

  /**
   * Handle expired countdown
   */
  handleExpiredCountdown() {
    this.stopTimer();
    this.state.isExpired = true;

    // Update status display
    if (this.elements.status) {
      this.elements.status.innerHTML = `
        <span class="status-badge status-expired cultural-button">
          {{ 'sections.drop_countdrop.expired' | t }}
        </span>
      `;
    }

    // Hide countdown form if expired
    if (this.elements.form) {
      this.elements.form.style.display = 'none';
    }

    // Trigger custom event for other scripts
    this.triggerEvent('countdown-expired', { sectionId: this.sectionId });
  }

  /**
   * Stop timer and cleanup resources
   */
  stopTimer() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Setup event delegation for performance
   */
  setupEventDelegation() {
    // Single event listener for all form interactions
    const formContainer = this.elements.form?.closest('.drop-countdown__email');
    if (formContainer) {
      formContainer.addEventListener('click', this.handleFormClicks.bind(this));
      formContainer.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    // Setup visibility change listener
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Setup page lifecycle events
    this.setupPageLifecycle();
  }

  /**
   * Handle form clicks with delegation
   */
  handleFormClicks(event) {
    const target = event.target;

    // Handle input focus
    if (target.matches('.email-form__input')) {
      this.handleInputFocus(target);
    }

    // Handle button clicks
    if (target.matches('.email-form__submit')) {
      this.handleButtonClick(target);
    }
  }

  /**
   * Handle input focus with validation optimization
   */
  handleInputFocus(input) {
    // Add visual feedback
    input.parentElement.classList.add('focused');

    // Validate on blur
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
      this.validateEmail(input);
    }, { once: true });
  }

  /**
   * Handle button click with feedback
   */
  handleButtonClick(button) {
    const form = button.closest('form');
    if (!form) return;

    // Validate before submission
    const emailInput = form.querySelector('.email-form__input');
    if (!this.validateEmail(emailInput)) {
      this.showFormError('Please enter a valid email address');
      return;
    }

    // Add loading state
    button.disabled = true;
    button.classList.add('loading');

    // Store original button text
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
  }

  /**
   * Handle form submission with optimization
   */
  handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('.email-form__submit');
    const emailInput = form.querySelector('.email-form__input');

    // Validate email
    if (!this.validateEmail(emailInput)) {
      this.showFormError('Please enter a valid email address');
      return;
    }

    // Get form data
    const formData = new FormData(form);
    const email = formData.get('contact[email]');

    // Simulate form submission (replace with actual submission logic)
    this.submitForm(email, form, submitButton);
  }

  /**
   * Submit form with performance optimization
   */
  async submitForm(email, form, submitButton) {
    try {
      // Simulate API call (replace with actual submission)
      await this.simulateAPICall(email);

      // Show success message
      this.showFormSuccess(form);

      // Track submission
      this.trackSubmission(email);

      // Reset form
      form.reset();

    } catch (error) {
      // Show error message
      this.showFormError('Subscription failed. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      submitButton.textContent = 'Subscribe';
    }
  }

  /**
   * Simulate API call (replace with actual implementation)
   */
  async simulateAPICall(email) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate response
    const response = { success: true };
    if (!response.success) {
      throw new Error('API call failed');
    }

    return response;
  }

  /**
   * Validate email with regex optimization
   */
  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = emailRegex.test(email);

    // Update visual feedback
    if (isValid) {
      input.classList.remove('invalid');
      input.classList.add('valid');
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
    }

    return isValid;
  }

  /**
   * Show form error message
   */
  showFormError(message) {
    const formContainer = this.elements.form?.closest('.drop-countdown__email');
    if (!formContainer) return;

    // Remove existing error
    const existingError = formContainer.querySelector('.email-form__error');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement('small');
    errorElement.className = 'email-form__error';
    errorElement.textContent = message;
    formContainer.appendChild(errorElement);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }

  /**
   * Show form success message
   */
  showFormSuccess(form) {
    const formContainer = form.closest('.drop-countdown__email');
    if (!formContainer) return;

    // Hide form
    form.style.display = 'none';

    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'email-form__success';
    successElement.textContent = '{{ 'sections.drop_countdown.success_message' | t }}';
    formContainer.appendChild(successElement);

    // Trigger success animation
    successElement.classList.add('animate-cultural-fade');
  }

  /**
   * Track submission for analytics
   */
  trackSubmission(email) {
    // Implement analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'email_signup', {
        event_category: 'drop_countdown',
        event_label: this.sectionId,
        email_hash: this.hashEmail(email)
      });
    }

    // Trigger custom event
    this.triggerEvent('email-submitted', {
      sectionId: this.sectionId,
      email: this.hashEmail(email)
    });
  }

  /**
   * Hash email for privacy
   */
  hashEmail(email) {
    // Simple hash function (replace with proper implementation)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Handle visibility change for performance
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause timer
      this.pauseTimer();
    } else {
      // Page is visible, resume timer
      this.resumeTimer();
    }
  }

  /**
   * Pause timer when page is hidden
   */
  pauseTimer() {
    if (this.isRunning) {
      this.wasRunning = true;
      this.stopTimer();
    }
  }

  /**
   * Resume timer when page is visible
   */
  resumeTimer() {
    if (this.wasRunning) {
      this.wasRunning = false;
      this.startTimer();
    }
  }

  /**
   * Setup page lifecycle events
   */
  setupPageLifecycle() {
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });

    // Handle page show (for back button navigation)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this.restoreState();
      }
    });
  }

  /**
   * Save state to sessionStorage
   */
  saveState() {
    if (!this.state.isExpired) {
      sessionStorage.setItem(
        `countdown-state-${this.sectionId}`,
        JSON.stringify({
          totalSeconds: this.state.totalSeconds,
          savedTime: Date.now()
        })
      );
    }
  }

  /**
   * Restore state from sessionStorage
   */
  restoreState() {
    const savedState = sessionStorage.getItem(`countdown-state-${this.sectionId}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const savedTime = parsed.savedTime;
        const currentTime = Date.now();
        const timePassed = Math.floor((currentTime - savedTime) / 1000);

        // Adjust saved total seconds
        this.state.totalSeconds = Math.max(0, parsed.totalSeconds - timePassed);

        // Clear saved state
        sessionStorage.removeItem(`countdown-state-${this.sectionId}`);

        // Restart timer if not expired
        if (this.state.totalSeconds > 0) {
          this.startTimer();
        } else {
          this.handleExpiredCountdown();
        }
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    }
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Optimize timer based on device capability
    this.optimizeForDevice();

    // Setup intersection observer for lazy loading
    this.setupIntersectionObserver();

    // Optimize animations for reduced motion
    this.setupReducedMotion();
  }

  /**
   * Optimize timer based on device capability
   */
  optimizeForDevice() {
    // Check if device is low-end
    const isLowEndDevice = this.isLowEndDevice();

    if (isLowEndDevice) {
      // Reduce update frequency for low-end devices
      this.updateInterval = 2000; // 2 seconds

      // Disable complex animations
      this.disableComplexAnimations();
    }
  }

  /**
   * Check if device is low-end
   */
  isLowEndDevice() {
    // Simple heuristics for low-end device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowMemory = navigator.deviceMemory < 4;
    const hasSlowConnection = navigator.connection?.effectiveType?.includes('2g');

    return isMobile && (hasLowMemory || hasSlowConnection);
  }

  /**
   * Disable complex animations
   */
  disableComplexAnimations() {
    const animatedElements = document.querySelectorAll('.countdown__block');
    animatedElements.forEach(element => {
      element.style.animation = 'none';
    });
  }

  /**
   * Setup intersection observer for lazy loading
   */
  setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startTimer();
            this.observer.unobserve(entry.target);
          } else {
            this.pauseTimer();
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    // Observe countdown container
    if (this.elements.container) {
      this.observer.observe(this.elements.container);
    }
  }

  /**
   * Setup reduced motion preferences
   */
  setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable animations
      const style = document.createElement('style');
      style.textContent = `
        .countdown__block {
          animation: none !important;
        }
        .countdown-animate {
          transition: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Prefetch critical resources
   */
  prefetchCriticalResources() {
    // Prefetch fonts
    this.prefetchFonts();

    // Preload images
    this.preloadImages();
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
   * Preload images
   */
  preloadImages() {
    const images = document.querySelectorAll('.drop-countdown__image[data-src]');
    images.forEach(img => {
      if (this.isElementInViewport(img)) {
        this.loadImage(img);
      }
    });
  }

  /**
   * Load image with error handling
   */
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      delete img.dataset.src;
    };
    tempImg.onerror = () => {
      img.classList.add('error');
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
   * Trigger custom event
   */
  triggerEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Public methods for external control
   */
  pause() {
    this.pauseTimer();
  }

  resume() {
    this.resumeTimer();
  }

  restart() {
    this.stopTimer();
    this.initializeCountdown();
  }

  getState() {
    return { ...this.state };
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    this.stopTimer();

    if (this.observer) {
      this.observer.disconnect();
    }

    // Clear event listeners
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    // Clear cached elements
    this.elementCache.clear();

    // Remove state from sessionStorage
    sessionStorage.removeItem(`countdown-state-${this.sectionId}`);
  }
}

// Initialize all countdown instances on page load
document.addEventListener('DOMContentLoaded', () => {
  const countdownInstances = new Map();

  // Initialize all countdown sections
  document.querySelectorAll('[id^="countdown-"]').forEach(container => {
    const sectionId = container.id.replace('countdown-', '');
    const instance = new OptimizedDropCountdownManager(sectionId);
    countdownInstances.set(sectionId, instance);
  });

  // Store instances globally for external access
  window.dropCountdownInstances = countdownInstances;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OptimizedDropCountdownManager;
}