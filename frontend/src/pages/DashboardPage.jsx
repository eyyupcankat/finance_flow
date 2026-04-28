import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, TrendingDown, TrendingUp, Building2, Lock, RefreshCw,
  Plus, MoreVertical, ChevronDown, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

const BANKS = ['Select a Bank', 'Mock National Bank', 'Virtual Finance Corp', 'Demo Credit Union']

const MOCK_TRANSACTIONS = [
  { date: 'Oct 24, 2023', description: 'Apple Store', category: 'Technology', amount: -149.0, color: 'bg-blue-100 text-blue-700' },
  { date: 'Oct 23, 2023', description: 'Starbucks Coffee', category: 'Food & Drink', amount: -12.4, color: 'bg-orange-100 text-orange-700' },
  { date: 'Oct 22, 2023', description: 'Salary Deposit', category: 'Income', amount: 4250.0, color: 'bg-emerald-100 text-emerald-700' },
  { date: 'Oct 20, 2023', description: 'Whole Foods', category: 'Groceries', amount: -84.15, color: 'bg-green-100 text-green-700' },
  { date: 'Oct 19, 2023', description: 'Uber Trip', category: 'Transport', amount: -22.5, color: 'bg-yellow-100 text-yellow-700' },
]

const MOCK_SUBSCRIPTIONS = [
  { name: 'Netflix', amount: 19.99, color: 'bg-red-500', initial: 'N' },
  { name: 'Spotify', amount: 10.99, color: 'bg-green-500', initial: 'S' },
  { name: 'Equinox Gym', amount: 220.0, color: 'bg-gray-400', initial: 'E' },
  { name: 'Adobe CC', amount: 54.99, color: 'bg-red-400', initial: 'A' },
]

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

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleFetch = () => {
    setFetching(true)
    setTimeout(() => setFetching(false), 1500)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-5">
        <StatCard icon={Wallet} iconBg="bg-emerald-500" label="Total Balance" value="$12,482.50" trend="+4.5%" trendLabel="+4.5% from last month" trendPositive />
        <StatCard icon={TrendingDown} iconBg="bg-emerald-400" label="Monthly Income" value="$4,250.00" trend="On track" trendLabel="On track for goal" trendPositive />
        <StatCard icon={TrendingUp} iconBg="bg-red-400" label="Monthly Expenses" value="$1,890.12" trend="+12%" trendLabel="+12% vs last month" trendPositive={false} />
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
                disabled={fetching || !cardNumber}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={fetching ? 'animate-spin' : ''} />
                {fetching ? 'Fetching...' : 'Fetch Transactions'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Transactions</h3>
            <Link to="/analytics" className="text-xs text-emerald-600 font-medium hover:text-emerald-700">View All</Link>
          </div>
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
              {MOCK_TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-3 text-gray-400 text-xs">{tx.date}</td>
                  <td className="py-3 font-medium text-gray-800">{tx.description}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${tx.color}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-semibold text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Detected Subscriptions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Based on monthly recurring patterns</p>
          </div>
          <div className="space-y-3 flex-1">
            {MOCK_SUBSCRIPTIONS.map((sub, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${sub.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{sub.initial}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                    <p className="text-xs text-emerald-600">Auto-Detected</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">${sub.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Monthly</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/subscriptions"
            className="mt-4 w-full text-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Manage All Subscriptions
          </Link>
        </div>
      </div>

      <button className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center transition-all hover:scale-105">
        <Plus size={22} />
      </button>
    </div>
  )
}
