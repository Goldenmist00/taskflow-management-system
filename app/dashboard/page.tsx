"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import TaskCreateForm from "@/components/tasks/task-create-form"
import TaskList from "@/components/tasks/task-list"
import UserTaskView from "@/components/admin/user-task-view"
import { getToken, getRole, apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, List, Plus, BarChart3, Clock } from "lucide-react"

type User = {
  _id: string
  name: string
  email: string
  role: string
}

type Task = {
  _id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdBy: string | User
  assignedTo?: string | User
  createdAt: string
  updatedAt: string
}

type DashboardStats = {
  totalUsers: number
  activeTasks: number
  completedTasks: number
  overdueTasks: number
  completionRate: number
  tasksInProgress: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [ready, setReady] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    tasksInProgress: 0
  })
  const [loading, setLoading] = useState(true)
  const userRole = getRole()
  const isAdmin = userRole === 'admin'

  const loadDashboardStats = async () => {
    if (!isAdmin) return
    
    setLoading(true)
    try {
      // Load users
      const { data: users, error: usersError } = await apiFetch<User[]>("/api/v1/tasks/users", { auth: true })
      if (usersError) {
        console.error("Failed to load users:", usersError)
        return
      }

      // Load tasks
      const { data: tasks, error: tasksError } = await apiFetch<Task[]>("/api/v1/tasks", { auth: true })
      if (tasksError) {
        console.error("Failed to load tasks:", tasksError)
        return
      }

      if (users && tasks) {
        const now = new Date()
        const totalTasks = tasks.length
        const activeTasks = tasks.filter(t => t.status !== 'completed').length
        const completedTasks = tasks.filter(t => t.status === 'completed').length
        const tasksInProgress = tasks.filter(t => t.status === 'in-progress').length
        const overdueTasks = tasks.filter(t => 
          t.dueDate && 
          new Date(t.dueDate) < now && 
          t.status !== 'completed'
        ).length
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

        setStats({
          totalUsers: users.length,
          activeTasks,
          completedTasks,
          overdueTasks,
          completionRate,
          tasksInProgress
        })
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

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
    loadDashboardStats()
  }, [router, toast, refresh])

  if (!ready) return null

  if (isAdmin) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">
          {/* Admin Header with Enhanced Stats */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-1">Admin Dashboard</h1>
                      <p className="text-blue-100 text-lg">Manage your organization with powerful insights</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.totalUsers}
                    </div>
                    <div className="text-xs text-blue-100">Total Users</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.activeTasks}
                    </div>
                    <div className="text-xs text-blue-100">Active Tasks</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : `${stats.completionRate}%`}
                    </div>
                    <div className="text-xs text-blue-100">Completion</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">
                      {loading ? "..." : stats.overdueTasks}
                    </div>
                    <div className="text-xs text-blue-100">Overdue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                    ) : (
                      stats.totalUsers
                    )}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <span className="mr-1">👥</span> Registered users
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                    ) : (
                      stats.activeTasks
                    )}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <span className="mr-1">→</span> {loading ? "..." : stats.tasksInProgress} in progress
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <List className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${stats.completionRate}%`
                    )}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <span className="mr-1">✓</span> {loading ? "..." : stats.completedTasks} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                  <p className={`text-3xl font-bold ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
                    ) : (
                      stats.overdueTasks
                    )}
                  </p>
                  <p className={`text-xs flex items-center mt-1 ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <span className="mr-1">{stats.overdueTasks > 0 ? '⚠' : '✅'}</span> 
                    {stats.overdueTasks > 0 ? 'Needs attention' : 'All on track'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.overdueTasks > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                  <Clock className={`h-6 w-6 ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl p-2">
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                Users & Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="all-tasks" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
              >
                <List className="h-4 w-4" />
                All Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="create" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    User Management
                  </h2>
                  <p className="text-gray-600">Monitor user activity and task assignments</p>
                </div>
                <UserTaskView 
                  refreshSignal={refresh} 
                  onTaskChanged={() => {
                    setRefresh((n) => n + 1)
                    loadDashboardStats()
                  }} 
                />
              </div>
            </TabsContent>

            <TabsContent value="all-tasks" className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <List className="h-4 w-4 text-white" />
                    </div>
                    Task Overview
                  </h2>
                  <p className="text-gray-600">View and manage all tasks across the organization</p>
                </div>
                <TaskList refreshSignal={refresh} onTaskChanged={() => loadDashboardStats()} />
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="max-w-2xl">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                      Create New Task
                    </h2>
                    <p className="text-gray-600">Assign tasks to team members and set priorities</p>
                  </div>
                  <TaskCreateForm onCreated={() => {
                    setRefresh((n) => n + 1)
                    loadDashboardStats()
                  }} />
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
