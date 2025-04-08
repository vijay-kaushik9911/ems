'use client';
import { useAuth } from '@/firebase/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmployeeDashboard() {
  const { currentUser, isEmployee, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || !isEmployee)) {
      router.push('/login/employee');
    }
  }, [currentUser, isEmployee, loading, router]);

  if (loading || (!currentUser || !isEmployee)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-lg text-gray-500">
                Welcome, {currentUser?.displayName || 'Employee'}!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
