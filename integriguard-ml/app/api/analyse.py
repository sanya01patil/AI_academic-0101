from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..modules.module_a import detect_ai_content
from ..modules.module_b import check_style_consistency
from ..modules.module_c import detect_grade_anomaly
from ..modules.shap_layer import get_explanation
from ..utils.text_features import extract_features
from ..utils.baseline import store_baseline_sample, get_student_samples

router = APIRouter()

class AnalysisRequest(BaseModel):
    submission_id: str
    text: str
    student_id: str
    course_id: str
    week: int = 1
    current_grade: Optional[float] = None
    speed_delta: Optional[float] = None # Time deviation signal

@router.post("/analyse")
async def analyse_submission(request: AnalysisRequest):
    try:
        # 1. Extract features & AI Prob
        features = extract_features(request.text)
        ai_prob = detect_ai_content(features)
        
        # 2. Check baseline status
        existing_samples = get_student_samples(request.student_id, request.course_id)
        sample_count = len(existing_samples)
        
        if sample_count < 3:
            # Store as baseline and return null score
            store_baseline_sample(
                request.student_id, 
                request.course_id, 
                request.text, 
                request.week, 
                ai_prob
            )
            return {
                "submission_id": request.submission_id,
                "score": None,
                "status": f"Baseline sample {sample_count + 1}/3 stored.",
                "ai_prob": ai_prob,
                "features": features
            }
        
        # 3. Full Analysis (samples >= 3)
        style_shift, style_msg, is_poisoned = check_style_consistency(
            request.student_id, 
            request.course_id, 
            request.text
        )
        
        grade_anomaly, grade_msg = detect_grade_anomaly(
            request.current_grade, 
            request.speed_delta
        )
        
        # 4. Aggregate and Explain
        explanation = get_explanation(ai_prob, style_shift, grade_anomaly, is_poisoned)
        
        return {
            "submission_id": request.submission_id,
            "score": explanation["risk_score"],
            "ai_prob": ai_prob,
            "style_shift": style_shift,
            "grade_anomaly": grade_anomaly,
            "shap_explanation": explanation["contributions"],
            "poisoned_baseline": is_poisoned,
            "signals": {
                "style_consistency": style_msg,
                "grade_status": grade_msg
            },
            "features": features
        }
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
