<template>
  <div>
    <!-- Hero Carousel -->
    <HeroCarousel />

    <!-- Intro Strip -->
    <section class="section-wrap relative overflow-hidden bg-fixed" style="background: radial-gradient(ellipse at top, rgba(188,149,54,0.08) 0%, rgba(13,13,13,1) 80%);">
      <div class="page-container relative z-10 text-center flex flex-col items-center justify-center">
        <span class="section-label">Bienvenida a HEVCA Photo & Art</span>
        <h2 class="section-title max-w-2xl mx-auto">
          Fotografía que captura<br><span>tu historia verdadera</span>
        </h2>
        <div class="gold-line"></div>
        <p class="section-subtitle">
          En HEVCA Photo &amp; Art creamos imágenes que trascienden el tiempo. Desde retratos corporativos
          hasta sesiones artísticas íntimas, cada disparo refleja tu esencia con luz, emoción y detalle.
        </p>
      </div>
    </section>

    <!-- Servicios -->
    <section class="section-wrap bg-[#111111]" id="servicios">
      <div class="page-container">
        <span class="section-label">Lo que ofrezco</span>
        <h2 class="section-title"><span>Servicios</span> Profesionales</h2>
        <p class="section-subtitle">Adaptados a empresas, profesionales y proyectos personales en México</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          <div v-for="svc in services" :key="svc.title" class="service-card group gap-2">
            <div class="overflow-hidden h-52 w-full">
              <img
                :src="svc.img"
                :alt="svc.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <!-- Padding interno de la card -->
            <div class="cardtest p-6 flex flex-col gap-3 flex-1">
              <h3 class="text-white font-bold text-base leading-snug text-center">{{ svc.title }}</h3>
              <p class="text-[#9ca3af] text-[0.82rem] leading-relaxed flex-1 text-center">{{ svc.desc }}</p>
              <div class="flex justify-center mt-6">
                <RouterLink to="/servicios" class="btn-outline-gold text-[0.72rem]">Más Información</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mini Galería -->
    <section class="section-wrap bg-[#0d0d0d]">
      <div class="page-container">
        <span class="section-label">Portafolio</span>
        <h2 class="section-title">Visita la <span>Galería</span></h2>
        <p class="section-subtitle">Una muestra de sesiones recientes</p>

        <div v-if="featured.length" class="xsgalery grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <div
            v-for="(img, i) in featured"
            :key="i"
            class="overflow-hidden cursor-pointer group aspect-square"
            @click="openLb(i)"
          >
            <img
              :src="img.jpg || img.webp"
              :alt="img.alt"
              class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
              loading="lazy"
            />
          </div>
        </div>
        <div v-else class="h-48 flex items-center justify-center text-[#9ca3af] text-sm">
          Cargando imágenes…
        </div>

        <!-- Espacio explícito entre imágenes y botón -->
        <div class="flex justify-center mt-10">
          <RouterLink to="/galeria" class="btn-gold">VER GALERÍA COMPLETA</RouterLink>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="section-wrap relative overflow-hidden bg-fixed bg-center bg-cover" style="background-image: url('/multimedia/comercial2.jpg');">
      <!-- Capa oscura superior para no perder legibilidad (Parallax overlay) -->
      <div class="absolute inset-0 bg-black/85"></div>
      
      <div class="page-container relative z-10">
        <span class="section-label">Clientes satisfechos</span>
        <h2 class="section-title">Confían en <span>Nosotros</span></h2>
        <div class="gold-line"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="t in testimonials"
            :key="t.name"
            class="cardtest text-center flex flex-col items-center gap-5 px-8 py-8 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#bc9536]/40 transition-colors"
          >
            <img
              :src="t.img" :alt="t.name"
              class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-2 border-[#bc9536]"
              loading="lazy"
            />
            <p class="text-[#f4f4f9]/80 italic text-sm leading-relaxed flex-1">"{{ t.quote }}"</p>
            <div>
              <p class="text-[#bc9536] text-xs font-semibold tracking-wide">{{ t.name }}</p>
              <p class="text-[#9ca3af] text-xs mt-0.5">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Mini -->
    <section class="relative overflow-hidden pt-[220px] pb-16 md:py-24 flex items-center min-h-[500px]">
      <div class="absolute inset-0">
        <img src="/multimedia/corporativo1.jpg" alt="Grettel Hevia Cárdenas" class="w-full h-full object-cover md:object-[30%_center]" />
        <!-- Mobile: oscuro abajo, transparente arriba. Desktop: oscuro a la derecha, transparente a la izquierda -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/90 to-black/20 md:bg-gradient-to-l md:from-[#0d0d0d] md:via-[#0d0d0d]/90 md:to-transparent"></div>
      </div>
      <div class="page-container relative z-10 w-full flex flex-col md:flex-row md:justify-end items-center">
        <!-- Contenedor del texto a la derecha -->
        <div class="w-full md:w-1/2 lg:w-5/12 flex flex-col gap-4 items-center md:items-start text-center md:text-left mt-32 md:mt-0">
          <span class="text-[#bc9536] font-bold text-center md:text-left w-full">Detrás del lente</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-white">Grettel Hevia Cárdenas</h2>
          <p class="text-[#9ca3af] leading-relaxed text-sm">
            Fotógrafa profesional establecida en Ciudad de México con más de 8 años de experiencia capturando
            momentos que perduran. Su trabajo combina técnica depurada con una sensibilidad artística única,
            creando imágenes que conectan emocionalmente con cada cliente.
          </p>
          <RouterLink to="/sobre-mi" class="btn-outline-gold mt-2">CONOCE MI HISTORIA</RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Final — centrado -->
    <section class="section-wrap relative overflow-hidden border-y border-[#bc9536]/20 bg-fixed" style="background: radial-gradient(circle at center, rgba(188,149,54,0.12) 0%, rgba(13,13,13,1) 100%);">
      <div class="page-container relative z-10 flex flex-col items-center text-center gap-6">
        <span class="section-label">¿Lista?</span>
        <h2 class="section-title">¿Lista para tu <span>sesión</span>?</h2>
        <p class="text-[#9ca3af] italic max-w-lg text-sm leading-relaxed">
          El primer paso para tu foto perfecta comienza aquí. Contáctame y juntas lo planeamos.
        </p>
        <RouterLink to="/contacto" class="btn-gold mt-2">AGENDA TU SESIÓN AHORA</RouterLink>
      </div>
    </section>

    <!-- Lightbox -->
    <LightboxModal
      v-model="lbOpen"
      :image="featured[lbIndex]"
      @prev="lbIndex = (lbIndex - 1 + featured.length) % featured.length"
      @next="lbIndex = (lbIndex + 1) % featured.length"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeroCarousel from '../components/HeroCarousel.vue'
import LightboxModal from '../components/LightboxModal.vue'
import { useGallery } from '../composables/useGallery.js'

const { load, getFeatured } = useGallery()
const featured = ref([])
const lbOpen  = ref(false)
const lbIndex = ref(0)

const openLb = (i) => { lbIndex.value = i; lbOpen.value = true }

const services = [
  { img: '/multimedia/corporativo1.jpg', title: 'Retrato Corporativo',  desc: 'Proyecta una imagen auténtica y profesional en redes sociales y sitios web. Ideal para empresas, emprendedores y directivos.' },
  { img: '/multimedia/comercial1.jpg',   title: 'Fotografía Comercial', desc: 'Imágenes atractivas que impulsan ventas y destacan tus productos en e-commerce y campañas de marketing.' },
  { img: '/multimedia/artistico1.jpg',   title: 'Boudoir & Artístico',  desc: 'Celebra tu belleza y confianza a través del arte y la elegancia. Un regalo único para ti o para quien más amas.' },
  { img: '/multimedia/familiar1.jpg',    title: 'Eventos & Especiales', desc: 'Bodas, XV años, baby showers, newborn… inmortalizamos los momentos más importantes de tu vida.' },
]

const testimonials = [
  { img: '/multimedia/cliente1.jpg', quote: 'Gracias a HEVCA logramos una imagen corporativa que refuerza nuestra marca al 100%.', name: 'Ana Gómez',    role: 'Directora de Marketing' },
  { img: '/multimedia/cliente2.jpg', quote: 'Profesionalismo y creatividad en cada toma. Las fotos de mis modelos son espectaculares.',  name: 'Jorge Torres', role: 'Coordinador de Agencia' },
  { img: '/multimedia/cliente3.jpg', quote: 'Las fotos de mi bebé son un tesoro. Grettel tiene un talento extraordinario.',              name: 'Marta Pérez',  role: 'Madre y Asesora Comercial' },
]

onMounted(async () => {
  await load()
  featured.value = getFeatured(4)
})
</script>

<style scoped>
.service-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s, transform 0.3s;
}
.service-card:hover {
  border-color: #bc9536;
  transform: translateY(-4px);
}
.xsgalery {
  margin-bottom: 2rem;
}
.cardtest {
  padding:.5rem;
}
</style>
