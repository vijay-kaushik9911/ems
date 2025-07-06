"use client"

import { useEffect, useState } from "react"
import { db } from "@/firebase/firebaseConfig"
import { collection, query, where, getDocs } from "firebase/firestore"
import { subDays, format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "@/firebase/authContext"

export default function TaskActivityChart() {
  const { currentUser } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const q = query(collection(db, "tasks"), where("assignedTo", "==", "emp-002"))
      const snapshot = await getDocs(q)
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const day = subDays(new Date(), 6 - i)
        return { date: format(day, "MMM d"), count: 0 }
      })

      snapshot.forEach((doc) => {
        const task = doc.data()
        const created = task.createdAt?.toDate?.() || new Date(task.createdAt)
        const status = task.status.toLowerCase()
        const formattedDate = format(created, "MMM d")
        const entry = last7Days.find((d) => d.date === formattedDate)
        if (entry && status === "completed") {
          entry.count++
        }
      })

      setData(last7Days)
    }

    fetchCompletedTasks()
  }, [currentUser])

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
