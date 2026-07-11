import { useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext.js'

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me.php', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signUp = useCallback(async (form) => {
    const { ok, data } = await postJson('/api/signup.php', form)
    if (ok) setUser(data.user)
    return { ok, errors: data.errors }
  }, [])

  const signIn = useCallback(async (form) => {
    const { ok, data } = await postJson('/api/login.php', form)
    if (ok) setUser(data.user)
    return { ok, errors: data.errors }
  }, [])

  const signInWithGoogle = useCallback(async (credential) => {
    const { ok, data } = await postJson('/api/google_auth.php', { credential })
    if (ok) setUser(data.user)
    return { ok, errors: data.errors }
  }, [])

  const signOut = useCallback(async () => {
    await fetch('/api/logout.php', { method: 'POST', credentials: 'include' })
    setUser(null)
  }, [])

  const value = { user, loading, signUp, signIn, signInWithGoogle, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
