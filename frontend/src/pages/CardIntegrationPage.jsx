import { useState, useEffect } from 'react'
import { Building2, Plus, Shield, Check, KeyRound, Loader2, RefreshCw, X, AlertCircle, Zap } from 'lucide-react'
import { cardService, subscriptionService } from '../services/api'

const BANKS = [
  { id: 'mock', name: 'Mock National Bank', active: true, icon: Building2, color: 'bg-emerald-500' },
  { id: 'vfc', name: 'Virtual Finance Corp', active: false, icon: Building2, color: 'bg-blue-500' },
  { id: 'dcu', name: 'Demo Credit Union', active: false, icon: Building2, color: 'bg-purple-500' },
]

export default function CardIntegrationPage() {
  const [cards, setCards] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [newCard, setNewCard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectingId, setDetectingId] = useState(null)
  const [feedback, setFeedback] = useState(null)

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
      setError('Card number must be exactly 16 digits')
      return
    }
    if (!selectedBank) {
      setError('Please select a bank first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await cardService.addCard({ 
        cardNumber: cleanCardNumber, 
        label: selectedBank.name 
      })
      setCards([...cards, res.data])
      setShowAdd(false)
      setNewCard('')
      setSelectedBank(null)
      showFeedback('Card linked successfully!', 'success')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid card number: Card not found in bank records.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return
    try {
      await cardService.deleteCard(id)
      setCards(cards.filter(c => c.id !== id))
      showFeedback('Card removed', 'success')
    } catch (err) {
      showFeedback('Failed to delete card', 'error')
    }
  }

  const handleDetect = async (id) => {
    setDetectingId(id)
    try {
      await subscriptionService.detect(id)
      showFeedback('Subscriptions detected successfully! Pattern analysis complete.', 'success')
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to detect subscriptions.', 'error')
    } finally {
      setDetectingId(null)
    }
  }

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 3000)
  }

  const maskCard = (num) => `•••• ${num.slice(-4)}`

  return (
    <div className="space-y-5 relative">
      {/* Toast Notification */}
      {feedback && (
        <div className={`fixed top-20 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right-full ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.type === 'success' ? <Check size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Integration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your connected financial instruments and sync preferences.</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setError(''); setNewCard(''); setSelectedBank(null) }}
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
              <button className="text-sm text-gray-500 font-medium hover:text-gray-700">Connection Status: Healthy</button>
            </div>
            <p className="text-xs text-gray-400">Linked Cards: {cards.length}</p>
          </div>
        </div>

        <div className="col-span-2 bg-gray-900 text-white rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold">Security Status</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your financial credentials are never stored. All communication uses bank-grade 256-bit AES encryption.
            </p>
          </div>

          <button 
            onClick={() => showFeedback('Credential management is only available for Enterprise accounts.', 'error')}
            className="mt-5 w-full bg-white text-gray-900 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound size={15} />
            Manage Credentials
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">Connected Cards</h3>
        <div className="space-y-3">
          {cards.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No cards connected yet. Start by linking a card.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Building2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-none">{card.label}</p>
                      <p className="text-xs text-gray-400 mt-1 font-mono tracking-tight">{maskCard(card.cardNumber)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDetect(card.id)}
                      disabled={detectingId === card.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                      title="Sync Subscriptions"
                    >
                      {detectingId === card.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                      Detect
                    </button>
                    <button 
                      onClick={() => handleDeleteCard(card.id)} 
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove Card"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setShowAdd(true); setError(''); setNewCard(''); setSelectedBank(null) }}
            className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all mt-2"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Link another card</span>
          </button>
        </div>
      </div>

      {showAdd && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" 
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAdd(false)
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onMouseDown={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Link Financial Account</h2>
                <p className="text-sm text-gray-500">Securely connect using AES-256 encryption</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {!selectedBank ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider text-[10px]">Select your provider</label>
                  <div className="grid grid-cols-2 gap-3">
                    {BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => {
                          if (bank.active) setSelectedBank(bank)
                          else showFeedback(`${bank.name} is not yet supported in your region.`, 'error')
                        }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all group ${
                          bank.active 
                            ? 'border-gray-100 hover:border-emerald-500 hover:bg-emerald-50' 
                            : 'border-gray-50 bg-gray-50/50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-12 h-12 ${bank.active ? bank.color : 'bg-gray-200'} rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                          <bank.icon size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{bank.name}</span>
                        {!bank.active && <span className="text-[10px] text-gray-400 font-semibold uppercase">Coming Soon</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <button 
                    onClick={() => setSelectedBank(null)} 
                    className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                  >
                    ← Back to bank selection
                  </button>
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selectedBank.name}</p>
                      <p className="text-xs text-emerald-700">Connecting via Open Banking API</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      autoFocus
                      value={newCard}
                      onChange={(e) => setNewCard(formatCard(e.target.value))}
                      placeholder="4111 0000 0000 0000"
                      className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-[0.2em] transition-all bg-gray-50 focus:bg-white"
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <Shield size={12} className="text-emerald-500" />
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Bank-grade authentication required</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={handleAddCard}
                      disabled={loading || newCard.replace(/\s/g, '').length !== 16}
                      className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                      Authorize & Link Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

