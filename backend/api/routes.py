from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from typing import Optional
from database.connection import get_db
from database.models import Roadmap, NodeProgress, User
from api.schemas import RoadmapRequest, UpdateProgressRequest, TutorRequest, TutorResponse
from ai.roadmap_generator import generate_roadmap_with_ai
from ai.tutor_service import ask_ai_tutor
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
 
from fastapi.responses import StreamingResponse
import json
 
@router.get("/roadmaps/generate/stream")
async def generate_roadmap_stream_endpoint(
    topic: str,
    user_id: str = Depends(get_current_user)
):
    """
    Streams the roadmap generation as it happens.
    """
    from ai.roadmap_generator import generate_roadmap_stream
    
    def event_generator():
        for chunk in generate_roadmap_stream(topic):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield "data: [DONE]\n\n"
 
    return StreamingResponse(event_generator(), media_type="text/event-stream")

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
            "title": f"{new_roadmap.topic} ",
            "nodes": new_roadmap.flowchart_json.get("nodes", []),
            "edges": new_roadmap.flowchart_json.get("edges", []),
            "progress": 0
        }
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmaps/search")
async def search_roadmaps(
    q: str,
    db: Session = Depends(get_db)
):
    """
    Searches roadmaps by topic name. Only returns published roadmaps.
    """
    roadmaps = db.query(Roadmap).filter(
        Roadmap.topic.ilike(f"%{q}%"),
        Roadmap.is_published != 0
    ).limit(20).all()
    return {"roadmaps": [{"id": r.id, "topic": r.topic, "visits": r.visits} for r in roadmaps]}

@router.get("/roadmaps")
async def list_roadmaps(
    db: Session = Depends(get_db)
):
    """
    Returns a list of popular or recent published roadmaps.
    """
    roadmaps = db.query(Roadmap).filter(Roadmap.is_published != 0).order_by(Roadmap.created_at.desc()).limit(10).all()
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
    Private roadmaps are only accessible by the owner.
    Public roadmaps are accessible by anyone with the link.
    If user_id is provided, includes their personal progress.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Check access permissions:
    # - Owner can always access
    # - Public roadmaps can be accessed by anyone
    # - Private roadmaps only by owner
    is_owner = user_id == roadmap.author_id
    if not is_owner and roadmap.is_published == 0:
        raise HTTPException(status_code=403, detail="This roadmap is private")
        
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
        "title": f"{roadmap.topic} ",
        "nodes": nodes,
        "edges": edges,
        "progress": user_progress,
        "is_published": roadmap.is_published == 1,
        "is_owner": user_id == roadmap.author_id
    }

@router.post("/roadmaps/{roadmap_id}/publish")
async def toggle_publish_roadmap(
    roadmap_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Toggle the publish status of a roadmap.
    Only the owner can publish/unpublish their roadmap.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Check if user is the owner
    if roadmap.author_id != user_id:
        raise HTTPException(status_code=403, detail="You can only publish your own roadmaps")
    
    # Toggle publish status
    roadmap.is_published = 0 if roadmap.is_published != 0 else 1
    db.commit()
    
    return {
        "success": True, 
        "is_published": roadmap.is_published == 1,
        "message": "Roadmap published" if roadmap.is_published == 1 else "Roadmap made private"
    }

@router.delete("/roadmaps/{roadmap_id}")
async def delete_roadmap(
    roadmap_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Deletes a roadmap and its associated progress records.
    Only the author can delete their own roadmap.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Check if user is the author
    if roadmap.author_id != user_id:
        raise HTTPException(status_code=403, detail="You can only delete your own roadmaps")
    
    # Delete associated progress records first
    db.query(NodeProgress).filter(NodeProgress.roadmap_id == roadmap_id).delete()
    
    # Delete the roadmap
    db.delete(roadmap)
    db.commit()
    
    return {"success": True, "message": "Roadmap deleted successfully"}

@router.get("/user/roadmaps")
async def get_user_roadmaps(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Returns all roadmaps created by the current user or where they have progress.
    """
    # Simply return roadmaps created by the user for now
    roadmaps = db.query(Roadmap).filter(Roadmap.author_id == user_id).order_by(Roadmap.created_at.desc()).all()
    
    # Batch query all NodeProgress for the user to optimize and avoid N+1 query pattern
    all_progress = db.query(NodeProgress).filter_by(user_id=user_id).all()
    progress_by_roadmap = {}
    for p in all_progress:
        if p.roadmap_id not in progress_by_roadmap:
            progress_by_roadmap[p.roadmap_id] = []
        progress_by_roadmap[p.roadmap_id].append(p)
        
    result = []
    for r in roadmaps:
        # Calculate individual progress for each roadmap
        nodes = r.flowchart_json.get("nodes", []) if r.flowchart_json else []
        total_nodes = len(nodes)
        
        progress_records = progress_by_roadmap.get(r.id, [])
        
        completed_nodes = sum(1 for p in progress_records if p.status in ["done", "skip"])
        progress_val = int((completed_nodes / total_nodes) * 100) if total_nodes > 0 else 0
        
        result.append({
            "id": r.id,
            "topic": r.topic,
            "title": f"{r.topic} ",
            "progress": progress_val,
            "totalNodes": total_nodes,
            "completedNodes": completed_nodes,
            "created_at": r.created_at,
            "is_published": r.is_published == 1
        })
        
    return {"roadmaps": result}

@router.get("/user/stats")
async def get_user_stats(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """
    Returns total completed roadmaps and topics mastered.
    Optimized: fetches all data in 2 queries instead of N+2.
    """
    # Only 2 DB queries total
    progress_records = db.query(NodeProgress).filter_by(user_id=user_id).all()
    user_roadmaps = db.query(Roadmap).filter(Roadmap.author_id == user_id).all()
    
    mastered = sum(1 for p in progress_records if p.status == "done")
    
    # Group progress by roadmap_id in memory (no extra queries)
    done_by_roadmap = {}
    for p in progress_records:
        if p.status == "done":
            done_by_roadmap[p.roadmap_id] = done_by_roadmap.get(p.roadmap_id, 0) + 1
    
    completed_roadmaps = 0
    for r in user_roadmaps:
        total = len(r.flowchart_json.get("nodes", []))
        if total > 0 and done_by_roadmap.get(r.id, 0) >= total:
            completed_roadmaps += 1
            
    return {
        "roadmaps_completed": completed_roadmaps,
        "topics_mastered": mastered,
        "active_roadmaps": len(user_roadmaps)
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

@router.post("/tutor/ask", response_model=TutorResponse)
async def tutor_ask(request: TutorRequest):
    """
    Chat endpoint for the AI Tutor.
    """
    answer = ask_ai_tutor(request.topic, request.question, request.history)
    return TutorResponse(answer=answer)
