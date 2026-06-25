'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$19', tnd: '59 TND', icon: '💬', features: ['4 discussions/month', 'Vocabulary sheets', 'Replay access'], accent: '#FF7A3D' },
  { id: 'core', name: 'Core', price: '$24', tnd: '75 TND', icon: '💼', features: ['4 sessions/month', 'CV & interview prep', 'Business vocabulary', 'LinkedIn review'], accent: '#FF8C69' },
  { id: 'pro', name: 'Pro', price: '$29', tnd: '90 TND', icon: '🏆', features: ['4 sessions/month', 'Mock tests', 'Writing corrections', 'Score tracking'], accent: '#FF4500', popular: true },
  { id: 'elite', name: 'Elite', price: '$59', tnd: '185 TND', icon: '🎓', features: ['4 private sessions', 'Custom study plan', 'WhatsApp access', 'Certificate'], accent: '#FF5722' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [proofStatus, setProofStatus] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState('pro')

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/login'; return }
      setUser(session.user)

      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (!sub && !subError) {
        const { data: newSub } = await supabase
          .from('subscriptions')
          .insert({ user_id: session.user.id, plan: 'free' })
          .select('*')
          .single()
        setSubscription(newSub)
      } else {
        setSubscription(sub)
      }

      // Check if user has a pending/approved payment proof
      const { data: proofs } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (proofs && proofs.length > 0) {
        setProofStatus(proofs[0].status)
      }

      setLoading(false)
    }
    loadData()
  }, [])

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
      plan_requested: selectedPlan,
      status: 'pending'
    })

    setProofStatus('pending')
    setUploading(false)
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

        {/* Current Plan */}
        <div className="rounded-2xl p-6 border mb-8" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#2A2A2C' }}>
          <div className="flex items-center justify-between mb-4">
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

        {/* Upgrade Section */}
        {subscription?.plan === 'free' && (
          <div className="rounded-2xl p-6 border mb-8" style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)', borderColor: '#FF4500' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>⬆️ Upgrade Your Plan</h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,240,232,0.5)' }}>Send payment via your preferred method, then upload a screenshot below. We'll activate your plan within 24 hours.</p>

            {/* Plan selector */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {PLANS.filter(p => p.id !== 'starter').map(plan => (
                <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: selectedPlan === plan.id ? 'rgba(255,69,0,0.15)' : 'transparent',
                    borderColor: selectedPlan === plan.id ? '#FF4500' : '#2A2A2C',
                    color: selectedPlan === plan.id ? '#FF4500' : 'rgba(255,240,232,0.5)'
                  }}>
                  {plan.name} — {plan.price}/mo
                </button>
              ))}
            </div>

            {/* Upload */}
            {proofStatus === 'pending' ? (
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(255,200,50,0.1)', border: '1px solid rgba(255,200,50,0.3)' }}>
                <span className="text-sm font-semibold" style={{ color: '#F0C850' }}>⏳ Payment proof submitted — awaiting approval</span>
              </div>
            ) : proofStatus === 'approved' ? (
              <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(30,200,120,0.1)', border: '1px solid rgba(30,200,120,0.3)' }}>
                <span className="text-sm font-semibold" style={{ color: '#1EC878' }}>✅ Your plan has been activated!</span>
              </div>
            ) : (
              <label className="block rounded-xl p-6 text-center cursor-pointer border-dashed border-2 transition-all hover:border-[#FF4500]"
                style={{ borderColor: '#2A2A2C' }}>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
                <span className="text-2xl block mb-2">📎</span>
                <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                  {uploading ? 'Uploading...' : 'Upload Payment Screenshot'}
                </span>
                <span className="text-xs block mt-1" style={{ color: 'rgba(255,240,232,0.4)' }}>PNG, JPG, or PDF</span>
              </label>
            )}
          </div>
        )}

        {/* Available Plans */}
        <h2 className="text-lg font-bold mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {PLANS.map(plan => (
            <div key={plan.id} className="rounded-2xl p-5 border relative"
              style={{
                background: 'linear-gradient(180deg, #1C1C1E 0%, #161618 100%)',
                borderColor: subscription?.plan === plan.id ? '#FF4500' : '#2A2A2C'
              }}>
              {plan.popular && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: '#FF4500' }}>most popular</div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{plan.icon}</span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: '#FFFFFF' }}>{plan.name}</div>
                    <div className="text-xs" style={{ color: '#FF7A3D' }}>{plan.price}/mo · {plan.tnd}</div>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-1">
                {plan.features.map(f => (
                  <div key={f} className="text-[11px]" style={{ color: 'rgba(255,240,232,0.5)' }}>✓ {f}</div>
                ))}
              </div>
              {subscription?.plan === 'free' ? (
                <button onClick={() => setSelectedPlan(plan.id)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
                  style={{ backgroundColor: '#FF4500', color: '#FFFFFF' }}>
                  Select {plan.name}
                </button>
              ) : (
                <button disabled
                  className="w-full py-2.5 rounded-xl text-xs font-bold opacity-40"
                  style={{ backgroundColor: 'rgba(255,240,232,0.06)', color: 'rgba(255,240,232,0.3)', border: '1px solid #2A2A2C' }}>
                  {subscription?.plan === plan.id ? 'Current Plan' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>

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