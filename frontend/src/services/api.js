import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds timeout
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API timeout')
      return Promise.reject({ response: { data: { message: 'Request timed out. Please try again later.' } } })
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('fintrack_token')
      localStorage.removeItem('fintrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  verify2FA: (data) => api.post('/auth/verify-2fa', data),
}

export const cardService = {
  getCards: () => api.get('/cards'),
  addCard: (data) => api.post('/cards', data),
  deleteCard: (id) => api.delete(`/cards/${id}`),
}

export const subscriptionService = {
  getSubscriptions: () => api.get('/subscriptions'),
  detect: (cardId) => api.post(`/subscriptions/detect/${cardId}`),
  cancel: (id) => api.post(`/subscriptions/${id}/cancel`),
}

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getTransactions: () => api.get('/dashboard/transactions'),
  getAnalytics: (timeframe) => api.get(`/analytics?timeframe=${timeframe || 'Monthly'}`)
}

export const userService = {
  getSettings: () => api.get('/user/settings'),
  updateSettings: (data) => api.put('/user/settings', data),
  changePassword: (data) => api.post('/user/change-password', data),
  toggle2FA: () => api.post('/user/2fa/toggle'),
  getSessions: () => api.get('/user/sessions'),
  logoutAllDevices: () => api.post('/user/sessions/logout-all'),
  deleteAccount: () => api.delete('/user'),
}

export { API_BASE }
export default api
