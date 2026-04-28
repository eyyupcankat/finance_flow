import { useState } from 'react'
import { Filter, Plus, MoreVertical, TrendingUp, Calendar, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const SUBSCRIPTIONS = [
  { name: 'Netflix Premium', category: 'Entertainment', categoryColor: 'bg-blue-100 text-blue-700', cycle: 'Monthly', nextDate: 'Oct 24, 2023', amount: '$19.99', detected: true },
  { name: 'GitHub Pro', category: 'Development', categoryColor: 'bg-purple-100 text-purple-700', cycle: 'Yearly', nextDate: 'Jan 12, 2024', amount: '$48.00', detected: true },
  { name: 'Local Gym', category: 'Wellness', categoryColor: 'bg-orange-100 text-orange-700', cycle: 'Monthly', nextDate: 'Oct 30, 2023', amount: '$55.00', detected: false },
  { name: 'Adobe Creative Cloud', category: 'Design', categoryColor: 'bg-violet-100 text-violet-700', cycle: 'Monthly', nextDate: 'Nov 02, 2023', amount: '$52.99', detected: true, priceHike: '+$3.00 vs last month' },
]

const SPENDING_DATA = [
  { month: 'May', amount: 360 },
  { month: 'Jun', amount: 390 },
  { month: 'Jul', amount: 370 },
  { month: 'Aug', amount: 420 },
  { month: 'Sep', amount: 410 },
  { month: 'Oct', amount: 428 },
]

const ICONS = {
  'Netflix Premium': { bg: 'bg-black', initial: 'N' },
  'GitHub Pro': { bg: 'bg-gray-800', initial: '<>' },
  'Local Gym': { bg: 'bg-gray-200', initial: '✗' },
  'Adobe Creative Cloud': { bg: 'bg-red-500', initial: 'Ai' },
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState(SUBSCRIPTIONS)
  const [openMenu, setOpenMenu] = useState(null)

  const handleCancel = (idx) => {
    setSubs((prev) => prev.filter((_, i) => i !== idx))
    setOpenMenu(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Managing {subs.length} active subscriptions across 4 categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Filter size={15} />
            Filters
          </button>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <Plus size={15} />
            Add Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              ↑ 12%
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Monthly Spending</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">$428.50</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-400">Next 7 days</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Upcoming Bills</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">3 Renewals</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-amber-600">Action needed</span>
          </div>
          <p className="text-xs text-gray-400 mt-3">Price Hikes Detected</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">2 Services</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-gray-800">All Subscriptions</h3>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Detected</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-300 rounded-full" />Manual</span>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-t border-b border-gray-100">
              <th className="text-left px-5 py-3 font-medium uppercase tracking-wide">Service</th>
              <th className="text-left px-3 py-3 font-medium uppercase tracking-wide">Category</th>
              <th className="text-left px-3 py-3 font-medium uppercase tracking-wide">Billing Cycle</th>
              <th className="text-left px-3 py-3 font-medium uppercase tracking-wide">Next Date</th>
              <th className="text-right px-5 py-3 font-medium uppercase tracking-wide">Amount</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subs.map((sub, i) => {
              const icon = ICONS[sub.name] || { bg: 'bg-gray-400', initial: sub.name[0] }
              return (
                <tr key={i} className="hover:bg-gray-50 transition relative">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${icon.bg} rounded-xl flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{icon.initial}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{sub.name}</p>
                        <p className={`text-xs ${sub.detected ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {sub.detected ? 'Detected' : 'Manual'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sub.categoryColor}`}>
                      {sub.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-600">{sub.cycle}</td>
                  <td className="px-3 py-4 text-sm text-gray-600">{sub.nextDate}</td>
                  <td className="px-5 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-800">{sub.amount}</p>
                    {sub.priceHike && (
                      <p className="text-xs text-red-500">{sub.priceHike}</p>
                    )}
                  </td>
                  <td className="px-3 py-4 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === i && (
                      <div className="absolute right-3 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 w-36">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">View Details</button>
                        <button
                          onClick={() => handleCancel(i)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing 1-{subs.length} of {subs.length} subscriptions</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              <ChevronLeft size={13} /> Prev
            </button>
            <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Spending Trends</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SPENDING_DATA} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`$${v}`, 'Amount']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {SPENDING_DATA.map((entry, i) => (
                  <Cell key={i} fill={i === SPENDING_DATA.length - 1 ? '#10b981' : '#d1fae5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-emerald-600 text-white rounded-xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs bg-emerald-500 px-3 py-1 rounded-full font-medium">Savings Insight</span>
            <h3 className="text-lg font-bold mt-3">Potential Yearly Savings</h3>
            <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">
              We&apos;ve identified 3 unused subscriptions and 2 duplicate categories.
            </p>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-3xl font-bold">$184.20</span>
              <span className="text-sm text-emerald-200 ml-1">/ year</span>
            </div>
            <button className="bg-white text-emerald-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 transition">
              Optimize Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
