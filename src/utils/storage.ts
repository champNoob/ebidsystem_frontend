const TOKEN_KEY = 'ebidsystem_token'
const USER_KEY = 'ebidsystem_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserToken(): any | null {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setUserToken(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUserToken(): void {
  localStorage.removeItem(USER_KEY)
}
