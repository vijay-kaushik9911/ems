"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { format } from "date-fns"
import { cn } from "./utils"
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig"
import { useAuth } from "@/firebase/authContext"


// Mock data for employees
// const employees = [
//   { id: "emp-001", name: "John Smith" },
//   { id: "emp-002", name: "Sarah Johnson" },
//   { id: "emp-003", name: "Michael Brown" },
//   { id: "emp-004", name: "Emily Davis" },
//   { id: "emp-005", name: "Robert Wilson" },
// ];

const categories = ["Development", "Design", "Business", "Legal", "Marketing", "Research"];
const statuses = ["Pending", "In Progress", "Completed", "Overdue"];

export function TaskCreationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    taskId: "",
    description: "",
    assignedTo: "",
    assignedBy: "",
    category: "",
    status: "Pending",
    dueDate: new Date(),
    createdAt: new Date(), // Adding creation timestamp
  });

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

  const {currentUser} = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dueDate: date }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);


    try {
      // Add task to Firestore
      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, {
        ...formData,
        assignedBy : currentUser.uid,
        dueDate: formData.dueDate.toISOString(), // Convert Date to string for Firestore
        createdAt: new Date().toISOString(), // Add current timestamp
      });

      // Redirect to assigned tasks page after successful creation
      router.push("/lead/assignedtasks");
    } catch (error) {
      console.error("Error creating task:", error);
      // You might want to add error handling for the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Task Id</Label>
            <Input
              id="taskId"
              placeholder="Enter task Id"
              value={formData.taskId}
              onChange={(e) => handleChange("taskId", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleChange("assignedTo", value)} required>
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
                  fromYear={2000}
                  toYear={2035}
                  showOutsideDays={false}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Task
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
