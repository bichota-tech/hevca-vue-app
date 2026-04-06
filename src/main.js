import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Views (lazy-loaded)
import HomeView from './views/HomeView.vue'
const GalleryView  = () => import('./views/GalleryView.vue')
const ServicesView = () => import('./views/ServicesView.vue')
const AboutView    = () => import('./views/AboutView.vue')
const ContactView  = () => import('./views/ContactView.vue')

const routes = [
  { path: '/',          component: HomeView,     name: 'home' },
  { path: '/galeria',   component: GalleryView,  name: 'galeria' },
  { path: '/servicios', component: ServicesView, name: 'servicios' },
  { path: '/sobre-mi',  component: AboutView,    name: 'sobre-mi' },
  { path: '/contacto',  component: ContactView,  name: 'contacto' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return saved || { top: 0 }
  }
})

createApp(App).use(router).mount('#app')
