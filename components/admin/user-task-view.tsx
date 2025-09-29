"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, User, Users, CheckCircle2, Clock, Circle, AlertTriangle } from "lucide-react"
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Users & Their Tasks</h2>
        <Badge variant="outline">{usersWithTasks.length} users</Badge>
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
          <Card key={user._id} className="overflow-hidden">
            <Collapsible 
              open={expandedUsers.has(user._id)}
              onOpenChange={() => toggleUserExpansion(user._id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {expandedUsers.has(user._id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {user.role}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {user.taskCounts.total} tasks
                        </Badge>
                        
                        {user.taskCounts.overdue > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {user.taskCounts.overdue} overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task summary bar */}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Circle className="h-3 w-3 text-gray-600" />
                      <span>{user.taskCounts.pending} pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-600" />
                      <span>{user.taskCounts.inProgress} in progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>{user.taskCounts.completed} completed</span>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  {user.tasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No tasks created by this user</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Tasks created by {user.name}</h4>
                        <Badge variant="outline">{user.tasks.length} tasks</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        {user.tasks.map((task) => (
                          <TaskItem 
                            key={task._id} 
                            task={task} 
                            onChanged={() => {
                              loadUsersAndTasks()
                              onTaskChanged()
                            }} 
                          />
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