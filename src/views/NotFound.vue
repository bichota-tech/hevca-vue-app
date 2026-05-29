<template>
  <div class="w-full h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-[#f4f4f9] overflow-hidden relative">
    
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="absolute bg-white rounded-full animate-twinkle"
        :style="{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.baseOpacity,
          animationDelay: `${star.delay}s`,
          animationDuration: `${star.duration}s`
        }"
      ></div>
    </div>

    <img
      ref="cameraRef"
      src="/multimedia/Frame1.png" 
      alt="Cámara perdida"
      @load="onImageLoad"
      class="fixed top-0 left-0 w-48 md:w-64 opacity-50 pointer-events-none z-10 object-contain will-change-transform"
      :class="{ 'invisible': !isReady }" 
    />

    <div class="relative z-20 flex flex-col items-center text-center px-4">
      <h1 class="text-6xl md:text-8xl font-bold font-['Montserrat'] text-[#bc9536] mb-4">404</h1>
      <h2 class="text-2xl md:text-3xl font-semibold mb-8">Página no encontrada</h2>
      <p class="text-gray-400 mb-8 max-w-md">
        Parece que te has salido del encuadre. La página que buscas no existe o se ha perdido en el espacio.
      </p>
      <router-link 
        to="/" 
        class="mt-6! px-6! py-3! border border-[#bc9536] text-[#bc9536] hover:bg-[#bc9536] hover:text-white transition-colors duration-300"
      >
        Volver al inicio
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// ─── GENERACIÓN DE ESTRELLAS ───────────────────────────────────────────
// Creamos 60 estrellas con posiciones, tamaños y tiempos de parpadeo aleatorios
const stars = Array.from({ length: 60 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100, // Porcentaje X
  y: Math.random() * 100, // Porcentaje Y
  size: Math.random() * 2.5 + 0.5, // Tamaño entre 0.5px y 3px
  baseOpacity: Math.random() * 0.5 + 0.2, 
  delay: Math.random() * 5, // Desfase inicial
  duration: Math.random() * 3 + 2 // Duración del parpadeo entre 2s y 5s
}))

// ─── MOTOR DE GRAVEDAD DE LA CÁMARA ────────────────────────────────────
const cameraRef = ref(null)
const isReady = ref(false) // Controla si la imagen ya se descargó

let x = 0
let y = 0
let vx = 3.5 
let vy = 2.5 
let rotation = 0
let camWidth = 0
let camHeight = 0
let winWidth = 0
let winHeight = 0

function updateBounds() {
  if (!cameraRef.value) return
  camWidth = cameraRef.value.clientWidth
  camHeight = cameraRef.value.clientHeight
  winWidth = window.innerWidth
  winHeight = window.innerHeight

  // Si el usuario redimensiona la ventana y la cámara queda fuera, la metemos a la fuerza
  if (x + camWidth > winWidth) x = winWidth - camWidth
  if (y + camHeight > winHeight) y = winHeight - camHeight
}

// Esta función es la clave. Solo se ejecuta cuando la etiqueta <img> termina de descargar el .webp
function onImageLoad() {
  updateBounds()
  // Centramos la cámara perfectamente basándonos en su tamaño real
  x = (winWidth - camWidth) / 2
  y = (winHeight - camHeight) / 2
  isReady.value = true // Hacemos visible la cámara y activamos el ticker
}

function onTick() {
  // Si la imagen no ha cargado, o el ancho es 0, detenemos la física
  if (!isReady.value || !camWidth || !winWidth) return

  x += vx
  y += vy
  rotation += 0.2 
  
  let hitEdge = false

  // Colisión Eje X con límites estrictos
  if (x + camWidth >= winWidth) {
    x = winWidth - camWidth
    vx *= -1
    hitEdge = true
  } else if (x <= 0) {
    x = 0
    vx *= -1
    hitEdge = true
  }

  // Colisión Eje Y con límites estrictos
  if (y + camHeight >= winHeight) {
    y = winHeight - camHeight
    vy *= -1
    hitEdge = true
  } else if (y <= 0) {
    y = 0
    vy *= -1
    hitEdge = true
  }

  if (hitEdge) {
    gsap.to(cameraRef.value, { 
      rotation: rotation + (vx > 0 ? 120 : -120), 
      duration: 0.6, 
      ease: "back.out(1.5)",
      overwrite: "auto"
    })
  } else {
    gsap.set(cameraRef.value, { x, y, rotation })
  }
}

onMounted(() => {
  window.addEventListener('resize', updateBounds)
  gsap.ticker.add(onTick)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBounds)
  gsap.ticker.remove(onTick)
})
</script>

<style scoped>
/* Animación CSS súper ligera para las estrellas */
@keyframes twinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.animate-twinkle {
  animation-name: twinkle;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>