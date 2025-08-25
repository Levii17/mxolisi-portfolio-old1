export function initScript() {
    // Common DOM elements
    const navbarCenter = document.getElementById("navbar-center");
    const hero = document.querySelector(".hero") || document.getElementById("hero");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDropdown = document.getElementById("mobile-dropdown");
    const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-links a");
    
    if (!navbarCenter || !hero || !mobileMenuBtn || !mobileDropdown || !mobileMenuOverlay) return;
    
    let menuOpen = false;
    
    // ===== SCROLL FUNCTIONALITY =====
    function handleScroll() {
        const hero = document.querySelector(".hero") || document.getElementById("hero");
        const navbarCenter = document.getElementById("navbar-center");
        const additionalBtn = document.querySelector('.additional-link-btn');
        
        if (!hero || !navbarCenter) return;
        
        // Handle navbar sticky behavior
        if (window.pageYOffset > 16) {
            navbarCenter.classList.add('sticky');
        } else {
            navbarCenter.classList.remove('sticky');
        }
        
        // Calculate hero bottom position
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const currentScroll = window.pageYOffset;
        
        // Show/hide additional button based on scroll position
        if (currentScroll > heroBottom) {
            navbarCenter.classList.add('scrolled');
            
            // Only show button on desktop/tablet (not mobile)
            if (additionalBtn && window.innerWidth > 768) {
                additionalBtn.style.display = 'inline-block';
                additionalBtn.style.visibility = 'visible';
                additionalBtn.style.opacity = '1';
            }
        } else {
            navbarCenter.classList.remove('scrolled');
            
            // Hide button when not scrolled past hero
            if (additionalBtn) {
                additionalBtn.style.display = 'none';
                additionalBtn.style.visibility = 'hidden';
                additionalBtn.style.opacity = '0';
            }
        }
        
        // Add active class to nav items based on scroll position
        setActiveNavItem();
    }
    
    // Enhanced resize handler
    window.addEventListener('resize', function() {
        const additionalBtn = document.querySelector('.additional-link-btn');
        const navbarCenter = document.getElementById("navbar-center");
        
        if (additionalBtn && navbarCenter) {
            if (window.innerWidth <= 768) {
                // Always hide on mobile
                additionalBtn.style.display = 'none';
                additionalBtn.style.visibility = 'hidden';
                additionalBtn.style.opacity = '0';
            } else if (navbarCenter.classList.contains('scrolled')) {
                // Show on desktop if scrolled past hero
                additionalBtn.style.display = 'inline-block';
                additionalBtn.style.visibility = 'visible';
                additionalBtn.style.opacity = '1';
            }
        }
        
        // Close mobile menu if open when resizing to desktop
        if (window.innerWidth > 768 && menuOpen) {
            toggleMenu();
        }
    });
    
    // Throttled scroll event
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 50);
    }, false);
    
    // Function to set active class to navigation items based on scroll position
    function setActiveNavItem() {
        if (!sections || !navLinks) return;
        
        const scrollPosition = window.scrollY + 100; // Offset to trigger slightly before reaching section
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove("active");
                });
                
                // Add active class to corresponding nav links
                const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
                activeLinks.forEach(link => {
                    link.classList.add("active");
                });
            }
        });
    }
    
    // ===== MOBILE MENU FUNCTIONALITY =====
    function toggleMenu() {
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            mobileDropdown.classList.add('active');
            mobileMenuOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            mobileMenuBtn.innerHTML = '✕';
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileDropdown.classList.remove('active');
            mobileMenuOverlay.style.display = 'none';
            document.body.style.overflow = '';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
    
    
    // ===== HERO ANIMATION =====
    function animateHeroElements() {
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.5s ease ${index * 0.1}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // ===== EVENT LISTENERS =====
    
    // Mobile menu events
    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileMenuOverlay.addEventListener('click', toggleMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) toggleMenu();
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const additionalBtn = document.querySelector('.additional-link-btn');
        if (additionalBtn) {
            if (window.innerWidth <= 768) {
                additionalBtn.style.display = 'none';
            } else if (navbarCenter.classList.contains('scrolled')) {
                additionalBtn.style.display = 'inline-block';
            }
        }
        
        if (window.innerWidth > 768 && menuOpen) {
            toggleMenu();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    
    // ===== INITIALIZATION =====

    handleScroll();
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    setActiveNavItem();
    // Animate hero elements
    animateHeroElements();
}