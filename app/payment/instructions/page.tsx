'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$19', tnd: '59 TND', icon: '💬' },
  { id: 'core', name: 'Core', price: '$24', tnd: '75 TND', icon: '💼' },
  { id: 'pro', name: 'Pro', price: '$29', tnd: '90 TND', icon: '🏆' },
  { id: 'elite', name: 'Elite', price: '$59', tnd: '185 TND', icon: '🎓' },
]

export default function PaymentInstructions() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan') || 'pro'
  const plan = PLANS.find(p => p.id === planId) || PLANS[2]
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [paymentState, setPaymentState] = useState<'idle' | 'pending' | 'approved'>('idle')
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        window.location.href = '/login?redirect=/payment/instructions?plan=' + planId
        return
      }
      setUser(session.user)

      // Check for pending/approved payments
      const { data: proofs } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (proofs && proofs.length > 0) {
        const latest = proofs[0]
        if (latest.status === 'approved') {
          setPaymentState('approved')
        } else if (latest.status === 'pending') {
          setPaymentState('pending')
          setPendingPlan(latest.plan_requested)
        }
      }

      setLoading(false)
    }
    loadUser()
  }, [planId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const fileName = `${user.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    await supabase.from('payment_proofs').insert({
      user_id: user.id,
      image_url: publicUrl,
      plan_requested: planId,
      status: 'pending'
    })

    setPaymentState('pending')
    setPendingPlan(planId)
    setUploading(false)
    alert('✅ Payment proof uploaded! We\'ll activate your plan within 24 hours.')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <p style={{ color: 'rgba(255,240,232,0.5)' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: '#0A0A0A', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none select-none text-lg">
            <span className="font-black" style={{ letterSpacing: '-0.05em', color: '#FF4500', textShadow: '0 0 20px rgba(255,69,0,0.5)' }}>B2</span>
            <span className="font-light" style={{ letterSpacing: '0', marginLeft: '-3px', color: 'rgba(255,255,255,0.9)' }}>please</span>
            <span className="text-[1.1em]">🇹🇳</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Payment Status */}
        {paymentState === 'pending' && (
          <div className="rounded-2xl p-4 border mb-6 text-center" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: 'rgba(255,200,50,0.3)' }}>
            <span className="text-sm font-semibold" style={{ color: '#F0C850' }}>⏳ Payment proof submitted — awaiting approval</span>
          </div>
        )}
        {paymentState === 'approved' && (
          <div className="rounded-2xl p-4 border mb-6 text-center" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: 'rgba(30,200,120,0.3)' }}>
            <span className="text-sm font-semibold" style={{ color: '#1EC878' }}>✅ Your plan is active! Enjoy your {PLANS.find(p => p.id === pendingPlan)?.name} plan.</span>
          </div>
        )}

        {/* Payment Instructions */}
        {paymentState === 'idle' && (
          <>
            <div className="rounded-2xl p-8 border mb-6" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{plan.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-white">Pay for {plan.name} Plan</h1>
                  <p className="text-sm text-gray-400">{plan.price}/mo · {plan.tnd}</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">📋 Payment Instructions</h2>
                
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,69,0,0.05)', border: '1px solid rgba(255,69,0,0.15)' }}>
                    <p className="text-sm text-gray-300">
                      <span className="text-orange-400 font-bold">1.</span> Transfer the exact amount to the account below:
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-500">Bank:</span>
                        <span className="text-white font-medium">Tunisian Bank</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-500">Account Name:</span>
                        <span className="text-white font-medium">B2Please</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-500">IBAN:</span>
                        <span className="text-white font-medium">TN59 1234 5678 9012 3456 7890</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-800">
                        <span className="text-gray-500">Amount:</span>
                        <span className="text-orange-400 font-bold">{plan.tnd}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">Reference:</span>
                        <span className="text-white font-mono text-xs">{user?.id?.slice(0, 8)}-{planId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,69,0,0.03)', border: '1px solid rgba(255,69,0,0.08)' }}>
                    <p className="text-sm text-gray-300">
                      <span className="text-orange-400 font-bold">2.</span> Take a screenshot of your transfer confirmation.
                    </p>
                  </div>

                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,69,0,0.03)', border: '1px solid rgba(255,69,0,0.08)' }}>
                    <p className="text-sm text-gray-300">
                      <span className="text-orange-400 font-bold">3.</span> Upload the screenshot below. We'll activate your plan within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="rounded-2xl p-6 border text-center" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
              <div className="mb-4">
                <span className="text-4xl block mb-2">📸</span>
                <p className="text-sm text-gray-400">Upload your payment confirmation screenshot</p>
              </div>
              
              <label
                htmlFor="payment-upload"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all active:scale-[0.97] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: '#FF4500', color: '#FFFFFF' }}
              >
                {uploading ? '⏳ Uploading...' : '📤 Upload Screenshot'}
              </label>
              <input
                type="file"
                id="payment-upload"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              
              <p className="text-xs text-gray-500 mt-3">Supported: JPG, PNG, PDF (max 5MB)</p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Questions? <a href="https://wa.me/216XXXXXXXX" target="_blank" className="text-orange-400 hover:underline">Contact us on WhatsApp</a>
          </p>
        </div>
      </div>
    </main>
  )
}