"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User } from "lucide-react"
import { format } from "date-fns"

// Mock data for tasks
const tasks = [
  {
    id: "TASK-1001",
    title: "Update dashboard analytics",
    assignedBy: "John Smith",
    category: "Development",
    status: "In Progress",
    dueDate: new Date("2025-04-20"),
  },
  {
    id: "TASK-1002",
    title: "Create new user onboarding flow",
    assignedBy: "Sarah Johnson",
    category: "Design",
    status: "Pending",
    dueDate: new Date("2025-04-25"),
  },
  {
    id: "TASK-1003",
    title: "Fix payment gateway integration",
    assignedBy: "Michael Brown",
    category: "Development",
    status: "Completed",
    dueDate: new Date("2025-04-10"),
  },
  {
    id: "TASK-1004",
    title: "Prepare quarterly report",
    assignedBy: "Emily Davis",
    category: "Business",
    status: "In Progress",
    dueDate: new Date("2025-04-30"),
  },
  {
    id: "TASK-1005",
    title: "Update privacy policy",
    assignedBy: "Robert Wilson",
    category: "Legal",
    status: "Pending",
    dueDate: new Date("2025-05-05"),
  },
  {
    id: "TASK-1006",
    title: "Optimize database queries",
    assignedBy: "Jennifer Lee",
    category: "Development",
    status: "In Progress",
    dueDate: new Date("2025-04-22"),
  },
  {
    id: "TASK-1007",
    title: "Create marketing materials",
    assignedBy: "David Miller",
    category: "Marketing",
    status: "Completed",
    dueDate: new Date("2025-04-15"),
  },
  {
    id: "TASK-1008",
    title: "Conduct user testing",
    assignedBy: "Lisa Anderson",
    category: "Research",
    status: "Pending",
    dueDate: new Date("2025-04-28"),
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

export function TasksView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(tasks.map((task) => task.category)))]

  // Filter tasks based on search query and category
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || task.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
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
                <span>Assigned by: {task.assignedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <Badge variant="outline" className={categoryColors[task.category]}>
                {task.category}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      )}
    </div>
  )
}
