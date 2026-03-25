import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import api from '../api/client'

function ComparisonSlider({ beforeUrl, afterUrl, room }) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(percent)
  }

  const handleMouseMove = (e) => { if (dragging) handleMove(e.clientX) }
  const handleTouchMove = (e) => { if (dragging) handleMove(e.touches[0].clientX) }

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', () => setDragging(false))
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', () => setDragging(false))
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', () => setDragging(false))
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', () => setDragging(false))
    }
  }, [dragging])

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] cursor-ew-resize select-none overflow-hidden"
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        {/* After image (full width background) */}
        <img src={afterUrl} alt={`${room} after`} className="absolute inset-0 w-full h-full object-cover" />

        {/* Before image (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={beforeUrl} alt={`${room} before`} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current ? containerRef.current.offsetWidth : '100%' }} />
        </div>

        {/* Slider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full font-medium">Before</div>
        <div className="absolute top-3 right-3 px-3 py-1 bg-primary-600/80 text-white text-xs rounded-full font-medium">After</div>
      </div>

      <div className="p-4 text-center">
        <h3 className="font-semibold text-slate-800">{room}</h3>
        <p className="text-xs text-slate-400 mt-1">Drag the slider to compare</p>
      </div>
    </div>
  )
}

function GalleryPage({ category, title, subtitle, user, onLogout }) {
  const navigate = useNavigate()
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/portfolio/${category}`)
      .then((res) => {
        setPairs(res.data.pairs)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load portfolio images')
        setLoading(false)
      })
  }, [category])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} onLogout={onLogout} />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="text-slate-400 mt-2 max-w-xl">{subtitle}</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto" />
                  <div className="h-3 bg-slate-100 rounded w-1/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : pairs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No images available for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pairs.map((pair, index) => (
              <ComparisonSlider
                key={index}
                beforeUrl={pair.before_url}
                afterUrl={pair.after_url}
                room={pair.room}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default GalleryPage
