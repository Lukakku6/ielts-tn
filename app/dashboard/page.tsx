'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$19', tnd: '59 TND', icon: '💬', features: ['4 discussions/month', 'Vocabulary sheets', 'Replay access'] },
  { id: 'core', name: 'Core', price: '$24', tnd: '75 TND', icon: '💼', features: ['4 sessions/month', 'CV & interview prep', 'Business vocabulary', 'LinkedIn review'] },
  { id: 'pro', name: 'Pro', price: '$29', tnd: '90 TND', icon: '🏆', features: ['4 sessions/month', 'Mock tests', 'Writing corrections', 'Score tracking'], popular: true },
  { id: 'elite', name: 'Elite', price: '$59', tnd: '185 TND', icon: '🎓', features: ['4 private sessions', 'Custom study plan', 'WhatsApp access', 'Certificate'] },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [paymentState, setPaymentState] = useState<'idle' | 'pending' | 'approved'>('idle')
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/login'; return }
      setUser(session.user)

      // Check URL for upgrade param
      const params = new URLSearchParams(window.location.search)
      const upgradeParam = params.get('upgrade')
      if (upgradeParam) {
        setPendingPlan(upgradeParam)
        // Auto-trigger file upload after a short delay
        setTimeout(() => {
          document.getElementById('file-upload')?.click()
        }, 500)
      }

      // Load subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!sub) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .insert({ user_id: session.user.id, plan: 'free' })
          .select('*')
          .single()
        setSubscription(newSub)
      } else {
        setSubscription(sub)
      }

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
    loadData()
  }, [])

  const handleUpgrade = async (planId: string) => {
    setPendingPlan(planId)
    document.getElementById('file-upload')?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !pendingPlan) return

    setUploading(true)
    const fileName = `${user.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(fileName, file)

    if (uploadError) {
      alert('Upload failed')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(fileName)

    await supabase.from('payment_proofs').insert({
      user_id: user.id,
      image_url: publicUrl,
      plan_requested: pendingPlan,
      status: 'pending'
    })

    setPaymentState('pending')
    setUploading(false)
    setPendingPlan(null)
  }

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/' }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <p style={{ color: 'rgba(255,240,232,0.5)' }}>loading...</p>
      </main>
    )
  }

  const currentPlan = PLANS.find(p => p.id === subscription?.plan) || PLANS[0]
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || ''

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: '#0A0A0A', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-0.5 tracking-tight whitespace-nowrap leading-none select-none text-lg">
            <span className="font-black" style={{ letterSpacing: '-0.05em', color: '#FF4500', textShadow: '0 0 20px rgba(255,69,0,0.5)' }}>B2</span>
            <span className="font-light" style={{ letterSpacing: '0', marginLeft: '-3px', color: 'rgba(255,255,255,0.9)' }}>please</span>
            <span className="text-[1.1em]">🇹🇳</span>
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-medium transition-all border" style={{ color: 'rgba(255,240,232,0.5)', borderColor: '#2A2A2C', backgroundColor: 'transparent' }}>logout</button>
        </div>

        <h1 className="text-2xl font-black mb-1" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>👋 Welcome back, {firstName}</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,240,232,0.5)' }}>Manage your plan and payments</p>

        {/* Payment Status Banner */}
        {paymentState === 'pending' && (
          <div className="rounded-2xl p-4 border mb-6 text-center" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: 'rgba(255,200,50,0.3)' }}>
            <span className="text-sm font-semibold" style={{ color: '#F0C850' }}>⏳ Payment proof submitted — awaiting approval for {PLANS.find(p => p.id === pendingPlan)?.name}</span>
          </div>
        )}
        {paymentState === 'approved' && (
          <div className="rounded-2xl p-4 border mb-6 text-center" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: 'rgba(30,200,120,0.3)' }}>
            <span className="text-sm font-semibold" style={{ color: '#1EC878' }}>✅ Your plan is active!</span>
          </div>
        )}

        {/* Current Plan */}
        <div className="rounded-2xl p-6 border mb-8" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentPlan.icon}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{currentPlan.name} Plan</div>
                <div className="text-xs" style={{ color: 'rgba(255,240,232,0.4)' }}>{subscription?.plan === 'free' ? 'Free account' : `${currentPlan.price}/mo · ${currentPlan.tnd}`}</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: subscription?.plan === 'free' ? 'rgba(255,240,232,0.08)' : 'rgba(255,69,0,0.12)', color: subscription?.plan === 'free' ? 'rgba(255,240,232,0.5)' : '#FF4500' }}>
              {subscription?.plan === 'free' ? 'Free' : 'Active'}
            </span>
          </div>
        </div>

        {/* Upgrade Plans */}
        {paymentState === 'idle' && subscription?.plan !== 'elite' && (
          <>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>⬆️ Upgrade Your Plan</h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,240,232,0.5)' }}>Select a plan, then upload your payment screenshot. We'll activate within 24 hours.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {PLANS.filter(p => p.id !== subscription?.plan).map(plan => (
                <div key={plan.id} className="rounded-2xl p-5 border relative"
                  style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#FF4500' }}>most popular</div>
                  )}
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl">{plan.icon}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{plan.name}</div>
                      <div className="text-xs" style={{ color: '#FF7A3D' }}>{plan.price}/mo · {plan.tnd}</div>
                    </div>
                  </div>
                  <div className="mb-4 space-y-1">
                    {plan.features.map(f => (
                      <div key={f} className="text-[11px]" style={{ color: 'rgba(255,240,232,0.5)' }}>✓ {f}</div>
                    ))}
                  </div>
                  <button onClick={() => handleUpgrade(plan.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
                    style={{ backgroundColor: '#FF4500', color: '#FFFFFF' }}>
                    Upgrade to {plan.name} — {plan.price}/mo
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Hidden file input */}
        <input type="file" id="file-upload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />

        <div className="rounded-2xl p-5 border" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
          <div className="flex items-center gap-3">
            <span className="text-xl">🎙️</span>
            <div>
              <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>Next Live Class</div>
              <div className="text-xs" style={{ color: 'rgba(255,240,232,0.5)' }}>Friday 8PM Tunisia time · AI & The Future of Work</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}