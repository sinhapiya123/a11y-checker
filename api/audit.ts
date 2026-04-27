import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM = `You are a WCAG 2.1 AA accessibility auditor.
Given HTML, return ONLY a JSON object (no markdown, no explanation) with this exact shape:
{
  "grade": "A|B|C|F",
  "summary": { "critical": 0, "serious": 0, "moderate": 0, "minor": 0 },
  "principles": {
    "perceivable": "pass|fail",
    "operable": "pass|fail",
    "understandable": "pass|fail",
    "robust": "pass|fail"
  },
  "issues": [{
    "id": "a11y-001",
    "severity": "critical|serious|moderate|minor",
    "criterion": "e.g. 1.1.1 Non-text content",
    "impact": ["screen reader users"],
    "broken": "exact broken snippet",
    "fixed": "corrected replacement",
    "explanation": "one sentence why this fix works"
  }]
}
Grade: A = no critical, B = has critical, C = multiple serious, F = widespread failures.`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { html } = req.body
  if (!html) {
    return res.status(400).json({ error: 'Missing html in request body' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Audit this HTML:\n\n${html.slice(0, 10000)}` }],
      }),
    })

    const data = await response.json()
    if (data.error) return res.status(500).json({ error: data.error.message })

    const text = data.content.map((b: any) => b.text || '').join('')
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())
    return res.status(200).json(result)
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}