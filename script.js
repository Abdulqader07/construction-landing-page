// =========================================
// 1. SCROLL REVEAL ANIMATIONS
// =========================================
const revealElements = document.querySelectorAll('.reveal, .reveal-img');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));


// =========================================
// 2. LANGUAGE TOGGLE
// =========================================
let currentLang = 'en';

function toggleLanguage() {
    const body = document.body;
    
    if (currentLang === 'en') {
        currentLang = 'ar';
        body.classList.add('rtl');
        document.documentElement.setAttribute('dir', 'rtl'); 
    } else {
        currentLang = 'en';
        body.classList.remove('rtl');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${currentLang}`);
    });
}


// =========================================
// 3. MOBILE MENU TOGGLE
// =========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});


// =========================================
// 4. LIGHTBOX GALLERY LOGIC
// =========================================
const projectGalleries = {
    'bighouse': [
        'images/bighouse.jpeg',
        'images/bighouse2.jpeg',
        'images/bighouse3.jpeg'
    ],
    'villa': [
        'images/villa.jpeg',
        'images/villa2.jpeg',
        'images/villa3.jpeg',
        'images/villa4.jpeg',
        'images/villa5.jpeg'
    ],
    'house': [
        'images/house1.jpeg',
        'images/house2.jpeg'
    ],
    'parking': [
        'images/parking.jpeg',
        'images/parking2.jpeg'
    ]
};

let currentGallery = [];
let currentImageIndex = 0;

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const thumbnailsContainer = document.getElementById('lightbox-thumbnails');

function openLightbox(projectId) {
    currentGallery = projectGalleries[projectId];
    if (!currentGallery) return;
    
    currentImageIndex = 0;
    updateLightboxImage();
    buildThumbnails();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const imgSrc = currentGallery[currentImageIndex];
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = imgSrc;
        lightboxImg.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop';
        };
        lightboxImg.style.opacity = '1';
    }, 150);
    
    const thumbs = thumbnailsContainer.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            thumb.classList.remove('active');
        }
    });
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex >= currentGallery.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = currentGallery.length - 1;
    }
    updateLightboxImage();
}

function buildThumbnails() {
    thumbnailsContainer.innerHTML = '';
    currentGallery.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=200&auto=format&fit=crop';
        };
        img.classList.add('lightbox-thumb');
        if (index === 0) img.classList.add('active');
        img.onclick = () => {
            currentImageIndex = index;
            updateLightboxImage();
        };
        thumbnailsContainer.appendChild(img);
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') changeImage(1);
    if (e.key === 'ArrowLeft') changeImage(-1);
});

// Close on click outside
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});