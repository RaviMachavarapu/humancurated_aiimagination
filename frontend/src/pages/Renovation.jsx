import React from 'react'
import GalleryPage from '../components/GalleryPage'

function Renovation({ user, onLogout }) {
  return (
    <GalleryPage
      category="renovation"
      title="Renovation"
      subtitle="Visualize renovation and remodeling possibilities before committing. See dramatic before and after transformations of kitchens, bathrooms, and more."
      user={user}
      onLogout={onLogout}
    />
  )
}

export default Renovation
