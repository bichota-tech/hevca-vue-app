export const galleryImagesQuery = `
  *[_type == "gallery"] {
    "items": images[] {
      "category": ^.category,
      "url":      asset->url + "?w=900&auto=format&q=82",
      "urlThumb": asset->url + "?w=420&auto=format&q=72",
      "_id": _key,
      "alt": coalesce(alt, "Fotografía HEVCA Photo & Art")
    }
  }.items[]
`