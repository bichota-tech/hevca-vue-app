export const heroSlidesQuery = `
  *[_type == "heroSlide"] | order(order asc) {
    _id,
    title,
    subtitle,
    "img": image.asset->url
  }
`

export const testimonialsQuery = `
  *[_type == "testimonial"] {
    _id,
    name,
    role,
    quote,
    "img": image.asset->url
  }
`

export const servicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    tag,
    "desc": description,
    "img": image.asset->url,
    includes
  }
`


