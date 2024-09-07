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

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "disable_videos") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const videos = document.querySelectorAll('video');
                videos.forEach((video) => video.pause());
            }
        });
    }
    if (info.menuItemId === "disable_images") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const images = document.querySelectorAll('img');
                images.forEach((img) => img.style.display = 'none');
            }
        });
    }
});

chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (command === 'toggle-videos') {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleVideos,
                args: [true]
            });
        }
        if (command === 'toggle-images') {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleImages,
                args: [true]
            });
        }
    });
});

chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['content.js']
    });
}, { url: [{ urlMatches: 'https://*/*' }, { urlMatches: 'http://*/*' }] });
