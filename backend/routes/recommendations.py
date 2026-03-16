from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Recommendation, Progress, Topic
from schemas.pydantic_schemas import RecommendationOut

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("/{student_id}", response_model=List[RecommendationOut])
def get_recommendations(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return AI topic recommendations for a student.
    Logic: find topics the student hasn't completed or scored below 70%,
    and recommend them with a reason.
    """
    # Get all existing recommendations first
    existing = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student_id)
        .order_by(Recommendation.shown_at.desc())
        .all()
    )

    # Auto-generate new recommendations based on progress
    completed_progress = (
        db.query(Progress)
        .filter(Progress.student_id == student_id)
        .all()
    )
    completed_map = {p.topic_id: p.score for p in completed_progress}

    # Find weak topics (score < 70) and generate recommendations
    new_recs = []
    for topic_id, score in completed_map.items():
        if score < 70:
            # Check if recommendation already exists
            already_exists = any(r.topic_id == topic_id for r in existing)
            if not already_exists:
                rec = Recommendation(
                    student_id=student_id,
                    topic_id=topic_id,
                    reason=f"Your score was {score:.1f}%. This topic needs revision.",
                    score=score,
                )
                db.add(rec)
                new_recs.append(rec)

    if new_recs:
        db.commit()
        for r in new_recs:
            db.refresh(r)

    all_recs = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student_id)
        .order_by(Recommendation.shown_at.desc())
        .limit(10)
        .all()
    )
    return all_recs
