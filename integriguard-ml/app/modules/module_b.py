import numpy as np
from ..utils.baseline import get_student_samples, get_cohort_mean_embedding, embedder

def check_style_consistency(student_id: str, course_id: str, text: str):
    """
    Compares current submission embedding with baseline/cohort embeddings.
    """
    current_vector = embedder.encode(text)
    
    samples = get_student_samples(student_id, course_id)
    baseline_vectors = [s.vector for s in samples]
    
    # Check for poisoned baseline (average ai_prob > 0.7)
    is_poisoned = False
    if samples:
        avg_ai_prob = np.mean([s.payload["ai_prob"] for s in samples])
        if avg_ai_prob > 0.7:
            is_poisoned = True

    if not baseline_vectors or is_poisoned:
        # Fallback to cohort comparison
        cohort_mean = get_cohort_mean_embedding(course_id)
        if cohort_mean is None:
            return 0.0, "New student, no cohort data.", is_poisoned
        
        target_vector = cohort_mean
        ref_msg = "Compared against cohort mean (baseline missing/poisoned)."
    else:
        # Compare against student's own baseline mean
        target_vector = np.mean(baseline_vectors, axis=0)
        ref_msg = "Compared against student baseline."

    # Cosine similarity
    similarity = np.dot(current_vector, target_vector) / (np.linalg.norm(current_vector) * np.linalg.norm(target_vector))
    
    # Score is 1 - similarity (higher shift = higher score)
    shift_score = max(0.0, 1.0 - similarity)
    
    return float(shift_score), ref_msg, is_poisoned
