"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Edit, Plus } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { TaskEditDialog } from "./task-edit-dialog"

// Mock data for tasks assigned by the current lead
const assignedTasks = [
  {
    id: "TASK-2001",
    title: "Implement new authentication flow",
    assignedTo: "John Smith",
    assignedToId: "emp-001",
    category: "Development",
    status: "In Progress",
    dueDate: new Date("2025-04-25"),
    description: "Create a new authentication flow using OAuth 2.0 and implement it in the frontend and backend.",
  },
  {
    id: "TASK-2002",
    title: "Design new landing page",
    assignedTo: "Sarah Johnson",
    assignedToId: "emp-002",
    category: "Design",
    status: "Pending",
    dueDate: new Date("2025-04-30"),
    description: "Create a modern, responsive landing page design that highlights our key features and benefits.",
  },
  {
    id: "TASK-2003",
    title: "Fix payment processing bug",
    assignedTo: "Michael Brown",
    assignedToId: "emp-003",
    category: "Development",
    status: "Completed",
    dueDate: new Date("2025-04-15"),
    description:
      "Investigate and fix the bug in the payment processing system that causes transactions to fail occasionally.",
  },
  {
    id: "TASK-2004",
    title: "Create Q2 marketing plan",
    assignedTo: "Emily Davis",
    assignedToId: "emp-004",
    category: "Marketing",
    status: "In Progress",
    dueDate: new Date("2025-04-28"),
    description:
      "Develop a comprehensive marketing plan for Q2 including social media, email campaigns, and content strategy.",
  },
  {
    id: "TASK-2005",
    title: "Update terms of service",
    assignedTo: "Robert Wilson",
    assignedToId: "emp-005",
    category: "Legal",
    status: "Pending",
    dueDate: new Date("2025-05-10"),
    description:
      "Review and update our terms of service to comply with new regulations and protect our business interests.",
  },
]

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
}

export function AssignedTasksView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selectedTask, setSelectedTask] = useState<(typeof assignedTasks)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(assignedTasks.map((task) => task.category)))]

  // Filter tasks based on search query and category
  const filteredTasks = assignedTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || task.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleTaskClick = (task: (typeof assignedTasks)[0]) => {
    setSelectedTask(task)
    setIsEditDialogOpen(true)
  }

  const handleTaskUpdate = (updatedTask: (typeof assignedTasks)[0]) => {
    // In a real app, you would update the task in your database
    console.log("Task updated:", updatedTask)
    setIsEditDialogOpen(false)

    // For demo purposes, we'll just close the dialog
    // In a real app, you would refresh the task list or update it in state
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
        <Button onClick={() => router.push("/create")} className="whitespace-nowrap">
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
                  <div className="text-sm text-muted-foreground font-mono">{task.id}</div>
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
