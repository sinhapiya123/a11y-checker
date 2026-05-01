import type { AuditResult } from '../types'

export async function fetchHtmlFromUrl(url: string): Promise<string> {
    const res = await fetch(`/api/fetch-url?url=${encodeURIComponent(url)}`)
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.statusText}`)
    return res.text()
}

export async function runAudit(html: string): Promise<AuditResult> {
    const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
    })

    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data as AuditResult
}

export function encodeResult(result: AuditResult): string {
    return btoa(encodeURIComponent(JSON.stringify(result)))
}

export function decodeResult(encoded: string): AuditResult | null {
    try {
        return JSON.parse(decodeURIComponent(atob(encoded)))
    } catch {
        return null
    }
}