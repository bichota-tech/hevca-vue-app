import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import VueMasonry from 'vue3-masonry-css'

// Views (all lazy-loaded for optimal bundle splitting)
const HomeView     = () => import('./views/HomeView.vue')
const GalleryView  = () => import('./views/GalleryView.vue')
const ServicesView = () => import('./views/ServicesView.vue')
const AboutView    = () => import('./views/AboutView.vue')
const ContactView  = () => import('./views/ContactView.vue')
const NotFound     = () => import('./views/NotFound.vue')

const routes = [
  { path: '/',          
    component: HomeView,     
    name: 'home',
    meta: {
      title: 'HEVCA Photo & Art | Fotografía profesional',
      description:
        'Fotografía profesional en México. Sesiones corporativas, comerciales, boudoir, eventos y newborn.'
    }
  },
  { path: '/galeria',   
    component: GalleryView,  
    name: 'galeria',
    meta: {
      title: 'Galería | HEVCA Photo & Art',
      description: 'Descubre nuestra colección de trabajos fotográficos en diferentes estilos y temáticas.'
    }
  },
  { path: '/servicios', 
    component: ServicesView, 
    name: 'servicios', 
    meta: { 
      title: 'Servicios | HEVCA Photo & Art',
      description: 'Sesiones corporativas, comerciales, boudoir, eventos y newborn en México.'
     } 
  },
  { path: '/sobre-mi',  
    component: AboutView,    
    name: 'sobre-mi', 
    meta: { 
      title: 'Sobre Mí | HEVCA Photo & Art', 
      description: 'Conoce más sobre HEVCA y su enfoque en la fotografía.' 
    } 
  },
  { path: '/contacto',  
    component: ContactView,  
    name: 'contacto', 
    meta: { 
      title: 'Contacto | HEVCA Photo & Art', 
      description: 'Contáctanos para más información sobre nuestros servicios.' 
    } 
  },
  { path: '/:pathMatch(.*)*', 
    name: 'not-found',
    component: NotFound,
    meta: {
      title: '404 No Encontrado | HEVCA Photo & Art',
      description: 'Página no encontrada.',
      hideFooter: true // Ocultar el footer en la pagina 404
    }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    // Atrás/adelante navegador
    if (savedPosition) {
      return savedPosition
    }

    // Hashes inválidos
    if (to.hash === '#' || to.hash === '#/') {
      return { top: 0 }
    }

    // Anchors reales
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    // Cambio normal de ruta:
    // mostrar nueva vista ya arriba
    return {
      top: 0,
      left: 0
    }
  }
})

router.beforeEach((to) => {
  document.title =
    to.meta.title || 'HEVCA Photo & Art'

  const description =
    document.querySelector(
      'meta[name="description"]'
    )

  if (description) {
    description.setAttribute(
      'content',
      to.meta.description ||
      'Fotografía profesional en México.'
    )
  }
})

export default router
createApp(App).use(router).use(VueMasonry).mount('#app')
