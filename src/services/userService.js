// services/userService.js — CRUD de usuarios contra MockAPI

const BASE_URL = 'https://6a29de33f59cb8f65f1dad1f.mockapi.io/usuarios'


export async function getUsers() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}


export async function loginUser(usuario, password) {
  const users = await getUsers()
  return users.find(u => u.usuario === usuario && u.password === password) || null
}


export async function addUser(user) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!res.ok) throw new Error('Error al crear usuario')
  return res.json()
}


export async function updateUser(user) {
  const res = await fetch(`${BASE_URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  if (!res.ok) throw new Error('Error al actualizar usuario')
  return res.json()
}


export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar usuario')
}
