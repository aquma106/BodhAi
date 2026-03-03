import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import './styles/App.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>,
)
