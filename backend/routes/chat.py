from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from models.db_models import User, ChatHistory
from schemas.pydantic_schemas import ChatMessage, ChatHistoryOut

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])


def _get_ai_response(message: str) -> str:
    """
    Generate a chatbot response.
    Currently returns a smart stub. Will be replaced by LangChain RAG in ai_engine/.
    """
    message_lower = message.lower()

    # Basic keyword-based responses for demo
    if any(w in message_lower for w in ["hello", "hi", "hey"]):
        return "Hello! I'm PathGen AI assistant. How can I help you with your learning today?"
    elif any(w in message_lower for w in ["learning path", "path", "next topic"]):
        return "Your personalized learning path is generated based on your assessment results. Go to the Learning Path section to see your recommended topics."
    elif any(w in message_lower for w in ["score", "performance", "progress"]):
        return "You can view your performance analytics in the Dashboard. Keep completing topics to improve your score!"
    elif any(w in message_lower for w in ["help", "stuck", "understand"]):
        return "Don't worry! Try reviewing the topic content again, or check the recommendations section for related topics."
    elif any(w in message_lower for w in ["quiz", "test", "assessment"]):
        return "Quizzes help us personalize your learning path. Make sure to attempt all questions so the AI can better understand your strengths."
    else:
        return f"That's a great question about '{message[:50]}...'. The full AI response will be powered by LangChain RAG in the next phase. For now, please explore the course materials."


@router.post("/message", response_model=ChatHistoryOut, status_code=201)
def send_message(
    payload: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a message to the AI chatbot and get a response."""
    if current_user.role == "student" and current_user.id != payload.student_id:
        raise HTTPException(status_code=403, detail="Cannot chat as another student")

    ai_response = _get_ai_response(payload.message)

    chat = ChatHistory(
        student_id=payload.student_id,
        session_id=payload.session_id,
        message=payload.message,
        response=ai_response,
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


@router.get("/history/{student_id}", response_model=List[ChatHistoryOut])
def get_chat_history(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all chat history for a student."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return (
        db.query(ChatHistory)
        .filter(ChatHistory.student_id == student_id)
        .order_by(ChatHistory.created_at.asc())
        .all()
    )
