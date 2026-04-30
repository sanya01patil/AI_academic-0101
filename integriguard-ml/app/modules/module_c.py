def detect_grade_anomaly(current_grade: float, speed_delta: float):
    """
    Detects anomalies in grade and speed of completion.
    speed_delta: deviation from student's average completion time.
    """
    anomaly_score = 0.0
    signals = []
    
    if current_grade and current_grade > 95:
        anomaly_score += 0.2
        signals.append("Exceptional grade")
        
    if speed_delta and speed_delta > 0.5: # 50% faster than average
        anomaly_score += 0.3
        signals.append("High completion speed")
        
    return float(min(1.0, anomaly_score)), ", ".join(signals) if signals else "Normal performance markers"
