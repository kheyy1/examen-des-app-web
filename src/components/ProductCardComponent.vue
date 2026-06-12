<!-- ProductCardComponent.vue — Tarjeta individual de producto -->
<template>
  <div class="product-card h-100">
    <img :src="producto.img" :alt="producto.nombre" />
    <div class="p-3">
      <span class="badge badge-categoria mb-2">{{ producto.categoria }}</span>
      <h6 class="fw-bold mb-1" style="color: var(--cafe-primary);">{{ producto.nombre }}</h6>
      <p class="small mb-2" style="color: var(--cafe-text-soft);">{{ producto.descripcion }}</p>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="fw-bold" style="color: var(--cafe-primary);">
          ${{ producto.precio.toLocaleString('es-CO') }}
        </span>
        <span class="small text-muted">
          <i class="bi bi-archive me-1"></i>Stock: {{ producto.stock }}
        </span>
      </div>
      <div class="d-flex gap-2 mt-3">
        <!-- Emite el evento "editar" con el producto hacia el componente padre -->
        <button class="btn btn-sm btn-cafe flex-fill" @click="$emit('editar', producto)">
          <i class="bi bi-pencil me-1"></i>Editar
        </button>
        <!-- Emite el evento "eliminar" con el ID del producto -->
        <button class="btn btn-sm btn-outline-danger flex-fill" @click="$emit('eliminar', producto.id)">
          <i class="bi bi-trash me-1"></i>Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props: el componente padre le pasa un objeto producto
defineProps({
  producto: {
    type: Object,
    required: true
  }
})

// Eventos que este componente puede emitir hacia el padre
defineEmits(['editar', 'eliminar'])
</script>
