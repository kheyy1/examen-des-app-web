<!-- SidebarComponent.vue — Menú lateral con rutas disponibles -->
<template>
  <div class="sidebar px-2">
    <p class="text-uppercase fw-bold px-2 mb-3"
      style="font-size:0.7rem; color:var(--cafe-accent); letter-spacing:0.1em;">
      Menú
    </p>
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/dashboard/productos" class="nav-link" active-class="active">
          <i class="bi bi-box-seam"></i> Productos
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/dashboard/usuarios" class="nav-link" active-class="active">
          <i class="bi bi-people-fill"></i> Usuarios
        </router-link>
      </li>
    </ul>

    <hr style="border-color:var(--cafe-border);" />

    <p class="text-uppercase fw-bold px-2 mb-2"
      style="font-size:0.7rem; color:var(--cafe-accent); letter-spacing:0.1em;">
      Info
    </p>
    <ul class="nav flex-column">
      <li class="nav-item">
        <span class="nav-link" style="cursor:default;">
          <i class="bi bi-geo-alt"></i> Bogotá, Colombia
        </span>
      </li>
      <li class="nav-item">
        <span class="nav-link" style="cursor:default;">
          <i class="bi bi-clock"></i> Lun–Vie 7am–8pm
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
// SidebarComponent: los enlaces usan router-link para navegación SPA sin recarga.
</script>
