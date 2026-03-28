import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '../utils/apiClient'

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchType, setSearchType] = useState('scene')
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

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleSearch()
        }, 350) // Debounce search by 350ms

        return () => clearTimeout(delayDebounce)
    }, [searchTerm, searchType])

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        searchType,
        setSearchType,
        isSearching,
        handleSearch,
        handleInputChange
    }
}