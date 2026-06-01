import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, CalendarClock, BarChart2, Settings, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cards', icon: CreditCard, label: 'Card Integration' },
  { to: '/subscriptions', icon: CalendarClock, label: 'Subscriptions' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-52 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 h-full">
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
          <TrendingUp size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">FinanceFlow</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Modern Analytics</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-emerald-500 text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="bg-emerald-500 rounded-xl p-4 text-white">
          <p className="text-[11px] font-medium opacity-75">Power User</p>
          <p className="text-sm font-bold mt-0.5">Upgrade Pro</p>
          <NavLink
            to="/upgrade"
            className="mt-3 w-full bg-white text-emerald-600 text-xs font-semibold py-2 rounded-lg hover:bg-emerald-50 transition-colors flex justify-center"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
