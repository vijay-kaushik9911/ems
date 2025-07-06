import { db } from "@/firebase/firebaseConfig"
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore"
import { startOfWeek, endOfWeek, isAfter, isBefore } from "date-fns"

export async function getTaskStatsForEmployee(uid: string) {
  const userDoc = await getDoc(doc(db, "users", uid))
  if (!userDoc.exists()) throw new Error("User not found")

  const employeeId = userDoc.data().employeeId
  if (!employeeId) throw new Error("Employee ID not found for this user")

  const q = query(collection(db, "tasks"), where("assignedTo", "==", employeeId))
  const snapshot = await getDocs(q)

  const now = new Date()
  const startWeek = startOfWeek(now, { weekStartsOn: 1 })
  const endWeek = endOfWeek(now, { weekStartsOn: 1 })

  let total = 0
  let completed = 0
  let inProgress = 0
  let overdue = 0

  let assignedThisWeek = 0
  let completedThisWeek = 0
  let newInProgressThisWeek = 0
  let overdueThisWeek = 0

  snapshot.forEach((doc) => {
    const task = doc.data()
    const createdAt = task.createdAt?.toDate?.() || new Date(task.createdAt)
    const dueDate = task.dueDate?.toDate?.() || new Date(task.dueDate)
    const status = task.status.toLowerCase()

    total++

    if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
      assignedThisWeek++
    }

    if (status === "completed") {
      completed++
      if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
        completedThisWeek++
      }
    } else if (status === "pending" || status === "in progress") {
      inProgress++
      if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
        newInProgressThisWeek++
      }
    }

    if (dueDate < now && status !== "completed") {
      overdue++
      if (isAfter(dueDate, startWeek) && isBefore(dueDate, endWeek)) {
        overdueThisWeek++
      }
    }
  })

  return {
    total,
    completed,
    inProgress,
    overdue,
    assignedThisWeek,
    completedThisWeek,
    newInProgressThisWeek,
    overdueThisWeek,
  }
}
