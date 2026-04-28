import { useState } from 'react'
import type { Issue, Severity } from '../types'

const SEV_CONFIG: Record<Severity, { color: string; bg: string; label: string; icon: string }> = {
  critical: { color: 'var(--critical)', bg: 'var(--critical-bg)', label: 'Critical', icon: '✕' },
  serious:  { color: 'var(--serious)',  bg: 'var(--serious-bg)',  label: 'Serious',  icon: '!' },
  moderate: { color: 'var(--moderate)', bg: 'var(--moderate-bg)', label: 'Moderate', icon: '~' },
  minor:    { color: 'var(--minor)',    bg: 'var(--minor-bg)',    label: 'Minor',    icon: '·' },
}

export default function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(true)
  const s = SEV_CONFIG[issue.severity]

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${s.color}`,
      borderRadius: 'var(--radius)',
      background: 'var(--bg2)',
      overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 10, padding: '12px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          background: s.bg, color: s.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)',
          flexShrink: 0,
        }}>{s.icon}</span>

        <span style={{
          fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 500,
          color: s.color, background: s.bg,
          padding: '2px 8px', borderRadius: 5, flexShrink: 0,
        }}>{s.label}</span>

        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', flexShrink: 0 }}>
          {issue.criterion}
        </span>

        <span style={{
          fontSize: 12, color: 'var(--text3)',
          marginLeft: 'auto', flexShrink: 0,
        }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Affected */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {issue.impact.map(i => (
              <span key={i} style={{
                fontSize: 11, fontFamily: 'var(--mono)',
                color: 'var(--text3)', background: 'var(--bg3)',
                border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 5,
              }}>{i}</span>
            ))}
          </div>

          {/* Broken */}
          <div>
            <div style={{
              fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 500,
              color: 'var(--critical)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--critical)', display: 'inline-block' }} />
              broken
            </div>
            <pre style={{
              background: 'rgba(255,92,92,0.04)',
              border: '1px solid rgba(255,92,92,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 12, fontFamily: 'var(--mono)',
              color: 'var(--text2)',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              margin: 0,
            }}>{issue.broken}</pre>
          </div>

          {/* Fixed */}
          <div>
            <div style={{
              fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 500,
              color: 'var(--minor)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--minor)', display: 'inline-block' }} />
              fix
            </div>
            <pre style={{
              background: 'rgba(107,203,119,0.04)',
              border: '1px solid rgba(107,203,119,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 12, fontFamily: 'var(--mono)',
              color: 'var(--text2)',
              whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              margin: 0,
            }}>{issue.fixed}</pre>
          </div>

          {/* Explanation */}
          <p style={{
            fontSize: 13, color: 'var(--text2)', margin: 0,
            fontStyle: 'italic', lineHeight: 1.6,
            borderTop: '1px solid var(--border)',
            paddingTop: 10,
          }}>{issue.explanation}</p>
        </div>
      )}
    </div>
  )
}
