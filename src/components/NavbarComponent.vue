<!-- NavbarComponent.vue — Barra de navegación superior -->
<!-- Muestra el logo, usuario activo y botón de cerrar sesión -->
<template>
  <nav class="navbar navbar-cafe navbar-expand-lg px-3">
    <span class="navbar-brand">
      <i class="bi bi-cup-hot-fill me-2"></i>Café Aroma
    </span>
    <div class="ms-auto d-flex align-items-center gap-3">
      <span class="text-warning fw-semibold small">
        <i class="bi bi-person-circle me-1"></i>{{ usuario }}
      </span>
      <button class="btn btn-outline-warning btn-sm rounded-pill" @click="cerrarSesion">
        <i class="bi bi-box-arrow-right me-1"></i>Salir
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Props: recibe el nombre del usuario logueado desde DashboardView
defineProps({
  usuario: { type: String, default: 'Admin' }
})

const router = useRouter()

// Elimina la sesión de sessionStorage y redirige al login
function cerrarSesion() {
  sessionStorage.removeItem('loggedIn')
  sessionStorage.removeItem('usuarioActivo')
  sessionStorage.removeItem('usuarioId')
  router.push('/login')
}
</script>
