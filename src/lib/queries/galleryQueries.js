export const galleryImagesQuery = `
  *[_type == "galleryImage"] | order(_createdAt desc) {
    _id,
    title,
    category,
    "url": image.asset->url,
    image
  }
`          