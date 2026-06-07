import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from './contact-token.js'
import { rateLimitMap } from './_security.js'

const jsonHeaders = {
  origin: 'http://localhost:5173', 
}

const createResponse = () => {
  const res = {}
  res.status = vi.fn(() => res)
  res.setHeader = vi.fn()
  res.json = vi.fn(() => {})
  return res
}

describe('api/contact-token handler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    rateLimitMap.clear()
    delete process.env.HMAC_SECRET_KEY
    delete process.env.ALLOWED_ORIGINS
  })

  it('returns 405 for non-GET methods', async () => {
    const req = { method: 'POST' }
    const res = createResponse()

    await handler(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET')
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Method not allowed' })
  })

  it('returns enabled false when HMAC secret is not set', async () => {
    const req = { method: 'GET', headers: jsonHeaders }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ success: true, enabled: false, token: null })
  })

  it('returns 403 for disallowed origin', async () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:5173'
    const req = { method: 'GET', headers: { origin: 'https://evil.com' } }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Origin not allowed.' })
  })

  it('returns a signed token when HMAC secret is set', async () => {
    process.env.HMAC_SECRET_KEY = 'hmac-secret'
    const req = { method: 'GET', headers: jsonHeaders }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, enabled: true }))
    const token = res.json.mock.calls[0][0].token
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })
})
