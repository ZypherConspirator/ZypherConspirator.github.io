window.addEventListener('load', () => {
    const video = document.getElementById('midgroundImg');
    if (!video) return;

    let isPlaying = false;

    function syncVideo() {
        if (!isPlaying) return;

        // rAF helps the browser compositor prioritize the video layer 
        // to match the screen's refresh rate.
        requestAnimationFrame(syncVideo);
    }

    var playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            requestAnimationFrame(syncVideo); // Start the sync loop
        }).catch(error => {
            console.log("Autoplay blocked: " + error);
        });
    }

    // Stop the loop if the video pauses to save battery
    video.addEventListener('pause', () => isPlaying = false);
    video.addEventListener('play', () => {
        if (!isPlaying) {
            isPlaying = true;
            requestAnimationFrame(syncVideo);
        }
    });
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