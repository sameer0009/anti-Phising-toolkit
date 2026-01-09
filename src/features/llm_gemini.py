import google.generativeai as genai
import os
import json
from typing import Dict, Any

class GeminiAnalyzer:
    """
    Wrapper for Google Gemini 1.5 Pro to analyze phishing threats.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found. GenAI features will be disabled.")
            self.model = None
            return

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro') # Using 'gemini-pro' as alias for latest stable text model

    def analyze_email(self, content: str, swift_risk_score: float) -> Dict[str, Any]:
        """
        Sends email content to Gemini for a detailed SOC Analyst report.
        """
        if not self.model:
            return {
                "error": "Gemini API key missing",
                "explanation": "AI analysis unavailable.",
                "suggested_action": "Manual Review"
            }

        prompt = f"""
        You are an expert Cybersecurity SOC Analyst. Analyze the following email content for phishing indicators.
        The preliminary local ML model gave this a risk score of {swift_risk_score:.2f}/1.0.

        Email Content:
        '''
        {content}
        '''

        Provide your analysis in strictly valid JSON format with the following keys:
        - "new_risk_score": (float 0.0-1.0, your assessment)
        - "reasoning": (string, concise explanation of why it is safe or malicious)
        - "intent": (string, e.g., 'Credential Theft', 'CEO Fraud', 'Legitimate')
        - "suggested_action": (string, e.g., 'Block Sender', 'Ignore', 'Quarantine')
        - "highlighted_phrases": (list of strings, specific triggers in the text)

        Do not include markdown formatting like ```json ... ```, just the raw JSON string.
        """

        try:
            response = self.model.generate_content(prompt)
            data = json.loads(response.text.replace('```json', '').replace('```', '').strip())
            return data
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return {
                "error": str(e),
                "explanation": "AI analysis failed.",
                "suggested_action": "Manual Review"
            }
