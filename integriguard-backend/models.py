"""
SQLAlchemy ORM models matching the Alembic migration schema.
UUIDs are stored as strings for SQLite compatibility (Postgres uses native UUID).
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey
from database import Base


def new_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=new_uuid)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'faculty_admin' | 'student'
    created_at = Column(DateTime, default=datetime.utcnow)


class Course(Base):
    __tablename__ = "courses"
    id = Column(String(36), primary_key=True, default=new_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    faculty_id = Column(String(36), ForeignKey("users.id"))
    baseline_weeks = Column(Integer, default=2)
    high_threshold = Column(Integer, default=70)
    medium_threshold = Column(Integer, default=40)
    alert_sensitivity = Column(String(10), default="medium")
    created_at = Column(DateTime, default=datetime.utcnow)


class Student(Base):
    __tablename__ = "students"
    id = Column(String(36), primary_key=True, default=new_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    student_code = Column(String(20), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    course_id = Column(String(36), ForeignKey("courses.id"))
    year = Column(Integer)
    enrolment_status = Column(String(20), default="active")
    is_esl = Column(Boolean, default=False)
    is_mature = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(String(36), primary_key=True, default=new_uuid)
    student_id = Column(String(36), ForeignKey("students.id"))
    course_id = Column(String(36), ForeignKey("courses.id"))
    assignment_name = Column(String(255))
    version_note = Column(String(255), nullable=True)
    content_text = Column(Text, nullable=False)
    word_count = Column(Integer)
    submitted_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    submission_duration_seconds = Column(Integer, nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(String(36), primary_key=True, default=new_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), unique=True)
    score = Column(Integer, nullable=False)
    ai_prob = Column(Float)
    style_shift = Column(Float)
    grade_anomaly = Column(Float)
    speed_delta = Column(Float)
    shap_explanation = Column(Text)  # JSON string
    baseline_corrupted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class FacultyAction(Base):
    __tablename__ = "faculty_actions"
    id = Column(String(36), primary_key=True, default=new_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"))
    faculty_id = Column(String(36), ForeignKey("users.id"))
    action_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String(36), primary_key=True, default=new_uuid)
    student_id = Column(String(36), ForeignKey("students.id"))
    submission_id = Column(String(36), ForeignKey("submissions.id"))
    signal_type = Column(String(50))
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class BaselineSample(Base):
    __tablename__ = "baseline_samples"
    id = Column(String(36), primary_key=True, default=new_uuid)
    student_id = Column(String(36), ForeignKey("students.id"))
    submission_id = Column(String(36), ForeignKey("submissions.id"))
    week_number = Column(Integer)
    is_corrupted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
