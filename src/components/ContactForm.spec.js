import { render, screen, fireEvent } from '@testing-library/vue'
import { vi } from 'vitest'
import ContactForm from './ContactForm.vue'

describe('ContactForm', () => {
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
    const fetchMock = vi.fn(() => Promise.resolve({
      json: async () => ({ success: true }),
    }))
    vi.stubGlobal('fetch', fetchMock)

    render(ContactForm)

    await fireEvent.update(screen.getByLabelText(/Nombre completo/i), 'Grettel')
    await fireEvent.update(screen.getByLabelText(/Correo electrónico/i), 'test@example.com')
    await fireEvent.update(screen.getByLabelText(/Servicio deseado/i), 'Boudoir & Artístico')
    await fireEvent.update(screen.getByPlaceholderText(/Mensaje/i), 'Hola, quiero reservar una sesión.')

    await fireEvent.click(screen.getByRole('button', { name: /Enviar Mensaje/i }))

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }))
    expect(await screen.findByText(/¡Mensaje enviado con éxito!/i)).toBeInTheDocument()
  })
})
