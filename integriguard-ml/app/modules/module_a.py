def detect_ai_content(features: dict):
    """
    Detects AI probability based on perplexity and stylometric markers.
    """
    perplexity = features.get("perplexity", 100)
    lexical_diversity = features.get("lexical_diversity", 0.5)
    sent_var = features.get("sentence_length_variance", 20)
    
    # Low perplexity (GPT-2 finds the text predictable) suggests AI
    # High burstiness (sentence variance) suggests human
    # Low lexical diversity suggests AI
    
    # Simple weighted score (mock logic for demo)
    score = 0.0
    
    # Perplexity signal (lower is more AI-like)
    if perplexity < 20: score += 0.6
    elif perplexity < 50: score += 0.3
    
    # Sentence Variance signal (lower is more uniform, AI-like)
    if sent_var < 5: score += 0.2
    
    # Lexical Diversity signal
    if lexical_diversity > 0.8: score -= 0.1
    
    ai_prob = max(0.0, min(1.0, score))
    
    return float(ai_prob)
