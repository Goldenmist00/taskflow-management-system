"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, User, Users, CheckCircle2, Clock, Circle, AlertTriangle, List } from "lucide-react"
import TaskItem, { type Task } from "@/components/tasks/task-item"

type User = {
  _id: string
  name: string
  email: string
  role: string
}

type UserWithTasks = User & {
  tasks: Task[]
  taskCounts: {
    total: number
    pending: number
    inProgress: number
    completed: number
    overdue: number
  }
}

type Props = {
  refreshSignal?: number
  onTaskChanged: () => void
}

export default function UserTaskView({ refreshSignal, onTaskChanged }: Props) {
  const { toast } = useToast()
  const [usersWithTasks, setUsersWithTasks] = useState<UserWithTasks[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  const loadUsersAndTasks = async () => {
    setLoading(true)
    
    try {
      // Load all users
      const { data: users, error: usersError } = await apiFetch<User[]>("/api/v1/tasks/users", { auth: true })
      if (usersError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load users: ${usersError}`,
        })
        return
      }

      // Load all tasks
      const { data: tasks, error: tasksError } = await apiFetch<Task[]>("/api/v1/tasks", { auth: true })
      if (tasksError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load tasks: ${tasksError}`,
        })
        return
      }

      // Group tasks by user
      const usersWithTasksData: UserWithTasks[] = (users || []).map(user => {
        const userTasks = (tasks || []).filter(task => {
          // Handle both string and object formats for createdBy
          const createdById = typeof task.createdBy === 'string' ? task.createdBy : task.createdBy?._id
          return createdById === user._id
        })

        const now = new Date()
        const taskCounts = {
          total: userTasks.length,
          pending: userTasks.filter(t => (t.status || 'pending') === 'pending').length,
          inProgress: userTasks.filter(t => (t.status || 'pending') === 'in-progress').length,
          completed: userTasks.filter(t => (t.status || 'pending') === 'completed').length,
          overdue: userTasks.filter(t => 
            t.dueDate && 
            new Date(t.dueDate) < now && 
            (t.status || 'pending') !== 'completed'
          ).length
        }

        return {
          ...user,
          tasks: userTasks,
          taskCounts
        }
      })

      // Sort users by task count (most tasks first)
      usersWithTasksData.sort((a, b) => b.taskCounts.total - a.taskCounts.total)
      
      setUsersWithTasks(usersWithTasksData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsersAndTasks()
  }, [refreshSignal])

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <Circle className="h-4 w-4 text-gray-600" />
      default: return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading users and tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Overview</h2>
            <p className="text-gray-600">Monitor user activity and task distribution</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {usersWithTasks.length} active users
          </Badge>
        </div>
      </div>

      {usersWithTasks.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        usersWithTasks.map((user) => (
          <Card key={user._id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <Collapsible 
              open={expandedUsers.has(user._id)}
              onOpenChange={() => toggleUserExpansion(user._id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {expandedUsers.has(user._id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-600" />
                        )}
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{user.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge 
                        className={
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                        }
                      >
                        {user.role}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm font-medium bg-gray-50 border-gray-200">
                          {user.taskCounts.total} tasks
                        </Badge>
                        
                        {user.taskCounts.overdue > 0 && (
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {user.taskCounts.overdue} overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Task summary bar */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Circle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{user.taskCounts.pending} pending</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{user.taskCounts.inProgress} in progress</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{user.taskCounts.completed} completed</span>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 px-6 pb-6">
                  {user.tasks.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                      <Circle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 font-medium">No tasks created by this user</p>
                      <p className="text-sm text-gray-500 mt-1">Tasks will appear here when created</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <List className="h-3 w-3 text-white" />
                          </div>
                          Tasks by {user.name}
                        </h4>
                        <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                          {user.tasks.length} total
                        </Badge>
                      </div>
                      
                      <div className="grid gap-4">
                        {user.tasks.map((task) => (
                          <div key={task._id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <TaskItem 
                              task={task} 
                              onChanged={() => {
                                loadUsersAndTasks()
                                onTaskChanged()
                              }} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))
      )}
    </div>
  )
}