// Prefer configuring this as an environment variable in Vercel Project Settings
// For client usage, it must be prefixed with NEXT_PUBLIC_*
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

const TOKEN_KEY = "jwt_token"
const USER_ROLE_KEY = "user_role"

export function getApiBase() {
  return API_BASE
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setAuth(token: string, role?: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
  if (role) window.localStorage.setItem(USER_ROLE_KEY, role)
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(USER_ROLE_KEY)
}

export function clearAuth() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_ROLE_KEY)
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  auth?: boolean
  headers?: Record<string, string>
}

export async function apiFetch<T = any>(
  path: string,
  opts: ApiOptions = {},
): Promise<{ data?: T; error?: string; status: number }> {
  const url = `${getApiBase()}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  }

  if (opts.auth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  try {
    const res = await fetch(url, {
      method: opts.method || "GET",
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    })
    const status = res.status

    // Try to parse as JSON; fall back to text
    let payload: any = null
    try {
      payload = await res.json()
    } catch {
      payload = await res.text()
    }

    if (!res.ok) {
      const msg = typeof payload === "string" ? payload : payload?.message || "Request failed"
      return { error: msg, status }
    }

    return { data: payload as T, status }
  } catch (e: any) {
    console.error("[API] Request failed:", e?.message || e)
    return { error: "Network error", status: 0 }
  }
}
