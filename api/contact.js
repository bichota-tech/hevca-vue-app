const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 8
const MAX_BODY_SIZE_BYTES = 10 * 1024
const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

const rateLimitMap = new Map()

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

const getAllowedOrigins = () => {
  const env = process.env.ALLOWED_ORIGINS
  if (!env) return DEFAULT_ALLOWED_ORIGINS
  return env.split(',').map((origin) => origin.trim()).filter(Boolean)
}

const extractOrigin = (value) => {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

const isOriginAllowed = (origin, allowedOrigins) => {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return res.status(415).json({ success: false, error: 'Content type must be application/json.' })
  }

  const contentLength = Number(req.headers['content-length'])
  if (contentLength && contentLength > MAX_BODY_SIZE_BYTES) {
    return res.status(413).json({ success: false, error: 'Request body too large.' })
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
    return res.status(429).json({ success: false, error: 'Too many requests. Please wait and try again.' })
  }

  const { name, email, service, message, botcheck } = await req.json()
  const errors = {}
  const sanitizedName = typeof name === 'string' ? name.trim() : ''
  const sanitizedEmail = typeof email === 'string' ? email.trim() : ''
  const sanitizedService = typeof service === 'string' ? service.trim() : ''
  const sanitizedMessage = typeof message === 'string' ? message.trim() : ''

  if (botcheck) {
    return res.status(400).json({ success: false, error: 'Bot detected' })
  }

  if (!sanitizedName) {
    errors.name = 'Por favor escribe tu nombre.'
  } else if (sanitizedName.length > 100) {
    errors.name = 'Nombre demasiado largo.'
  }

  if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    errors.email = 'Introduce un correo válido.'
  } else if (sanitizedEmail.length > 254) {
    errors.email = 'Correo demasiado largo.'
  }

  if (!sanitizedService) {
    errors.service = 'Selecciona una sesión.'
  } else if (sanitizedService.length > 100) {
    errors.service = 'Servicio no válido.'
  }

  if (sanitizedMessage.length > 2000) {
    errors.message = 'El mensaje es demasiado largo.'
  }

  if (Object.keys(errors).length) {
    return res.status(422).json({ success: false, errors })
  }

  if (!process.env.WEB3FORMS_KEY) {
    return res.status(500).json({ success: false, error: 'Server is not configured properly.' })
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: 'Nuevo mensaje desde HEVCA Photo & Art',
        name: sanitizedName,
        email: sanitizedEmail,
        service: sanitizedService,
        message: sanitizedMessage,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      return res.status(502).json({ success: false, error: data.message || 'Error forwarding message' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return res.status(500).json({ success: false, error: 'Error interno del servidor' })
  }
}
