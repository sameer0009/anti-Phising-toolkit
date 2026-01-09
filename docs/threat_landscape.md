# Phase 1: Threat Landscape & Requirements

## 1. Threat Landscape Analysis

This module defines the scope of attacks the Anti-Phishing Toolkit is designed to detect and mitigate.

### 1.1 Email Phishing (Deceptive Phishing)
**Definition:** Mass-distributed emails designed to trick users into revealing credentials or installing malware.
**Characteristics:** Generic greetings, urgency, spoofed domains, malicious links/attachments.
**Detection Focus:** Header analysis (SPF/DKIM/DMARC), URL reputation, NLP for urgency/intent.

### 1.2 Spear Phishing
**Definition:** Targeted attacks aimed at specific individuals or organizations.
**Characteristics:** Personalized content, gathered from OSINT (Open Source Intelligence), convincing context.
**Detection Focus:** Relationship graphing, behavioral anomalies, deep semantic analysis.

### 1.3 Whaling (CEO Fraud)
**Definition:** A sub-type of spear phishing targeting C-level executives.
**Characteristics:** High-stakes financial requests, legal threats, executive impersonation.
**Detection Focus:** Executive writing style analysis, strict financial request verification logic.

### 1.4 Smishing (SMS Phishing)
**Definition:** Phishing conducted via SMS text messages.
**Characteristics:** Shortened URLs, "package delivery" or "bank alert" themes.
**Detection Focus:** Short URL expansion, phone number reputation, NLP on short texts.

### 1.5 Vishing (Voice Phishing)
**Definition:** Voice calls (often AI-generated or automated) to extract information.
**Characteristics:** Caller ID spoofing, sense of urgency, impersonation of authority.
**Detection Focus:** (Future Scope) Audio fingerprinting, speech-to-text NLP analysis.

### 1.6 QR-Code Phishing (Quishing)
**Definition:** Embedding malicious URLs into QR codes to bypass traditional email filters.
**Characteristics:** QR codes in PDF attachments or embedded images.
**Detection Focus:** OCR/Code decoding, URL extraction and analysis.

### 1.7 Business Email Compromise (BEC)
**Definition:** Compromising legitimate business email accounts to conduct unauthorized transfers.
**Characteristics:** No malware/links involved; purely social engineering based on trust.
**Detection Focus:** Sentiment analysis, context-aware anomaly detection, communication pattern analysis.

---

## 2. Requirements Definition

### 2.1 Functional Requirements (FR)
- **FR-01 Multi-Channel Ingestion:** System must ingest data from Email (SMTP/IMAP), Web (Browser Extensions), SMS (API), and Manual Reports.
- **FR-02 Real-Time Detection:** URL scanning and basic heuristic checks must complete within < 200ms.
- **FR-03 Deep Analysis:** Content-heavy analysis (Sandboxing, Deep Learning) can be asynchronous (SLA < 2 mins).
- **FR-04 Reporting:** Users must have a one-click mechanism to report suspicious entities.
- **FR-05 Dashboard:** Admin interface for real-time threat monitoring, campaign tracking, and system health.
- **FR-06 Mitigation:** Native capabilities to block URLs, quarantine emails, and alert SOC.

### 2.2 Non-Functional Requirements (NFR)
- **NFR-01 Scalability:** Microservices architecture to handle spike loads (e.g., 10k emails/min).
- **NFR-02 Privacy:** PII detection and redaction before data persistence (GDPR compliance).
- **NFR-03 Availability:** 99.9% uptime for the detection API.
- **NFR-04 Explainability (XAI):** All positive detections must provide a rigorous "Why" explanation (e.g., "Domain spoofing + High Urgency Score").

---

## 3. Compliance & Standards

### 3.1 GDPR (General Data Protection Regulation)
- **Requirement:** Right to be forgotten, data minimization.
- **Implementation:** Automated PII redaction in logs; retention policies for raw email data.

### 3.2 HIPAA (Health Insurance Portability and Accountability Act)
- **Requirement:** Protection of PHI (Protected Health Information) in healthcare environments.
- **Implementation:** Encryption at rest and in transit; strict RBAC (Role-Based Access Control) for SOC analysts.

### 3.3 ISO/IEC 27001
- **Requirement:** Information Security Management System (ISMS).
- **Implementation:** Audit trails for all system actions; rigorous change management for model updates.
