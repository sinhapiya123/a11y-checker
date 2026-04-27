export type Severity = 'critical' | 'serious' | 'moderate' | 'minor'

export interface Issue {
  id: string
  severity: Severity
  criterion: string
  impact: string[]
  broken: string
  fixed: string
  explanation: string
}

export interface AuditResult {
  grade: 'A' | 'B' | 'C' | 'F'
  summary: Record<Severity, number>
  principles: {
    perceivable: 'pass' | 'fail'
    operable: 'pass' | 'fail'
    understandable: 'pass' | 'fail'
    robust: 'pass' | 'fail'
  }
  issues: Issue[]
}