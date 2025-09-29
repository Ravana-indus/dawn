/**
 * RAVAN FASHION - DESIGN STORY SECTION JAVASCRIPT
 * Cultural Storytelling with Journey Timeline
 * Built for Tamil Diaspora Streetwear Brand
 */

class DesignStoryManager {
  constructor() {
    this.sections = document.querySelectorAll('.design-story');
    this.journeySteps = document.querySelectorAll('.journey-step');
    this.init();
  }

  init() {
    if (this.sections.length === 0) return;

    this.setupIntersectionObserver();
    this.setupJourneyAnimations();
    this.setupCulturalTermAnimations();
    this.setupMobileInteractions();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('design-story--visible');
          this.animateSection(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  animateSection(section) {
    const sectionHeader = section.querySelector('.design-story__section-header');
    const stepIndicator = section.querySelector('.design-story__step-indicator');

    if (sectionHeader) {
      sectionHeader.style.opacity = '0';
      sectionHeader.style.transform = 'translateY(20px)';

      setTimeout(() => {
        sectionHeader.style.transition = 'all 0.6s ease';
        sectionHeader.style.opacity = '1';
        sectionHeader.style.transform = 'translateY(0)';
      }, 100);
    }

    if (stepIndicator) {
      stepIndicator.style.opacity = '0';
      stepIndicator.style.transform = 'scale(0.5)';

      setTimeout(() => {
        stepIndicator.style.transition = 'all 0.4s ease';
        stepIndicator.style.opacity = '1';
        stepIndicator.style.transform = 'scale(1)';
      }, 300);
    }
  }

  setupJourneyAnimations() {
    this.journeySteps.forEach((step, index) => {
      const marker = step.querySelector('.journey-step__marker');
      const content = step.querySelector('.journey-step__content');

      if (marker && content) {
        // Set initial states
        marker.style.opacity = '0';
        marker.style.transform = 'translateX(-20px)';
        content.style.opacity = '0';
        content.style.transform = 'translateX(20px)';

        // Create scroll trigger for each step
        const stepObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.animateJourneyStep(entry.target, index);
              stepObserver.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          threshold: 0.5
        });

        stepObserver.observe(step);
      }
    });
  }

  animateJourneyStep(step, index) {
    const marker = step.querySelector('.journey-step__marker');
    const content = step.querySelector('.journey-step__content');
    const dot = step.querySelector('.journey-step__dot');

    if (marker) {
      setTimeout(() => {
        marker.style.transition = 'all 0.6s ease';
        marker.style.opacity = '1';
        marker.style.transform = 'translateX(0)';
      }, index * 150);
    }

    if (content) {
      setTimeout(() => {
        content.style.transition = 'all 0.6s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateX(0)';
      }, index * 150 + 100);
    }

    if (dot) {
      setTimeout(() => {
        dot.style.animation = 'kolam-glow 2s ease-in-out infinite';
      }, index * 150 + 200);
    }
  }

  setupCulturalTermAnimations() {
    const culturalTerms = document.querySelectorAll('.tamil-term');

    culturalTerms.forEach(term => {
      term.addEventListener('mouseenter', () => {
        term.style.transform = 'scale(1.05)';
        term.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
      });

      term.addEventListener('mouseleave', () => {
        term.style.transform = 'scale(1)';
        term.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
      });
    });
  }

  setupMobileInteractions() {
    if (window.innerWidth <= 749) {
      this.setupSwipeGestures();
      this.setupTouchInteractions();
    }
  }

  setupSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;

    const timeline = document.querySelector('.design-story__journey-timeline');
    if (!timeline) return;

    timeline.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    timeline.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      const timeline = document.querySelector('.design-story__journey-timeline');
      if (!timeline) return;

      if (diff > 0) {
        // Swipe left - next section
        timeline.scrollBy({
          left: 300,
          behavior: 'smooth'
        });
      } else {
        // Swipe right - previous section
        timeline.scrollBy({
          left: -300,
          behavior: 'smooth'
        });
      }
    }
  }

  setupTouchInteractions() {
    const sections = document.querySelectorAll('.design-story__section');

    sections.forEach(section => {
      let touchStartTime = 0;

      section.addEventListener('touchstart', () => {
        touchStartTime = Date.now();
      });

      section.addEventListener('touchend', () => {
        const touchDuration = Date.now() - touchStartTime;

        if (touchDuration < 200) {
          this.handleQuickTap(section);
        }
      });
    });
  }

  handleQuickTap(section) {
    const content = section.querySelector('.design-story__content');
    if (content) {
      content.style.transform = 'scale(0.98)';
      setTimeout(() => {
        content.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // Performance optimization: debounce scroll events
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

  // Enhanced scroll animations for smooth experience
  setupSmoothScrolling() {
    const ctaButtons = document.querySelectorAll('.design-story__cta a');

    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Initialize keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('design-story__section')) {
          this.highlightSection(focusedElement);
        }
      }
    });
  }

  highlightSection(section) {
    section.style.outline = '3px solid var(--ravan-saffron)';
    section.style.outlineOffset = '3px';

    setTimeout(() => {
      section.style.outline = 'none';
    }, 2000);
  }

  // Cleanup method for proper memory management
  destroy() {
    // Remove all event listeners and observers
    if (this.observer) {
      this.observer.disconnect();
    }

    this.sections.forEach(section => {
      section.removeEventListener('touchstart', this.handleTouchStart);
      section.removeEventListener('touchend', this.handleTouchEnd);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DesignStoryManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesignStoryManager;
}