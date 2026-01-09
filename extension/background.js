// Background Service Worker

const API_URL = "http://localhost:8000/api/v1/scan/url";

// Listen for tab updates to scan URLs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        scanURL(tab.url, tabId);
    }
});

async function scanURL(url, tabId) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        if (data.is_phishing) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: showWarning,
                args: [data]
            });
            
            // Set badge
            chrome.action.setBadgeText({ text: "!", tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId: tabId });
        } else {
            chrome.action.setBadgeText({ text: "OK", tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: "#00FF00", tabId: tabId });
        }

    } catch (error) {
        console.error("Error scanning URL:", error);
    }
}

function showWarning(data) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background-color: #ff4444;
        color: white;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-size: 18px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    warningDiv.innerHTML = `
        <div style="text-align: center;">
            <strong>⚠️ PHISHING WARNING</strong><br>
            AntiGravity AI detected this site as malicious.<br>
            <small>Risk Score: ${data.risk_score} | Reason: ${JSON.stringify(data.detected_traits)}</small>
        </div>
        <button id="ag-close-btn" style="
            margin-left: 20px;
            padding: 5px 10px;
            background: white;
            color: #ff4444;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        ">Dismiss</button>
    `;

    document.body.prepend(warningDiv);
    
    document.getElementById('ag-close-btn').onclick = () => {
        warningDiv.remove();
    };
}
