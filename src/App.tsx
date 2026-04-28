import { useState } from 'react'
import AuditForm from './components/AuditForm'
import AuditResult from './components/AuditResult'
import type { AuditResult as AuditResultType } from './types'
import './index.css'

export default function App() {
  const [result, setResult] = useState<AuditResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: theme === 'dark' ? 'rgba(10,10,15,0.8)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--mono)',
          }}>A</div>
          <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--text)' }}>
            a11y<span style={{ color: 'var(--accent)' }}>.</span>checker
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              fontSize: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '3px 8px',
              cursor: 'pointer',
              color: 'var(--text3)',
              transition: 'color 0.15s, border-color 0.15s',
              lineHeight: 1,
            }}
            onMouseEnter={e => { (e.currentTarget).style.color = 'var(--text)'; (e.currentTarget).style.borderColor = 'var(--border2)' }}
            onMouseLeave={e => { (e.currentTarget).style.color = 'var(--text3)'; (e.currentTarget).style.borderColor = 'var(--border)' }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <a
            href="https://www.w3.org/TR/WCAG21/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              padding: '3px 8px', borderRadius: 6, textDecoration: 'none',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)' }}
          >WCAG 2.1 AA ↗</a>

          <a href="https://github.com/sinhapiya123/a11y-checker" target="_blank"
            style={{
              fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)',
              background: 'var(--bg3)', border: '1px solid var(--border)',
              padding: '3px 8px', borderRadius: 6, textDecoration: 'none',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text)'; (e.target as HTMLElement).style.borderColor = 'var(--border2)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text3)'; (e.target as HTMLElement).style.borderColor = 'var(--border)' }}
          >GitHub ↗</a>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        padding: '32px 32px 28px',
        maxWidth: 720,
        margin: '0 auto',
        width: '100%',
        animation: 'fadeUp 0.5s ease both',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent-glow)', border: '1px solid rgba(124,106,247,0.3)',
          borderRadius: 20, padding: '4px 12px', marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
          <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--accent2)' }}>Powered by Claude AI</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 16,
          color: 'var(--text)',
        }}>
          Accessibility audits,{' '}
          <span style={{ color: 'var(--accent2)' }}>instant fixes.</span>
        </h1>

        <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 48, textAlign: 'center' }}>          Paste HTML or enter a URL — get a full WCAG 2.1 AA audit with severity ratings,
          affected user groups, and exact code fixes in seconds.
        </p>

        <AuditForm
          onResult={r => { setResult(r); setError('') }}
          onLoading={setLoading}
          onError={setError}
        />

        {loading && <LoadingState />}

        {error && (
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            background: 'rgba(255,92,92,0.08)',
            border: '1px solid rgba(255,92,92,0.2)',
            borderRadius: 'var(--radius)',
            color: 'var(--critical)',
            fontSize: 13,
            fontFamily: 'var(--mono)',
          }}>
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && !loading && (
        <div style={{
          maxWidth: 720, margin: '0 auto', width: '100%',
          padding: '0 32px 80px',
          animation: 'fadeUp 0.4s ease both',
        }}>
          <AuditResult result={result} />
        </div>
      )}

      {/* Footer */}
      {!result && !loading && (
        <footer style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border)',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
        }}>
          {['Perceivable', 'Operable', 'Understandable', 'Robust'].map(p => (
            <span key={p} style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{p}</span>
          ))}
        </footer>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: 56,
          borderRadius: 'var(--radius)',
          background: `linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)`,
          backgroundSize: '200% 100%',
          animation: `shimmer 1.5s infinite ${i * 0.15}s`,
          opacity: 1 - (i - 1) * 0.2,
        }} />
      ))}
      <p style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 8 }}>
        Auditing for WCAG violations<span style={{ animation: 'pulse-ring 1s infinite' }}>...</span>
      </p>
    </div>
  )
}
