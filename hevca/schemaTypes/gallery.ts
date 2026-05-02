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
      name: 'corporativoComercial',
      title: 'Corporativa & Comercial',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'artisticoBoudoir',
      title: 'Artístico & Boudoir',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'eventos',
      title: 'Eventos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'newbornFamiliar',
      title: 'Newborn & Familiar',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'edicionRetoque',
      title: 'Edición & Retoque',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'marcaPersonal',
      title: 'Marca Personal',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
}
