/**
 * useSiteSettings — Singleton composable para datos globales de Sanity.
 *
 * La petición se realiza UNA SOLA VEZ en toda la sesión del usuario,
 * independientemente de cuántas vistas importen este composable.
 * Elimina las 4–5 peticiones duplicadas a `siteSettingsQuery`.
 */
import { ref, readonly } from 'vue'
import { sanity } from '../lib/sanityClient'
import { siteSettingsQuery } from '../lib/queries/homeQueries'

// Estado module-level: se comparte entre todas las instancias
const settings = ref(null)
const loading  = ref(false)
const error    = ref(null)

// Promesa compartida: evita race conditions si varios componentes llaman load() a la vez
let _promise = null

export function useSiteSettings() {
  const load = () => {
    // Si ya hay datos, devuelve inmediatamente
    if (settings.value) return Promise.resolve(settings.value)

    // Si ya hay una petición en vuelo, reutilízala
    if (_promise) return _promise

    loading.value = true
    _promise = sanity
      .fetch(siteSettingsQuery)
      .then(data => {
        if (data) settings.value = data
        return data
      })
      .catch(err => {
        error.value = err.message
        console.error('[useSiteSettings] Error fetching site settings:', err)
        _promise = null // Permite reintentar si falló
      })
      .finally(() => {
        loading.value = false
      })

    return _promise
  }

  return {
    settings: readonly(settings),
    loading:  readonly(loading),
    error:    readonly(error),
    load,
  }
}
