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

  // Load all payment proofs on page load
  useEffect(() => {
    loadProofs()
  }, [])

  // Fetch payment proofs with user information
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
      console.error('Error loading proofs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Approve a payment and assign the plan
  async function approvePayment(proofId: string, userId: string, planRequested: string) {
    setProcessing(proofId)
    setError(null)

    try {
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          proofId, 
          userId, 
          plan: planRequested 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve payment')
      }

      alert(`✅ ${PLAN_NAMES[planRequested]} plan assigned to user!`)
      await loadProofs() // Refresh the list
    } catch (err: any) {
      console.error('Approval error:', err)
      setError(err.message)
    } finally {
      setProcessing(null)
    }
  }

  // Reject a payment
  async function rejectPayment(proofId: string) {
    if (!confirm('Reject this payment proof?')) return

    try {
      const { error } = await supabase
        .from('payment_proofs')
        .update({ status: 'rejected' })
        .eq('id', proofId)
      
      if (error) throw error
      
      alert('❌ Payment rejected')
      await loadProofs() // Refresh the list
    } catch (err: any) {
      alert('Error rejecting payment: ' + err.message)
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <p className="text-gray-500">Loading payments...</p>
      </main>
    )
  }

  // Filter proofs by status
  const pending = proofs.filter(p => p.status === 'pending')
  const approved = proofs.filter(p => p.status === 'approved')
  const rejected = proofs.filter(p => p.status === 'rejected')

  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">💳 Payment Approvals</h1>
            <p className="text-sm text-gray-500">
              {pending.length} pending · {approved.length} approved · {rejected.length} rejected
            </p>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {/* No pending payments */}
        {pending.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🎉</span>
            <h2 className="text-xl font-bold text-white mb-2">All caught up!</h2>
            <p className="text-gray-500">No pending payments to review</p>
          </div>
        )}

        {/* Pending payments list */}
        {pending.map((proof) => (
          <div key={proof.id} className="rounded-2xl p-5 border border-gray-800 bg-gray-900/50 mb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              {/* Left: User info */}
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

              {/* Right: Action buttons */}
              <div className="flex gap-2 items-start">
                <button
                  onClick={() => approvePayment(proof.id, proof.user_id, proof.plan_requested)}
                  disabled={processing === proof.id}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {processing === proof.id ? '⏳...' : '✅ Approve'}
                </button>
                <button
                  onClick={() => rejectPayment(proof.id)}
                  disabled={processing === proof.id}
                  className="px-4 py-2.5 bg-red-600/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-600/30 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Recently approved payments */}
        {approved.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              ✅ Recently Approved ({approved.length})
            </h2>
            <div className="space-y-2">
              {approved.slice(0, 5).map((proof) => (
                <div key={proof.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-800 bg-gray-900/30">
                  <div>
                    <span className="text-sm text-white">
                      {proof.auth_users?.raw_user_meta_data?.full_name || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500 ml-3">
                      {proof.plan_requested}
                    </span>
                  </div>
                  <span className="text-xs text-green-400">
                    {new Date(proof.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}