<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-fixed bg-center bg-cover" style="min-height: 500px; display:flex; align-items:flex-end; background-image: url('/multimedia/corporativo2.jpg');">
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30"></div>
      <div class="relative z-10 page-container pb-10 pt-24 text-left w-full">
        <span class="section-label" style="text-align:left;">La fotógrafa</span>
        <div class="w-fit">
          <h1 class="font-black text-white leading-tight" style="font-size: clamp(2rem, 5vw, 4rem);">
            Grettel Hevia Cárdenas
          </h1>
          <div class="h-[3px] bg-[#bc9536] my-4 transition-all duration-[150ms] ease-out" :style="{ width: `clamp(3rem, 3rem + ${scrollY * 0.6}px, 100%)` }"></div>
        </div>
        <p class="text-white/60 italic text-sm max-w-md">
          Capturando la esencia, luz y textura de cada persona a través del lente.
        </p>
      </div>
    </section>

    <!-- Floating Stats Banner -->
    <div class="section-wrap floating relative z-20 pb-4">
      <div class="page-container">
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 floating-banner">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="stats flex flex-col flex-1 min-w-[140px] items-center justify-center text-center p-4 sm:p-5 shadow-lg"
            style="background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light)); color: #0d0d0d; border-radius: 4px;"
          >
            <span class="font-black text-xl sm:text-2xl mb-1">{{ stat.value }}</span>
            <span class="text-xs font-semibold uppercase tracking-wider opacity-80">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bio -->
    <section class="section-wrap relative overflow-hidden pt-[220px] pb-16 lg:py-24">
      <div class="absolute inset-0">
        <img
          src="/multimedia/corporativo1.jpg"
          alt="Grettel Hevia Cárdenas"
          class="w-full h-full object-cover object-top lg:object-cover lg:aspect-auto lg:object-left mask-image-bio"
        />
        <!-- Degradado con acento dorado para fundir la imagen (arriba/izq) con el texto (abajo/der) -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#bc9536]/95 from-[25%] via-[#bc9536]/80 via-[40%] to-transparent to-[55%] lg:bg-gradient-to-l lg:from-[#bc9536]/95 lg:from-[45%] lg:via-[#bc9536]/50 lg:via-[55%] lg:to-transparent lg:to-[70%]"></div>
      </div>

      <div class="page-container relative z-10 w-full flex flex-col lg:flex-row lg:justify-end">
        <div class="w-full lg:w-1/2 flex flex-col items-start gap-8 mt-20 lg:mt-0">
          <div class="w-full lg:max-w-[95%] lg:pl-4">
            <span class="text-[#bc9536] lg:text-white font-bold text-left w-full block mb-2 uppercase tracking-wide text-xs drop-shadow-md lg:drop-shadow-none">Detrás del lente</span>
            <h2 class="text-3xl sm:text-4xl font-black text-[#bc9536] lg:text-white mb-6 text-left drop-shadow-md lg:drop-shadow-none">Mi historia con la fotografía</h2>
            <div class="textbio flex flex-col gap-4 text-black/90 font-medium leading-relaxed text-[0.95rem] text-left border-l-2 border-black/40 pl-4 py-1">
              <p>
                Todo comenzó con una cámara prestada y la certeza de que cada momento merece ser recordado con belleza.
                Desde niña, Grettel tuvo una sensibilidad especial para capturar la luz y la emoción en las personas,
                un don que perfeccionó durante años de estudio y práctica intensiva en fotografía artística y comercial.
              </p>
              <p>
                Establecida en Ciudad de México, hoy dirige
                <strong class="text-[#bc9536] lg:text-black font-black">HEVCA Photo &amp; Art</strong> con más de 8 años de experiencia
                trabajando con empresas, marcas personales, parejas y familias. Su estilo combina una técnica
                depurada con una mirada empática: el resultado son imágenes honestas, emotivas y visualmente impactantes.
              </p>
              <p>
                Cree firmemente que una buena fotografía no es solo una imagen perfectamente expuesta;
                es una conversación silenciosa entre la fotógrafa y quien la mira. Es ese instante de verdad
                que perdura décadas después.
              </p>
            </div>
          </div>

            <!-- Values — 2x2 en mobile, 3 en desktop -->
            <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-2">
              <div
                v-for="v in values"
                :key="v.title"
                class="value-card px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-3"
              >
                <component :is="v.icon" class="text-[#bc9536]" :size="32" :stroke-width="1.5" />
                <h3 class="text-white font-bold text-[0.85rem] sm:text-[0.9rem]">{{ v.title }}</h3>
                <p class="text-[#9ca3af] text-[0.75rem] sm:text-[0.8rem] leading-relaxed">{{ v.desc }}</p>
              </div>
            </div> <!-- Closes grid -->
          </div> <!-- Closes text column -->
        </div> <!-- Closes page-container -->
    </section>

    <!-- Skills — centradas -->
    <section class="section-wrap relative overflow-hidden bg-fixed bg-center bg-cover" style="background-image: url('/multimedia/corporativo2.jpg');">
      <div class="absolute inset-0 bg-black/85"></div>
      <div class="page-container relative z-10 flex flex-col items-center">
        <span class="section-label">Mi expertise</span>
        <h2 class="section-title">Especialidades & <span>Habilidades</span></h2>
        <div class="gold-line"></div>
        <!-- Barras centradas con ancho máximo -->
        <div class="w-full max-w-2xl flex flex-col gap-5 mt-2">
          <div v-for="sk in skills" :key="sk.name" class="flex flex-col gap-2">
            <div class="flex justify-between text-xs sm:text-sm">
              <span class="text-[#f4f4f9]">{{ sk.name }}</span>
              <span class="text-[#bc9536] font-semibold">{{ sk.level }}%</span>
            </div>
            <div class="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#bc9536] to-[#d4af52] rounded-full"
                :style="{ width: sk.level + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA — centrado -->
    <section class="section-wrap relative overflow-hidden border-y border-[#bc9536]/20 bg-fixed" style="background: radial-gradient(circle at center, rgba(188,149,54,0.12) 0%, rgba(13,13,13,1) 100%);">
      <div class="page-container flex flex-col items-center text-center gap-5">
        <h2 class="section-title">¿Quieres trabajar <span>juntas</span>?</h2>
        <p class="text-[#9ca3af] italic max-w-md text-sm leading-relaxed">
          Cuéntame sobre tu proyecto y hagamos algo extraordinario.
        </p>
        <RouterLink to="/contacto" class="btn-gold mt-2">CONTÁCTAME AHORA</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Target, Sparkles, Handshake } from 'lucide-vue-next'

const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))


const stats = [
  { label: 'Años de experiencia', value: '8+'           },
  { label: 'Sesiones realizadas',  value: '500+'         },
  { label: 'Clientes satisfechos', value: '98%'          },
  { label: 'Ubicación',            value: 'CDMX, México' },
]

const values = [
  {
    icon: Target,
    title: 'Autenticidad',
    desc: 'Fotografías que muestran la verdad de cada persona, sin poses forzadas ni clichés.',
  },
  {
    icon: Sparkles,
    title: 'Detalle y Luz',
    desc: 'La luz lo es todo. Domino la iluminación natural y artificial para crear atmósferas únicas.',
  },
  {
    icon: Handshake,
    title: 'Conexión',
    desc: 'Conozco a mis clientes, escucho sus historias y co-creamos juntas la sesión perfecta.',
  },
]

const skills = [
  { name: 'Fotografía Corporativa & Comercial', level: 95 },
  { name: 'Retrato Artístico & Boudoir',        level: 92 },
  { name: 'Fotografía de Eventos',              level: 90 },
  { name: 'Edición & Retoque Digital',          level: 88 },
  { name: 'Iluminación de Estudio',             level: 85 },
  { name: 'Fotografía Newborn & Familiar',      level: 89 },
]
</script>

<style scoped>
.value-card {
  padding: .5rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  transition: border-color 0.3s, transform 0.3s;
}
.value-card:hover { border-color: #bc9536; transform: translateY(-3px); }
.floating{
  padding-bottom: 1rem;
}
.floating-banner {
  /* Móvil: normalmente las estadísticas caen en 2 filas */
  margin-top: -4rem;
}
@media (min-width: 640px) {
  /* Tablet: 1 sola fila */
  .floating-banner {
    margin-top: -7.5rem;
    
  }
}
@media (min-width: 1024px) {
  /* Desktop */
  .floating-banner {
    margin-top: -9rem;
  }
}
.stats{
  padding-block: 2rem;
}
.textbio{
  padding-left:1rem;
}
.mask-image-bio {
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 35%);
  mask-image: linear-gradient(to top, transparent 0%, black 35%);
}
@media (min-width: 1024px) {
  .mask-image-bio {
    -webkit-mask-image: linear-gradient(to left, transparent 0%, transparent 20%, black 65%);
    mask-image: linear-gradient(to left, transparent 0%, transparent 20%, black 65%);
  }
}
</style>
