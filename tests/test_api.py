import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "1.0.0"}

def test_scan_email_phishing():
    # Mocking a high-risk email
    payload = {
        "content": "URGENT: Your account has been suspended. Click here to verify your identity immediately or you will lose access.",
        "sender": "security@paypal-support-verify.com",
        "subject": "Account Suspension Notice"
    }
    response = client.post("/api/v1/scan/email", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Expecting high risk due to keywords 'URGENT', 'suspended', 'immediately' and CTA 'Click here'
    assert data['is_phishing'] == True
    assert data['risk_score'] > 0.5
    assert data['detected_traits']['cta_found'] == True
    # Urgency check (heuristic fallback or model)
    if 'urgent' in data['detected_traits']['urgency']:
         assert data['detected_traits']['urgency']['urgent'] > 0

def test_scan_email_safe():
    payload = {
        "content": "Hey, are we still on for lunch tomorrow? Let me know.",
        "sender": "friend@gmail.com",
        "subject": "Lunch"
    }
    response = client.post("/api/v1/scan/email", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data['is_phishing'] == False
    assert data['risk_score'] < 0.5
    assert data['detected_traits']['cta_found'] == False

def test_scan_url_malicious():
    payload = {
        "url": "http://192.168.1.1/login.php"
    }
    response = client.post("/api/v1/scan/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # IP address URL should be flagged
    assert data['detected_traits']['is_ip_address'] == 1
    assert data['is_phishing'] == True
