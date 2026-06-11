<!-- FooterComponent.vue — Pie de página con derechos reservados -->
<template>
  <footer class="footer-cafe text-center py-3 mt-auto">
    <p class="mb-0">
      &copy; {{ anio }} Café Aroma. Todos los derechos reservados.
    </p>
    <p class="mb-0" style="opacity:0.5; font-size:0.8rem; font-style:italic;">
      Hecho con <i class="bi bi-cup-hot-fill"></i> y mucho amor por el buen café.
    </p>
  </footer>
</template>

<script setup>
// El año se calcula dinámicamente para que siempre sea el correcto
const anio = new Date().getFullYear()
</script>
