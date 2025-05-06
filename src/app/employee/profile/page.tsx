"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/firebase/authContext"
import { DashboardHeader } from "@/app/dashboard/comp/dashboard-header"
import { DashboardNav } from "@/app/dashboard/comp/dashboard-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Pencil } from "lucide-react"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/firebaseConfig"
import { toast } from "@/components/ui/use-toast"

export default function EmployeeProfilePage() {
  const { currentUser, setUserData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    displayName: "",
    employeeId: "",
    email: "",
    bio: "",
    department: "",
    position: "",
    phoneNumber: "",
    location: "",
  })

  

  // Redirect if not authenticated or if lead
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login")
    }
  }, [currentUser, authLoading, router])

  // Create or fetch profile data
  useEffect(() => {
    const handleProfile = async () => {
      if (!currentUser?.uid) return

      try {
        setProfileLoading(true)
        const profileRef = doc(db, "profiles", currentUser.uid)
        const profileSnap = await getDoc(profileRef)

        if (profileSnap.exists()) {
          // Profile exists - load the data
          const data = profileSnap.data()
          setProfileData({
            displayName: data.displayName || currentUser.displayName || "",
            employeeId: data.employeeId || "",
            email: currentUser.email || "",
            bio: data.bio || "",
            department: data.department || "",
            position: data.position || "",
            phoneNumber: data.phoneNumber || "",
            location: data.location || "",
          })
        } else {
            // Fetch user details from 'users' collection using currentUser.uid
            const userRef = doc(db, "users", currentUser.uid)
            const userSnap = await getDoc(userRef)

            let employeeId = `EMP-${Math.floor(1000 + Math.random() * 9000)}` // fallback
            let email = currentUser.email || ""
            let name = currentUser.displayName || ""
            let role = ""

            if (userSnap.exists()) {
              const userData = userSnap.data()
              employeeId = userData.employeeId || employeeId
              email = userData.email || email
              name = userData.name || name
              role = userData.role || ""
            }

            const newProfile = {
              displayName: name,
              employeeId,
              email,
              bio: "",
              department: "",
              position: "",
              phoneNumber: "",
              location: "",
              createdAt: new Date(),
              updatedAt: new Date()
            }

            await setDoc(profileRef, newProfile)
            setProfileData(newProfile)


        }
      } catch (error) {
        console.error("Error handling profile:", error)
        toast({
          title: "Profile Error",
          description: "Failed to load or create profile",
          variant: "destructive"
        })
      } finally {
        setProfileLoading(false)
      }
    }

    handleProfile()
  }, [currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!currentUser?.uid) return

    setIsSaving(true)
    try {
      const profileRef = doc(db, "profiles", currentUser.uid)
      await updateDoc(profileRef, {
        displayName: profileData.displayName,
        bio: profileData.bio,
        department: profileData.department,
        position: profileData.position,
        phoneNumber: profileData.phoneNumber,
        location: profileData.location,
        updatedAt: new Date()
      })

      const userRef = doc(db, "users", currentUser.uid)
      await updateDoc(userRef, {
        name: profileData.displayName,
        updatedAt: new Date()
      })
      
      const newUserDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (newUserDoc.exists()) {
        setUserData(newUserDoc.data()) // update context with new name
      }

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully"
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Could not save your changes",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "US"
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen flex-col w-full">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardNav />
          <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
              <Button variant="outline" size="sm" disabled>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </CardTitle>
                    <CardDescription>
                      <span className="h-4 bg-gray-200 rounded w-full animate-pulse"></span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col w-full">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser?.photoURL || undefined} alt={profileData.displayName} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profileData.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{profileData.displayName}</h3>
                    <p className="text-sm text-muted-foreground">{profileData.position}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Full Name</Label>
                        <Input
                          id="displayName"
                          name="displayName"
                          value={profileData.displayName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input
                            id="employeeId"
                            name="employeeId"
                            value={profileData.employeeId}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            value={profileData.email}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            name="department"
                            value={profileData.department}
                            onChange={handleChange}
                            placeholder="e.g. Engineering"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            name="position"
                            value={profileData.position}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g. +1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={profileData.location}
                            onChange={handleChange}
                            placeholder="e.g. New York, NY"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                          <p>{profileData.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Department</p>
                          <p>{profileData.department || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Position</p>
                          <p>{profileData.position || "Not specified"}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                          <p>{profileData.phoneNumber || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p>{profileData.location || "Not specified"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Share a bit about yourself with your team</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself, your skills, interests, and experience..."
                      className="min-h-[200px]"
                    />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    {profileData.bio ? (
                      <p>{profileData.bio}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No bio provided yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}