document.addEventListener('DOMContentLoaded', () => {
    
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
});