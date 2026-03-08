from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer, ForeignKey
from database.db import Base
from datetime import datetime
import uuid

class Task(Base):
    """Task model for productivity management."""
    
    __tablename__ = 'tasks'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Task status and priority
    status = Column(String(50), default='pending')  # pending, in_progress, completed
    priority = Column(String(50), default='medium')  # low, medium, high
    
    # Task metadata
    category = Column(String(100))  # learning, practice, project, etc.
    topic = Column(String(100))  # specific topic related to the task
    
    # Time tracking
    estimated_hours = Column(Integer)  # Estimated time in hours
    actual_hours = Column(Integer)  # Actual time spent
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Learning track context
    learning_track = Column(String(100))  # backend, frontend, ai, fullstack
    
    def __repr__(self):
        return f"<Task {self.title}>"
    
    def to_dict(self):
        """Convert task to dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'category': self.category,
            'topic': self.topic,
            'estimated_hours': self.estimated_hours,
            'actual_hours': self.actual_hours,
            'learning_track': self.learning_track,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
