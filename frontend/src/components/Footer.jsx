import React from 'react'

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">HC</span>
              </div>
              <span className="font-serif text-lg font-semibold">HumanCurated Staging</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional virtual staging and renovation visualization. Transform empty spaces into beautifully designed rooms.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Virtual Staging</li>
              <li>Room Renovation</li>
              <li>Style Transformation</li>
              <li>Commercial Staging</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="mailto:sales@milehighlabs.ai" className="hover:text-white transition-colors">sales@milehighlabs.ai</a>
              </li>
              <li>6909 S Holly Cir STE 350, Centennial, CO 80112</li>
              <li>
                <a href="https://www.milehighlabs.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.milehighlabs.ai</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Scan to Visit</h3>
            <a href="https://www.milehighlabs.ai/" target="_blank" rel="noopener noreferrer" className="inline-block">
              <img
                src="/milehighlabs_qr_code.png"
                alt="Mile High Labs AI - Scan to visit www.milehighlabs.ai"
                className="w-32 h-32 rounded-lg bg-white p-1.5"
              />
            </a>
            <p className="text-xs text-slate-500 mt-2">Mile High Labs AI</p>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} HumanCurated Staging. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/profile.php?id=61576855723694" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/107492824/admin/page-posts/published/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.youtube.com/channel/UCchCR-W_gPW3vt1QtQR8oRw" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
