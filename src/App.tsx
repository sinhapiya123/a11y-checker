import { useState } from 'react'
import AuditForm from './components/AuditForm'
import AuditResult from './components/AuditResult'
import type { AuditResult as AuditResultType } from './types'

export default function App() {
  const [result, setResult] = useState<AuditResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  console.log('key loaded:', !!import.meta.env.VITE_ANTHROPIC_API_KEY);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, margin: '0 0 6px' }}>A11y Checker</h1>
        <p style={{ fontSize: 14, color: '#888', margin: 0 }}>
          WCAG 2.1 AA audit powered by Claude — paste HTML or enter a URL
        </p>
      </div>

      <AuditForm
        onResult={r => { setResult(r); setError('') }}
        onLoading={setLoading}
        onError={setError}
      />

      {loading && (
        <div style={{ marginTop: 32, fontSize: 14, color: '#888' }}>
          Auditing... this takes a few seconds
        </div>
      )}

      {error && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: '#FCEBEB', borderRadius: 8, color: '#A32D2D', fontSize: 13 }}>
          {error}
        </div>
      )}

      {result && !loading && <AuditResult result={result} />}
    </div>
  )
}