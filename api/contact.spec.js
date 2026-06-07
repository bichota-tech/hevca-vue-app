import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from './contact.js'

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
  })

  it('returns 405 for non-POST methods', async () => {
    const req = { method: 'GET' }
    const res = createResponse()

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'POST')
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Method not allowed' })
  })

  it('returns validation errors for missing required fields', async () => {
    const req = {
      method: 'POST',
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

  it('forwards the request to Web3Forms when input is valid', async () => {
    process.env.WEB3FORMS_KEY = 'test-key'
    const fetchMock = vi.fn(() => Promise.resolve({ json: async () => ({ success: true }) }))
    vi.stubGlobal('fetch', fetchMock)

    const req = {
      method: 'POST',
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
