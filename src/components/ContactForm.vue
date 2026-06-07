<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5" novalidate>
    <!-- Nombre -->
    <div class="relative">
      <label class="form-label" for="contact-name">
        Nombre completo <span class="required-mark">*</span>
      </label>
      <input
        id="contact-name"
        v-model="form.name"
        type="text"
        name="Nombre cliente"
        placeholder="Nombre completo"
        required
        class="form-input"
        :class="{ 'border-red-500': errors.name }"
        aria-required="true"
      />
      <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div class="relative">
      <label class="form-label" for="contact-email">
        Correo electrónico <span class="required-mark">*</span>
      </label>
      <input
        id="contact-email"
        v-model="form.email"
        type="email"
        name="Email"
        placeholder="Correo electrónico"
        required
        autocomplete="email"
        class="form-input"
        :class="{ 'border-red-500': errors.email }"
        aria-required="true"
      />
      <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
    </div>

    <!-- Servicio -->
    <div>
      <label class="form-label" for="contact-service">
        Servicio deseado <span class="required-mark">*</span>
      </label>
      <select id="contact-service" v-model="form.service" name="Servicio" required class="form-input" :class="{ 'border-red-500': errors.service }" aria-required="true">
        <option value="" disabled>Selecciona la sesión que te ha gustado</option>
        <option v-for="opt in serviceOptions" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <p v-if="errors.service" class="text-red-400 text-xs mt-1">{{ errors.service }}</p>
    </div>

    <!-- Mensaje -->
    <div>
      <textarea
        v-model="form.message"
        name="Mensaje"
        rows="5"
        placeholder="Escribe tu mensaje o cuéntame sobre la sesión que deseas…"
        class="form-input resize-none"
      ></textarea>
    </div>

    <!-- Honeypot (Anti-spam) -->
    <div class="hidden" aria-hidden="true">
      <input v-model="form.botcheck" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" />
    </div>

    <!-- Submit -->

    <button
      type="submit"
      :disabled="sending"
      class="btn-gold w-full flex items-center justify-center gap-2 text-sm"
    >
      <span v-if="sending">Enviando…</span>
      <span v-else>✉ Enviar Mensaje</span>
    </button>

    <!-- Feedback -->
    <Transition name="fade">
      <div v-if="success" class="bg-green-500/15 border border-green-500/40 text-green-400 text-sm text-center py-3 rounded">
        ✅ ¡Mensaje enviado con éxito! Te contactaré pronto.
      </div>
      <div v-else-if="serverError" class="bg-red-500/15 border border-red-500/40 text-red-400 text-sm text-center py-3 rounded">
        ❌ {{ errorMessage || 'Hubo un error. Inténtalo de nuevo o escríbeme por WhatsApp.' }}
      </div>
    </Transition>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ name: '', email: '', service: '', message: '', botcheck: false })
const errors = reactive({})
const sending = ref(false)
const success = ref(false)
const serverError = ref(false)
const errorMessage = ref('')

const serviceOptions = [
  'Retrato Corporativo',
  'Fotografía Comercial',
  'Boudoir & Artístico',
  'Evento & Especiales',
  'Sesión Familiar',
  'Sesión Infantil',
  'Sesión Newborn',
]

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.name.trim())  errors.name    = 'Por favor escribe tu nombre.'
  if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Introduce un correo válido.'
  if (!form.service)      errors.service = 'Selecciona una sesión.'
  return !Object.keys(errors).length
}

const handleSubmit = async () => {
  if (form.botcheck) return // Es un bot
  if (!validate()) return

  sending.value = true
  success.value = false
  serverError.value = false

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        service: form.service,
        message: form.message,
        botcheck: form.botcheck,
      })
    })
    const data = await res.json()

    if (data.success) {
      success.value = true
      Object.assign(form, { name: '', email: '', service: '', message: '' })
      return
    }

    if (data.errors) {
      Object.assign(errors, data.errors)
      serverError.value = false
      errorMessage.value = ''
    } else {
      serverError.value = true
      errorMessage.value = data.error || data.message || 'Hubo un error al enviar el formulario.'
    }
  } catch {
    serverError.value = true
    errorMessage.value = 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #f4f4f9;
}

.required-mark {
  color: #bc9536;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #f4f4f9;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.form-input::placeholder { color: #9ca3af; }
.form-input:focus { border-color: #bc9536; }
.form-input option { background: #1a1a1a; color: #f4f4f9; }
</style>
