<template>
  <div class="min-h-screen pt-2">
    <!-- Page Header (Hero style) -->
    <section class="relative overflow-hidden bg-fixed bg-center bg-cover" style="min-height: 500px; display:flex; align-items:flex-end; background-image: url('/multimedia/artistico1.jpg');">
      <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/95 via-[#0d0d0d]/60 to-black/30"></div>
      <div class="relative z-10 page-container pb-10 pt-24 text-left w-full">
        <span class="section-label" style="text-align:left;">Portafolio profesional</span>
        <div class="w-fit">
          <h1 class="font-black text-white leading-tight" style="font-size: clamp(2rem, 5vw, 4rem);">
            Galería de Sesiones
          </h1>
          <div class="h-[3px] bg-[#bc9536] my-4 transition-all duration-[150ms] ease-out" :style="{ width: `clamp(3rem, 3rem + ${scrollY * 0.6}px, 100%)` }"></div>
        </div>
        <p class="text-white/60 italic text-sm max-w-md">
          Fotografía profesional en Ciudad de México. Explora nuestras sesiones por categoría.
        </p>
      </div>
    </section>

    <!-- Filter Buttons — sticky, con padding generoso -->
    <div class="sticky top-[64px] md:top-[80px] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2a2a2a] z-30">
      <div class="page-container py-4 sm:py-5 flex flex-wrap gap-2 sm:gap-3 justify-center">
        <button
          @click="selectCat(null)"
          class="filter-btn"
          :class="{ 'filter-btn-active': !activeCat }"
        >Todas</button>
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="selectCat(cat.key)"
          class="filter-btn"
          :class="{ 'filter-btn-active': activeCat === cat.key }"
        >{{ cat.label }}</button>
      </div>
    </div>

    <!-- Gallery Grid — con padding y margen inferior para separar del footer -->
    <main class="page-container py-10 sm:py-12 pb-20">
      <div v-if="displayImages.length" class="full-gallery grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        <div
          v-for="(img, i) in displayImages"
          :key="img.jpg || i"
          class="overflow-hidden cursor-pointer group aspect-square"
          @click="openLb(i)"
        >
          <img
            :src="img.jpg || img.webp"
            :alt="img.alt"
            loading="lazy"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
          />
        </div>
      </div>
      <p v-else class="text-center text-[#9ca3af] py-24 text-sm">Cargando imágenes…</p>
    </main>

    <!-- Lightbox -->
    <LightboxModal
      v-model="lbOpen"
      :image="displayImages[lbIndex]"
      @prev="lbIndex = (lbIndex - 1 + displayImages.length) % displayImages.length"
      @next="lbIndex = (lbIndex + 1) % displayImages.length"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

import LightboxModal from '../components/LightboxModal.vue'
import { useGallery } from '../composables/useGallery.js'

const { load, getAll, getCategory, categories } = useGallery()
const activeCat = ref(null)
const lbOpen  = ref(false)
const lbIndex = ref(0)

const displayImages = computed(() =>
  activeCat.value ? getCategory(activeCat.value) : getAll()
)

const selectCat = (key) => { activeCat.value = key }
const openLb = (i) => { lbIndex.value = i; lbOpen.value = true }

onMounted(load)
</script>

<style scoped>
.filter-btn {
  padding: 0.45rem 1.1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  border: 1px solid #2a2a2a;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.filter-btn:hover { border-color: #bc9536; color: #f4f4f9; }
.filter-btn-active { border-color: #bc9536; color: #bc9536; background: rgba(188,149,54,0.08); }
.full-gallery{padding-block:5rem;}
</style>
