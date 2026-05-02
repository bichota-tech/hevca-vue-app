export default {
  name: 'gallery',
  title: 'Gestor de Galería',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Seleccionar Categoría',
      description: 'Elige a qué categoría pertenecen estas imágenes.',
      type: 'string',
      options: {
        list: [
          { title: 'Corporativa & Comercial', value: 'corporativo-comercial' },
          { title: 'Artístico & Boudoir', value: 'artistico-boudoir' },
          { title: 'Eventos', value: 'eventos' },
          { title: 'Newborn & Familiar', value: 'newborn-familiar' },
          { title: 'Edición & Retoque', value: 'edicion-retoque' },
          { title: 'Marca Personal', value: 'marca-personal' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Añadir Imágenes',
      description: 'Puedes arrastrar y soltar varias imágenes a la vez aquí.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule: any) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: 'category',
      images: 'images',
    },
    prepare({ title, images }: any) {
      const count = images ? images.length : 0
      return {
        title: title || 'Sin categoría',
        subtitle: `${count} ${count === 1 ? 'imagen' : 'imágenes'}`,
      }
    },
  },
}
