import { API_BASE_URL, INITIAL_PAGE_LIMIT } from './constants'

export const apiClient = {
  async fetchSounds(category, page = 1, append = false) {
    const limit = INITIAL_PAGE_LIMIT
    const response = await fetch(
      `${API_BASE_URL}/content/all/${category}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include'
      }
    )
    const data = await response.json()
    return {
      items: data.data || [],
      pagination: data.pagination || {}
    }
  },

  async fetchFavourites() {
    const response = await fetch(`${API_BASE_URL}/fav`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include'
    })

    if (!response.ok) throw new Error('Failed to fetch favourites')
    const data = await response.json()
    return data.data || []
  },

  async toggleFavourite(slug) {
    const response = await fetch(`${API_BASE_URL}/fav`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include',
      body: JSON.stringify({ slug })
    })

    if (!response.ok) throw new Error('Failed to toggle favourite')
    return response.json()
  },

  async searchSounds(type, title) {
    const response = await fetch(`${API_BASE_URL}/content/all/${type}?search=${encodeURIComponent(title)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // credentials: 'include'
    })

    if (!response.ok) throw new Error('Search request failed')
      const data = await response.json()
    return data.data || []
  }
}
