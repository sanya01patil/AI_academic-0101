from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User, Course, Student, Submission, RiskScore
import uuid
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded.")
            return

        print("Seeding database...")
        
        # 1. Create a faculty user
        faculty = User(
            id="FAC-001",
            email="dr.smith@university.edu",
            password_hash="hashed_password",
            full_name="Dr. Sarah Smith",
            role="faculty_admin"
        )
        db.add(faculty)
        
        # 2. Create a course
        course = Course(
            id="COURSE-CS101",
            name="Introduction to Computer Science",
            code="CS101",
            faculty_id="FAC-001"
        )
        db.add(course)
        
        # 3. Create a student
        student = Student(
            id="STU-001",
            student_code="S12345",
            full_name="John Doe",
            course_id="COURSE-CS101",
            year=1
        )
        db.add(student)
        
        # 4. Create a submission
        sub = Submission(
            id="SUB-001",
            student_id="STU-001",
            course_id="COURSE-CS101",
            assignment_name="Final Essay",
            content_text="This is a seeded submission for testing purposes.",
            word_count=10,
            submitted_at=datetime.utcnow() - timedelta(days=1),
            status="analysed"
        )
        db.add(sub)
        
        # 5. Add a risk score
        rs = RiskScore(
            id=str(uuid.uuid4()),
            submission_id="SUB-001",
            score=75,
            ai_prob=0.85,
            style_shift=0.4,
            grade_anomaly=0.1,
            shap_explanation='{"ai_content": 0.6, "style_shift": 0.2, "grade_anomaly": -0.05}',
            created_at=datetime.utcnow()
        )
        db.add(rs)
        
        db.commit()
        print("Seeding complete.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
