import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("https://immersia.techtrove.cc/auth/me", {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        setIsLoggedIn(true)
        const data = await response.json()
        setIsAdmin(data.data.role || false)
      } else if (response.status === 401) {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoggedIn(false)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, isLoading, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  )
}
