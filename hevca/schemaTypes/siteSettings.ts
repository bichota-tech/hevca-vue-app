export default {
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Sitio (SEO)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descripción del Sitio (SEO)',
      type: 'text',
    },
    {
      name: 'aboutImage',
      title: 'Foto Principal "Sobre Mí"',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'aboutText',
      title: 'Texto Biográfico',
      type: 'text',
    },
    {
      name: 'contactInfo',
      title: 'Información de Contacto',
      type: 'object',
      fields: [
        { name: 'phone', title: 'WhatsApp / Teléfono', type: 'string' },
        { name: 'email', title: 'Email de contacto', type: 'string' },
        { name: 'instagram', title: 'URL de Instagram', type: 'url' },
        { name: 'address', title: 'Ubicación / Dirección', type: 'string' },
      ]
    },
    {
      name: 'headers',
      title: 'Imágenes de Cabecera (Fondos)',
      type: 'object',
      fields: [
        { name: 'gallery', title: 'Cabecera Galería', type: 'image' },
        { name: 'services', title: 'Cabecera Servicios', type: 'image' },
        { name: 'contact', title: 'Cabecera Contacto', type: 'image' },
        { name: 'about', title: 'Cabecera Sobre Mí', type: 'image' },
      ]
    }
  ],
}
