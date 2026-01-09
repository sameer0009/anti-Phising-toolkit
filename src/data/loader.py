import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from typing import Tuple, Optional

class DataLoader:
    """
    Handles loading of phishing and legitimate datasets.
    Supports CSV and raw text formats.
    """
    def __init__(self, data_sources: dict):
        """
        :param data_sources: Dict with paths to 'phishing' and 'legitimate' data files
        """
        self.sources = data_sources
        self.df = None

    def load_csv_data(self, filepath: str, label: int) -> pd.DataFrame:
        """
        Loads a CSV file and assigns a label.
        Assumes column 'text' or 'url' exists.
        """
        if not os.path.exists(filepath):
            print(f"Warning: File {filepath} not found.")
            return pd.DataFrame()
        
        try:
            df = pd.read_csv(filepath)
            # Standardize columns
            if 'url' in df.columns:
                df = df.rename(columns={'url': 'content'})
            elif 'text' in df.columns:
                 df = df.rename(columns={'text': 'content'})
            
            df['label'] = label
            return df[['content', 'label']]
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
            return pd.DataFrame()

    def merge_datasets(self) -> pd.DataFrame:
        """
        Merges legitimate and phishing datasets into a single DataFrame.
        """
        legit_path = self.sources.get('legitimate')
        phish_path = self.sources.get('phishing')

        legit_df = self.load_csv_data(legit_path, label=0)
        phish_df = self.load_csv_data(phish_path, label=1)

        self.df = pd.concat([legit_df, phish_df], ignore_index=True)
        # Shuffle
        self.df = self.df.sample(frac=1, random_state=42).reset_index(drop=True)
        print(f"Loaded {len(self.df)} samples. Distribution: {self.df['label'].value_counts().to_dict()}")
        return self.df

    def split_data(self, test_size=0.2, val_size=0.1) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Splits data into Train, Validation, and Test sets.
        """
        if self.df is None or self.df.empty:
            raise ValueError("No data loaded. Call merge_datasets() first.")

        train_val, test = train_test_split(self.df, test_size=test_size, stratify=self.df['label'], random_state=42)
        
        # Adjust val_size to be relative to the original full dataset (approx)
        relative_val_size = val_size / (1 - test_size)
        train, val = train_test_split(train_val, test_size=relative_val_size, stratify=train_val['label'], random_state=42)

        return train, val, test
