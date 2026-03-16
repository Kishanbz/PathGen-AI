from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text,
    ForeignKey, DateTime, JSON, Boolean
)
from sqlalchemy.orm import relationship
from core.database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(150), unique=True, nullable=False, index=True)
    password   = Column(String(255), nullable=False)   # bcrypt hashed
    role       = Column(String(20), nullable=False, default="student")  # student / teacher / admin
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    courses         = relationship("Course", back_populates="teacher")
    learning_paths  = relationship("LearningPath", back_populates="student")
    progress        = relationship("Progress", back_populates="student")
    predictions     = relationship("Prediction", back_populates="student")
    recommendations = relationship("Recommendation", back_populates="student")
    chat_history    = relationship("ChatHistory", back_populates="student")
    reports         = relationship("Report", back_populates="student")


class Course(Base):
    __tablename__ = "courses"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(200), nullable=False)
    subject    = Column(String(100))
    difficulty = Column(String(20))   # beginner / intermediate / advanced
    teacher_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher        = relationship("User", back_populates="courses")
    topics         = relationship("Topic", back_populates="course")
    learning_paths = relationship("LearningPath", back_populates="course")


class Topic(Base):
    __tablename__ = "topics"

    id             = Column(Integer, primary_key=True, index=True)
    course_id      = Column(Integer, ForeignKey("courses.id"))
    title          = Column(String(200), nullable=False)
    order_index    = Column(Integer, default=0)
    estimated_time = Column(Integer)   # in minutes

    # Relationships
    course          = relationship("Course", back_populates="topics")
    content_files   = relationship("ContentFile", back_populates="topic")
    progress        = relationship("Progress", back_populates="topic")
    predictions     = relationship("Prediction", back_populates="topic")
    recommendations = relationship("Recommendation", back_populates="topic")


class ContentFile(Base):
    __tablename__ = "content_files"

    id          = Column(Integer, primary_key=True, index=True)
    topic_id    = Column(Integer, ForeignKey("topics.id"))
    file_type   = Column(String(20))       # pdf / video / quiz
    minio_key   = Column(String(300))      # MinIO object key
    file_metadata = Column(JSON)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    topic = relationship("Topic", back_populates="content_files")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id                 = Column(Integer, primary_key=True, index=True)
    student_id         = Column(Integer, ForeignKey("users.id"))
    course_id          = Column(Integer, ForeignKey("courses.id"))
    ai_generated_order = Column(JSON)       # ordered list of topic IDs from AI
    status             = Column(String(20), default="active")  # active / completed
    created_at         = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="learning_paths")
    course  = relationship("Course", back_populates="learning_paths")


class Progress(Base):
    __tablename__ = "progress"

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(Integer, ForeignKey("users.id"))
    topic_id     = Column(Integer, ForeignKey("topics.id"))
    score        = Column(Float)
    time_spent   = Column(Integer)    # in minutes
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="progress")
    topic   = relationship("Topic", back_populates="progress")


class Prediction(Base):
    __tablename__ = "predictions"

    id              = Column(Integer, primary_key=True, index=True)
    student_id      = Column(Integer, ForeignKey("users.id"))
    topic_id        = Column(Integer, ForeignKey("topics.id"))
    predicted_score = Column(Float)
    confidence      = Column(Float)
    created_at      = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="predictions")
    topic   = relationship("Topic", back_populates="predictions")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    topic_id   = Column(Integer, ForeignKey("topics.id"))
    reason     = Column(Text)
    score      = Column(Float)
    shown_at   = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="recommendations")
    topic   = relationship("Topic", back_populates="recommendations")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String(100))
    message    = Column(Text)
    response   = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="chat_history")


class Report(Base):
    __tablename__ = "reports"

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(Integer, ForeignKey("users.id"))
    period       = Column(String(50))     # e.g. "Week 1 - Mar 2026"
    minio_key    = Column(String(300))
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="reports")
