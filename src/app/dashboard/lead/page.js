'use client';
import { useAuth } from '@/firebase/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NavBar from '@/components/NavBar';

export default function LeadDashboard() {
  const { currentUser, isLead, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || !isLead)) {
      router.push('/login/lead');
    }
  }, [currentUser, isLead, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-lg text-gray-500">
                Welcome, {currentUser?.displayName || 'Lead'}!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
