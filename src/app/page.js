'use client';

import { Suspense } from "react"
import { DashboardSkeleton } from "./dashboard/comp/skeletons";
import { ErrorBoundary } from "@/app/dashboard/comp/error-boundary"
import Landing from '../components/Landing/page';

export default function Home() {
  return (
    <main className="flex-1">
      <ErrorBoundary fallback={<div className="p-4">Something went wrong with the dashboard</div>}>
        <Suspense fallback={<DashboardSkeleton />}>
          <Landing />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}