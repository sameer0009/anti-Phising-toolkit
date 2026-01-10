# SOC Analyst Playbook

## Quick Start Guide

### Accessing the Dashboard
1. Navigate to `http://localhost:3000`
2. View real-time threat feed
3. Click on any alert for detailed AI analysis

### Understanding Risk Scores

| Score Range | Classification | Action Required |
|-------------|---------------|-----------------|
| 0.0 - 0.3   | Low Risk      | Monitor         |
| 0.3 - 0.7   | Medium Risk   | Review          |
| 0.7 - 1.0   | High Risk     | Block/Quarantine|

### Threat Response Workflow

#### 1. Alert Received
- Review risk score and detected traits
- Check AI explanation for reasoning

#### 2. Analysis
- Verify sender domain
- Check for brand impersonation
- Review urgency indicators

#### 3. Action
- **Block**: Add to blocklist
- **Quarantine**: Move to quarantine folder
- **Report**: Submit to threat intelligence

### Common Phishing Indicators

✅ **Email Red Flags:**
- Urgent language ("Act now", "Account suspended")
- Mismatched sender domain
- Suspicious attachments
- Generic greetings

✅ **URL Red Flags:**
- IP addresses instead of domains
- Misspelled brand names
- Unusual TLDs (.tk, .ml, .ga)
- Long, obfuscated URLs

### Using the Browser Extension

1. Install from `extension/` folder
2. Extension automatically scans URLs
3. Warning banner appears for malicious sites
4. Badge shows status (OK/!)

### API Integration

For custom integrations, use the REST API:

```bash
curl -X POST http://localhost:8000/api/v1/scan/email \
  -H "Content-Type: application/json" \
  -d '{"content": "Your email text here"}'
```

### Troubleshooting

**Issue**: API not responding
- Check if backend is running: `http://localhost:8000/health`
- Verify .env file has GEMINI_API_KEY

**Issue**: Dashboard not loading
- Ensure Next.js is running: `cd dashboard && npm run dev`
- Check browser console for errors

**Issue**: Low detection accuracy
- Verify Gemini API key is valid
- Check model files are present
