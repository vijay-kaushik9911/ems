'use client';
import { useAuth } from '../../../firebase/authContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { DashboardHeader } from '../../dashboard/comp/dashboard-header';
import { LeadSidebar } from '../../dashboard/comp/lead-sidebar';
import {
  Card, CardHeader, CardTitle,
  CardContent, CardDescription
} from '../../../components/ui/card';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '@/firebase/firebaseConfig';
import { isAfter, isBefore, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';



async function getTaskStatsForLead(leadId: string) {
  const q = query(collection(db, "tasks"), where("assignedBy", "==", leadId));
  const snapshot = await getDocs(q);
  const now = new Date();
  const startWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const endWeek = endOfWeek(now, { weekStartsOn: 1 });

  let total = 0;
  let completed = 0;
  let inProgress = 0;
  let overdue = 0;

  let assignedThisWeek = 0;
  let completedThisWeek = 0;
  let newInProgressThisWeek = 0;
  let overdueThisWeek = 0;

  snapshot.forEach((doc) => {
    const task = doc.data();
    const createdAt = task.createdAt?.toDate?.() || new Date(task.createdAt);
    const dueDate = task.dueDate?.toDate?.() || new Date(task.dueDate);
    const status = task.status.toLowerCase();
  
    total++;
  
    if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
      assignedThisWeek++;
    }
  
    if (status === "completed") {
      completed++;
      if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
        completedThisWeek++;
      }
    } else if (status === "pending" || status === "in progress") {
      inProgress++;
      if (isAfter(createdAt, startWeek) && isBefore(createdAt, endWeek)) {
        newInProgressThisWeek++;
      }
    }
  
    if (dueDate < now && status !== "completed") {
      overdue++;
      if (isAfter(dueDate, startWeek) && isBefore(dueDate, endWeek)) {
        overdueThisWeek++;
      }
    }
  });
  

  return {
    total,
    completed,
    inProgress,
    overdue,
    assignedThisWeek,
    completedThisWeek,
    newInProgressThisWeek,
    overdueThisWeek,
  };
}





export default function LeadDashboard() {
  const { currentUser, isLead, loading } = useAuth();
  const router = useRouter();
  const [taskStats, setTaskStats] = useState({  total: 0, completed: 0, inProgress: 0, overdue: 0, assignedThisWeek: 0, completedThisWeek: 0, newInProgressThisWeek: 0, overdueThisWeek: 0, });

  useEffect(() => {
    if (!loading && (!currentUser || !isLead)) {
      router.push('/login/lead');
    }
  }, [currentUser, isLead, loading, router]);


  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getTaskStatsForLead(currentUser.uid);
      setTaskStats(stats);
    };
    if (currentUser?.uid) fetchStats();
  }, [currentUser]);
  

  if (loading || !currentUser || !isLead) return null;

  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <LeadSidebar />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<Card><CardContent>Loading Pending...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium"> 🔢 Total Tasks Assigned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.assignedThisWeek} assigned this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading In Progress...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">✅ Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.completed}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.completedThisWeek} completed this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Completed...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">⏳ Tasks In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.newInProgressThisWeek} in progress this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Overdue...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">❗ Overdue Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.overdue}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.overdueThisWeek} overdue this week</p>
                </CardContent>
              </Card>
            </Suspense>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Suspense fallback={<Card className="col-span-4"><CardContent>Loading Task Activity...</CardContent></Card>}>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Task Activity</CardTitle>
                  <CardDescription>Summary of tasks completed in the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Assigned', value: taskStats.assignedThisWeek },
                          { name: 'Completed', value: taskStats.completedThisWeek },
                          { name: 'In Progress', value: taskStats.newInProgressThisWeek },
                          { name: 'Overdue', value: taskStats.overdueThisWeek },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                        <Cell fill="#ff6b6b" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card className="col-span-4"><CardContent>Loading Deadlines...</CardContent></Card>}>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Top tasks due this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="font-medium">Fix Login Bug</span>
                      <span className="text-sm text-red-500">Apr 12</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">Update Dashboard UI</span>
                      <span className="text-sm text-yellow-500">Apr 13</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="font-medium">API Integration</span>
                      <span className="text-sm text-green-500">Apr 15</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
