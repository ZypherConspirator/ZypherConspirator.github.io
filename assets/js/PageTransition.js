var jumbotron = null;
var bgBack = null;
var bgFront = null;
var contentArea = null;
var nav = null;
let isAnimating = false;

// Helper to check current path
const checkIsHome = (path) => path === "/" || path === "/index.html" || path === "";
const checkIsResume = (path) => path === "/resume" || path === "/resume.html" || path === "/resume/" || path === "resume";
const getPageType = (path) => {
if (checkIsHome(path)) {return 'home';}
else if (checkIsResume(path)) {return 'resume';}
else {return 'other';}
};


// --- 1. FIRST ENTRY LOGIC ---
const runEntryAnimation = () => {
    const PageType = getPageType(window.location.pathname);
    console.log(window.location.pathname);
    // A. Set initial Nav state before animation starts
    if (PageType === 'other'){
        nav.classList.remove('nav-hidden');
    }  
    else {
        nav.classList.add('nav-hidden');
    }
    
    // B. Wipe Background
    setTimeout(() => bgFront.classList.add('reveal'), 100);
    
    // C. Unsqueeze Jumbotron
    setTimeout(() => jumbotron.classList.add('visible'), 400);

    // D. Details Fade In
    setTimeout(() => {
        nav.classList.remove('opacity-0');
        const details = document.querySelector('.details-wrapper');
        if (details) details.classList.add('active');
        // Sync background layers
        setTimeout(() => {
            if (bgBack && bgFront) bgBack.src = bgFront.src;
        }, 800);
    }, 900);
};



// --- Update Active Nav Links ---
const updateActiveNav = (newUrl) => {
    const currentPath = new URL(newUrl).pathname;
    const navLinks = document.querySelectorAll('#globalNav .nav-item');

    navLinks.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;

        const linkPath = new URL(link.href, window.location.origin).pathname;

        // 1. Handle the Home link (exact match only so it doesn't highlight everything)
        if (linkPath === "/") {
            if (currentPath === "/") item.classList.add('active');
            else item.classList.remove('active');
            return;
        }

        // 2. Handle Sub-pages (check if currentPath starts with linkPath)
        // Example: if link is /notes and path is /notes/page1, it matches.
        if (currentPath.startsWith(linkPath)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};

// --- Image Preloader ---
const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) return resolve(); // Skip if no image
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to avoid hanging the UI on 404s
    });
};

// --- THE CROSS-WIPE TRANSITION ---
const handleTransition = async (url, pushToHistory = true) => {
    isAnimating = true;
    const currentDetails = document.querySelector('.details-wrapper');
    const targetUrl = new URL(url);
    const pageType = getPageType(targetUrl.pathname);

    // EXIT: Move details down
    if (currentDetails) {
        currentDetails.classList.remove('active');
        currentDetails.classList.add('exit');
    }

    // Handle Nav Fade OUT if going home
    if (pageType === 'home') {
        nav.classList.add('nav-hidden');
    }
    else if (pageType === 'resume') {
        nav.classList.add('nav-hidden');
        jumbotron.classList.add('page');
    }


    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        const newDetailsHTML = newDoc.querySelector('#jumbotronContent').innerHTML;
        const newBgSrc = newDoc.querySelector('.bg-front')?.src;

        // Await new BG
        if (newBgSrc) {
            await preloadImage(newBgSrc);
        }
        bgFront.style.transition = '0s';
        bgFront.classList.remove('reveal');
        bgFront.src = newBgSrc || "svg/error.svg";
        
// Trigger the text fade-in
        setTimeout(() => {
            const newDetails = document.querySelector('.details-wrapper');
            if (newDetails) newDetails.classList.add('active');
            document.dispatchEvent(new Event('pageTransitionFinished'));
            // Re-init carousels etc.
            if(typeof bootstrap !== 'undefined') {
                document.querySelectorAll('.carousel').forEach(c => {
                    if (!bootstrap.Carousel.getInstance(c)) new bootstrap.Carousel(c);
                });
            }
        }, 50);

        // 4. BACKGROUND TRACK (Runs in parallel)
        if (newBgSrc) {
            preloadImage(newBgSrc).then(() => {
                // Reset reveal state
                bgFront.style.transition = '0s';
                bgFront.classList.remove('reveal');
                bgFront.src = newBgSrc;

                // Trigger Reveal Wipe
                setTimeout(() => {
                    bgFront.style.transition = 'clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                    bgFront.classList.add('reveal');
                    
                    // Sync the back layer after wipe finishes
                    setTimeout(() => { 
                        if(bgBack) bgBack.src = newBgSrc; 
                        isAnimating = false; // Finally unlock navigation
                    }, 800);
                }, 50);
            });
        } 
        else {
            // No background to load? Unlock immediately
            isAnimating = false;
        }
    } 
    catch (error) {
        console.error("Transition failed:", error);
        isAnimating = false;
        window.location.href = url;
    }
};


// INTERCEPT ON-LOAD
document.addEventListener('DOMContentLoaded', () => {
    jumbotron = document.getElementById('jumbotronBase');
    bgBack = document.querySelector('.bg-back');
    bgFront = document.querySelector('.bg-front');
    contentArea = document.getElementById('jumbotronContent');
    nav = document.getElementById('globalNav');
    isAnimating = false;

    runEntryAnimation();
});

// INTERCEPT CLICKS
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link || link.hostname !== window.location.hostname) return;
    if (isAnimating) return;
    
    // Handle Hash Links on the Same page
    if (link.hash && link.pathname === window.location.pathname) {
        const targetId = decodeURIComponent(link.hash.substring(1));
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', link.hash);
        }
        return;
    }
    if (link.hash) return;
    e.preventDefault();
    handleTransition(link.href, true);
});

// INTERCEPT POPSTATE (Browser Nav Arrows)
window.addEventListener('popstate', () => {
    if (isAnimating) return;
    handleTransition(window.location.href, false);
});

// INTERCEPT Tab Change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isAnimating) {
        isAnimating = false;
    }
});