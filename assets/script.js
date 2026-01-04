document.addEventListener('DOMContentLoaded', () => {

    // --- Page Fade-in ---
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);

    // --- PWA Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Dark/Light Mode Toggle ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = toggleBtn.querySelector('i');

    // Check LocalStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        // Update Icon & Storage
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Hamburger animatie (simpel)
        hamburger.classList.toggle('toggle');
    });

    // Sluit menu als er op een link geklikt wordt
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Intersection Observer voor Fade-in Animaties ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Eenmalige animatie
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // --- Contact Formulier Handler (Playground Demo) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Verzonden! 🚀';
            btn.style.backgroundColor = 'var(--accent-hover)';

            setTimeout(() => {
                contactForm.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
            }, 3000);
        });
    }

    // --- Separator Parallax & Trigger Logic ---
    const separators = document.querySelectorAll('.separator-section');

    if (separators.length > 0) {
        // Gebruik requestAnimationFrame voor performance tijdens scrollen
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    separators.forEach(sep => {
                        const rect = sep.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        const elementHeight = rect.height;

                        // Bereken wanneer de onderkant van de viewport 75% van de afbeelding heeft bereikt
                        // rect.top is de afstand van de bovenkant van de viewport tot de bovenkant van het element.
                        // Als rect.top + (elementHeight * 0.75) < windowHeight, dan hebben we 75% gehad.

                        const title = sep.querySelector('.floating-title');
                        if (title) {
                            // Trigger punt: als 75% van de hoogte voorbij de onderkant van het scherm is
                            // Of simpeler: als de gebruiker ver genoeg gescrolld is dat de afbeelding dominant is geweest.
                            // We gebruiken hier: Als de bovenkant van de afbeelding boven de 25% lijn van de viewport zit (dus 75% scrollruimte over).
                            // Of strikt volgens prompt: "over 75% van de afbeelding is gescrolt".

                            // Formule: Percentage zichtbaar vanaf onderkant viewport
                            // Progressie = (windowHeight - rect.top) / elementHeight
                            // Maar we willen weten of we 'voorbij' 75% zijn.

                            // Laten we het visueel maken: Als de afbeelding bijna het scherm verlaat aan de bovenkant, of als hij vol in beeld is.
                            // Interpretatie: De tekst verschijnt als climax wanneer je de afbeelding goed bekeken hebt.

                            // Trigger als de bovenkant van de sectie de bovenste helft van het scherm nadert (gebruiker heeft er doorheen gescrolld)
                            // Of: trigger als 75% van de afbeelding zichtbaar is geworden.

                            // Implementatie prompt: "over 75% gescrolt" -> We meten progressie door het element.
                            const scrollProgress = (windowHeight - rect.top) / (windowHeight + elementHeight);

                            // Als we op 50% van de totale animatie-tijd (door het element heen) zitten, is het vaak mooist.
                            // Maar voor "75% van de afbeelding":
                            // Laten we checken of de onderkant van de viewport voorbij 75% van de afbeelding is.
                            const scrolledPastPixels = windowHeight - rect.top;
                            const thresholdPixels = elementHeight * 0.75;

                            if (scrolledPastPixels > thresholdPixels) {
                                title.classList.add('active');
                            } else {
                                title.classList.remove('active');
                            }
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // --- Video Autoplay Observer ---
    // Speelt video's af als ze 50% in beeld zijn, pauzeert ze daarbuiten.
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.gallery-item video').forEach(video => {
        video.muted = true; // Forceer mute voor autoplay policy
        videoObserver.observe(video);
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');
    // Selecteer img tags én divs die als afbeelding dienen (background-image)
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video, .social-image-container img, .card-image, .rig-visual, .project-thumb, .section img');

    if (lightbox) {
        // Open Lightbox
        galleryItems.forEach(item => {
            item.style.cursor = 'pointer'; // Laat zien dat het klikbaar is
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Voorkom scrollen op body

                if (item.tagName === 'IMG') {
                    lightboxImg.src = item.src;
                    lightboxImg.style.display = 'block';
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.pause();
                } else if (item.tagName === 'VIDEO') {
                    lightboxVideo.src = item.src;
                    lightboxVideo.style.display = 'block';
                    lightboxImg.style.display = 'none';
                    // In lightbox willen we geluid en controls
                    lightboxVideo.muted = false;
                    lightboxVideo.controls = true;
                    lightboxVideo.play();
                } else if (item.tagName === 'DIV') {
                    // Haal URL uit background-image: url("...")
                    const style = window.getComputedStyle(item);
                    const bg = style.backgroundImage;
                    // Strip url(" en ")
                    const src = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

                    lightboxImg.src = src;
                    lightboxImg.style.display = 'block';
                    lightboxVideo.style.display = 'none';
                    lightboxVideo.pause();
                }
            });
        });

        // Sluit Lightbox functie
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lightboxVideo.pause();
            lightboxVideo.src = ""; // Reset video source
        };

        closeBtn.addEventListener('click', closeLightbox);

        // Sluit ook als je naast de foto klikt
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Smart Navbar (Scroll Behavior) ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    // Ensure we check the mobile menu state (defined earlier as navLinks)

    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScrollY = Math.max(0, window.scrollY);
            const isMobileMenuOpen = navLinks && navLinks.classList.contains('active');

            // 1. Always show if at the top (buffer zone)
            // 2. Always show if mobile menu is open (UX fix)
            // 3. Show if scrolling UP
            if (currentScrollY < 60 || isMobileMenuOpen || currentScrollY < lastScrollY) {
                navbar.classList.remove('nav-hidden');
            }
            // 4. Hide ONLY if scrolling DOWN and past the buffer zone
            else if (currentScrollY > lastScrollY && currentScrollY > 60) {
                navbar.classList.add('nav-hidden');
            }

            lastScrollY = currentScrollY;
        });
    }

    // --- Global Typewriter Effect for H1 ---
    const typeWriterElements = document.querySelectorAll('h1');

    // Check of we op een pagina zijn met een eigen identiteit (Bikes, AV, Sim)
    // Zo ja, dan slaan we de JS-char-fade over zodat de CSS-animaties (Slide/Glitch/Zoom) hun werk kunnen doen.
    const hasCustomIdentity = document.body.classList.contains('page-bikes') ||
        document.body.classList.contains('page-av') ||
        document.body.classList.contains('page-sim') ||
        document.body.classList.contains('page-home');


    const typeWriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const chars = element.querySelectorAll('.type-char');

                setTimeout(() => {
                    chars.forEach((char, index) => {
                        setTimeout(() => {
                            char.style.opacity = '1';
                        }, 75 * index); // Iets langzamer (75ms)
                    });
                }, 250); // Startvertraging voor betere timing met fade-in

                typeWriterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    // Voer alleen uit op Index en Web (of pagina's zonder custom identity)
    if (!hasCustomIdentity) {
        typeWriterElements.forEach(el => {
            // Zorg dat element zichtbaar is (voor het geval CSS het verbergt)
            el.style.opacity = '1';

            const wrapTextNodes = (node) => {
                if (node.nodeType === 3) { // Text node
                    const text = node.nodeValue;
                    if (!text.trim()) return; // Skip witruimte

                    const fragment = document.createDocumentFragment();
                    [...text].forEach(char => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        span.className = 'type-char';
                        span.style.opacity = '0';
                        span.style.transition = 'opacity 0.1s';
                        fragment.appendChild(span);
                    });
                    node.replaceWith(fragment);
                } else {
                    [...node.childNodes].forEach(wrapTextNodes);
                }
            };

            // Verwerk de tekstnodes zonder de HTML structuur (zoals .accent spans) te breken
            [...el.childNodes].forEach(wrapTextNodes);

            typeWriterObserver.observe(el);
        });
    }

    // --- Draggable Infinite Carousel ---
    const marqueeTrack = document.querySelector('.marquee-track');
    const marqueeContainer = document.querySelector('.stories-marquee');

    if (marqueeTrack && marqueeContainer) {
        let x = 0;
        let speed = 0.5; // Base auto-scroll speed
        let isDragging = false;
        let startX = 0;
        let dragStartX = 0;
        let setWidth = 0;
        let isClickBlocked = false;

        // Calculate width of one set of items (originals)
        // We assume the track has 2 sets (originals + duplicates)
        const calculateWidth = () => {
            if (marqueeTrack.children.length > 0) {
                // Determine width based on half the total scroll width
                // This assumes duplicates are exactly same as originals
                return marqueeTrack.scrollWidth / 2;
            }
            return 0;
        };

        // Initialize and update on resize
        const initDimensions = () => {
            setWidth = calculateWidth();
        };

        // Wait for images to load for correct width
        window.addEventListener('load', initDimensions);
        window.addEventListener('resize', initDimensions);
        initDimensions();

        const animate = () => {
            if (!isDragging) {
                x -= speed;
            }

            // Infinite loop logic: wrap around when strictly needed
            // Ensure setWidth is valid
            if (setWidth > 0) {
                if (x <= -setWidth) {
                    x += setWidth;
                    // Adjust dragStart if dragging to keep logic consistent?
                    // Usually not needed during auto-scroll, but during drag verify:
                    if (isDragging) dragStartX += setWidth;
                } else if (x > 0) {
                    x -= setWidth;
                    if (isDragging) dragStartX -= setWidth;
                }
            }

            marqueeTrack.style.transform = `translateX(${x}px)`;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        // --- Drag / Swipe Logic ---
        const startDrag = (e) => {
            isDragging = true;
            isClickBlocked = false; // Reset
            startX = e.pageX || e.touches[0].pageX;
            dragStartX = x;
            marqueeContainer.classList.add('grabbing');
            marqueeTrack.style.transition = 'none'; // Instant response
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            // Only prevent default if shifting horizontally significantly (allow vertical scroll?)
            // But touch-action: pan-y handles vertical.

            const currentX = e.pageX || e.touches[0].pageX;
            const diff = currentX - startX;
            x = dragStartX + diff;

            // Block click if moved more than threshold
            if (Math.abs(diff) > 5) {
                isClickBlocked = true;
            }
        };

        const endDrag = () => {
            isDragging = false;
            marqueeContainer.classList.remove('grabbing');
        };

        // Mouse Events
        marqueeContainer.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);

        // Touch Events
        marqueeContainer.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchmove', moveDrag, { passive: true });
        window.addEventListener('touchend', endDrag);

        // Prevent Lightbox Click if Dragged
        // Use capture phase to intercept click before it gets to the image
        marqueeContainer.addEventListener('click', (e) => {
            if (isClickBlocked) {
                e.preventDefault();
                e.stopPropagation();
                isClickBlocked = false; // Reset
            }
        }, true);
    }

    // --- Hybrid Particle Storm (JS Physics + CSS 3D Actions) ---
    const reactor = document.querySelector('.reactor-container');

    if (reactor) {
        // 1. Setup Canvas Overlay
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        let width, height;
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // 2. Particle System
        const particles = [];
        let isHovering = false;
        let hue = 0;

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                // Explosion velocity (Random direction, high speed)
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 10 + 5; // Fast burst
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;

                this.life = 1.0;
                this.decay = Math.random() * 0.02 + 0.01;
                this.size = Math.random() * 3 + 1;
                this.color = Math.random() > 0.5 ? '#00a2ffff' : '#da1212ff'; // Red or White
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.96; // Friction
                this.vy *= 0.96;
                this.life -= this.decay;
            }

            draw(ctx) {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        // 3. Animation Loop
        const loop = () => {
            ctx.clearRect(0, 0, width, height);

            // Spawn particles if hovering
            if (isHovering) {
                const rect = reactor.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Spawn multiple particles per frame for "Storm" effect
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(centerX, centerY));
                }
            }

            // Update & Draw
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(loop);
        };
        loop();

        // 4. Interaction Triggers
        reactor.addEventListener('mouseenter', () => isHovering = true);
        reactor.addEventListener('mouseleave', () => isHovering = false);

        // Mobile Touch Support
        reactor.addEventListener('touchstart', () => isHovering = true, { passive: true });
        reactor.addEventListener('touchend', () => isHovering = false);
    }
});