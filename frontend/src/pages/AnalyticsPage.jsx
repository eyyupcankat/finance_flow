import { useState } from 'react'
import {
  TrendingUp, ShoppingBag, Building2, Rocket,
  CheckCircle2, AlertTriangle, Info, MoreHorizontal,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

const TABS = ['Weekly', 'Monthly', 'Yearly']

const BAR_DATA = [
  { month: 'JAN', amount: 2200 },
  { month: 'FEB', amount: 2600 },
  { month: 'MAR', amount: 3100 },
  { month: 'APR', amount: 1800 },
  { month: 'MAY', amount: 2800 },
  { month: 'JUN', amount: 2400 },
]

const PIE_DATA = [
  { name: 'Living & Rent', value: 65, fill: '#10b981' },
  { name: 'Dining', value: 25, fill: '#6366f1' },
  { name: 'Subscriptions', value: 10, fill: '#f59e0b' },
]

const RECENT_TX = [
  { merchant: 'Amazon Web Services', category: 'Business', date: 'June 24, 2024', amount: -84.12 },
  { merchant: 'Monthly Salary', category: 'Income', date: 'June 22, 2024', amount: 5200.0 },
  { merchant: 'Netflix Premium', category: 'Entertainment', date: 'June 20, 2024', amount: -19.99 },
]

const CAT_COLORS = {
  Business: 'bg-blue-100 text-blue-700',
  Income: 'bg-emerald-100 text-emerald-700',
  Entertainment: 'bg-red-100 text-red-700',
}

const STATS = [
  { icon: TrendingUp, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', label: 'Total Savings', value: '$48,290.00', trend: '+12.5%', trendPositive: true },
  { icon: ShoppingBag, iconBg: 'bg-red-100', iconColor: 'text-red-500', label: 'Monthly Spending', value: '$3,124.50', trend: '-3.2%', trendPositive: false },
  { icon: Building2, iconBg: 'bg-gray-100', iconColor: 'text-gray-600', label: 'Total Assets', value: '$124,500.00', trend: 'Stable', trendPositive: true },
  { icon: Rocket, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', label: 'Investment Return', value: '$12,402.12', trend: '+8.1%', trendPositive: true },
]

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

const renderLegend = () => (
  <div className="space-y-2 mt-4">
    {PIE_DATA.map((d) => (
      <div key={d.name} className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
          <span className="text-gray-600">{d.name}</span>
        </span>
        <span className="font-semibold text-gray-800">{d.value}%</span>
      </div>
    ))}
  </div>
)

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Monthly')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <span className={`text-xs font-semibold ${s.trendPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.trend}
              </span>
            </div>
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-800">Monthly Spending Trend</h3>
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <p className="text-xs text-emerald-600 mb-4">Cash flow analysis for the last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barSize={36}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {BAR_DATA.map((_, i) => (
                  <Cell key={i} fill={i === 2 ? '#10b981' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-0.5">Category Breakdown</h3>
          <p className="text-xs text-gray-400 mb-2">Top expense sources</p>
          <div className="flex justify-center">
            <PieChart width={140} height={140}>
              <Pie data={PIE_DATA} cx={65} cy={65} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" />
            </PieChart>
          </div>
          {renderLegend()}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">💡</span>
            <h3 className="text-sm font-semibold text-gray-800">Smart Insights</h3>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-800">Saving Goal Met</p>
              <p className="text-xs text-gray-500 mt-0.5">You saved $450 more than your monthly target in June. Great job!</p>
            </div>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-800">Subscription Spike</p>
              <p className="text-xs text-gray-500 mt-0.5">Dining expenses are 15% higher than your average. Consider adjusting.</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-800">Investment Tip</p>
              <p className="text-xs text-gray-500 mt-0.5">Market conditions favor increasing your tech ETF holdings by 2% this week.</p>
            </div>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Transactions</h3>
            <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Merchant</th>
                <th className="text-left pb-2 font-medium">Category</th>
                <th className="text-left pb-2 font-medium">Date</th>
                <th className="text-right pb-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_TX.map((tx, i) => (
                <tr key={i}>
                  <td className="py-3 text-sm font-medium text-gray-800">{tx.merchant}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${CAT_COLORS[tx.category] || 'bg-gray-100 text-gray-600'}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-gray-400">{tx.date}</td>
                  <td className={`py-3 text-right text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                    {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
