import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      onLogin(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">HC</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 animate-fade-in-up-delay-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email ID</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New to HumanCurated Staging?{' '}
            <Link to="/signup" className="text-primary-600 font-medium hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
