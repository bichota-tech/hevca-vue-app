<template>
  <Transition name="scene-fade" @after-leave="onSceneHidden">
    <div
      v-if="visible"
      class="scroll-scene"
      @wheel.prevent="handleWheel"
      @touchstart.passive="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
    >
      <!-- Canvas encuadrado (no full-bleed) -->
      <div class="canvas-frame">
        <canvas ref="canvasRef" class="frame-canvas" />
        <div class="canvas-vignette" />
      </div>

      <!-- Labels de servicios -->
      <div class="service-labels">
        <Transition name="label-fade" mode="out-in">
          <div v-if="activeLabel" :key="activeLabel" class="service-label">
            <span class="label-eyebrow">Servicios</span>
            <h2 class="label-title">{{ activeLabel }}</h2>
            <div class="label-line" />
          </div>
        </Transition>
      </div>

      <!-- Indicador de scroll -->
      <div class="scroll-hint" :class="{ 'is-hidden': progress > 0.04 }">
        <span class="hint-text">Scroll</span>
        <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
          <path d="M9 1v16M9 17l-5-5M9 17l5-5" stroke="#bc9536" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Barra de progreso -->
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${progress * 100}%` }" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Flag de módulo: persiste entre navegaciones Vue Router pero
// se resetea en cada recarga completa de la página.
let _introShown = false

// ── Constantes ─────────────────────────────────────────────────
const TOTAL_FRAMES = 21
const BASE_PATH    = '/Canon_SL2_webP/'
const SCROLL_RANGE = 2400  // deltaY total para recorrer todos los frames

const SEGMENTS = [
  { from: 4,  to: 8,  label: 'Retrato Corporativo'   },
  { from: 8,  to: 12, label: 'Fotografía Comercial'  },
  { from: 12, to: 16, label: 'Boudoir & Artístico'   },
  { from: 16, to: 21, label: 'Eventos & Especiales'  },
]

// ── Estado reactivo ────────────────────────────────────────────
const canvasRef = ref(null)
// Si el intro ya se mostró en esta sesión JS, arranca oculto
const visible   = ref(!_introShown)
const progress  = ref(0)

// ── Estado interno (no reactivo) ──────────────────────────────
let frames       = []
let ctx          = null
let loaded       = false
let lastDrawnIdx = -1
let accumulated  = 0
let touchStartY  = 0
let leaving      = false

// ── Label activo ──────────────────────────────────────────────
const activeLabel = computed(() => {
  const f = Math.floor(progress.value * TOTAL_FRAMES) + 1
  for (const seg of SEGMENTS) {
    if (f >= seg.from && f < seg.to) return seg.label
  }
  return null
})

// ── Dibujo con object-fit: cover simulado ─────────────────────
function drawFrame(index) {
  if (!ctx || !canvasRef.value) return
  const img = frames[index]
  if (!img?.naturalWidth) return

  // Usar dimensiones LÓGICAS del contenedor (no las del canvas × DPR)
  const frame = canvasRef.value.parentElement
  const cw = frame ? frame.clientWidth  : canvasRef.value.width
  const ch = frame ? frame.clientHeight : canvasRef.value.height
  if (!cw || !ch) return

  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const sw = cw / scale
  const sh = ch / scale
  const sx = (img.naturalWidth  - sw) / 2
  const sy = (img.naturalHeight - sh) / 2
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
}

// ── Precarga ──────────────────────────────────────────────────
async function preloadFrames() {
  frames = await Promise.all(
    Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      new Promise(resolve => {
        const img = new Image()
        img.src = `${BASE_PATH}Frame${i + 1}.webp`
        img.onload  = () => resolve(img)
        img.onerror = () => resolve(img)
      })
    )
  )
}

// ── Aplicar delta de scroll ───────────────────────────────────
function applyDelta(delta) {
  if (leaving) return
  accumulated    = Math.max(0, Math.min(SCROLL_RANGE, accumulated + delta))
  progress.value = accumulated / SCROLL_RANGE
  const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress.value * TOTAL_FRAMES))
  if (idx !== lastDrawnIdx) {
    drawFrame(idx)
    lastDrawnIdx = idx
  }
  if (progress.value >= 1) {
    leaving = true
    visible.value = false
  }
}

// ── Handlers de eventos ───────────────────────────────────────
function handleWheel(e)       { applyDelta(e.deltaY) }
function handleTouchStart(e)  { touchStartY = e.touches[0].clientY }
function handleTouchMove(e)   {
  const delta = touchStartY - e.touches[0].clientY
  touchStartY  = e.touches[0].clientY
  applyDelta(delta * 2)
}

// ── Resize canvas con soporte HiDPI/Retina ────────────────────
function resizeCanvas() {
  if (!canvasRef.value) return
  // Leer dimensiones del CONTENEDOR, no del canvas (más fiable)
  const frame = canvasRef.value.parentElement
  if (!frame) return
  const w = frame.clientWidth
  const h = frame.clientHeight
  if (!w || !h) return

  // HiDPI: multiplicar por devicePixelRatio para evitar borrosidad en Retina
  const dpr = Math.min(window.devicePixelRatio || 1, 2) // cap a 2x
  canvasRef.value.width  = Math.round(w * dpr)
  canvasRef.value.height = Math.round(h * dpr)

  // Escalar el contexto para que drawImage use coordenadas lógicas
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (loaded) {
    const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress.value * TOTAL_FRAMES))
    drawFrame(idx)
  }
}

// ── Callback tras ocultarse el componente ─────────────────────
function onSceneHidden() {
  _introShown = true   // marcar: ya se mostró en esta sesión
  document.body.style.overflow     = ''
  document.body.style.paddingRight = ''
}

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  // Si el intro ya se mostró, no hacer nada
  if (_introShown) return

  // Bloquear scroll de la página mientras el overlay está activo
  const sbWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (sbWidth > 0) document.body.style.paddingRight = `${sbWidth}px`

  window.addEventListener('resize', resizeCanvas, { passive: true })

  await preloadFrames()
  loaded = true

  // Esperar un frame para que el DOM esté pintado y el canvas tenga tamaño
  requestAnimationFrame(() => {
    ctx = canvasRef.value?.getContext('2d')
    resizeCanvas()
    drawFrame(0)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  document.body.style.overflow     = ''
  document.body.style.paddingRight = ''
})
</script>

<style scoped>
/* ── Overlay fixed fullscreen ─────────────────────────────────── */
.scroll-scene {
  position: fixed;
  inset: 0;
  /* z-index menor que el AppHeader (z-50 = 50) para que el nav quede visible */
  z-index: 30;
  background: #0d0d0d;
  overscroll-behavior: contain;
}

/* ── Fade out del scene completo ──────────────────────────────── */
.scene-fade-leave-active { transition: opacity 1.3s cubic-bezier(0.4, 0, 0.2, 1); }
.scene-fade-leave-to     { opacity: 0; }

/* ── Canvas frame — responsivo por breakpoints ────────────────── */
.canvas-frame {
  position: absolute;
  /* Mobile: ocupa desde el header hasta el borde inferior */
  top: 4rem;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: white;
}

.frame-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Viñeta sutil dentro del encuadre ────────────────────────── */
.canvas-vignette {
  position: absolute;
  inset: 0;
 background: linear-gradient(
    to bottom,
    rgba(13,13,13,0.20) 0%,
    transparent 18%,
    transparent 72%,
    rgba(13,13,13,0.55) 100%
  ); 
  pointer-events: none;
}

/* ── Labels de servicios ─────────────────────────────────────── */
.service-labels {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
}

.service-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  padding: 1.5rem 3rem;
  background: rgba(13, 13, 13, 0.52);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(188, 149, 54, 0.28);
  text-align: center;
}

.label-eyebrow {
  font-size: 0.6rem;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #bc9536;
  font-weight: 600;
}

.label-title {
  font-size: clamp(1.5rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #f4f4f9;
  letter-spacing: 0.02em;
  line-height: 1.1;
  text-shadow: 0 2px 32px rgba(0,0,0,0.85);
}

.label-line {
  width: 42px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #bc9536, transparent);
}

/* ── Slide-up + fade de labels ────────────────────────────────── */
/* ENTRADA: sube desde abajo con opacity — ease-in-out puro */
.label-fade-enter-active {
  transition:
    opacity   0.8s ease-in-out,
    transform 0.8s ease-in-out;
}
/* SALIDA: solo desvanece sin movimiento */
.label-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.label-fade-enter-from {
  opacity: 0;
  transform: translateY(28px);
}
.label-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.label-fade-leave-from { opacity: 1; }
.label-fade-leave-to   { opacity: 0; }

/* ── Scroll hint ─────────────────────────────────────────────── */
.scroll-hint {
  position: absolute;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  transition: opacity 0.8s ease;
}
.scroll-hint.is-hidden { opacity: 0; }

.hint-text {
  font-size: 0.6rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #bc9536;
  font-weight: 600;
}

.scroll-hint svg {
  animation: bounce 1.7s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(7px); }
}

/* ── Barra de progreso ───────────────────────────────────────── */
.progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.07);
  z-index: 10;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #bc9536, #d4af52);
  transition: width 0.06s linear;
}
</style>
