import React, { createContext, useState, useCallback, useEffect } from 'react'

export const NotificationContext = createContext()

const STORAGE_KEY = 'bodhai_notifications'

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error('Error loading notifications from localStorage:', e)
      return []
    }
  })

  // Persist notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (e) {
      console.error('Error saving notifications to localStorage:', e)
      // Fallback: notifications stay in memory if localStorage fails
    }
  }, [notifications])

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
    return newNotification
  }, [])

  // Mark a notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }, [])

  // Delete a notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }, [])

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  // Get last 10 notifications
  const recentNotifications = notifications.slice(0, 10)

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
    recentNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use notifications
export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
