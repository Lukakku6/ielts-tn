import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    // Get the data from the request body
    const { proofId, userId, plan } = await request.json()

    // Validate required fields
    if (!proofId || !userId || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields: proofId, userId, or plan' },
        { status: 400 }
      )
    }

    // Step 1: Update payment_proofs status to 'approved'
    const { error: proofError } = await supabaseAdmin
      .from('payment_proofs')
      .update({ status: 'approved' })
      .eq('id', proofId)

    if (proofError) {
      console.error('Proof update error:', proofError)
      return NextResponse.json(
        { error: 'Failed to update proof status: ' + proofError.message },
        { status: 500 }
      )
    }

    // Step 2: Update user's subscription plan (THIS ASSIGNS THE PLAN)
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .update({ 
        plan: plan,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (subError) {
      console.error('Subscription update error:', subError)
      return NextResponse.json(
        { error: 'Failed to update subscription: ' + subError.message },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: `Plan upgraded to ${plan} successfully!` 
    })
    
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}