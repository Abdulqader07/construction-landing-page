// =========================================
// 1. LANGUAGE PERSISTENCE & TOGGLE
// =========================================
let currentLang = localStorage.getItem('siteLang') || 'en';

// Apply the saved language immediately when the page loads
function applyLanguage(lang) {
    const body = document.body;
    
    if (lang === 'ar') {
        body.classList.add('rtl');
        document.documentElement.setAttribute('dir', 'rtl'); 
    } else {
        body.classList.remove('rtl');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${lang}`);
    });
    
    currentLang = lang;
    
    // Make the body visible now that language is set
    document.body.classList.add('loaded'); 
}

// Initialize language on page load
applyLanguage(currentLang);

// Toggle function for the button
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('siteLang', newLang); // Save to browser storage
    applyLanguage(newLang);
}


// =========================================
// 2. SCROLL REVEAL ANIMATIONS
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
// 3. MOBILE MENU TOGGLE
// =========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});


// =========================================
// 4. LIGHTBOX GALLERY LOGIC (UPDATED FOR VILLAS)
// =========================================
const projectGalleries = {
    'building': [
        'images/building(cover).webp',
        'images/building2.webp',
        'images/building3.webp',
        'images/building4.webp'
    ],
    'hospital': [
        'images/hospital(cover).jpg',
        'images/hospital2.webp',
        'images/hospital3.webp',
        'images/hospital4.webp'
    ],
    'something': [
        'images/something(cover).webp',
        'images/something2.webp',
        'images/something3.webp',
        'images/something4.webp'
    ],
    'construction': [
        'images/construction(cover).webp',
        'images/construction2.webp'
    ],
    'mosque': [
        'images/mosque(cover).webp',
        'images/mosque2.webp',
        'images/mosque3.webp'
    ],
    'towerAhmad': [
        'images/tower(Ahmad).webp'
    ],
    'villas': [
        'images/villas(cover).webp',
        'images/villas2.webp',
        'images/villas3.webp' // Stopped at 3
    ],
    'living': [
        'images/living(cover).webp',
        'images/living2.webp',
        'images/living3.webp',
        'images/living4.webp',
        'images/living5.webp'
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