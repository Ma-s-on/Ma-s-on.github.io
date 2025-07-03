// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Advanced 3D Scene Setup
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;

// Initialize Three.js Scene
const initThreeJS = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
        
        // Red color variations
        colors.push(1, Math.random() * 0.5 + 0.2, Math.random() * 0.3);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 500;
    
    const hero = document.querySelector('section');
    if (hero) {
        hero.style.position = 'relative';
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.pointerEvents = 'none';
        hero.insertBefore(renderer.domElement, hero.firstChild);
    }
    
    animate3D();
};

// 3D Animation Loop
const animate3D = () => {
    requestAnimationFrame(animate3D);
    
    // Mouse interaction
    const targetX = mouseX * 0.001;
    const targetY = mouseY * 0.001;
    
    particles.rotation.x += (targetY - particles.rotation.x) * 0.05;
    particles.rotation.y += (targetX - particles.rotation.y) * 0.05;
    
    // Continuous rotation
    particles.rotation.z += 0.0005;
    
    // Breathing effect
    const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
    particles.scale.set(scale, scale, scale);
    
    camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
};

// Matrix Rain Effect
const createMatrixRain = () => {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-background';
    document.body.appendChild(matrixContainer);
    
    const createRainDrop = () => {
        const drop = document.createElement('div');
        drop.className = 'matrix-rain';
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        matrixContainer.appendChild(drop);
        
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 5000);
    };
    
    setInterval(createRainDrop, 300);
};

// Enhanced Loading Screen
const createLoadingScreen = () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="terminal-font text-white mt-4">
            <span class="text-[#FF3333]">$</span> Initializing Mason.exe
            <span class="loading-dots"></span>
        </div>
    `;
    document.body.appendChild(loadingScreen);
    
    // Animate loading screen out
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => {
                loadingScreen.remove();
                initializeMainAnimations();
            }
        });
    }, 2000);
};

// Enhanced Scroll Progress Indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.background = 'linear-gradient(90deg, #FF3333, #FF6666)';
    progressBar.style.boxShadow = '0 0 10px rgba(255, 51, 51, 0.5)';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Add glow effect based on scroll
        const glowIntensity = Math.min(progress / 50, 1);
        progressBar.style.filter = `drop-shadow(0 0 ${10 * glowIntensity}px rgba(255, 51, 51, 0.8))`;
    });
};

// Advanced Parallax Effect
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
            },
            rotateX: 5,
            rotateY: 5,
            ease: 'none'
        });
    });
};

// Enhanced Typing Effect with Sound Simulation
const typeWriter = (element, text, speed = 50) => {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                
                // Add typing sound effect simulation
                if (Math.random() > 0.7) {
                    element.style.textShadow = '0 0 20px rgba(255, 51, 51, 1)';
                    setTimeout(() => {
                        element.style.textShadow = '0 0 10px rgba(255, 51, 51, 0.5)';
                    }, 50);
                }
                
                i++;
                setTimeout(type, speed + Math.random() * 50);
            } else {
                resolve();
            }
        };
        
        type();
    });
};

// Interactive Terminal Simulation
const initInteractiveTerminal = () => {
    const terminalWindows = document.querySelectorAll('.terminal-window');
    
    terminalWindows.forEach(terminal => {
        const lines = terminal.querySelectorAll('.terminal-line');
        
        terminal.addEventListener('mouseenter', () => {
            lines.forEach((line, index) => {
                gsap.to(line, {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            });
            
            // Add data stream effects
            createDataStreams(terminal);
        });
    });
};

// Create Data Stream Effects
const createDataStreams = (container) => {
    for (let i = 0; i < 3; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.top = Math.random() * 100 + '%';
        stream.style.animationDelay = i * 0.5 + 's';
        container.appendChild(stream);
        
        setTimeout(() => {
            if (stream.parentNode) {
                stream.parentNode.removeChild(stream);
            }
        }, 4000);
    }
};

// Enhanced Card Animations
const initCardAnimations = () => {
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        // 3D hover effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
};

// Morphing Logo Animation
const initMorphingLogo = () => {
    const logo = document.querySelector('.logo-container');
    if (!logo) return;
    
    logo.addEventListener('click', () => {
        gsap.timeline()
            .to('.logo-square', {
                rotation: 360,
                scale: 1.5,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            })
            .to('.logo-square', {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                stagger: -0.1,
                ease: 'power4.out'
            });
    });
};

// Enhanced Skill Icons with Orbital Animation
const initSkillOrbitals = () => {
    const skillIcons = document.querySelectorAll('#skills .grid > div');
    
    skillIcons.forEach((skill, index) => {
        skill.addEventListener('mouseenter', () => {
            // Create orbital particles
            const particles = [];
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = '#FF3333';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '-1';
                skill.appendChild(particle);
                particles.push(particle);
                
                gsap.to(particle, {
                    rotation: 360,
                    repeat: -1,
                    duration: 2,
                    ease: 'none',
                    transformOrigin: `30px 30px`,
                    delay: i * 0.2
                });
            }
            
            setTimeout(() => {
                particles.forEach(p => p.remove());
            }, 3000);
        });
    });
};

// Dynamic Background Pattern
const createDynamicBackground = () => {
    const bg = document.querySelector('.grid-background');
    if (!bg) return;
    
    setInterval(() => {
        const intensity = Math.random() * 0.3 + 0.2;
        bg.style.opacity = intensity;
        
        const hue = Math.random() * 30;
        bg.style.filter = `hue-rotate(${hue}deg) brightness(${1 + Math.random() * 0.5})`;
    }, 2000);
};

// Enhanced Navigation with Magnetic Effect
const initMagneticNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(link, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
};

// Quantum Text Effect
const initQuantumText = () => {
    const quantumElements = document.querySelectorAll('.gradient-text');
    
    quantumElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        setInterval(() => {
            if (Math.random() > 0.95) {
                element.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
                setTimeout(() => {
                    element.style.filter = 'none';
                }, 200);
            }
        }, 100);
    });
};

// Particle Cursor Trail
const initParticleCursor = () => {
    const particles = [];
    
    document.addEventListener('mousemove', (e) => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#FF3333';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '0.8';
        document.body.appendChild(particle);
        
        gsap.to(particle, {
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    });
};

// Initialize all main animations
const initializeMainAnimations = () => {
    // Hero section entrance
    gsap.timeline()
        .from('.hero-section h1', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        })
        .from('.hero-section p', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.8')
        .from('.hero-section .flex', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out'
        }, '-=0.6');
    
    // Scroll-triggered animations
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out'
        });
    });
    
    // Initialize all interactive features
    initCardAnimations();
    initMorphingLogo();
    initSkillOrbitals();
    initMagneticNavigation();
    initQuantumText();
    initParticleCursor();
    initInteractiveTerminal();
};

// Advanced mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
});

// Resize handler for Three.js
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createLoadingScreen();
    createScrollProgress();
    createMatrixRain();
    createDynamicBackground();
    initThreeJS();
    initParallax();
    
    // Terminal typing animation for about section
    const terminalCode = document.querySelector('.typing-effect');
    if (terminalCode) {
        ScrollTrigger.create({
            trigger: terminalCode,
            start: 'top center',
            onEnter: () => {
                terminalCode.style.opacity = '1';
                const lines = terminalCode.innerHTML.split('\n');
                let delay = 0;
                lines.forEach((line, i) => {
                    setTimeout(() => {
                        const span = document.createElement('span');
                        span.innerHTML = line;
                        terminalCode.appendChild(span);
                    }, delay);
                    delay += 100;
                });
            }
        });
    }
    
    // Initialize terminal when it comes into view
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initializeTerminal();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(terminalWindow);
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: target,
                    ease: 'power4.inOut'
                });
            }
        });
    });
});

// Terminal animation function
function initializeTerminal() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    terminalLines.forEach(line => {
        const delay = parseInt(line.getAttribute('data-delay'));
        setTimeout(() => {
            line.classList.add('visible');
            
            // If line contains a command, animate it
            const command = line.querySelector('.terminal-command');
            if (command) {
                const text = command.textContent;
                typeWriter(command, text, 75);
            }
        }, delay);
    });
}

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