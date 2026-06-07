import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from './contact.js'
import { createHmacToken } from './_security.js'

const jsonHeaders = {
  'content-type': 'application/json',
  'content-length': '123',
  origin: 'http://localhost:5173',
}

const createResponse = () => {
  const res = {}
  res.status = vi.fn(() => res)
  res.setHeader = vi.fn()
  res.json = vi.fn(() => {})
  return res
}

describe('api/contact handler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.WEB3FORMS_KEY
    delete process.env.HMAC_SECRET_KEY
    delete process.env.ALLOWED_ORIGINS
  })

  it('returns 405 for non-POST methods', async () => {
    const req = { method: 'GET' }
    const res = createResponse()

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Method not allowed' })
  })

  it('returns 415 when content type is not JSON', async () => {
    const req = {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      json: async () => ({})
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(415)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Content type must be application/json.' })
  })

  it('returns 403 for disallowed origin', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:5173'
    const req = {
      method: 'POST',
      headers: { ...jsonHeaders, origin: 'https://evil.com' },
      json: async () => ({ name: 'Grettel', email: 'test@example.com', service: 'Boudoir & Artístico', message: 'Hola', botcheck: false }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Origin not allowed.' })
  })

  it('returns validation errors for missing required fields', async () => {
    const req = {
      method: 'POST',
      headers: jsonHeaders,
      json: async () => ({ name: '', email: '', service: '', message: '', botcheck: false }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: {
        name: 'Por favor escribe tu nombre.',
        email: 'Introduce un correo válido.',
        service: 'Selecciona una sesión.',
      },
    })
  })

  it('returns 500 when WEB3FORMS_KEY is missing', async () => {
    const req = {
      method: 'POST',
      headers: jsonHeaders,
      json: async () => ({
        name: 'Grettel',
        email: 'test@example.com',
        service: 'Boudoir & Artístico',
        message: 'Hola',
        botcheck: false,
      }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Server is not configured properly.',
    })
  })

  it('returns 401 when HMAC is required and missing', async () => {
    process.env.WEB3FORMS_KEY = 'test-key'
    process.env.HMAC_SECRET_KEY = 'hmac-secret'
    const fetchMock = vi.fn(() => Promise.resolve({ json: async () => ({ success: true }) }))
    vi.stubGlobal('fetch', fetchMock)

    const req = {
      method: 'POST',
      headers: jsonHeaders,
      json: async () => ({
        name: 'Grettel',
        email: 'test@example.com',
        service: 'Boudoir & Artístico',
        message: 'Hola',
        botcheck: false,
      }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing token.',
    })
  })

  it('forwards the request to Web3Forms when HMAC token is valid', async () => {
    process.env.WEB3FORMS_KEY = 'test-key'
    process.env.HMAC_SECRET_KEY = 'hmac-secret'
    const validToken = createHmacToken(process.env.HMAC_SECRET_KEY, {
      type: 'contact-token',
      iat: Date.now(),
      origin: 'http://localhost:5173',
    })
    const fetchMock = vi.fn(() => Promise.resolve({ json: async () => ({ success: true }) }))
    vi.stubGlobal('fetch', fetchMock)

    const req = {
      method: 'POST',
      headers: { ...jsonHeaders, 'x-forwarded-for': '5.5.5.5' },
      json: async () => ({
        name: 'Grettel',
        email: 'test@example.com',
        service: 'Boudoir & Artístico',
        message: 'Hola',
        botcheck: false,
        hmacToken: validToken,
      }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(fetchMock).toHaveBeenCalledWith('https://api.web3forms.com/submit', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })
  })

  it('enforces basic rate limiting', async () => {
    process.env.WEB3FORMS_KEY = 'test-key'
    const fetchMock = vi.fn(() => Promise.resolve({ json: async () => ({ success: true }) }))
    vi.stubGlobal('fetch', fetchMock)

    const req = {
      method: 'POST',
      headers: { ...jsonHeaders, 'x-forwarded-for': '10.0.0.1' },
      json: async () => ({
        name: 'Grettel',
        email: 'test@example.com',
        service: 'Boudoir & Artístico',
        message: 'Hola',
        botcheck: false,
      }),
    }
    const res = createResponse()

    for (let i = 0; i < 9; i += 1) {
      await handler(req, res)
    }

    expect(res.status).toHaveBeenLastCalledWith(429)
    expect(res.json).toHaveBeenLastCalledWith({
      success: false,
      error: 'Too many requests. Please wait and try again.',
    })
  })

  it('forwards the request to Web3Forms when input is valid', async () => {
    process.env.WEB3FORMS_KEY = 'test-key'
    const fetchMock = vi.fn(() => Promise.resolve({ json: async () => ({ success: true }) }))
    vi.stubGlobal('fetch', fetchMock)

    const req = {
      method: 'POST',
      headers: { ...jsonHeaders, 'x-forwarded-for': '5.5.5.5' },
      json: async () => ({
        name: 'Grettel',
        email: 'test@example.com',
        service: 'Boudoir & Artístico',
        message: 'Hola',
        botcheck: false,
      }),
    }
    const res = createResponse()

    await handler(req, res)

    expect(fetchMock).toHaveBeenCalledWith('https://api.web3forms.com/submit', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true })
  })
})
