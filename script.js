// Language switching functionality
const languageSwitcher = {
    currentLang: localStorage.getItem('language') || 'uk',
    
    init() {
        // Set initial language
        this.setLanguage(this.currentLang);
        
        // Add event listeners to language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.setLanguage(lang);
                localStorage.setItem('language', lang);
            });
        });
    },
    
    setLanguage(lang) {
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update active state of language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update all translatable elements
        document.querySelectorAll('[data-uk]').forEach(element => {
            element.textContent = element.dataset[lang];
        });
        
        // Update meta tags
        const metaDescription = document.querySelector('meta[name="description"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        
        if (lang === 'uk') {
            metaDescription.content = "Офіційний дистриб'ютор Samsung INR21700-50GB. Високоякісні літій-іонні акумулятори для дронів, електровелосипедів та електротранспорту. Доставка по всій Україні.";
            metaKeywords.content = "Samsung INR21700-50GB, літій-іонні акумулятори, дрони, електровелосипеди, електротранспорт, Україна";
        } else {
            metaDescription.content = "Официальный дистрибьютор Samsung INR21700-50GB. Высококачественные литий-ионные аккумуляторы для дронов, электровелосипедов и электротранспорта. Доставка по всей Украине.";
            metaKeywords.content = "Samsung INR21700-50GB, литий-ионные аккумуляторы, дроны, электровелосипеды, электротранспорт, Украина";
        }
    }
};

// Mobile menu toggle
const initializeMobileMenu = () => {
    const nav = document.querySelector('nav .container');
    const navLinks = document.querySelector('.nav-links');
    
    // Only proceed if both nav and navLinks exist
    if (!nav || !navLinks) return;
    
    // Check if mobile menu button already exists
    if (!document.querySelector('.mobile-menu-btn')) {
        // Create mobile menu button
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.setAttribute('aria-label', 'Toggle menu');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert button before nav links
        nav.insertBefore(menuButton, navLinks);
        
        // Toggle mobile menu - use event delegation
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click event from firing
            navLinks.classList.toggle('active');
            menuButton.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const menuButton = document.querySelector('.mobile-menu-btn');
            if (menuButton) {
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const menuButton = document.querySelector('.mobile-menu-btn');
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && (!menuButton || !menuButton.contains(e.target))) {
            navLinks.classList.remove('active');
            if (menuButton) {
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
};

// Carousel functionality
const carousel = {
    init() {
        const carousels = document.querySelectorAll('.carousel');
        
        carousels.forEach(carouselElement => {
            const track = carouselElement.querySelector('.carousel-track');
            const slides = carouselElement.querySelectorAll('.carousel-slide');
            const prevButton = carouselElement.querySelector('.carousel-button.prev');
            const nextButton = carouselElement.querySelector('.carousel-button.next');
            const dotsContainer = carouselElement.querySelector('.carousel-dots');
            
            if (!track || !slides.length || !prevButton || !nextButton || !dotsContainer) return;
            
            let currentSlide = 0;
            const slideCount = slides.length;
            
            // Create dots
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = carouselElement.querySelectorAll('.carousel-dot');
            
            function updateDots() {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
            
            function goToSlide(index) {
                currentSlide = index;
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                updateDots();
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slideCount;
                goToSlide(currentSlide);
            }
            
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slideCount) % slideCount;
                goToSlide(currentSlide);
            }
            
            // Event listeners
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
            
            // Auto-play
            let autoplayInterval = setInterval(nextSlide, 5000);
            
            // Pause on hover
            track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
            track.addEventListener('mouseleave', () => {
                autoplayInterval = setInterval(nextSlide, 5000);
            });
        });
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    languageSwitcher.init();
    
    // Initialize mobile menu first
    initializeMobileMenu();
    
    // Then initialize carousel
    carousel.init();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            // Re-initialize mobile menu if we're on mobile
            initializeMobileMenu();
        } else {
            // Remove menu button and reset nav if we're on desktop
            const menuButton = document.querySelector('.mobile-menu-btn');
            if (menuButton) {
                menuButton.remove();
            }
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Do first check for mobile
    if (window.innerWidth <= 768) {
        initializeMobileMenu();
    }

    // Create and setup fullscreen viewer
    createFullscreenViewer();
    setupCarouselImageClicks();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        this.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Add parallax effect to hero section
const hero = document.querySelector('#hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });
}

// Add hover effect to application and advantage items
document.querySelectorAll('.application-item, .advantage-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
});

// Facebook Pixel Event Tracking
function trackPixelEvent(eventName, params = {}) {
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, params);
    }
}

// Track contact button clicks
document.querySelectorAll('a[href="#contact"], .btn.primary').forEach(button => {
    button.addEventListener('click', () => {
        trackPixelEvent('Contact');
    });
});

// Track specific section views using Intersection Observer
const pixelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId) {
                switch(sectionId) {
                    case 'specs':
                        trackPixelEvent('ViewContent', {content_name: 'specifications'});
                        break;
                    case 'applications':
                        trackPixelEvent('ViewContent', {content_name: 'applications'});
                        break;
                    case 'availability':
                        trackPixelEvent('ViewContent', {content_name: 'availability'});
                        break;
                }
            }
            pixelObserver.unobserve(entry.target);
        }
    });
}, {threshold: 0.7});

// Observe important sections for pixel tracking
['specs', 'applications', 'availability'].forEach(id => {
    const section = document.getElementById(id);
    if (section) {
        pixelObserver.observe(section);
    }
});

// Track PDF download
const pdfDownloadButton = document.querySelector('.pdf-download-button');
if (pdfDownloadButton) {
    pdfDownloadButton.addEventListener('click', () => {
        trackPixelEvent('Download', {content_name: 'SGS Report'});
    });
}

// Track messenger clicks
document.querySelectorAll('.messenger-btn').forEach(button => {
    button.addEventListener('click', () => {
        const messengerType = button.classList.contains('telegram') ? 'Telegram' : 
                             button.classList.contains('viber') ? 'Viber' : 'WhatsApp';
        trackPixelEvent('InitiateCheckout', {messenger_type: messengerType});
    });
});

// Fullscreen image viewer
function createFullscreenViewer() {
    // Create fullscreen viewer elements if they don't exist
    if (!document.querySelector('.fullscreen-viewer')) {
        const viewer = document.createElement('div');
        viewer.className = 'fullscreen-viewer';
        viewer.innerHTML = `
            <div class="fullscreen-content">
                <img src="" alt="Fullscreen image" class="fullscreen-image">
                <button class="fullscreen-close">&times;</button>
                <button class="fullscreen-prev">&lt;</button>
                <button class="fullscreen-next">&gt;</button>
            </div>
        `;
        document.body.appendChild(viewer);

        // Close fullscreen viewer when clicking close button or outside the image
        const closeBtn = viewer.querySelector('.fullscreen-close');
        closeBtn.addEventListener('click', () => {
            viewer.classList.remove('active');
            document.body.style.overflow = '';
            
            // Track closing fullscreen image viewer
            trackPixelEvent('CloseView', {content_type: 'fullscreen_image'});
        });

        viewer.addEventListener('click', (e) => {
            if (e.target === viewer) {
                viewer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Setup navigation buttons
        const prevBtn = viewer.querySelector('.fullscreen-prev');
        const nextBtn = viewer.querySelector('.fullscreen-next');
        
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateFullscreenImage(-1);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateFullscreenImage(1);
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!viewer.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                viewer.classList.remove('active');
                document.body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                navigateFullscreenImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateFullscreenImage(1);
            }
        });
    }
}

// Current carousel context for fullscreen navigation
let currentCarouselImages = [];
let currentImageIndex = 0;

// Navigate between images in fullscreen mode
function navigateFullscreenImage(direction) {
    if (currentCarouselImages.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + direction + currentCarouselImages.length) % currentCarouselImages.length;
    const fullscreenImage = document.querySelector('.fullscreen-image');
    fullscreenImage.src = currentCarouselImages[currentImageIndex];
}

// Make all carousel images clickable to open in fullscreen
function setupCarouselImageClicks() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('.carousel-slide img');
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', () => {
                // Save current carousel context for navigation
                currentCarouselImages = Array.from(images).map(image => image.src);
                currentImageIndex = index;
                
                // Show image in fullscreen viewer
                const viewer = document.querySelector('.fullscreen-viewer');
                const fullscreenImage = viewer.querySelector('.fullscreen-image');
                
                fullscreenImage.src = img.src;
                viewer.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when fullscreen is active
                
                // Track opening fullscreen image viewer
                trackPixelEvent('ViewContent', {content_type: 'fullscreen_image'});
                
                // Show/hide navigation buttons based on number of images
                const prevBtn = viewer.querySelector('.fullscreen-prev');
                const nextBtn = viewer.querySelector('.fullscreen-next');
                
                if (images.length <= 1) {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                } else {
                    prevBtn.style.display = '';
                    nextBtn.style.display = '';
                }
            });
        });
    });
} 