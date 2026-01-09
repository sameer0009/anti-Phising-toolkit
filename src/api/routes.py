from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import time

# Import our analysis modules
from src.data.preprocess import Preprocessor
from src.features.nlp_advanced import AdvancedNLPAnalyzer
# Mocking model loading to simulate behavior if files don't exist yet
# In production, these would be loaded once at startup

router = APIRouter()

# Initialize Singletons (Lazy loading recommended in production)
preprocessor = Preprocessor()
nlp_analyzer = AdvancedNLPAnalyzer(device='cpu')

class EmailScanRequest(BaseModel):
    content: str
    sender: Optional[str] = None
    subject: Optional[str] = None

class URLScanRequest(BaseModel):
    url: str

class ScanResponse(BaseModel):
    is_phishing: bool
    risk_score: float # 0.0 to 1.0
    detected_traits: dict
    processing_time_ms: float

@router.post("/scan/email", response_model=ScanResponse)
async def scan_email(request: EmailScanRequest):
    start_time = time.time()
    
    # 1. Clean Text
    clean_text = preprocessor.clean_text(request.content)
    
    # 2. NLP Analysis (Urgency, Intent, Brands)
    nlp_results = nlp_analyzer.full_analysis(request.content)
    
    # 3. Heuristic Scoring (Mock logic until models are fully trained and loaded)
    # logic: if urgent AND has sensitive intent -> High Probability
    risk_score = 0.1
    
    urgency_score = nlp_results['urgency'].get('urgent', 0)
    intent_score = 0
    
    # Check for high-risk intents
    intent_map = nlp_results['intent']
    if intent_map:
        high_risk_intents = ['credential theft', 'financial request']
        for k, v in intent_map.items():
            if k in high_risk_intents:
                intent_score = max(intent_score, v)
    
    # Simple weighted sum for now
    risk_score += (urgency_score * 0.4) + (intent_score * 0.5)
    
    # CTA Check
    cta = preprocessor.extract_cta_features(request.content)
    if cta['has_cta']:
        risk_score += 0.2
        
    risk_score = min(risk_score, 0.99)
    
    processing_time = (time.time() - start_time) * 1000
    
    return {
        "is_phishing": risk_score > 0.7,
        "risk_score": round(risk_score, 4),
        "detected_traits": {
            "urgency": nlp_results['urgency'],
            "intent": nlp_results['intent'],
            "brands": nlp_results['detected_brands'],
            "cta_found": bool(cta['has_cta'])
        },
        "processing_time_ms": round(processing_time, 2)
    }

@router.post("/scan/url", response_model=ScanResponse)
async def scan_url(request: URLScanRequest):
    start_time = time.time()
    
    # 1. Lexical Features
    features = preprocessor.extract_lexical_features(request.url)
    
    # Mock Risk Calculation based on features
    risk_score = 0.0
    if features['is_ip_address']:
        risk_score += 0.6
    if features['domain_length'] > 50:
        risk_score += 0.3
    
    processing_time = (time.time() - start_time) * 1000
    
    return {
        "is_phishing": risk_score > 0.5,
        "risk_score": round(risk_score, 4),
        "detected_traits": features,
        "processing_time_ms": round(processing_time, 2)
    }

@router.post("/report")
async def report_phishing(request: EmailScanRequest):
    # Log to DB (Mock)
    return {"status": "received", "message": "Thank you for making the internet safer."}
