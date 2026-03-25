import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import ImageUpload from '../components/ImageUpload'
import Testimonials from '../components/Testimonials'
import Portfolio from '../components/Portfolio'
import api from '../api/client'
import { uploadImagesToDrive } from '../services/driveUpload'

function LandingPage({ user, onLogout }) {
  const [files, setFiles] = useState([])
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' })
  const [uploadProgress, setUploadProgress] = useState(null)

  const handleSubmit = async () => {
    if (files.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please upload at least 1 image' })
      return
    }
    if (!description.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please describe your requirements' })
      return
    }

    setSubmitting(true)
    setSubmitMessage({ type: '', text: '' })
    setUploadProgress({ step: 'metadata', current: 0, total: files.length, fileName: '' })

    try {
      // Step 1: Submit metadata to backend → Google Sheets
      const res = await api.post('/submissions/submit', { description })
      const { gdrive_webhook_url, username } = res.data

      // Step 2: Upload images directly to Google Drive (bypasses Vercel limits)
      if (gdrive_webhook_url && files.length > 0) {
        setUploadProgress({ step: 'uploading', current: 0, total: files.length, fileName: files[0].name })

        const result = await uploadImagesToDrive(
          files,
          gdrive_webhook_url,
          username,
          (current, total, fileName) => {
            setUploadProgress({ step: 'uploading', current, total, fileName })
          }
        )

        if (result.failed.length > 0) {
          setSubmitMessage({
            type: 'warning',
            text: `Submission saved! ${result.uploaded} image(s) uploaded to Drive. Failed: ${result.failed.join(', ')}`,
          })
        } else {
          setSubmitMessage({
            type: 'success',
            text: `Submission received successfully! ${result.uploaded} image(s) uploaded to Drive.`,
          })
        }
      } else if (!gdrive_webhook_url) {
        setSubmitMessage({
          type: 'warning',
          text: 'Submission details saved, but Google Drive is not configured. Images were not uploaded.',
        })
      } else {
        setSubmitMessage({ type: 'success', text: res.data.message })
      }

      setFiles([])
      setDescription('')
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.response?.data?.detail || 'Submission failed' })
    } finally {
      setSubmitting(false)
      setUploadProgress(null)
    }
  }

  const getProgressText = () => {
    if (!uploadProgress) return ''
    if (uploadProgress.step === 'metadata') return 'Saving your details...'
    if (uploadProgress.current >= uploadProgress.total) return 'Finishing up...'
    return `Uploading image ${uploadProgress.current + 1} of ${uploadProgress.total}...`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <Hero />

      {/* Upload Section */}
      <section id="upload" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Free AI-Powered Preview
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
              For First 50 Clients get 3 Free AI Powered Images with your Requirements
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6 animate-fade-in-up-delay-1">
            <ImageUpload files={files} setFiles={setFiles} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adding the requirements by describing how you want the image by mentioning style, type of room, and any other specification
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 3500) setDescription(e.target.value)
                }}
                maxLength={3500}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white resize-none"
                placeholder="e.g., Modern minimalist style for the living room, light oak floors, neutral color palette with white walls and beige furniture..."
              />
              <p className="text-xs text-slate-400 text-right mt-1">{description.length}/3500</p>
            </div>

            {submitMessage.text && (
              <div className={`p-3 rounded-xl text-sm text-center font-medium ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : submitMessage.type === 'warning'
                  ? 'bg-amber-50 border border-amber-200 text-amber-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {submitMessage.text}
              </div>
            )}

            {/* Upload progress bar */}
            {uploadProgress && uploadProgress.step === 'uploading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{getProgressText()}</span>
                  <span className="font-medium">{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
                {uploadProgress.fileName && uploadProgress.fileName !== 'done' && (
                  <p className="text-xs text-slate-400 truncate">{uploadProgress.fileName}</p>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-60 text-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  {getProgressText() || 'Sending...'}
                </span>
              ) : 'Send'}
            </button>

            <p className="text-center text-sm text-slate-400 italic">
              For more details Book Free appointment
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Portfolio */}
      <Portfolio />

      <Footer />
    </div>
  )
}

export default LandingPage
