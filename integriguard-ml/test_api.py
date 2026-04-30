import requests
import json

url = "http://localhost:8001/api/v1/analyse"
payload = {
    "submission_id": "SUB-001",
    "text": "The industrial revolution was a period of significant social and economic change. It transformed the way people lived and worked, leading to the rise of factories and urban centers. New technologies like the steam engine played a crucial role in this transformation.",
    "student_id": "STU-123",
    "course_id": "HIST-101",
    "current_grade": 85.0
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
