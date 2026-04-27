import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url param' })
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; A11yChecker/1.0)' },
    })
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText })
    }
    const html = await response.text()
    res.setHeader('Content-Type', 'text/plain')
    return res.status(200).send(html)
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}