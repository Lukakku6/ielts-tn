'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const WORDS = ['native speaker', 'confident', 'fluent', 'exam-ready']

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [activePrice, setActivePrice] = useState('monthly')
  const revealRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const word = WORDS[wordIndex]
    let timeout: NodeJS.Timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    revealRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const addRef = (i: number) => (el: HTMLDivElement | null) => { revealRefs.current[i] = el }

  const handleSignup = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) setMessage(error.message)
    else setMessage('Account created! Check your email to confirm.')
    setLoading(false)
  }

  const plans = [
    {
      name: 'free',
      price: { monthly: '0', yearly: '0' },
      desc: 'Get started with the basics',
      color: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-600',
      features: ['Access to 20 free lessons', 'Community forum access', 'Weekly vocabulary drops', 'TikTok content access'],
      cta: 'get started',
      ctaStyle: 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50',
    },
    {
      name: 'pro',
      price: { monthly: '9', yearly: '7' },
      desc: 'For serious English learners',
      color: 'border-indigo-400 ring-2 ring-indigo-100',
      badge: 'bg-indigo-600 text-white',
      features: ['Everything in free', '100+ premium lessons', 'IELTS prep modules', 'Progress tracking', 'Monthly live sessions'],
      cta: 'start pro',
      ctaStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
      popular: true,
    },
    {
      name: 'premium',
      price: { monthly: '19', yearly: '15' },
      desc: 'Full access + personal coaching',
      color: 'border-cyan-400',
      badge: 'bg-cyan-500 text-white',
      features: ['Everything in pro', '1-on-1 sessions with Dali', 'Personalised study plan', 'Certificate of completion', 'Priority support'],
      cta: 'go premium',
      ctaStyle: 'bg-cyan-500 text-white hover:bg-cyan-600',
    },
  ]

  return (
    <main className="min-h-screen bg-[#F8F9FF] font-sans">
      <style>{`
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .card-3d { transition: transform 0.2s ease; transform-style: preserve-3d; }
        .blob { position: absolute; border-radius: 50%; filter: blur(70px); animation: float 9s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translate(0,0);} 50%{transform:translate(20px,15px);} }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-indigo-50">
        <div className="text-lg font-medium text-indigo-950">
          english<span className="text-indigo-500">withdali</span>
        </div>
        <div className="hidden md:flex gap-6 items-center text-sm text-indigo-400">
          <a href="#features" className="hover:text-indigo-600 transition-colors">lessons</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">pricing</a>
          <a href="#social" className="hover:text-indigo-600 transition-colors">community</a>
          <a href="#signup" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">get started</a>
        </div>
        <button className="md:hidden text-indigo-600 text-sm border border-indigo-200 px-3 py-1.5 rounded-lg">menu</button>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="blob w-72 h-72 bg-indigo-200/40 -top-20 -left-20" style={{animationDelay:'0s'}} />
        <div className="blob w-56 h-56 bg-cyan-200/30 bottom-0 -right-10" style={{animationDelay:'3s'}} />
        <div className="blob w-40 h-40 bg-purple-200/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{animationDelay:'6s'}} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-500 text-xs px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
            live on tiktok & instagram · @ielts.tn
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-indigo-950 leading-tight mb-4">
            speak english like a<br />
            <span className="text-indigo-500">{displayed}</span>
            <span className="text-cyan-400 animate-pulse">|</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Professor Dali teaches through real communication — not textbooks. Master fluent English and ace your IELTS.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="#signup" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-sm font-medium">start learning free</a>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="bg-white border border-indigo-100 text-indigo-500 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm">watch on tiktok ↗</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={addRef(0)} className="reveal max-w-3xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{n:'500K+',l:'tiktok followers'},{n:'200+',l:'free lessons'},{n:'12K+',l:'students'},{n:'4.9★',l:'student rating'}].map(s => (
            <div key={s.l} className="bg-white rounded-2xl p-5 text-center border border-indigo-50 shadow-sm">
              <div className="text-2xl font-medium text-indigo-950">{s.n}</div>
              <div className="text-xs text-gray-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" ref={addRef(1)} className="reveal max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">what you get</div>
        <h2 className="text-2xl font-medium text-indigo-950 mb-1">everything to sound fluent</h2>
        <p className="text-gray-400 text-sm mb-8">short lessons built around real conversations</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {icon:'💬', t:'daily english', d:'speak naturally every day'},
            {icon:'🏆', t:'IELTS prep', d:'all four skills covered'},
            {icon:'🎙️', t:'pronunciation', d:'sound confident and clear'},
            {icon:'✏️', t:'grammar', d:"rules you'll remember"},
          ].map((f, i) => (
            <div key={f.t} className="card-3d bg-white border border-indigo-50 rounded-2xl p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - r.left) / r.width - 0.5) * 10
                const y = ((e.clientY - r.top) / r.height - 0.5) * 10
                e.currentTarget.style.transform = `translateY(-3px) rotateX(${-y}deg) rotateY(${x}deg)`
              }}
              onMouseLeave={e => { e.currentTarget.style.transform = '' }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="text-sm font-medium text-indigo-950 mb-1">{f.t}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LESSONS PREVIEW */}
      <section ref={addRef(2)} className="reveal max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">latest lessons</div>
        <h2 className="text-2xl font-medium text-indigo-950 mb-1">start learning today</h2>
        <p className="text-gray-400 text-sm mb-6">free lessons available without an account</p>
        <div className="flex flex-col gap-3">
          {[
            {n:1, t:"5 phrases you're saying wrong", d:'speaking · 4 min', free:true},
            {n:2, t:'how to use "though" naturally', d:'grammar · 3 min', free:true},
            {n:3, t:'IELTS writing task 2 structure', d:'IELTS · 8 min', free:false},
            {n:4, t:'stop saying "very" — alternatives', d:'vocabulary · 5 min', free:true},
            {n:5, t:'1-on-1 speaking practice techniques', d:'speaking · 10 min', free:false},
          ].map(l => (
            <div key={l.n} className="flex items-center gap-4 bg-white border border-indigo-50 rounded-xl px-4 py-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-medium text-indigo-500 flex-shrink-0">{l.n}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-indigo-950">{l.t}</div>
                <div className="text-xs text-gray-400">{l.d}</div>
              </div>
              {l.free
                ? <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full">free</span>
                : <span className="text-xs bg-indigo-50 text-indigo-500 border border-indigo-100 px-2.5 py-1 rounded-full">members</span>}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" ref={addRef(3)} className="reveal max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">pricing</div>
        <h2 className="text-2xl font-medium text-indigo-950 mb-1">simple, honest pricing</h2>
        <p className="text-gray-400 text-sm mb-6">start free, upgrade when you're ready</p>
        <div className="flex gap-2 bg-indigo-50 p-1 rounded-xl w-fit mb-8">
          {['monthly','yearly'].map(p => (
            <button key={p} onClick={() => setActivePrice(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activePrice === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
              {p} {p === 'yearly' && <span className="text-xs text-emerald-500 ml-1">-20%</span>}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-white rounded-2xl p-6 border ${plan.color} relative transition-all hover:shadow-md`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">most popular</div>}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.badge}`}>{plan.name}</span>
              <div className="mt-4 mb-1">
                <span className="text-3xl font-medium text-indigo-950">${activePrice === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                {plan.price.monthly !== '0' && <span className="text-gray-400 text-sm">/mo</span>}
              </div>
              <p className="text-xs text-gray-400 mb-5">{plan.desc}</p>
              <div className="flex flex-col gap-2 mb-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-indigo-400 mt-0.5">✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#signup" className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${plan.ctaStyle}`}>{plan.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL */}
      <section id="social" ref={addRef(4)} className="reveal max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2">community</div>
        <h2 className="text-2xl font-medium text-indigo-950 mb-1">follow the journey</h2>
        <p className="text-gray-400 text-sm mb-6">daily english tips across all platforms</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="https://www.tiktok.com/@ielts.tn" target="_blank"
            className="flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">T</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-indigo-950">tiktok</div>
              <div className="text-xs text-gray-400">@ielts.tn · 500K+ followers</div>
            </div>
            <span className="text-indigo-300 group-hover:text-indigo-500 transition-colors">↗</span>
          </a>
          <a href="https://www.instagram.com/ielts.tn" target="_blank"
            className="flex items-center gap-4 bg-white border border-indigo-50 rounded-2xl p-5 hover:border-pink-200 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">I</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-indigo-950">instagram</div>
              <div className="text-xs text-gray-400">@ielts.tn · follow for daily tips</div>
            </div>
            <span className="text-indigo-300 group-hover:text-pink-400 transition-colors">↗</span>
          </a>
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" ref={addRef(5)} className="reveal bg-white border-t border-indigo-50 py-16 px-6">
        <div className="max-w-sm mx-auto">
          <div className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-2 text-center">join the community</div>
          <h2 className="text-2xl font-medium text-indigo-950 mb-1 text-center">create your free account</h2>
          <p className="text-sm text-gray-400 text-center mb-8">save lessons and track your progress</p>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="full name" value={name} onChange={e => setName(e.target.value)}
              className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 bg-indigo-50/30" />
            <input type="email" placeholder="email address" value={email} onChange={e => setEmail(e.target.value)}
              className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 bg-indigo-50/30" />
            <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)}
              className="border border-indigo-100 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-indigo-400 bg-indigo-50/30" />
            {message && <p className="text-sm text-center text-indigo-500">{message}</p>}
            <button onClick={handleSignup} disabled={loading}
              className="bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200">
              {loading ? 'creating account...' : 'create account'}
            </button>
            <p className="text-xs text-gray-400 text-center">already have an account? <a href="/login" className="text-indigo-500">log in</a></p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-indigo-50 px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-indigo-950 font-medium">english<span className="text-indigo-500">withdali</span></div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-indigo-500 transition-colors">privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-colors">terms</a>
            <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">tiktok ↗</a>
            <a href="https://www.instagram.com/ielts.tn" target="_blank" className="hover:text-indigo-500 transition-colors">instagram ↗</a>
          </div>
          <div className="text-xs text-gray-300">© 2026 englishwithdali</div>
        </div>
      </footer>
    </main>
  )
}