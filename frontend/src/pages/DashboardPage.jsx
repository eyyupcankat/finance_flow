import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, TrendingDown, TrendingUp, Building2, Lock, RefreshCw,
  MoreVertical, ChevronDown, ArrowUpRight, ArrowDownRight, Loader2, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cardService, dashboardService, subscriptionService } from '../services/api'

const BANKS = ['Select a Bank', 'Mock National Bank', 'Virtual Finance Corp', 'Demo Credit Union']

const ICONS = {
  'Netflix': { bg: 'bg-black', initial: 'N' },
  'Spotify': { bg: 'bg-green-500', initial: 'S' },
  'Amazon Prime': { bg: 'bg-blue-600', initial: 'A' },
  'Adobe CC': { bg: 'bg-red-500', initial: 'Ai' },
  'Tech Corp': { bg: 'bg-emerald-500', initial: 'T' },
}

function StatCard({ icon: Icon, iconBg, label, value, trend, trendLabel, trendPositive }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${trendPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
          {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={`text-xs mt-0.5 ${trendPositive ? 'text-emerald-600' : 'text-red-500'}`}>{trendLabel}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [cardNumber, setCardNumber] = useState('')
  const [bank, setBank] = useState('Select a Bank')
  const [fetching, setFetching] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [feedback, setFeedback] = useState(null)

  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [subscriptions, setSubscriptions] = useState([])

  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [txPage, setTxPage] = useState(1)
  const txPerPage = 10

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      const [sumRes, txRes, subRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getTransactions(),
        subscriptionService.getSubscriptions()
      ])
      setSummary(sumRes.data)
      setTransactions(txRes.data)
      setSubscriptions(subRes.data.filter(s => s.status !== 'CANCELLED'))
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleFetch = async () => {
    if (!cardNumber || bank === 'Select a Bank') return
    
    if (bank !== 'Mock National Bank') {
      setFeedback({ type: 'error', message: 'Bu bankadan şu anda veri çekilemiyor.' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    try {
      setFetching(true)
      // Backend expects 'label' not 'bankName'
      await cardService.addCard({ 
        cardNumber: cardNumber.replace(/\s/g, ''), 
        label: bank 
      })
      setFeedback({ type: 'success', message: 'Bank card connected successfully!' })
      setCardNumber('')
      setBank('Select a Bank')
      // Refresh data
      await loadDashboardData()
    } catch (err) {
      // Handle validation errors from backend (like "label: boş değer olamaz")
      const errMsg = err.response?.data?.errors 
        ? Object.entries(err.response.data.errors).map(([k, v]) => `${k}: ${v}`).join(', ')
        : err.response?.data?.message || 'Failed to connect card'
      
      setFeedback({ type: 'error', message: errMsg })
    } finally {
      setFetching(false)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technology': return 'bg-blue-100 text-blue-700'
      case 'Food & Drink': return 'bg-orange-100 text-orange-700'
      case 'Income': return 'bg-emerald-100 text-emerald-700'
      case 'Groceries': return 'bg-green-100 text-green-700'
      case 'Transport': return 'bg-yellow-100 text-yellow-700'
      case 'Entertainment': return 'bg-purple-100 text-purple-700'
      case 'Shopping': return 'bg-pink-100 text-pink-700'
      case 'Bills': return 'bg-red-100 text-red-700'
      case 'Health': return 'bg-teal-100 text-teal-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const paginatedTransactions = transactions.slice((txPage - 1) * txPerPage, txPage * txPerPage)
  const totalPages = Math.ceil(transactions.length / txPerPage)

  if (loadingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-5 relative">
      {feedback && (
        <div className={`fixed top-20 right-6 z-[100] px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        <StatCard 
          icon={Wallet} iconBg="bg-emerald-500" 
          label="Total Balance" 
          value={`$${summary?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
          trend={summary?.balanceTrend || "+0%"} 
          trendLabel="from last month" 
          trendPositive={summary?.balancePositive ?? true} 
        />
        <StatCard 
          icon={TrendingDown} iconBg="bg-emerald-400" 
          label="Monthly Income" 
          value={`$${summary?.monthlyIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
          trend={summary?.incomeTrend || "On track"} 
          trendLabel="for goal" 
          trendPositive={summary?.incomePositive ?? true} 
        />
        <StatCard 
          icon={TrendingUp} iconBg="bg-red-400" 
          label="Monthly Expenses" 
          value={`$${summary?.monthlyExpenses?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
          trend={summary?.expenseTrend || "0%"} 
          trendLabel="vs last month" 
          trendPositive={summary?.expensePositive ?? false} 
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex">
          <div className="bg-gray-900 text-white p-6 w-72 shrink-0 flex flex-col justify-between">
            <div>
              <Building2 size={22} className="mb-3 text-gray-300" />
              <h3 className="text-base font-bold mb-2">Connect Your Bank</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Securely link your accounts to automate transaction tracking and expense categorization.
              </p>
            </div>
            <div className="flex gap-2 mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-7 bg-gray-700 rounded-md" />
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Number</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="XXXX XXXX XXXX 4242"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition font-mono tracking-wider"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Bank Name</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 appearance-none transition"
                  >
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Lock size={11} className="text-emerald-500" />
                AES-256 Bank Grade Encryption
              </p>
              <button
                onClick={handleFetch}
                disabled={fetching || !cardNumber || bank === 'Select a Bank'}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={fetching ? 'animate-spin' : ''} />
                {fetching ? 'Connecting...' : 'Connect Card'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Transactions</h3>
            {transactions.length > 0 && (
              <button onClick={() => setShowAllTransactions(true)} className="text-xs text-emerald-600 font-medium hover:text-emerald-700">View All</button>
            )}
          </div>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No transactions found. Connect a card first.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Date</th>
                  <th className="text-left pb-2 font-medium">Description</th>
                  <th className="text-left pb-2 font-medium">Category</th>
                  <th className="text-right pb-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.slice(0, 5).map((tx, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-3 text-gray-400 text-xs">{tx.transactionDate}</td>
                    <td className="py-3 font-medium text-gray-800">{tx.merchant}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCategoryColor(tx.category)}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`py-3 text-right font-semibold text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Detected Subscriptions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Based on monthly recurring patterns</p>
          </div>
          <div className="space-y-3 flex-1">
            {subscriptions.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-6">No active subscriptions detected.</p>
            ) : (
              subscriptions.slice(0, 4).map((sub, i) => {
                const icon = ICONS[sub.name] || { bg: 'bg-indigo-500', initial: sub.name ? sub.name[0] : '?' }
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${icon.bg} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{icon.initial}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                        <p className="text-xs text-emerald-600">Auto-Detected</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">${sub.amount?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{sub.billingCycle === 'MONTHLY' ? 'Monthly' : sub.billingCycle}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <Link
            to="/subscriptions"
            className="mt-4 w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Manage All Subscriptions
          </Link>
        </div>
      </div>

      {showAllTransactions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAllTransactions(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">All Transactions</h2>
                <p className="text-xs text-gray-500 mt-1">Showing {transactions.length} total transactions</p>
              </div>
              <button onClick={() => setShowAllTransactions(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-5">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-3 font-medium">Date</th>
                    <th className="text-left pb-3 font-medium">Description</th>
                    <th className="text-left pb-3 font-medium">Category</th>
                    <th className="text-right pb-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedTransactions.map((tx, i) => (
                    <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-400 text-xs">{tx.transactionDate}</td>
                      <td className="py-4 font-medium text-gray-800">{tx.merchant}</td>
                      <td className="py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getCategoryColor(tx.category)}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className={`py-4 text-right font-semibold text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <button 
                  onClick={() => setTxPage(p => Math.max(1, p - 1))}
                  disabled={txPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm font-medium text-gray-600">Page {txPage} of {totalPages}</span>
                <button 
                  onClick={() => setTxPage(p => Math.min(totalPages, p + 1))}
                  disabled={txPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
