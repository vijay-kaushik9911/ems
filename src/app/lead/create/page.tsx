import { DashboardHeader } from "@/app/dashboard/comp/dashboard-header"
import { LeadSidebar } from "@/app/dashboard/comp/lead-sidebar"
import { TaskCreationForm } from "@/app/dashboard/comp/task-creation-form"

export default function CreateTaskPage() {
  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <LeadSidebar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create New Task</h2>
          </div>
          <TaskCreationForm />
        </div>
      </div>
    </div>
  )
}
