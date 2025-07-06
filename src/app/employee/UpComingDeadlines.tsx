"use client"

import { useEffect, useState } from "react"
import { db } from "@/firebase/firebaseConfig"
import { collection, query, where, getDocs } from "firebase/firestore"
import { format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns"
import { useAuth } from "@/firebase/authContext"

export default function UpcomingDeadlines() {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchUpcoming = async () => {
      const q = query(collection(db, "tasks"), where("assignedTo", "==", "emp-002"))
      const snapshot = await getDocs(q)
      const now = new Date()
      const start = startOfWeek(now, { weekStartsOn: 1 })
      const end = endOfWeek(now, { weekStartsOn: 1 })

      const filtered = snapshot.docs
        .map((doc) => doc.data())
        .filter(
          (task) =>
            task.dueDate &&
            isWithinInterval(task.dueDate.toDate?.() || new Date(task.dueDate), { start, end }) &&
            task.status.toLowerCase() !== "completed"
        )
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5)

      setTasks(filtered)
    }

    fetchUpcoming()
  }, [currentUser])

  return (
    <ul className="space-y-2">
      {tasks.length === 0 ? (
        <li className="text-muted-foreground text-sm">No upcoming deadlines</li>
      ) : (
        tasks.map((task, idx) => (
          <li key={idx} className="flex justify-between">
            <span className="font-medium">{task.title}</span>
            <span className="text-sm text-red-500">{format(task.dueDate.toDate(), "MMM d")}</span>
          </li>
        ))
      )}
    </ul>
  )
}
