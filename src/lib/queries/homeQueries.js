export const heroSlidesQuery = `
  *[_type == "heroSlide"] | order(order asc) {
    _id,
    title,
    subtitle,
    "img": image.asset->url + "?w=1920&auto=format&q=80"
  }
`

export const testimonialsQuery = `
  *[_type == "testimonial"] {
    _id,
    name,
    role,
    quote,
    "img": image.asset->url + "?w=200&auto=format&q=80"
  }
`

export const servicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    tag,
    "desc": description,
    "img": image.asset->url + "?w=800&auto=format&q=82",
    includes
  }
`

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    title,
    description,
    "aboutImage": aboutImage.asset->url + "?w=1200&auto=format&q=82",
    aboutText,
    contactInfo,
    "headerImages": {
      "gallery":  headers.gallery.asset->url  + "?w=1920&auto=format&q=78",
      "services": headers.services.asset->url + "?w=1920&auto=format&q=78",
      "contact":  headers.contact.asset->url  + "?w=1920&auto=format&q=78",
      "about":    headers.about.asset->url    + "?w=1920&auto=format&q=78"
    }
  }
`

