import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fintrack_user')
    if (!stored || stored === 'undefined') return null
    try {
      return JSON.parse(stored)
    } catch (e) {
      localStorage.removeItem('fintrack_user')
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token'))

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('fintrack_user', JSON.stringify(userData))
    localStorage.setItem('fintrack_token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('fintrack_user')
    localStorage.removeItem('fintrack_token')
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('fintrack_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
