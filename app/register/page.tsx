"use client"

import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  useEffect(() => {
    // If already logged in, go to dashboard
    if (getToken()) router.replace("/dashboard")
  }, [router])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
