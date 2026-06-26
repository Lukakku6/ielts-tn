'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const PLAN_NAMES: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  core: 'Core',
  pro: 'Pro',
  elite: 'Elite'
}

export default function AdminPayments() {
  const [proofs, setProofs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProofs()
  }, [])

  async function loadProofs() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('payment_proofs')
        .select(`
          *,
          auth_users!user_id (
            email,
            raw_user_meta_data
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProofs(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function approvePayment(proofId: string, userId: string, planRequested: string) {
    setProcessing(proofId)
    setError(null)

    try {
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofId, userId, plan: planRequested })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve payment')
      }

      alert(`✅ ${PLAN_NAMES[planRequested]} plan assigned!`)
      await loadProofs()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(null)
    }
  }

  async function rejectPayment(proofId: string) {
    if (!confirm('Reject this payment?')) return

    try {
      await supabase
        .from('payment_proofs')
        .update({ status: 'rejected' })
        .eq('id', proofId)
      
      alert('❌ Payment rejected')
      await loadProofs()
    } catch (err: any) {
      alert('Error rejecting payment')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <p className="text-gray-500">Loading payments...</p>
      </main>
    )
  }

  const pending = proofs.filter(p => p.status === 'pending')
  const approved = proofs.filter(p => p.status === 'approved')
  const rejected = proofs.filter(p => p.status === 'rejected')

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">💳 Payment Approvals</h1>
            <p className="text-sm text-gray-500">
              {pending.length} pending · {approved.length} approved · {rejected.length} rejected
            </p>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {pending.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-xl font-bold text-white mb-2">All caught up!</h2>
            <p className="text-gray-500">No pending payments to review</p>
          </div>
        )}

        {pending.map((proof) => (
          <div key={proof.id} className="rounded-2xl p-5 border border-gray-800 bg-gray-900/50 mb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">👤</span>
                  <span className="text-white font-bold">
                    {proof.auth_users?.raw_user_meta_data?.full_name || 'Unknown'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                    {proof.plan_requested?.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 ml-8">
                  {proof.auth_users?.email}
                </div>
                
                <div className="text-xs text-gray-500 ml-8 mt-1">
                  Uploaded: {new Date(proof.created_at).toLocaleString()}
                </div>
                
                <a 
                  href={proof.image_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-orange-400 hover:underline mt-3 ml-8"
                >
                  📎 View Payment Screenshot
                </a>
              </div>

              <div className="flex gap-2 items-start">
                <button
                  onClick={() => approvePayment(proof.id, proof.user_id, proof.plan_requested)}
                  disabled={processing === proof.id}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {processing === proof.id ? '⏳...' : '✅ Approve'}
                </button>
                <button
                  onClick={() => rejectPayment(proof.id)}
                  disabled={processing === proof.id}
                  className="px-4 py-2.5 bg-red-600/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-600/30 disabled:opacity-50 whitespace-nowrap"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}