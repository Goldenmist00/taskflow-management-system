"use client"

import { useState } from "react"
import { apiFetch, getRole } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CalendarDays, User, Clock, AlertCircle, CheckCircle2, Circle, Trash2 } from "lucide-react"

export type Task = {
  _id: string
  title: string
  description: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  createdBy?: {
    _id: string
    name: string
    email: string
  } | string
  assignedTo?: {
    _id: string
    name: string
    email: string
  } | string
  createdAt?: string
  updatedAt?: string
}

type Props = {
  task: Task
  onChanged: () => void
}

export default function TaskItem({ task, onChanged }: Props) {
  const { toast } = useToast()
  const userRole = getRole()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState(task.status || 'pending')
  const [priority, setPriority] = useState(task.priority || 'medium')
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '')
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      case 'in-progress': return <Clock className="h-4 w-4" />
      case 'pending': return <Circle className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && (task.status || 'pending') !== 'completed'

  const onSave = async () => {
    setLoading(true)
    const { data, error } = await apiFetch<{ message: string; task: any }>(`/api/v1/tasks/${task._id}`, {
      method: "PUT",
      auth: true,
      body: { 
        title, 
        description, 
        status, 
        priority, 
        dueDate: dueDate || undefined 
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
      description: data?.message || "Task updated successfully!",
    })
    
    setEditing(false)
    onChanged()
  }

  const onDelete = async () => {
    setLoading(true)
    const { data, error } = await apiFetch<{ message: string }>(`/api/v1/tasks/${task._id}`, {
      method: "DELETE",
      auth: true,
    })
    setLoading(false)
    setShowDeleteDialog(false)
    
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
      description: data?.message || "Task deleted successfully!",
    })
    
    onChanged()
  }

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(task.status || 'pending')}
              <h3 className="font-semibold text-foreground">{task.title}</h3>
              {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={getPriorityColor(task.priority || 'medium')}>
                {(task.priority || 'medium').toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(task.status || 'pending')}>
                {(task.status || 'pending').replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit
            </Button>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    Delete Task
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Are you sure you want to delete <strong>"{task.title}"</strong>? 
                    <br />
                    <span className="text-destructive">This action cannot be undone.</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel disabled={loading}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={loading}
                    className="bg-red-600 text-white hover:bg-red-700 gap-2 font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Task
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="min-h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground">{task.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="font-medium">
                  {task.assignedTo?.name || 'Unknown User'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created by:</span>
                <span className="font-medium">
                  {task.createdBy?.name || 'Unknown User'}
                </span>
              </div>
              
              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due:</span>
                  <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
              
              {task.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{formatDate(task.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
