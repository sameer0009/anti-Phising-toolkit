import joblib
import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

class BaselineModel:
    """
    Wrapper for Scikit-Learn based baseline models.
    """
    def __init__(self, model_type='logistic'):
        self.model_type = model_type
        if model_type == 'logistic':
            self.model = LogisticRegression(max_iter=1000)
        elif model_type == 'random_forest':
            self.model = RandomForestClassifier(n_estimators=100)
        else:
            raise ValueError("Invalid model_type. Choose 'logistic' or 'random_forest'.")
        
    def train(self, X_train, y_train):
        print(f"Training {self.model_type}...")
        self.model.fit(X_train, y_train)
        print("Training complete.")

    def evaluate(self, X_test, y_test):
        preds = self.model.predict(X_test)
        acc = accuracy_score(y_test, preds)
        print(f"Accuracy: {acc:.4f}")
        print(classification_report(y_test, preds))
        return acc

    def predict(self, X):
        return self.model.predict(X)

    def predict_proba(self, X):
        return self.model.predict_proba(X)[:, 1]

    def save(self, path):
        joblib.dump(self.model, path)
        print(f"Model saved to {path}")

    def load(self, path):
        if os.path.exists(path):
            self.model = joblib.load(path)
            print(f"Model loaded from {path}")
        else:
            print(f"Model file {path} not found.")
