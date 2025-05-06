"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Edit, Plus } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { TaskEditDialog } from "./task-edit-dialog"
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"

// Category colors
const categoryColors: Record<string, string> = {
  Development: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  Design: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
  Business: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  Legal: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  Marketing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  Research: "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100",
}

// Status colors
const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
}

export function AssignedTasksView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Helper function to safely convert Firestore dates
  const convertFirestoreDate = (date: any): Date => {
    if (!date) return new Date()
    
    // If it's a Firestore Timestamp
    if (typeof date.toDate === 'function') {
      return date.toDate()
    }
    
    // If it's already a Date object
    if (date instanceof Date) {
      return date
    }
    
    // If it's an ISO string
    if (typeof date === 'string') {
      return new Date(date)
    }
    
    // Fallback to current date
    return new Date()
  }

  // Fetch tasks from Firebase
  useEffect(() => {
    const q = query(collection(db, "tasks"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          taskId: data.taskId,
          title: data.title || "Untitled Task",
          assignedTo: data.assignedTo || "Unassigned",
          // assignedToId: data.assigneeId || "",
          category: data.category || "Uncategorized",
          status: data.status || "Pending",
          dueDate: convertFirestoreDate(data.dueDate),
          description: data.description || "",
          createdAt: convertFirestoreDate(data.createdAt),
        }
      })
      setTasks(tasksData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])
  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(tasks.map((task) => task.category)))]

  // Filter tasks based on search query and category
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || task.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setIsEditDialogOpen(true)
  }

  const handleTaskUpdate = async (updatedTask: any) => {
    try {
      const taskRef = doc(db, "tasks", updatedTask.id)
      await updateDoc(taskRef, {
        title: updatedTask.title,
        taskId: updatedTask.taskId,
        status: updatedTask.status,
        category: updatedTask.category,
        assignedTo: updatedTask.assignedTo,
        // assigneeId: updatedTask.assignedToId,
        dueDate: updatedTask.dueDate,
        description: updatedTask.description,
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading tasks...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.push("/lead/create")} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTaskClick(task)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground font-mono">{task.taskId}</div>
                  <CardTitle className="mt-1 text-xl">{task.title}</CardTitle>
                </div>
                <Badge className={statusColors[task.status]}>{task.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span>Assigned to: {task.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t flex justify-between items-center">
              <Badge variant="outline" className={categoryColors[task.category]}>
                {task.category}
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      )}

      {selectedTask && (
        <TaskEditDialog
          task={selectedTask}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  )
}