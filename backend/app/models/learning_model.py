from sqlalchemy import Column, String, Text, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base
from datetime import datetime
import uuid

class Roadmap(Base):
    """Roadmap model for storing learning paths."""
    
    __tablename__ = 'roadmaps'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=True, index=True) # Null for system roadmaps
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(String(50), default='beginner') # beginner, intermediate, advanced
    duration = Column(String(50)) # e.g., "12 hours", "6 months"
    track = Column(String(100)) # backend, frontend, ai, fullstack
    
    is_custom = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    phases = relationship("RoadmapPhase", back_populates="roadmap", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'level': self.level,
            'duration': self.duration,
            'track': self.track,
            'is_custom': self.is_custom,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'phases': [phase.to_dict() for phase in sorted(self.phases, key=lambda x: x.order)]
        }

class RoadmapPhase(Base):
    """Phase within a roadmap."""
    
    __tablename__ = 'roadmap_phases'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    roadmap_id = Column(String(36), ForeignKey('roadmaps.id'), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    order = Column(Integer, default=0)
    
    roadmap = relationship("Roadmap", back_populates="phases")
    topics = relationship("Topic", back_populates="phase", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'roadmap_id': self.roadmap_id,
            'title': self.title,
            'order': self.order,
            'topics': [topic.to_dict() for topic in sorted(self.topics, key=lambda x: x.order)]
        }

class Topic(Base):
    """Individual learning topic or lesson."""
    
    __tablename__ = 'topics'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phase_id = Column(String(36), ForeignKey('roadmap_phases.id'), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text)
    content = Column(Text) # Optional detailed content or lesson material
    order = Column(Integer, default=0)
    estimated_time = Column(String(50)) # e.g., "30 mins"
    
    phase = relationship("RoadmapPhase", back_populates="topics")
    
    def to_dict(self):
        return {
            'id': self.id,
            'phase_id': self.phase_id,
            'title': self.title,
            'description': self.description,
            'content': self.content,
            'order': self.order,
            'estimated_time': self.estimated_time
        }

class LearningProgress(Base):
    """User progress for a specific topic."""
    
    __tablename__ = 'learning_progress'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)
    topic_id = Column(String(36), ForeignKey('topics.id'), nullable=False, index=True)
    
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'topic_id': self.topic_id,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
