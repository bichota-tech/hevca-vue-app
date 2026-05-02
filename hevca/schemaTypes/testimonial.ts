export default {
  name: 'testimonial',
  title: 'Testimonios',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre del Cliente',
      type: 'string',
    },
    {
      name: 'role',
      title: 'Puesto / Rol',
      type: 'string',
    },
    {
      name: 'quote',
      title: 'Testimonio',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Foto del Cliente',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}
