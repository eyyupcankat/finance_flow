import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import { Loader2 } from 'lucide-react'

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      if (!token) {
        setError('No authentication token found in URL.')
        return
      }

      try {
        // Temporarily save token so that userService.getSettings() interceptor adds it to Authorization header
        localStorage.setItem('fintrack_token', token)

        const res = await userService.getSettings()
        const data = res.data

        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          jobTitle: data.jobTitle,
          location: data.location,
          darkMode: data.darkMode,
          emailAlerts: data.emailAlerts,
          currency: data.currency,
          twoFactorEnabled: data.twoFactorEnabled
        }

        login(userData, token)
        navigate('/dashboard')
      } catch (err) {
        console.error('OAuth2 callback error:', err)
        localStorage.removeItem('fintrack_token')
        setError('Failed to retrieve user profile settings after OAuth2 login.')
      }
    }

    handleCallback()
  }, [searchParams, login, navigate])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 rounded-2xl shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">OAuth2 Authentication Failed</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Loader2 className="animate-spin text-emerald-500 w-10 h-10 mb-4" />
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completing Google Login...</p>
    </div>
  )
}
