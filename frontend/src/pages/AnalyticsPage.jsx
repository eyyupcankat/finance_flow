import { useState, useEffect } from 'react'
import {
  TrendingUp, ShoppingBag, Building2, Rocket,
  CheckCircle2, AlertTriangle, Info, Loader2, RefreshCw
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts'
import { dashboardService } from '../services/api'

const TABS = ['Weekly', 'Monthly', 'Yearly']

const CAT_COLORS = {
  Business: 'bg-blue-100 text-blue-700',
  Income: 'bg-emerald-100 text-emerald-700',
  Entertainment: 'bg-red-100 text-red-700',
  Technology: 'bg-blue-100 text-blue-700',
  Groceries: 'bg-green-100 text-green-700',
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-purple-100 text-purple-700',
  Living: 'bg-amber-100 text-amber-700',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow">
        ${payload[0].value.toLocaleString()}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Monthly')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadAnalytics = async (timeframe = activeTab) => {
    try {
      setLoading(true)
      const res = await dashboardService.getAnalytics(timeframe)
      setData(res.data)
    } catch (err) {
      console.error('Failed to load analytics', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [activeTab])

  if (loading && !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    )
  }

  const STATS = [
    {
      icon: TrendingUp,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950',
      iconColor: 'text-emerald-600',
      label: 'Total Savings',
      value: `$${data?.totalSavings?.toLocaleString() || '0.00'}`,
      trend: data?.savingsTrend || '+0%',
      trendPositive: data?.savingsPositive
    },
    {
      icon: ShoppingBag,
      iconBg: 'bg-red-100 dark:bg-red-950',
      iconColor: 'text-red-500',
      label: 'Period Spending',
      value: `$${data?.periodSpending?.toLocaleString() || '0.00'}`,
      trend: data?.spendingTrend || '+0%',
      trendPositive: data?.spendingPositive
    },
    {
      icon: Building2,
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400',
      label: 'Total Assets',
      value: `$${data?.totalAssets?.toLocaleString() || '0.00'}`,
      trend: 'Snapshot',
      trendPositive: true
    },
    {
      icon: Rocket,
      iconBg: 'bg-blue-100 dark:bg-blue-950',
      iconColor: 'text-blue-600',
      label: 'Investment Return',
      value: `$${data?.investmentReturn?.toLocaleString() || '0.00'}`,
      trend: '+10% est.',
      trendPositive: true
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          <button
            onClick={() => loadAnalytics()}
            className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-emerald-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {!data && !loading && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-20 text-center space-y-3">
          <Building2 size={40} className="mx-auto text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No analytics data available.</p>
          <button onClick={() => loadAnalytics()} className="mt-4 text-sm font-bold text-emerald-600 hover:underline">Try Refreshing</button>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                    <s.icon size={18} className={s.iconColor} />
                  </div>
                  <span className={`text-xs font-semibold ${s.trendPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {s.trend}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{activeTab} Spending Trend</h3>
              </div>
              <p className="text-xs text-emerald-600 mb-6">Cash flow analysis based on connected bank cards</p>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData} barGap={8}>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 9, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar
                      dataKey="amount"
                      radius={[4, 4, 0, 0]}
                      barSize={activeTab === 'Weekly' ? 45 : (activeTab === 'Yearly' ? 22 : 55)}
                    >
                      {data.chartData.map((_, i) => (
                        <Cell key={i} fill={i === data.chartData.length - 1 ? '#10b981' : '#e5e7eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">Category Breakdown</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Top expense sources</p>
              <div className="flex justify-center">
                <PieChart width={140} height={140}>
                  <Pie data={data?.categories || []} cx={65} cy={65} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" />
                </PieChart>
              </div>
              <div className="space-y-2 mt-4">
                {data?.categories?.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                      <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">💡</span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Smart Insights</h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">Saving Goal Met</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You saved $450 more than your monthly target in June. Great job!</p>
                </div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">Subscription Spike</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Dining expenses are 15% higher than your average. Consider adjusting.</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-xl flex items-start gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">Investment Tip</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Market conditions favor increasing your tech ETF holdings by 2% this week.</p>
                </div>
              </div>
            </div>

            <div className="col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Period Transactions</h3>
                <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700">View All</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left pb-2 font-medium">Merchant</th>
                    <th className="text-left pb-2 font-medium">Category</th>
                    <th className="text-left pb-2 font-medium">Date</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {data?.transactions?.map((tx, i) => (
                    <tr key={i}>
                      <td className="py-3 text-sm font-medium text-gray-800 dark:text-gray-100">{tx.merchant}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CAT_COLORS[tx.category] || 'bg-gray-100 text-gray-600'}`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-400 dark:text-gray-500">{tx.transactionDate}</td>
                      <td className={`py-3 text-right text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                  {(!data?.transactions || data.transactions.length === 0) && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-xs text-gray-400 dark:text-gray-500">No transactions in this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
