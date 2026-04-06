import { ref, readonly } from 'vue'

const images = ref({})
const loaded = ref(false)
const error  = ref(null)

export function useGallery() {
  const load = async () => {
    if (loaded.value) return
    try {
      const res = await fetch('/imagenes.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      images.value = await res.json()
      loaded.value = true
    } catch (e) {
      error.value = e.message
    }
  }

  const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5)

  const getAll = () => Object.values(images.value).flat()

  const getCategory = (cat) => images.value[cat] || []

  const getFeatured = (n = 4) => shuffle(getAll()).slice(0, n)

  const categories = [
    { key: 'corporativo',  label: 'Sesión Corporativa' },
    { key: 'comercial',    label: 'Sesión Comercial' },
    { key: 'boudoirArt',   label: 'Boudoir & Artístico' },
    { key: 'evento',       label: 'Sesión de Eventos' },
    { key: 'familiar',     label: 'Sesión Familiar' },
    { key: 'infantil',     label: 'Sesión Infantil' },
    { key: 'newborn',      label: 'Sesión Newborn' },
  ]

  return { load, getAll, getCategory, getFeatured, categories, images: readonly(images), error: readonly(error) }
}
