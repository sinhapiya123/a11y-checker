import type { Issue, Severity } from '../types'

const SEV: Record<Severity, { bg: string; color: string }> = {
  critical: { bg: '#FCEBEB', color: '#A32D2D' },
  serious:  { bg: '#FAEEDA', color: '#633806' },
  moderate: { bg: '#E6F1FB', color: '#0C447C' },
  minor:    { bg: '#F1EFE8', color: '#444441' },
}

export default function IssueCard({ issue }: { issue: Issue }) {
  const s = SEV[issue.severity]
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ ...s, fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 6 }}>
          {issue.severity}
        </span>
        <span style={{ fontSize: 12, color: '#777' }}>{issue.criterion}</span>
        <span style={{ fontSize: 12, color: '#aaa' }}>{issue.impact.join(', ')}</span>
      </div>

      <p style={{ fontSize: 11, fontWeight: 500, color: '#c00', margin: '0 0 3px' }}>Broken</p>
      <pre style={{ background: '#fff5f5', borderRadius: 6, padding: '7px 10px', fontSize: 12, margin: '0 0 8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {issue.broken}
      </pre>

      <p style={{ fontSize: 11, fontWeight: 500, color: '#3B6D11', margin: '0 0 3px' }}>Fix</p>
      <pre style={{ background: '#f0faf5', borderRadius: 6, padding: '7px 10px', fontSize: 12, margin: '0 0 8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {issue.fixed}
      </pre>

      <p style={{ fontSize: 12, color: '#666', margin: 0, fontStyle: 'italic' }}>{issue.explanation}</p>
    </div>
  )
}