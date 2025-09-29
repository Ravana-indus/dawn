/**
 * RAVAN FASHION - DROP COUNTDOWN SECTION JAVASCRIPT
 * Real-time Countdown Timer with Email Capture
 * Cultural Animations and Mobile-First Design
 */

class DropCountdownManager {
  constructor() {
    this.countdownTimers = [];
    this.emailForms = [];
    this.init();
  }

  init() {
    this.setupCountdownTimers();
    this.setupEmailCapture();
    this.setupCulturalAnimations();
    this.setupMobileOptimizations();
    this.setupAccessibility();
  }

  setupCountdownTimers() {
    const countdownElements = document.querySelectorAll('.drop-countdown__timer');

    countdownElements.forEach(timer => {
      const dropDate = timer.getAttribute('data-drop-date');
      if (!dropDate) return;

      const targetDate = new Date(dropDate);
      const now = new Date();

      if (targetDate <= now) {
        this.showDropStatus(timer, 'dropped');
        return;
      }

      this.startCountdown(timer, targetDate);
    });
  }

  startCountdown(timerElement, targetDate) {
    const updateCountdown = () => {
      const now = new Date();
      const timeLeft = targetDate - now;

      if (timeLeft <= 0) {
        this.showDropStatus(timerElement, 'dropped');
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      this.updateTimerDisplay(timerElement, { days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const timerId = setInterval(updateCountdown, 1000);
    this.countdownTimers.push(timerId);

    // Store timer ID for cleanup
    timerElement.setAttribute('data-timer-id', timerId);
  }

  updateTimerDisplay(timerElement, timeLeft) {
    const daysElement = timerElement.querySelector('.days');
    const hoursElement = timerElement.querySelector('.hours');
    const minutesElement = timerElement.querySelector('.minutes');
    const secondsElement = timerElement.querySelector('.seconds');

    if (daysElement) {
      daysElement.textContent = this.padZero(timeLeft.days);
      this.animateNumber(daysElement);
    }
    if (hoursElement) {
      hoursElement.textContent = this.padZero(timeLeft.hours);
      this.animateNumber(hoursElement);
    }
    if (minutesElement) {
      minutesElement.textContent = this.padZero(timeLeft.minutes);
      this.animateNumber(minutesElement);
    }
    if (secondsElement) {
      secondsElement.textContent = this.padZero(timeLeft.seconds);
      this.animateNumber(secondsElement);
    }
  }

  animateNumber(element) {
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 100);
  }

  padZero(num) {
    return num.toString().padStart(2, '0');
  }

  showDropStatus(timerElement, status) {
    const statusElement = document.getElementById(timerElement.id.replace('countdown-', 'drop-status-'));
    if (!statusElement) return;

    const statusBadge = statusElement.querySelector('.status-badge');
    if (!statusBadge) return;

    // Clear any running timers
    const timerId = timerElement.getAttribute('data-timer-id');
    if (timerId) {
      clearInterval(parseInt(timerId));
    }

    // Update status based on state
    if (status === 'dropped') {
      statusBadge.textContent = '🎉 டிராப் வெளியிடப்பட்டது!';
      statusBadge.style.background = 'var(--ravan-gold)';
      statusBadge.style.color = 'var(--ravan-maroon)';

      // Hide timer and show celebration
      timerElement.style.display = 'none';
      this.triggerCelebration(statusElement);
    }
  }

  triggerCelebration(element) {
    // Create cultural celebration animation
    const celebration = document.createElement('div');
    celebration.className = 'cultural-celebration';
    celebration.innerHTML = '🎉 ✨ வணக்கம் ✨ 🎉';
    celebration.style.cssText = `
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      animation: celebration-float 3s ease-in-out;
      z-index: 1000;
    `;

    element.appendChild(celebration);

    // Add celebration animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes celebration-float {
        0% { opacity: 0; transform: translateX(-50%) translateY(0); }
        20% { opacity: 1; transform: translateX(-50%) translateY(-20px); }
        80% { opacity: 1; transform: translateX(-50%) translateY(-40px); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-60px); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      celebration.remove();
      style.remove();
    }, 3000);
  }

  setupEmailCapture() {
    const emailForms = document.querySelectorAll('#DropCountdownForm');

    emailForms.forEach(form => {
      this.setupFormValidation(form);
      this.setupFormSubmission(form);
    });
  }

  setupFormValidation(form) {
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput) return;

    emailInput.addEventListener('input', () => {
      this.validateEmail(emailInput);
    });

    emailInput.addEventListener('blur', () => {
      this.validateEmail(emailInput);
    });
  }

  validateEmail(emailInput) {
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMessage = form.querySelector('.email-form__error');

    if (email && !emailRegex.test(email)) {
      emailInput.style.borderColor = 'var(--ravan-maroon)';
      if (errorMessage) {
        errorMessage.textContent = 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்';
        errorMessage.style.display = 'block';
      }
      return false;
    } else {
      emailInput.style.borderColor = 'var(--ravan-saffron)';
      if (errorMessage) {
        errorMessage.style.display = 'none';
      }
      return true;
    }
  }

  setupFormSubmission(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitButton = form.querySelector('.email-form__submit');
      const successMessage = form.querySelector('.email-form__success');
      const errorMessage = form.querySelector('.email-form__error');

      if (!this.validateEmail(emailInput)) {
        return;
      }

      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'பதிவு செய்கிறது...';

      // Simulate form submission
      setTimeout(() => {
        // Show success message
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.style.color = 'var(--ravan-gold)';
        }

        // Reset form
        emailInput.value = '';
        emailInput.style.borderColor = 'var(--ravan-saffron)';

        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = 'பதிவு செய்யவும்';

        // Hide success message after 5 seconds
        setTimeout(() => {
          if (successMessage) {
            successMessage.style.display = 'none';
          }
        }, 5000);

        // Trigger cultural success animation
        this.triggerFormSuccess(form);
      }, 1500);
    });
  }

  triggerFormSuccess(form) {
    const wrapper = form.closest('.drop-countdown__email');
    if (!wrapper) return;

    // Add success animation
    wrapper.style.animation = 'tamil-pulse 0.6s ease-in-out';
    setTimeout(() => {
      wrapper.style.animation = '';
    }, 600);
  }

  setupCulturalAnimations() {
    const countdownBlocks = document.querySelectorAll('.countdown__block');

    countdownBlocks.forEach((block, index) => {
      // Add entrance animation
      block.style.opacity = '0';
      block.style.transform = 'translateY(20px)';

      setTimeout(() => {
        block.style.transition = 'all 0.6s ease';
        block.style.opacity = '1';
        block.style.transform = 'translateY(0)';
      }, index * 100);

      // Add hover effect
      block.addEventListener('mouseenter', () => {
        block.style.transform = 'translateY(-5px)';
        block.style.boxShadow = '0 10px 30px rgba(255, 153, 51, 0.3)';
      });

      block.addEventListener('mouseleave', () => {
        block.style.transform = 'translateY(0)';
        block.style.boxShadow = 'none';
      });
    });
  }

  setupMobileOptimizations() {
    if (window.innerWidth <= 749) {
      this.setupMobileTimerLayout();
      this.setupTouchInteractions();
    }

    // Handle orientation changes
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 749) {
        this.setupMobileTimerLayout();
      }
    });
  }

  setupMobileTimerLayout() {
    const countdownBlocks = document.querySelectorAll('.countdown__block');

    countdownBlocks.forEach(block => {
      const number = block.querySelector('.countdown__number');
      const label = block.querySelector('.countdown__label');

      if (number && label) {
        // Optimize mobile display
        number.style.fontSize = '1.8rem';
        label.style.fontSize = '0.8rem';

        // Stack vertically on very small screens
        if (window.innerWidth <= 375) {
          block.style.flexDirection = 'column';
          block.style.minWidth = '60px';
        }
      }
    });
  }

  setupTouchInteractions() {
    const countdownElements = document.querySelectorAll('.drop-countdown__timer');

    countdownElements.forEach(timer => {
      let touchStartTime = 0;

      timer.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
      });

      timer.addEventListener('touchend', () => {
        const touchDuration = Date.now() - touchStartTime;

        if (touchDuration < 200) {
          this.handleQuickTap(timer);
        }
      });
    });
  }

  handleQuickTap(element) {
    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }

  setupAccessibility() {
    // Setup keyboard navigation
    const emailInputs = document.querySelectorAll('.email-form__input');
    const submitButtons = document.querySelectorAll('.email-form__submit');

    emailInputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const form = input.closest('form');
          if (form) {
            form.dispatchEvent(new Event('submit'));
          }
        }
      });
    });

    submitButtons.forEach(button => {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });

    // Setup ARIA labels
    this.setupAriaLabels();
  }

  setupAriaLabels() {
    const countdownTimers = document.querySelectorAll('.drop-countdown__timer');

    countdownTimers.forEach(timer => {
      timer.setAttribute('role', 'timer');
      timer.setAttribute('aria-live', 'polite');

      // Update aria-label with current time
      const updateAriaLabel = () => {
        const days = timer.querySelector('.days');
        const hours = timer.querySelector('.hours');
        const minutes = timer.querySelector('.minutes');
        const seconds = timer.querySelector('.seconds');

        if (days && hours && minutes && seconds) {
          const timeString = `${days.textContent} நாட்கள், ${hours.textContent} மணி, ${minutes.textContent} நிமிடங்கள், ${seconds.textContent} விநாடிகள்`;
          timer.setAttribute('aria-label', `டிராப் கவுண்டவுன்: ${timeString}`);
        }
      };

      // Update immediately and then every second
      updateAriaLabel();
      setInterval(updateAriaLabel, 1000);
    });
  }

  // Performance optimization: throttle scroll events
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

  // Cleanup method for proper memory management
  destroy() {
    // Clear all countdown timers
    this.countdownTimers.forEach(timerId => {
      clearInterval(timerId);
    });
    this.countdownTimers = [];

    // Remove event listeners
    document.removeEventListener('resize', this.setupMobileOptimizations);

    // Remove forms
    this.emailForms.forEach(form => {
      form.removeEventListener('submit', this.handleFormSubmission);
    });
    this.emailForms = [];
  }
}

// Enhanced CSS animations for better cultural experience
const addEnhancedAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    .countdown__block {
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .countdown__block:active {
      transform: scale(0.95);
    }

    .email-form__submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }

    .email-form__success {
      animation: slideInUp 0.5s ease;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .cultural-celebration {
      pointer-events: none;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addEnhancedAnimations();
  new DropCountdownManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DropCountdownManager;
}