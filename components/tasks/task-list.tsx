"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import TaskItem, { type Task } from "./task-item"

type Props = {
  refreshSignal?: number
  onTaskChanged?: () => void
}

export default function TaskList({ refreshSignal, onTaskChanged }: Props) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await apiFetch<Task[]>("/api/v1/tasks", { auth: true })
    setLoading(false)
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load tasks: ${error}`,
      })
      return
    }
    
    // Backend returns array directly
    setTasks(data || [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSignal])

  if (loading && tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading tasks…</p>
  }

  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks yet.</p>
  }

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskItem 
          key={t._id} 
          task={t} 
          onChanged={() => {
            load()
            onTaskChanged?.()
          }} 
        />
      ))}
    </div>
  )
}
