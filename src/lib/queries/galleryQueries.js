export const galleryImagesQuery = `
  *[_type == "gallery"] {
    "items": images[] {
      "category": ^.category,
      "url": asset->url,
      "_id": _key
    }
  }.items[]
`