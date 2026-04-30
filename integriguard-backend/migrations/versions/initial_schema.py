"""initial schema

Revision ID: initial_schema_001
Revises: 
Create Date: 2026-04-30 02:48:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'initial_schema_001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Enable pgcrypto for gen_random_uuid()
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    # 1. Users Table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(20), nullable=False), # 'faculty_admin' | 'student'
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 2. Courses Table
    op.create_table(
        'courses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('code', sa.String(20), unique=True, nullable=False),
        sa.Column('faculty_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('baseline_weeks', sa.Integer, server_default='2'),
        sa.Column('high_threshold', sa.Integer, server_default='70'),
        sa.Column('medium_threshold', sa.Integer, server_default='40'),
        sa.Column('alert_sensitivity', sa.String(10), server_default='medium'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 3. Students Table
    op.create_table(
        'students',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('student_code', sa.String(20), unique=True, nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id')),
        sa.Column('year', sa.Integer),
        sa.Column('enrolment_status', sa.String(20), server_default='active'),
        sa.Column('is_esl', sa.Boolean, server_default='false'),
        sa.Column('is_mature', sa.Boolean, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 4. Submissions Table
    op.create_table(
        'submissions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id')),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('courses.id')),
        sa.Column('assignment_name', sa.String(255)),
        sa.Column('content_text', sa.Text, nullable=False),
        sa.Column('word_count', sa.Integer),
        sa.Column('submitted_at', sa.TIMESTAMP, nullable=False),
        sa.Column('submission_duration_seconds', sa.Integer, nullable=True),
        sa.Column('status', sa.String(20), server_default='pending'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 5. Risk Scores Table
    op.create_table(
        'risk_scores',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('submissions.id'), unique=True),
        sa.Column('score', sa.Integer, nullable=False), # 0-100
        sa.Column('ai_prob', sa.Float),
        sa.Column('style_shift', sa.Float),
        sa.Column('grade_anomaly', sa.Float),
        sa.Column('speed_delta', sa.Float),
        sa.Column('shap_explanation', sa.Text),
        sa.Column('baseline_corrupted', sa.Boolean, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 6. Faculty Actions Table
    op.create_table(
        'faculty_actions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('submissions.id')),
        sa.Column('faculty_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id')),
        sa.Column('action_type', sa.String(50), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 7. Alerts Table
    op.create_table(
        'alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id')),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('submissions.id')),
        sa.Column('signal_type', sa.String(50)),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('read', sa.Boolean, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # 8. Baseline Samples Table
    op.create_table(
        'baseline_samples',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('students.id')),
        sa.Column('submission_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('submissions.id')),
        sa.Column('week_number', sa.Integer),
        sa.Column('is_corrupted', sa.Boolean, server_default='false'),
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now())
    )

    # Indexes
    op.create_index('idx_submissions_student_date', 'submissions', ['student_id', sa.text('submitted_at DESC')])
    op.create_index('idx_risk_scores_score', 'risk_scores', [sa.text('score DESC')])
    op.create_index('idx_alerts_read_date', 'alerts', ['read', sa.text('created_at DESC')])
    op.create_index('idx_faculty_actions_submission', 'faculty_actions', ['submission_id'])

def downgrade():
    op.drop_index('idx_faculty_actions_submission')
    op.drop_index('idx_alerts_read_date')
    op.drop_index('idx_risk_scores_score')
    op.drop_index('idx_submissions_student_date')
    
    op.drop_table('baseline_samples')
    op.drop_table('alerts')
    op.drop_table('faculty_actions')
    op.drop_table('risk_scores')
    op.drop_table('submissions')
    op.drop_table('students')
    op.drop_table('courses')
    op.drop_table('users')
