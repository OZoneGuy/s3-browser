import { hostname } from '../lib/utils'

export async function login(email: string, password: string) {
  await fetch(`${hostname()}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ username: email, password })
  })
}

export async function logout() {
  await fetch(`${hostname()}/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}

export async function isAuthenticated(): Promise<boolean> {
  const resp = await fetch(`${hostname()}/user`, {
    credentials: 'include'
  })
  return resp.status === 200
}
