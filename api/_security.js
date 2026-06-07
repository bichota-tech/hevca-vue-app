import crypto from 'crypto'

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
export const MAX_REQUESTS_PER_WINDOW = 8
export const MAX_BODY_SIZE_BYTES = 10 * 1024
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://hevca-vue-app.vercel.app']

export const rateLimitMap = new Map()

export const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

export const extractOrigin = (value) => {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export const getAllowedOrigins = () => {
  const env = process.env.ALLOWED_ORIGINS
  if (!env) return DEFAULT_ALLOWED_ORIGINS
  return env.split(',').map((origin) => origin.trim()).filter(Boolean)
}

export const isOriginAllowed = (origin, allowedOrigins) => {
  if (!origin) return true
  const normalized = origin.toLowerCase()
  return allowedOrigins.some((allowedOrigin) => {
    const normalizedAllowed = allowedOrigin.toLowerCase()
    if (normalizedAllowed.startsWith('*.')) {
      return normalized.endsWith(normalizedAllowed.slice(1))
    }
    return normalized === normalizedAllowed
  })
}

export const incrementRateLimit = (req) => {
  const clientIp = getClientIp(req)
  const now = Date.now()
  const entry = rateLimitMap.get(clientIp) || { count: 0, windowStart: now }

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0
    entry.windowStart = now
  }

  entry.count += 1
  rateLimitMap.set(clientIp, entry)

  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return { success: false, status: 429, error: 'Too many requests. Please wait and try again.' }
  }

  return { success: true, count: entry.count }
}

const toBase64Url = (value) => {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const fromBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  return Buffer.from(base64, 'base64').toString('utf8')
}

export const createHmacToken = (secret, payload) => {
  const rawPayload = typeof payload === 'string' ? payload : JSON.stringify(payload)
  const signature = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex')
  return toBase64Url(`${rawPayload}.${signature}`)
}

export const verifyHmacToken = (secret, token, expectedOrigin) => {
  if (!token) {
    return { success: false, error: 'Missing token.' }
  }

  let decoded
  try {
    decoded = fromBase64Url(token)
  } catch {
    return { success: false, error: 'Invalid token format.' }
  }

  const lastDot = decoded.lastIndexOf('.')
  if (lastDot < 0) {
    return { success: false, error: 'Token format invalid.' }
  }

  const rawPayload = decoded.slice(0, lastDot)
  const signature = decoded.slice(lastDot + 1)
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex')

  const signatureBuffer = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return { success: false, error: 'Invalid token signature.' }
  }

  let payload
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return { success: false, error: 'Invalid token payload.' }
  }

  if (payload.type !== 'contact-token') {
    return { success: false, error: 'Invalid token type.' }
  }

  if (typeof payload.iat !== 'number' || Date.now() - payload.iat > 5 * 60 * 1000) {
    return { success: false, error: 'Token expired.' }
  }

  if (expectedOrigin && payload.origin && expectedOrigin !== payload.origin) {
    return { success: false, error: 'Token origin mismatch.' }
  }

  return { success: true, payload }
}
