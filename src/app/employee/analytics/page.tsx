"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/app/dashboard/comp/dashboard-header"
import { DashboardNav } from "@/app/dashboard/comp/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskStatusPieChart } from "@/components/charts/task-status-pie-chart"
import { CompletionRateChart } from "@/components/charts/completion-rate-chart"
import { TaskTimelineChart } from "@/components/charts/task-timeline-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/firebase/authContext"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"
import { SidebarProvider } from "@/components/ui/sidebar"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"

interface Task {
  id: string
  title: string
  description: string
  category: string
  status: string
  dueDate: Date | string
  createdAt: Date | string
  updatedAt?: Date | string
  assignee: string
}

export default function EmployeeAnalyticsPage() {
  const { currentUser, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  })
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function fetchData() {
      console.log("inside fetching")
      if (!currentUser?.uid) {
        console.log("inside iff")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        console.log("inside try ")
        // Get employeeId from user document
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists()) {
          throw new Error("User document not found")
        }

        const employeeId = userDoc.data()?.employeeId
        console.log(employeeId)
        if (!employeeId) {
          throw new Error("Employee ID not found")
        }

        // Fetch tasks assigned to this employee
        const tasksQuery = query(
          collection(db, "tasks"),
          where("assignee", "==", employeeId)
        )

        const querySnapshot = await getDocs(tasksQuery)
        const now = new Date()
        
        const tasksData: Task[] = []
        const newStats = {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          overdue: 0,
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const dueDate = new Date(data.dueDate)
          const createdAt = new Date(data.createdAt)
          const updatedAt = data.updatedAt ? new Date(data.updatedAt) : createdAt
          
          const status = data.status || "Pending"
          const isOverdue = dueDate < now && status !== "Completed"

          const task: Task = {
            id: doc.id,
            title: data.title || "Untitled Task",
            description: data.description || "",
            category: data.category || "Uncategorized",
            status,
            dueDate,
            createdAt,
            updatedAt,
            assignee: data.assignee
          }

          tasksData.push(task)
          newStats.total++

          if (status === "Completed") {
            newStats.completed++
          } else if (status === "In Progress") {
            newStats.inProgress++
          } else {
            newStats.pending++
          }

          if (isOverdue) {
            newStats.overdue++
          }
        })

        setStats(newStats)
        setTasks(tasksData)
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [currentUser, authLoading])

  const parseDate = (dateString: string | Date) => {
    if (dateString instanceof Date) return dateString
    return new Date(dateString)
  }

  const completionRateByCategory = () => {
    const categories = Array.from(new Set(tasks.map(task => task.category)))
    
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category)
      const completed = categoryTasks.filter(task => task.status === "Completed").length
      
      return {
        name: category,
        completed,
        total: categoryTasks.length,
        rate: categoryTasks.length > 0 ? (completed / categoryTasks.length) * 100 : 0
      }
    }).filter(category => category.total > 0) // Only show categories with tasks
  }

  const taskTimelineData = () => {
    const now = new Date()
    const sixMonthsAgo = subMonths(now, 5)

    return eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    }).map(month => {
      const monthName = format(month, "MMM")
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)

      const assigned = tasks.filter(task => {
        const createdAt = parseDate(task.createdAt)
        return createdAt >= monthStart && createdAt <= monthEnd
      }).length

      const completed = tasks.filter(task => {
        const updatedAt = parseDate(task.updatedAt || task.createdAt)
        return task.status === "Completed" && 
               updatedAt >= monthStart && 
               updatedAt <= monthEnd
      }).length

      return {
        name: monthName,
        assigned,
        completed
      }
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col w-full">
        <DashboardHeader />
        <div className="flex flex-1">
          <SidebarProvider>
            <DashboardNav />
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-3/4" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </SidebarProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      <DashboardHeader />
      <div className="flex flex-1">
        <SidebarProvider>
          <DashboardNav />
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                    <p className="text-2xl font-bold">{stats.overdue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <TaskStatusPieChart
                pending={stats.pending}
                inProgress={stats.inProgress}
                completed={stats.completed}
                overdue={stats.overdue}
              />

              <CompletionRateChart data={completionRateByCategory()} />
            </div>

            <TaskTimelineChart data={taskTimelineData()} />
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}