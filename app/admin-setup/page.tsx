"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, CheckCircle, Crown, Lock } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-yellow-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 group">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">
              <Crown className="h-3 w-3 mr-1" />
              Admin Setup
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Admin Account
            </h1>
            <p className="text-gray-600">
              Set up an administrator account with elevated privileges
            </p>
          </div>

          {/* Admin Setup Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Full Name</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Email Address</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">Password</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  Admin Secret Key
                </label>
                <Input
                  type="password"
                  required
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter admin secret key"
                  className="h-11"
                />
                <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-md">
                  🔒 This secret key is required to create admin accounts. Contact your system administrator if you don't have it.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-11 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium"
              >
                {loading ? "Creating Admin Account..." : "Create Admin Account"}
              </Button>
            </form>
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Security Notice</p>
                <p>Admin accounts have full system access. Only create admin accounts for trusted users.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}