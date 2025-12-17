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

