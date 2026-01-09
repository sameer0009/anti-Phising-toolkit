import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import os

class URLCNNModel:
    """
    1D CNN for URL character-level analysis.
    """
    def __init__(self, max_len=200, max_features=10000, embedding_dim=50):
        self.max_len = max_len
        self.max_features = max_features
        self.embedding_dim = embedding_dim
        self.tokenizer = Tokenizer(char_level=True, filters=None, lower=True)
        self.model = self._build_model()

    def _build_model(self):
        model = Sequential()
        model.add(Embedding(self.max_features, self.embedding_dim, input_length=self.max_len))
        model.add(Conv1D(128, 5, activation='relu'))
        model.add(GlobalMaxPooling1D())
        model.add(Dense(64, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(1, activation='sigmoid'))
        
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model

    def fit_tokenizer(self, urls):
        """
        Fits the character-level tokenizer on a list of URLs.
        """
        self.tokenizer.fit_on_texts(urls)

    def preprocess(self, urls):
        """
        Converts URLs to padded sequences.
        """
        sequences = self.tokenizer.texts_to_sequences(urls)
        return pad_sequences(sequences, maxlen=self.max_len)

    def train(self, X_train, y_train, X_val, y_val, epochs=5, batch_size=32):
        X_train_seq = self.preprocess(X_train)
        X_val_seq = self.preprocess(X_val)

        print("Training URL CNN...")
        history = self.model.fit(
            X_train_seq, np.array(y_train),
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_val_seq, np.array(y_val)),
            verbose=1
        )
        return history

    def predict(self, X):
        X_seq = self.preprocess(X)
        return self.model.predict(X_seq).flatten()

    def save(self, path):
        self.model.save(path + '.h5')
        import pickle
        with open(path + '_tokenizer.pkl', 'wb') as f:
            pickle.dump(self.tokenizer, f)
        print(f"Model saved to {path}.h5")

    def load(self, path):
        if os.path.exists(path + '.h5'):
            self.model = tf.keras.models.load_model(path + '.h5')
            import pickle
            with open(path + '_tokenizer.pkl', 'rb') as f:
                self.tokenizer = pickle.load(f)
            print(f"Model loaded from {path}")
        else:
            print(f"Model file {path} not found.")
