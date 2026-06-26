import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { proofId, userId, plan } = await request.json()

    if (!proofId || !userId || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update payment_proofs status to 'approved'
    const { error: proofError } = await supabaseAdmin
      .from('payment_proofs')
      .update({ status: 'approved' })
      .eq('id', proofId)

    if (proofError) {
      return NextResponse.json(
        { error: 'Failed to update proof status' },
        { status: 500 }
      )
    }

    // Update user's subscription plan (ASSIGN THE PLAN)
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .update({ plan: plan })
      .eq('user_id', userId)

    if (subError) {
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}