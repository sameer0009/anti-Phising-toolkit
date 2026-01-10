# AI & ML-Based Anti-Phishing Toolkit Framework 🔐

An Enterprise-Grade Cybersecurity framework designed for real-time detection and mitigation of phishing attacks (Email, SMS, URL, QR) using a hybrid approach of Local ML Models and Google Gemini 1.5 Pro.

## 🚀 Vision
From Zero to Hero - A scalable, explainable, and secure by design toolkit suitable for banks, healthcare, and government environments.

## 🛠️ Key Features
- **Multi-Vector Detection**: Analyzes Email contents, URL lexical patterns, and Brand impersonation.
- **Hybrid AI Engine**: 
  - **Local Models**: Fast inference using Scikit-Learn (Random Forest) and CNNs for URL patterns.
  - **GenAI (Gemini)**: Deep semantic analysis and "SOC Analyst" reasoning for complex threats.
- **Professional SOC Dashboard**: Next.js 14 based real-time monitoring with Dark Mode and interactive threat panels.
- **Explainable AI (XAI)**: Provides clear "Reasoning Chains" for every detection.
- **Enterprise Ready**: Fully containerized with Docker & Docker Compose.

---

## 🏗️ Architecture
The system follows a microservices event-driven architecture.
- **Backend**: FastAPI (Python 3.10)
- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion
- **Detection**: PyTorch (DistilBERT), TensorFlow (CNN), Scikit-Learn
- **LLM**: Google Gemini 1.5 Pro Integration

[View Detailed Architecture Documentation](docs/architecture.md)

---

## 🚦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/sameer0009/anti-Phising-toolkit.git
   cd anti-Phising-toolkit
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Deploy with Docker**:
   ```bash
   docker-compose up --build
   ```

4. **Access the Platform**:
   - **Dashboard**: `http://localhost:3000`
   - **API Docs**: `http://localhost:8000/docs`

---

## 📂 Project Structure
```text
├── src/
│   ├── api/            # FastAPI Routes & Logic
│   ├── models/         # ML Model Definitions (Baseline, NLP, CNN)
│   ├── data/           # Data Loaders & Preprocessors
│   └── features/       # Gemini & Advanced NLP Analysis
├── dashboard/          # Next.js 14 Frontend
├── extension/          # Browser Extension (Manifest V3)
├── docs/               # Technical Docs & Diagrams
└── tests/              # Unit & Integration Tests
```

---

## ⚖️ Compliance
Designed with **GDPR**, **HIPAA**, and **ISO 27001** standards in mind, featuring automated PII redaction and encrypted data flows.


