"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "./utils"
import { getDocs, collection, query, where } from 'firebase/firestore'
import { db } from "@/firebase/firebaseConfig"

const statuses = ["Pending", "In Progress", "Completed", "Overdue"]

interface TaskEditDialogProps {
  task: {
    id: string
    title: string
    taskId: string
    description: string
    assignedBy: string  // Changed from assignedTo to assignedBy
    category: string
    status: string
    dueDate: Date
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedTask: { id: string; status: string }) => void
  userNames: Record<string, string>
}

export function ShowTask({ task, open, onOpenChange, onUpdate, userNames }: TaskEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(task.status)
  const [assignedByName, setAssignedByName] = useState("")

  useEffect(() => {
    const fetchAssignedByName = async () => {
      try {
        const q = query(collection(db, "users"), where("employeeId", "==", task.assignedBy))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setAssignedByName(querySnapshot.docs[0].data().name || "Unknown")
        }
      } catch (error) {
        console.error("Failed to fetch assigned by name:", error)
      }
    }

    fetchAssignedByName()
    setStatus(task.status)
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onUpdate({
        id: task.id,
        status: status
      })
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Task Details: {task.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Task ID</Label>
              <Input value={task.taskId} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={task.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={task.description || "No description"}
                readOnly
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Assigned By</Label>
              <Input value={userNames[task.assignedBy] || "Loading..."} readOnly />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={task.category} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
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

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !task.dueDate && "text-muted-foreground"
                    )}
                    disabled
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.dueDate ? format(task.dueDate, "PPP") : "No date set"}
                  </Button>
                </PopoverTrigger>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}