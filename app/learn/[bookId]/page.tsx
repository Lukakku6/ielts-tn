'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function BookReaderPage() {
  const params = useParams()
  const bookId = params.bookId as string
  const [htmlContent, setHtmlContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function init() {
      // Check auth
      const res = await fetch('/api/progress')
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      
      // Load book HTML
      const bookRes = await fetch(`/books/${bookId}.html`)
      const html = await bookRes.text()
      
      // Inject progress bridge script
      const bridgeScript = `
        <script>
          // Override localStorage to sync with Supabase
          const origSetItem = localStorage.setItem;
          const origGetItem = localStorage.getItem;
          
          localStorage.setItem = function(key, value) {
            origSetItem.call(this, key, value);
            if (key === 'efe2_done') {
              try {
                const completed = JSON.parse(value);
                fetch('/api/progress', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    book_id: '${bookId}',
                    unit_id: 0,
                    completed: true,
                    checklist: completed
                  })
                });
              } catch(e) {}
            }
          };
          
          // Override checklist saves
          const origCL = Storage.prototype.setItem;
          document.addEventListener('click', function(e) {
            setTimeout(function() {
              const keys = Object.keys(localStorage).filter(k => k.startsWith('efe2_cl_'));
              keys.forEach(key => {
                const val = localStorage.getItem(key);
                if (val && !key.endsWith('_synced')) {
                  const unitMatch = key.match(/efe2_cl_(\\d+)/);
                  if (unitMatch) {
                    fetch('/api/progress', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        book_id: '${bookId}',
                        unit_id: parseInt(unitMatch[1]),
                        completed: false,
                        checklist: JSON.parse(val)
                      })
                    });
                    localStorage.setItem(key + '_synced', '1');
                  }
                }
              });
            }, 500);
          });
        </script>
      `;
      
      // Insert bridge script before </body>
      const modifiedHtml = html.replace('</body>', bridgeScript + '</body>');
      
      setHtmlContent(modifiedHtml);
      setLoading(false);
    }
    init();
  }, [bookId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <p style={{ color: 'rgba(255,240,232,0.5)' }}>loading book...</p>
      </main>
    )
  }

  return (
    <main style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f7f5f0' }}>
      {/* Dark top bar */}
      <div style={{ 
        backgroundColor: '#0A0A0A', 
        padding: '0 1.25rem', 
        height: '48px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/dashboard" style={{ 
            color: '#FF4500', 
            textDecoration: 'none', 
            fontSize: '13px', 
            fontWeight: 600 
          }}>
            ← Dashboard
          </Link>
          <span style={{ color: 'rgba(255,240,232,0.4)', fontSize: '12px' }}>
            Business English Level 1
          </span>
        </div>
        <Link href="/dashboard" style={{ 
          color: 'rgba(255,240,232,0.6)', 
          textDecoration: 'none', 
          fontSize: '12px' 
        }}>
          my account
        </Link>
      </div>
      
      {/* Book content */}
      <div style={{ height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
        <iframe
          srcDoc={htmlContent}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Business English Book"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </main>
  )
}