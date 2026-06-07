export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { name, email, service, message, botcheck } = await req.json()
  const errors = {}

  if (botcheck) {
    return res.status(400).json({ success: false, error: 'Bot detected' })
  }

  if (!name || !name.trim()) {
    errors.name = 'Por favor escribe tu nombre.'
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Introduce un correo válido.'
  }

  if (!service) {
    errors.service = 'Selecciona una sesión.'
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
        name,
        email,
        service,
        message,
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
