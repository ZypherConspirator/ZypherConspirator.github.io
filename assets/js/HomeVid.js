// Simplified HomeVid.js
export function videoplay() {
    const iframe = document.getElementById('reelVideo');
    if (!iframe) return;
    const videoSrc = iframe.getAttribute('data-src') || iframe.src;
    if (!iframe.getAttribute('data-src')) iframe.setAttribute('data-src', videoSrc);
    
    // Just start the video
    iframe.src = videoSrc + (videoSrc.includes('?') ? "&" : "?") + "autoplay=1";
}

export function videoexit() {
    const iframe = document.getElementById('reelVideo');
    if (!iframe) return;
    const videoSrc = iframe.getAttribute('data-src') || iframe.src;
    
    // Just stop the video
    iframe.src = videoSrc;
}