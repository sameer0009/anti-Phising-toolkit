// Content script - runs on every page
console.log('Anti-Phishing Guard AI - Content Script Loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showWarning') {
        displayWarningBanner(request.data);
    }
});

function displayWarningBanner(data) {
    // Remove existing warning if any
    const existing = document.getElementById('ag-phishing-warning');
    if (existing) existing.remove();

    const warningDiv = document.createElement('div');
    warningDiv.id = 'ag-phishing-warning';
    warningDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 80px;
        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
        color: white;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
    `;

    warningDiv.innerHTML = `
        <style>
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
        </style>
        <div style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 32px;">⚠️</div>
            <div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">
                    PHISHING SITE DETECTED
                </div>
                <div style="font-size: 13px; opacity: 0.9;">
                    AntiGravity AI identified this website as malicious (Risk: ${(data.risk_score * 100).toFixed(0)}%)
                </div>
            </div>
        </div>
        <button id="ag-dismiss-btn" style="
            padding: 10px 20px;
            background: white;
            color: #cc0000;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Dismiss Warning
        </button>
    `;

    document.body.prepend(warningDiv);

    document.getElementById('ag-dismiss-btn').onclick = () => {
        warningDiv.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => warningDiv.remove(), 300);
    };
}
