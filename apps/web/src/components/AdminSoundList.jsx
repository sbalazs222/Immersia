import React from 'react'
import { API_BASE_URL } from '../pages/soundboard/utils/constants'

function AdminSoundListComponent({
  type,
  items,
}) {
  const className = {
    scene: 'scene-item',
    ambience: 'ambience-item',
    oneshot: 'oneshot-item'
  }[type]

  const listClassName = {
    scene: 'scenes-list',
    ambience: 'ambiences-list',
    oneshot: 'oneshots-list'
  }[type]

  const nameClassName = {
    scene: 'scene-name',
    ambience: 'ambience-name',
    oneshot: 'oneshot-name'
  }[type]   

  return (
    <div className={listClassName}>
      {items.map(item => (
        <div
          key={item.slug ?? item._id}
          className={className}
        >
          <div className={nameClassName}>
            {item.title}
            <img
              src={`${API_BASE_URL}/content/thumb/${item.slug}`}
              alt={item.title}
              width="50px"
              height="50px"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export const AdminSoundList = React.memo(AdminSoundListComponent)