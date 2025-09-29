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
      <div className="min-h-dvh bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, tasks, and assignments</p>
          </div>
          
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users & Tasks
              </TabsTrigger>
              <TabsTrigger value="all-tasks" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <UserTaskView 
                refreshSignal={refresh} 
                onTaskChanged={() => setRefresh((n) => n + 1)} 
              />
            </TabsContent>

            <TabsContent value="all-tasks" className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground">All Tasks</h2>
                <p className="text-sm text-muted-foreground">View and manage all tasks in the system</p>
              </div>
              <TaskList refreshSignal={refresh} />
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="max-w-2xl">
                <TaskCreateForm onCreated={() => setRefresh((n) => n + 1)} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Task Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks and stay organized</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TaskCreateForm onCreated={() => setRefresh((n) => n + 1)} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
              <p className="text-sm text-muted-foreground">View and manage all your assigned tasks</p>
            </div>
            <TaskList refreshSignal={refresh} />
          </div>
        </div>
      </main>
    </div>
  )
}
