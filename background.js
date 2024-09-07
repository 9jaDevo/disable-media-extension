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
            function: toggleVideos,
            args: [true]
        });
    }
    if (info.menuItemId === "disable_images") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: toggleImages,
            args: [true]
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
