import { db } from "@/firebase/firebaseConfig"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { Task } from "@/types"

// Get a task by its ID
export async function getTaskById(taskId: string) {
  try {
    const taskDoc = await getDoc(doc(db, "tasks", taskId))
    if (taskDoc.exists()) {
      const data = taskDoc.data()
      return {
        id: taskDoc.id,
        ...data,
        dueDate: new Date(data.dueDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as Task
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting task:", error)
    throw error
  }
}

// Get all tasks assigned to a specific employee
export async function getTasksByAssignee(employeeId: string) {
  try {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("assignee", "==", employeeId),
      orderBy("dueDate", "asc")
    )

    const querySnapshot = await getDocs(tasksQuery)
    const tasks: Task[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      tasks.push({
        id: doc.id,
        ...data,
        dueDate: new Date(data.dueDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } as Task)
    })

    return tasks
  } catch (error) {
    console.error("Error getting tasks by assignee:", error)
    throw error
  }
}

// Get task statistics for a given employee (lead or regular)
export async function getTaskStats(uid: string, isLead: boolean) {
  try {
    // Fetch the employeeId using the uid directly
    const userDocRef = doc(db, "users", uid)  // Assuming users are stored in the "users" collection
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      console.error("User not found")
      throw new Error("User not found")
    }

    const userData = userDoc.data()
    const employeeId = userData?.employeeId

    if (!employeeId) {
      throw new Error("Employee ID is missing")
    }

    // If employeeId is found, proceed with task query
    const field = isLead ? "assignedById" : "assignee"
    const tasksQuery = query(
      collection(db, "tasks"),
      where(field, "==", employeeId)
    )

    const querySnapshot = await getDocs(tasksQuery)

    let total = 0
    let completed = 0
    let pending = 0
    let overdue = 0
    const now = new Date()

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const dueDate = new Date(data.dueDate)
      const status = data.status

      total++
      if (status === "Completed") {
        completed++
      } else {
        pending++
        if (dueDate < now) {
          overdue++
        }
      }
    })

    return { total, completed, pending, overdue }
  } catch (error) {
    console.error("Error getting task stats:", error)
    throw error
  }
}


// Get upcoming deadlines (not completed, due after now)
export async function getUpcomingDeadlines(employeeId: string, limit = 5) {
  try {
    const now = new Date()
    const tasksQuery = query(
      collection(db, "tasks"),
      where("assignee", "==", employeeId),
      orderBy("dueDate", "asc")
    )

    const querySnapshot = await getDocs(tasksQuery)
    const tasks: Task[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const due = new Date(data.dueDate)
      const status = data.status
      if (status !== "Completed" && due >= now && tasks.length < limit) {
        tasks.push({
          id: doc.id,
          ...data,
          dueDate: due,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        } as Task)
      }
    })

    return tasks
  } catch (error) {
    console.error("Error getting upcoming deadlines:", error)
    throw error
  }
}

// Create a new task
export async function createTask(task: Omit<Task, "id">) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task)
    return docRef.id
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

// Update an existing task
export async function updateTask(taskId: string, updatedTask: Partial<Task>) {
  try {
    await updateDoc(doc(db, "tasks", taskId), updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

// Delete a task
export async function deleteTask(taskId: string) {
  try {
    await deleteDoc(doc(db, "tasks", taskId))
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}
