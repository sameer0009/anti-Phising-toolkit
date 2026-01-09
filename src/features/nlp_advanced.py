import torch
from transformers import pipeline
import re
from typing import List, Dict, Any

class AdvancedNLPAnalyzer:
    """
    Advanced NLP analysis for Phishing detection using Zero-Shot Classification and NER.
    Analyzes: Urgency, Intent, and Brands.
    """
    def __init__(self, device='cpu'):
        self.device = 0 if device == 'cuda' and torch.cuda.is_available() else -1
        print(f"Initializing AdvancedNLPAnalyzer on device: {'GPU' if self.device == 0 else 'CPU'}")
        
        # Load Zero-Shot Classification Pipeline
        # We use facebook/bart-large-mnli which is the standard for zero-shot
        try:
            self.classifier = pipeline("zero-shot-classification", 
                                     model="facebook/bart-large-mnli", 
                                     device=self.device)
        except Exception as e:
            print(f"Error loading zero-shot model: {e}")
            self.classifier = None

        # Custom keywords for fallback heuristic analysis
        self.urgency_keywords = ['immediately', 'urgent', 'account suspended', 'unauthorized', 'verify now', '24 hours']

    def analyze_urgency(self, text: str) -> Dict[str, float]:
        """
        Determines the urgency level of the text.
        Returns a dictionary with label scores.
        """
        if not self.classifier:
            return self._heuristic_urgency(text)

        candidate_labels = ["urgent", "normal", "informational"]
        result = self.classifier(text, candidate_labels)
        
        scores = {label: score for label, score in zip(result['labels'], result['scores'])}
        return scores

    def analyze_intent(self, text: str) -> Dict[str, float]:
        """
        Classifies the intent of the email.
        """
        if not self.classifier:
            return {}

        candidate_labels = ["financial request", "credential theft", "file download", "general inquiry", "security alert"]
        result = self.classifier(text, candidate_labels)
        
        scores = {label: score for label, score in zip(result['labels'], result['scores'])}
        return scores

    def _heuristic_urgency(self, text: str) -> Dict[str, float]:
        """
        Fallback simple keyword matching if model fails to load.
        """
        text_lower = text.lower()
        score = 0.0
        for word in self.urgency_keywords:
            if word in text_lower:
                score += 0.2
        
        score = min(score, 1.0) # Cap at 1.0
        return {"urgent": score, "normal": 1.0 - score}

    def detect_brands(self, text: str) -> List[str]:
        """
        Simple Named Entity Recognition (NER) for brands.
        Currently using a predefined list for speed, can be upgraded to BERT NER.
        """
        common_brands = [
            "PayPal", "Microsoft", "Google", "Apple", "Amazon", "Netflix", 
            "Chase", "Wells Fargo", "Bank of America", "Facebook", "Instagram", "LinkedIn"
        ]
        
        found_brands = []
        for brand in common_brands:
            if re.search(r'\b' + re.escape(brand) + r'\b', text, re.IGNORECASE):
                found_brands.append(brand)
        
        return found_brands

    def full_analysis(self, text: str) -> Dict[str, Any]:
        """
        Runs all analysis components on the text.
        """
        return {
            "urgency": self.analyze_urgency(text),
            "intent": self.analyze_intent(text),
            "detected_brands": self.detect_brands(text)
        }
