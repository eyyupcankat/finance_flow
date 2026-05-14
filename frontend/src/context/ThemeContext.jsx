import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { user } = useAuth()

  // Initialise from whatever is in AuthContext (localStorage-backed)
  const [isDark, setIsDark] = useState(() => !!user?.darkMode)

  // Keep dark class on <html> in sync
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  // If the user object changes (e.g. after login / page refresh) re-sync
  useEffect(() => {
    setIsDark(!!user?.darkMode)
  }, [user?.darkMode])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
