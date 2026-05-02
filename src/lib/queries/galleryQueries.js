export const galleryImagesQuery = `
  *[_type == "gallery"][0]{
    "items": [
      ...coalesce(corporativoComercial[] { "category": "corporativo-comercial", "url": asset->url, "_id": _key }, []),
      ...coalesce(artisticoBoudoir[] { "category": "artistico-boudoir", "url": asset->url, "_id": _key }, []),
      ...coalesce(eventos[] { "category": "eventos", "url": asset->url, "_id": _key }, []),
      ...coalesce(newbornFamiliar[] { "category": "newborn-familiar", "url": asset->url, "_id": _key }, []),
      ...coalesce(edicionRetoque[] { "category": "edicion-retoque", "url": asset->url, "_id": _key }, []),
      ...coalesce(marcaPersonal[] { "category": "marca-personal", "url": asset->url, "_id": _key }, [])
    ]
  }.items
`