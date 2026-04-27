<template>
  <Transition name="scene-fade" @after-leave="onSceneHidden">
    <div
      v-if="visible"
      class="scroll-scene-overlay"
      ref="overlayRef"
    >
      <div class="scroll-spacer" ref="spacerRef"></div>

      <div class="scroll-scene-pinned">
        <!-- Canvas encuadrado -->
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
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let _introShown = false

const TOTAL_FRAMES = 21
const BASE_PATH    = '/Canon_SL2_webP/'

const SEGMENTS = [
  { from: 4,  to: 8,  label: 'Retrato Corporativo'   },
  { from: 8,  to: 12, label: 'Fotografía Comercial'  },
  { from: 12, to: 16, label: 'Boudoir & Artístico'   },
  { from: 16, to: 21, label: 'Eventos & Especiales'  },
]

const visible    = ref(!_introShown)
const progress   = ref(0)
const canvasRef  = ref(null)
const overlayRef = ref(null)
const spacerRef  = ref(null)

let frames       = []
let ctx          = null
let loaded       = false
let lastDrawnIdx = -1
let leaving      = false
let timeline     = null
let scrollTriggerInstance = null

const activeLabel = computed(() => {
  const f = Math.floor(progress.value * TOTAL_FRAMES) + 1
  for (const seg of SEGMENTS) {
    if (f >= seg.from && f < seg.to) return seg.label
  }
  return null
})

function drawFrame(index) {
  if (!ctx || !canvasRef.value) return
  const img = frames[index]
  if (!img?.naturalWidth) return

  const frame = canvasRef.value.parentElement
  const cw = frame ? frame.clientWidth  : canvasRef.value.width
  const ch = frame ? frame.clientHeight : canvasRef.value.height
  if (!cw || !ch) return

  // Usar Math.min para COMPORTAMIENTO CONTAIN (Muestra todo el frame)
  const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
  
  const sw = img.naturalWidth * scale
  const sh = img.naturalHeight * scale
  const sx = (cw - sw) / 2
  const sy = (ch - sh) / 2
  
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, sx, sy, sw, sh)
}

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

function resizeCanvas() {
  if (!canvasRef.value) return
  const frame = canvasRef.value.parentElement
  if (!frame) return
  const w = frame.clientWidth
  const h = frame.clientHeight
  if (!w || !h) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvasRef.value.width  = Math.round(w * dpr)
  canvasRef.value.height = Math.round(h * dpr)

  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (loaded && !leaving) {
    drawFrame(Math.max(0, lastDrawnIdx))
  }
}

function onSceneHidden() {
  _introShown = true
  document.body.style.overflow     = ''
  document.body.style.paddingRight = ''
}

onMounted(async () => {
  if (_introShown) return

  const sbWidth = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (sbWidth > 0) document.body.style.paddingRight = `${sbWidth}px`

  window.addEventListener('resize', resizeCanvas, { passive: true })

  await preloadFrames()
  loaded = true

  requestAnimationFrame(() => {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    resizeCanvas()
    drawFrame(0)

    // Configurar GSAP ScrollTrigger
    const playhead = { frame: 0 }
    
    timeline = gsap.to(playhead, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        scroller: overlayRef.value,
        trigger: spacerRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Suavizado de inercia
        onUpdate: (self) => {
          progress.value = self.progress
        }
      },
      onUpdate: () => {
        const idx = Math.round(playhead.frame)
        if (idx !== lastDrawnIdx) {
          drawFrame(idx)
          lastDrawnIdx = idx
        }
        
        // Cuando llega casi al final, cerrar la escena automáticamente
        if (playhead.frame >= TOTAL_FRAMES - 1 - 0.01) {
          if (!leaving) {
            leaving = true
            visible.value = false
            // Limpiar ScrollTrigger para evitar callbacks extra
            if (scrollTriggerInstance) scrollTriggerInstance.kill()
          }
        }
      }
    })
    
    scrollTriggerInstance = ScrollTrigger.getById(timeline.scrollTrigger?.id)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (scrollTriggerInstance) scrollTriggerInstance.kill()
  if (timeline) timeline.kill()
  document.body.style.overflow     = ''
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
}

/* Espaciador que da altura para hacer scroll */
.scroll-spacer {
  height: 350vh; /* Altura total de la escena */
  width: 100%;
}

/* Elemento sticky que siempre está visible mientras haces scroll por el spacer */
.scroll-scene-pinned {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.scene-fade-leave-active { transition: opacity 1.3s cubic-bezier(0.4, 0, 0.2, 1); }
.scene-fade-leave-to     { opacity: 0; }

.canvas-frame {
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  /* El background transparent es importante aquí */
  background-color: transparent;
}

.frame-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

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

.label-fade-enter-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
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
