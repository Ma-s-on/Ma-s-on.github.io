// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Scroll Progress Indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
};

// Parallax Effect
const initParallax = () => {
    document.querySelectorAll('.parallax').forEach(element => {
        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: (i, target) => {
                return (ScrollTrigger.maxScroll(window) - target.offsetTop) * 0.1;
            }
        });
    });
};

// Animated Counter
const animateCounter = (element, target) => {
    let count = 0;
    const speed = 2000 / target; // 2 seconds duration

    const updateCount = () => {
        if (count < target) {
            count++;
            element.textContent = count;
            requestAnimationFrame(updateCount);
        }
    };

    updateCount();
};

// Typing Effect
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// Project Filter
const initProjectFilter = () => {
    const filters = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.dataset.filter;

            // Update active filter
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            // Filter projects
            projects.forEach(project => {
                const projectCategory = project.dataset.category;
                if (category === 'all' || category === projectCategory) {
                    gsap.to(project, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(project, {
                        opacity: 0.3,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
};

// Mobile Menu
const initMobileMenu = () => {
    const menuButton = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    let isOpen = false;

    menuButton?.addEventListener('click', () => {
        isOpen = !isOpen;
        menu.classList.toggle('mobile-menu-enter');
        menu.classList.toggle('mobile-menu-enter-active');
        
        // Animate hamburger icon
        menuButton.classList.toggle('is-active');
    });
};

// Skill Progress Bars
const initSkillBars = () => {
    document.querySelectorAll('.skill-progress').forEach(progress => {
        const percentage = progress.dataset.progress;
        
        gsap.to(progress, {
            scrollTrigger: {
                trigger: progress,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            width: `${percentage}%`,
            duration: 1.5,
            ease: 'power4.out'
        });
    });
};

// Contact Form Validation
const initContactForm = () => {
    const form = document.querySelector('#contact-form');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple validation
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Submit form (replace with your form handling logic)
        showNotification('Message sent successfully!', 'success');
        form.reset();
    });
};

// Notification System
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    gsap.to(notification, {
        opacity: 1,
        y: 20,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => notification.remove()
        });
    }, 3000);
};

// Theme Toggle
const initThemeToggle = () => {
    const toggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (isDark) => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDark.matches);
    }
    
    toggle?.addEventListener('click', () => {
        setTheme(!document.documentElement.classList.contains('dark'));
    });
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    initParallax();
    initProjectFilter();
    initMobileMenu();
    initSkillBars();
    initContactForm();
    initThemeToggle();
    
    // Animate hero text
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        typeWriter(heroText, 'Building Digital Experiences');
    }
    
    // Initialize counters
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        animateCounter(counter, target);
    });
}); 