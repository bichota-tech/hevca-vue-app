<template>
  <!-- Lightbox overlay -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="$emit('update:modelValue', false)"
        role="dialog"
        :aria-hidden="!modelValue"
        aria-label="Visor de imagen"
      >
        <!-- Close -->
        <button
          @click="$emit('update:modelValue', false)"
          class="absolute top-5 right-6 text-white/70 hover:text-[#bc9536] text-3xl font-light transition-colors z-10"
          aria-label="Cerrar"
        >&times;</button>

        <!-- Prev -->
        <button @click="$emit('prev')" class="lb-nav-btn left-4" aria-label="Anterior">&#10094;</button>

        <!-- Image -->
        <div class="lb-img-wrap">
          <Transition name="img-fade" mode="out-in">
            <img
              v-if="image"
              :key="image.jpg || image.webp"
              :src="image.jpg || image.webp || image.avif"
              :alt="image.alt || ''"
              class="max-h-[85vh] max-w-[90vw] object-contain rounded"
              loading="lazy"
            />
          </Transition>
        </div>

        <!-- Next -->
        <button @click="$emit('next')" class="lb-nav-btn right-4" aria-label="Siguiente">&#10095;</button>

        <!-- Caption -->
        <p v-if="image?.alt" class="absolute bottom-5 text-center text-white/60 text-sm italic w-full px-4">
          {{ image.alt }}
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  image: Object,
})
const emit = defineEmits(['update:modelValue', 'prev', 'next'])

const handleKey = (e) => {
  if (!props.modelValue) return
  if (e.key === 'Escape') emit('update:modelValue', false)
  if (e.key === 'ArrowLeft') emit('prev')
  if (e.key === 'ArrowRight') emit('next')
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => window.removeEventListener('keydown', handleKey))
</script>

<style scoped>
.lb-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 48px;
  height: 48px;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  border-radius: 50%;
  z-index: 10;
}
.lb-nav-btn:hover { background: rgba(188,149,54,0.8); }

.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.3s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }

.img-fade-enter-active, .img-fade-leave-active { transition: opacity 0.2s ease; }
.img-fade-enter-from, .img-fade-leave-to { opacity: 0; }
</style>
