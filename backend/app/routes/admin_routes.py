from flask import Blueprint, request, current_app
from app.utils import (
    success_response,
    error_response,
    require_auth,
    admin_guard,
    not_found_response
)
from app.models.user_model import User
from app.models.project_model import Project
from app.models.learning_model import Roadmap, LearningProgress
from datetime import datetime, timedelta
import sqlalchemy as sa

admin_routes = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_routes.route('/users', methods=['GET'])
@require_auth
@admin_guard
def get_all_users():
    """Get all registered users."""
    try:
        session = current_app.SessionLocal()
        users = session.query(User).all()
        user_list = [u.to_dict() for u in users]
        session.close()
        return success_response(user_list, 'Users retrieved successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)

@admin_routes.route('/projects', methods=['GET'])
@require_auth
@admin_guard
def get_all_projects():
    """Get all user projects."""
    try:
        session = current_app.SessionLocal()
        # Join with User to get email
        results = session.query(Project, User.email).join(User, Project.user_id == User.id).all()
        
        project_list = []
        for proj, email in results:
            d = proj.to_dict()
            d['user_email'] = email
            project_list.append(d)
            
        session.close()
        return success_response(project_list, 'Projects retrieved successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)

@admin_routes.route('/analytics', methods=['GET'])
@require_auth
@admin_guard
def get_analytics():
    """Get platform analytics statistics."""
    try:
        session = current_app.SessionLocal()
        total_users = session.query(sa.func.count(User.id)).scalar()
        total_projects = session.query(sa.func.count(Project.id)).scalar()
        
        # Mock active users and AI requests for now
        analytics = {
            'total_users': total_users,
            'active_users': int(total_users * 0.4) if total_users else 0,
            'total_projects': total_projects,
            'ai_requests_today': 150 # Mock
        }
        
        session.close()
        return success_response(analytics, 'Analytics retrieved successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)

@admin_routes.route('/roadmaps', methods=['GET'])
@require_auth
@admin_guard
def get_all_roadmaps():
    """Get all roadmaps for administration."""
    try:
        session = current_app.SessionLocal()
        roadmaps = session.query(Roadmap).all()
        roadmap_list = [r.to_dict() for r in roadmaps]
        session.close()
        return success_response(roadmap_list, 'Roadmaps retrieved successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)

@admin_routes.route('/roadmap/<roadmap_id>', methods=['DELETE'])
@require_auth
@admin_guard
def delete_roadmap(roadmap_id):
    """Delete a roadmap."""
    try:
        session = current_app.SessionLocal()
        roadmap = session.query(Roadmap).filter_by(id=roadmap_id).first()
        if not roadmap:
            session.close()
            return not_found_response('Roadmap')
            
        session.delete(roadmap)
        session.commit()
        session.close()
        return success_response({'id': roadmap_id}, 'Roadmap deleted successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)

@admin_routes.route('/user-progress', methods=['GET'])
@require_auth
@admin_guard
def get_all_user_progress():
    """Get overall progress for all users."""
    try:
        session = current_app.SessionLocal()
        # Summary of progress per user
        results = session.query(
            User.email, 
            sa.func.count(LearningProgress.id).label('completed_topics')
        ).outerjoin(LearningProgress, (User.id == LearningProgress.user_id) & (LearningProgress.completed == True))\
         .group_by(User.id).all()
        
        progress_list = [{'email': r[0], 'completed_topics': r[1]} for r in results]
        session.close()
        return success_response(progress_list, 'User progress retrieved successfully', 200)
    except Exception as e:
        return error_response('server_error', str(e), 500)
