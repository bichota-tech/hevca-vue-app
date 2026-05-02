export const galleryImagesQuery = `
  *[_type == "gallery"][0].sections[] {
    "items": images[] {
      "category": ^.category,
      "url": asset->url,
      "_id": _key
    }
  }.items[]
`