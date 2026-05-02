export default {
  name: 'gallery',
  title: 'Gestor de Galería',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título Interno',
      type: 'string',
      initialValue: 'Configuración de Galería',
      readOnly: true,
    },
    {
      name: 'sections',
      title: 'Secciones de la Galería',
      description: 'Añade una sección por cada categoría de fotos que quieras mostrar.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'gallerySection',
          title: 'Sección de Galería',
          fields: [
            {
              name: 'category',
              title: 'Categoría / Título',
              description: 'Selecciona una de las categorías oficiales para que aparezca en los filtros de la web.',
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
              title: 'Imágenes de esta categoría',
              description: 'Sube o selecciona todas las fotos pertenecientes a esta sección.',
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
                title: title || 'Sin título',
                subtitle: `${count} ${count === 1 ? 'imagen' : 'imágenes'}`,
              }
            },
          },
        },
      ],
    },
  ],
}
