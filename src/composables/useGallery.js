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
    { key: 'corporativo-comercial', label: 'Corporativa & Comercial' },
    { key: 'artistico-boudoir', label: 'Artístico & Boudoir' },
    { key: 'eventos', label: 'Eventos' },
    { key: 'newborn-familiar', label: 'Newborn & Familiar' },
    { key: 'edicion-retoque', label: 'Edición & Retoque' },
    { key: 'marca-personal', label: 'Marca Personal' },
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