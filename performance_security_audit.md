# 🔍 Auditoría de Rendimiento y Seguridad — HEVCA Photo & Art

> Análisis completo del proyecto Vue 3 + Sanity + Vite  
> Fecha: Mayo 2026 | Dispositivos objetivo: móvil y escritorio

---

## 🚨 Problemas Críticos (Alto Impacto)

### 1. 📦 Frames PNG sin comprimir — **~16 MB de assets bloqueantes**

| Archivo | Tamaño |
|---------|--------|
| 21 frames × ~800 KB | **~16.4 MB total** |

**Problema:** Los 21 archivos `Canon_SL2_png/Frame*.png` se precargan todos en `onMounted` de forma paralela con `Promise.all()`. En móvil (4G típico ~20 Mbps), esto bloquea la interactividad por **6–8 segundos**.

```js
// ScrollFrameScene.vue — PROBLEMA:
frames = await Promise.all(
  Array.from({ length: TOTAL_FRAMES }, (_, i) => new Promise(resolve => {
    const img = new Image()
    img.src = frameName(i)  // Carga los 21 PNG a la vez
    ...
  }))
)
```

**Impacto en métricas:** LCP muy alto, TTI bloqueado, FID degradado.

---

### 2. 🖼️ Imágenes JPG sin optimización WebP ni `srcset`

| Archivo | Tamaño |
|---------|--------|
| `estudio.jpg` | 549 KB |
| `evento.jpg` | 582 KB |
| `camara.jpg` | 512 KB |
| `boidoir.jpg` | 478 KB |
| `newborn.jpg` | 358 KB |

**Problema:** Las imágenes estáticas se usan sin `srcset`, sin WebP y sin dimensiones explícitas. Usadas como fondos con `background-image` inline, imposibilitan el uso de `<picture>` y causan **CLS** (Cumulative Layout Shift).

```html
<!-- HomeView.vue — PROBLEMA: sin srcset, sin WebP, sin dimensiones -->
<img :src="svc.img" :alt="svc.title" loading="lazy" />
```

---

### 3. ⚡ `HomeView` importado de forma EAGER (no lazy)

```js
// main.js — PROBLEMA:
import HomeView from './views/HomeView.vue'  // ← Carga síncrona en el bundle inicial

const GalleryView  = () => import('./views/GalleryView.vue')  // ← Correcto
```

**Problema:** `HomeView` es la vista más pesada (incluye GSAP + ScrollFrameScene + HeroCarousel) y va directamente en el bundle principal, aumentando el **First Contentful Paint (FCP)** en todos los usuarios.

---

### 4. 🌐 Fuente Google Fonts bloquea el renderizado

```html
<!-- index.html — PROBLEMA: stylesheet bloquea render -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins...&display=swap" />
```

**Problema:** Aunque existe `preconnect`, la carga de la fuente es render-blocking. No hay `font-display: optional` aplicado, ni se precargan los pesos críticos con `<link rel="preload">`.

---

### 5. 🔄 Múltiples `onMounted` con fetches separados a Sanity

**En `HomeView.vue`** hay 3 llamadas independientes a Sanity:
```js
// HomeView.vue — 3 fetches en onMounted:
await sanity.fetch(siteSettingsQuery)
await sanity.fetch(servicesQuery)
await sanity.fetch(testimonialsQuery)
```

**En `App.vue`** y `HomeView.vue` se hace `siteSettingsQuery` **dos veces** (duplicado también en GalleryView, ServicesView, AboutView). Esto son **4–5 peticiones redundantes** al mismo endpoint en cada navegación.

---

## ⚠️ Problemas Importantes (Impacto Medio)

### 6. 🎞️ GSAP Ticker activo continuamente

```js
// ScrollFrameScene.vue
gsap.ticker.add(onTick)  // Se ejecuta ~60 veces/segundo mientras el componente está montado
```

El ticker corre incluso cuando el usuario no hace scroll, consumiendo CPU/batería constantemente en móvil. Aunque tiene guarda `if (!loaded || leaving)`, el overhead del ticker siempre existe.

---

### 7. 🔁 `scroll` event listener sin debounce en 3 vistas

```js
// AboutView.vue, ServicesView.vue, GalleryView.vue — patrón repetido:
const handleScroll = () => { scrollY.value = window.scrollY }
window.addEventListener('scroll', handleScroll, { passive: true })
```

Aunque es `passive`, actualiza un ref reactivo en cada evento de scroll (60fps), lo que puede disparar re-renders innecesarios. El valor solo se usa para animar una barra decorativa.

---

### 8. 📸 Galería: imágenes de Sanity sin parámetros de optimización

```js
// galleryQueries.js — PROBLEMA:
"url": asset->url  // URL sin formato, sin resize, sin WebP
```

Las URLs de Sanity soportan transformaciones en la URL (`?w=800&auto=format&q=80`), pero se solicitan en resolución original, potencialmente cargando imágenes de varios MB en móvil.

---

### 9. 🏗️ `bg-fixed` (background-attachment: fixed) en móvil

```html
<!-- HomeView.vue, AboutView.vue, ServicesView.vue -->
<section class="... bg-fixed" style="background-image: url(...)">
```

**Problema:** `background-attachment: fixed` está **desactivado en iOS Safari** (causa un fallback sin parallax) y en Android causa repaints en cada frame de scroll (jank). Es una de las causas más comunes de mala performance en móvil.

---

### 10. 🖼️ Canvas recrea el gradiente radial en CADA frame dibujado

```js
// ScrollFrameScene.vue — drawFrame():
const grad = ctx.createRadialGradient(...)  // Crea nuevo objeto en cada llamada
grad.addColorStop(...)
ctx.fillStyle = grad
ctx.fillRect(...)
```

El gradiente radial se recalcula 60 veces por segundo durante el scroll. Debería crearse una vez al hacer resize y reutilizarse.

---

### 11. 📋 `siteSettingsQuery` duplicado en App.vue + cada vista

`App.vue` ya hace `sanity.fetch(siteSettingsQuery)` al montar la app, y luego cada vista lo repite. No existe ningún store/caché global (Pinia, provide/inject, o module-level singleton) para compartir este resultado.

---

## 🔒 Problemas de Seguridad

### 12. 🔑 API Key de Web3Forms expuesta en el código fuente

```js
// ContactForm.vue — CRÍTICO:
body: JSON.stringify({
  access_key: '5122eb3b-775c-42ca-8e24-fd0bfc57ec5a',  // ← Hardcoded & visible en bundle
  ...
})
```

**Riesgo:** Cualquiera que inspeccione el bundle JS puede extraer esta clave y enviar miles de formularios usando tu quota de Web3Forms.

---

### 13. 🛡️ Ausencia de Content Security Policy (CSP)

`vercel.json` tiene headers de seguridad básicos pero falta CSP:
```json
// vercel.json — lo que hay:
{ "key": "X-Frame-Options", "value": "DENY" },
{ "key": "X-Content-Type-Options", "value": "nosniff" },
{ "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }

// Lo que FALTA:
// Content-Security-Policy
// Permissions-Policy
// Strict-Transport-Security (HSTS)
// X-XSS-Protection (legacy)
```

---

### 14. 🔗 Link externo WhatsApp sin `rel="noopener noreferrer"`

```html
<!-- ServicesView.vue -->
<a href="https://wa.me/..." target="_blank">
```

Sin `rel="noopener noreferrer"`, la página destino puede acceder a `window.opener` (tab-napping attack).

---

### 15. 📱 Número de teléfono hardcoded en el HTML público

```html
href="https://wa.me/5215550751396"
```

El número aparece en el bundle sin posibilidad de actualizarlo desde Sanity CMS.

---

## 📊 Resumen de Impacto en Core Web Vitals

| Métrica | Estado Estimado | Causa Principal |
|---------|-----------------|-----------------|
| **LCP** | 🔴 Muy Malo (>4s móvil) | 16MB de PNGs bloqueando, fuente render-blocking |
| **FCP** | 🟠 Malo (~3s móvil) | HomeView eager-loaded, fuente bloqueante |
| **CLS** | 🟠 Moderado | Imágenes sin dimensiones, floating-banner con `margin-top` negativo |
| **INP** | 🟡 Mejorable | Ticker GSAP, scroll handlers reactivos |
| **TTFB** | 🟢 Bueno | Sanity CDN + Vercel Edge |

---

## ✅ Plan de Mejoras Priorizado

### 🔴 Prioridad 1 — Hacer YA (mayor impacto)

| # | Mejora | Archivo | Ganancia estimada |
|---|--------|---------|-------------------|
| 1 | Convertir los 21 PNGs a WebP (~85% menos peso) | `public/Canon_SL2_png/` | **-13 MB** |
| 2 | Cargar frames progresivamente (1→5 primero, luego el resto) | `ScrollFrameScene.vue` | **-6s TTI móvil** |
| 3 | Lazy-load de HomeView igual que el resto de vistas | `main.js` | **-30% bundle inicial** |
| 4 | Optimizar imágenes JPG a WebP (sharp o Squoosh) | `public/multimedia/` | **-1.5 MB** |
| 5 | Mover `access_key` a variable de entorno Vite | `ContactForm.vue` | **Seguridad** |

### 🟠 Prioridad 2 — Esta semana

| # | Mejora | Archivo | Ganancia estimada |
|---|--------|---------|-------------------|
| 6 | Crear store singleton para `siteSettings` (evitar fetches duplicados) | `App.vue` + vistas | **-4 peticiones por sesión** |
| 7 | Agregar parámetros de optimización a URLs de Sanity | `galleryQueries.js` | **-60% peso imágenes galería** |
| 8 | Eliminar `bg-fixed` en móvil con media query | `HomeView`, `AboutView`, `ServicesView` | **Elimina jank scroll iOS/Android** |
| 9 | Cachear el gradiente radial fuera de `drawFrame()` | `ScrollFrameScene.vue` | **-30% CPU en animación** |
| 10 | Añadir `rel="noopener noreferrer"` a link de WhatsApp | `ServicesView.vue` | **Seguridad** |

### 🟡 Prioridad 3 — Próximo sprint

| # | Mejora | Archivo | Ganancia estimada |
|---|--------|---------|-------------------|
| 11 | Añadir CSP + HSTS + Permissions-Policy a `vercel.json` | `vercel.json` | **Seguridad A+** |
| 12 | Añadir `srcset` con WebP a todas las `<img>` de contenido | Todas las vistas | **Mejor LCP** |
| 13 | Preload de la imagen hero del carousel (LCP candidate) | `index.html` | **-1s LCP** |
| 14 | Throttle del scroll handler (requestAnimationFrame) | `AboutView`, `ServicesView`, `GalleryView` | **-INP** |
| 15 | Mover número WhatsApp a Sanity `siteSettings` | `ServicesView.vue` + schema | **Mantenibilidad** |

---

## 🛠️ Implementaciones Concretas

### Fix #1 — Lazy-load de HomeView
```js
// main.js
const HomeView = () => import('./views/HomeView.vue')  // Cambiar import estático por dinámico
```

### Fix #2 — Optimizar imágenes Sanity con parámetros de URL
```js
// galleryQueries.js
export const galleryImagesQuery = `
  *[_type == "gallery"] {
    "items": images[] {
      "category": ^.category,
      "url": asset->url + "?w=800&auto=format&q=80",
      "urlThumb": asset->url + "?w=400&auto=format&q=70",
      "_id": _key,
      "alt": coalesce(alt, "Fotografía HEVCA")
    }
  }.items[]
`
```

### Fix #3 — Carga progresiva de frames
```js
// ScrollFrameScene.vue — cargar primero frames 0-4, luego el resto
async function preloadFrames() {
  // Fase 1: frames críticos (los primeros que el usuario ve)
  const criticalFrames = await Promise.all(
    Array.from({ length: 5 }, (_, i) => loadFrame(i))
  )
  frames = criticalFrames
  loaded = true
  drawFrame(0)
  
  // Fase 2: resto de frames en segundo plano
  const rest = await Promise.all(
    Array.from({ length: TOTAL_FRAMES - 5 }, (_, i) => loadFrame(i + 5))
  )
  frames = [...criticalFrames, ...rest]
}
```

### Fix #4 — Singleton de siteSettings
```js
// src/composables/useSiteSettings.js (nuevo archivo)
import { ref } from 'vue'
import { sanity } from '../lib/sanityClient'
import { siteSettingsQuery } from '../lib/queries/homeQueries'

const settings = ref(null)
let promise = null

export function useSiteSettings() {
  const load = () => {
    if (settings.value) return Promise.resolve(settings.value)
    if (!promise) {
      promise = sanity.fetch(siteSettingsQuery).then(data => {
        settings.value = data
        return data
      })
    }
    return promise
  }
  return { settings, load }
}
```

### Fix #5 — Eliminar bg-fixed en móvil
```css
/* style.css o en cada componente */
@media (max-width: 1023px) {
  .bg-fixed { background-attachment: scroll !important; }
}
```

### Fix #6 — CSP en vercel.json
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://cdn.sanity.io; connect-src 'self' https://illa07bq.api.sanity.io https://api.web3forms.com; frame-ancestors 'none'"
},
{
  "key": "Strict-Transport-Security",
  "value": "max-age=31536000; includeSubDomains"
},
{
  "key": "Permissions-Policy",
  "value": "camera=(), microphone=(), geolocation=()"
}
```

### Fix #7 — Variable de entorno para Web3Forms
```bash
# .env (crear en la raíz, NO commitear)
VITE_WEB3FORMS_KEY=5122eb3b-775c-42ca-8e24-fd0bfc57ec5a
```
```js
// ContactForm.vue
access_key: import.meta.env.VITE_WEB3FORMS_KEY,
```

---

## 📈 Mejora Estimada Total

| Escenario | LCP Móvil Estimado | Score Lighthouse |
|-----------|-------------------|-----------------|
| **Actual** | ~5–8 segundos | ~35–50 |
| **Tras Prioridad 1** | ~2–3 segundos | ~65–75 |
| **Tras Prioridad 1+2** | ~1.5–2 segundos | ~80–90 |
| **Tras todo el plan** | ~1–1.5 segundos | ~90–95 |

