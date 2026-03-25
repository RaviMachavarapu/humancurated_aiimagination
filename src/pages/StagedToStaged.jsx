import React from 'react'
import GalleryPage from '../components/GalleryPage'

function StagedToStaged({ user, onLogout }) {
  return (
    <GalleryPage
      category="staged-to-staged"
      title="Staged to Staged"
      subtitle="Watch traditional staging transform into modern virtual designs. A fresh perspective on existing spaces with updated furniture and decor."
      user={user}
      onLogout={onLogout}
    />
  )
}

export default StagedToStaged
