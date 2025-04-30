import { DashboardHeader } from "../dashboard/comp/dashboard-header"
import { LeadSidebar } from "../dashboard/comp/lead-sidebar"
import { AssignedTasksView } from "../dashboard/comp/assigned-tasks-view"
import { Suspense } from "react"
import { TasksSkeleton } from "../dashboard/comp/skeletons"
import { ErrorBoundary } from "../dashboard/comp/error-boundary"

export default function AssignedTasksPage() {
  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <LeadSidebar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Tasks You've Assigned</h2>
          </div>
          <ErrorBoundary fallback={<div className="p-4">Something went wrong loading tasks</div>}>
            <Suspense fallback={<TasksSkeleton />}>
              <AssignedTasksView />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
