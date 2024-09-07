document.addEventListener('DOMContentLoaded', function () {
    const disableVideosCheckbox = document.getElementById('disableVideos');
    const disableImagesCheckbox = document.getElementById('disableImages');
    const disableGIFsCheckbox = document.getElementById('disableGIFs');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Load saved preferences
    chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs', 'whitelist', 'darkMode'], (data) => {
        if (disableVideosCheckbox) disableVideosCheckbox.checked = data.disableVideos || false;
        if (disableImagesCheckbox) disableImagesCheckbox.checked = data.disableImages || false;
        if (disableGIFsCheckbox) disableGIFsCheckbox.checked = data.disableGIFs || false;
        if (darkModeToggle) darkModeToggle.checked = data.darkMode || false;

        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
        }
    });

    // Event listeners for checkboxes
    disableVideosCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableVideos: disableVideosCheckbox.checked });
        applyChanges();
    });

    disableImagesCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableImages: disableImagesCheckbox.checked });
        applyChanges();
    });

    disableGIFsCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ disableGIFs: disableGIFsCheckbox.checked });
        applyChanges();
    });

    darkModeToggle.addEventListener('change', () => {
        chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    function applyChanges() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: applyPreferences
            });
        });
    }
});

// This function is injected directly into the webpage's context
function applyPreferences() {
    chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs'], (data) => {
        // Defining the functions directly within this script so they can run in the page's context
        function toggleVideos(disable) {
            const videos = document.querySelectorAll('video');
            videos.forEach((video) => {
                if (disable) {
                    video.pause();
                    video.style.display = 'none'; // Hide video
                } else {
                    video.play();
                    video.style.display = ''; // Make video visible again
                }
            });
        }

        function toggleImages(disable) {
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                if (disable) {
                    img.style.display = 'none'; // Hide images
                } else {
                    img.style.display = ''; // Make images visible again
                }
            });
        }

        function toggleGIFs(disable) {
            const gifs = document.querySelectorAll('img');
            gifs.forEach((img) => {
                if (img.src.match(/\.gif($|\?)/) && disable) {
                    img.style.display = 'none'; // Hide GIFs
                } else if (img.src.match(/\.gif($|\?)/)) {
                    img.style.display = ''; // Make GIFs visible again
                }
            });
        }

        toggleVideos(data.disableVideos);
        toggleImages(data.disableImages);
        toggleGIFs(data.disableGIFs);
    });
}
