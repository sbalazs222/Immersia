import { useState, useCallback } from 'react'
import { apiClient } from '../utils/apiClient'

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchType, setSearchType] = useState('scene') // 'scene', 'ambience', 'oneshot'
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        try {
            const results = await apiClient.searchSounds(searchType, searchTerm)
            setSearchResults(results)
        } catch (error) {
            console.error('Search failed:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }, [searchTerm, searchType])

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        searchType,
        setSearchType,
        isSearching,
        handleSearch
    }
}