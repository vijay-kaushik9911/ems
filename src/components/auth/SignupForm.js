'use client'

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SignupForm({ onSubmit }) {
  const [isEmployee, setIsEmployee] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    empId: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(formData, isEmployee)
      } else {
        console.log("Signup:", formData, isEmployee ? "Employee" : "Lead")
      }
    } catch (err) {
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="account-type" className="flex items-center gap-2">
          Account Type:
          <span className="font-normal text-muted-foreground">
            {isEmployee ? "Employee" : "Team Lead"}
          </span>
        </Label>
        <Switch
          id="account-type"
          checked={isEmployee}
          onCheckedChange={() => setIsEmployee((prev) => !prev)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="empId">{isEmployee ? "Employee ID" : "Lead ID"}</Label>
        <Input
          id="empId"
          name="empId"
          placeholder={isEmployee ? "EMP-12345" : "LEAD-001"}
          required
          value={formData.empId}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  )
}
