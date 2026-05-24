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

const routes = [
  { path: '/',          redirect: '/inicio' },
  { path: '/inicio',    component: HomeView,     name: 'home' },
  { path: '/galeria',   component: GalleryView,  name: 'galeria' },
  { path: '/servicios', component: ServicesView, name: 'servicios' },
  { path: '/sobre-mi',  component: AboutView,    name: 'sobre-mi' },
  { path: '/contacto',  component: ContactView,  name: 'contacto' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    
    // Si la ruta destino tiene un hash
    if (to.hash) {
      // Bloqueamos los hashes problemáticos para que no lancen el warning CSS
      if (to.hash === '#' || to.hash === '#/') {
        return { top: 0 } 
      }
      
      // Para anchors reales (ej: #contacto), hacemos scroll suave
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Siempre volver arriba de todo instantáneamente al cambiar de ruta
    return { top: 0 }
  }

})

export default router
createApp(App).use(router).use(VueMasonry).mount('#app')
