import requests
import time
import os
import subprocess

def test_backend_health():
    print("Testing Backend Health...")
    try:
        resp = requests.get("http://localhost:8000/")
        print(f"Backend Response: {resp.status_code} - {resp.json()}")
        return True
    except Exception as e:
        print(f"Backend Error: {e}")
        return False

def test_ml_health():
    print("Testing ML Service Health...")
    try:
        resp = requests.get("http://localhost:8001/")
        print(f"ML Service Response: {resp.status_code} - {resp.json()}")
        return True
    except Exception as e:
        print(f"ML Service Error: {e}")
        return False

def test_full_integration():
    print("Testing Full Integration (Submission -> ML -> DB)...")
    try:
        # 1. Create a submission
        payload = {
            "text": "This is a test submission for integration testing. It should be long enough to be processed.",
            "course_id": "COURSE-001",
            "assignment_name": "Integration Test",
            "student_id": "ST-999"
        }
        resp = requests.post("http://localhost:8000/api/submissions/text", json=payload)
        print(f"Submission Response: {resp.status_code} - {resp.json()}")
        
        if resp.status_code == 200:
            sub_id = resp.json().get("submission_id")
            # 2. Check if it was analyzed
            time.sleep(2) # Wait for async processing if any (though backend seems to wait for ML)
            resp = requests.get(f"http://localhost:8000/api/submissions/{sub_id}")
            print(f"Submission Details: {resp.status_code} - {resp.json()}")
            return True
        return False
    except Exception as e:
        print(f"Integration Error: {e}")
        return False

if __name__ == "__main__":
    print("--- IntegriGuard System Connectivity Test ---")
    
    # Note: This script assumes services are already running.
    # If they are not running, we could try to start them, but that might be complex in this environment.
    
    backend_up = test_backend_health()
    ml_up = test_ml_health()
    
    if backend_up and ml_up:
        test_full_integration()
    else:
        print("Skipping integration test as services are down.")
        print("\nTo start the services, run:")
        print("1. In root: npm run dev (Frontend)")
        print("2. In integriguard-backend: python main.py")
        print("3. In integriguard-ml: python main.py")
