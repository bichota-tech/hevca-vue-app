<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative overflow-hidden bg-fixed bg-center bg-cover" style="min-height: 500px; display:flex; align-items:flex-end; background-image: url('/multimedia/comercial2.jpg');">
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
      <div class="relative z-10 page-container pb-10 pt-24 text-left">
        <span class="section-label" style="text-align:left;">Lo que ofrezco</span>
        <div class="w-fit">
          <h1 class="font-black text-white leading-tight" style="font-size: clamp(2rem, 5vw, 4rem);">
            Servicios Profesionales
          </h1>
          <div class="h-[3px] bg-[#bc9536] my-4 transition-all duration-[150ms] ease-out" :style="{ width: `clamp(3rem, 3rem + ${scrollY * 0.6}px, 100%)` }"></div>
        </div>
        <p class="text-white/60 italic text-sm max-w-md">
          Sesiones de fotografía diseñadas para contar tu historia con autenticidad y arte.
        </p>
      </div>
    </section>

    <!-- Service Details -->
    <section class="section-wrap bg-[#0d0d0d]">
      <div class="page-container flex flex-col gap-16 sm:gap-20 lg:gap-28">
        <div
          v-for="(svc, i) in services"
          :key="svc.title"
          class="flex flex-col lg:flex-row items-center gap-8 lg:gap-14"
          :class="{ 'lg:flex-row-reverse': i % 2 !== 0 }"
        >
          <div class="w-full lg:w-1/2 overflow-hidden shrink-0">
            <img :src="svc.img" :alt="svc.title"
              class="w-full h-64 sm:h-80 object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy" />
          </div>
          <div class="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4">
            <span class="section-label" style="text-align:left;">{{ svc.tag }}</span>
            <h2 class="text-2xl sm:text-3xl font-bold text-white">{{ svc.title }}</h2>
            <p class="text-[#9ca3af] leading-relaxed text-sm">{{ svc.desc }}</p>
            <ul class="flex flex-col gap-2 mt-1">
              <li v-for="item in svc.includes" :key="item" class="flex items-start gap-2 text-[0.82rem] text-[#f4f4f9]/80">
                <span class="text-[#bc9536] font-bold mt-0.5 shrink-0">✓</span>
                {{ item }}
              </li>
            </ul>
            <div class="mt-4">
              <RouterLink to="/contacto" class="btn-gold text-[0.72rem]">AGENDAR ESTA SESIÓN</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="section-wrap relative overflow-hidden bg-fixed bg-center bg-cover" style="background-image: url('/multimedia/artistico1.jpg');">
      <div class="absolute inset-0 bg-black/85"></div>
      <div class="page-container relative z-10">
        <span class="section-label">Inversión</span>
        <h2 class="section-title">Paquetes y <span>Precios</span></h2>
        <p class="section-subtitle">Inversión transparente para cada etapa de tu proyecto</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            class="pricing-card flex flex-col"
            :class="{ 'pricing-featured': pkg.featured }"
          >
            <div v-if="pkg.featured" class="text-center text-[0.65rem] text-[#0d0d0d] font-bold bg-[#bc9536] py-2 tracking-widest uppercase">
              MÁS POPULAR
            </div>
            <!-- Padding generoso en el contenido de cada tarjeta -->
            <div class="px-7 py-8 flex flex-col gap-5 flex-1">
              <div>
                <p class="text-[#bc9536] text-[0.7rem] tracking-widest uppercase font-semibold mb-1">{{ pkg.name }}</p>
                <div class="flex items-end gap-1">
                  <span class="text-3xl sm:text-4xl font-black text-white">{{ pkg.price }}</span>
                  <span class="text-[#9ca3af] text-sm mb-1">MXN</span>
                </div>
                <p class="text-[#9ca3af] text-sm italic mt-1">{{ pkg.tagline }}</p>
              </div>
              <ul class="flex flex-col gap-3 flex-1">
                <li v-for="feat in pkg.features" :key="feat" class="flex gap-2 text-[0.82rem]">
                  <span class="text-[#bc9536] font-bold shrink-0 mt-0.5">✓</span>
                  <span class="text-[#f4f4f9]/80">{{ feat }}</span>
                </li>
              </ul>
              <!-- Botón centrado -->
              <div class="flex justify-center mt-4">
                <RouterLink
                  to="/contacto"
                  :class="pkg.featured ? 'btn-gold text-[0.72rem]' : 'btn-outline-gold text-[0.72rem]'"
                >
                  SOLICITAR SESIÓN
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <p class="rule-price text-center text-[#9ca3af] text-xs mt-10 italic">
          * Los precios son orientativos. Contáctame para un presupuesto personalizado.
        </p>
      </div>
    </section>

    <!-- CTA Bottom — completamente centrado -->
    <section class="section-wrap relative overflow-hidden border-y border-[#bc9536]/20 bg-fixed" style="background: radial-gradient(circle at center, rgba(188,149,54,0.12) 0%, rgba(13,13,13,1) 100%);">
      <div class="page-container flex flex-col items-center text-center gap-6">
        <h2 class="section-title">¿Tienes dudas sobre qué sesión <span>elegir</span>?</h2>
        <p class="text-[#9ca3af] italic max-w-md text-sm leading-relaxed">
          Escríbeme y con gusto te oriento. Juntas encontramos la sesión perfecta para ti.
        </p>
        <!-- Botones en fila centrada -->
        <div class="flex flex-wrap sm:flex-row gap-4 items-center justify-center">
          <RouterLink to="/contacto" class="btn-gold">AGENDAR SESIÓN</RouterLink>
          <!-- WhatsApp: icono + texto en la misma fila -->
          <a
            href="https://wa.me/5215550751396"
            target="_blank"
            class="btn-outline-gold flex flex-row items-center gap-2"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WHATSAPP DIRECTO
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const services = [
  {
    tag: 'Para empresas y profesionales',
    title: 'Retrato Corporativo',
    img: '/multimedia/corporativo1.jpg',
    desc: 'Tu imagen profesional es tu carta de presentación. Sesiones diseñadas para directivos, emprendedores y equipos de trabajo que quieren proyectar confianza, liderazgo y autenticidad en LinkedIn, sitios web y materiales de marca.',
    includes: [
      'Asesoría previa sobre vestuario y locación',
      'Sesión de 2 horas en locación o estudio',
      'Edición profesional de imágenes seleccionadas',
      'Entrega en formatos para web y redes sociales',
      'Licencia de uso comercial incluida',
    ],
  },
  {
    tag: 'Para marcas y e-commerce',
    title: 'Fotografía Comercial',
    img: '/multimedia/comercial1.jpg',
    desc: 'Imágenes que venden. Fotografía de producto, lifestyle y marca pensada para tiendas en línea, catálogos digitales y campañas publicitarias. Convierte visitantes en clientes con imágenes que enamoran.',
    includes: [
      'Shooting completo de producto o servicio',
      'Dirección de arte y estilismo de fondo incluido',
      'Variaciones de ángulos y composición',
      'Retoque avanzado y corrección de color',
      'Pack de imágenes listas para publicar',
    ],
  },
  {
    tag: 'Arte íntimo y personal',
    title: 'Boudoir & Artístico',
    img: '/multimedia/artistico1.jpg',
    desc: 'Celebra tu cuerpo, tu historia y tu poder. Las sesiones boudoir y artísticas son un espacio seguro para explorar tu feminidad con elegancia. Un regalo poderoso para ti misma o para quien más amas.',
    includes: [
      'Consulta privada previa sin compromiso',
      'Sesión íntima de 3 horas en locación acordada',
      'Maquillaje y estilismo (consultar disponibilidad)',
      'Album digital premium con selección curada',
      'Confidencialidad y discreción absoluta',
    ],
  },
  {
    tag: 'Momentos que perduran',
    title: 'Eventos & Sesiones Especiales',
    img: '/multimedia/familiar1.jpg',
    desc: 'Bodas, XV años, baby showers, newborn, sesiones familiares e infantiles. Capturamos la emoción de cada instante con una mirada artística que trasciende el tiempo. Cada foto es un recuerdo para siempre.',
    includes: [
      'Cobertura completa del evento o sesión',
      'Fotógrafa dedicada exclusivamente a ti',
      'Galería privada online para selección',
      'Disco duro con todas las fotos editadas',
      'Álbum físico premium (paquetes premium)',
    ],
  },
]

const packages = [
  {
    name: 'Paquete Básico',
    price: '$2,500',
    tagline: 'Perfecto para iniciarte',
    featured: false,
    features: [
      '1 hora de sesión fotográfica',
      '15 fotografías editadas digitalmente',
      '1 locación a elegir',
      'Entrega en 7 días hábiles',
      'Uso personal de las imágenes',
    ],
  },
  {
    name: 'Paquete Premium',
    price: '$5,500',
    tagline: 'Nuestra propuesta estrella',
    featured: true,
    features: [
      '2.5 horas de sesión fotográfica',
      '35 fotografías editadas profesionalmente',
      'Hasta 2 locaciones o cambios de vestuario',
      'Dirección de arte personalizada',
      'Entrega en 5 días hábiles',
      'Licencia de uso comercial',
    ],
  },
  {
    name: 'Paquete VIP',
    price: '$9,800',
    tagline: 'Experiencia completa e ilimitada',
    featured: false,
    features: [
      'Sesión full day (hasta 5 horas)',
      '60+ fotografías en alta resolución',
      'Scouting de locación personalizado',
      'Maquillaje y estilismo incluido',
      'Álbum físico de lujo 30×30 cm',
      'Entrega express en 3 días hábiles',
      'Licencia de uso ilimitado',
    ],
  },
]
</script>

<style scoped>
.pricing-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease, border-color 0.3s ease;
  padding: 1rem;
}
.pricing-card:hover { border-color: #bc9536; transform: translateY(-4px); }
.pricing-featured { border-color: #bc9536; }
@media (min-width: 768px) {
  .pricing-featured { transform: scale(1.03); }
  .pricing-featured:hover { transform: scale(1.03) translateY(-4px); }
}
.rule-price{padding-block:2rem;}
</style>
