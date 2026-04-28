import { useState } from 'react'
import { User, Shield, ChevronDown, Monitor, Laptop } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState({
    name: user?.name || 'Alexander Sterling',
    email: user?.email || 'alexander.s@financeflow.io',
    jobTitle: 'Financial Analyst',
    location: 'San Francisco, CA',
  })
  const [prefs, setPrefs] = useState({ darkMode: false, emailAlerts: true, desktopNotify: true })
  const [currency, setCurrency] = useState('USD ($)')
  const [passwords, setPasswords] = useState({ current: '', next: '' })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleProfileChange = (e) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your profile information and account security preferences.</p>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <User size={18} className="text-emerald-600" />
              <h2 className="text-base font-semibold text-gray-800">Profile</h2>
            </div>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Edit Avatar</button>
          </div>

          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-xl bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Job Title</label>
                <input
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Location</label>
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">⚙️</span>
            <h2 className="text-base font-semibold text-gray-800">App Preferences</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'darkMode', label: 'Dark Mode', desc: 'Adaptive theme for late nights' },
              { key: 'emailAlerts', label: 'Email Alerts', desc: 'Weekly financial digests' },
              { key: 'desktopNotify', label: 'Desktop Notify', desc: 'Push notification updates' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle
                  checked={prefs[key]}
                  onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                />
              </div>
            ))}

            <div>
              <p className="text-sm font-medium text-gray-800 mb-1.5">Currency Display</p>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-gray-50 appearance-none"
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

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-emerald-600" />
          <h2 className="text-base font-semibold text-gray-800">Security &amp; Privacy</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Credentials</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                Update Password
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Authentication</p>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-700">Two-Factor Auth is On</p>
              </div>
              <p className="text-xs text-emerald-600">Your account is protected with a secondary verification layer.</p>
            </div>
            <button className="mt-3 w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition">
              Disable 2FA
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Activity</p>
            <div className="space-y-3">
              {[
                { device: 'MacBook Pro 14"', loc: 'San Francisco', time: 'Active now', Icon: Laptop },
                { device: 'iPhone 15 Pro', loc: 'San Francisco', time: '2h ago', Icon: Monitor },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <session.Icon size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{session.device}</p>
                    <p className="text-xs text-gray-400">{session.loc} • {session.time}</p>
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

      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-red-600">Deactivate Account</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              This will permanently remove all your financial data and integrations. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={logout}
            className="border border-red-300 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-red-50 transition whitespace-nowrap"
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  )
}
