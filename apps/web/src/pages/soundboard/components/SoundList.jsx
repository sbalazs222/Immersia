import React from 'react'
import { getItemKey, isItemSelected } from '../utils/itemUtils'
import { API_BASE_URL } from '../utils/constants'

function SoundListComponent({
  type,
  items,
  selectedItems,
  onItemClick,
  isFavourite,
  onFavouriteClick,
  searchResults
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
      {searchResults.length == 0 ?
        (items.map(item => (
          <div
            key={item.slug}
            className={`${className} ${isItemSelected(selectedItems, item) ? 'selected' : ''
              }`}
            onClick={() => onItemClick(item)}
          >
            <div className='item-header'>
              <button
                className={`favourite-btn ${isFavourite(item) ? 'favourited' : ''}`}
                onClick={(e) => onFavouriteClick(e, item)}
                title={isFavourite(item) ? 'Remove from favourites' : 'Add to favourites'}
              >
                ★
              </button>
            </div>
            <div className={nameClassName}>
              <img
                src={`${API_BASE_URL}/content/thumb/${item.slug}`}
                alt={item.title}
                width={type === 'scene' ? undefined : "50px"}
                height={type === 'scene' ? undefined : "50px"}
              />
              {type === 'scene' ? (
                <div className='item-title-text'>{item.title}</div>
              ) : (
                <span>{item.title}</span>
              )}
            </div>
          </div>
        ))) : (
          searchResults.map(item => (
            <div
              key={item.slug}
              className={`${className} ${isItemSelected(selectedItems, item) ? 'selected' : ''
                }`}
              onClick={() => onItemClick(item)}
            >
              <div className='item-header'>
                <button
                  className={`favourite-btn ${isFavourite(item) ? 'favourited' : ''}`}
                  onClick={(e) => onFavouriteClick(e, item)}
                  title={isFavourite(item) ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <i className={`bi ${isFavourite(item) ? 'bi-star-fill' : 'bi-star'}`}></i>
                </button>
              </div>
              <div className={nameClassName}>
                <img
                  src={`${API_BASE_URL}/content/thumb/${item.slug}`}
                  alt={item.title}
                  width={type === 'scene' ? undefined : "50px"}
                  height={type === 'scene' ? undefined : "50px"}
                />
                {type === 'scene' ? (
                  <div className='item-title-text'>{item.title}</div>
                ) : (
                  <span>{item.title}</span>
                )}
              </div>
            </div>
          ))
        )}
    </div>
  )
}

export const SoundList = React.memo(SoundListComponent)