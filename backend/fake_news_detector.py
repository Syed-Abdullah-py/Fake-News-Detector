import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import pandas as pd

# Global model and vector
vector = None
LR = None

def wordOpt(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d', '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def fake_news_detect(news):
    global vector, LR
    if vector is None or LR is None:
        train_model()

    news_file = {"text": [news]}
    news_df = pd.DataFrame(news_file)
    news_df["text"] = news_df["text"].apply(wordOpt)
    news_xv_test = vector.transform(news_df["text"])
    news_pred = LR.predict(news_xv_test)
    return news_pred[0]


def train_model():
    global vector, LR

    true_df = pd.read_csv("True.csv")
    fake_df = pd.read_csv("Fake.csv")

    # Labeling
    true_df['label'] = 1
    fake_df['label'] = 0

    # Balance classes
    min_len = min(len(true_df), len(fake_df))
    true_df = true_df.sample(min_len, random_state=42)
    fake_df = fake_df.sample(min_len, random_state=42)

    # Combine and shuffle
    news_df = pd.concat([true_df, fake_df], ignore_index=True)
    news_df = news_df.drop(columns=['title', 'subject', 'date'], errors='ignore')
    news_df['text'] = news_df['text'].apply(wordOpt)
    news_df = news_df.sample(frac=1, random_state=42).reset_index(drop=True)

    X = news_df['text']
    Y = news_df['label']

    x_train, _, y_train, _ = train_test_split(X, Y, test_size=0.2, random_state=42)

    vector = TfidfVectorizer()
    x_train_vectorized = vector.fit_transform(x_train)

    LR = LogisticRegression()
    LR.fit(x_train_vectorized, y_train)

    # Make predictions and print classification report
    x_test, _, y_test, _ = train_test_split(X, Y, test_size=0.2, random_state=42)
    x_test_vectorized = vector.transform(x_test)
    y_pred = LR.predict(x_test_vectorized)
    print(classification_report(y_test, y_pred))

train_model()