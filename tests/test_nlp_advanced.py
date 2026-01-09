import pytest
from src.features.nlp_advanced import AdvancedNLPAnalyzer

@pytest.fixture
def analyzer():
    return AdvancedNLPAnalyzer(device='cpu')

def test_urgency_detection(analyzer):
    high_urgency_text = "Your account will be suspended immediately if you do not verify your information within 24 hours."
    low_urgency_text = "Here is the newsletter for this week. Enjoy reading."

    # Note: Running actual inference might be slow, so we check if structure is correct
    # and if 'urgent' score is higher for the urgent text (relativistically)
    
    score_high = analyzer.analyze_urgency(high_urgency_text)
    score_low = analyzer.analyze_urgency(low_urgency_text)
    
    # Check keys exist
    assert "urgent" in score_high
    assert "normal" in score_high

    # This assertion might be flaky if model is not loaded (heuristic backup), but logic should hold
    if analyzer.classifier:
        assert score_high['urgent'] > score_low['urgent']
    else:
        # Heuristic check
        assert score_high['urgent'] >= 0.2 # 'immediately' is a keyword
        assert score_low['urgent'] == 0.0

def test_intent_detection(analyzer):
    financial_text = "Please transfer the outstanding invoice amount to the account below."
    security_text = "We detected a login attempt from a new device."
    
    intent_fin = analyzer.analyze_intent(financial_text)
    intent_sec = analyzer.analyze_intent(security_text)
    
    if analyzer.classifier:
        # Get highest probability label
        top_fin = max(intent_fin, key=intent_fin.get)
        top_sec = max(intent_sec, key=intent_sec.get)
        
        assert top_fin in ["financial request", "credential theft"]
        assert top_sec in ["security alert", "credential theft"]

def test_brand_detection(analyzer):
    text = "Please log in to your PayPal account to verify the transaction from Microsoft."
    brands = analyzer.detect_brands(text)
    
    assert "PayPal" in brands
    assert "Microsoft" in brands
    assert "Amazon" not in brands
