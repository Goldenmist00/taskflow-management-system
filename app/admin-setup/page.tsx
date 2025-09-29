"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminSetupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminSecret, setAdminSecret] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await apiFetch<{ message: string }>("/api/v1/auth/create-admin", {
      method: "POST",
      body: { name, email, password, adminSecret },
    })

    setLoading(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Admin Creation Failed",
        description: error,
      })
      return
    }

    toast({
      title: "Success",
      description: data?.message || "Admin account created successfully!",
    })

    // Clear form and redirect to login
    setName("")
    setEmail("")
    setPassword("")
    setAdminSecret("")
    
    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Create Admin Account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Set up an administrator account for the task management system
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Admin Secret</label>
                <Input
                  type="password"
                  required
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret key"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact your system administrator for the secret key
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Admin Account..." : "Create Admin Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}