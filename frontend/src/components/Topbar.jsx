import { useState, useRef, useEffect } from 'react'
import { Bell, HelpCircle, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ placeholder = 'Search...' }) {
  const { user } = useAuth()
  const initials = (user?.name || 'U').charAt(0).toUpperCase()
  const displayName = user?.name || 'User'

  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const notifRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4 shrink-0 z-10 relative">
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                  <span className="text-xs text-emerald-600 font-medium cursor-pointer">Mark all read</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                    <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">New Subscription Detected</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">We found a new Netflix subscription on your card ending in 1092.</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                    <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">Price Increase Alert</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your Adobe CC subscription increased by $3.00 this month.</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <HelpCircle size={18} />
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-700 ml-1">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none">{displayName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Standard Account</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{initials}</span>
            </div>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Help & Support</h2>
              <button onClick={() => setShowHelp(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">How do I add a new virtual card?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Go to the "Card Integration" page from the sidebar and click the "Add New Card" button. You will need to enter your 16-digit card number.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Why are my subscriptions not showing up?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Make sure you have clicked the "Detect Subscriptions" button next to your card in the Card Integration page. This will scan your recent transactions for recurring payments.</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Can I cancel a subscription from here?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Yes, navigate to the Subscriptions page, click the three-dot menu next to the active subscription, and select "Cancel Subscription".</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Is my data secure?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Absolutely. We use bank-level 256-bit AES encryption to store your tokens, and we never store your actual credit card details.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Still need help?</p>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Contact Support Team</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
