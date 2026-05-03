import { useState, useEffect } from 'react'
import { fetchHtmlFromUrl, runAudit } from '../lib/auditor'
import type { AuditResult } from '../types'

interface Props {
  onResult: (r: AuditResult | null, label: string) => void
  onLoading: (v: boolean) => void
  onError: (e: string) => void
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export default function AuditForm({ onResult, onLoading, onError }: Props) {
  const [mode, setMode] = useState<'paste' | 'url'>('paste')
  const [html, setHtml] = useState('')
  const [url, setUrl] = useState('')
  const [focused, setFocused] = useState(false)

  async function handleRun() {
    onLoading(true)
    onError('')
    onResult(null, '')

    try {
      // Validate input before running
      if (mode === 'url') {
        const trimmed = url.trim()
        if (!trimmed) throw new Error('Please enter a URL to audit.')

        // Check if user pasted HTML into URL field
        if (trimmed.startsWith('<') || trimmed.includes('</')) {
          throw new Error('Looks like you pasted HTML — switch to the "paste html" tab instead.')
        }
      }

      if (mode === 'paste') {
        const trimmed = html.trim()
        if (!trimmed) throw new Error('Please paste some HTML to audit.')

        // Check if user pasted a URL into HTML field
        if (/^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed)) {
          throw new Error('Looks like you entered a URL — switch to the "enter url" tab instead.')
        }
      }

      const normalizedUrl = normalizeUrl(url)
      const source = mode === 'url' ? await fetchHtmlFromUrl(normalizedUrl) : html
      if (!source.trim()) throw new Error('Nothing to audit — paste HTML or enter a URL.')

      const result = await runAudit(source)
      const label = mode === 'url' ? normalizedUrl : html.slice(0, 60).replace(/\n/g, ' ')
      onResult(result, label)
    } catch (e: any) {
      // Map technical errors to friendly messages
      const msg: string = e.message ?? ''
      if (msg.includes('Unterminated string') || msg.includes('JSON')) {
        onError('The page returned too much content to parse. Try a smaller HTML snippet using the "paste html" tab instead.')
      } else if (msg.includes('Internal Server Error')) {
        onError('Could not fetch that URL — the server blocked the request. Try pasting the page\'s HTML directly using the "paste html" tab.')
      } else if (msg.includes('Failed to fetch URL')) {
        onError('Could not reach that URL. Check that it\'s public and try again.')
      } else {
        onError(msg)
      }
    }

    onLoading(false)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [html, url, mode])

  const inputStyles: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg2)',
    border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: 13,
    padding: '14px 16px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focused ? '0 0 0 3px var(--accent-glow)' : 'none',
    resize: 'vertical' as const,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'inline-flex', background: 'var(--bg3)',
        border: '1px solid var(--border)', borderRadius: 10, padding: 3, width: 'fit-content',
      }}>
        {(['paste', 'url'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '6px 20px', borderRadius: 8, fontSize: 12,
            fontFamily: 'var(--mono)', fontWeight: 500, cursor: 'pointer',
            border: 'none', transition: 'all 0.15s',
            background: mode === m ? 'var(--accent)' : 'transparent',
            color: mode === m ? '#fff' : 'var(--text3)',
            letterSpacing: '0.03em',
          }}>
            {m === 'paste' ? '{ } paste html' : '⌘ enter url'}
          </button>
        ))}
      </div>

      {mode === 'paste' ? (
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`<div>\n  <!-- paste your component here -->\n</div>`}
          rows={9}
          style={inputStyles}
        />
      ) : (
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && handleRun()}
          placeholder="https://example.com"
          style={{ ...inputStyles, resize: undefined }}
        />
      )}

      <button
        onClick={handleRun}
        style={{
          padding: '14px 32px', borderRadius: 'var(--radius)',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: '#fff', border: 'none', fontSize: 14,
          fontFamily: 'var(--sans)', fontWeight: 600, cursor: 'pointer',
          letterSpacing: '-0.01em', transition: 'opacity 0.15s, transform 0.1s',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
      >
        Run audit →
      </button>
      <span style={{
        fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4,
      }}>
        or press ⌘ + Enter
      </span>
    </div>
  )
}