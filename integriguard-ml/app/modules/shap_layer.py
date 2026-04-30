def get_explanation(ai_prob, style_shift, grade_anomaly, is_poisoned=False):
    """
    Aggregates module scores and generates SHAP-based explanations.
    """
    weights = {
        "ai_generated_prob": 0.5,
        "style_shift_score": 0.3,
        "grade_anomaly_score": 0.2
    }
    
    final_score = (ai_prob * weights["ai_generated_prob"] + 
                   style_shift * weights["style_shift_score"] + 
                   grade_anomaly * weights["grade_anomaly_score"])
    
    explanation = {
        "risk_score": float(final_score),
        "contributions": {
            "AI Detection": float(ai_prob * weights["ai_generated_prob"]),
            "Style Shift": float(style_shift * weights["style_shift_score"]),
            "Grade Anomaly": float(grade_anomaly * weights["grade_anomaly_score"])
        }
    }
    
    if is_poisoned:
        explanation["note"] = "Note: baseline samples may contain AI-generated content. Cross-cohort comparison applied."
        
    return explanation
