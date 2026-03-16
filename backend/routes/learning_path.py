from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, LearningPath
from schemas.pydantic_schemas import LearningPathOut, LearningPathUpdate

router = APIRouter(prefix="/api/learning-path", tags=["Learning Path"])


@router.get("/{student_id}", response_model=List[LearningPathOut])
def get_learning_path(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all learning paths for a student."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    paths = db.query(LearningPath).filter(LearningPath.student_id == student_id).all()
    return paths


@router.put("/{student_id}/update", response_model=LearningPathOut)
def update_learning_path(
    student_id: int,
    course_id: int,
    payload: LearningPathUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a student's learning path order (e.g., after performance change)."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    path = (
        db.query(LearningPath)
        .filter(
            LearningPath.student_id == student_id,
            LearningPath.course_id == course_id,
        )
        .first()
    )
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")

    path.ai_generated_order = payload.ai_generated_order
    if payload.status:
        path.status = payload.status

    db.commit()
    db.refresh(path)
    return path
