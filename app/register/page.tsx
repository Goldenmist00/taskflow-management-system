"use client"

import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"
import { CheckCircle, ArrowLeft, UserPlus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  useEffect(() => {
    // If already logged in, go to dashboard
    if (getToken()) router.replace("/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-cyan-200 rounded-full opacity-20 animate-bounce"></div>
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
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <UserPlus className="h-3 w-3 mr-1" />
              Join TaskFlow
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Start organizing your tasks and boost your productivity today
            </p>
          </div>

          {/* Register Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <RegisterForm />
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-sm font-medium text-gray-700">Modern UI</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-1">🚀</div>
              <div className="text-sm font-medium text-gray-700">Fast & Secure</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
