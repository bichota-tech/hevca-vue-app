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
          <Transition name="label-fade">
            <div v-if="activeLabel" :key="activeLabel" class="service-label">
              <span class="label-eyebrow">Servicios</span>
              <h2 class="label-title font-['Montserrat']">{{ activeLabel }}</h2>
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

const TOTAL_FRAMES = 51
const BASE_PATH    = '/Canon_SL2_webp/'
function frameName(i) { 
  const paddedIndex = i.toString().padStart(3, '0')
  return `${BASE_PATH}Frames_${paddedIndex}.webp` 
}

const SEGMENTS = [
  { from: 1,  to: 8,  label: 'Retrato Corporativo'  }, // Cambiado a 1
  { from: 10, to: 15, label: 'Fotografía Comercial' },
  { from: 17, to: 22, label: 'Boudoir & Artístico'  },
  { from: 24, to: 29, label: 'Eventos & Especiales' },
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

// Variables planas para evitar el overhead reactivo de Vue
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

// ─── 1. Dibujar frame (Optimizado sin Background Fill) ──────────────
function drawFrame(index) {
  if (!ctx || !logW || !logH) return
  const img = frames[index]
  if (!img?.naturalWidth) return

  // Usamos Math.max para emular 'object-fit: cover' y rellenar todo el lienzo
  const scale = Math.max(logW / img.naturalWidth, logH / img.naturalHeight)
  const sw = img.naturalWidth  * scale
  const sh = img.naturalHeight * scale
  const sx = (logW - sw) / 2
  const sy = (logH - sh) / 2
  
  // Limpiamos opcionalmente (muy rápido) y dibujamos la imagen plana
  ctx.clearRect(0, 0, logW, logH)
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, sx, sy, sw, sh)
}

// ─── 2. GSAP Ticker (Lerp ajustado) ──────────────────────────────────
function onTick() {
  if (!loaded || leaving) return
  // GSAP ya suaviza el 'frameTarget' mediante su 'scrub: 1.5'. 
  // Mantenemos tu lerp pero con un factor ágil (0.3) para evitar doble latencia
  frameCurrent += (frameTarget - frameCurrent) * 0.3
  const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameCurrent)))
  
  if (idx !== lastDrawnIdx) {
    drawFrame(idx)
    lastDrawnIdx = idx
  }
}

// ─── Precarga progresiva ──────────────────────────────────────────────
function loadFrame(i) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = frameName(i)
    img.onload  = () => resolve(img)
    img.onerror = () => { console.warn(`Frame no cargado: ${img.src}`); resolve(img) }
  })
}

async function preloadFrames() {
  const CRITICAL = 5

  const criticalFrames = await Promise.all(
    Array.from({ length: CRITICAL }, (_, i) => loadFrame(i))
  )
  frames = criticalFrames
  loaded = true

  requestAnimationFrame(() => {
    resizeCanvas()
    drawFrame(0)
    lastDrawnIdx = 0
  })

  Promise.all(
    Array.from({ length: TOTAL_FRAMES - CRITICAL }, (_, i) => loadFrame(i + CRITICAL))
  ).then(restFrames => {
    frames = [...criticalFrames, ...restFrames]
  })
}

// ─── 3. Resize canvas (Limpio) ────────────────────────────────────────
function resizeCanvas() {
  if (!canvasRef.value || !frameRef.value) return
  const cs = window.getComputedStyle(frameRef.value)
  const w = frameRef.value.clientWidth  - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0)
  const h = frameRef.value.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0)
  
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

// ─── Animación de entrada y ScrollTriggers (Sin Cambios) ──────────────
function playIntro() {
  gsap.fromTo(canvasRef.value,
    { opacity: 0, scale: 0.94 },
    { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.1 }
  )
  gsap.fromTo(vignetteRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 1.8, ease: 'power2.out' }
  )
  if (hintRef.value) {
    gsap.fromTo(hintRef.value,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.8 }
    )
  }
}

function setupZoom() {
  if (window.innerWidth < 1024) return

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
        frameTarget = self.progress * (TOTAL_FRAMES - 1)

        if (self.progress >= 0.97 && !leaving) {
          leaving = true
          exitScene()
        }
      },
    },
  })
  st = tween.scrollTrigger
}

function exitScene() {
  requestAnimationFrame(() => {
    st?.kill()
    zoomST?.scrollTrigger?.kill()
  })
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

let orientationHandler = null

onMounted(async () => {
  if (_introShown) return

  const sbWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (sbWidth > 0) document.body.style.paddingRight = `${sbWidth}px`

  window.addEventListener('resize', resizeCanvas, { passive: true })

  orientationHandler = () => {
    setTimeout(() => {
      resizeCanvas()
      ScrollTrigger.refresh()
    }, 300)
  }
  window.addEventListener('orientationchange', orientationHandler, { passive: true })

  await preloadFrames()

  requestAnimationFrame(() => {
    if (overlayRef.value) overlayRef.value.scrollTop = 0
    frameCurrent = 0
    frameTarget  = 0
    gsap.ticker.add(onTick)
    playIntro()
    setupZoom() // Activado, lo tenías declarado pero no invocado en el onMounted
    setupScrollTrigger()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (orientationHandler) window.removeEventListener('orientationchange', orientationHandler)
  gsap.ticker.remove(onTick)
  st?.kill()
  tween?.kill()
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<style scoped>
/* Tus estilos CSS se mantienen perfectos. 
   La gestión de pointer-events-none y el z-index están impecables. 
   Solo me he asegurado de que el canvas reaccione bien a la limpieza. */
.scroll-scene-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: #0d0d0d;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scroll-behavior: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-scene-overlay::-webkit-scrollbar {
  display: none;
}
.scroll-spacer { height: 400vh; position: relative; width: 100%; }
.scroll-scene-pinned { position: sticky; top: 0; height: 100vh; width: 100%; overflow: hidden; }
.canvas-frame {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  box-sizing: border-box; background: transparent; overflow: hidden; transform-origin: center center;
}

.frame-canvas { 
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important; 
  height: 100% !important; 
  display: block; 
  background: transparent; 
  transform-origin: center center; 
  will-change: transform, opacity; 
}
.canvas-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to bottom,  rgba(13,13,13,0.85) 0%, transparent 12%),
    linear-gradient(to top,     rgba(13,13,13,0.60) 0%, transparent 20%),
    linear-gradient(to right,   rgba(13,13,13,0.45) 0%, transparent 15%),
    linear-gradient(to left,    rgba(13,13,13,0.45) 0%, transparent 15%);
}

.service-labels {
  position: absolute; inset: 0; display: flex; align-items: flex-start; justify-content: center;
  padding-top: 8rem; pointer-events: none; z-index: 10;
}
@media (min-width: 768px) and (orientation: portrait) { .service-labels { padding-top: 8rem; } }
@media (min-width: 640px) and (orientation: landscape) and (max-width: 1023px) { .service-labels { padding-top: 5rem; } }
@media (min-width: 1024px) { .service-labels { align-items: center; justify-content: center; padding-top: 0; } }

.service-label {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  padding: 1rem 1.5rem; background: rgba(13, 13, 13, 0.60); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(188, 149, 54, 0.30); text-align: center;
}
@media (min-width: 640px) { .service-label { padding: 1.2rem 2rem; gap: 0.6rem; } }
@media (min-width: 1024px) { .service-label { padding: 1.5rem 3rem; gap: 0.7rem; } }

.label-eyebrow { font-size: 0.6rem; letter-spacing: 0.42em; text-transform: uppercase; color: #bc9536; font-weight: 600; }

/* La fuente principal ahora se fuerza mediante clase Tailwind font-['Montserrat'] en el template */
.label-title {
  font-size: clamp(1.5rem, 4vw, 2.8rem); font-weight: 700; color: #f4f4f9;
  letter-spacing: 0.02em; line-height: 1.1; text-shadow: 0 2px 32px rgba(0,0,0,0.85);
}

.label-line { width: 42px; height: 2px; background: linear-gradient(90deg, transparent, #bc9536, transparent); }

.label-fade-enter-active { transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out; }
.label-fade-leave-active { transition: opacity 0.5s ease-in-out; }
.label-fade-enter-from   { opacity: 0; transform: translateY(24px); }
.label-fade-enter-to     { opacity: 1; transform: translateY(0); }
.label-fade-leave-from   { opacity: 1; }
.label-fade-leave-to     { opacity: 0; }

.scroll-hint {
  position: absolute; bottom: 6rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  z-index: 10; transition: opacity 0.8s ease; will-change: opacity, transform;
}
.scroll-hint.is-hidden { opacity: 0; pointer-events: none; }
.hint-text { font-size: 0.6rem; letter-spacing: 0.32em; text-transform: uppercase; color: #bc9536; font-weight: 600; }
.scroll-hint svg { animation: bounce 1.7s ease-in-out infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(7px); } }

.progress-track { position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: rgba(255,255,255,0.07); z-index: 10; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #bc9536, #d4af52); transition: width 0.06s linear; }
</style>