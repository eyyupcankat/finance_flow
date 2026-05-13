import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
}

export default api
