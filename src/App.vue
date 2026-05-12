<template>
  <AppHeader />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </RouterView>
  </main>
  <AppFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useSiteSettings } from './composables/useSiteSettings.js'

const { load: loadSettings } = useSiteSettings()

onMounted(async () => {
  try {
    const settings = await loadSettings()
    if (settings) {
      if (settings.title) document.title = settings.title
      if (settings.description) {
        let meta = document.querySelector('meta[name="description"]')
        if (!meta) {
          meta = document.createElement('meta')
          meta.name = 'description'
          document.head.appendChild(meta)
        }
        meta.content = settings.description
      }
    }
  } catch (err) {
    console.error('Error applying global settings:', err)
  }
})
</script>

