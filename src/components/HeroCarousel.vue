<template>
  <div class="relative w-full overflow-hidden" style="height: clamp(520px, 88vh, 900px);">

    <!-- Slides -->
    <TransitionGroup name="slide-fade" tag="div" class="relative h-full">
      <div
        v-for="(slide, i) in slides"
        :key="i"
        v-show="current === i"
        class="absolute inset-0"
      >
        <img
          :src="slide.img"
          :alt="slide.alt"
          class="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75"></div>

        <!-- Caption -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-8 gap-4 sm:gap-6">
          <p class="text-[#bc9536] text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase font-semibold animate-fade-in">
            Fotografía Profesional · México
          </p>
          <h1
            class="font-black text-white leading-tight animate-fade-in"
            style="font-size: clamp(1.9rem, 6vw, 5.5rem); animation-delay:0.1s; max-width: 900px;"
          >
            {{ slide.title }}
          </h1>
          <p
            class="text-white/70 italic animate-fade-in max-w-md sm:max-w-xl"
            style="font-size: clamp(0.9rem, 2vw, 1.2rem); animation-delay:0.2s;"
          >
            {{ slide.sub }}
          </p>
          <RouterLink
            to="/contacto"
            class="btn-gold animate-fade-in mt-1"
            style="animation-delay:0.3s; font-size: 0.75rem;"
          >
            SOLICITA PRESUPUESTO
          </RouterLink>
        </div>
      </div>
    </TransitionGroup>

    <!-- Nav arrows — hidden on tiny screens -->
    <button @click="prev" class="carousel-btn left-3 sm:left-5 hidden sm:flex" aria-label="Anterior">&#10094;</button>
    <button @click="next" class="carousel-btn right-3 sm:right-5 hidden sm:flex" aria-label="Siguiente">&#10095;</button>

    <!-- Dots -->
    <div class="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(_, i) in slides"
        :key="i"
        @click="current = i"
        class="h-[3px] rounded-full transition-all duration-400"
        :class="current === i ? 'bg-[#bc9536] w-8' : 'bg-white/35 w-4'"
        :aria-label="`Slide ${i+1}`"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { img: '/multimedia/artistico1.jpg',  alt: 'Sesión Artística', title: 'Mirada Experta, Fotos con Alma.',           sub: 'Cada imagen cuenta una historia que permanece para siempre.' },
  { img: '/multimedia/comercial2.jpg',  alt: 'Sesión Comercial', title: 'Tu Marca, Nuestra Visión.',                 sub: 'La diferencia está en cómo inmortalizas tu momento.' },
  { img: '/multimedia/newborn2.jpg',    alt: 'Sesión Newborn',   title: 'De lo Cotidiano a lo Inolvidable.',         sub: 'A través del lente, capturamos lo que las palabras no pueden.' },
]

const current = ref(0)
let timer = null

const next = () => { current.value = (current.value + 1) % slides.length }
const prev = () => { current.value = (current.value - 1 + slides.length) % slides.length }
const startTimer = () => { timer = setInterval(next, 4500) }
const clearTimer = () => clearInterval(timer)

onMounted(startTimer)
onUnmounted(clearTimer)
</script>

<style scoped>
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  width: 42px;
  height: 42px;
  font-size: 1.1rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
  border-radius: 50%;
}
.carousel-btn:hover { background: rgba(188,149,54,0.7); border-color: transparent; }

.slide-fade-enter-active, .slide-fade-leave-active { transition: opacity 0.9s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; }

@keyframes fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.65s ease forwards; opacity: 0; }
</style>
