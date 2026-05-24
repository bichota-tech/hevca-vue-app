import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'


export const sanity = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    useCdn: true,
    apiVersion: '2024-01-01'
})

const builder = createImageUrlBuilder(sanity);


export function urlFor(source) {
    return builder.image(source)
}
