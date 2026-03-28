import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [lastSession, setLastSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("https://immersia.techtrove.cc/api/auth/me", {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        setIsLoggedIn(true)
        const data = await response.json()
        setIsAdmin(Boolean(data.data.role == 1))
      } else if (response.status === 401) {
        setIsLoggedIn(false)
        setIsAdmin(false)
        setLastSession(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoggedIn(false)
      setIsAdmin(false)
      setLastSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await fetch('https://immersia.techtrove.cc/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    let result = null
    try {
      result = await response.json()
    } catch {
      result = null
    }

    if (response.ok) {
      const role = result?.data?.role == 1
      setIsLoggedIn(true)
      setIsAdmin(Boolean(role))
      setLastSession(result?.data?.last_session ?? null)
    }

    return {
      ok: response.ok,
      status: response.status,
      data: result
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, isLoading, checkAuthStatus, login, lastSession, setLastSession }}>
      {children}
    </AuthContext.Provider>
  )
}
