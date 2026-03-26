import { useState, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'
import { isFavourite as checkIsFavourite } from '../utils/itemUtils'

export function useFavourites() {
  const [favourites, setFavourites] = useState([])

  const fetchFavourites = async () => {
    try {
      const data = await apiClient.fetchFavourites()
      setFavourites(data)
    } catch (error) {
      console.error('Failed to fetch favourites:', error)
    }
  }

  const toggleFavourite = async (e, item) => {
    e.stopPropagation()
    const slug = item?.slug
    if (!slug) return

    try {
      await apiClient.toggleFavourite(slug)
      await fetchFavourites()
    } catch (error) {
      console.error('Failed to toggle favourite:', error)
    }
  }

  const isFavourite = (item) => checkIsFavourite(item, favourites)

  useEffect(() => {
    fetchFavourites()
  }, [])

  return {
    favourites,
    isFavourite,
    toggleFavourite,
    fetchFavourites
  }
}
