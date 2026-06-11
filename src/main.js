// main.js — Punto de entrada de la aplicación Vue
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

// Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos globales propios
import './assets/main.css'

createApp(App).use(router).mount('#app')
