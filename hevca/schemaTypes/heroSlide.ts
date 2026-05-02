export default {
  name: 'heroSlide',
  title: 'Imagen de Carrusel',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'order',
      title: 'Orden',
      type: 'number',
    },
  ],
}
