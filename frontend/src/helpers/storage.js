const TOKEN_KEY = 'token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    return true
  } catch {
    return false
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    return true
  } catch {
    return false
  }
}
