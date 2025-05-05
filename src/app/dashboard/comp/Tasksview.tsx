"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "../../../firebase/authContext"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"
import { Button } from "@/components/ui/button"
import {doc, getDoc, Timestamp } from 'firebase/firestore'

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

export function TasksView() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [indexBuilding, setIndexBuilding] = useState(false)
  const [employeeId, setEmployeeId] = useState("")

  useEffect(() => {
    if (!currentUser?.uid) return
  
    const fetchEmployeeId = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid)
        const userSnap = await getDoc(userRef)
  
        if (userSnap.exists()) {
          const data = userSnap.data()
          setEmployeeId(data.employeeId || "") // You'll need a useState hook for this
        } else {
          setError("User not found")
        }
      } catch (error) {
        setError(error.message)
      }
    }
  
    fetchEmployeeId()
  }, [currentUser?.uid])

  // Fetch tasks assigned to current employee
  useEffect(() => {
    if (!employeeId) return
  
    try {
      const q = query(
        collection(db, "tasks"),
        where("assignee", "==", employeeId),
        orderBy("dueDate", "asc")
      )
  
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const tasksData = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            const dueDateRaw = data.dueDate
            const dueDate = dueDateRaw instanceof Timestamp
              ? dueDateRaw.toDate()
              : new Date(dueDateRaw || Date.now())
                        const now = new Date()
  
            const status = dueDate < now && data.status !== "Completed" 
              ? "Overdue" 
              : data.status || "Pending"
  
            return {
              id: doc.id,
              title: data.title || "Untitled Task",
              assignedBy: data.assignedBy || "Unknown",
              category: data.category || "Uncategorized",
              status,
              dueDate,
              description: data.description || "",
              priority: data.priority || "Medium",
            }
          })
          setTasks(tasksData)
          setLoading(false)
          setError(null)
          setIndexBuilding(false)
        },
        (error) => {
          if (error.code === 'failed-precondition') {
            setIndexBuilding(true)
          }
          setError(error.message)
          setLoading(false)
        }
      )
  
      return () => unsubscribe()
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }, [employeeId]) // ← Use employeeId here
  

  // Get unique categories for filter
  const categories = ["All", ...Array.from(new Set(tasks.map((task) => task.category)))]
  const statuses = ["All", ...Array.from(new Set(tasks.map((task) => task.status)))]

  // Filter tasks based on search query and category
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "All" || task.category === categoryFilter
    const matchesStatus = statusFilter === "All" || task.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (indexBuilding) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-muted-foreground mb-4">
          The task list is being optimized. Please try again in a few minutes.
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-red-500">
        <p>Error loading tasks</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search tasks by title, description, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(task.dueDate, "MMM d, yyyy")}</span>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </CardContent>
            <CardFooter className="pt-2 border-t flex justify-between">
              <Badge variant="outline" className={categoryColors[task.category]}>
                {task.category}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {task.priority} Priority
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">No tasks found</p>
          {tasks.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          )}
        </div>
      )}
    </div>
  )
}