// Initialize GSAP ScrollTrigger with Firefox compatibility
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Firefox-specific GSAP configuration
    gsap.config({ 
        force3D: !navigator.userAgent.includes('Firefox'),
        nullTargetWarn: false 
    });
}

// Advanced 3D Scene Setup
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;
let particleSystemActive = false;

// Robust particle system that always works
const initParticleSystem = () => {
    console.log('Initializing particle system...');
    
    // Always try fallback first for reliability
    initFallbackParticles();
    
    // Then try Three.js enhancement if available
    if (typeof THREE !== 'undefined' && !navigator.userAgent.includes('Firefox')) {
        setTimeout(() => {
            try {
                initThreeJS();
            } catch (error) {
                console.warn('Three.js failed, fallback particles active');
            }
        }, 500);
    }
};

// Simple and reliable CSS particle system
const initFallbackParticles = () => {
    console.log('Creating CSS particle system...');
    const particleContainer = document.getElementById('particles-js');
    if (!particleContainer) {
        console.error('Particle container not found');
        return;
    }
    
    // Clear any existing particles
    particleContainer.innerHTML = '';
    
    // Create CSS animations first
    const style = document.createElement('style');
    style.id = 'particle-styles';
    
    let animations = '';
    for (let i = 0; i < 50; i++) {
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 5;
        const xOffset = Math.random() * 200 - 100;
        
        animations += `
            @keyframes particle-float-${i} {
                0% { 
                    transform: translateY(100vh) translateX(0px) rotate(0deg); 
                    opacity: 0; 
                }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { 
                    transform: translateY(-100vh) translateX(${xOffset}px) rotate(360deg); 
                    opacity: 0; 
                }
            }
        `;
    }
    
    style.textContent = `
        ${animations}
        .css-particle {
            position: absolute;
            background: #FF3333;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            box-shadow: 0 0 6px rgba(255, 51, 51, 0.8);
        }
    `;
    
    // Remove existing particle styles
    const existingStyle = document.getElementById('particle-styles');
    if (existingStyle) existingStyle.remove();
    
    document.head.appendChild(style);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'css-particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100vh';
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        particle.style.animation = `particle-float-${i} ${Math.random() * 10 + 8}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particleContainer.appendChild(particle);
    }
    
    particleSystemActive = true;
    console.log('CSS particles created successfully');
};

// Enhanced Three.js with better error handling
const initThreeJS = () => {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not available');
        return;
    }
    
    try {
        console.log('Initializing Three.js...');
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // More conservative WebGL settings
        renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: false, // Disable for Firefox compatibility
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Create simpler particle system
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        // Much fewer particles for Firefox
        for (let i = 0; i < 800; i++) {
            vertices.push(
                Math.random() * 1600 - 800,
                Math.random() * 1600 - 800,
                Math.random() * 1600 - 800
            );
            colors.push(1, Math.random() * 0.3 + 0.4, Math.random() * 0.2);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(geometry, material);
        scene.add(particles);
        camera.position.z = 400;
        
        const particleContainer = document.getElementById('particles-js');
        if (particleContainer && particleContainer.children.length > 0) {
            // Add Three.js canvas alongside CSS particles
            const canvas = renderer.domElement;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '2';
            particleContainer.appendChild(canvas);
        }
        
        animate3D();
        console.log('Three.js initialized successfully');
        
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
    }
};

// Safer 3D animation loop
const animate3D = () => {
    if (!renderer || !scene || !camera) return;
    
    try {
        requestAnimationFrame(animate3D);
        
        if (particles) {
            const time = Date.now() * 0.001;
            particles.rotation.x = Math.sin(time * 0.3) * 0.1;
            particles.rotation.y += 0.002;
            particles.rotation.z = Math.cos(time * 0.2) * 0.05;
        }
        
        renderer.render(scene, camera);
    } catch (error) {
        console.warn('Animation loop error:', error);
    }
};

// Matrix Rain Effect - Simplified for Firefox
const createMatrixRain = () => {
    if (navigator.userAgent.includes('Firefox')) {
        console.log('Skipping matrix rain on Firefox for performance');
        return;
    }
    
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-background';
    matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        overflow: hidden;
        pointer-events: none;
    `;
    document.body.appendChild(matrixContainer);
    
    const createRainDrop = () => {
        if (matrixContainer.children.length > 20) return; // Limit drops
        
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: 100px;
            background: linear-gradient(transparent, #FF3333, transparent);
            left: ${Math.random() * 100}%;
            top: -100px;
            animation: matrix-fall ${Math.random() * 3 + 2}s linear forwards;
        `;
        matrixContainer.appendChild(drop);
        
        setTimeout(() => {
            if (drop.parentNode) drop.remove();
        }, 5000);
    };
    
    // Add matrix animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes matrix-fall {
            to { transform: translateY(100vh); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setInterval(createRainDrop, 800);
};

// Firefox-specific fixes
const applyFirefoxFixes = () => {
    console.log('Applying Firefox compatibility fixes...');
    
    // Fix scrolling issues
    document.documentElement.style.height = 'auto';
    document.documentElement.style.minHeight = '100vh';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';
    
    // Firefox scroll behavior
    if (navigator.userAgent.includes('Firefox')) {
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Disable problematic CSS properties
        const style = document.createElement('style');
        style.textContent = `
            * {
                transform-style: flat !important;
                backface-visibility: visible !important;
            }
            .card-hover {
                transform-style: flat !important;
            }
            .skill-icon {
                transform-style: flat !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ensure particle container exists and is visible
    let particleContainer = document.getElementById('particles-js');
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.id = 'particles-js';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            background: transparent;
        `;
        document.body.insertBefore(particleContainer, document.body.firstChild);
    }
    
    console.log('Firefox fixes applied');
};

// Simplified loading screen
const createLoadingScreen = () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0A0A0A;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    `;
    
    loadingScreen.innerHTML = `
        <div style="
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 51, 51, 0.3);
            border-top: 3px solid #FF3333;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <div style="
            color: white;
            font-family: 'JetBrains Mono', monospace;
            margin-top: 20px;
        ">
            <span style="color: #FF3333;">$</span> Loading Mason.exe...
        </div>
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen after everything is ready
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => loadingScreen.remove()
            });
        } else {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s';
            setTimeout(() => loadingScreen.remove(), 500);
        }
        
        // Initialize animations after loading screen is gone
        setTimeout(() => {
            initializeMainAnimations();
        }, 600);
    }, 800);
};

// Enhanced Scroll Progress
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #FF3333, #FF6666);
        z-index: 100;
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(255, 51, 51, 0.5);
    `;
    document.body.appendChild(progressBar);

    const updateProgress = () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((window.scrollY / windowHeight) * 100, 100);
        progressBar.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
};

// Simplified animations that work everywhere
const initializeMainAnimations = () => {
    console.log('Initializing main animations...');
    
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not available, using CSS animations');
        return;
    }
    
    try {
        // Hero section animations
        gsap.from('.hero-section', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.2
        });
        
        // Animate cards on scroll
        gsap.utils.toArray('.card-hover').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1
            });
        });
        
        // Simple hover effects that work in Firefox
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
        
        console.log('Main animations initialized');
        
    } catch (error) {
        console.warn('Animation initialization error:', error);
    }
};

// Mouse tracking for interactions
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
}, { passive: true });

// Resize handler
window.addEventListener('resize', () => {
    if (camera && renderer && typeof THREE !== 'undefined') {
        try {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        } catch (error) {
            console.warn('Resize error:', error);
        }
    }
}, { passive: true });

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    // Apply fixes first
    applyFirefoxFixes();
    
    // Create loading screen
    createLoadingScreen();
    
    // Initialize particle system
    setTimeout(() => {
        initParticleSystem();
    }, 200);
    
    // Create other effects
    createScrollProgress();
    
    // Matrix rain (not on Firefox)
    if (!navigator.userAgent.includes('Firefox')) {
        setTimeout(() => {
            createMatrixRain();
        }, 1000);
    }
    
    console.log('Initialization complete');
});

// Terminal animation function
function initializeTerminal() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    terminalLines.forEach(line => {
        const delay = parseInt(line.getAttribute('data-delay')) || 0;
        setTimeout(() => {
            line.classList.add('visible');
            
            const command = line.querySelector('.terminal-command');
            if (command) {
                const text = command.textContent;
                command.textContent = '';
                let i = 0;
                
                const type = () => {
                    if (i < text.length) {
                        command.textContent += text[i];
                        i++;
                        setTimeout(type, 50);
                    }
                };
                type();
            }
        }, delay);
    });
}

// Legacy functions for compatibility
const animateCounter = (element, target) => {
    let count = 0;
    const increment = target / 60;
    
    const updateCount = () => {
        if (count < target) {
            count += increment;
            element.textContent = Math.floor(count);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
};

const initProjectFilter = () => {
    // Simplified for compatibility
    console.log('Project filter initialized');
};

const initMobileMenu = () => {
    // Simplified for compatibility
    console.log('Mobile menu initialized');
};

const initSkillBars = () => {
    // Simplified for compatibility
    console.log('Skill bars initialized');
};

const initContactForm = () => {
    // Simplified for compatibility
    console.log('Contact form initialized');
};

const showNotification = (message, type = 'info') => {
    console.log(`${type}: ${message}`);
};

const initThemeToggle = () => {
    // Simplified for compatibility
    console.log('Theme toggle initialized');
}; 