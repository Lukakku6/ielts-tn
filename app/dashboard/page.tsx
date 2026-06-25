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

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/login'; return }
      setUser(session.user)

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

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
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSelectPlan = async (planId: string) => {
    await supabase
      .from('subscriptions')
      .update({ plan: planId, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
    setSubscription((prev: any) => ({ ...prev, plan: planId }))
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
<span className="font-light" style={{ letterSpacing: '-1.5px', color: 'rgba(255,255,255,0.9)' }}>please</span>            <span className="text-[1.1em]">🇹🇳</span>
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-medium transition-all border" style={{ color: 'rgba(255,240,232,0.5)', borderColor: '#2A2A2C', backgroundColor: 'transparent' }}>logout</button>
        </div>

        <h1 className="text-2xl font-black mb-1" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>👋 Welcome back, {firstName}</h1>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,240,232,0.5)' }}>Manage your plan and classes</p>

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
          <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,240,232,0.4)' }}>
            <span>📅 {subscription?.classes_attended || 0} classes attended</span>
            <span>🕐 Joined {new Date(subscription?.created_at).toLocaleDateString()}</span>
          </div>
        </div>

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
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={subscription?.plan === plan.id}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97] disabled:opacity-40"
                style={{
                  backgroundColor: subscription?.plan === plan.id ? 'rgba(255,240,232,0.06)' : '#FF4500',
                  color: subscription?.plan === plan.id ? 'rgba(255,240,232,0.3)' : '#FFFFFF',
                  border: subscription?.plan === plan.id ? '1px solid #2A2A2C' : 'none'
                }}>
                {subscription?.plan === plan.id ? 'Current Plan' : 'Select Plan'}
              </button>
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