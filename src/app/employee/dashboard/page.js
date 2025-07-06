'use client';
import { useAuth } from '@/firebase/authContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { DashboardHeader } from '@/app/dashboard/comp/dashboard-header';
import { DashboardNav } from 'app/dashboard/comp/dashboard-nav';
import {
  Card, CardHeader, CardTitle,
  CardContent, CardDescription
} from '@/components/ui/card';
import { getTaskStatsForEmployee } from "@/app/employee/getTaskStats";
import TaskActivityChart from "@/app/employee/TaskActivityChart"
import UpcomingDeadlines from "@/app/employee/UpComingDeadlines"

export default function EmployeeDashboard() {
  const { currentUser, isEmployee, loading } = useAuth();
  const router = useRouter();

  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    assignedThisWeek: 0,
    completedThisWeek: 0,
    newInProgressThisWeek: 0,
    overdueThisWeek: 0,
  });

  useEffect(() => {
    if (!loading && (!currentUser || !isEmployee)) {
      router.push('/login/employee');
    }
  }, [currentUser, isEmployee, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getTaskStatsForEmployee(currentUser.uid);
      setTaskStats(stats);
    };
    if (currentUser?.uid) fetchStats();
  }, [currentUser]);

  if (loading || !currentUser || !isEmployee) return null;

  return (
    <div className="flex min-h-screen flex-col w-full">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<Card><CardContent>Loading Pending...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.assignedThisWeek} this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading In Progress...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.newInProgressThisWeek} in progress this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Completed...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.completed}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.completedThisWeek} completed this week</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Overdue...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.overdue}</div>
                  <p className="text-xs text-muted-foreground">+{taskStats.overdueThisWeek} overdue since this week</p>
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
                  <TaskActivityChart />
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
                  <UpcomingDeadlines />
                </CardContent>
              </Card>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
