import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [devCode, setDevCode] = useState('')

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setStep(2)
      setCountdown(60)
      if (res.data.dev_code) {
        setDevCode(res.data.dev_code)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = (e) => {
    e.preventDefault()
    setError('')
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }
    setStep(3)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email,
        code,
        new_password: newPassword,
      })
      setSuccess('Password updated successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">HC</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-800">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Enter Code'}
            {step === 3 && 'New Password'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {step === 1 && "We'll send you a 6-digit code"}
            {step === 2 && `Code sent to ${email}`}
            {step === 3 && 'Choose a strong password'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 animate-fade-in-up-delay-1">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm text-center font-medium">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email ID</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                  placeholder="Enter your registered email"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </form>
          )}

          {/* Step 2: Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              {devCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm text-center">
                  <span className="font-semibold">Dev Mode:</span> Your code is <span className="font-mono font-bold text-lg">{devCode}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                />
              </div>
              <div className="text-center text-sm">
                {countdown > 0 ? (
                  <span className="text-slate-500">Code expires in <span className="font-semibold text-primary-600">{countdown}s</span></span>
                ) : (
                  <span className="text-red-500 font-medium">Code expired</span>
                )}
              </div>
              <button
                type="submit"
                disabled={code.length !== 6 || countdown === 0}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60"
              >
                Verify Code
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60"
              >
                {loading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
