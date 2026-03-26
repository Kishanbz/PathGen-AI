from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class RoadmapRequest(BaseModel):
    topic: str = Field(..., description="The user's requested topic for the learning roadmap")

class UpdateProgressRequest(BaseModel):
    roadmap_id: str
    node_id: str
    status: str

# These schemas match the React Flow data structure
class ResourceURL(BaseModel):
    title: str
    url: str
    channel: Optional[str] = None

class NodeResources(BaseModel):
    youtube: List[ResourceURL] = Field(default_factory=list)
    articles: List[ResourceURL] = Field(default_factory=list)

class NodeData(BaseModel):
    label: str
    description: str = Field(description="A brief 2-3 sentence explanation of this topic")
    status: str = Field(default="pending", description="'pending', 'done', or 'skip'")
    type: str = Field(description="'theory', 'practice', 'tool', etc.")
    resources: NodeResources

class FlowchartNode(BaseModel):
    id: str = Field(description="Unique string ID like 'node-1'")
    type: str = Field(default="custom", description="Must strictly be 'custom'")
    position: Dict[str, float] = Field(description="Dict with 'x' and 'y' floats. Stagger nodes vertically and horizontally as a tree.")
    data: NodeData

class FlowchartEdge(BaseModel):
    id: str = Field(description="Unique string ID like 'edge-1'")
    source: str = Field(description="ID of the parent node")
    target: str = Field(description="ID of the child node")

class GeneratedRoadmapData(BaseModel):
    nodes: List[FlowchartNode]
    edges: List[FlowchartEdge]
