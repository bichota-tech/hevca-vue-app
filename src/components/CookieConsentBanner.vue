<template>
  <div
    v-if="showBanner"
    class="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-3xl border border-gold/50 bg-black/95 p-5 shadow-2xl backdrop-blur-md sm:right-6"
  >
    <div class="flex flex-col gap-4 text-sm text-white">
      <div class="space-y-2">
        <p class="max-w-3xl leading-6">
          Este sitio usa cookies necesarias para el funcionamiento básico y para mejorar la experiencia.
          Selecciona <span class="font-semibold text-gold">Aceptar</span> o <span class="font-semibold text-gold">Rechazar</span> para continuar.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          @click="acceptCookies"
          class="inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-dark transition hover:opacity-95"
        >
          Aceptar
        </button>

        <button
          type="button"
          @click="declineCookies"
          class="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Rechazar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCookieConsent } from '../composables/useCookieConsent.js'

const { hasDecision, acceptCookies, declineCookies } = useCookieConsent()
const showBanner = computed(() => !hasDecision.value)
</script>
