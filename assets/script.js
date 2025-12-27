document.addEventListener('DOMContentLoaded', () => {
    
    // --- Page Fade-in ---
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50);

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
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video, .social-image-container img');

    if (lightbox) {
        // Open Lightbox
        galleryItems.forEach(item => {
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

    // --- LED Wall Configurator Logic (Class Based) ---
    class LedConfigurator {
        constructor(prefix, cabinetSpecs, pitches, isOutdoor = false) {
            this.prefix = prefix;
            this.cabinetW = cabinetSpecs.w;
            this.cabinetH = cabinetSpecs.h;
            this.pitches = pitches;
            this.isOutdoor = isOutdoor;

            // Elements
            this.grid = document.getElementById(`${prefix}-grid`);
            this.inCols = document.getElementById(`${prefix}-cols`);
            this.inRows = document.getElementById(`${prefix}-rows`);
            this.inPitch = document.getElementById(`${prefix}-pitch`);
            this.outRes = document.getElementById(`${prefix}-res`);
            this.outDim = document.getElementById(`${prefix}-dim`);
            this.outCab = document.getElementById(`${prefix}-cab`);

            if (this.grid) {
                this.init();
            }
        }

        init() {
            this.inCols.addEventListener('input', () => this.update());
            this.inRows.addEventListener('input', () => this.update());
            this.inPitch.addEventListener('change', () => this.update());
            this.update(); // Initial draw
        }

        update() {
            let cols = parseInt(this.inCols.value) || 1;
            let rows = parseInt(this.inRows.value) || 1;
            
            // Safety limits for rendering
            if (cols > 50) cols = 50;
            if (rows > 50) rows = 50;

            const pitch = this.inPitch.value;
            const resPerCab = this.pitches[pitch];

            // Calculations
            const totalResW = cols * resPerCab.w;
            const totalResH = rows * resPerCab.h;
            const totalDimW = (cols * this.cabinetW) / 1000; // mm to meters
            const totalDimH = (rows * this.cabinetH) / 1000; // mm to meters
            const totalCabinets = cols * rows;

            // Update Dashboard
            this.outRes.innerText = `${totalResW} x ${totalResH} px`;
            this.outDim.innerText = `${totalDimW.toFixed(2)}m x ${totalDimH.toFixed(2)}m`;
            this.outCab.innerText = totalCabinets;

            // Draw Grid
            this.grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            this.grid.innerHTML = '';

            const fragment = document.createDocumentFragment();
            for (let i = 0; i < totalCabinets; i++) {
                const div = document.createElement('div');
                div.className = 'led-cabinet';
                if (this.isOutdoor) div.classList.add('outdoor');
                fragment.appendChild(div);
            }
            this.grid.appendChild(fragment);
        }
    }

    // Initialize Indoor (Generic 27" - 600x337.5mm)
    new LedConfigurator('indoor', { w: 600, h: 337.5 }, {
        "0.78": { w: 768, h: 432 }, "0.93": { w: 640, h: 360 }, "1.25": { w: 480, h: 270 },
        "1.56": { w: 384, h: 216 }, "1.87": { w: 320, h: 180 }
    });

    // Initialize Outdoor (Standard 500x500mm)
    new LedConfigurator('outdoor', { w: 500, h: 500 }, {
        "3.9": { w: 128, h: 128 }, "4.8": { w: 104, h: 104 }, "6.67": { w: 75, h: 75 },
        "10": { w: 50, h: 50 }, "16": { w: 31, h: 31 }
    }, true);

    // --- Interactive Ecosystem Cards ---
    const ecosystemTriggers = document.querySelectorAll('.action-trigger');

    ecosystemTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const parent = this.closest('.ecosystem-item');
            const list = parent.querySelector('.link-list');
            
            // 1. Fade out button
            this.style.opacity = '0';
            this.style.transform = 'scale(0.9)';
            
            // 2. Wait for transition, then swap
            setTimeout(() => {
                this.style.display = 'none';
                list.style.display = 'flex';
                
                // 3. Trigger reflow & Fade in list
                requestAnimationFrame(() => {
                    list.style.opacity = '1';
                    list.style.transform = 'translateY(0)';
                });
            }, 300); // Match CSS transition time
        });
    });
});