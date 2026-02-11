document.addEventListener('DOMContentLoaded', () => {
    const jumbotron = document.getElementById('jumbotronBase');
    const bgBack = document.querySelector('.bg-back');
    const bgFront = document.querySelector('.bg-front');
    const contentArea = document.getElementById('jumbotronContent');
    const nav = document.getElementById('globalNav');
    let isAnimating = false;

    // Helper to check current path
    const checkIsHome = (path) => path === "/" || path === "/index.html" || path === "";
    const checkIsResume = (path) => path === "/resume" || path === "/resume.html" || path === "/resume/" || path === "resume";
    const getPageType = (path) => {
    if (checkIsHome(path)) return 'home';
    if (checkIsResume(path)) return 'resume';
    return 'other';
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

    runEntryAnimation();

    // --- 2. INTERCEPT CLICKS & POPSTATE ---
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        
        // 1. Basic Guard
        if (!link || link.hostname !== window.location.hostname) return;

        // 2. Handle TOC / Hash Links on the SAME page
        if (link.hash && link.pathname === window.location.pathname) {
            const targetId = decodeURIComponent(link.hash.substring(1));
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // This replicates the "# behavior" but works inside your scrolling div
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Optional: Update URL hash without triggering a jump
                history.pushState(null, '', link.hash);
            }
            return; // Stop here, don't run handleTransition
        }

        // 3. Guard for hashes on OTHER pages (let browser handle standard navigation)
        if (link.hash) return;

        // 4. Handle AJAX Transitions for standard links
        e.preventDefault();
        if (isAnimating) return;
        handleTransition(link.href, true);
    });
    window.addEventListener('popstate', () => {
        if (isAnimating) return;
        handleTransition(window.location.href, false);
    });

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
    // --- 3. THE CROSS-WIPE TRANSITION ---
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
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            const newDetailsHTML = newDoc.querySelector('#jumbotronContent').innerHTML;
            const newBgSrc = newDoc.querySelector('.bg-front').src;
            const fallbackBgSrc = "svg/error.svg";

            // PREPARE FRONT LAYER
            if (newBgSrc === undefined) {
                bgFront.src = fallbackBgSrc;
            }
            else {
                bgFront.src = newBgSrc;
            }
            bgFront.style.transition = '0s';
            bgFront.classList.remove('reveal');
            

            setTimeout(() => {
                if (pushToHistory) history.pushState(null, '', url);
                
                contentArea.innerHTML = newDetailsHTML;
                updateActiveNav(url);

                // ENTRY: Wipe background
                bgFront.style.transition = 'clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                bgFront.classList.add('reveal');

                // Handle Nav Fade IN if leaving home
                if (pageType === 'other') 
                {
                    nav.classList.remove('nav-hidden');
                    jumbotron.classList.remove('page');
                }
                else if (pageType === 'home')
                {
                    jumbotron.classList.remove('page');
                } 

                setTimeout(() => {
                    const newDetails = document.querySelector('.details-wrapper');
                    if (newDetails) newDetails.classList.add('active');
                    isAnimating = false;
                    // Pulse check: Reset video container state if navigating back home
                    if (window.location.pathname === "/") {
                        const videoWrap = document.getElementById('videoContainer');
                        if (videoWrap) {
                            videoWrap.classList.add('d-none', 'opacity-0');
                        }
                    }
                    document.dispatchEvent(new Event('pageTransitionFinished'));
                    setTimeout(() => { if(bgBack) bgBack.src = newBgSrc; }, 800);

                    if(typeof bootstrap !== 'undefined') {
                        document.querySelectorAll('.carousel').forEach(c => {
                            // Basic check to see if carousel is already initialized
                            if (!bootstrap.Carousel.getInstance(c)) {
                                new bootstrap.Carousel(c);
                            }
                        });
                    }
                }, 50);
            }, 600);
            
        } catch (error) {
            console.error("Transition failed:", error);
            window.location.href = url;
        }
    };
});