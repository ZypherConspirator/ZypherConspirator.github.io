window.addEventListener('load', () => {
    var video = document.getElementById('midgroundImg');
    // Explicitly mute and set to play
    video.muted = true; 
    // Play the video
    var playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Autoplay started!
        }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so the user can start it manually
            console.log("Autoplay blocked: " + error);
        });
    }
});


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