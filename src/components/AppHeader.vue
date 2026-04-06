<template>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
    :class="scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'"
  >
    <div class="page-container h-16 md:h-20 flex items-center justify-between gap-4">

      <!-- Logo -->
      <RouterLink to="/" class="shrink-0" aria-label="Inicio">
        <img src="/multimedia/logo_hevca1.png" alt="HEVCA Photo & Art" class="h-9 md:h-12 w-auto object-contain" />
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-6 xl:gap-8">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-[0.72rem] font-semibold tracking-widest uppercase text-[#f4f4f9]/75 hover:text-[#bc9536] transition-colors duration-200 relative group"
          :class="{ 'text-[#bc9536]': isActive(link.to) }"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-1 left-0 h-[2px] bg-[#bc9536] transition-all duration-300"
            :class="isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'"
          ></span>
        </RouterLink>
        <RouterLink to="/contacto" class="btn-gold ml-2 text-[0.72rem] tracking-widest">AGENDA TU SESIÓN</RouterLink>
      </nav>

      <!-- Mobile Hamburger -->
      <button
        @click="menuOpen = !menuOpen"
        class="lg:hidden flex flex-col gap-[5px] p-2"
        aria-label="Abrir menú"
        :aria-expanded="menuOpen"
      >
        <span
          class="block w-5 h-[2px] bg-[#f4f4f9] transition-all duration-300 origin-center"
          :class="menuOpen ? 'rotate-45 translate-y-[7px]' : ''"
        ></span>
        <span
          class="block w-5 h-[2px] bg-[#f4f4f9] transition-all duration-300"
          :class="menuOpen ? 'opacity-0 scale-x-0' : ''"
        ></span>
        <span
          class="block w-5 h-[2px] bg-[#f4f4f9] transition-all duration-300 origin-center"
          :class="menuOpen ? '-rotate-45 -translate-y-[7px]' : ''"
        ></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div
        v-if="menuOpen"
        class="lg:hidden bg-[#0d0d0d]/97 backdrop-blur-md border-t border-[#2a2a2a]"
      >
        <nav class="page-container py-6 flex flex-col gap-4 text-center items-center">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="menuOpen = false"
            class="text-[0.8rem] font-bold tracking-[0.15em] uppercase py-2 relative group transition-colors duration-300"
            :class="isActive(link.to) ? 'text-[#bc9536]' : 'text-[#f4f4f9]/80 hover:text-[#bc9536]'"
          >
            {{ link.label }}
            <!-- Línea animada inferior idéntica a desktop -->
            <span
              class="absolute bottom-0 left-0 h-[2px] bg-[#bc9536] transition-all duration-300"
              :class="isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'"
            ></span>
          </RouterLink>
          <div class="pt-4">
            <RouterLink
              to="/contacto"
              @click="menuOpen = false"
              class="btn-gold block text-center text-[0.72rem] tracking-widest w-full"
            >
              AGENDA TU SESIÓN
            </RouterLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>

  <!-- Spacer for fixed header -->
  <div class="h-16 md:h-20"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { to: '/',          label: 'INICIO' },
  { to: '/servicios', label: 'SERVICIOS' },
  { to: '/galeria',   label: 'GALERÍA' },
  { to: '/sobre-mi',  label: 'SOBRE MÍ' },
  { to: '/contacto',  label: 'CONTACTO' },
]

const isActive = (path) => route.path === path

const handleScroll = () => {
  scrolled.value = window.scrollY > 30
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.28s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
