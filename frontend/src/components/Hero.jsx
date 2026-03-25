import React from 'react'

function Hero() {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(59,130,246,0.15) 0%, transparent 50%)`
        }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-primary-200 mb-6">
              Professional Virtual Staging Service
            </span>
          </div>

          <h1 className="animate-fade-in-up font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Transform Your Space with{' '}
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(to right, #93c5fd, #c084fc)' }}>
              Professional Virtual Staging
            </span>
          </h1>

          <p className="animate-fade-in-up-delay-1 text-lg md:text-xl text-slate-300 mt-6 max-w-2xl leading-relaxed">
            Upload your property photos and get stunning, human-curated virtual staging
            designs. Sell faster, stage smarter — all from the comfort of your browser.
          </p>

          <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={scrollToUpload}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('[class*="See the Transformations"]')?.scrollIntoView({ behavior: 'smooth' })
                  || window.scrollTo({ top: document.body.scrollHeight * 0.7, behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all text-center"
            >
              View Portfolio
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up-delay-2 flex gap-10 mt-14 pt-10 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-slate-400 mt-1">Properties Staged</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-slate-400 mt-1">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24h</p>
              <p className="text-sm text-slate-400 mt-1">Turnaround Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
