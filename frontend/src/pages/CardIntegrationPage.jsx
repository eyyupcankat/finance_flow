import { useState, useEffect } from 'react'
import { Building2, Plus, Shield, MoreVertical, AlertTriangle, Zap, KeyRound, Loader2, RefreshCw } from 'lucide-react'
import { cardService, subscriptionService } from '../services/api'

export default function CardIntegrationPage() {
  const [cards, setCards] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newCard, setNewCard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectingId, setDetectingId] = useState(null)

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const loadCards = async () => {
    try {
      const res = await cardService.getCards()
      setCards(res.data)
    } catch (err) {
      console.error('Failed to load cards', err)
    }
  }

  useEffect(() => {
    loadCards()
  }, [])

  const handleAddCard = async () => {
    const cleanCardNumber = newCard.replace(/\s/g, '')
    if (cleanCardNumber.length !== 16) {
      setError('Card number must be 16 digits')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await cardService.addCard({ cardNumber: cleanCardNumber, label: 'Virtual Card' })
      setCards([...cards, res.data])
      setShowAdd(false)
      setNewCard('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add card. It might already exist or be invalid.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return
    try {
      await cardService.deleteCard(id)
      setCards(cards.filter(c => c.id !== id))
    } catch (err) {
      alert('Failed to delete card')
    }
  }

  const handleDetect = async (id) => {
    setDetectingId(id)
    try {
      await subscriptionService.detect(id)
      alert('Subscriptions detected successfully! Check the Subscriptions tab.')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to detect subscriptions.')
    } finally {
      setDetectingId(null)
    }
  }

  const maskCard = (num) => `•••• ${num.slice(-4)}`

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Integration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your connected financial instruments and sync preferences.</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setError(''); setNewCard('') }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add New Card
        </button>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 size={22} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Primary Bank Account</h2>
                <p className="text-sm text-gray-400">Main source for detection</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Active
            </span>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-500 font-medium hover:text-gray-700">Card Settings</button>
            </div>
            <p className="text-xs text-gray-400">Total Cards: {cards.length}</p>
          </div>
        </div>

        <div className="col-span-2 bg-gray-900 text-white rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold">Security Status</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your data encryption is up to date with 256-bit AES protection.
            </p>
          </div>

          <button className="mt-5 w-full bg-white text-gray-900 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <KeyRound size={15} />
            Manage Credentials
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Connected Cards</h3>
        <div className="space-y-2">
          {cards.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No cards connected yet.</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Building2 size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{card.label}</p>
                    <p className="text-xs text-gray-400">{maskCard(card.cardNumber)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleDetect(card.id)}
                    disabled={detectingId === card.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                  >
                    {detectingId === card.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {detectingId === card.id ? 'Detecting...' : 'Detect Subscriptions'}
                  </button>
                  <button onClick={() => handleDeleteCard(card.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => { setShowAdd(true); setError(''); setNewCard('') }}
            className="w-full flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors mt-2"
          >
            <Plus size={20} />
            <span className="text-sm">Link another card</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add New Card</h2>
            <p className="text-sm text-gray-500 mb-5">Enter your mock virtual card number.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={newCard}
                  onChange={(e) => setNewCard(formatCard(e.target.value))}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider"
                />
                <p className="text-xs text-gray-400 mt-2">Test numbers: 4111..., 4222..., 4333..., 9999...</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button 
                  onClick={handleAddCard}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Link Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

