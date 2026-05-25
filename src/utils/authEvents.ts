export const AUTH_STATE_CLEARED_EVENT = 'ebidsystem:auth-cleared'

export function notifyAuthStateCleared(): void {
  window.dispatchEvent(new Event(AUTH_STATE_CLEARED_EVENT))
}

export function onAuthStateCleared(callback: () => void): () => void {
  window.addEventListener(AUTH_STATE_CLEARED_EVENT, callback)
  return () => window.removeEventListener(AUTH_STATE_CLEARED_EVENT, callback)
}