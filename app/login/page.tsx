'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 tracking-tight whitespace-nowrap leading-none select-none text-xl">
            <span className="font-black" style={{ letterSpacing: '-0.03em', color: '#FF4500', textShadow: '0 0 20px rgba(255,69,0,0.5), 0 0 40px rgba(255,69,0,0.2)' }}>B2</span>
            <span className="font-light" style={{ letterSpacing: '0.02em', color: 'rgba(255,255,255,0.9)' }}>please</span>
            <span className="inline-flex items-center justify-center leading-none text-[1.1em]" role="img" aria-label="Tunisia flag">🇹🇳</span>
          </Link>
        </div>
        <div className="rounded-2xl p-6 flex flex-col gap-3.5 border" style={{ background: '#1A1A1A', borderColor: '#2A2A2C' }}>
          <input type="email" placeholder="email address" value={email} onChange={e => setEmail(e.target.value)}
            className="border rounded-xl px-4 py-3.5 text-sm w-full transition-all focus:outline-none"
            style={{ backgroundColor: '#0A0A0A', borderColor: '#2A2A2C', color: 'white' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#FF4500'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,69,0,0.07)' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#2A2A2C'; e.currentTarget.style.boxShadow = 'none' }} />
          <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
            className="border rounded-xl px-4 py-3.5 text-sm w-full transition-all focus:outline-none"
            style={{ backgroundColor: '#0A0A0A', borderColor: '#2A2A2C', color: 'white' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#FF4500'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,69,0,0.07)' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#2A2A2C'; e.currentTarget.style.boxShadow = 'none' }} />
          {message && <p className="text-sm text-center text-[#FF7A3D] font-semibold">{message}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="text-white py-3.5 rounded-xl text-sm font-semibold active:scale-[0.97] transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FF4500', boxShadow: '0 4px 18px rgba(255,69,0,0.25)' }}>
            {loading ? 'logging in...' : 'log in'}
          </button>
          <p className="text-[13px] text-center" style={{ color: 'rgba(255,240,232,0.4)' }}>
            don't have an account? <Link href="/" className="font-semibold hover:underline" style={{ color: '#FF4500' }}>sign up</Link>
          </p>
        </div>
      </div>
    </main>
  )
}