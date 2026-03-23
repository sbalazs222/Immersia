import { useState, useEffect, useRef, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'
import { SCROLL_THRESHOLD } from '../utils/constants'

export function useSoundFetch() {
  const [activeTab, setActiveTab] = useState('scene')
  const [scenes, setScenes] = useState([])
  const [ambiences, setAmbiences] = useState([])
  const [oneshots, setOneshots] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const contentAreaRef = useRef(null)
  const pageStateRef = useRef({ scene: 1, ambience: 1, oneshot: 1 })
  const totalPagesRef = useRef({ scene: 1, ambience: 1, oneshot: 1 })

  const fetchSounds = useCallback(async (page = 1, append = false) => {
    setIsLoading(true)
    try {
      const { items, pagination } = await apiClient.fetchSounds(activeTab, page, append)

      // Update the appropriate state based on activeTab
      if (activeTab === 'scene') {
        setScenes(prev => {
          if (append) {
            // Deduplicate items when appending
            const existingKeys = new Set(prev.map(item => item.slug || item._id))
            const newItems = items.filter(item => !existingKeys.has(item.slug || item._id))
            return [...prev, ...newItems]
          }
          return items
        })
      } else if (activeTab === 'ambience') {
        setAmbiences(prev => {
          if (append) {
            const existingKeys = new Set(prev.map(item => item.slug || item._id))
            const newItems = items.filter(item => !existingKeys.has(item.slug || item._id))
            return [...prev, ...newItems]
          }
          return items
        })
      } else if (activeTab === 'oneshot') {
        setOneshots(prev => {
          if (append) {
            const existingKeys = new Set(prev.map(item => item.slug || item._id))
            const newItems = items.filter(item => !existingKeys.has(item.slug || item._id))
            return [...prev, ...newItems]
          }
          return items
        })
      }

      // Update pagination state
      pageStateRef.current[activeTab] = pagination.page || page
      totalPagesRef.current[activeTab] = pagination.totalPages || 1
    } catch (error) {
      console.error('Failed to fetch sounds:', error)
    } finally {
      setIsLoading(false)
    }
  }, [activeTab])

  // Fetch sounds when tab changes
  useEffect(() => {
    const currentData = activeTab === 'scene' ? scenes : activeTab === 'ambience' ? ambiences : oneshots
    if (currentData.length === 0) {
      fetchSounds(1, false)
    }
  }, [activeTab, fetchSounds, scenes, ambiences, oneshots])

  const checkAndLoadMore = useCallback(() => {
    const contentArea = contentAreaRef.current
    if (!contentArea || isLoading) return

    const { scrollHeight, clientHeight } = contentArea
    const currentPageNum = pageStateRef.current[activeTab]
    const totalPages = totalPagesRef.current[activeTab]

    // If content doesn't fill viewport and there are more pages, load more
    if (scrollHeight < clientHeight + 100 && currentPageNum < totalPages) {
      const nextPage = currentPageNum + 1
      pageStateRef.current[activeTab] = nextPage
      fetchSounds(nextPage, true)
    }
  }, [activeTab, isLoading, fetchSounds])

  // Check if more content is needed after data loads
  useEffect(() => {
    // Use a small delay to ensure DOM has updated with new items
    const timer = setTimeout(checkAndLoadMore, 100)
    return () => clearTimeout(timer)
  }, [scenes, ambiences, oneshots, activeTab, isLoading, checkAndLoadMore])

  // Infinite scroll
  useEffect(() => {
    const contentArea = contentAreaRef.current
    if (!contentArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentArea
      const currentPageNum = pageStateRef.current[activeTab]
      const totalPages = totalPagesRef.current[activeTab]

      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD && !isLoading && currentPageNum < totalPages) {
        const nextPage = currentPageNum + 1
        pageStateRef.current[activeTab] = nextPage
        fetchSounds(nextPage, true)
      }
    }

    contentArea.addEventListener('scroll', handleScroll)
    return () => contentArea.removeEventListener('scroll', handleScroll)
  }, [activeTab, isLoading, fetchSounds])

  return {
    activeTab,
    setActiveTab,
    scenes,
    ambiences,
    oneshots,
    isLoading,
    contentAreaRef,
    fetchSounds
  }
}
