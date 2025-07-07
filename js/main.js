// Modern JavaScript for Peluquería Petit
// Optimized for performance and accessibility

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeLazyLoading();
    initializeWhatsAppAnalytics();
    initializeAccessibility();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        disable: 'mobile' // Disable on mobile for better performance
      });
    }
  });

  // Gallery functionality - Working with HTML images
  function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselIndicators = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    let currentFilter = 'all';
    let visibleItems = 9;
    let currentSlide = 0;
    let isPlaying = true;
    let autoPlayInterval;
    
    // Initialize carousel with existing images
    function initializeCarousel() {
      if (!carouselTrack || !carouselIndicators) return;
      
      // Get first 8 images for carousel
      const carouselImages = Array.from(galleryItems).slice(0, 8);
      carouselTrack.innerHTML = '';
      carouselIndicators.innerHTML = '';
      
      carouselImages.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4') ? item.querySelector('h4').textContent : 'Trabajo Profesional';
        const description = item.querySelector('p') ? item.querySelector('p').textContent : 'Realizado en Peluquería Petit';
        
        // Create slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
          <img src="${img.src}" alt="${title}" loading="lazy">
          <div class="carousel-slide-content">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
        `;
        carouselTrack.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
      });
      
      updateCarousel();
      startAutoPlay();
    }
    
    // Carousel navigation
    function goToSlide(index) {
      const slides = carouselTrack.querySelectorAll('.carousel-slide');
      const indicators = carouselIndicators.querySelectorAll('.carousel-indicator');
      
      currentSlide = index;
      
      // Update carousel position
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update indicators
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
      });
      
      // Update button states
      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
    }
    
    function nextSlide() {
      const slides = carouselTrack.querySelectorAll('.carousel-slide');
      if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(0); // Loop back to first slide
      }
    }
    
    function prevSlide() {
      const slides = carouselTrack.querySelectorAll('.carousel-slide');
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      } else {
        goToSlide(slides.length - 1); // Loop to last slide
      }
    }
    
    function updateCarousel() {
      const slides = carouselTrack.querySelectorAll('.carousel-slide');
      if (slides.length > 0) {
        goToSlide(0);
      }
    }
    
    // Auto-play functionality
    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }
    
    function stopAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    }
    
    function toggleAutoPlay() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        startAutoPlay();
        if (playPauseBtn) playPauseBtn.textContent = '⏸️ Pausar';
        const statusEl = document.querySelector('.auto-status');
        if (statusEl) statusEl.textContent = 'Reproducción automática activada';
      } else {
        stopAutoPlay();
        if (playPauseBtn) playPauseBtn.textContent = '▶️ Reproducir';
        const statusEl = document.querySelector('.auto-status');
        if (statusEl) statusEl.textContent = 'Reproducción automática pausada';
      }
    }
    
    // Gallery grid functionality
    function updateGalleryVisibility() {
      const filteredItems = Array.from(galleryItems).filter(item => {
        const categories = item.getAttribute('data-category');
        if (currentFilter === 'all' || currentFilter === 'todos') return true;
        return categories && categories.includes(currentFilter);
      });
      
      // Hide all items first
      galleryItems.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('visible');
      });
      
      // Show filtered items with animation
      filteredItems.forEach((item, index) => {
        if (index < visibleItems) {
          item.style.display = 'block';
          setTimeout(() => {
            item.classList.add('visible');
          }, index * 50);
        }
      });
      
      // Update load more button
      if (loadMoreBtn) {
        if (visibleItems >= filteredItems.length) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'inline-block';
        }
      }
    }
    
    // Filter functionality
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        currentFilter = filter;
        visibleItems = 9; // Reset visible items
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        updateGalleryVisibility();
      });
    });
    
    // Load more functionality
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        visibleItems += 6;
        updateGalleryVisibility();
      });
    }
    
    // Carousel event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAutoPlay);
    
    // Pause auto-play on hover
    if (carouselTrack) {
      carouselTrack.addEventListener('mouseenter', stopAutoPlay);
      carouselTrack.addEventListener('mouseleave', () => {
        if (isPlaying) startAutoPlay();
      });
    }
    
    // Initialize everything
    initializeCarousel();
    updateGalleryVisibility();
  }

  // Navigation functionality
  function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = navbar.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
          }
          
          // Update active link
          updateActiveNavLink(this);
        }
      });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink(activeLink) {
      navLinks.forEach(link => link.classList.remove('active'));
      activeLink.classList.add('active');
    }
  }

  // Scroll effects
  function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const whatsappButton = document.querySelector('.whatsapp-float');
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          const scrollY = window.scrollY;
          
          // Navbar scroll effect
          if (scrollY > 100) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          
          // WhatsApp button visibility
          if (scrollY > 300) {
            whatsappButton.style.opacity = '1';
            whatsappButton.style.transform = 'scale(1)';
          } else {
            whatsappButton.style.opacity = '0.8';
            whatsappButton.style.transform = 'scale(0.9)';
          }
          
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Lazy loading for images
  function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            img.addEventListener('load', function() {
              img.classList.add('loaded');
            });
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.remove('lazy');
        img.classList.add('loaded');
      });
    }
  }

  // WhatsApp analytics and enhancements
  function initializeWhatsAppAnalytics() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Track conversion (replace with your analytics)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'WhatsApp',
            event_label: this.textContent.trim(),
            value: 1
          });
        }
        
        // Add loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abriendo WhatsApp...';
        
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  // Accessibility enhancements
  function initializeAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .gallery-item');
    
    cards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          const link = this.querySelector('a, button');
          if (link) {
            link.click();
          }
        }
      });
    });
    
    // Improve focus visibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', function() {
        this.style.outline = '2px solid #4d2c1d';
        this.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
      });
    });
  }

  // Service worker registration for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Performance monitoring
  function initializePerformanceMonitoring() {
    // Monitor loading times
    window.addEventListener('load', function() {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_load_time', {
          event_category: 'Performance',
          value: Math.round(loadTime)
        });
      }
    });
    
    // Monitor scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        if (maxScroll >= 25 && maxScroll < 50) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
              event_category: 'Engagement',
              event_label: '25%'
            });
          }
        }
      }
    });
  }

  // Error handling
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'javascript_error', {
        event_category: 'Error',
        event_label: e.error.message
      });
    }
  });

  // Initialize performance monitoring
  initializePerformanceMonitoring();

  // Global functions for lightbox
  window.openLightbox = function(imageSrc, title, description = '') {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    
    lightboxImg.src = imageSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description || 'Servicio profesional realizado en Peluquería Petit';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track gallery interaction
    if (typeof gtag !== 'undefined') {
      gtag('event', 'gallery_view', {
        event_category: 'Gallery',
        event_label: title
      });
    }
  };

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeLightbox();
    }
  });

})();
