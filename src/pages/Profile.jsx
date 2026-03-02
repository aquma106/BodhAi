import React from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </header>
      <div className="page-content">
        <div className="profile-info">
          <div className="info-item">
            <label>Name</label>
            <p>{user?.name || 'User'}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user?.email || 'N/A'}</p>
          </div>
          <button onClick={handleLogout} className="action-btn secondary">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
