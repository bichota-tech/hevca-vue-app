import { createHmacToken, extractOrigin, getAllowedOrigins, isOriginAllowed, incrementRateLimit } from './_security.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const originHeader = extractOrigin(req.headers.origin)
  const refererHeader = extractOrigin(req.headers.referer)
  const allowedOrigins = getAllowedOrigins()

  if (originHeader && !isOriginAllowed(originHeader, allowedOrigins)) {
    return res.status(403).json({ success: false, error: 'Origin not allowed.' })
  }

  if (refererHeader && !isOriginAllowed(refererHeader, allowedOrigins)) {
    return res.status(403).json({ success: false, error: 'Referer not allowed.' })
  }

  const rateLimitResult = incrementRateLimit(req)
  if (!rateLimitResult.success) {
    return res.status(rateLimitResult.status).json({ success: false, error: rateLimitResult.error })
  }

  const secret = process.env.HMAC_SECRET_KEY
  if (!secret) {
    return res.status(200).json({ success: true, enabled: false, token: null })
  }

  const origin = originHeader || refererHeader || null
  const payload = {
    type: 'contact-token',
    iat: Date.now(),
    origin,
  }

  const token = createHmacToken(secret, payload)
  return res.status(200).json({ success: true, enabled: true, token })
}
