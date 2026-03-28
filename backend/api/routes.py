from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import Optional
from database.connection import get_db
from database.models import Roadmap, NodeProgress, User
from api.schemas import RoadmapRequest, UpdateProgressRequest
from ai.roadmap_generator import generate_roadmap_with_ai
from api.security import get_current_user, get_optional_user

router = APIRouter()

def sync_user(user_id: str, db: Session):
    """
    Ensure the Clerk user exists in our local database.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id)
        db.add(user)
        db.commit()
    return user

@router.post("/roadmaps/generate")
async def generate_roadmap(
    request: RoadmapRequest, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Accepts a topic, generates a roadmap via LangChain, saves to DB, and returns the flowchart JSON.
    """
    try:
        # 1. Generate via AI
        generated_data = generate_roadmap_with_ai(request.topic)
        
        # 2. Sync user and Save to Database
        sync_user(user_id, db)
        roadmap_id = str(uuid.uuid4())
        new_roadmap = Roadmap(
            id=roadmap_id,
            author_id=user_id,
            topic=request.topic,
            description=f"AI Generated roadmap for {request.topic}",
            flowchart_json=generated_data
        )
        db.add(new_roadmap)
        db.commit()
        db.refresh(new_roadmap)
        
        # 3. Return to frontend
        return {
            "id": new_roadmap.id,
            "topic": new_roadmap.topic,
            "title": f"{new_roadmap.topic} Learning Path",
            "nodes": new_roadmap.flowchart_json.get("nodes", []),
            "edges": new_roadmap.flowchart_json.get("edges", []),
            "progress": 0
        }
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmaps")
async def list_roadmaps(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Returns a list of popular or recent roadmaps.
    """
    roadmaps = db.query(Roadmap).order_by(Roadmap.created_at.desc()).limit(10).all()
    return {"roadmaps": [{"id": r.id, "topic": r.topic, "visits": r.visits} for r in roadmaps]}

from api.security import get_current_user, get_optional_user

@router.get("/roadmaps/{roadmap_id}")
async def get_roadmap(
    roadmap_id: str, 
    db: Session = Depends(get_db),
    user_id: Optional[str] = Depends(get_optional_user)
):
    """
    Retrieves a specific roadmap's flowchart JSON by ID.
    If user_id is provided, includes their personal progress.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
        
    roadmap.visits += 1
    db.commit()
    
    nodes = roadmap.flowchart_json.get("nodes", [])
    edges = roadmap.flowchart_json.get("edges", [])
    
    # Apply user progress if authenticated
    user_progress = 0
    if user_id:
        progress_records = db.query(NodeProgress).filter_by(
            user_id=user_id, 
            roadmap_id=roadmap_id
        ).all()
        
        progress_map = {p.node_id: p.status for p in progress_records}
        
        for node in nodes:
            if node["id"] in progress_map:
                node["data"]["status"] = progress_map[node["id"]]
        
        # Calculate overall progress
        total_nodes = len(nodes)
        completed_nodes = sum(1 for n in nodes if n["data"].get("status") in ["done", "skip"])
        user_progress = int((completed_nodes / total_nodes) * 100) if total_nodes > 0 else 0

    return {
        "id": roadmap.id,
        "topic": roadmap.topic,
        "title": f"{roadmap.topic} Learning Path",
        "nodes": nodes,
        "edges": edges,
        "progress": user_progress
    }

@router.post("/progress/update")
async def update_progress(
    request: UpdateProgressRequest, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Updates the completion status of a specific node for the authenticated user.
    """
    # 1. Sync user
    sync_user(user_id, db)
    
    progress = db.query(NodeProgress).filter_by(
        user_id=user_id, 
        roadmap_id=request.roadmap_id, 
        node_id=request.node_id
    ).first()
    
    if progress:
        progress.status = request.status
    else:
        progress = NodeProgress(
            user_id=user_id,
            roadmap_id=request.roadmap_id,
            node_id=request.node_id,
            status=request.status
        )
        db.add(progress)
    
    db.commit()
    return {"success": True, "node_id": request.node_id, "status": request.status}
