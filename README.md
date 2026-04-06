# HEVCA Photo & Art - Profesional Portfolio

![Vue](https://img.shields.io/badge/Vue.js-3.5.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📌 Descripción del Proyecto

**HEVCA Photo & Art** es el portafolio profesional de fotografía de Grettel Hevia Cárdenas. Este proyecto es una versión modernizada y reimaginada del [sitio original alojado en GitHub Pages](https://bichota-tech.github.io/Galeria_Virtual/). 

La arquitectura ha evolucionado desde un enfoque tradicional de HTML/CSS/JavaScript plano con Bootstrap hacia una **Single Page Application (SPA)** escalable, rápida y dinámica construida con Vue 3 y Tailwind CSS.

### ✨ Características Principales
- **Experiencia SPA Fluida:** Navegación instantánea y sin recargas de página gracias a `vue-router`.
- **Diseño Moderno y Responsivo:** Construido bajo el enfoque "Utility-First" de Tailwind CSS v4, garantizando una excelente visualización desde dispositivos móviles hasta pantallas Ultra HD.
- **Iconografía Profesional:** Integración ágil de íconos con `lucide-vue-next`.
- **Componentización:** Organización del código en componentes Vue reutilizables para facilitar el mantenimiento y escalabilidad a futuro (ej. galerías dinámicas).

## 🛠️ Stack Tecnológico

- **Framework Core:** [Vue 3](https://vuejs.org/) (Composition API)
- **Enrutamiento:** [Vue Router 4](https://router.vuejs.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Íconos:** [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)

## 🚀 Instalación y Configuración Local

Sigue estos pasos para desplegar el proyecto localmente en tu entorno de desarrollo.

### 1. Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18+ recomendada) y `npm` (o `yarn` / `pnpm`).

### 2. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd hevca-vue-app
```

### 3. Instalar las dependencias
```bash
npm install
```

### 4. Lanzar el servidor de desarrollo
```bash
npm run dev
```
El servidor de desarrollo de Vite se iniciará, usualmente en `http://localhost:5173/`. Abre esta URL en tu navegador para ver la aplicación corriendo.

## 📦 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo local con Hot Module Replacement (HMR).
- `npm run build`: Compila la aplicación y la optimiza para producción en la carpeta `dist`.
- `npm run preview`: Inicia un servidor local para previsualizar los archivos de la compilación de producción generados con el comando anterior.

## 📁 Estructura del Proyecto

```text
hevca-vue-app/
├── public/               # Assets estáticos globales
├── src/
│   ├── components/       # Componentes reutilizables (Botones, Tarjetas, Navbars)
│   ├── composables/      # Lógica reutilizable de Vue (Composition API)
│   ├── views/            # Vistas principales de la aplicación (Home, About, Gallery, etc.)
│   ├── App.vue           # Componente raíz de la aplicación
│   ├── main.js           # Punto de entrada de la aplicación Vue
│   └── style.css         # Estilos globales y configuración de Tailwind
├── index.html            # Plantilla HTML principal
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
└── README.md             # Este archivo
```

## 🤝 Créditos
Desarrollado para HEVCA Photo & Art © 2025. Todos los derechos reservados.
