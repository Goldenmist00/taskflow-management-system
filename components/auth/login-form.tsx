"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, setAuth } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await apiFetch<{ token: string; role: string }>("/api/v1/auth/login", {
      method: "POST",
      body: { email, password },
    })

    setLoading(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error,
      })
      return
    }

    if (data?.token) {
      setAuth(data.token, data.role)
      toast({
        title: "Success",
        description: "Login successful! Redirecting to dashboard...",
      })
      router.push("/dashboard")
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid response from server",
      })
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-center text-xl font-semibold text-foreground">Login</h2>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-muted-foreground">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="you@example.com"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-muted-foreground">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
        />
      </div>



      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
