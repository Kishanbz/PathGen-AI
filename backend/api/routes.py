from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import uuid

from database.connection import get_db
from database.models import Roadmap, NodeProgress
from api.schemas import RoadmapRequest, UpdateProgressRequest
from ai.roadmap_generator import generate_roadmap_with_ai

router = APIRouter()

@router.post("/roadmaps/generate")
async def generate_roadmap(request: RoadmapRequest, db: Session = Depends(get_db)):
    """
    Accepts a topic, generates a roadmap via LangChain, saves to DB, and returns the flowchart JSON.
    """
    try:
        # 1. Generate via AI
        generated_data = generate_roadmap_with_ai(request.topic)
        
        # 2. Save to Database
        roadmap_id = str(uuid.uuid4())
        new_roadmap = Roadmap(
            id=roadmap_id,
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
            "data": new_roadmap.flowchart_json
        }
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmaps")
async def list_roadmaps(db: Session = Depends(get_db)):
    """
    Returns a list of popular or recent roadmaps.
    """
    roadmaps = db.query(Roadmap).order_by(Roadmap.created_at.desc()).limit(10).all()
    return {"roadmaps": [{"id": r.id, "topic": r.topic, "visits": r.visits} for r in roadmaps]}

@router.get("/roadmaps/{roadmap_id}")
async def get_roadmap(roadmap_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a specific roadmap's flowchart JSON by ID.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
        
    roadmap.visits += 1
    db.commit()
    
    return {
        "id": roadmap.id,
        "topic": roadmap.topic,
        "data": roadmap.flowchart_json
    }

@router.post("/progress/update")
async def update_progress(request: UpdateProgressRequest, db: Session = Depends(get_db)):
    """
    Updates the completion status of a specific node for the authenticated user.
    """
    # Find existing progress or create new
    # NOTE: Normally we parse user_id from Clerk JWT. Skipping for pure backend logic scaffold.
    user_id = "anonymous" # Placeholder 
    
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
