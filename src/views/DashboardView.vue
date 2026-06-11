<!-- DashboardView.vue — Vista principal del dashboard -->
<!-- Contiene Navbar, Sidebar, el área de vistas hijas (router-view) y Footer -->
<template>
  <div class="d-flex flex-column min-vh-100">

    <!-- Navbar superior — recibe el nombre del usuario como prop -->
    <NavbarComponent :usuario="usuarioActivo" />

    <div class="d-flex flex-grow-1">

      <!-- Sidebar izquierdo -->
      <div style="width:220px; flex-shrink:0;">
        <SidebarComponent />
      </div>

      <!-- Área principal donde se renderizan las vistas hijas -->
      <main class="flex-grow-1 p-4" style="background-color:var(--cafe-bg);">
        <router-view />
      </main>

    </div>

    <!-- Footer -->
    <FooterComponent />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavbarComponent  from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent  from '../components/FooterComponent.vue'

// Recupera el nombre del usuario desde sessionStorage para mostrarlo en el navbar
const usuarioActivo = ref(sessionStorage.getItem('usuarioActivo') || 'Admin')
</script>
