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
          'corporativo-comercial',
          'artistico-boudoir',
          'eventos',
          'newborn-familiar',
          'edicion-retoque',
          'marca-personal',
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