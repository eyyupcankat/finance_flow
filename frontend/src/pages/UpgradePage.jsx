import { Check, X } from 'lucide-react'

export default function UpgradePage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Choose the perfect plan</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">Get full access to premium integrations, advanced analytics, and priority support.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Standard Plan</h2>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-gray-900">
              $0
              <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Perfect for individuals starting out.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-600">Up to 2 connected cards</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-600">Basic subscription detection</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-500" />
              <span className="text-sm text-gray-600">Standard monthly analytics</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <X size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400 line-through">Unlimited connected cards</span>
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <X size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400 line-through">Smart cancellation assistant</span>
            </li>
          </ul>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition cursor-default">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 flex flex-col relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg">
            Recommended
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Pro Plan</h2>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
              $9.99
              <span className="ml-1 text-xl font-medium text-gray-400">/mo</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">For power users who want full control.</p>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm text-gray-300">Unlimited connected cards</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm text-gray-300">AI-powered subscription detection</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm text-gray-300">Advanced predictive analytics</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm text-gray-300">Smart cancellation assistant</span>
            </li>
            <li className="flex items-center gap-3">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm text-gray-300">Priority 24/7 support</span>
            </li>
          </ul>

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  )
}
