import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPassword from './pages/ForgotPassword'
import LandingPage from './pages/LandingPage'
import EmptyToStaged from './pages/EmptyToStaged'
import StagedToStaged from './pages/StagedToStaged'
import Renovation from './pages/Renovation'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/signup" element={
          user ? <Navigate to="/" replace /> : <SignupPage />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <LandingPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/portfolio/empty-to-staged" element={<EmptyToStaged user={user} onLogout={handleLogout} />} />
        <Route path="/portfolio/staged-to-staged" element={<StagedToStaged user={user} onLogout={handleLogout} />} />
        <Route path="/portfolio/renovation" element={<Renovation user={user} onLogout={handleLogout} />} />
      </Routes>
    </Router>
  )
}

export default App
