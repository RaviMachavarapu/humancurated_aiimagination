import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HC</span>
            </div>
            <span className="font-serif text-xl font-semibold text-slate-800">
              HumanCurated <span className="text-primary-600">Staging</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/portfolio/empty-to-staged" className="text-slate-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Portfolio
            </Link>
            {user && (
              <>
                <span className="text-slate-400 text-sm">|</span>
                <span className="text-sm text-slate-500">Hi, {user.full_name}</span>
                <a
                  href="https://cal.com/milehighailabs/15min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Book Free Appointment
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 mt-2 pt-3 space-y-2">
            <Link to="/" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/portfolio/empty-to-staged" className="block px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Portfolio</Link>
            {user && (
              <>
                <a href="https://cal.com/milehighailabs/15min" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-primary-600 font-semibold hover:bg-primary-50 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Book Free Appointment</a>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
