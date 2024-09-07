document.addEventListener('DOMContentLoaded', function () {
    const disableVideosCheckbox = document.getElementById('disableVideos');
    const disableImagesCheckbox = document.getElementById('disableImages');
    const disableGIFsCheckbox = document.getElementById('disableGIFs');
    const disableAllMediaCheckbox = document.getElementById('disableAllMedia');

    // Load saved preferences
    chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs', 'disableAllMedia'], (data) => {
        if (disableVideosCheckbox) disableVideosCheckbox.checked = data.disableVideos || false;
        if (disableImagesCheckbox) disableImagesCheckbox.checked = data.disableImages || false;
        if (disableGIFsCheckbox) disableGIFsCheckbox.checked = data.disableGIFs || false;
        if (disableAllMediaCheckbox) disableAllMediaCheckbox.checked = data.disableAllMedia || false;
    });

    // Event listeners for checkboxes
    disableVideosCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableVideos: disableVideosCheckbox.checked });
        toggleMedia('video', disableVideosCheckbox.checked);
    });

    disableImagesCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableImages: disableImagesCheckbox.checked });
        toggleMedia('image', disableImagesCheckbox.checked);
    });

    disableGIFsCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableGIFs: disableGIFsCheckbox.checked });
        toggleMedia('gif', disableGIFsCheckbox.checked);
    });

    disableAllMediaCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableAllMedia: disableAllMediaCheckbox.checked });
        toggleMedia('all', disableAllMediaCheckbox.checked);
    });

    // Function to inject or remove CSS
    function toggleMedia(mediaType, enable) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: injectCSS,
                args: [mediaType, enable]
            });
        });
    }

    // The injectCSS function to be injected into the webpage
    function injectCSS(type, enable) {
        const styleId = `block-${type}`;

        if (enable) {
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.type = 'text/css';

                if (type === 'video') {
                    style.textContent = `video {visibility: hidden !important; opacity: 0 !important;}`;
                } else if (type === 'image') {
                    style.textContent = `img {visibility: hidden !important; opacity: 0 !important;} [style*="background-image"] {visibility: hidden !important; opacity: 0 !important;}`;
                } else if (type === 'gif') {
                    style.textContent = `img[src*=".gif"], img[src*=".GIF"] {visibility: hidden !important; opacity: 0 !important;}`;
                } else if (type === 'all') {
                    style.textContent = `svg, img, video, canvas {visibility: hidden !important; opacity: 0 !important;} iframe [type="application/x-shockwave-flash"] {visibility: hidden !important; opacity: 0 !important;} [style*="background-image"] {visibility: hidden !important; opacity: 0 !important;}`;
                }
                document.head.appendChild(style);
            }
        } else {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        }
    }
});
