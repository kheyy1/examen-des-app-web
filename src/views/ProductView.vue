<!-- ProductView.vue — Gestión de productos con CRUD completo -->
<!-- Usa localStorage para simular una base de datos -->
<template>
  <div>
    <!-- Encabezado de la sección -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-0" style="color: var(--cafe-primary);">
          <i class="bi bi-box-seam me-2"></i>Productos
        </h3>
        <p class="text-muted small mb-0">Gestión del inventario de Café Aroma</p>
      </div>
      <button class="btn btn-cafe" @click="abrirModalCrear">
        <i class="bi bi-plus-lg me-1"></i>Nuevo producto
      </button>
    </div>

    <!-- Barra de búsqueda y filtro -->
    <div class="row g-2 mb-4">
      <div class="col-md-6">
        <input
          v-model="busqueda"
          type="text"
          class="form-control"
          placeholder="🔍 Buscar producto..."
        />
      </div>
      <div class="col-md-4">
        <select v-model="filtroCategoria" class="form-select">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-cafe table-hover mb-0">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="productosFiltrados.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                No se encontraron productos.
              </td>
            </tr>
            <tr v-for="producto in productosFiltrados" :key="producto.id">
              <td>
                <img :src="producto.img" :alt="producto.nombre"
                  style="height:48px; width:48px; object-fit:contain; border-radius:8px;
                         background: linear-gradient(135deg,#f5e6d0,#ecdbb8); padding:4px;" />
              </td>
              <td class="fw-semibold align-middle" style="color:var(--cafe-primary);">
                {{ producto.nombre }}
              </td>
              <td class="align-middle">
                <span class="badge badge-categoria">{{ producto.categoria }}</span>
              </td>
              <td class="align-middle fw-bold">${{ producto.precio.toLocaleString('es-CO') }}</td>
              <td class="align-middle">
                <span :class="producto.stock < 20 ? 'text-danger fw-bold' : 'text-success fw-bold'">
                  {{ producto.stock }}
                </span>
              </td>
              <td class="align-middle text-center">
                <button class="btn btn-sm btn-cafe me-1" @click="abrirModalEditar(producto)"
                  title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmarEliminar(producto)"
                  title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Cards de productos -->
    <h5 class="fw-bold mt-5 mb-3" style="color: var(--cafe-primary);">
      <i class="bi bi-grid me-2"></i>Vista en tarjetas
    </h5>
    <div class="row g-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="producto in productosFiltrados" :key="'card-'+producto.id">
        <ProductCardComponent
          :producto="producto"
          @editar="abrirModalEditar"
          @eliminar="confirmarEliminar"
        />
      </div>
    </div>

    <!-- ── MODAL CREAR / EDITAR ─────────────────────────────── -->
    <div v-if="mostrarModal" class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius:16px; border: 1px solid var(--cafe-border);">
          <div class="modal-header" style="background: var(--cafe-primary);">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-box-seam me-2"></i>
              {{ modoEdicion ? 'Editar producto' : 'Nuevo producto' }}
            </h5>
            <button class="btn-close btn-close-white" @click="cerrarModal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Nombre</label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Nombre del producto" />
            </div>
            <div class="row g-2 mb-3">
              <div class="col">
                <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Precio</label>
                <input v-model.number="form.precio" type="number" class="form-control" placeholder="0" />
              </div>
              <div class="col">
                <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Stock</label>
                <input v-model.number="form.stock" type="number" class="form-control" placeholder="0" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Categoría</label>
              <select v-model="form.categoria" class="form-select">
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                <option value="Otra">Otra</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="2" placeholder="Descripción breve"></textarea>
            </div>
            <div class="mb-2">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">URL Imagen</label>
              <input v-model="form.img" type="text" class="form-control" placeholder="https://..." />
            </div>

            <!-- Alerta de validación -->
            <div v-if="errorForm" class="alert alert-warning py-2 mt-2 small">
              <i class="bi bi-exclamation-triangle me-1"></i>{{ errorForm }}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="cerrarModal">Cancelar</button>
            <button class="btn btn-cafe" @click="guardarProducto">
              <i class="bi bi-check-lg me-1"></i>{{ modoEdicion ? 'Guardar cambios' : 'Crear producto' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MODAL CONFIRMAR ELIMINAR ────────────────────────── -->
    <div v-if="mostrarModalEliminar" class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" style="border-radius:16px;">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-trash me-2"></i>Eliminar producto
            </h5>
          </div>
          <div class="modal-body text-center py-4">
            <p class="mb-1">¿Seguro que quieres eliminar</p>
            <strong style="color:var(--cafe-primary);">{{ productoAEliminar?.nombre }}</strong>
            <p class="text-muted small mt-2 mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-outline-secondary" @click="mostrarModalEliminar = false">Cancelar</button>
            <button class="btn btn-danger" @click="ejecutarEliminar">
              <i class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCardComponent from '../components/ProductCardComponent.vue'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService.js'

// ── Estado reactivo ──────────────────────────────────────────
const productos            = ref([])   // lista completa de productos
const busqueda             = ref('')   // texto de búsqueda
const filtroCategoria      = ref('')   // categoría seleccionada en el filtro
const mostrarModal         = ref(false)
const mostrarModalEliminar = ref(false)
const modoEdicion          = ref(false)
const errorForm            = ref('')
const productoAEliminar    = ref(null)

// Formulario reactivo para crear/editar
const form = ref({
  id: null,
  nombre: '',
  precio: 0,
  stock: 0,
  categoria: '',
  descripcion: '',
  img: ''
})

// ── Computed ─────────────────────────────────────────────────

// Lista de categorías únicas para el filtro
const categorias = computed(() => {
  const cats = (productos.value ?? []).map(p => p.categoria)
  return [...new Set(cats)]
})

// Productos filtrados por búsqueda y categoría
const productosFiltrados = computed(() => {
  return (productos.value ?? []).filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = filtroCategoria.value === '' || p.categoria === filtroCategoria.value
    return coincideNombre && coincideCategoria
  })
})

// ── Ciclo de vida ─────────────────────────────────────────────
onMounted(async () => {
  // Carga los productos al montar el componente
  const data = await getProducts()
  productos.value = Array.isArray(data) ? data : []
})

// ── Métodos CRUD ─────────────────────────────────────────────

function abrirModalCrear() {
  modoEdicion.value = false
  errorForm.value   = ''
  form.value = { id: null, nombre: '', precio: 0, stock: 0, categoria: '', descripcion: '', img: '' }
  mostrarModal.value = true
}

function abrirModalEditar(producto) {
  modoEdicion.value = true
  errorForm.value   = ''
  // Copia los datos del producto al formulario
  form.value = { ...producto }
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  errorForm.value    = ''
}

async function guardarProducto() {
  // Validación básica
  if (!form.value.nombre.trim()) {
    errorForm.value = 'El nombre es obligatorio.'
    return
  }
  if (form.value.precio <= 0) {
    errorForm.value = 'El precio debe ser mayor a cero.'
    return
  }

  let resultado
  if (modoEdicion.value) {
    // UPDATE: actualiza el producto existente
    resultado = await updateProduct(form.value)
  } else {
    // CREATE: agrega un producto nuevo
    resultado = await addProduct(form.value)
  }

  // Si el servicio devuelve la lista completa actualizada, la usamos.
  if (Array.isArray(resultado)) {
    productos.value = resultado
  } else {
    const data = await getProducts()
    productos.value = Array.isArray(data) ? data : []
  }

  cerrarModal()
}

function confirmarEliminar(productoOId) {
  // Acepta tanto un objeto producto como un ID directamente
  if (typeof productoOId === 'object') {
    productoAEliminar.value = productoOId
  } else {
    productoAEliminar.value = productos.value.find(p => p.id === productoOId)
  }
  mostrarModalEliminar.value = true
}

async function ejecutarEliminar() {
  // DELETE: elimina el producto por ID
  const resultado = await deleteProduct(productoAEliminar.value.id)

  if (Array.isArray(resultado)) {
    productos.value = resultado
  } else {
    const data = await getProducts()
    productos.value = Array.isArray(data) ? data : []
  }

  mostrarModalEliminar.value = false
  productoAEliminar.value    = null
}
</script> 