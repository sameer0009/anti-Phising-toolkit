# Anti-Phishing Toolkit - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [API Reference](#api-reference)
3. [Model Architecture](#model-architecture)
4. [Deployment Guide](#deployment-guide)
5. [Security Considerations](#security-considerations)

---

## System Overview

The Anti-Phishing Toolkit is a hybrid AI system combining:
- **Local ML Models**: Fast, privacy-preserving detection
- **Google Gemini 1.5 Pro**: Deep semantic analysis with explainability
- **Real-time Dashboard**: SOC analyst interface

### Technology Stack
- **Backend**: Python 3.10, FastAPI, PyTorch, TensorFlow
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI/ML**: DistilBERT, CNN, Random Forest, Gemini API
- **Infrastructure**: Docker, Docker Compose

---

## API Reference

### Base URL
```
http://localhost:8000/api/v1
```

### Endpoints

#### POST /scan/email
Scan email content for phishing indicators.

**Request Body:**
```json
{
  "content": "string",
  "sender": "string (optional)",
  "subject": "string (optional)",
  "use_gemini": "boolean (optional, default: false)"
}
```

**Response:**
```json
{
  "is_phishing": boolean,
  "risk_score": float,
  "detected_traits": {
    "urgency": object,
    "intent": object,
    "brands": array,
    "cta_found": boolean
  },
  "processing_time_ms": float,
  "ai_explanation": object (if Gemini used)
}
```

#### POST /scan/url
Scan URL for malicious patterns.

**Request Body:**
```json
{
  "url": "string"
}
```

#### POST /report
User-reported phishing submission.

---

## Model Architecture

### 1. Baseline Models (Tier 1)
- **Logistic Regression**: Fast binary classification
- **Random Forest**: Ensemble method for URL features

### 2. Deep Learning (Tier 2)
- **DistilBERT**: Semantic understanding of email content
- **1D CNN**: Character-level URL pattern recognition

### 3. GenAI (Tier 3)
- **Gemini 1.5 Pro**: Explainable threat analysis

### Hybrid Decision Flow
```
Input → Local Models → Risk Score
  ↓
If score > 0.4 OR use_gemini=true
  ↓
Gemini Analysis → Enhanced Score + Explanation
```

---

## Deployment Guide

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run platform
python run.py
```

### Docker Deployment
```bash
# Build and start
docker-compose up --build

# Access
# API: http://localhost:8000
# Dashboard: http://localhost:3000
```

### Environment Variables
Create `.env` from `.env.example`:
```bash
GEMINI_API_KEY=your_key_here
PORT=8000
DEBUG=True
```

---

## Security Considerations

### Data Privacy
- PII redaction before logging
- Encrypted data transmission (HTTPS in production)
- No persistent storage of email content

### Model Security
- Model versioning and integrity checks
- Sandboxed execution environment
- Rate limiting on API endpoints

### Compliance
- GDPR: Right to be forgotten, data minimization
- HIPAA: PHI protection in healthcare deployments
- ISO 27001: Audit trails and access controls
