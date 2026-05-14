import { useState, useEffect } from 'react'
import { User, Shield, ChevronDown, Monitor, Laptop, Loader2, LogOut, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { userService } from '../services/api'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth()
  const { isDark, setIsDark } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    jobTitle: '',
    location: '',
  })
  const [prefs, setPrefs] = useState({ darkMode: false, emailAlerts: true })
  const [currency, setCurrency] = useState('USD ($)')
  const [passwords, setPasswords] = useState({ current: '', next: '' })
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false })
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await userService.getSettings()
        const data = res.data
        setProfile({
          name: data.name || '',
          email: data.email || '',
          jobTitle: data.jobTitle || '',
          location: data.location || ''
        })
        setPrefs({
          darkMode: data.darkMode,
          emailAlerts: data.emailAlerts
        })
        setCurrency(data.currency || 'USD ($)')
      } catch (err) {
        console.error('Failed to fetch settings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const performUpdate = async (updatedData) => {
    try {
      const res = await userService.updateSettings(updatedData)
      updateUser(res.data) // Sync ALL returned data to AuthContext and LocalStorage
      return true
    } catch (err) {
      console.error('Failed to update settings', err)
      alert('Failed to update settings')
      return false
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const success = await performUpdate({
      ...profile,
      ...prefs,
      currency
    })
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const handlePrefToggle = async (key, value) => {
    const newPrefs = { ...prefs, [key]: value }
    setPrefs(newPrefs) // Optimistic update

    // If toggling dark mode, immediately apply theme
    if (key === 'darkMode') {
      setIsDark(value)
    }

    await performUpdate({
      ...profile,
      ...newPrefs,
      currency
    })
  }

  const handleCurrencyChange = async (val) => {
    setCurrency(val) // Optimistic update
    await performUpdate({
      ...profile,
      ...prefs,
      currency: val
    })
  }

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.next) {
      setFeedback({ type: 'error', message: 'Please fill in both password fields.' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    if (passwords.next.length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters.' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    try {
      setSaving(true)
      await userService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next
      })
      setFeedback({ type: 'success', message: 'Password updated successfully!' })
      setPasswords({ current: '', next: '' })
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to update password' })
    } finally {
      setSaving(false)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleProfileChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your profile information and account security preferences.</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <User size={18} className="text-emerald-600" />
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Profile</h2>
            </div>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Edit Avatar</button>
          </div>

          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0 overflow-hidden flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Email Address</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Job Title</label>
                <input
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Location</label>
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : (saved ? '✓ Saved!' : 'Save Changes')}
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">⚙️</span>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">App Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'darkMode', label: 'Dark Mode', desc: 'Adaptive theme for late nights' },
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Weekly financial digests' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
                </div>
                <Toggle
                  checked={prefs[key]}
                  onChange={(v) => handlePrefToggle(key, v)}
                />
              </div>
            ))}

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1.5">Currency Display</p>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>TRY (₺)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-emerald-600" />
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Security & Privacy</h2>
        </div>

        {feedback && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' 
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Credentials</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.next ? 'text' : 'password'}
                    value={passwords.next}
                    onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(s => ({ ...s, next: !s.next }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPasswords.next ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleUpdatePassword}
                disabled={saving}
                className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Authentication</p>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Two-Factor Auth is On</p>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">Your account is protected with a secondary verification layer.</p>
            </div>
            <button className="mt-3 w-full py-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition">
              Disable 2FA
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Recent Activity</p>
            <div className="space-y-3">
              {[
                { device: 'MacBook Pro 14"', loc: 'San Francisco', time: 'Active now', Icon: Laptop },
                { device: 'iPhone 15 Pro', loc: 'San Francisco', time: '2h ago', Icon: Monitor },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <session.Icon size={16} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{session.device}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{session.loc} • {session.time}</p>
                  </div>
                </div>
              ))}
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                Log out all devices
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Deactivate Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              This will permanently remove all your financial data and integrations. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={logout}
            className="border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition whitespace-nowrap"
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  )
}
