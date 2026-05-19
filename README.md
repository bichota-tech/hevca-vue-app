# HEVCA Photo & Art - Portafolio Profesional

![Vue](https://img.shields.io/badge/Vue.js-3.5.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-5.23-F46B45?style=for-the-badge&logo=sanity&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-Custom-blue?style=for-the-badge)

**🔗 Sitio en vivo:** [hevca-vue-app.vercel.app](https://hevca-vue-app.vercel.app)

---

## 📌 Descripción del Proyecto

**HEVCA Photo & Art** es el portafolio profesional de fotografía y arte de Grettel Hevia Cárdenas. Este proyecto representa una evolución significativa desde el sitio original alojado en GitHub Pages hacia una **Single Page Application (SPA)** moderna, escalable, dinámica y de alto rendimiento.

### Transformación Tecnológica

La arquitectura ha evolucionado desde un enfoque tradicional de HTML/CSS/JavaScript plano con Bootstrap hacia un stack moderno basado en:

- **Vue 3** con Composition API para una gestión de estado reactiva y elegante
- **Vite** como bundler ultrarrápido
- **Tailwind CSS v4** para un diseño utility-first moderno y responsivo
- **Sanity CMS** para gestión de contenido en tiempo real
- **GSAP** para animaciones fluidas y profesionales
- **Masonry Layout** para exhibición elegante de galerías fotográficas

---

## ✨ Características Principales

- 🎨 **Experiencia SPA Fluida:** Navegación instantánea sin recargas de página gracias a `vue-router`
- 📱 **Diseño Totalmente Responsivo:** Desde dispositivos móviles hasta pantallas Ultra HD, usando Tailwind CSS v4
- 🎬 **Animaciones Profesionales:** Integración de GSAP para efectos visuales suave y de alto rendimiento
- 🎯 **Contenido Dinámico:** Integración con Sanity CMS para gestión de contenido flexible
- 🎭 **Iconografía Moderna:** Icons profesionales con `lucide-vue-next`
- 🏗️ **Arquitectura Escalable:** Componentes Vue reutilizables y composables organizados
- ⚡ **Rendimiento Optimizado:** Build optimizado con Vite, lazy loading y code splitting
- 🖼️ **Galerías Elegantes:** Masonry layout automático para presentación de portafolios fotográficos

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Vue 3** | 3.5.0 | Framework progresivo principal |
| **Vue Router** | 4.3.0 | Enrutamiento y navegación SPA |
| **Vite** | 6.0 | Build tool ultrarrápido |
| **Tailwind CSS** | 4.0 | Framework CSS utility-first |
| **@tailwindcss/vite** | 4.0.0 | Integración Tailwind con Vite |

### Contenido & Datos
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Sanity CMS** | 5.23.0 | Gestión de contenido headless |
| **@sanity/client** | 7.22.0 | Cliente para consultas Sanity |
| **@sanity/image-url** | 2.1.1 | Optimización de imágenes Sanity |

### Animaciones & UI
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **GSAP** | 3.15.0 | Animaciones avanzadas |
| **Lucide Vue Next** | 1.0.0 | Sistema de iconos moderno |
| **vue3-masonry-css** | 1.0.8 | Layout masonry responsivo |

### Dev Tools
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **@vitejs/plugin-vue** | 5.0.0 | Plugin Vue para Vite |
| **TypeScript** | 5.8 | Tipado estático (en Sanity Studio) |
| **ESLint** | 9.28 | Linting de código |

---

## 🚀 Guía de Instalación y Desarrollo

### 1️⃣ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0.0 o superior ([descargar](https://nodejs.org/))
- **npm** 9.0.0 o superior (incluido con Node.js)
- **Git** ([descargar](https://git-scm.com/))

Verifica las versiones:
```bash
node --version  # v18.x.x o superior
npm --version   # 9.x.x o superior
```

### 2️⃣ Clonar el Repositorio

```bash
git clone https://github.com/bichota-tech/hevca-vue-app.git
cd hevca-vue-app
```

### 3️⃣ Instalar Dependencias

```bash
npm install
```

### 4️⃣ Configurar Variables de Entorno (Opcional)

Si vas a utilizar Sanity CMS, crea un archivo `.env.local`:

```bash
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

### 5️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en **`http://localhost:5173/`** (o el puerto que Vite asigne).

---

## 📦 Scripts Disponibles

### Desarrollo
```bash
npm run dev
```
Inicia el servidor de desarrollo local con **Hot Module Replacement (HMR)** para una experiencia de desarrollo ágil.

### Compilación para Producción
```bash
npm run build
```
Compila la aplicación y la optimiza para producción. Los archivos compilados se guardan en la carpeta `dist/`.

### Preview de Build
```bash
npm run preview
```
Inicia un servidor local para previsualizar el build de producción localmente antes de desplegar.

### Sanity CMS (Carpeta `hevca/`)
```bash
# Dentro de la carpeta hevca/
cd hevca

npm run dev      # Inicia Sanity Studio en desarrollo
npm run build    # Compila el studio
npm run deploy   # Despliega los cambios al CMS
npm run start    # Inicia el studio compilado
```

---

## 📁 Estructura del Proyecto

```
hevca-vue-app/
│
├── 📁 public/                    # Assets estáticos globales (favicon, metadata)
│
├── 📁 src/                       # Código fuente principal de la aplicación Vue
│   ├── 📁 components/            # Componentes reutilizables
│   │   ├── Header.vue
│   │   ├── Navigation.vue
│   │   ├── Footer.vue
│   │   ├── GalleryCard.vue
│   │   └── ... otros componentes
│   │
│   ├── 📁 composables/           # Lógica reutilizable (Composition API)
│   │   ├── useSanityClient.js    # Hook para conexión con Sanity
│   │   ├── useAnimation.js       # Hook para animaciones GSAP
│   │   └── ... otros composables
│   │
│   ├── 📁 views/                 # Vistas principales (páginas)
│   │   ├── Home.vue
│   │   ├── Gallery.vue
│   │   ├── About.vue
│   │   └── ... otras vistas
│   │
│   ├── 📁 router/                # Configuración de Vue Router
│   │   └── index.js
│   │
│   ├── 📄 App.vue                # Componente raíz de la aplicación
│   ├── 📄 main.js                # Punto de entrada de la aplicación
│   └── 📄 style.css              # Estilos globales y Tailwind config
│
├── 📁 hevca/                     # Sanity CMS Studio
│   ├── 📁 schemaTypes/           # Definiciones de esquemas (documentos, campos)
│   ├── 📁 structure/             # Configuración de la estructura del studio
│   ├── 📄 package.json
│   └── 📄 sanity.config.ts
│
├── 📄 index.html                 # Plantilla HTML principal
├── 📄 package.json               # Dependencias y scripts npm
├── 📄 package-lock.json          # Lock file de dependencias
├── 📄 vite.config.js             # Configuración de Vite
├── 📄 tailwind.config.js         # Configuración de Tailwind CSS
├── 📄 vercel.json                # Configuración de despliegue en Vercel
├── 📄 .gitignore                 # Archivos ignorados por Git
├── 📄 LICENSE                    # Licencia del proyecto
└── 📄 README.md                  # Este archivo
```

---

## 🔄 Flujo de Trabajo

### Desarrollo Local
1. Inicia el servidor con `npm run dev`
2. Los cambios se reflejan automáticamente en el navegador
3. Abre `http://localhost:5173` para ver los cambios

### Actualizar Contenido (Sanity CMS)
1. Navega a la carpeta `hevca/`: `cd hevca`
2. Inicia el studio: `npm run dev`
3. Accede a `http://localhost:3333` para editar contenido
4. Los cambios se sincronizan automáticamente con la aplicación

### Despliegue a Producción
1. Realiza los cambios localmente y pruébalos con `npm run preview`
2. Commit y push a la rama main: `git push origin main`
3. Vercel despliega automáticamente (está configurado con el repositorio)
4. Monitorea el despliegue en [vercel.com](https://vercel.com)

---

## 🌐 Despliegue & Hosting

### Vercel (Actual)
El proyecto está desplegado automáticamente en **[Vercel](https://vercel.com)** desde la rama `main`.

**Características:**
- ✅ Despliegue automático en cada push a main
- ✅ Certificado SSL incluido
- ✅ CDN global para máximo rendimiento
- ✅ Previsualizaciones de pull requests

**URL en vivo:** [hevca-vue-app.vercel.app](https://hevca-vue-app.vercel.app)

### Variables de Entorno en Vercel
Configura en los settings de tu proyecto en Vercel:

```
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

---

## 🐛 Resolución de Problemas

### Puerto 5173 ya está en uso
```bash
npm run dev -- --port 3000
```

### Caché de módulos dañada
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Sanity Client no conecta
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que tu proyecto Sanity esté activo
- Comprueba que el dataset existe en tu proyecto

### Build falla en producción
1. Ejecuta `npm run build` localmente para verificar
2. Revisa los logs de Vercel
3. Asegúrate de que todas las variables de entorno están configuradas

---

## 📚 Recursos Útiles

- 🔗 [Documentación Vue 3](https://vuejs.org/)
- 🔗 [Documentación Vue Router](https://router.vuejs.org/)
- 🔗 [Documentación Vite](https://vitejs.dev/)
- 🔗 [Documentación Tailwind CSS](https://tailwindcss.com/)
- 🔗 [Documentación Sanity](https://www.sanity.io/docs/)
- 🔗 [Documentación GSAP](https://gsap.com/)
- 🔗 [Documentación Vercel](https://vercel.com/docs)

---

## 🤝 Contribuciones

Este es un proyecto personal, pero si encontras bugs o tienes sugerencias, siéntete libre de abrir un **issue** o **pull request**.

### Pasos para Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/amazing-feature`
3. Commit tus cambios: `git commit -m 'Add some amazing feature'`
4. Push a la rama: `git push origin feature/amazing-feature`
5. Abre un Pull Request

---

## 📜 Licencia

Este proyecto está bajo una **licencia personalizada**. Todos los derechos reservados © 2026 **HEVCA Photo & Art** - Grettel Hevia Cárdenas.

Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## 👤 Créditos

**Desarrollado por:** [bichota-tech](https://github.com/bichota-tech)

**Portafolio para:** Grettel Hevia Cárdenas - HEVCA Photo & Art

**Última actualización:** Mayo 2026

---

## 📊 Estado del Proyecto

| Aspecto | Estado |
|--------|--------|
| Desarrollo | ✅ Activo |
| Pruebas | 🔄 En progreso |
| Documentación | ✅ Actualizada |
| Despliegue | ✅ Automático en Vercel |
| Issues Abiertos | 0 |

---

¿Preguntas o necesitas ayuda? Abre un issue o contacta a través de la página de HEVCA Photo & Art.

Happy coding! 🚀✨
