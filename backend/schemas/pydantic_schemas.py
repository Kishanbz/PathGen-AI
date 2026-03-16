from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "student"   # student / teacher / admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Course Schemas ──────────────────────────────────────────────────────────

class CourseCreate(BaseModel):
    title: str
    subject: Optional[str] = None
    difficulty: Optional[str] = "beginner"

class CourseOut(BaseModel):
    id: int
    title: str
    subject: Optional[str]
    difficulty: Optional[str]
    teacher_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Topic Schemas ───────────────────────────────────────────────────────────

class TopicCreate(BaseModel):
    course_id: int
    title: str
    order_index: int = 0
    estimated_time: Optional[int] = None

class TopicOut(BaseModel):
    id: int
    course_id: int
    title: str
    order_index: int
    estimated_time: Optional[int]

    class Config:
        from_attributes = True


# ─── Content Schemas ─────────────────────────────────────────────────────────

class ContentFileOut(BaseModel):
    id: int
    topic_id: int
    file_type: str
    minio_key: str
    file_metadata: Optional[Any]
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ─── Learning Path Schemas ───────────────────────────────────────────────────

class LearningPathOut(BaseModel):
    id: int
    student_id: int
    course_id: int
    ai_generated_order: Optional[Any]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class LearningPathUpdate(BaseModel):
    ai_generated_order: List[int]
    status: Optional[str] = None


# ─── Progress Schemas ────────────────────────────────────────────────────────

class ProgressUpdate(BaseModel):
    student_id: int
    topic_id: int
    score: float
    time_spent: int   # minutes

class ProgressOut(BaseModel):
    id: int
    student_id: int
    topic_id: int
    score: float
    time_spent: int
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# ─── Assessment Schemas ──────────────────────────────────────────────────────

class AssessmentQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    subject: str

class AssessmentSubmit(BaseModel):
    student_id: int
    course_id: int
    answers: List[dict]   # [{"question_id": 1, "answer": "B"}, ...]


# ─── Prediction Schemas ──────────────────────────────────────────────────────

class PredictionOut(BaseModel):
    id: int
    student_id: int
    topic_id: int
    predicted_score: float
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Recommendation Schemas ──────────────────────────────────────────────────

class RecommendationOut(BaseModel):
    id: int
    student_id: int
    topic_id: int
    reason: Optional[str]
    score: Optional[float]
    shown_at: datetime

    class Config:
        from_attributes = True


# ─── Chat Schemas ─────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    student_id: int
    session_id: str
    message: str

class ChatHistoryOut(BaseModel):
    id: int
    student_id: int
    session_id: str
    message: str
    response: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Report Schemas ──────────────────────────────────────────────────────────

class ReportOut(BaseModel):
    id: int
    student_id: int
    period: Optional[str]
    minio_key: Optional[str]
    generated_at: datetime

    class Config:
        from_attributes = True


# ─── Admin Schemas ───────────────────────────────────────────────────────────

class PlatformAnalytics(BaseModel):
    total_users: int
    total_students: int
    total_teachers: int
    total_courses: int
    total_topics: int
    total_progress_entries: int
