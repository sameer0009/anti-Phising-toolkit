import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, AdamW
import numpy as np
from tqdm import tqdm
import os

class PhishingDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]

        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

class NLPModel:
    """
    DistilBERT-based text classification model.
    """
    def __init__(self, model_name='distilbert-base-uncased', num_labels=2, device='cpu'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu') if device == 'auto' else torch.device(device)
        print(f"Using device: {self.device}")
        
        self.tokenizer = DistilBertTokenizer.from_pretrained(model_name)
        self.model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=num_labels)
        self.model.to(self.device)

    def train(self, train_texts, train_labels, val_texts, val_labels, epochs=3, batch_size=16, lr=2e-5):
        train_ds = PhishingDataset(train_texts, train_labels, self.tokenizer)
        val_ds = PhishingDataset(val_texts, val_labels, self.tokenizer)

        train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_ds, batch_size=batch_size)

        optimizer = AdamW(self.model.parameters(), lr=lr)
        loss_fn = torch.nn.CrossEntropyLoss().to(self.device)

        for epoch in range(epochs):
            print(f"Epoch {epoch + 1}/{epochs}")
            self.model.train()
            total_loss = 0
            
            loop = tqdm(train_loader, leave=True)
            for batch in loop:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['labels'].to(self.device)

                optimizer.zero_grad()
                outputs = self.model(input_ids, attention_mask=attention_mask, labels=labels)
                loss = outputs.loss
                total_loss += loss.item()

                loss.backward()
                optimizer.step()
                
                loop.set_description(f"Loss: {loss.item():.4f}")

            avg_train_loss = total_loss / len(train_loader)
            print(f"Average Train Loss: {avg_train_loss:.4f}")
            
            # Validation
            self.evaluate(val_loader)

    def evaluate(self, dataloader):
        self.model.eval()
        correct_predictions = 0
        total_predictions = 0

        with torch.no_grad():
            for batch in dataloader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['labels'].to(self.device)

                outputs = self.model(input_ids, attention_mask=attention_mask)
                _, preds = torch.max(outputs.logits, dim=1)

                correct_predictions += torch.sum(preds == labels)
                total_predictions += labels.shape[0]

        acc = correct_predictions.double() / total_predictions
        print(f"Validation Accuracy: {acc:.4f}")
        return acc

    def save(self, path):
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)
        print(f"Model saved to {path}")

    def load(self, path):
        self.model = DistilBertForSequenceClassification.from_pretrained(path)
        self.tokenizer = DistilBertTokenizer.from_pretrained(path)
        self.model.to(self.device)
        print(f"Model loaded from {path}")
