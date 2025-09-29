"use client"

import { useRouter } from "next/navigation"
import { clearAuth, getRole } from "@/lib/api"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Navbar() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setRole(getRole())
  }, [])

  const onLogout = () => {
    clearAuth()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">TaskFlow</h1>
            <p className="text-xs text-muted-foreground">Task Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`} />
            <span className="text-sm font-medium text-foreground capitalize">
              {role || "User"}
            </span>
          </div>
          
          <button
            onClick={onLogout}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
