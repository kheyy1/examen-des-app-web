// services/productService.js — CRUD de productos contra MockAPI
// Reemplaza el antiguo servicio basado en localStorage

const BASE_URL = 'https://6a29de33f59cb8f65f1dad1f.mockapi.io/productos'


export async function getProducts() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}


export async function addProduct(product) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}


export async function updateProduct(product) {
  const res = await fetch(`${BASE_URL}/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}


export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar producto')
}
