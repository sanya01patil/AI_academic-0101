import numpy as np
import spacy
from collections import Counter
import re
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load models
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

# Initialize GPT-2 for perplexity
try:
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2", local_files_only=False)
    model = GPT2LMHeadModel.from_pretrained("gpt2", local_files_only=False)
    model.eval()
except Exception as e:
    print(f"Warning: GPT-2 could not be loaded: {e}. Using mock perplexity.")
    tokenizer = None
    model = None

def calculate_perplexity(text: str):
    """Calculates GPT-2 perplexity or returns mock value."""
    if not tokenizer or not model or not text.strip():
        # Mock perplexity based on text length and variation
        return float(len(set(text.split())) / (len(text.split()) + 1) * 100)
        
    encodings = tokenizer(text, return_tensors="pt")
    input_ids = encodings.input_ids
    
    # Simple perplexity calculation
    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss
        perplexity = torch.exp(loss)
        
    return float(perplexity)

def extract_features(text: str):
    """Extracts stylometric features and AI signals."""
    if not nlp:
        # Fallback
        words = re.findall(r'\w+', text.lower())
        perplexity = float(len(set(words)) / (len(words) + 1) * 100) if words else 100.0
        return {
            "word_count": len(words),
            "avg_word_length": float(sum(len(w) for w in words) / len(words)) if words else 0.0,
            "lexical_diversity": float(len(set(words)) / len(words)) if words else 0.0,
            "avg_sentence_length": 0.0,
            "sentence_length_variance": 20.0,
            "perplexity": perplexity,
            "punctuation_density": 0.0,
        }

    doc = nlp(text)
    words = [token.text.lower() for token in doc if not token.is_punct and not token.is_space]
    sentences = list(doc.sents)
    
    # Stylometrics
    avg_word_len = np.mean([len(w) for w in words]) if words else 0
    lexical_diversity = len(set(words)) / len(words) if words else 0
    sentence_lengths = [len(sent) for sent in sentences]
    avg_sent_len = np.mean(sentence_lengths) if sentence_lengths else 0
    sent_len_var = np.var(sentence_lengths) if sentence_lengths else 0
    
    # Perplexity (only for first 512 tokens to avoid context window issues)
    short_text = " ".join(words[:500])
    perplexity = calculate_perplexity(short_text)

    return {
        "avg_word_length": float(avg_word_len),
        "lexical_diversity": float(lexical_diversity),
        "avg_sentence_length": float(avg_sent_len),
        "sentence_length_variance": float(sent_len_var),
        "word_count": len(words),
        "perplexity": perplexity,
        "punctuation_density": float(len([t for t in doc if t.is_punct]) / len(doc)) if len(doc) > 0 else 0
    }
