import { useState, useEffect } from 'react'
import AuditForm from './components/AuditForm'
import AuditResult from './components/AuditResult'
import type { AuditResult as AuditResultType } from './types'
import './index.css'
import confetti from 'canvas-confetti'
import { encodeResult, decodeResult } from './lib/auditor'

interface HistoryEntry {
  id: string
  label: string
  grade: string
  timestamp: number
  result: AuditResultType
}

const MAX_HISTORY = 10

export default function App() {
  const [result, setResult] = useState<AuditResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('a11y-history')
      if (saved) setHistory(JSON.parse(saved))
    } catch { }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shared = params.get('result')
    if (shared) {
      const decoded = decodeResult(shared)
      if (decoded) setResult(decoded)
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '')
  }

  function saveToHistory(r: AuditResultType, label: string) {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      label: label.slice(0, 60) || 'Untitled audit',
      grade: r.grade,
      timestamp: Date.now(),
      result: r,
    }
    const updated = [entry, ...history].slice(0, MAX_HISTORY)
    setHistory(updated)
    try { localStorage.setItem('a11y-history', JSON.stringify(updated)) } catch { }
  }

  function loadFromHistory(entry: HistoryEntry) {
    setResult(entry.result)
    setHistoryOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteFromHistory(id: string) {
    const updated = history.filter(e => e.id !== id)
    setHistory(updated)
    try { localStorage.setItem('a11y-history', JSON.stringify(updated)) } catch { }
  }

  const GRADE_COLOR: Record<string, string> = {
    A: 'var(--minor)', B: 'var(--serious)', C: 'var(--critical)', F: 'var(--critical)'
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

          {/* History button — only show when there are entries */}
          {history.length > 0 && (
            <button
              onClick={() => setHistoryOpen(o => !o)}
              style={{
                fontSize: 11, fontFamily: 'var(--mono)',
                padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: historyOpen ? 'var(--bg4)' : 'var(--bg3)',
                color: historyOpen ? 'var(--text)' : 'var(--text3)',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              history
              <span style={{
                background: 'var(--accent)', color: '#fff',
                borderRadius: 10, padding: '1px 6px', fontSize: 10,
              }}>{history.length}</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              fontSize: 14, background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '3px 8px', cursor: 'pointer',
              color: 'var(--text3)', transition: 'color 0.15s, border-color 0.15s', lineHeight: 1,
            }}
          >{theme === 'dark' ? '☀️' : '🌙'}</button>

          <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer"
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

      {/* History drawer */}
      {historyOpen && (
        <div style={{
          position: 'fixed', top: 60, right: 0, bottom: 0, width: 320,
          background: 'var(--bg2)', borderLeft: '1px solid var(--border)',
          zIndex: 99, overflowY: 'auto', padding: 16,
          animation: 'fadeUp 0.2s ease both',
        }}>
          {/* Drawer header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
              audit history
            </span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {history.length > 0 && (
                <button
                  onClick={() => { setHistory([]); localStorage.removeItem('a11y-history') }}
                  style={{
                    fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >clear all</button>
              )}
              {/* Close button */}
              <button
                onClick={() => setHistoryOpen(false)}
                style={{
                  fontSize: 14, color: 'var(--text3)', background: 'none',
                  border: 'none', cursor: 'pointer', lineHeight: 1, padding: '2px 4px',
                }}
              >✕</button>
            </div>
          </div>

          {/* History entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(entry => (
              <div key={entry.id} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                cursor: 'pointer',
              }}
                onClick={() => loadFromHistory(entry)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{
                    fontSize: 18, fontWeight: 700,
                    color: GRADE_COLOR[entry.grade] ?? 'var(--text)',
                    fontFamily: 'var(--sans)',
                  }}>{entry.grade}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteFromHistory(entry.id) }}
                      style={{
                        fontSize: 11, color: 'var(--text3)', background: 'none',
                        border: 'none', cursor: 'pointer', lineHeight: 1,
                      }}
                    >✕</button>
                  </div>
                </div>
                <p style={{
                  fontSize: 12, color: 'var(--text2)', margin: 0,
                  fontFamily: 'var(--mono)', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{entry.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{
        padding: '32px 32px 28px', maxWidth: 720, margin: '0 auto',
        width: '100%', animation: 'fadeUp 0.5s ease both',
      }}>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--text)',
        }}>
          Accessibility audits,{' '}
          <span style={{ color: 'var(--accent2)' }}>instant fixes.</span>
        </h1>

        <p style={{
          fontSize: 17, color: 'var(--text2)', lineHeight: 1.7,
          maxWidth: 520, marginBottom: 48, textAlign: 'center',
        }}>
          Paste HTML or enter a URL — get a full WCAG 2.1 AA audit with severity ratings,
          affected user groups, and exact code fixes in seconds.
        </p>

        {/* Info section */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10, marginBottom: 36,
        }}>
          {[
            {
              icon: '👁',
              title: 'Perceivable',
              items: ['Missing alt text', 'Color contrast < 4.5:1', 'Missing captions', 'Non-adaptable content'],
            },
            {
              icon: '⌨️',
              title: 'Operable',
              items: ['Keyboard inaccessibility', 'Missing focus indicators', 'No skip links', 'Seizure risks'],
            },
            {
              icon: '💬',
              title: 'Understandable',
              items: ['Missing form labels', 'Unclear error messages', 'Missing language attr', 'Inconsistent navigation'],
            },
            {
              icon: '🔧',
              title: 'Robust',
              items: ['Invalid ARIA usage', 'Deprecated HTML', 'Missing landmarks', 'Roles without children'],
            },
          ].map(section => (
            <div key={section.title} style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{section.icon}</span>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--accent2)',
                  fontFamily: 'var(--mono)',
                }}>{section.title}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {section.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: 'var(--text3)', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <AuditForm
          onResult={(r, label) => {
            setResult(r)
            setError('')
            if (r) {
              saveToHistory(r, label)
              if (r.grade === 'A') {
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#7c6af7', '#a594ff', '#6bcb77', '#4ea8de', '#ffffff'],
                })
              }
            }
          }}
          onLoading={setLoading}
          onError={setError}
        />

        {loading && <LoadingState />}

        {error && (
          <div style={{
            marginTop: 20, padding: '14px 18px',
            background: 'rgba(255,92,92,0.08)',
            border: '1px solid rgba(255,92,92,0.2)',
            borderRadius: 'var(--radius)', color: 'var(--critical)',
            fontSize: 13, fontFamily: 'var(--mono)',
          }}>⚠ {error}</div>
        )}
      </div>

      {result && !loading && (
        <div style={{
          maxWidth: 720, margin: '0 auto', width: '100%',
          padding: '0 32px 80px', animation: 'fadeUp 0.4s ease both',
        }}>
          {/* Share button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button
              onClick={() => {
                const encoded = encodeResult(result)
                const url = `${window.location.origin}?result=${encoded}`
                navigator.clipboard.writeText(url).then(() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                })
              }}
              style={{
                fontSize: 11, fontFamily: 'var(--mono)',
                padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: copied ? 'rgba(107,203,119,0.1)' : 'var(--bg3)',
                color: copied ? 'var(--minor)' : 'var(--text3)',
                transition: 'all 0.15s',
              }}
            >
              {copied ? '✓ link copied!' : '↗ share results'}
            </button>
          </div>

          <AuditResult result={result} />
        </div>
      )}

      {!result && !loading && (
        <footer style={{
          marginTop: 'auto', borderTop: '1px solid var(--border)',
          padding: '20px 32px', display: 'flex', justifyContent: 'center', gap: 24,
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
          height: 56, borderRadius: 'var(--radius)',
          background: `linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)`,
          backgroundSize: '200% 100%',
          animation: `shimmer 1.5s infinite ${i * 0.15}s`,
          opacity: 1 - (i - 1) * 0.2,
        }} />
      ))}
      <p style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 8 }}>
        Auditing for WCAG violations...
      </p>
    </div>
  )
}
