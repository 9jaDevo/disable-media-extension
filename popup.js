document.addEventListener('DOMContentLoaded', function () {
    const disableVideosCheckbox = document.getElementById('disableVideos');
    const disableImagesCheckbox = document.getElementById('disableImages');
    const disableGIFsCheckbox = document.getElementById('disableGIFs');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Load saved preferences
    chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs', 'whitelist', 'darkMode'], (data) => {
        disableVideosCheckbox.checked = data.disableVideos || false;
        disableImagesCheckbox.checked = data.disableImages || false;
        disableGIFsCheckbox.checked = data.disableGIFs || false;
        darkModeToggle.checked = data.darkMode || false;

        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
        }

        // Load and display whitelist
        const whitelistElement = document.getElementById('whitelist');
        (data.whitelist || []).forEach((domain) => {
            const li = document.createElement('li');
            li.textContent = domain;
            whitelistElement.appendChild(li);
        });
    });

    // Listen for checkbox changes and save them
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

    // Whitelist functionality
    document.getElementById('saveWhitelist').addEventListener('click', () => {
        const domain = document.getElementById('whitelistInput').value;
        chrome.storage.sync.get(['whitelist'], (data) => {
            const whitelist = data.whitelist || [];
            whitelist.push(domain);
            chrome.storage.sync.set({ whitelist });
            location.reload(); // Reload to apply changes
        });
    });

    function applyChanges() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: applyPreferences
            });
        });
    }
});

function applyPreferences() {
    chrome.storage.sync.get(['disableVideos', 'disableImages', 'disableGIFs'], (data) => {
        toggleVideos(data.disableVideos);
        toggleImages(data.disableImages);
        toggleGIFs(data.disableGIFs);
    });
}

function toggleVideos(disable) {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        if (disable) {
            video.pause();
        } else {
            video.play();
        }
    });
}

function toggleImages(disable) {
    if (disable) {
        document.querySelectorAll('img').forEach((img) => img.remove());
    } else {
        location.reload();
    }
}

function toggleGIFs(disable) {
    document.querySelectorAll('img').forEach((img) => {
        if (img.src.endsWith('.gif') && disable) {
            img.remove();
        }
    });
}
