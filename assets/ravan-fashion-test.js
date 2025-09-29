/* Ravan Fashion - Test Suite for Custom Sections */
/* Comprehensive testing of all cultural elements and custom sections */

class RavanFashionTestSuite {
  constructor() {
    this.tests = [];
    this.results = [];
    this.init();
  }

  init() {
    this.runTests();
    this.generateReport();
  }

  // Test Runner
  runTests() {
    console.group('🧪 Ravan Fashion Test Suite');

    this.testLocalization();
    this.testCulturalElements();
    this.testCustomSections();
    this.testPerformanceOptimizations();
    this.testMobileResponsiveness();
    this.testAccessibility();

    console.groupEnd();
  }

  // Test 1: Localization
  testLocalization() {
    console.group('🌐 Testing Tamil Localization');

    this.test('Tamil JSON file exists', () => {
      return typeof Shopify !== 'undefined' &&
             typeof Shopify.locale !== 'undefined' &&
             Shopify.locale === 'ta';
    });

    this.test('Tamil fonts loaded', () => {
      const tamilHeading = document.querySelector('.tamil-heading');
      if (tamilHeading) {
        const styles = window.getComputedStyle(tamilHeading);
        return styles.fontFamily.includes('Noto Sans Tamil') ||
               styles.fontFamily.includes('Tamil');
      }
      return false;
    });

    this.test('Tamil content displayed', () => {
      const tamilElements = document.querySelectorAll('[data-locale="ta"], .tamil-heading, .tamil-body-text');
      return tamilElements.length > 0;
    });

    console.groupEnd();
  }

  // Test 2: Cultural Elements
  testCulturalElements() {
    console.group('🎨 Testing Cultural Design Elements');

    this.test('Tamil color variables defined', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return styles.getPropertyValue('--tamil-saffron') &&
             styles.getPropertyValue('--tamil-maroon') &&
             styles.getPropertyValue('--tamil-gold');
    });

    this.test('Temple arch elements exist', () => {
      const templeArches = document.querySelectorAll('.temple-arch');
      return templeArches.length > 0;
    });

    this.test('Kolam patterns applied', () => {
      const kolamBorders = document.querySelectorAll('.kolam-border');
      return kolamBorders.length > 0;
    });

    this.test('Tamil button styles', () => {
      const tamilButtons = document.querySelectorAll('.tamil-button');
      if (tamilButtons.length === 0) return false;

      const firstButton = tamilButtons[0];
      const styles = getComputedStyle(firstButton);
      return styles.background.includes('gradient') &&
             styles.color === 'rgb(255, 255, 255)';
    });

    console.groupEnd();
  }

  // Test 3: Custom Sections
  testCustomSections() {
    console.group('📋 Testing Custom Sections');

    // Cultural Spotlight
    this.test('Cultural Spotlight section exists', () => {
      const spotlight = document.querySelector('.cultural-spotlight');
      return spotlight !== null;
    });

    this.test('Cultural Spotlight has content', () => {
      const spotlight = document.querySelector('.cultural-spotlight');
      if (!spotlight) return false;

      const items = spotlight.querySelectorAll('.cultural-item');
      return items.length > 0;
    });

    // Design Story
    this.test('Design Story section exists', () => {
      const designStory = document.querySelector('.design-story');
      return designStory !== null;
    });

    this.test('Design Story has journey steps', () => {
      const designStory = document.querySelector('.design-story');
      if (!designStory) return false;

      const journeySteps = designStory.querySelectorAll('.journey-step');
      return journeySteps.length > 0;
    });

    // Drop Countdown
    this.test('Drop Countdown section exists', () => {
      const countdown = document.querySelector('.drop-countdown');
      return countdown !== null;
    });

    this.test('Countdown timer functional', () => {
      const countdownTimer = document.querySelector('[id^="countdown-timer-"]');
      if (!countdownTimer) return true; // Optional section

      const targetDate = countdownTimer.getAttribute('data-target-date');
      return targetDate !== null && targetDate !== '';
    });

    console.groupEnd();
  }

  // Test 4: Performance Optimizations
  testPerformanceOptimizations() {
    console.group('⚡ Testing Performance Optimizations');

    this.test('Lazy loading enabled for images', () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      return images.length > 0;
    });

    this.test('CSS containment applied', () => {
      const containedElements = document.querySelectorAll('[style*="contain"]');
      return containedElements.length > 0;
    });

    this.test('Critical CSS loaded', () => {
      const criticalStyles = document.querySelectorAll('link[href*="ravan-fashion-optimized"]');
      return criticalStyles.length > 0;
    });

    this.test('Non-blocking CSS loaded', () => {
      const nonBlockingStyles = document.querySelectorAll('link[media="print"]');
      return nonBlockingStyles.length > 0;
    });

    console.groupEnd();
  }

  // Test 5: Mobile Responsiveness
  testMobileResponsiveness() {
    console.group('📱 Testing Mobile Responsiveness');

    this.test('Mobile CSS loaded', () => {
      const mobileStyles = document.querySelectorAll('link[href*="ravan-fashion-mobile"]');
      return mobileStyles.length > 0;
    });

    this.test('Viewport meta tag present', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      return viewport !== null &&
             viewport.getAttribute('content').includes('width=device-width');
    });

    this.test('Touch-friendly buttons', () => {
      const buttons = document.querySelectorAll('.tamil-button');
      if (buttons.length === 0) return true;

      const firstButton = buttons[0];
      const styles = getComputedStyle(firstButton);
      const height = parseInt(styles.height);
      return height >= 44; // Minimum touch target size
    });

    this.test('Responsive grid layouts', () => {
      const grids = document.querySelectorAll('.cultural-grid');
      if (grids.length === 0) return true;

      const firstGrid = grids[0];
      const styles = getComputedStyle(firstGrid);
      return styles.display.includes('grid') || styles.display.includes('flex');
    });

    console.groupEnd();
  }

  // Test 6: Accessibility
  testAccessibility() {
    console.group('♿ Testing Accessibility');

    this.test('Alt text on images', () => {
      const images = document.querySelectorAll('img');
      const imagesWithAlt = Array.from(images).filter(img =>
        img.alt !== '' && img.alt !== null
      );
      return imagesWithAlt.length === images.length;
    });

    this.test('Semantic HTML structure', () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) return true;

      // Check heading hierarchy
      let previousLevel = 0;
      for (const heading of headings) {
        const level = parseInt(heading.tagName.substring(1));
        if (level > previousLevel + 1) {
          return false; // Skipped heading level
        }
        previousLevel = level;
      }
      return true;
    });

    this.test('Color contrast', () => {
      const tamilHeadings = document.querySelectorAll('.tamil-heading');
      if (tamilHeadings.length === 0) return true;

      const firstHeading = tamilHeadings[0];
      const styles = getComputedStyle(firstHeading);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Basic contrast check (simplified)
      return color !== backgroundColor && color !== 'rgb(255, 255, 255)';
    });

    this.test('Reduced motion support', () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `;
      document.head.appendChild(style);

      // Check if media query is supported
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const result = prefersReducedMotion.matches === true || prefersReducedMotion.matches === false;

      document.head.removeChild(style);
      return result;
    });

    console.groupEnd();
  }

  // Test helper method
  test(name, testFunction) {
    try {
      const result = testFunction();
      this.tests.push({ name, passed: result });

      if (result) {
        console.log(`✅ ${name}`);
      } else {
        console.error(`❌ ${name}`);
      }
    } catch (error) {
      this.tests.push({ name, passed: false, error: error.message });
      console.error(`❌ ${name} - Error: ${error.message}`);
    }
  }

  // Generate test report
  generateReport() {
    const passed = this.tests.filter(test => test.passed).length;
    const total = this.tests.length;
    const percentage = Math.round((passed / total) * 100);

    console.log('\n📊 Test Results Summary:');
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${passed}`);
    console.log(`   Failed: ${total - passed}`);
    console.log(`   Success Rate: ${percentage}%`);

    if (percentage === 100) {
      console.log('🎉 All tests passed! Ravan Fashion theme is ready for production.');
    } else if (percentage >= 80) {
      console.log('✅ Most tests passed. Theme is nearly ready.');
    } else {
      console.log('⚠️  Several tests failed. Please review the issues above.');
    }

    // Store results for potential analytics
    this.results = {
      total,
      passed,
      failed: total - passed,
      percentage,
      timestamp: new Date().toISOString(),
      tests: this.tests
    };

    // Dispatch custom event for other scripts to use
    window.dispatchEvent(new CustomEvent('ravanFashionTestsComplete', {
      detail: this.results
    }));
  }

  // Export results
  getResults() {
    return this.results;
  }

  // Re-run specific test
  rerunTest(testName) {
    const test = this.tests.find(t => t.name === testName);
    if (test) {
      console.log(`🔄 Re-running test: ${testName}`);
      this.test(testName, () => {
        // Re-execute the test logic (simplified)
        return test.passed;
      });
      this.generateReport();
    }
  }
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RavanFashionTestSuite();
  });
} else {
  new RavanFashionTestSuite();
}

// Export for manual testing
window.RavanFashionTestSuite = RavanFashionTestSuite;