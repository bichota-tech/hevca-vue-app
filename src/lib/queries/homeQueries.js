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

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    title,
    description,
    "aboutImage": aboutImage.asset->url,
    aboutText,
    contactInfo,
    "headerImages": {
      "gallery": headers.gallery.asset->url,
      "services": headers.services.asset->url,
      "contact": headers.contact.asset->url,
      "about": headers.about.asset->url
    }
  }
`



