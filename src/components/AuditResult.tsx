import { useState } from 'react'
import type { AuditResult, Severity } from '../types'
import IssueCard from './IssueCard'

const GRADE_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  A: { color: 'var(--minor)', bg: 'rgba(107,203,119,0.08)', label: 'Excellent' },
  B: { color: 'var(--serious)', bg: 'rgba(255,159,69,0.08)', label: 'Needs work' },
  C: { color: 'var(--critical)', bg: 'rgba(255,92,92,0.08)', label: 'Poor' },
  F: { color: 'var(--critical)', bg: 'rgba(255,92,92,0.08)', label: 'Failing' },
}

const SEV_COLOR: Record<Severity, string> = {
  critical: 'var(--critical)',
  serious: 'var(--serious)',
  moderate: 'var(--moderate)',
  minor: 'var(--minor)',
}

const ALL_SEVERITIES: Severity[] = ['critical', 'serious', 'moderate', 'minor']

export default function AuditResult({ result }: { result: AuditResult }) {
  const [activeFilters, setActiveFilters] = useState<Severity[]>([...ALL_SEVERITIES])
  const g = GRADE_CONFIG[result.grade] ?? GRADE_CONFIG['F']
  const total = Object.values(result.summary).reduce((a, b) => a + b, 0)

  function toggleFilter(sev: Severity) {
    setActiveFilters(prev => {
      // if only this severity is active, reset to all
      if (prev.length === 1 && prev[0] === sev) return [...ALL_SEVERITIES]
      // otherwise isolate this severity
      return [sev]
    })
  }

  const filtered = result.issues.filter(i => activeFilters.includes(i.severity))
  const allActive = activeFilters.length === ALL_SEVERITIES.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        color: 'var(--text3)', fontSize: 11, fontFamily: 'var(--mono)',
      }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        audit results
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Grade + Summary row */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{
          background: g.bg,
          border: `1px solid ${g.color}33`,
          borderRadius: 'var(--radius)',
          padding: '20px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          minWidth: 100,
        }}>
          <span style={{
            fontSize: 56, fontWeight: 800, lineHeight: 1,
            color: g.color, fontFamily: 'var(--sans)',
          }}>{result.grade}</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: g.color, marginTop: 4, opacity: 0.8 }}>
            {g.label}
          </span>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, minWidth: 200 }}>
          {(Object.entries(result.summary) as [Severity, number][]).map(([k, v]) => (
            <div key={k} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: SEV_COLOR[k], flexShrink: 0,
              }} />
              <span style={{ fontSize: 22, fontWeight: 700, color: SEV_COLOR[k], fontFamily: 'var(--sans)' }}>{v}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {Object.entries(result.principles).map(([k, v]) => (
          <div key={k} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{
              fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 500,
              color: v === 'pass' ? 'var(--pass)' : 'var(--fail)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: v === 'pass' ? 'var(--pass)' : 'var(--fail)',
              }} />
              {v === 'pass' ? 'Pass' : 'Fail'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'capitalize' }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Issues header + filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>
          {filtered.length} of {total} issue{total !== 1 ? 's' : ''}
        </h2>

        {/* Filter toggles */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilters([...ALL_SEVERITIES])}
            style={{
              fontSize: 11, fontFamily: 'var(--mono)',
              padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
              border: '1px solid var(--border)',
              background: allActive ? 'var(--bg4)' : 'var(--bg2)',
              color: allActive ? 'var(--text)' : 'var(--text3)',
              transition: 'all 0.15s',
            }}
          >all</button>

          {ALL_SEVERITIES.map(sev => {
            const isActive = activeFilters.includes(sev) && !allActive
            const count = result.summary[sev]
            return (
              <button
                key={sev}
                onClick={() => toggleFilter(sev)}
                style={{
                  fontSize: 11, fontFamily: 'var(--mono)',
                  padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${isActive ? SEV_COLOR[sev] : 'var(--border)'}`,
                  background: isActive ? `${SEV_COLOR[sev]}18` : 'var(--bg2)',
                  color: isActive ? SEV_COLOR[sev] : 'var(--text3)',
                  transition: 'all 0.15s',
                  opacity: count === 0 ? 0.35 : 1,
                }}
              >
                {sev} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Issue cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: '32px', textAlign: 'center',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 13,
          }}>
            No {activeFilters.join(', ')} issues found
          </div>
        ) : (
          filtered.map(issue => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  )
}