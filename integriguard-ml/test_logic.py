import asyncio
from app.api.analyse import analyse_submission, AnalysisRequest

async def test():
    print("Testing analysis pipeline locally...")
    # Mock request
    request = AnalysisRequest(
        submission_id="SUB-999",
        text="The quick brown fox jumps over the lazy dog. This is a test of the academic integrity system.",
        student_id="STU-007",
        course_id="CS-101",
        week=1,
        current_grade=90.0,
        speed_delta=0.1
    )
    
    try:
        # Run 4 times to check baseline vs analysis
        for i in range(1, 5):
            print(f"\n--- Submission {i} ---")
            request.week = i
            result = await analyse_submission(request)
            print(f"Status: {result.get('status', 'Full Analysis')}")
            print(f"Score: {result.get('score')}")
            if result.get('poisoned_baseline'):
                print("!!! Poisoned Baseline Detected !!!")
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    asyncio.run(test())
