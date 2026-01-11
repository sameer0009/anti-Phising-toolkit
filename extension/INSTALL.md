# Chrome Extension Installation Guide

## 📦 What's Included

The **Anti-Phishing Guard AI** browser extension is already built with the following files:

- `manifest.json` - Manifest V3 configuration
- `background.js` - Service worker for URL scanning
- `popup.html` - Extension popup interface
- `content.js` - Content script (needs to be created)

## 🚀 How to Install the Extension

### Step 1: Create Missing Icon Files

The extension needs icon files. Run these commands:

```bash
# Create icons directory
mkdir d:/Apps/Anti-phising/extension/icons

# You'll need to add icon files (16x16, 48x48, 128x128 PNG images)
# For now, we can use placeholder icons or skip this step
```

### Step 2: Load Extension in Chrome

1. **Open Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**:
   - Toggle the switch in the top-right corner

3. **Load Unpacked Extension**:
   - Click "Load unpacked"
   - Navigate to: `d:\Apps\Anti-phising\extension`
   - Select the folder

4. **Verify Installation**:
   - You should see "Anti-Phishing Guard AI v1.0" in your extensions list
   - The extension icon will appear in your browser toolbar

## ✨ How It Works

### Automatic URL Scanning

When you visit any website:

1. **Extension intercepts** the URL
2. **Sends to API**: `POST http://localhost:8000/api/v1/scan/url`
3. **Receives analysis**:
   ```json
   {
     "is_phishing": true,
     "risk_score": 0.95,
     "detected_traits": {...}
   }
   ```
4. **Takes action**:
   - ✅ **Safe**: Green "OK" badge
   - ⚠️ **Malicious**: Red "!" badge + Warning banner

### Warning Banner

If a phishing site is detected, a **red warning banner** appears at the top of the page:

```
⚠️ PHISHING WARNING
AntiGravity AI detected this site as malicious.
Risk Score: 0.95 | Reason: {...}
[Dismiss]
```

## 🧪 Testing the Extension

### Test with a Safe URL:
1. Visit: `https://google.com`
2. Extension badge should show: **OK** (green)

### Test with a Suspicious Pattern:
1. Visit a URL with an IP address: `http://192.168.1.1`
2. Extension should flag it as suspicious

### Test with Local API:
1. Make sure your API is running: `http://localhost:8000`
2. The extension will call the API for every page load

## 🔧 Current Limitations

1. **Icons Missing**: Need to add icon files (16x16, 48x48, 128x128 PNG)
2. **Content Script**: `content.js` is referenced but not created yet
3. **API Dependency**: Requires the backend API to be running

## 🛠️ Quick Fixes Needed

Let me create the missing files now...
