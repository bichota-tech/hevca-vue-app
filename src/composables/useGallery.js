import { ref, readonly } from 'vue'
import { sanity } from '../lib/sanityClient'
import { galleryImagesQuery } from '../lib/queries/galleryQueries'

const images = ref({})
const loaded = ref(false)
const error = ref(null)
const loading = ref(false)

export function useGallery() {
  const load = async () => {
    if (loaded.value) return

    loading.value = true

    try {
      const data = await sanity.fetch(galleryImagesQuery)

      const grouped = data.reduce((acc, item) => {
        if (!item.category) return acc

        if (!acc[item.category]) acc[item.category] = []

        acc[item.category].push(item)
        return acc
      }, {})

      images.value = grouped
      loaded.value = true

    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5)

  const getAll = () => Object.values(images.value).flat()

  const getCategory = (cat) => images.value[cat] || []

  const getFeatured = (n = 4) => shuffle(getAll()).slice(0, n)

  const categories = [
    { key: 'corporativo', label: 'Sesión Corporativa' },
    { key: 'comercial', label: 'Sesión Comercial' },
    { key: 'boudoirArt', label: 'Boudoir & Artístico' },
    { key: 'evento', label: 'Sesión de Eventos' },
    { key: 'familiar', label: 'Sesión Familiar' },
    { key: 'infantil', label: 'Sesión Infantil' },
    { key: 'newborn', label: 'Sesión Newborn' },
  ]

  return {
    load,
    getAll,
    getCategory,
    getFeatured,
    categories,
    images: readonly(images),
    error: readonly(error),
    loading: readonly(loading),
  }
}