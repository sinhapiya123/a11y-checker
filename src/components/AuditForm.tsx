import { useState } from 'react'
import { fetchHtmlFromUrl, runAudit } from '../lib/auditor'
import type { AuditResult } from '../types'

interface Props {
  onResult: (r: AuditResult | null) => void
  onLoading: (v: boolean) => void
  onError: (e: string) => void
}

export default function AuditForm({ onResult, onLoading, onError }: Props) {
  const [mode, setMode] = useState<'paste' | 'url'>('paste')
  const [html, setHtml] = useState('')
  const [url, setUrl] = useState('')

  async function handleRun() {
    onLoading(true)
    onError('')
    onResult(null)
    try {
      console.log('Mode:', mode, 'URL:', url, 'HTML length:', html.length)
      const source = mode === 'url' ? await fetchHtmlFromUrl(url) : html
      console.log('Source obtained:', source.slice(0, 100))
      if (!source.trim()) throw new Error('Nothing to audit — paste HTML or enter a URL.')
      const result = await runAudit(source)
      onResult(result)
    } catch (e: any) {
      console.error('Error:', e)
      onError(e.message)
    }
    onLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['paste', 'url'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              border: mode === m ? '2px solid #5B5ADB' : '1px solid #ddd',
              background: mode === m ? '#EEEDFE' : '#fff',
              color: mode === m ? '#3C3489' : '#555',
              fontWeight: mode === m ? 500 : 400,
            }}
          >
            {m === 'paste' ? 'Paste HTML' : 'Enter URL'}
          </button>
        ))}
      </div>

      {mode === 'paste' ? (
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          placeholder="Paste your HTML component or page here..."
          rows={10}
          style={{
            width: '100%', boxSizing: 'border-box', fontFamily: 'monospace',
            fontSize: 13, padding: '10px 12px', borderRadius: 8,
            border: '1px solid #ddd', resize: 'vertical', lineHeight: 1.6,
          }}
        />
      ) : (
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          style={{
            width: '100%', boxSizing: 'border-box', fontSize: 14,
            padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd',
          }}
        />
      )}

      <button
        onClick={handleRun}
        style={{
          marginTop: 14, padding: '10px 28px', borderRadius: 8,
          background: '#5B5ADB', color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Run audit
      </button>
    </div>
  )
}