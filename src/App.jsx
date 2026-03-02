import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AIMentorChat from './components/AIMentorChat'

// Pages
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Projects from './pages/Projects'
import CodeAssistant from './pages/CodeAssistant'
import ProductivityPlanner from './pages/ProductivityPlanner'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

import './styles/App.css'

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function MainLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Header />
        {children}
      </main>
      <AIMentorChat />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/learn" element={
          <ProtectedRoute>
            <MainLayout>
              <Learn />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute>
            <MainLayout>
              <Projects />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/code-assistant" element={
          <ProtectedRoute>
            <MainLayout>
              <CodeAssistant />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/productivity" element={
          <ProtectedRoute>
            <MainLayout>
              <ProductivityPlanner />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Catch all redirect to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
