from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, Prediction, Progress, Topic, LearningPath
from schemas.pydantic_schemas import PredictionOut

router = APIRouter(prefix="/api/predictions", tags=["Predictions"])


@router.get("/{student_id}", response_model=List[PredictionOut])
def get_predictions(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return AI performance predictions for a student's upcoming topics.
    Uses a simple heuristic model (average score × topic difficulty weight).
    Full XGBoost model will be added in ai_engine/ later.
    """
    # Get student's progress (completed topics)
    progress_list = db.query(Progress).filter(Progress.student_id == student_id).all()

    if not progress_list:
        return []

    avg_score = sum(p.score for p in progress_list) / len(progress_list)

    # Get upcoming topics from learning path
    paths = db.query(LearningPath).filter(LearningPath.student_id == student_id).all()
    completed_topic_ids = {p.topic_id for p in progress_list}

    existing_predictions = (
        db.query(Prediction).filter(Prediction.student_id == student_id).all()
    )
    predicted_topic_ids = {p.topic_id for p in existing_predictions}

    new_preds = []
    for path in paths:
        topic_ids = path.ai_generated_order or []
        for tid in topic_ids:
            if tid not in completed_topic_ids and tid not in predicted_topic_ids:
                # Simple prediction: average ± small variation
                predicted = min(100.0, max(0.0, avg_score * 0.9))
                confidence = 0.65

                pred = Prediction(
                    student_id=student_id,
                    topic_id=tid,
                    predicted_score=round(predicted, 2),
                    confidence=confidence,
                )
                db.add(pred)
                new_preds.append(pred)
                predicted_topic_ids.add(tid)

    if new_preds:
        db.commit()
        for p in new_preds:
            db.refresh(p)

    return (
        db.query(Prediction)
        .filter(Prediction.student_id == student_id)
        .order_by(Prediction.created_at.desc())
        .all()
    )
