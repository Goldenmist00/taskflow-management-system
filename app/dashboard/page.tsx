"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import TaskCreateForm from "@/components/tasks/task-create-form"
import TaskList from "@/components/tasks/task-list"
import UserTaskView from "@/components/admin/user-task-view"
import { getToken, getRole } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, List, Plus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [ready, setReady] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const userRole = getRole()
  const isAdmin = userRole === 'admin'

  useEffect(() => {
    const token = getToken()
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
      })
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router, toast])

  if (!ready) return null

  if (isAdmin) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                  <p className="text-blue-100">Manage users, tasks, and assignments across your organization</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
              <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Users className="h-4 w-4" />
                Users & Tasks
              </TabsTrigger>
              <TabsTrigger value="all-tasks" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <List className="h-4 w-4" />
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Plus className="h-4 w-4" />
                Create Task
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <UserTaskView 
                  refreshSignal={refresh} 
                  onTaskChanged={() => setRefresh((n) => n + 1)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="all-tasks" className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">All Tasks</h2>
                  <p className="text-gray-600">View and manage all tasks in the system</p>
                </div>
                <TaskList refreshSignal={refresh} />
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="max-w-2xl">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
                  <TaskCreateForm onCreated={() => setRefresh((n) => n + 1)} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* User Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Task Dashboard</h1>
                <p className="text-green-100">Manage your tasks and stay organized</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <List className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <TaskCreateForm onCreated={() => setRefresh((n) => n + 1)} />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Tasks</h2>
                <p className="text-gray-600">View and manage all your assigned tasks</p>
              </div>
              <TaskList refreshSignal={refresh} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
