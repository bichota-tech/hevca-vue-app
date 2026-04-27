<template>
  <div
    v-if="visible"
    class="scroll-scene-overlay"
    ref="overlayRef"
  >
    <div class="scroll-spacer" ref="spacerRef">
      <div class="scroll-scene-pinned">

        <div class="canvas-frame" ref="frameRef">
          <canvas ref="canvasRef" class="frame-canvas" />
          <div class="canvas-vignette" ref="vignetteRef" />
        </div>

        <div class="service-labels">
          <Transition name="label-fade" mode="out-in">
            <div v-if="activeLabel" :key="activeLabel" class="service-label">
              <span class="label-eyebrow">Servicios</span>
              <h2 class="label-title">{{ activeLabel }}</h2>
              <div class="label-line" />
            </div>
          </Transition>
        </div>

        <div class="scroll-hint" ref="hintRef" :class="{ 'is-hidden': progress > 0.04 }">
          <span class="hint-text">Scroll</span>
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
            <path d="M9 1v16M9 17l-5-5M9 17l5-5" stroke="#bc9536" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress * 100}%` }" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let _introShown = false

const TOTAL_FRAMES = 21
const BASE_PATH    = '/Canon_SL2_png/'
function frameName(i) { return `${BASE_PATH}Frame${i + 1}.png` }

const SEGMENTS = [
  { from: 4,  to: 8,  label: 'Retrato Corporativo'  },
  { from: 8,  to: 12, label: 'Fotografía Comercial' },
  { from: 12, to: 16, label: 'Boudoir & Artístico'  },
  { from: 16, to: 21, label: 'Eventos & Especiales' },
]

const visible    = ref(!_introShown)
const progress   = ref(0)
const canvasRef  = ref(null)
const frameRef   = ref(null)
const overlayRef = ref(null)
const spacerRef  = ref(null)
const vignetteRef = ref(null)
const hintRef    = ref(null)

let frames       = []
let ctx          = null
let loaded       = false
let leaving      = false
let logW = 0, logH = 0

// Frame suavizado: target viene del ScrollTrigger, current se lerp via ticker
let frameTarget  = 0
let frameCurrent = 0
let lastDrawnIdx = -1

let st = null, zoomST = null, tween = null

const activeLabel = computed(() => {
  const f = Math.floor(progress.value * TOTAL_FRAMES) + 1
  for (const seg of SEGMENTS) {
    if (f >= seg.from && f < seg.to) return seg.label
  }
  return null
})

// ─── Dibujar frame ────────────────────────────────────────────────────────────
function drawFrame(index) {
  if (!ctx || !logW || !logH) return
  const img = frames[index]
  if (!img?.naturalWidth) return

  // Degradado radial: #bc9536 en el centro → #0d0d0d en los bordes
  // Se crea en cada frame porque las dimensiones pueden cambiar tras un resize
  const cx = logW / 2
  const cy = logH / 2
  // Radio hasta la esquina más lejana para cubrir toda el área
  const r  = Math.sqrt(cx * cx + cy * cy)

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grad.addColorStop(0,    '#c9a23e')   // oro cálido en el centro (ligeramente más claro)
  grad.addColorStop(0.35, '#7a5e22')   // transición dorada media
  grad.addColorStop(0.65, '#2e2008')   // marrón oscuro
  grad.addColorStop(1,    '#0d0d0d')   // funde con el fondo de la página

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, logW, logH)

  const scale = Math.min(logW / img.naturalWidth, logH / img.naturalHeight)
  const sw = img.naturalWidth  * scale
  const sh = img.naturalHeight * scale
  const sx = (logW - sw) / 2
  const sy = (logH - sh) / 2
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, sx, sy, sw, sh)
}

// ─── GSAP Ticker: interpola frameCurrent → frameTarget ───────────────────────
// Esto suaviza los saltos entre los 21 frames discretos
function onTick() {
  if (!loaded || leaving) return
  frameCurrent += (frameTarget - frameCurrent) * 0.18
  const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameCurrent)))
  if (idx !== lastDrawnIdx) {
    drawFrame(idx)
    lastDrawnIdx = idx
  }
}

// ─── Precarga ─────────────────────────────────────────────────────────────────
async function preloadFrames() {
  frames = await Promise.all(
    Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      new Promise(resolve => {
        const img = new Image()
        img.src = frameName(i)
        img.onload  = () => resolve(img)
        img.onerror = () => { console.warn(`No se cargó: ${img.src}`); resolve(img) }
      })
    )
  )
}

// ─── Resize canvas ────────────────────────────────────────────────────────────
function resizeCanvas() {
  if (!canvasRef.value || !frameRef.value) return
  const cs = window.getComputedStyle(frameRef.value)
  const pL = parseFloat(cs.paddingLeft)   || 0
  const pR = parseFloat(cs.paddingRight)  || 0
  const pT = parseFloat(cs.paddingTop)    || 0
  const pB = parseFloat(cs.paddingBottom) || 0
  const w = frameRef.value.clientWidth  - pL - pR
  const h = frameRef.value.clientHeight - pT - pB
  if (!w || !h) return

  logW = w; logH = h
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.style.width  = `${w}px`
  canvasRef.value.style.height = `${h}px`
  canvasRef.value.width  = Math.round(w * dpr)
  canvasRef.value.height = Math.round(h * dpr)
  ctx = canvasRef.value.getContext('2d', { alpha: false })
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (loaded && !leaving) drawFrame(Math.max(0, lastDrawnIdx))
}

function onSceneHidden() {
  _introShown = true
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// ─── Animación de entrada ─────────────────────────────────────────────────────
function playIntro() {
  // Canvas: aparece con fade + ligero scale up
  gsap.fromTo(canvasRef.value,
    { opacity: 0, scale: 0.94 },
    { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.1 }
  )
  // Viñeta: se intensifica al entrar
  gsap.fromTo(vignetteRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 1.8, ease: 'power2.out' }
  )
  // Hint: entra después
  if (hintRef.value) {
    gsap.fromTo(hintRef.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
    )
  }
}

// ─── Zoom parallax ─────────────────────────────────────────────────────────────
// Solo en desktop: evita el desplazamiento lateral en tablet landscape.
// Se aplica al CANVAS (no al frame) para que el transform-origin sea exactamente
// el centro visual de la imagen, sin que el padding del contenedor lo desvie.
function setupZoom() {
  if (window.innerWidth < 1024) return  // no zoom en móvil/tablet

  zoomST = gsap.to(canvasRef.value, {
    scale: 1.06,
    ease: 'none',
    scrollTrigger: {
      scroller : overlayRef.value,
      trigger  : spacerRef.value,
      start    : 'top top',
      end      : 'bottom bottom',
      scrub    : 3,
    }
  })
}

// ─── ScrollTrigger principal (frames) ─────────────────────────────────────────
function setupScrollTrigger() {
  tween = gsap.to({ v: 0 }, {
    v: TOTAL_FRAMES - 1,
    ease: 'none',
    scrollTrigger: {
      scroller : overlayRef.value,
      trigger  : spacerRef.value,
      start    : 'top top',
      end      : 'bottom bottom',
      scrub    : 1.5,
      onUpdate(self) {
        progress.value = self.progress
        // Actualizar el target — el ticker lo interpola suavemente
        frameTarget = self.progress * (TOTAL_FRAMES - 1)

        // Al llegar al final → salida cinematográfica
        if (self.progress >= 0.97 && !leaving) {
          leaving = true
          exitScene()
        }
      },
    },
  })
  st = tween.scrollTrigger
}

// ─── Salida con GSAP ──────────────────────────────────────────────────────────
function exitScene() {
  // Matar scroll triggers para que no sigan disparando
  requestAnimationFrame(() => {
    st?.kill()
    zoomST?.scrollTrigger?.kill()
  })

  // Animar salida: scale down + fade
  gsap.to(canvasRef.value, {
    scale  : 0.96,
    opacity: 0,
    duration: 0.7,
    ease   : 'power2.in',
  })
  gsap.to(overlayRef.value, {
    opacity : 0,
    duration: 1.2,
    ease    : 'power2.inOut',
    delay   : 0.2,
    onComplete() {
      visible.value = false
      onSceneHidden()
    }
  })
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (_introShown) return

  const sbWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (sbWidth > 0) document.body.style.paddingRight = `${sbWidth}px`

  window.addEventListener('resize', resizeCanvas, { passive: true })
  // Recalcular al girar el dispositivo (orientationchange no siempre dispara resize)
  window.addEventListener('orientationchange', () => {
    // Esperar a que el browser actualice las dimensiones tras el giro
    setTimeout(() => {
      resizeCanvas()
      ScrollTrigger.refresh()
    }, 300)
  }, { passive: true })

  await preloadFrames()
  loaded = true

  requestAnimationFrame(() => {
    if (overlayRef.value) overlayRef.value.scrollTop = 0

    resizeCanvas()
    drawFrame(0)
    lastDrawnIdx = 0
    frameCurrent = 0
    frameTarget  = 0

    // Activar ticker GSAP para interpolación suave de frames
    gsap.ticker.add(onTick)

    playIntro()
    setupScrollTrigger()
    setupZoom()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('orientationchange', resizeCanvas)
  gsap.ticker.remove(onTick)
  st?.kill()
  zoomST?.scrollTrigger?.kill()
  tween?.kill()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<style scoped>
.scroll-scene-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: #0d0d0d;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scroll-behavior: auto;
  /* Ocultar scrollbar — Firefox */
  scrollbar-width: none;
  /* Ocultar scrollbar — IE / Edge legacy */
  -ms-overflow-style: none;
}
/* Ocultar scrollbar — Chrome / Safari / Opera */
.scroll-scene-overlay::-webkit-scrollbar {
  display: none;
}

/* Spacer con el sticky dentro */
.scroll-spacer {
  height: 400vh;
  position: relative;
  width: 100%;
}

.scroll-scene-pinned {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Marco del canvas — sin padding porque el gradiente funde con el fondo */
.canvas-frame {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Padding mínimo solo para respetar el header */
  padding: 3.5rem 0 0;
  box-sizing: border-box;
  background: transparent;
  overflow: hidden;
  transform-origin: center center;
}

/*
  Canvas sin borde ni sombra — los bordes del gradiente se funden con #0d0d0d.
  El tamaño CSS lo asigna JS via inline style.
*/
.frame-canvas {
  display: block;
  /* Sin background CSS: el gradiente lo pinta el JS en cada frame */
  background: transparent;
  transform-origin: center center;
  will-change: transform, opacity;
}

/*
  Viñeta extra: refuerza el fundido en los cuatro bordes para que el canvas
  se integre perfectamente con el fondo #0d0d0d de la página.
*/
.canvas-vignette {
  position: absolute;
  inset: 0;
  background:
    /* Borde superior (header area) */
    linear-gradient(to bottom,  rgba(13,13,13,0.85) 0%, transparent 12%),
    /* Borde inferior */
    linear-gradient(to top,     rgba(13,13,13,0.60) 0%, transparent 20%),
    /* Borde izquierdo */
    linear-gradient(to right,   rgba(13,13,13,0.45) 0%, transparent 15%),
    /* Borde derecho */
    linear-gradient(to left,    rgba(13,13,13,0.45) 0%, transparent 15%);
  pointer-events: none;
}

/* Labels — desktop: centrados • móvil/tablet portrait: arriba bajo el header */
.service-labels {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  /* Móvil portrait: margen desde el header */
  padding-top: 8rem;
  pointer-events: none;
  z-index: 10;
}

/* Tablet portrait (≥768px): misma distancia que móvil */
@media (min-width: 768px) and (orientation: portrait) {
  .service-labels {
    padding-top: 8rem;
  }
}

/* Tablet landscape (≥640px landscape): header visible es menor, reducir un poco */
@media (min-width: 640px) and (orientation: landscape) and (max-width: 1023px) {
  .service-labels {
    padding-top: 5rem;
  }
}

/* Desktop (≥1024px): centrado vertical */
@media (min-width: 1024px) {
  .service-labels {
    align-items: center;
    justify-content: center;
    padding-top: 0;
  }
}

.service-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  /* Padding reducido en móvil para no ocupar mucho espacio vertical */
  padding: 1rem 1.5rem;
  background: rgba(13, 13, 13, 0.60);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(188, 149, 54, 0.30);
  text-align: center;
}

@media (min-width: 640px) {
  .service-label {
    padding: 1.2rem 2rem;
    gap: 0.6rem;
  }
}

@media (min-width: 1024px) {
  .service-label {
    padding: 1.5rem 3rem;
    gap: 0.7rem;
  }
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

.label-fade-enter-active { transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out; }
.label-fade-leave-active { transition: opacity 0.5s ease-in-out; }
.label-fade-enter-from   { opacity: 0; transform: translateY(24px); }
.label-fade-enter-to     { opacity: 1; transform: translateY(0); }
.label-fade-leave-from   { opacity: 1; }
.label-fade-leave-to     { opacity: 0; }

/* Scroll hint */
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
  will-change: opacity, transform;
}
.scroll-hint.is-hidden { opacity: 0; pointer-events: none; }

.hint-text {
  font-size: 0.6rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #bc9536;
  font-weight: 600;
}

.scroll-hint svg { animation: bounce 1.7s ease-in-out infinite; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(7px); }
}

/* Progress bar */
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
