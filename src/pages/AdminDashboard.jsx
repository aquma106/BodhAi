import React, { useState, useEffect } from 'react'
import { 
  Users, 
  FolderGit2, 
  BarChart3, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  Activity, 
  ShieldAlert, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Map,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminCard({ title, icon: Icon, children, className = '', gradient = false }) {
  return (
    <div className={`dashboard-card ${className} ${gradient ? 'gradient-border' : ''}`}>
      <div className="card-header">
        <Icon size={20} />
        <h3>{title}</h3>
      </div>
      <div className="card-content">{children}</div>
    </div>
  )
}

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [activeTab, setActiveTab] = useState('users') // users, projects, roadmaps, analytics

  const navigate = useNavigate()

  useEffect(() => {
    const userString = localStorage.getItem('user')
    const currentUser = userString ? JSON.parse(userString) : {}

    if (currentUser.role !== 'admin') {
      console.warn('Unauthorized access to Admin Dashboard, redirecting...')
      navigate('/dashboard')
      return
    }

    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token')
    setIsLoading(true)
    setError(null)

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    try {
      const [usersRes, projectsRes, analyticsRes, roadmapsRes, progressRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/projects', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/roadmaps', { headers }),
        fetch('/api/admin/user-progress', { headers })
      ])

      if (!usersRes.ok || !projectsRes.ok || !analyticsRes.ok) {
        throw new Error('Failed to fetch some admin data')
      }

      const [usersData, projectsData, analyticsData, roadmapsData, progressData] = await Promise.all([
        usersRes.json(),
        projectsRes.json(),
        analyticsRes.json(),
        roadmapsRes.json(),
        progressRes.json()
      ])

      setUsers(usersData.data || [])
      setProjects(projectsData.data || [])
      setAnalytics(analyticsData.data || {})
      setRoadmaps(roadmapsData.data || [])
      setUserProgress(progressData.data || [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
      setError('Failed to load admin dashboard data. Please check your connection and role.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm('Delete this roadmap?')) return
    setActionLoading(`delete-roadmap-${id}`)
    try {
      const res = await fetch(`/api/admin/roadmap/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) setRoadmaps(prev => prev.filter(r => r.id !== id))
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading Admin Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard admin-dashboard">
      <div className="welcome-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={32} color="var(--accent-purple)" />
          <div>
            <h1>Admin Panel</h1>
            <p>Platform management and oversight</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
        <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`tab-btn ${activeTab === 'roadmaps' ? 'active' : ''}`} onClick={() => setActiveTab('roadmaps')}>Roadmaps</button>
        <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <AdminCard title="User Management" icon={Users}>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Topics Done</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const progress = userProgress.find(p => p.email === user.email)
                    return (
                      <tr key={user.id}>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.email}</td>
                        <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                        <td>{progress?.completed_topics || 0} topics</td>
                        <td>
                          <button className="icon-btn delete" onClick={() => {}} title="Delete User">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {activeTab === 'projects' && (
          <AdminCard title="Project Management" icon={FolderGit2}>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.user_email}</td>
                      <td><span className="tag">{project.status}</span></td>
                      <td>
                        <button className="icon-btn delete" onClick={() => {}}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {activeTab === 'roadmaps' && (
          <AdminCard title="Roadmap Management" icon={Map}>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Roadmap Title</th>
                    <th>Level</th>
                    <th>Track</th>
                    <th>Custom</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roadmaps.map(roadmap => (
                    <tr key={roadmap.id}>
                      <td>{roadmap.title}</td>
                      <td>{roadmap.level}</td>
                      <td>{roadmap.track}</td>
                      <td>{roadmap.is_custom ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          className="icon-btn delete" 
                          onClick={() => handleDeleteRoadmap(roadmap.id)}
                          disabled={actionLoading === `delete-roadmap-${roadmap.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="cards-grid">
              <div className="analytics-card-mini">
                <div className="icon-wrapper"><Users size={20} /></div>
                <div className="stats-info">
                  <span className="label">Total Users</span>
                  <span className="value">{analytics?.total_users || 0}</span>
                </div>
              </div>
              <div className="analytics-card-mini">
                <div className="icon-wrapper"><TrendingUp size={20} /></div>
                <div className="stats-info">
                  <span className="label">Active Users</span>
                  <span className="value">{analytics?.active_users || 0}</span>
                </div>
              </div>
              <div className="analytics-card-mini">
                <div className="icon-wrapper"><FolderGit2 size={20} /></div>
                <div className="stats-info">
                  <span className="label">Total Projects</span>
                  <span className="value">{analytics?.total_projects || 0}</span>
                </div>
              </div>
              <div className="analytics-card-mini">
                <div className="icon-wrapper"><BarChart3 size={20} /></div>
                <div className="stats-info">
                  <span className="label">AI Requests Today</span>
                  <span className="value">{analytics?.ai_requests_today || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-tabs .tab-btn {
          padding: 8px 20px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-tabs .tab-btn.active {
          background: var(--accent-purple);
          color: white;
          border-color: var(--accent-purple);
        }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); }
        .role-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .role-badge.admin { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); }
        .role-badge.user { background: rgba(156, 163, 175, 0.1); color: var(--text-muted); }
        .icon-btn.delete { color: #ef4444; }
        .dashboard-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 20px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  )
}

export default AdminDashboard
