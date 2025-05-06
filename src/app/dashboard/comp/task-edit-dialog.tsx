"use client"

import type React from "react"

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
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig"


// Mock data for employees
// const employees = [
//   { id: "emp-001", name: "John Smith" },
//   { id: "emp-002", name: "Sarah Johnson" },
//   { id: "emp-003", name: "Michael Brown" },
//   { id: "emp-004", name: "Emily Davis" },
//   { id: "emp-005", name: "Robert Wilson" },
// ]

// Categories
const categories = ["Development", "Design", "Business", "Legal", "Marketing", "Research"]

// Statuses
const statuses = ["Pending", "In Progress", "Completed", "Overdue"]

interface TaskEditDialogProps {
  task: {
    id: string
    title: string
    taskId: string
    description: string
    assignedTo: string
    category: string
    status: string
    dueDate: Date
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedTask: any) => void
}

export function TaskEditDialog({ task, open, onOpenChange, onUpdate }: TaskEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState([]);
  
  const [formData, setFormData] = useState({
    id: task.id,
    taskId: task.taskId,
    title: task.title,
    description: task.description || "",
    assignedTo: task.assignedTo,
    category: task.category,
    status: task.status,
    dueDate: task.dueDate,
  })

  useEffect(() => {
    if (open && task) {
      setFormData({
        id: task.id,
        taskId: task.taskId || "",
        title: task.title,
        description: task.description || "",
        assignedTo: task.assignedTo,
        category: task.category,
        status: task.status,
        dueDate: new Date(task.dueDate),
      });
    }
  }, [task, open]);

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const q = query(collection(db, "users"), where("role", "==", "employee"));
          const querySnapshot = await getDocs(q);
          const employeeList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            employeeId: doc.data().employeeId,
            name: doc.data().name || doc.data().displayName || "Unnamed",
          }));
          setEmployees(employeeList);
        } catch (error) {
          console.error("Failed to fetch employees:", error);
        }
      };
    
      fetchEmployees();
    }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dueDate: date }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      console.log("Updating task:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find the employee name based on ID
      // const employee = employees.find((emp) => emp.id === formData.assignedTo)

      // Call the onUpdate function with the updated task
      onUpdate({
        ...formData,
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
            <DialogTitle>Edit Task {task.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Task Id</Label>
              <Input
                id="taskId"
                value={formData.taskId}
                onChange={(e) => handleChange("taskId", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => handleChange("assignedTo", value)}
                  required
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.employeeId} value={employee.employeeId}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
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

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={formData.dueDate} 
                      onSelect={handleDateChange} 
                      initialFocus   
                      captionLayout="dropdown"
                      classNames={{
                          table: "w-full border-collapse",
                          head_row: "flex",
                          head_cell: "text-center text-xs font-medium text-gray-500 w-9",
                          row: "flex w-full mt-1",
                          cell: "h-9 w-9 text-center text-sm hover:bg-gray-100",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
