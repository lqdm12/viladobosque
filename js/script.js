// ====================== VILA DO BOSQUE - SCRIPT.JS ======================

document.addEventListener('DOMContentLoaded', function() {
    
    // Performance: Debounce for scroll
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

    // NAV SCROLL EFFECT
    const nav = document.getElementById('nav');
    
    const handleScroll = debounce(() => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // INTERSECTION OBSERVER OPTIMIZED
    const fadeEls = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, observerOptions);

    fadeEls.forEach(el => observer.observe(el));

    // FAQ ACCORDION IMPROVED
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-q');
        const answer = item.querySelector('.faq-a');
        
        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-a').style.maxHeight = null;
                    otherItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = null;
                button.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                button.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // MOBILE MENU IMPROVED
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    function toggleMenu() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('mobile-open');
        body.classList.toggle('menu-open');
        
        // Trap focus in mobile menu
        if (!isExpanded) {
            const firstLink = navLinks.querySelector('a');
            const lastLink = navLinks.querySelector('a:last-child');
            
            navLinks.addEventListener('keydown', function trapFocus(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstLink) {
                        e.preventDefault();
                        lastLink.focus();
                    } else if (!e.shiftKey && document.activeElement === lastLink) {
                        e.preventDefault();
                        firstLink.focus();
                    }
                }
                if (e.key === 'Escape') {
                    toggleMenu();
                    hamburger.focus();
                }
            });
        }
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('mobile-open') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // SMOOTH SCROLL WITH OFFSET
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-open')) {
                    toggleMenu();
                }
                
                // Update URL without scroll
                history.pushState(null, null, targetId);
            }
        });
    });

    // CONVERSION TRACKING
    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics Event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/LABEL',
                    'value': 1.0,
                    'currency': 'BRL'
                });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact');
            }
        });
    });

    // LANGUAGE DETECTION
    (function detectLanguage() {
        const currentPage = window.location.pathname;
        const hasLangParam = new URLSearchParams(window.location.search).get('lang');
        
        if (!hasLangParam && !sessionStorage.getItem('lang_detected')) {
            const userLang = navigator.language || navigator.userLanguage;
            const lang = userLang.toLowerCase();
            
            sessionStorage.setItem('lang_detected', 'true');
            
            // Smart redirect (commented out - enable if needed)
            if (lang.startsWith('pt') && !currentPage.includes('-pt')) {
                // window.location.href = 'index-pt.html';
            } else if (lang.startsWith('es') && !currentPage.includes('-es')) {
                // window.location.href = 'index-es.html';
            }
        }
    })();

    console.log('%c🌳 Vila do Bosque loaded successfully!', 'color: #7A9E72; font-size: 14px; font-weight: bold;');
});
