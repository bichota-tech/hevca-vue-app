<template>
  <footer class="bg-[#0d0d0d] border-t border-[#2a2a2a] mt-24">

    <!-- Grid: 2 columnas en móvil → 3 en desktop -->
    <div class="page-container py-12 md:py-16 flex flex-wrap justify-between items-start gap-5">

      <!-- ── FILA 1: Logo + Tagline (ocupa las 2 cols en móvil, 1 en desktop) ── -->
      <div class="flex flex-row items-start gap-5">

        <!-- Logo (izquierda) -->
        <RouterLink to="/" class="shrink-0" aria-label="Inicio HEVCA">
          <img
            src="/multimedia/logo_hevca1.png"
            alt="HEVCA Photo & Art"
            class="h-11 sm:h-14 w-auto object-contain"
          />
        </RouterLink>

        <!-- Tagline + socials (derecha del logo) -->
        <div class="flex flex-col gap-3">
          <p class="text-[#9ca3af] text-xs sm:text-sm leading-relaxed italic">
            Capturando lo que las<br class="hidden sm:block"> palabras no pueden decir.<br>
            Ciudad de México, México.
          </p>
          <!-- Redes sociales debajo de la frase -->
          <div class="flex gap-2">
            <a
              href="http://instagram.com/hevca_photoart"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              class="social-icon-btn"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm4.25 3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.63-2.63a.88.88 0 1 1 0 1.76.88.88 0 0 1 0-1.76Z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/5215550751396"
              target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp"
              class="social-icon-btn"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- ── FILA 2 col 1 en móvil / col 2 en desktop: Menú ── -->
      <div class="menufoot">
        <h6 class="text-[#bc9536] text-[0.68rem] tracking-widest uppercase font-semibold mb-4">Menú</h6>
        <ul class="flex flex-col gap-2.5">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink :to="link.to" class="text-[#9ca3af] text-xs sm:text-sm hover:text-[#bc9536] transition-colors">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- ── FILA 2 col 2 en móvil / col 3 en desktop: Legal ── -->
      <div>
        <h6 class="text-[#bc9536] text-[0.68rem] tracking-widest uppercase font-semibold mb-4">Legal</h6>
        <ul class="flex flex-col gap-2.5">
          <li><a href="#" class="text-[#9ca3af] text-xs sm:text-sm hover:text-[#bc9536] transition-colors">Términos y Condiciones</a></li>
          <li><a href="#" class="text-[#9ca3af] text-xs sm:text-sm hover:text-[#bc9536] transition-colors">Política de Privacidad</a></li>
          <li><a href="#" class="text-[#9ca3af] text-xs sm:text-sm hover:text-[#bc9536] transition-colors">Afiliados</a></li>
        </ul>
      </div>

    </div>

    <!-- Copyright -->
    <div class="linefoot border-t border-[#1a1a1a] py-4 text-center">
      <p class="text-[#9ca3af] text-xs">
        &copy; 2025 HEVCA Photo &amp; Art. Todos los derechos reservados.
        Desarrollado por
        <a href="http://github.com/bichota-tech" target="_blank" class="text-[#bc9536] font-semibold hover:underline">ACMA</a>.
      </p>
    </div>
  </footer>
</template>

<script setup>
const navLinks = [
  { to: '/',          label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/galeria',   label: 'Galería' },
  { to: '/sobre-mi',  label: 'Sobre Mí' },
  { to: '/contacto',  label: 'Contacto' },
]
</script>

<style scoped>
.social-icon-btn {
  width: 34px;
  height: 34px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.social-icon-btn:hover {
  border-color: #bc9536;
  color: #bc9536;
}
.menufoot{
  margin-left: 2rem;
}
.linefoot{
  padding: .4rem;
}

</style>
