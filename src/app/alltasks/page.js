import { Suspense } from "react"
import { TasksView } from "../dashboard/comp/Tasksview"
import { DashboardHeader } from "../dashboard/comp/dashboard-header"
import { DashboardNav } from "../dashboard/comp/dashboard-nav"
import { TasksSkeleton } from "../dashboard/comp/skeletons"
import { ErrorBoundary } from "../dashboard/comp/error-boundary"

export default function AllTasks() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          </div>
          <ErrorBoundary fallback={<div className="p-4">Something went wrong loading tasks</div>}>
            <Suspense fallback={<TasksSkeleton />}>
              <TasksView />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
