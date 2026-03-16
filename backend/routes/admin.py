from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import require_role
from models.db_models import User, Course, Topic, Progress
from schemas.pydantic_schemas import UserOut, PlatformAnalytics

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """List all registered users (Admin only)."""
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/analytics", response_model=PlatformAnalytics)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Get platform-wide analytics (Admin only)."""
    total_users    = db.query(User).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    total_courses  = db.query(Course).count()
    total_topics   = db.query(Topic).count()
    total_progress = db.query(Progress).count()

    return PlatformAnalytics(
        total_users=total_users,
        total_students=total_students,
        total_teachers=total_teachers,
        total_courses=total_courses,
        total_topics=total_topics,
        total_progress_entries=total_progress,
    )
