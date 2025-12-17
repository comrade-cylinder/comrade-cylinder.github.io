const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    if (isOpen) {
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);

    }
    else {
        document.removeEventListener('click', handleOutsideClick);
    }
});

const menuClose = document.getElementById('menu-close');

menuClose.addEventListener('click', () => {
    navMenu.classList.remove('open');
    document.removeEventListener('click', handleOutsideClick)
});

//this function handles clicks outside of the menu 
function handleOutsideClick (event) {
    if (!event.target.closest('#nav-menu')) {
        navMenu.classList.remove('open');
        document.removeEventListener('click', handleOutsideClick); //evenetlistener cleanup
    }
}

const sealLink = document.getElementById('seal-link');
const footerEgg = document.getElementById('footer-egg');
const gif = document.getElementById('seal-gif');
const sealMsg = document.getElementById('seal-msg');
let sealTimeout;
let msgTimeout;

function triggerSeal() {
    clearTimeout(sealTimeout);
    clearTimeout(msgTimeout);
    gif.style.opacity= '1';
    if (sealMsg) {
        sealMsg.classList.add('show');
    }
    confetti ({
        particleCount: 50,
        spread: 60,
        origin: {x: 0.5, y: 0.5},
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    });
    sealTimeout = setTimeout(() => {
        gif.style.opacity = '0';
    }, 4000);
    msgTimeout = setTimeout(() => {
        if (sealMsg) sealMsg.classList.remove('show');
    }, 3000);
}

if (sealLink) {
    sealLink.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSeal();
    });
}

if (footerEgg) {
    footerEgg.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSeal();
    });
}

// Smooth scroll for desktop nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Parallax for gradient background layers on body
// Layer order in CSS: [0] noise, [1] indigo, [2] teal, [3] amber, [4] pink, [5] linear base
// We move only the radial glow layers for subtle depth.
(function initGradientParallax() {
    const speeds = [0, 0.15, 0.25, 0.35, 0.5, 0];
    let ticking = false;

    function setPositions(y) {
        const p0 = '0 0';
        const p1 = `center ${Math.round(-y * speeds[1])}px`;
        const p2 = `center ${Math.round(-y * speeds[2])}px`;
        const p3 = `center ${Math.round(-y * speeds[3])}px`;
        const p4 = `center ${Math.round(-y * speeds[4])}px`;
        const p5 = 'center 0px';
        document.body.style.backgroundPosition = `${p0}, ${p1}, ${p2}, ${p3}, ${p4}, ${p5}`;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                setPositions(window.scrollY);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    setPositions(window.scrollY || 0);
})();

// Fireflies background animation (behind glass)
(function initFireflies() {
    const canvas = document.getElementById('fireflies');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    let w = 0, h = 0, fireflies = [], rafId = null;

    function resize() {
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        canvas.width = w * DPR;
        canvas.height = h * DPR;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function makeFireflies(count) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: 1.2 + Math.random() * 2.0,
                hue: 45 + Math.random() * 60, // warm yellow to lime
                phase: Math.random() * Math.PI * 2,
                flicker: 0.8 + Math.random() * 0.6,
            });
        }
        return arr;
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        for (const f of fireflies) {
            // Update position
            f.x += f.vx;
            f.y += f.vy;

            // Gentle steering
            f.vx += (Math.random() - 0.5) * 0.01;
            f.vy += (Math.random() - 0.5) * 0.01;

            // Limit speed
            const speed = Math.hypot(f.vx, f.vy);
            const maxSpeed = 0.35;
            if (speed > maxSpeed) {
                f.vx = (f.vx / speed) * maxSpeed;
                f.vy = (f.vy / speed) * maxSpeed;
            }

            // Wrap around edges
            if (f.x < -10) f.x = w + 10;
            if (f.x > w + 10) f.x = -10;
            if (f.y < -10) f.y = h + 10;
            if (f.y > h + 10) f.y = -10;

            // Flicker alpha between 0.2 and 1.0
            f.phase += 0.02 + Math.random() * 0.02;
            const a = (Math.sin(f.phase) * 0.4 + 0.6) * f.flicker; // 0.2..1.0 approx

            // Radial glow
            const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 10);
            g.addColorStop(0, `hsla(${f.hue} 90% 70% / ${Math.min(1, a)})`);
            g.addColorStop(0.3, `hsla(${f.hue} 90% 60% / ${Math.min(0.6, a)})`);
            g.addColorStop(1, `hsla(${f.hue} 90% 50% / 0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * 10, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        rafId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        fireflies = makeFireflies(prefersReduced ? 12 : 28);
        if (!prefersReduced) {
            draw();
        } else {
            // Draw a static frame for reduced motion users
            ctx.clearRect(0, 0, w, h);
            for (const f of fireflies) {
                const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 10);
                g.addColorStop(0, `hsla(${f.hue} 90% 70% / 0.6)`);
                g.addColorStop(1, `hsla(${f.hue} 90% 50% / 0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r * 10, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    function stop() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    window.addEventListener('resize', () => {
        resize();
    });

    start();
})();

