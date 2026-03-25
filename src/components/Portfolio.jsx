import React from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  {
    id: 'empty-to-staged',
    title: 'Empty to Staged',
    description: 'Transform empty rooms into beautifully furnished spaces',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    gradient: 'from-primary-500 to-primary-700',
    bg: 'bg-primary-50',
    text: 'text-primary-600',
  },
  {
    id: 'staged-to-staged',
    title: 'Staged to Staged',
    description: 'Restyle traditionally staged spaces with modern virtual designs',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    gradient: 'from-accent-500 to-accent-600',
    bg: 'bg-accent-50',
    text: 'text-accent-600',
  },
  {
    id: 'renovation',
    title: 'Renovation',
    description: 'Visualize renovation and remodeling transformations before committing',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    gradient: 'from-warm-400 to-warm-500',
    bg: 'bg-warm-50',
    text: 'text-warm-500',
  },
]

function Portfolio() {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            Our Work
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
            See the Transformations
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Browse our portfolio of stunning before & after transformations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/portfolio/${cat.id}`)}
              className="group text-left bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center mb-5 ${cat.text} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{cat.description}</p>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold ${cat.text} group-hover:gap-2 transition-all`}>
                View Gallery
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
