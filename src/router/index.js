// router/index.js — Configuración de rutas con vue-router
import { createRouter, createWebHistory } from 'vue-router'

import LoginView    from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView  from '../views/ProductView.vue'
import UserView     from '../views/UserView.vue'

const routes = [
  // Ruta raíz redirige al login
  { path: '/', redirect: '/login' },

  // Vista de login (pública)
  { path: '/login', name: 'Login', component: LoginView },

  // Dashboard con protección y vistas hijas
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    beforeEnter: (to, from, next) => {
      // Navigation guard: verifica sesión activa en sessionStorage
      if (!sessionStorage.getItem('loggedIn')) {
        next('/login')
      } else {
        next()
      }
    },
    children: [
      { path: '', redirect: '/dashboard/productos' },
      { path: 'productos', name: 'Productos', component: ProductView },
      { path: 'usuarios',  name: 'Usuarios',  component: UserView   },
    ]
  },

  // Cualquier ruta desconocida va al login
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
