from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from .connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Clerk User ID
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(String, primary_key=True, index=True)
    author_id = Column(String, ForeignKey("users.id"), nullable=True) # None = anonymous
    topic = Column(String, index=True)
    description = Column(Text)
    flowchart_json = Column(JSON) # Stores React Flow nodes and edges
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    visits = Column(Integer, default=0)

class NodeProgress(Base):
    __tablename__ = "node_progress"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"))
    roadmap_id = Column(String, ForeignKey("roadmaps.id"))
    node_id = Column(String) # The ID of the node in the React Flow graph
    status = Column(String) # 'done', 'skip'
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
