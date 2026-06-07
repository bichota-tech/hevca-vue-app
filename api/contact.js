import { extractOrigin, getAllowedOrigins, isOriginAllowed, incrementRateLimit, MAX_BODY_SIZE_BYTES, verifyHmacToken } from './_security.js'

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

  const rateLimitResult = incrementRateLimit(req)
  if (!rateLimitResult.success) {
    return res.status(rateLimitResult.status).json({ success: false, error: rateLimitResult.error })
  }

  const { name, email, service, message, botcheck, turnstileToken, hmacToken } = await req.json()
  const errors = {}
  const sanitizedName = typeof name === 'string' ? name.trim() : ''
  const sanitizedEmail = typeof email === 'string' ? email.trim() : ''
  const sanitizedService = typeof service === 'string' ? service.trim() : ''
  const sanitizedMessage = typeof message === 'string' ? message.trim() : ''

  if (botcheck) {
    return res.status(400).json({ success: false, error: 'Bot detected' })
  }

  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY
  const HMAC_SECRET_KEY = process.env.HMAC_SECRET_KEY

  if (HMAC_SECRET_KEY) {
    const hmacValidation = verifyHmacToken(HMAC_SECRET_KEY, hmacToken, originHeader || refererHeader)
    if (!hmacValidation.success) {
      return res.status(401).json({ success: false, error: hmacValidation.error })
    }
  }

  if (TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return res.status(403).json({ success: false, error: 'Captcha token missing.' })
    }

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    })

    const verifyData = await verifyResponse.json()
    if (!verifyData.success) {
      return res.status(403).json({ success: false, error: 'Captcha validation failed.' })
    }
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
