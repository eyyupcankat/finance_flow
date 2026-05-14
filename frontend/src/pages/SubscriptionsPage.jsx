import { useState, useEffect, useMemo } from 'react'
import { Filter, Plus, MoreVertical, TrendingUp, Calendar, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { subscriptionService } from '../services/api'

const SPENDING_DATA = [
  { month: 'May', amount: 360 },
  { month: 'Jun', amount: 390 },
  { month: 'Jul', amount: 370 },
  { month: 'Aug', amount: 420 },
  { month: 'Sep', amount: 410 },
  { month: 'Oct', amount: 428 },
]

const ICONS = {
  'Netflix': { bg: 'bg-black', initial: 'N' },
  'Spotify': { bg: 'bg-green-500', initial: 'S' },
  'Amazon Prime': { bg: 'bg-blue-600', initial: 'A' },
  'Adobe CC': { bg: 'bg-red-500', initial: 'Ai' },
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([])
  const [openMenu, setOpenMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const res = await subscriptionService.getSubscriptions()
      setSubs(res.data)
    } catch (err) {
      console.error('Failed to load subscriptions', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const handleCancel = async (id, index) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return
    setCancellingId(id)
    try {
      await subscriptionService.cancel(id)
      setSubs(subs.map(s => s.id === id ? { ...s, status: 'CANCELLED' } : s))
      setOpenMenu(null)
    } catch (err) {
      alert('Failed to cancel subscription')
    } finally {
      setCancellingId(null)
    }
  }

  const stats = useMemo(() => {
    const active = subs.filter(s => s.status !== 'CANCELLED')
    const cancelled = subs.filter(s => s.status === 'CANCELLED')
    const totalMonthly = active.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

    return {
      activeCount: active.length,
      cancelledCount: cancelled.length,
      totalMonthly,
      totalCount: subs.length
    }
  }, [subs])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Managing {stats.activeCount} active subscriptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadSubscriptions} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Monthly Spending (Active)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">${stats.totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">Next 7 days</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Active Subscriptions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stats.activeCount} Services</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-amber-600">Action needed</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Cancelled / Inactive</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stats.cancelledCount} Services</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">All Subscriptions</h3>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" />Cancelled</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
          </div>
        ) : subs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
            No subscriptions found. Go to Card Integration to detect them.
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 dark:text-gray-500 border-t border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left px-5 py-3 font-medium uppercase tracking-wide">Service</th>
                  <th className="text-left px-3 py-3 font-medium uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 font-medium uppercase tracking-wide">Billing Cycle</th>
                  <th className="text-right px-5 py-3 font-medium uppercase tracking-wide">Amount</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {subs.map((sub, i) => {
                  const icon = ICONS[sub.name] || { bg: 'bg-indigo-500', initial: sub.name[0] }
                  const isActive = sub.status !== 'CANCELLED'
                  return (
                    <tr key={sub.id} className={`transition relative ${isActive ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50 opacity-70'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${icon.bg} rounded-xl flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{icon.initial}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{sub.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Detected on Card #{sub.cardId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'}`}>
                          {isActive ? 'Active' : 'Cancelled'}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-400">{sub.billingCycle}</td>
                      <td className="px-5 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">${sub.amount?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{sub.currency}</p>
                      </td>
                      <td className="px-3 py-4 relative text-right">
                        {isActive && (
                          <>
                            <button
                              onClick={() => setOpenMenu(openMenu === i ? null : i)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === i && (
                              <div className="absolute right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 py-1 w-40 text-left">
                                <button
                                  onClick={() => handleCancel(sub.id, i)}
                                  disabled={cancellingId === sub.id}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex items-center justify-between"
                                >
                                  {cancellingId === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500">Showing {subs.length} subscriptions</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
