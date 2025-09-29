"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { apiFetch, getRole } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

type Props = {
  onCreated: () => void
}

type User = {
  _id: string
  name: string
  email: string
  role: string
}

export default function TaskCreateForm({ onCreated }: Props) {
  const { toast } = useToast()
  const userRole = getRole()
  const isAdmin = userRole === 'admin'
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Load users for admin
  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  const loadUsers = async () => {
    setLoadingUsers(true)
    const { data, error } = await apiFetch<User[]>("/api/v1/tasks/users", { auth: true })
    setLoadingUsers(false)
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load users: ${error}`,
      })
      return
    }
    
    setUsers(data || [])
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await apiFetch<{ message: string; task: any }>("/api/v1/tasks", {
      method: "POST",
      auth: true,
      body: { 
        title, 
        description, 
        priority,
        dueDate: dueDate || undefined,
        assignedTo: assignedTo || undefined
      },
    })

    setLoading(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
      return
    }

    toast({
      title: "Success",
      description: data?.message || "Task created successfully!",
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setAssignedTo("")
    onCreated()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be done"
              className="min-h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Due Date (Optional)</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {isAdmin && (
            <div>
              <label className="text-sm font-medium mb-1 block">Assign To</label>
              <div className="space-y-2">
                {loadingUsers ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <span className="text-sm text-muted-foreground">Loading users...</span>
                  </div>
                ) : (
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user to assign (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="flex gap-2">
                  {assignedTo && !loadingUsers && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAssignedTo("")}
                    >
                      Clear Selection
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground flex-1">
                    {assignedTo ? "Task will be assigned to selected user" : "Task will be assigned to you"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
