document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
     * 1. TECH PRELOADER SEQUENCER
     * =======================================================================*/
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderPercent = document.getElementById('preloader-percent');
    const terminal = document.getElementById('preloader-terminal');
    
    const bootLogs = [
        "PARSING BLUEPRINT GRAPH DATA...",
        "CONNECTING TO RENDER PIPELINE...",
        "PRE-COMPILING HLSL SHADER OBJECTS...",
        "SYNCING PERSISTENT DATA NODES...",
        "LOADING PORTFOLIO SCHEMATICS...",
        "COMPILING LEVEL DESIGN ASSETS...",
        "LAUNCHING EXPERIENCE SUB-ROUTINES...",
        "BOOT SEQUENCE COMPLETION STATUS: [SUCCESS]"
    ];

    let progress = 0;
    let logIndex = 0;
    
    // Disable scrolling during load
    document.body.style.overflow = 'hidden';

    // Append log line helper
    function appendTerminalLog(text) {
        if (!terminal) return;
        const line = document.createElement('p');
        line.className = 'term-line';
        line.innerHTML = `<span style='color: var(--accent-purple)'>&gt;</span> ${text}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    const loaderInterval = setInterval(() => {
        // Random incremental jumps
        progress += Math.floor(Math.random() * 8) + 2;
        if (progress > 100) progress = 100;
        
        preloaderBar.style.width = `${progress}%`;
        preloaderPercent.textContent = `${progress}%`;
        
        // Print logging checks periodically
        if (progress >= (logIndex + 1) * (100 / bootLogs.length) && logIndex < bootLogs.length) {
            appendTerminalLog(bootLogs[logIndex]);
            logIndex++;
        }
        
        if (progress >= 100) {
            clearInterval(loaderInterval);
            
            // Short delay after 100% to look premium
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.pointerEvents = 'none';
                document.body.style.overflow = '';
                
                // Trigger scroll animations for the hero segment immediately
                triggerHeroAnimations();
            }, 600);
        }
    }, 80);

    function triggerHeroAnimations() {
        const heroReveals = document.querySelectorAll('#home .scroll-reveal');
        heroReveals.forEach(el => {
            el.classList.add('active');
        });
    }

    /* =========================================================================
     * 2. CUSTOM CURSOR GLOW AND TRAILS
     * =======================================================================*/
    const cursorDot = document.getElementById('cursor-dot');
    const cursorGlow = document.getElementById('cursor-glow');
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot matches cursor coordinate instantly
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outer glow trailing cursor with easing lag
    function animateCursorGlow() {
        // Easing factor (lower values = slower lag)
        const delay = 0.15;
        
        glowX += (mouseX - glowX) * delay;
        glowY += (mouseY - glowY) * delay;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // Click triggers
    document.addEventListener('mousedown', () => {
        cursorGlow.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
        cursorGlow.classList.remove('clicking');
    });

    // Hover triggers over buttons/links
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .project-card, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('hovering');
        });
    });

    /* =========================================================================
     * 3. DYNAMIC CANVAS PARTICLE (BLUEPRINT NETWORK)
     * =======================================================================*/
    const canvas = document.getElementById('blueprint-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Config variables
        const maxParticles = 60;
        const connectionDistance = 140;
        const speedMultiplier = 0.35;
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * speedMultiplier;
                this.vy = (Math.random() - 0.5) * speedMultiplier;
                this.radius = Math.random() * 1.5 + 1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Bounds bounce
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 127, 255, 0.4)'; // Unreal Blue particle
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 127, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function drawBlueprintGrid() {
            // Draw a subtle digital grid layer
            const gridSize = 80;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
            ctx.lineWidth = 0.5;
            
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        function loopCanvas() {
            ctx.clearRect(0, 0, width, height);
            
            drawBlueprintGrid();
            
            // Update particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            drawConnections();
            
            requestAnimationFrame(loopCanvas);
        }
        loopCanvas();
    }

    /* =========================================================================
     * 4. SCROLL PROGRESS & STICKY NAVIGATION STYLING
     * =======================================================================*/
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('progress-bar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Progress bar width
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }
        
        // Sticky Header style shift
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back-to-top button appearance
        if (scrollTop > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* =========================================================================
     * 5. HAMBURGER SLIDE OUT MENU
     * =======================================================================*/
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    /* =========================================================================
     * 6. SCROLL REVEAL & NAV ACTIVE ANCHOR OBSERVATIONS
     * =======================================================================*/
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Highlight corresponding nav link
                const sectionId = entry.target.getAttribute('id');
                if (sectionId) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    sections.forEach(section => revealObserver.observe(section));

    /* =========================================================================
     * 7. NUMERIC STATS SCROLL-TRIGGERED COUNTER
     * =======================================================================*/
    const countersSection = document.getElementById('counters');
    const counterNumbers = document.querySelectorAll('.counter-number');
    let counted = false;

    if (countersSection) {
        const countersObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counterNumbers.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000; // 2 seconds
                        const stepTime = Math.max(Math.floor(duration / target), 30);
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current++;
                            counter.textContent = current;
                            
                            if (current >= target) {
                                counter.textContent = target + "+";
                                clearInterval(timer);
                            }
                        }, stepTime);
                    });
                    counted = true;
                }
            });
        }, {
            threshold: 0.3
        });
        
        countersObserver.observe(countersSection);
    }

    /* =========================================================================
     * 8. PROJECT CARDS ACCORDION DETAILS EXPANSION
     * =======================================================================*/
    const expandBtns = document.querySelectorAll('.btn-expand');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            
            // Close other cards first
            document.querySelectorAll('.project-card').forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    otherCard.classList.remove('expanded');
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
        });
    });

    /* =========================================================================
     * 9. RENDER GRID LIGHTBOX OVERLAY
     * =======================================================================*/
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('.gallery-img').getAttribute('src');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            
            lightboxImg.setAttribute('src', imgSrc);
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    /* =========================================================================
     * 10. TESTIMONIAL CAROUSEL SLIDER
     * =======================================================================*/
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    let currentSlide = 0;
    let autoSlideInterval;

    if (slides.length > 0) {
        // Generate dot elements
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');

        function updateSlideStates() {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active');
                dots[idx].classList.remove('active');
                if (idx === currentSlide) {
                    slide.classList.add('active');
                    dots[idx].classList.add('active');
                }
            });
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlideStates();
            resetAutoSlide();
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlideStates();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlideStates();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 6000); // 6s rotation
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        startAutoSlide();
    }

    /* =========================================================================
     * 11. UPLINK CONTACT FORM & DUMMY FEEDBACK
     * =======================================================================*/
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form inputs
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;
            
            // Formulate WhatsApp redirect URL
            const whatsappNumber = '917559894840';
            const whatsappText = `Hello! You have a new message from your game developer portfolio:\n\n*Developer ID / Name:* ${name}\n*Comm Channel / Email:* ${email}\n*Subject:* ${subject}\n*Message Detail:* ${message}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
            
            // Visually loading state
            const origBtnText = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<span>TRANSMITTING SIGNAL...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            // Open WhatsApp redirect in new window/tab immediately to prevent popup blocker triggers
            window.open(whatsappUrl, '_blank');
            
            setTimeout(() => {
                formSubmitBtn.innerHTML = `<span>SIGNAL SENT</span> <i class="fa-solid fa-check"></i>`;
                formStatus.style.display = 'block';
                formStatus.style.opacity = '0';
                
                // Fade in success message
                setTimeout(() => {
                    formStatus.style.opacity = '1';
                }, 50);
                
                // Reset form
                contactForm.reset();
                
                // Reset button state after a delay
                setTimeout(() => {
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = origBtnText;
                    
                    // Fade out status message
                    setTimeout(() => {
                        formStatus.style.opacity = '0';
                        setTimeout(() => {
                            formStatus.style.display = 'none';
                        }, 500);
                    }, 4000);
                }, 3000);
                
            }, 1000); // Shorter aesthetic loading delay
        });
    }

    /* =========================================================================
     * 12. LAZY LOADING IMAGES FOR SYSTEM OPTIMIZATION
     * =======================================================================*/
    const imagesToLazyLoad = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Already has src, just ensure display trigger is done
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });
        
        imagesToLazyLoad.forEach(img => {
            img.style.transition = 'opacity 0.5s ease';
            img.style.opacity = '0';
            imageObserver.observe(img);
        });
    }
});
