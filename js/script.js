// ========================================
// RevieWWe — JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const navOverlay = document.getElementById('navOverlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            nav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Search Overlay
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput && searchInput.focus(), 200);
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // ESC key to close overlays
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (nav) {
                nav.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Scroll header effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        } else {
            header.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
    });

    // --- Dynamic Navigation Active State ---
    const navLinks = document.querySelectorAll('.nav__link');
    const reviewSection = document.getElementById('review');

    // Only run on homepage where #review exists
    if (reviewSection) {
        const observerOptions = {
            root: null,
            threshold: 0.2, // Trigger when 20% of section is visible
            rootMargin: '-10% 0px -70% 0px' // Adjust trigger point
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Switch to Artikel
                    navLinks.forEach(link => {
                        link.classList.remove('nav__link--active');
                        if (link.getAttribute('href') === '#review') {
                            link.classList.add('nav__link--active');
                        }
                    });
                } else if (window.scrollY < entry.boundingClientRect.top) {
                    // Switch back to Beranda when above the section
                    navLinks.forEach(link => {
                        link.classList.remove('nav__link--active');
                        if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '#') {
                            link.classList.add('nav__link--active');
                        }
                    });
                }
            });
        }, observerOptions);

        observer.observe(reviewSection);
    }

    // --- Hero Carousel ---
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        const slides = document.querySelectorAll('.hero__slide');
        const dots = document.querySelectorAll('.hero__dot');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(n) {
            slides[currentSlide].classList.remove('hero__slide--active');
            dots[currentSlide].classList.remove('hero__dot--active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('hero__slide--active');
            dots[currentSlide].classList.add('hero__dot--active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                showSlide(index);
                startAutoplay();
            });
        });

        // Initialize
        startAutoplay();

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
    }
});
