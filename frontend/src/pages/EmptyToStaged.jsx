import React from 'react'
import GalleryPage from '../components/GalleryPage'

function EmptyToStaged({ user, onLogout }) {
  return (
    <GalleryPage
      category="empty-to-staged"
      title="Empty to Staged"
      subtitle="See how we transform completely empty rooms into beautifully furnished, move-in ready spaces that help buyers visualize their future home."
      user={user}
      onLogout={onLogout}
    />
  )
}

export default EmptyToStaged
