import React, { useState, useRef } from 'react'

function ImageUpload({ files, setFiles }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = (newFiles) => {
    const imageFiles = Array.from(newFiles).filter((f) =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)
    )
    const total = files.length + imageFiles.length
    if (total > 3) {
      alert('Maximum 3 images allowed')
      return
    }
    setFiles([...files, ...imageFiles])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
        } ${files.length >= 3 ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              {files.length >= 3 ? 'Maximum images reached' : 'Drop images here or click to browse'}
            </p>
            <p className="text-xs text-slate-400 mt-1">JPG, JPEG, PNG (max 10MB each)</p>
          </div>
          <span className="inline-block px-4 py-1.5 bg-primary-600 text-white text-sm rounded-lg font-medium">
            Choose Files
          </span>
        </div>
      </div>

      {/* Image count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{files.length}/3 images selected</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < files.length ? 'bg-primary-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(index) }}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-sm"
              >
                x
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                <p className="text-white text-xs truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
