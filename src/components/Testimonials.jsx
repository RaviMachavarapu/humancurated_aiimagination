import React from 'react'

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Real Estate Agent, Austin TX",
    text: "HumanCurated Staging transformed our empty listings into stunning, move-in ready homes. Our properties are selling 40% faster since we started using their virtual staging service. The quality is indistinguishable from real staging!",
    rating: 5,
    initials: "SM",
    color: "from-primary-500 to-primary-600",
  },
  {
    name: "James Rodriguez",
    role: "Property Developer, Miami FL",
    text: "We've tried multiple virtual staging services and HumanCurated is by far the best. The human touch in their designs makes all the difference — rooms feel warm and lived-in, not like generic 3D renders. Highly recommend!",
    rating: 5,
    initials: "JR",
    color: "from-accent-500 to-accent-600",
  },
  {
    name: "Emily Chen",
    role: "Interior Designer, San Francisco CA",
    text: "As a designer, I'm very particular about aesthetics. HumanCurated nailed the style I described perfectly — from the mid-century modern furniture to the color palette. The before/after transformation was jaw-dropping.",
    rating: 5,
    initials: "EC",
    color: "from-warm-400 to-warm-500",
  },
]

function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-600 rounded-full text-sm font-medium mb-4">
            Client Love
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
            What Our Clients Say
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Trusted by real estate professionals across the country
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-warm-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`w-10 h-10 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-xs">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
