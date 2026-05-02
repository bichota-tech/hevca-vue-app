export default {
  name: 'galleryImage',
  title: 'Imagen de Galería',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'category',
      type: 'string',
      options: {
        list: [
          'corporativo',
          'comercial',
          'boudoirArt',
          'evento',
          'familiar',
          'infantil',
          'newborn',
        ],
      },
    },
    {
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}