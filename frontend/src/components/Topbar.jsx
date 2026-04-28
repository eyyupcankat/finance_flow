import { Bell, HelpCircle, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ placeholder = 'Search analytics...' }) {
  const { user } = useAuth()
  const initials = (user?.name || 'A').charAt(0).toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
      <div className="relative flex-1 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Bell size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <HelpCircle size={18} />
        </button>
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 ml-1">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'Alex Rivera'}</p>
            <p className="text-xs text-gray-400 mt-0.5">Standard Account</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-sm font-bold text-emerald-700">{initials}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
