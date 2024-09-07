// Create context menu items for each option
chrome.contextMenus.create({
    id: "disable_videos",
    title: "Disable Videos",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "disable_images",
    title: "Disable Images",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "disable_gifs",
    title: "Disable GIFs",
    contexts: ["page"]
});

chrome.contextMenus.create({
    id: "disable_all",
    title: "Disable All Media",
    contexts: ["page"]
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "disable_videos") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectCSS,
            args: ['video']
        });
    }
    if (info.menuItemId === "disable_images") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectCSS,
            args: ['image']
        });
    }
    if (info.menuItemId === "disable_gifs") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectCSS,
            args: ['gif']
        });
    }
    if (info.menuItemId === "disable_all") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: injectCSS,
            args: ['all']
        });
    }
});

// Handle keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (command === 'toggle-videos') {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: injectCSS,
                args: ['video']
            });
        }
        if (command === 'toggle-images') {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: injectCSS,
                args: ['image']
            });
        }
    });
});

// Inject CSS to disable the specified media
function injectCSS(type) {
    const styleId = `block-${type}`;
    
    // Check if the corresponding style tag is already injected
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        
        // Inject different CSS rules based on the media type
        if (type === 'video') {
            style.textContent = `
                video {visibility: hidden !important; opacity: 0 !important;}
            `;
        } else if (type === 'image') {
            style.textContent = `
                img {visibility: hidden !important; opacity: 0 !important;}
                [style*="background-image"] {visibility: hidden !important; opacity: 0 !important;}
            `;
        } else if (type === 'gif') {
            style.textContent = `
                img[src*=".gif"], img[src*=".GIF"] {visibility: hidden !important; opacity: 0 !important;}
            `;
        } else if (type === 'all') {
            style.textContent = `
                svg, img, video, canvas {visibility: hidden !important; opacity: 0 !important;}
                iframe [type="application/x-shockwave-flash"] {visibility: hidden !important; opacity: 0 !important;}
                [style*="background-image"] {visibility: hidden !important; opacity: 0 !important;}
            `;
        }

        document.head.appendChild(style);
    }
}

chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['content.js']
    });
}, { url: [{ urlMatches: 'https://*/*' }, { urlMatches: 'http://*/*' }] });
