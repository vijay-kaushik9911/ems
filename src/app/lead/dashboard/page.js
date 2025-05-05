'use client';
import { useAuth } from '../../../firebase/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { DashboardHeader } from '../../dashboard/comp/dashboard-header';
import { LeadSidebar } from '../../dashboard/comp/lead-sidebar';
import {
  Card, CardHeader, CardTitle,
  CardContent, CardDescription
} from '../../../components/ui/card';
import { Sidebar } from 'lucide-react';

export default function EmployeeDashboard() {
  const { currentUser, isLead, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || !isLead)) {
      router.push('/login/lead');
    }
  }, [currentUser, isLead, loading, router]);

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
                  <div className="text-2xl font-bold">35</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading In Progress...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">✅ Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">26</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Completed...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">⏳ Tasks In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>
            </Suspense>

            <Suspense fallback={<Card><CardContent>Loading Overdue...</CardContent></Card>}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">❗ Overdue Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">+201 since last hour</p>
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
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <span>Chart goes here (e.g., Line Chart for completed tasks)</span>
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
