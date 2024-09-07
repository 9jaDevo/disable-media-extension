chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs'], (data) => {
    // Call applyPreferences every time the page loads
    applyPreferences(data);
});

function applyPreferences(data) {
    toggleVideos(data.disableVideos);
    toggleImages(data.disableImages);
    toggleGIFs(data.disableGIFs);
}

// Function to toggle videos
function toggleVideos(disable) {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        if (disable) {
            video.pause();
            video.style.display = 'none';
        } else {
            video.play();
            video.style.display = '';
        }
    });
    // Also handle videos in iframes
    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const iframeVideos = iframeDoc.querySelectorAll('video');
            iframeVideos.forEach((video) => {
                if (disable) {
                    video.pause();
                    video.style.display = 'none';
                } else {
                    video.play();
                    video.style.display = '';
                }
            });
        } catch (e) {
            // Cross-origin iframe may throw errors, so catch them
            console.warn("Could not access iframe due to cross-origin restrictions.");
        }
    });
}

// Function to toggle images
function toggleImages(disable) {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        if (disable) {
            img.style.display = 'none';
        } else {
            img.style.display = '';
        }
    });
}

// Function to toggle GIFs
function toggleGIFs(disable) {
    const gifs = document.querySelectorAll('img');
    gifs.forEach((img) => {
        if (img.src.match(/\.gif($|\?)/) && disable) {
            img.style.display = 'none';
        } else if (img.src.match(/\.gif($|\?)/)) {
            img.style.display = '';
        }
    });
}
