export default {
  name: 'service',
  title: 'Servicios',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título del Servicio',
      type: 'string',
    },
    {
      name: 'tag',
      title: 'Etiqueta / Categoría',
      type: 'string',
      description: 'Ej: Para empresas y profesionales',
    },
    {
      name: 'description',
      title: 'Descripción Corta',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Imagen del Servicio',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'includes',
      title: '¿Qué incluye?',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
    },

  ],
}
