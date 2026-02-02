/**
 * IT's IT LLC - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    loadSVGSprite();
    initMobileMenu();
    initMobileDropdowns();
    initStickyHeader();
    initSmoothScroll();
    initContactForm();
    initScrollProgress();
    initBackToTop();
    initFadeInAnimations();
});

/**
 * Page Loader Animation
 * Shows a brief loading animation and then reveals the page content
 */
function initPageLoader() {
    // Add page-loading class initially
    document.body.classList.add('page-loading');

    // Create loader overlay if it doesn't exist
    if (!document.querySelector('.page-loader')) {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">
                    <img src="assets/logos/ItsITLogo9_11_19.png" alt="Loading...">
                </div>
                <div class="loader-spinner"></div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    // Remove loader after a brief delay
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                loader.classList.add('loaded');
                setTimeout(function() {
                    loader.remove();
                    document.body.classList.remove('page-loading');
                    document.body.classList.add('page-loaded');
                }, 500);
            }
        }, 300);
    });
}

/**
 * Load SVG Sprite
 * Injects the SVG sprite into the page to enable icons with file:// protocol
 */
function loadSVGSprite() {
    // Check if sprite is already loaded
    if (document.getElementById('svg-sprite-container')) return;

    const spritePath = 'assets/icons/icons.svg';

    // Try to determine the correct path based on current location
    const pathPrefix = getPathPrefix();
    const fullPath = pathPrefix + spritePath;

    fetch(fullPath)
        .then(response => {
            if (!response.ok) throw new Error('SVG sprite not found');
            return response.text();
        })
        .then(svgContent => {
            const container = document.createElement('div');
            container.id = 'svg-sprite-container';
            container.style.display = 'none';
            container.innerHTML = svgContent;
            document.body.insertBefore(container, document.body.firstChild);

            // Update all SVG use elements to reference local IDs
            updateSVGReferences();
        })
        .catch(err => {
            console.warn('Could not load SVG sprite:', err.message);
            // Fallback: try to load from different paths
            tryFallbackPaths();
        });
}

/**
 * Determine path prefix based on current page location
 */
function getPathPrefix() {
    const path = window.location.pathname;
    // If in a subdirectory, adjust the path
    if (path.includes('/pages/') || path.includes('/subdir/')) {
        return '../';
    }
    return '';
}

/**
 * Update SVG use elements to reference inline sprite
 */
function updateSVGReferences() {
    const useElements = document.querySelectorAll('svg use');
    useElements.forEach(use => {
        const href = use.getAttribute('href') || use.getAttribute('xlink:href');
        if (href && href.includes('#icon-')) {
            // Extract just the icon ID (e.g., #icon-shield)
            const iconId = href.substring(href.indexOf('#'));
            use.setAttribute('href', iconId);
        }
    });
}

/**
 * Try fallback paths for SVG sprite
 */
function tryFallbackPaths() {
    const fallbackPaths = [
        './assets/icons/icons.svg',
        '../assets/icons/icons.svg',
        '/assets/icons/icons.svg'
    ];

    let pathIndex = 0;

    function tryNextPath() {
        if (pathIndex >= fallbackPaths.length) {
            console.error('Could not load SVG sprite from any path');
            return;
        }

        fetch(fallbackPaths[pathIndex])
            .then(response => {
                if (!response.ok) throw new Error('Not found');
                return response.text();
            })
            .then(svgContent => {
                const container = document.createElement('div');
                container.id = 'svg-sprite-container';
                container.style.display = 'none';
                container.innerHTML = svgContent;
                document.body.insertBefore(container, document.body.firstChild);
                updateSVGReferences();
            })
            .catch(() => {
                pathIndex++;
                tryNextPath();
            });
    }

    tryNextPath();
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Mobile Dropdown Toggles
 */
function initMobileDropdowns() {
    const navItems = document.querySelectorAll('.nav-links > li');

    navItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.mega-menu, .dropdown-menu');

        if (dropdown && link) {
            link.addEventListener('click', function(e) {
                // Only handle click on mobile
                if (window.innerWidth <= 768) {
                    // If there's a dropdown, toggle it
                    if (dropdown) {
                        e.preventDefault();

                        // Close other dropdowns
                        navItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });

                        // Toggle this dropdown
                        item.classList.toggle('active');
                    }
                }
            });
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navItems.forEach(item => item.classList.remove('active'));
            document.getElementById('navLinks')?.classList.remove('active');
            document.getElementById('mobileMenuBtn')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Sticky Header on Scroll
 */
function initStickyHeader() {
    const header = document.getElementById('header');

    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add scrolled class when scrolling down
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    document.getElementById('navLinks')?.classList.remove('active');
                    document.getElementById('mobileMenuBtn')?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Here you would normally send the data to a server
            // For now, we'll just show a success message
            console.log('Form submitted:', data);
            showNotification('Thank you for your message! We\'ll be in touch soon.', 'success');
            form.reset();
        });
    }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#006341' : type === 'error' ? '#dc2626' : '#003865'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Intersection Observer for Animations (optional enhancement)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    document.querySelectorAll('.service-card, .process-card, .industry-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    // Create button element
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Fade-in Animations on Scroll
 */
function initFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.service-card, .industry-card, .process-card, .testimonial-card, .section-header, .service-step');

    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add staggered delay for grid items
        if (el.classList.contains('service-card') || el.classList.contains('industry-card')) {
            const delay = (index % 6) + 1;
            el.classList.add(`fade-in-delay-${Math.min(delay, 4)}`);
        }
        observer.observe(el);
    });
}

/**
 * Parallax Effect for Hero Section
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * parallaxSpeed + 'px';
        }
    });
}

/**
 * Typing Effect for Hero Text (optional)
 */
function initTypingEffect(element, text, speed = 50) {
    if (!element) return;

    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Counter Animation for Stats
 */
function animateCounter(element, target, duration = 2000) {
    if (!element) return;

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Initialize Counter Animations on Scroll
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}
