import { useState } from 'react'
import { Building2, Plus, Shield, MoreVertical, CheckCircle2, AlertTriangle, Zap, KeyRound } from 'lucide-react'

const CONNECTED_CARDS = [
  { name: 'Chase Sapphire Reserve', type: 'Visa •••• 1092', balance: '$4,821.55', status: 'Synced', statusColor: 'text-emerald-600' },
  { name: 'Goldman Sachs Savings', type: 'Direct Deposit Account', balance: '$128,402.00', status: 'Re-auth Required', statusColor: 'text-red-500', statusIcon: AlertTriangle },
]

export default function CardIntegrationPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [newCard, setNewCard] = useState('')

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Integration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your connected financial instruments and sync preferences.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
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
                <h2 className="text-lg font-bold text-gray-900">Corporate Platinum</h2>
                <p className="text-sm text-gray-400">Mastercard •••• 8842</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Active &amp; Synced
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Balance</p>
              <p className="text-xl font-bold text-gray-900">$12,450.80</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Spent This Month</p>
              <p className="text-xl font-bold text-red-500">-$3,120.00</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Credit Limit</p>
              <p className="text-xl font-bold text-gray-900">$50,000</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View Transactions</button>
              <button className="text-sm text-gray-500 font-medium hover:text-gray-700">Card Settings</button>
            </div>
            <p className="text-xs text-gray-400">Last synced: 12 minutes ago</p>
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

          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-400">2FA Verification</span>
                <span className="text-emerald-400 font-semibold">ENABLED</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-full bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Sync Frequency</span>
              <span className="text-white font-semibold">High (Real-time)</span>
            </div>
          </div>

          <button className="mt-5 w-full bg-white text-gray-900 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <KeyRound size={15} />
            Manage Credentials
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">All Connected Sources</h3>
        <div className="space-y-2">
          {CONNECTED_CARDS.map((card, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{card.name}</p>
                  <p className="text-xs text-gray-400">{card.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{card.balance}</p>
                  <p className={`text-xs font-medium flex items-center justify-end gap-1 ${card.statusColor}`}>
                    {card.statusIcon ? <AlertTriangle size={11} /> : <Zap size={11} />}
                    {card.status}
                  </p>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex flex-col items-center justify-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors"
          >
            <Plus size={20} />
            <span className="text-sm">Link another bank account or card</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 flex items-center gap-5">
        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
          <Building2 size={22} className="text-gray-300" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold">Secure Financial Data Aggregation</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Your data is aggregated via our Mock Bank API and encrypted at rest using bank-level protocols.
          </p>
        </div>
        <div className="flex gap-8 text-center shrink-0">
          <div>
            <p className="text-xl font-bold">04</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Connected</p>
          </div>
          <div>
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Banks Supported</p>
          </div>
          <div>
            <p className="text-xl font-bold">99.9%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Uptime</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add New Card</h2>
            <p className="text-sm text-gray-500 mb-5">Enter your virtual card number to link it to your account.</p>
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
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-colors">Link Card</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
