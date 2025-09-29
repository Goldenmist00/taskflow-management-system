"use client"

import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    // If already logged in, go to dashboard
    if (getToken()) router.replace("/dashboard")
  }, [router])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <LoginForm />
        <div className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            {"Don't have an account? "}{" "}
            <Link href="/register" className="text-foreground underline underline-offset-4">
              Create one
            </Link>
          </p>
          <p>
            {"Need admin access? "}{" "}
            <Link href="/admin-setup" className="text-red-600 underline underline-offset-4">
              Setup Admin Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
