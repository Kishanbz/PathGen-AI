from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, LearningPath, Topic
from schemas.pydantic_schemas import AssessmentQuestion, AssessmentSubmit, LearningPathOut

router = APIRouter(prefix="/api/assessment", tags=["Assessment"])

# ─── Hardcoded initial diagnostic questions ─────────────────────────────────
SAMPLE_QUESTIONS: List[AssessmentQuestion] = [
    AssessmentQuestion(id=1, question="What is a variable in programming?",
                       options=["A container for data", "A loop", "A function", "A class"],
                       subject="Programming Basics"),
    AssessmentQuestion(id=2, question="Which data structure uses FIFO order?",
                       options=["Stack", "Queue", "Tree", "Graph"],
                       subject="Data Structures"),
    AssessmentQuestion(id=3, question="What does SQL stand for?",
                       options=["Structured Query Language", "Simple Query Logic",
                                "Sequential Query Language", "Standard Query List"],
                       subject="Databases"),
    AssessmentQuestion(id=4, question="Which of the following is a supervised learning algorithm?",
                       options=["K-Means", "DBSCAN", "Linear Regression", "PCA"],
                       subject="Machine Learning"),
    AssessmentQuestion(id=5, question="What is the time complexity of binary search?",
                       options=["O(n)", "O(n²)", "O(log n)", "O(1)"],
                       subject="Algorithms"),
    AssessmentQuestion(id=6, question="Which HTTP method is used to update a resource?",
                       options=["GET", "POST", "PUT", "DELETE"],
                       subject="Web Development"),
    AssessmentQuestion(id=7, question="What is a neural network?",
                       options=["A type of database", "A computing system inspired by the brain",
                                "A sorting algorithm", "A network protocol"],
                       subject="Deep Learning"),
    AssessmentQuestion(id=8, question="What is Git used for?",
                       options=["Running programs", "Version control", "Database management", "UI design"],
                       subject="Dev Tools"),
]

CORRECT_ANSWERS = {1: "A", 2: "B", 3: "A", 4: "C", 5: "C", 6: "C", 7: "B", 8: "B"}


@router.get("/questions", response_model=List[AssessmentQuestion])
def get_questions():
    """Return the diagnostic quiz questions."""
    return SAMPLE_QUESTIONS


@router.post("/submit", response_model=LearningPathOut, status_code=201)
def submit_assessment(
    payload: AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit assessment answers.
    Scores the quiz, then generates a simple AI learning path
    by ordering topics based on student's weak areas.
    """
    if current_user.id != payload.student_id:
        raise HTTPException(status_code=403, detail="Cannot submit for another student")

    # Score the assessment
    correct = 0
    for ans in payload.answers:
        q_id = ans.get("question_id")
        given = ans.get("answer")
        if CORRECT_ANSWERS.get(q_id) == given:
            correct += 1

    score_pct = (correct / len(SAMPLE_QUESTIONS)) * 100

    # Fetch all topics for the course
    topics = (
        db.query(Topic)
        .filter(Topic.course_id == payload.course_id)
        .order_by(Topic.order_index)
        .all()
    )
    topic_ids = [t.id for t in topics]

    # Simple AI stub: if score < 50%, reverse order (needs more fundamentals)
    if score_pct < 50:
        topic_ids = list(reversed(topic_ids))

    # Check if a path already exists
    existing_path = (
        db.query(LearningPath)
        .filter(
            LearningPath.student_id == payload.student_id,
            LearningPath.course_id == payload.course_id,
        )
        .first()
    )

    if existing_path:
        existing_path.ai_generated_order = topic_ids
        db.commit()
        db.refresh(existing_path)
        return existing_path

    path = LearningPath(
        student_id=payload.student_id,
        course_id=payload.course_id,
        ai_generated_order=topic_ids,
        status="active",
    )
    db.add(path)
    db.commit()
    db.refresh(path)
    return path
