/**
 * useCookieConsent — Maneja el consentimiento de cookies del usuario.
 * Guarda la elección en una cookie para recordar la preferencia.
 */
import { ref, readonly, computed } from 'vue'

const COOKIE_NAME = 'hevca_cookie_consent'
const COOKIE_MAX_AGE_DAYS = 365
const consent = ref(null)

const hasConsent = computed(() => consent.value === 'accepted')
const hasDecision = computed(() => consent.value === 'accepted' || consent.value === 'declined')

const getCookie = (name) => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

const setCookie = (name, value, days) => {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`
}

const loadConsent = () => {
  if (typeof document === 'undefined') return
  const existing = getCookie(COOKIE_NAME)
  if (existing === 'accepted' || existing === 'declined') {
    consent.value = existing
  }
}

const saveConsent = (value) => {
  if (value !== 'accepted' && value !== 'declined') return
  consent.value = value
  setCookie(COOKIE_NAME, value, COOKIE_MAX_AGE_DAYS)
}

export function useCookieConsent() {
  return {
    consent: readonly(consent),
    hasConsent,
    hasDecision,
    loadConsent,
    acceptCookies: () => saveConsent('accepted'),
    declineCookies: () => saveConsent('declined'),
  }
}
