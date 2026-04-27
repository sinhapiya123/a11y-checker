import type { AuditResult, Severity } from '../types'
import IssueCard from './IssueCard'

const GRADE_COLOR: Record<string, string> = {
  A: '#3B6D11', B: '#854F0B', C: '#A32D2D', F: '#A32D2D'
}
const SEV_COLOR: Record<Severity, string> = {
  critical: '#A32D2D', serious: '#633806', moderate: '#0C447C', minor: '#444441'
}

export default function AuditResult({ result }: { result: AuditResult }) {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 48, fontWeight: 500, color: GRADE_COLOR[result.grade] }}>
          {result.grade}
        </span>
        <span style={{ fontSize: 14, color: '#888' }}>overall grade</span>
      </div>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {(Object.entries(result.summary) as [Severity, number][]).map(([k, v]) => (
          <div key={k} style={{ background: '#f7f7f7', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 500, color: SEV_COLOR[k] }}>{v}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
        {Object.entries(result.principles).map(([k, v]) => (
          <div key={k} style={{ background: '#f9f9f9', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: v === 'pass' ? '#3B6D11' : '#A32D2D' }}>
              {v === 'pass' ? 'Pass' : 'Fail'}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Issues */}
      <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>
        {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} found
      </h2>
      {result.issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
    </div>
  )
}