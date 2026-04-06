<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative overflow-hidden bg-fixed bg-center bg-cover" style="min-height: 500px; display:flex; align-items:flex-end; background-image: url('/multimedia/corporativo1.jpg');">
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
      <div class="relative z-10 page-container pb-10 pt-24 text-left w-full">
        <span class="section-label" style="text-align:left;">Hablemos de ti</span>
        <div class="w-fit">
          <h1 class="font-black text-white leading-tight" style="font-size: clamp(2rem, 5vw, 4rem);">
            Contacto
          </h1>
          <div class="h-[3px] bg-[#bc9536] my-4 transition-all duration-[150ms] ease-out" :style="{ width: `clamp(3rem, 3rem + ${scrollY * 0.6}px, 100%)` }"></div>
        </div>
        <p class="text-white/60 italic text-sm max-w-md">
          Porque el primer paso para tu sesión perfecta comienza aquí. Rellena el formulario o escríbeme directamente.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section-wrap relative bg-fixed" style="background: radial-gradient(circle at 10% 20%, rgba(188,149,54,0.18), transparent 40%), radial-gradient(circle at 90% 80%, rgba(188,149,54,0.12), transparent 40%), #0d0d0d;">
      <div class="page-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

        <!-- Form column -->
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">Envíame un mensaje</h2>
          <p class="text-[#9ca3af] text-sm mb-7 leading-relaxed">
            Cuéntame sobre tu sesión ideal y te respondo en menos de 24 horas.
          </p>
          <ContactForm />
        </div>

        <!-- Info column -->
        <div class="flex flex-col gap-8 sm:gap-10">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-6">Información de contacto</h2>
            <div class="flex flex-col gap-5">
              <div v-for="info in contactInfo" :key="info.label" class="flex gap-4 items-start">
                <div class="w-10 h-10 bg-[#bc9536]/10 border border-[#bc9536]/30 flex items-center justify-center shrink-0 text-[#bc9536]">
                  <!-- Lucide component si existe, SVG inline para marcas -->
                  <component v-if="info.iconComponent" :is="info.iconComponent" :size="18" :stroke-width="1.5" />
                  <span v-else v-html="info.svgIcon"></span>
                </div>
                <div>
                  <p class="text-[#9ca3af] text-[0.7rem] tracking-wide uppercase mb-0.5">{{ info.label }}</p>
                  <a v-if="info.href" :href="info.href" target="_blank"
                    class="text-[#f4f4f9] text-sm hover:text-[#bc9536] transition-colors">
                    {{ info.value }}
                  </a>
                  <p v-else class="text-[#f4f4f9] text-sm">{{ info.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social -->
          <div>
            <h3 class="text-white font-semibold mb-4 text-[0.7rem] tracking-widest uppercase">Sígueme en redes</h3>
            <div class="flex gap-3">
              <a
                v-for="social in socials"
                :key="social.label"
                :href="social.href"
                :aria-label="social.label"
                target="_blank"
                rel="noopener noreferrer"
                class="social-btn"
              >
                <component v-if="social.iconComponent" :is="social.iconComponent" :size="20" :stroke-width="1.5" />
                <span v-else v-html="social.svgIcon"></span>
              </a>
            </div>
          </div>

          <!-- FAQ -->
          <div>
            <h3 class="text-white font-semibold mb-4 text-[0.7rem] tracking-widest uppercase">Preguntas frecuentes</h3>
            <div class="flex flex-col gap-2">
              <details v-for="faq in faqs" :key="faq.q" class="faq-item group">
                <summary class="faq-summary">
                  {{ faq.q }}
                  <span class="faq-arrow">▸</span>
                </summary>
                <p class="faq-answer">{{ faq.a }}</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ContactForm from '../components/ContactForm.vue'
import { MapPin, Clock } from 'lucide-vue-next'

const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))


// WhatsApp — path oficial de Simple Icons (espaciado equilibrado)
const WA_SVG = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`
const IG_SVG = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.63-2.63a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76Z"/></svg>`

const contactInfo = [
  {
    label: 'WhatsApp',
    iconComponent: null,
    svgIcon: WA_SVG,
    value: '+52 (55) 5075-1396',
    href: 'https://wa.me/5215550751396',
  },
  {
    label: 'Instagram',
    iconComponent: null,
    svgIcon: IG_SVG,
    value: '@hevca_photoart',
    href: 'https://instagram.com/hevca_photoart',
  },
  {
    label: 'Ubicación',
    iconComponent: MapPin,   // ← Lucide
    svgIcon: null,
    value: 'Ciudad de México, México',
    href: null,
  },
  {
    label: 'Horario de atención',
    iconComponent: Clock,    // ← Lucide
    svgIcon: null,
    value: 'Lunes a Sábado, 9:00 – 19:00 hrs',
    href: null,
  },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/hevca_photoart',
    iconComponent: null,
    svgIcon: IG_SVG,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/5215550751396',
    iconComponent: null,
    svgIcon: WA_SVG,
  },
]

const faqs = [
  { q: '¿Cómo reservo mi sesión?',         a: 'Escríbeme por este formulario o por WhatsApp. Te respondo en menos de 24 horas para coordinar fecha, locación y detalles.' },
  { q: '¿Cuánto tiempo tardas en entregar?', a: 'Dependiendo del paquete, entre 3 y 7 días hábiles. Las ediciones se suben a una galería privada online.' },
  { q: '¿Trabajas fuera de CDMX?',          a: 'Sí, con previa planeación puedo desplazarme a otras ciudades o estados. Contáctame para coordinar costos de traslado.' },
  { q: '¿Se requiere anticipo?',            a: 'Sí, se solicita un anticipo del 30% para confirmar la fecha. El resto se liquida el día de la sesión.' },
]
</script>

<style scoped>
.social-btn {
  width: 42px;
  height: 42px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s ease;
}
.social-btn:hover { border-color: #bc9536; color: #bc9536; transform: translateY(-2px); }

.faq-item {
  border: 1px solid #2a2a2a;
  background: #1a1a1a;
  transition: border-color 0.2s;
}
.faq-item[open] { border-color: #bc9536; }
.faq-summary {
  padding: 0.9rem 1rem;
  font-size: 0.82rem;
  color: #f4f4f9;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: color 0.2s;
}
.faq-summary:hover { color: #bc9536; }
.faq-summary::-webkit-details-marker { display: none; }
.faq-arrow { font-size: 0.75rem; color: #bc9536; transition: transform 0.2s; flex-shrink: 0; }
details[open] .faq-arrow { transform: rotate(90deg); }
.faq-answer {
  padding: 0 1rem 0.9rem;
  font-size: 0.82rem;
  color: #9ca3af;
  line-height: 1.75;
  border-top: 1px solid #2a2a2a;
  margin-top: 0;
  padding-top: 0.75rem;
}
</style>
