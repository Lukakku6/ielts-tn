'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Account created! Check your email to confirm.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <div className="text-lg font-medium text-gray-900">
          english<span className="text-violet-500">withdali</span>
        </div>
        <div className="flex gap-6 items-center text-sm text-gray-500">
          <a href="#lessons" className="hover:text-gray-900">lessons</a>
          <a href="#about" className="hover:text-gray-900">about</a>
          <a href="#signup" className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600">get started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-3 py-1 rounded-full mb-4">as seen on tiktok · @ielts.tn</span>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4">
          learn english the <span className="text-violet-500">real</span> way
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Professor Dali teaches through real communication — not textbooks. Master everyday English and ace your IELTS exam.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="#signup" className="bg-violet-500 text-white px-6 py-3 rounded-lg hover:bg-violet-600 text-sm font-medium">start learning free</a>
          <a href="https://www.tiktok.com/@ielts.tn" target="_blank" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 text-sm">watch on tiktok ↗</a>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { num: "500K+", label: "tiktok followers" },
            { num: "200+", label: "free lessons" },
            { num: "12K+", label: "students" },
            { num: "4.9 ★", label: "student rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="text-2xl font-medium text-gray-900">{s.num}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="lessons" className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs font-medium text-violet-500 uppercase tracking-wide mb-2">what you get</p>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">everything you need to sound fluent</h2>
        <p className="text-gray-400 text-sm mb-8">short focused lessons built around real conversations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "everyday communication", desc: "speak naturally in real situations — not textbook sentences" },
            { title: "IELTS exam prep", desc: "structured lessons covering all four IELTS skills" },
            { title: "pronunciation training", desc: "sound confident with guided audio practice" },
            { title: "grammar made simple", desc: "clear rules with examples you'll actually remember" },
          ].map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-xl p-5 hover:border-violet-200 transition-colors">
              <div className="text-sm font-medium text-gray-900 mb-1">{f.title}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNUP */}
      <section id="signup" className="bg-gray-50 py-16">
        <div className="max-w-sm mx-auto px-6">
          <p className="text-xs font-medium text-violet-500 uppercase tracking-wide mb-2 text-center">join the community</p>
          <h2 className="text-2xl font-medium text-gray-900 mb-1 text-center">create your free account</h2>
          <p className="text-sm text-gray-400 text-center mb-8">save lessons and track your progress</p>
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
            <input type="text" placeholder="full name" value={name} onChange={e => setName(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-violet-400" />
            <input type="email" placeholder="email address" value={email} onChange={e => setEmail(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-violet-400" />
            <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-violet-400" />
            {message && <p className="text-sm text-center text-violet-600">{message}</p>}
            <button onClick={handleSignup} disabled={loading} className="bg-violet-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-600 disabled:opacity-50">
              {loading ? 'creating account...' : 'create account'}
            </button>
            <p className="text-xs text-gray-400 text-center">already have an account? <a href="#" className="text-violet-500">log in</a></p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 px-6 py-6 flex justify-between items-center flex-wrap gap-4 text-sm text-gray-400">
        <div>english<span className="text-violet-500">withdali</span></div>
        <div className="flex gap-4">
          <a href="#">privacy</a>
          <a href="#">terms</a>
          <a href="https://www.tiktok.com/@ielts.tn" target="_blank">tiktok ↗</a>
        </div>
      </footer>

    </main>
  )
}