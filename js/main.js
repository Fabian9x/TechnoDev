document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent background scrolling
        });
    }

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // approximate navbar height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations (fade-in-up effect)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animatedElements = document.querySelectorAll('.fade-in-up');

    if (prefersReducedMotion) {
        animatedElements.forEach(el => el.classList.add('appear'));
    } else {
        const observer = new IntersectionObserver((entries, animationObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = Number.parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                    window.setTimeout(() => entry.target.classList.add('appear'), delay);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // Keep the floating contact action discreet while visitors explore the portfolio.
    const portfolio = document.getElementById('portafolio');
    if (portfolio) {
        const portfolioObserver = new IntersectionObserver(entries => {
            document.body.classList.toggle('portfolio-active', entries[0].isIntersecting);
        }, { threshold: 0.12 });
        portfolioObserver.observe(portfolio);
    }

    // Load the three full case-study screenshots only when the dialog is opened.
    const hydrateCollage = collage => {
        collage.querySelectorAll('[data-collage-src]').forEach(image => {
            if (image.src) return;

            image.addEventListener('load', () => image.classList.add('is-loaded'), { once: true });
            image.src = image.dataset.collageSrc;
            if (image.complete) image.classList.add('is-loaded');
        });
    };

    // Accessible native case-study dialogs.
    const caseOpeners = document.querySelectorAll('[data-case-open]');
    const caseDialogs = document.querySelectorAll('.case-dialog');

    caseOpeners.forEach(opener => {
        opener.addEventListener('click', () => {
            const dialog = document.getElementById(opener.dataset.caseOpen);
            if (dialog instanceof HTMLDialogElement) {
                const collage = dialog.querySelector('[data-case-collage]');
                if (collage) hydrateCollage(collage);
                dialog.showModal();
                document.body.classList.add('dialog-open');
            }
        });
    });

    caseDialogs.forEach(dialog => {
        const closeDialog = () => {
            dialog.close();
            document.body.classList.remove('dialog-open');
        };

        dialog.querySelector('[data-case-close]')?.addEventListener('click', closeDialog);
        dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
        dialog.addEventListener('click', event => {
            if (event.target === dialog) closeDialog();
        });
    });
});
