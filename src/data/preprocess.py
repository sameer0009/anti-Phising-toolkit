import re
import pandas as pd
from urllib.parse import urlparse
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Union

class Preprocessor:
    """
    Handles text cleaning, tokenization, and feature extraction.
    """
    def __init__(self):
        self.tfidf = TfidfVectorizer(max_features=5000, stop_words='english')

    def clean_text(self, text: str) -> str:
        """
        Basic text cleaning: lowercase, remove special chars, etc.
        """
        if not isinstance(text, str):
            return ""
        text = text.lower()
        # Remove special characters but keep simplified structure
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def clean_url(self, url: str) -> str:
        """
        Cleans URL for lexical analysis.
        """
        if not isinstance(url, str):
            return ""
        return url.lower().strip()

    def fit_transform_tfidf(self, corpus: List[str]):
        """
        Fits TF-IDF vectorizer on a corpus (training data).
        """
        return self.tfidf.fit_transform(corpus)

    def transform_tfidf(self, corpus: List[str]):
        """
        Transforms new data using the fitted TF-IDF.
        """
        return self.tfidf.transform(corpus)

    def extract_lexical_features(self, url: str) -> dict:
        """
        Extracts lexical features from a URL.
        """
        features = {}
        try:
            parsed = urlparse(url)
            features['url_length'] = len(url)
            features['domain_length'] = len(parsed.netloc)
            features['path_length'] = len(parsed.path)
            features['num_digits'] = sum(c.isdigit() for c in url)
            features['num_special_chars'] = sum(not c.isalnum() for c in url)
            features['has_https'] = 1 if parsed.scheme == 'https' else 0
            features['num_subdomains'] = parsed.netloc.count('.')
            features['is_ip_address'] = 1 if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', parsed.netloc) else 0
        except:
            features = {k: 0 for k in ['url_length', 'domain_length', 'path_length', 'num_digits', 'num_special_chars', 'has_https', 'num_subdomains', 'is_ip_address']}
        
        return features

    def batch_lexical_features(self, urls: List[str]) -> pd.DataFrame:
        """
        Extracts features for a list of URLs and returns a DataFrame.
        """
        features_list = [self.extract_lexical_features(u) for u in urls]
        return pd.DataFrame(features_list)

    def extract_cta_features(self, text: str) -> dict:
        """
        Extracts Call-To-Action (CTA) features from text.
        """
        text = text.lower()
        ctas = ['click here', 'login now', 'verify account', 'update password', 'unsubscribe', 'confirm', 'sign in']
        
        return {
            'has_cta': 1 if any(cta in text for cta in ctas) else 0,
            'cta_count': sum(text.count(cta) for cta in ctas)
        }
