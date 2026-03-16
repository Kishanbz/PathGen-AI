from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Progress
from schemas.pydantic_schemas import ProgressUpdate, ProgressOut

router = APIRouter(prefix="/api/progress", tags=["Progress"])


@router.post("/update", response_model=ProgressOut, status_code=201)
def update_progress(
    payload: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record or update student progress for a topic."""
    if current_user.role == "student" and current_user.id != payload.student_id:
        raise HTTPException(status_code=403, detail="Cannot update another student's progress")

    # Check if progress entry already exists for this student+topic
    existing = (
        db.query(Progress)
        .filter(
            Progress.student_id == payload.student_id,
            Progress.topic_id == payload.topic_id,
        )
        .first()
    )

    if existing:
        existing.score = payload.score
        existing.time_spent = payload.time_spent
        db.commit()
        db.refresh(existing)
        return existing

    entry = Progress(
        student_id=payload.student_id,
        topic_id=payload.topic_id,
        score=payload.score,
        time_spent=payload.time_spent,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/{student_id}", response_model=List[ProgressOut])
def get_progress(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full progress history for a student."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Progress).filter(Progress.student_id == student_id).all()
