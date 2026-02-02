// =============================================
// GLOBAL VARIABLES
// =============================================

let carouselIntervals = new Map();

// =============================================
// HEADER SCROLL EFFECT
// =============================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =============================================
// MOBILE MENU TOGGLE
// =============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// =============================================
// CAROUSEL FUNCTIONALITY
// =============================================

function initCarousels() {
    const carousels = document.querySelectorAll('.product-carousel');
    
    carousels.forEach(carousel => {
        const carouselId = carousel.getAttribute('data-carousel');
        const images = carousel.querySelectorAll('.product-image');
        const indicators = document.querySelector(`[data-carousel="${carouselId}"].carousel-indicators`);
        
        if (images.length <= 1) return; // Skip if only one image
        
        let currentIndex = 0;
        
        // Function to show specific slide
        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.remove('active');
                if (i === index) {
                    img.classList.add('active');
                }
            });
            
            if (indicators) {
                const indicatorDots = indicators.querySelectorAll('.indicator');
                indicatorDots.forEach((dot, i) => {
                    dot.classList.remove('active');
                    if (i === index) {
                        dot.classList.add('active');
                    }
                });
            }
        }
        
        // Auto-advance carousel
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showSlide(currentIndex);
        }, 3500);
        
        carouselIntervals.set(carouselId, interval);
        
        // Manual controls
        const prevBtn = document.querySelector(`.carousel-btn.prev[data-carousel-target="${carouselId}"]`);
        const nextBtn = document.querySelector(`.carousel-btn.next[data-carousel-target="${carouselId}"]`);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(carouselIntervals.get(carouselId));
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showSlide(currentIndex);
                restartCarousel(carouselId, images.length);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(carouselIntervals.get(carouselId));
                currentIndex = (currentIndex + 1) % images.length;
                showSlide(currentIndex);
                restartCarousel(carouselId, images.length);
            });
        }
        
        // Indicator clicks
        if (indicators) {
            const indicatorDots = indicators.querySelectorAll('.indicator');
            indicatorDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    clearInterval(carouselIntervals.get(carouselId));
                    currentIndex = index;
                    showSlide(currentIndex);
                    restartCarousel(carouselId, images.length);
                });
            });
        }
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselIntervals.get(carouselId));
        });
        
        carousel.addEventListener('mouseleave', () => {
            restartCarousel(carouselId, images.length);
        });
    });
}

function restartCarousel(carouselId, totalImages) {
    const carousel = document.querySelector(`.product-carousel[data-carousel="${carouselId}"]`);
    const images = carousel.querySelectorAll('.product-image');
    
    const interval = setInterval(() => {
        let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        currentIndex = (currentIndex + 1) % totalImages;
        
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === currentIndex) {
                img.classList.add('active');
            }
        });
        
        const indicators = document.querySelector(`[data-carousel="${carouselId}"].carousel-indicators`);
        if (indicators) {
            const indicatorDots = indicators.querySelectorAll('.indicator');
            indicatorDots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === currentIndex) {
                    dot.classList.add('active');
                }
            });
        }
    }, 3500);
    
    carouselIntervals.set(carouselId, interval);
}

// =============================================
// BACK TO TOP BUTTON
// =============================================

function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =============================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .benefit-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =============================================
// FORM VALIDATION (for contact page)
// =============================================

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Remove error class on input
                    input.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                } else {
                    input.classList.remove('error');
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                    }
                }
            });
            
            if (isValid) {
                // Show success message or submit form
                alert('Thank you for your inquiry! We will get back to you soon.');
                form.reset();
            } else {
                alert('Please fill in all required fields correctly.');
            }
        });
    });
}

// =============================================
// ACTIVE NAV LINK
// =============================================

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// =============================================
// LAZY LOADING IMAGES
// =============================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// =============================================
// COUNTER ANIMATION FOR STATS
// =============================================

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = counter.textContent.replace(/[^0-9]/g, '');
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// =============================================
// PRELOADER (optional)
// =============================================

function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    });
}

// =============================================
// INITIALIZE ALL FUNCTIONS
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('SynergyColorSorter website initialized');
    
    // Initialize all features
    initHeaderScroll();
    initMobileMenu();
    initCarousels();
    initBackToTop();
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    setActiveNavLink();
    initLazyLoading();
    initCounterAnimation();
    initPreloader();
    
    // Add loading class removal
    document.body.classList.add('loaded');
});

// =============================================
// CLEAN UP ON PAGE UNLOAD
// =============================================

window.addEventListener('beforeunload', () => {
    carouselIntervals.forEach(interval => clearInterval(interval));
});

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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
