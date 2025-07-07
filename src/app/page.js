'use client';

import { Suspense } from "react"
import { DashboardSkeleton } from "./dashboard/comp/skeletons";
import { ErrorBoundary } from "@/app/dashboard/comp/error-boundary"
import Landing from '../components/Landing/page';
import "react-day-picker/dist/style.css";
import HomePage from "./login/page";


export default function Home() {
  return (
    <main className="flex-1">
      <ErrorBoundary fallback={<div className="p-4">Something went wrong with the dashboard</div>}>
        <Suspense fallback={<DashboardSkeleton />}>
          {/* <Landing /> */}
          <HomePage />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}