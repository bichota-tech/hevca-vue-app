import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanity = createClient({
    projectId: 'illa07bq',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-01-01'
})

const builder = imageUrlBuilder(sanity)

export function urlFor(source) {
    return builder.image(source)
}