import { render, screen, fireEvent } from '@testing-library/vue'
import { vi } from 'vitest'
import ContactForm from './ContactForm.vue'

describe('ContactForm', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, enabled: false }),
    })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders required labels with asterisk', () => {
    render(ContactForm)

    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Servicio deseado/i)).toBeInTheDocument()

    expect(screen.getByText(/Nombre completo/).textContent).toContain('*')
    expect(screen.getByText(/Correo electrónico/).textContent).toContain('*')
    expect(screen.getByText(/Servicio deseado/).textContent).toContain('*')
  })

  it('shows validation errors when required fields are missing', async () => {
    render(ContactForm)

    await fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }))

    expect(screen.getByText(/Por favor escribe tu nombre/i)).toBeInTheDocument()
    expect(screen.getByText(/Introduce un correo válido/i)).toBeInTheDocument()
    expect(screen.getByText(/Selecciona una sesión/i)).toBeInTheDocument()
  })

  it('submits the form when input is valid', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => ({ success: true, enabled: false }) })
      .mockResolvedValueOnce({ json: async () => ({ success: true }) })

    render(ContactForm)

    await fireEvent.update(screen.getByLabelText(/Nombre completo/i), 'Grettel')
    await fireEvent.update(screen.getByLabelText(/Correo electrónico/i), 'test@example.com')
    await fireEvent.update(screen.getByLabelText(/Servicio deseado/i), 'Boudoir & Artístico')
    await fireEvent.update(screen.getByPlaceholderText(/Mensaje/i), 'Hola, quiero reservar una sesión.')

    await fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }))

    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/contact', expect.objectContaining({ method: 'POST' }))
    expect(await screen.findByText(/¡Mensaje enviado con éxito!/i)).toBeInTheDocument()
  })
})
