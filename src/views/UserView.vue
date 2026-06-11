<!-- UserView.vue — Gestión de usuarios con CRUD completo contra MockAPI -->
<template>
  <div>

    <!-- Alerta de retroalimentación -->
    <div v-if="alerta.visible"
      :class="`alert alert-${alerta.tipo} alert-dismissible d-flex align-items-center fade show`"
      role="alert">
      <i :class="`bi bi-${alerta.tipo === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2`"></i>
      <span>{{ alerta.mensaje }}</span>
      <button type="button" class="btn-close" @click="alerta.visible = false"></button>
    </div>

    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-0" style="color:var(--cafe-primary);">
          <i class="bi bi-people-fill me-2"></i>Usuarios
        </h3>
        <p class="text-muted small mb-0">Administración de usuarios del sistema</p>
      </div>
      <button class="btn btn-cafe" @click="abrirModalCrear">
        <i class="bi bi-person-plus-fill me-1"></i>Nuevo usuario
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="row g-2 mb-4">
      <div class="col-md-6">
        <input v-model="busqueda" type="text" class="form-control" placeholder="🔍 Buscar usuario..." />
      </div>
    </div>

    <!-- Spinner de carga -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border" style="color:var(--cafe-secondary);"></div>
      <p class="mt-2 text-muted small">Cargando usuarios...</p>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="card border-0 shadow-sm">
      <div class="table-responsive">
        <table class="table table-cafe table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="usuariosFiltrados.length === 0">
              <td colspan="6" class="text-center py-4 text-muted">
                <i class="bi bi-people fs-3 d-block mb-2"></i>
                No se encontraron usuarios.
              </td>
            </tr>
            <tr v-for="(usuario, index) in usuariosFiltrados" :key="usuario.id">
              <td class="align-middle text-muted small">{{ index + 1 }}</td>
              <td class="align-middle">
                <!-- Avatar con iniciales -->
                <div class="d-flex align-items-center gap-2">
                  <div class="user-avatar">{{ iniciales(usuario.nombre) }}</div>
                  <span class="fw-semibold" style="color:var(--cafe-primary);">{{ usuario.nombre }}</span>
                </div>
              </td>
              <td class="align-middle">
                <span class="badge bg-secondary">{{ usuario.usuario }}</span>
              </td>
              <td class="align-middle small text-muted">{{ usuario.email }}</td>
              <td class="align-middle">
                <span :class="`badge ${usuario.rol === 'admin' ? 'bg-danger' : 'badge-categoria'}`">
                  {{ usuario.rol || 'usuario' }}
                </span>
              </td>
              <td class="align-middle text-center">
                <button class="btn btn-sm btn-cafe me-1" @click="abrirModalEditar(usuario)" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmarEliminar(usuario)" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── MODAL CREAR / EDITAR ─────────────────────────────────── -->
    <div v-if="mostrarModal" class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius:16px; border:1px solid var(--cafe-border);">
          <div class="modal-header" style="background:var(--cafe-primary);">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-person-fill me-2"></i>
              {{ modoEdicion ? 'Editar usuario' : 'Nuevo usuario' }}
            </h5>
            <button class="btn-close btn-close-white" @click="cerrarModal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Nombre completo</label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Ej: Juan Pérez" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Usuario</label>
              <input v-model="form.usuario" type="text" class="form-control" placeholder="Ej: jperez" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Contraseña</label>
              <input v-model="form.password" type="password" class="form-control" placeholder="••••••••" />
              <div v-if="modoEdicion" class="form-text text-muted">Deja en blanco para no cambiar la contraseña.</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Email</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="correo@ejemplo.com" />
            </div>
            <div class="mb-2">
              <label class="form-label fw-bold small text-uppercase" style="color:var(--cafe-secondary);">Rol</label>
              <select v-model="form.rol" class="form-select">
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <!-- Alerta de validación interna -->
            <div v-if="errorForm" class="alert alert-warning py-2 mt-3 small">
              <i class="bi bi-exclamation-triangle me-1"></i>{{ errorForm }}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="cerrarModal" :disabled="guardando">Cancelar</button>
            <button class="btn btn-cafe" @click="guardarUsuario" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-check-lg me-1"></i>
              {{ modoEdicion ? 'Guardar cambios' : 'Crear usuario' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MODAL CONFIRMAR ELIMINAR ─────────────────────────────── -->
    <div v-if="mostrarModalEliminar" class="modal d-block" tabindex="-1" style="background:rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content" style="border-radius:16px;">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-x-fill me-2"></i>Eliminar usuario
            </h5>
          </div>
          <div class="modal-body text-center py-4">
            <p class="mb-1">¿Seguro que quieres eliminar a</p>
            <strong style="color:var(--cafe-primary);">{{ usuarioAEliminar?.nombre }}</strong>?
            <p class="text-muted small mt-2 mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-outline-secondary" @click="mostrarModalEliminar = false" :disabled="guardando">Cancelar</button>
            <button class="btn btn-danger" @click="ejecutarEliminar" :disabled="guardando">
              <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUsers, addUser, updateUser, deleteUser } from '../services/userService.js'

// ── Estado reactivo ──────────────────────────────────────────
const usuarios             = ref([])
const busqueda             = ref('')
const mostrarModal         = ref(false)
const mostrarModalEliminar = ref(false)
const modoEdicion          = ref(false)
const errorForm            = ref('')
const usuarioAEliminar     = ref(null)
const cargando             = ref(false)
const guardando            = ref(false)

const alerta = ref({ visible: false, tipo: 'success', mensaje: '' })

function mostrarAlerta(tipo, mensaje) {
  alerta.value = { visible: true, tipo, mensaje }
  setTimeout(() => { alerta.value.visible = false }, 3000)
}

// Formulario reactivo
const form = ref({ id: null, nombre: '', usuario: '', password: '', email: '', rol: 'usuario' })

// ── Computed ─────────────────────────────────────────────────
const usuariosFiltrados = computed(() =>
  usuarios.value.filter(u =>
    u.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// Genera las iniciales del nombre para el avatar
function iniciales(nombre) {
  if (!nombre) return '?'
  return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

// ── Ciclo de vida ─────────────────────────────────────────────
onMounted(cargarUsuarios)

async function cargarUsuarios() {
  cargando.value = true
  try {
    usuarios.value = await getUsers()
  } catch {
    mostrarAlerta('danger', 'Error al cargar los usuarios. Verifica la URL de MockAPI.')
  } finally {
    cargando.value = false
  }
}

// ── Métodos CRUD ─────────────────────────────────────────────
function abrirModalCrear() {
  modoEdicion.value = false
  errorForm.value   = ''
  form.value = { id: null, nombre: '', usuario: '', password: '', email: '', rol: 'usuario' }
  mostrarModal.value = true
}

function abrirModalEditar(usuario) {
  modoEdicion.value = true
  errorForm.value   = ''
  form.value = { ...usuario, password: '' } // No mostramos la contraseña al editar
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  errorForm.value    = ''
}

async function guardarUsuario() {
  // Validaciones
  if (!form.value.nombre?.trim())   { errorForm.value = 'El nombre es obligatorio.'; return }
  if (!form.value.usuario?.trim())  { errorForm.value = 'El nombre de usuario es obligatorio.'; return }
  if (!modoEdicion.value && !form.value.password?.trim()) {
    errorForm.value = 'La contraseña es obligatoria al crear un usuario.'; return
  }

  guardando.value = true
  try {
    // Si está en edición y la contraseña está vacía, no la enviamos
    const payload = { ...form.value }
    if (modoEdicion.value && !payload.password) delete payload.password

    if (modoEdicion.value) {
      // UPDATE en MockAPI
      const actualizado = await updateUser(payload)
      const idx = usuarios.value.findIndex(u => u.id === actualizado.id)
      if (idx !== -1) usuarios.value[idx] = actualizado
      mostrarAlerta('success', `✔ Usuario "${actualizado.nombre}" actualizado correctamente.`)
    } else {
      // CREATE en MockAPI
      const nuevo = await addUser(payload)
      usuarios.value.push(nuevo)
      mostrarAlerta('success', `✔ Usuario "${nuevo.nombre}" creado correctamente.`)
    }
    cerrarModal()
  } catch {
    mostrarAlerta('danger', 'Error al guardar el usuario. Intenta nuevamente.')
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(usuario) {
  usuarioAEliminar.value    = usuario
  mostrarModalEliminar.value = true
}

async function ejecutarEliminar() {
  guardando.value = true
  try {
    await deleteUser(usuarioAEliminar.value.id)
    usuarios.value = usuarios.value.filter(u => u.id !== usuarioAEliminar.value.id)
    mostrarAlerta('success', `🗑 Usuario "${usuarioAEliminar.value.nombre}" eliminado.`)
    mostrarModalEliminar.value = false
    usuarioAEliminar.value     = null
  } catch {
    mostrarAlerta('danger', 'Error al eliminar el usuario.')
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
/* Avatar circular con iniciales */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--cafe-accent);
  color: var(--cafe-primary);
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
